import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';

export class AuthorResponseDto {
  @ApiProperty({
    description: 'ID único del autor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del autor',
    example: 'Admin Copexia',
  })
  name: string;

  @ApiProperty({
    description: 'Email del autor',
    example: 'admin@copexia.com',
  })
  email: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Tecnología',
  })
  name: string;

  @ApiProperty({
    description: 'Slug de la categoría',
    example: 'tecnologia',
  })
  slug: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Artículos sobre tecnología',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Color de la categoría',
    example: '#3b82f6',
    nullable: true,
  })
  color: string | null;

  @ApiProperty({
    description: 'Icono de la categoría',
    example: '💻',
    nullable: true,
  })
  icon: string | null;
}

export class CommentResponseDto {
  @ApiProperty({
    description: 'ID único del comentario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Excelente artículo! Muy útil la información.',
  })
  content: string;

  @ApiProperty({
    description: 'Nombre del autor del comentario',
    example: 'Carlos Mendoza',
  })
  authorName: string;

  @ApiProperty({
    description: 'Email del autor del comentario',
    example: 'carlos@email.com',
    nullable: true,
  })
  authorEmail: string | null;

  @ApiProperty({
    description: 'Website del autor del comentario',
    example: 'https://carlosdev.com',
    nullable: true,
  })
  authorWebsite: string | null;

  @ApiProperty({
    description: 'Estado del comentario',
    example: 'APPROVED',
    enum: ['APPROVED', 'PENDING', 'REJECTED', 'DELETED'],
  })
  status: string;

  @ApiProperty({
    description: 'ID del comentario padre (para respuestas)',
    example: '456e7890-e89b-12d3-a456-426614174001',
    nullable: true,
  })
  parentId: string | null;

  @ApiProperty({
    description: 'Fecha de creación del comentario',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Respuestas al comentario',
    type: [CommentResponseDto],
    required: false,
  })
  replies?: CommentResponseDto[];
}

export class PostResponseDto {
  @ApiProperty({
    description: 'ID único del post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Título del post',
    example: 'Introducción a NestJS: El Framework de Node.js',
  })
  title: string;

  @ApiProperty({
    description: 'Slug único para la URL',
    example: 'introduccion-a-nestjs',
  })
  slug: string;

  @ApiProperty({
    description: 'Contenido del post en markdown',
    example: '# Introducción a NestJS\n\nNestJS es un framework...',
  })
  content: string;

  @ApiProperty({
    description: 'Resumen del post',
    example: 'Aprende los fundamentos de NestJS...',
    nullable: true,
  })
  excerpt: string | null;

  @ApiProperty({
    description: 'URL de la imagen destacada',
    example: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    nullable: true,
  })
  featuredImage: string | null;

  @ApiProperty({
    description: 'Estado del post',
    example: 'PUBLISHED',
    enum: PostStatus,
  })
  status: PostStatus;

  @ApiProperty({
    description: 'Si el post está fijado',
    example: true,
  })
  isPinned: boolean;

  @ApiProperty({
    description: 'Número de vistas del post',
    example: 1250,
  })
  viewCount: number;

  @ApiProperty({
    description: 'Número de likes del post',
    example: 89,
  })
  likeCount: number;

  @ApiProperty({
    description: 'Número de comentarios del post',
    example: 12,
  })
  commentCount: number;

  @ApiProperty({
    description: 'Fecha de publicación',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  publishedAt: Date | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Autor del post',
    type: AuthorResponseDto,
  })
  author: AuthorResponseDto;

  @ApiProperty({
    description: 'Categorías del post',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: {
          type: 'object',
          $ref: '#/components/schemas/CategoryResponseDto'
        }
      }
    },
  })
  categories: Array<{ category: CategoryResponseDto }>;

  @ApiProperty({
    description: 'Comentarios del post',
    type: [CommentResponseDto],
    required: false,
  })
  comments?: CommentResponseDto[];
}

export class PostListResponseDto {
  @ApiProperty({
    description: 'ID único del post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Título del post',
    example: 'Introducción a NestJS: El Framework de Node.js',
  })
  title: string;

  @ApiProperty({
    description: 'Slug único para la URL',
    example: 'introduccion-a-nestjs',
  })
  slug: string;

  @ApiProperty({
    description: 'Resumen del post',
    example: 'Aprende los fundamentos de NestJS...',
    nullable: true,
  })
  excerpt: string | null;

  @ApiProperty({
    description: 'URL de la imagen destacada',
    example: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    nullable: true,
  })
  featuredImage: string | null;

  @ApiProperty({
    description: 'Estado del post',
    example: 'PUBLISHED',
    enum: PostStatus,
  })
  status: PostStatus;

  @ApiProperty({
    description: 'Si el post está fijado',
    example: true,
  })
  isPinned: boolean;

  @ApiProperty({
    description: 'Número de vistas del post',
    example: 1250,
  })
  viewCount: number;

  @ApiProperty({
    description: 'Número de likes del post',
    example: 89,
  })
  likeCount: number;

  @ApiProperty({
    description: 'Número de comentarios del post',
    example: 12,
  })
  commentCount: number;

  @ApiProperty({
    description: 'Fecha de publicación',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  publishedAt: Date | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Autor del post',
    type: AuthorResponseDto,
  })
  author: AuthorResponseDto;

  @ApiProperty({
    description: 'Categorías del post',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: {
          type: 'object',
          $ref: '#/components/schemas/CategoryResponseDto'
        }
      }
    },
  })
  categories: Array<{ category: CategoryResponseDto }>;
}

export class LikeResponseDto {
  @ApiProperty({
    description: 'Número actual de likes del post',
    example: 90,
  })
  likeCount: number;
}

export class PostStatsResponseDto {
  @ApiProperty({
    description: 'Total de posts',
    example: 25,
  })
  totalPosts: number;

  @ApiProperty({
    description: 'Posts publicados',
    example: 20,
  })
  publishedPosts: number;

  @ApiProperty({
    description: 'Posts en borrador',
    example: 3,
  })
  draftPosts: number;

  @ApiProperty({
    description: 'Posts archivados',
    example: 2,
  })
  archivedPosts: number;

  @ApiProperty({
    description: 'Posts fijados',
    example: 1,
  })
  pinnedPosts: number;

  @ApiProperty({
    description: 'Total de vistas',
    example: 15420,
  })
  totalViews: number;

  @ApiProperty({
    description: 'Total de likes',
    example: 456,
  })
  totalLikes: number;

  @ApiProperty({
    description: 'Total de comentarios',
    example: 89,
  })
  totalComments: number;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Una o más categorías no existen',
  })
  message: string;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request',
  })
  error: string;
}

export class PaginatedPostListResponseDto {
  @ApiProperty({
    description: 'Lista de posts',
    type: [PostListResponseDto],
  })
  data: PostListResponseDto[];

  @ApiProperty({
    description: 'Total de posts',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
  })
  size: number;
}

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'Post eliminado correctamente',
  })
  message: string;
}
