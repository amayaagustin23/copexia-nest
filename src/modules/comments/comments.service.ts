import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentStatus } from '@prisma/client';
import { paginatePrisma } from '../../common/pagination';
import { PaginationArgs } from '../../common/pagination/pagination.interface';
import { MessagingService } from '../../services/messaging/messaging.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messagingService: MessagingService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    if (createCommentDto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Comentario padre no encontrado');
      }

      if (parentComment.postId !== createCommentDto.postId) {
        throw new BadRequestException(
          'El comentario padre debe pertenecer al mismo post',
        );
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        authorName: createCommentDto.authorName,
        authorEmail: createCommentDto.authorEmail || null,
        authorWebsite: createCommentDto.authorWebsite || null,
        postId: createCommentDto.postId,
        status: CommentStatus.APPROVED,
        parentId: createCommentDto.parentId || null,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parent: {
          select: {
            id: true,
            authorName: true,
          },
        },
        replies: {
          where: { status: CommentStatus.APPROVED },
          select: {
            id: true,
            content: true,
            authorName: true,
            authorEmail: true,
            authorWebsite: true,
            status: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Enviar notificación por email al admin
    try {
      await this.messagingService.sendCommentNotification({
        postTitle: comment.post.title,
        slug: comment.post.slug,
        commentAuthor: comment.authorName,
        commentContent: comment.content,
      });
    } catch (error) {
      // Log del error pero no fallar la creación del comentario
      console.error('Error sending email notification:', error);
    }

    return comment;
  }

  async findAllAdmin(pagination: PaginationArgs) {
    const where: any = {
      ...(pagination.search && {
        OR: [
          { content: { contains: pagination.search, mode: 'insensitive' } },
          { authorName: { contains: pagination.search, mode: 'insensitive' } },
          { authorEmail: { contains: pagination.search, mode: 'insensitive' } },
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
        ? { updatedAt: 'desc' }
        : { createdAt: 'desc' };

    const result = await paginatePrisma(
      this.prisma.comment,
      {
        where,
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          parent: {
            select: {
              id: true,
              authorName: true,
            },
          },
          replies: {
            select: {
              id: true,
              content: true,
              authorName: true,
              authorEmail: true,
              authorWebsite: true,
              status: true,
              parentId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy,
      },
      pagination,
    );

    // Calcular estadísticas
    const totalComments = await this.prisma.comment.count();
    const approvedComments = await this.prisma.comment.count({
      where: { status: CommentStatus.APPROVED },
    });
    const pendingComments = await this.prisma.comment.count({
      where: { status: CommentStatus.PENDING },
    });
    const rejectedComments = await this.prisma.comment.count({
      where: { status: CommentStatus.REJECTED },
    });
    const deletedComments = await this.prisma.comment.count({
      where: { status: CommentStatus.DELETED },
    });

    const stats = {
      total: totalComments,
      approved: approvedComments,
      pending: pendingComments,
      rejected: rejectedComments,
      deleted: deletedComments,
    };

    return {
      ...result,
      stats,
    };
  }

  async findAllByPost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
        status: CommentStatus.APPROVED,
        parentId: null,
      },
      include: {
        replies: {
          where: { status: CommentStatus.APPROVED },
          select: {
            id: true,
            content: true,
            authorName: true,
            authorEmail: true,
            authorWebsite: true,
            status: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return comments;
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parent: {
          select: {
            id: true,
            authorName: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            authorName: true,
            authorEmail: true,
            authorWebsite: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parent: {
          select: {
            id: true,
            authorName: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            authorName: true,
            authorEmail: true,
            authorWebsite: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return updatedComment;
  }

  async updateStatus(id: string, status: CommentStatus) {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { status },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parent: {
          select: {
            id: true,
            authorName: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            authorName: true,
            authorEmail: true,
            authorWebsite: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return updatedComment;
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        replies: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Si tiene respuestas, marcarlo como eliminado en lugar de borrarlo
    if (comment.replies.length > 0) {
      await this.prisma.comment.update({
        where: { id },
        data: { status: CommentStatus.DELETED },
      });

      return { message: 'Comentario marcado como eliminado' };
    }

    // Si no tiene respuestas, eliminarlo completamente
    await this.prisma.comment.delete({
      where: { id },
    });

    return { message: 'Comentario eliminado correctamente' };
  }

  async getStats() {
    const totalComments = await this.prisma.comment.count();
    const approvedComments = await this.prisma.comment.count({
      where: { status: CommentStatus.APPROVED },
    });
    const pendingComments = await this.prisma.comment.count({
      where: { status: CommentStatus.PENDING },
    });
    const rejectedComments = await this.prisma.comment.count({
      where: { status: CommentStatus.REJECTED },
    });
    const deletedComments = await this.prisma.comment.count({
      where: { status: CommentStatus.DELETED },
    });

    return {
      total: totalComments,
      approved: approvedComments,
      pending: pendingComments,
      rejected: rejectedComments,
      deleted: deletedComments,
    };
  }
}
