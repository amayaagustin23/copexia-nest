import { ApiProperty } from '@nestjs/swagger';
import { CommentStatus } from '@prisma/client';

export class CommentResponseDto {
  @ApiProperty({
    description: 'ID del comentario',
    example: 'uuid-del-comentario',
  })
  id: string;

  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Excelente artículo, muy informativo.',
  })
  content: string;

  @ApiProperty({
    description: 'Nombre del autor del comentario',
    example: 'Juan Pérez',
  })
  authorName: string;

  @ApiProperty({
    description: 'Email del autor del comentario',
    example: 'juan@example.com',
    required: false,
  })
  authorEmail?: string;

  @ApiProperty({
    description: 'Website del autor del comentario',
    example: 'https://juanperez.com',
    required: false,
  })
  authorWebsite?: string;

  @ApiProperty({
    description: 'Estado del comentario',
    enum: CommentStatus,
    example: CommentStatus.ACTIVE,
  })
  status: CommentStatus;

  @ApiProperty({
    description: 'ID del comentario padre (para respuestas)',
    example: 'uuid-del-comentario-padre',
    required: false,
  })
  parentId?: string;

  @ApiProperty({
    description: 'ID del post al que pertenece el comentario',
    example: 'uuid-del-post',
  })
  postId: string;

  @ApiProperty({
    description: 'Fecha de creación del comentario',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del comentario',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Comentarios de respuesta',
    type: [CommentResponseDto],
    required: false,
  })
  replies?: CommentResponseDto[];
}

export class CommentListResponseDto {
  @ApiProperty({
    description: 'Lista de comentarios',
    type: [CommentResponseDto],
  })
  data: CommentResponseDto[];

  @ApiProperty({
    description: 'Total de comentarios',
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

  @ApiProperty({
    description: 'Estadísticas de comentarios',
    example: {
      total: 25,
      approved: 20,
      pending: 3,
      rejected: 2,
      deleted: 0,
    },
  })
  stats?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    deleted: number;
  };
}

export class CommentStatsDto {
  @ApiProperty({
    description: 'Total de comentarios',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Comentarios aprobados',
    example: 20,
  })
  approved: number;

  @ApiProperty({
    description: 'Comentarios pendientes',
    example: 3,
  })
  pending: number;

  @ApiProperty({
    description: 'Comentarios rechazados',
    example: 2,
  })
  rejected: number;

  @ApiProperty({
    description: 'Comentarios eliminados',
    example: 0,
  })
  deleted: number;
}
