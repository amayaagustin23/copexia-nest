import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { paginatePrisma } from '../../common/pagination';
import { PaginationArgs } from '../../common/pagination/pagination.interface';
import { PrismaService } from '../../services/prisma/prisma.service';
import { generateSlug } from '../../utils/slug.utils';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

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
    const slugs = existingSlugs.map(post => post.slug);

    // Generar slug único basado en el título
    const slug = generateSlug(postData.title, slugs);

    // Crear el post
    const post = await this.prisma.post.create({
      data: {
        ...postData,
        slug,
        authorId,
        publishedAt: postData.status === PostStatus.PUBLISHED ? new Date() : null,
      },
    });

    // Asignar categorías
    await this.prisma.postCategory.createMany({
      data: categoryIds.map(categoryId => ({
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
      ...(pagination.startDate && pagination.endDate && {
        publishedAt: {
          gte: pagination.startDate,
          lte: pagination.endDate,
        },
      }),
    };

    const orderBy: any = pagination.orderBy === 'updatedAt' 
      ? [{ isPinned: 'desc' }, { updatedAt: 'desc' }]
      : [{ isPinned: 'desc' }, { publishedAt: 'desc' }];

    return paginatePrisma(
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
            where: { status: 'APPROVED' },
            include: {
              replies: {
                where: { status: 'APPROVED' },
              },
            },
          },
        },
        orderBy,
      },
      pagination,
    );
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
      ...(pagination.startDate && pagination.endDate && {
        createdAt: {
          gte: pagination.startDate,
          lte: pagination.endDate,
        },
      }),
    };

    const orderBy: any = pagination.orderBy === 'updatedAt' 
      ? [{ isPinned: 'desc' }, { updatedAt: 'desc' }]
      : [{ isPinned: 'desc' }, { createdAt: 'desc' }];

    return paginatePrisma(
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
              replies: true,
            },
          },
        },
        orderBy,
      },
      pagination,
    );
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
          where: { status: 'APPROVED' },
          include: {
            replies: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    return post;
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
        comments: {
          where: { status: 'APPROVED' },
          include: {
            replies: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
    });

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Post no encontrado');
    }

    // Incrementar contador de vistas
    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return { ...post, viewCount: post.viewCount + 1 };
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
        data: categoryIds.map(categoryId => ({
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
      const slugs = existingSlugs.map(post => post.slug);
      slug = generateSlug(postData.title, slugs);
    }

    // Actualizar el post
    await this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        slug,
        publishedAt: postData.status === PostStatus.PUBLISHED && !existingPost.publishedAt 
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
        likeCount: post.likeCount > 0 ? { decrement: 1 } : 0 
      },
    });

    return { likeCount: updatedPost.likeCount };
  }

  async createComment(postId: string, createCommentDto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Post no encontrado');
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (createCommentDto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment || parentComment.postId !== postId) {
        throw new BadRequestException('Comentario padre no válido');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        authorName: createCommentDto.authorName,
        authorEmail: createCommentDto.authorEmail,
        authorWebsite: createCommentDto.authorWebsite,
        ...(createCommentDto.parentId && {
          parent: {
            connect: { id: createCommentDto.parentId }
          }
        }),
        post: {
          connect: { id: postId }
        }
      },
    });

    // Incrementar contador de comentarios
    await this.prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  async getComments(postId: string) {
    return this.prisma.comment.findMany({
      where: { 
        postId,
        status: 'APPROVED',
        parentId: null, // Solo comentarios principales
      },
      include: {
        replies: {
          where: { status: 'APPROVED' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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
      this.prisma.post.aggregate({
        _sum: { commentCount: true },
      }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      pinnedPosts,
      totalViews: totalViews._sum.viewCount || 0,
      totalLikes: totalLikes._sum.likeCount || 0,
      totalComments: totalComments._sum.commentCount || 0,
    };
  }
}