import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentStatus, PostStatus } from '@prisma/client';
import { paginatePrisma } from '../../common/pagination';
import { PaginationArgs } from '../../common/pagination/pagination.interface';
import { MessagingService } from '../../services/messaging/messaging.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { generateSlug } from '../../utils/slug.utils';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messagingService: MessagingService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const { categoryIds, ...postData } = createPostDto;

    // Verificar que las categorías existen
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('Una o más categorías no existen');
    }

    // Obtener slugs existentes para generar uno único
    const existingSlugs = await this.prisma.post.findMany({
      select: { slug: true },
    });
    const slugs = existingSlugs.map((post) => post.slug);

    // Generar slug único basado en el título
    const slug = generateSlug(postData.title, slugs);

    // Crear el post
    const post = await this.prisma.post.create({
      data: {
        ...postData,
        slug,
        authorId,
        publishedAt:
          postData.status === PostStatus.PUBLISHED ? new Date() : null,
      },
    });

    // Asignar categorías
    await this.prisma.postCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        postId: post.id,
        categoryId,
      })),
    });

    return this.findOne(post.id);
  }

  async findAllPublic(pagination: PaginationArgs) {
    const where: any = {
      status: PostStatus.PUBLISHED,
      ...(pagination.search && {
        OR: [
          { title: { contains: pagination.search, mode: 'insensitive' } },
          { content: { contains: pagination.search, mode: 'insensitive' } },
          { excerpt: { contains: pagination.search, mode: 'insensitive' } },
        ],
      }),
      ...(pagination.startDate &&
        pagination.endDate && {
          publishedAt: {
            gte: pagination.startDate,
            lte: pagination.endDate,
          },
        }),
    };

    try {
      const debugCount = await this.prisma.post.count({ where });
      console.log('Direct count result:', debugCount);
    } catch (error) {
      console.error('Direct count error:', error);
    }

    const orderBy: any =
      pagination.orderBy === 'updatedAt'
        ? [{ isPinned: 'desc' }, { updatedAt: 'desc' }]
        : [{ isPinned: 'desc' }, { publishedAt: 'desc' }];

    const result = await paginatePrisma(
      this.prisma.post,
      {
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          categories: {
            include: { category: true },
          },
          comments: {
            where: { status: CommentStatus.ACTIVE },
            include: {
              replies: {
                where: { status: CommentStatus.ACTIVE },
              },
            },
          },
        },
        orderBy,
      },
      pagination,
    );

    // Calcular commentCount dinámicamente
    const postsWithCommentCount = result.data.map((post: any) => ({
      ...post,
      commentCount: post.comments.reduce(
        (total: number, comment: any) => total + 1 + comment.replies.length,
        0,
      ),
    }));

    return {
      ...result,
      data: postsWithCommentCount,
    };
  }

  async findAllAdmin(pagination: PaginationArgs) {
    const where: any = {
      ...(pagination.search && {
        OR: [
          { title: { contains: pagination.search, mode: 'insensitive' } },
          { content: { contains: pagination.search, mode: 'insensitive' } },
          { excerpt: { contains: pagination.search, mode: 'insensitive' } },
        ],
      }),
      ...(pagination.startDate &&
        pagination.endDate && {
          createdAt: {
            gte: pagination.startDate,
            lte: pagination.endDate,
          },
        }),
    };

    const orderBy: any =
      pagination.orderBy === 'updatedAt'
        ? [{ isPinned: 'desc' }, { updatedAt: 'desc' }]
        : [{ isPinned: 'desc' }, { createdAt: 'desc' }];

    const result = await paginatePrisma(
      this.prisma.post,
      {
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          categories: {
            include: { category: true },
          },
          comments: {
            include: {
              replies: {
                where: { status: CommentStatus.ACTIVE },
              },
            },
          },
        },
        orderBy,
      },
      pagination,
    );

    // Calcular commentCount dinámicamente (incluye todos los comentarios para admin)
    const postsWithCommentCount = result.data.map((post: any) => ({
      ...post,
      commentCount: post.comments.reduce(
        (total: number, comment: any) => total + 1 + comment.replies.length,
        0,
      ),
    }));

    return {
      ...result,
      data: postsWithCommentCount,
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        categories: {
          include: { category: true },
        },
        comments: {
          where: { status: CommentStatus.ACTIVE },
          include: {
            replies: {
              where: { status: CommentStatus.ACTIVE },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    // Calcular commentCount dinámicamente
    const commentCount = (post as any).comments.reduce(
      (total: number, comment: any) => total + 1 + comment.replies.length,
      0,
    );

    return {
      ...post,
      commentCount,
    };
  }

  async findOnePublic(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        categories: {
          include: { category: true },
        },
      },
    });

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Post no encontrado');
    }

    const commentCount = await this.prisma.comment.count({
      where: {
        postId: post.id,
        status: CommentStatus.ACTIVE,
        parentId: null,
      },
    });

    // Incrementar contador de vistas
    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      ...post,
      viewCount: post.viewCount + 1,
      commentCount,
    };
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { categoryIds, ...postData } = updatePostDto;

    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException('Post no encontrado');
    }

    // Si se proporcionan nuevas categorías, actualizarlas
    if (categoryIds) {
      // Verificar que las categorías existen
      const categories = await this.prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });

      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('Una o más categorías no existen');
      }

      // Eliminar categorías existentes
      await this.prisma.postCategory.deleteMany({
        where: { postId: id },
      });

      // Agregar nuevas categorías
      await this.prisma.postCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          postId: id,
          categoryId,
        })),
      });
    }

    // Si se actualiza el título, regenerar el slug
    let slug = existingPost.slug;
    if (postData.title && postData.title !== existingPost.title) {
      const existingSlugs = await this.prisma.post.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      });
      const slugs = existingSlugs.map((post) => post.slug);
      slug = generateSlug(postData.title, slugs);
    }

    // Actualizar el post
    await this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        slug,
        publishedAt:
          postData.status === PostStatus.PUBLISHED && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post eliminado correctamente' };
  }

  async likePost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Post no encontrado');
    }

    // Simplemente incrementar el contador de likes
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });

    return { likeCount: updatedPost.likeCount };
  }

  async unlikePost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Post no encontrado');
    }

    // Decrementar el contador de likes (mínimo 0)
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: post.likeCount > 0 ? { decrement: 1 } : 0,
      },
    });

    return { likeCount: updatedPost.likeCount };
  }

  async incrementView(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Post no encontrado');
    }

    // Incrementar el contador de visualizaciones
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });

    // Verificar si se alcanzó un hito de visualizaciones
    await this.checkViewMilestones(updatedPost);

    return { viewCount: updatedPost.viewCount };
  }

  private async checkViewMilestones(post: any) {
    const viewCount = post.viewCount;

    // Verificar si es un múltiplo de 100 o 1000
    const isHundredMilestone = viewCount > 0 && viewCount % 100 === 0;
    const isThousandMilestone = viewCount > 0 && viewCount % 1000 === 0;

    if (isHundredMilestone || isThousandMilestone) {
      try {
        await this.messagingService.sendViewMilestoneNotification(
          post.title,
          post.slug,
          viewCount,
        );
      } catch (error) {
        console.error(
          'Error enviando notificación de hito de visualizaciones:',
          error,
        );
        // No lanzar error para no interrumpir el flujo principal
      }
    }
  }

  // Método para probar notificaciones de visualizaciones
  async testViewMilestoneNotifications() {
    try {
      const results = {
        hundredMilestone: false,
        thousandMilestone: false,
      };

      // 1. Probar notificación de 100 visualizaciones
      await this.messagingService.sendViewMilestoneNotification(
        'Post de Prueba - 100 Visualizaciones',
        'test-post-100-views',
        100,
      );
      results.hundredMilestone = true;

      // 2. Probar notificación de 1000 visualizaciones
      await this.messagingService.sendViewMilestoneNotification(
        'Post de Prueba - 1000 Visualizaciones',
        'test-post-1000-views',
        1000,
      );
      results.thousandMilestone = true;

      return {
        success: true,
        message: 'Notificaciones de visualizaciones enviadas',
        results,
        sentTo: 'atomix18@gmail.com',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al enviar notificaciones de visualizaciones',
        error: error.message,
      };
    }
  }

  // Método para simular visualizaciones hasta el próximo hito
  async simulateViewsToMilestone(postId: string) {
    try {
      // Obtener el post actual para ver cuántas visualizaciones tiene
      const currentPost = await this.findOne(postId);
      const currentViews = currentPost.viewCount;

      // Calcular cuántas visualizaciones necesitamos para llegar al próximo hito
      const nextHundred = Math.ceil((currentViews + 1) / 100) * 100;
      const viewsNeeded = nextHundred - currentViews;

      // Simular las visualizaciones necesarias
      const results = [];
      for (let i = 0; i < viewsNeeded; i++) {
        const result = await this.incrementView(postId);
        results.push(result);
      }

      return {
        success: true,
        message: `Simuladas ${viewsNeeded} visualizaciones para llegar a ${nextHundred} visualizaciones`,
        currentViews: currentViews,
        targetViews: nextHundred,
        results: results[results.length - 1], // Último resultado
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al simular visualizaciones',
        error: error.message,
      };
    }
  }

  async getStats() {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      pinnedPosts,
      totalViews,
      totalLikes,
      totalComments,
      totalCategories,
    ] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      this.prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      this.prisma.post.count({ where: { status: PostStatus.ARCHIVED } }),
      this.prisma.post.count({ where: { isPinned: true } }),
      this.prisma.post.aggregate({
        _sum: { viewCount: true },
      }),
      this.prisma.post.aggregate({
        _sum: { likeCount: true },
      }),
      this.prisma.comment.count(), // Contar comentarios directamente desde la tabla
      this.prisma.category.count(),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      pinnedPosts,
      totalViews: totalViews._sum.viewCount || 0,
      totalLikes: totalLikes._sum.likeCount || 0,
      totalComments,
      totalCategories,
    };
  }

  async getDashboard() {
    const stats = await this.getStats();

    // 1. Fetch Candidates for Top Interactive: Top Liked
    const topLiked = await this.prisma.post.findMany({
      take: 20,
      orderBy: { likeCount: 'desc' },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: { include: { category: true } },
        comments: {
          where: { status: CommentStatus.ACTIVE },
          include: { replies: { where: { status: CommentStatus.ACTIVE } } },
        },
      },
    });

    // 2. Fetch Candidates: Top Commented
    const topCommented = await this.prisma.post.findMany({
      take: 20,
      orderBy: { comments: { _count: 'desc' } },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: { include: { category: true } },
        comments: {
          where: { status: CommentStatus.ACTIVE },
          include: { replies: { where: { status: CommentStatus.ACTIVE } } },
        },
      },
    });

    // 3. Merge and Sort
    const mergedPosts = [...topLiked, ...topCommented];
    const uniquePostsMap = new Map();

    mergedPosts.forEach((post) => {
      if (!uniquePostsMap.has(post.id)) {
        uniquePostsMap.set(post.id, post);
      }
    });

    const topInteractivePosts = Array.from(uniquePostsMap.values())
      .map((post: any) => {
        const commentCount = post.comments.reduce(
          (acc: number, comment: any) =>
            acc + 1 + (comment.replies?.length || 0),
          0,
        );
        return {
          ...post,
          interactionScore: post.likeCount + commentCount,
          commentCount,
        };
      })
      .sort((a, b) => b.interactionScore - a.interactionScore)
      .slice(0, 5);

    // Other Dashboard Data
    const [topPosts, categories, recentComments, monthlyStats] =
      await Promise.all([
        this.prisma.post.findMany({
          take: 5,
          orderBy: { viewCount: 'desc' },
          include: {
            author: { select: { id: true, name: true, email: true } },
            categories: { include: { category: true } },
            comments: {
              where: { status: CommentStatus.ACTIVE },
              include: {
                replies: { where: { status: CommentStatus.ACTIVE } },
              },
            },
          },
        }),
        this.prisma.category.findMany({
          include: { _count: { select: { posts: true } } },
          orderBy: { sortOrder: 'asc' },
        }),
        this.prisma.comment.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { post: { select: { id: true, title: true, slug: true } } },
        }),
        this.getMonthlyStats(),
      ]);

    const topPostsWithCount = topPosts.map((post: any) => ({
      ...post,
      commentCount: post.comments.reduce(
        (total: number, comment: any) =>
          total + 1 + (comment.replies?.length || 0),
        0,
      ),
    }));

    return {
      stats,
      recentPosts: topInteractivePosts,
      topPosts: topPostsWithCount,
      categories,
      recentComments,
      monthlyStats,
    };
  }

  private async getMonthlyStats() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await this.prisma.post.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    const monthlyStatsRaw = monthlyData.reduce((acc: any, item: any) => {
      const monthYear = item.createdAt.toISOString().substring(0, 7);
      acc[monthYear] = (acc[monthYear] || 0) + item._count.id;
      return acc;
    }, {});

    return Object.entries(monthlyStatsRaw)
      .map(([month, count]) => ({
        month,
        count,
        label: new Date(month + '-01').toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
        }),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
