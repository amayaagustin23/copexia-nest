import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Slug único para la URL',
    example: 'tecnologia',
  })
  slug: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Artículos sobre tecnología, programación y desarrollo',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Color hexadecimal de la categoría',
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

  @ApiProperty({
    description: 'Estado de la categoría',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Orden de clasificación',
    example: 1,
  })
  sortOrder: number;

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
}

export class CategoryWithPostsResponseDto extends CategoryResponseDto {
  @ApiProperty({
    description: 'Posts asociados a la categoría',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        title: { type: 'string', example: 'Introducción a NestJS' },
        slug: { type: 'string', example: 'introduccion-a-nestjs' },
        status: { type: 'string', example: 'PUBLISHED' },
        publishedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      },
    },
  })
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt: Date | null;
  }>;
}

export class CategoryStatsResponseDto {
  @ApiProperty({
    description: 'Total de categorías',
    example: 10,
  })
  totalCategories: number;

  @ApiProperty({
    description: 'Categorías activas',
    example: 8,
  })
  activeCategories: number;

  @ApiProperty({
    description: 'Categorías inactivas',
    example: 2,
  })
  inactiveCategories: number;

  @ApiProperty({
    description: 'Categorías que tienen posts asociados',
    example: 6,
  })
  categoriesWithPosts: number;

  @ApiProperty({
    description: 'Categorías sin posts asociados',
    example: 4,
  })
  categoriesWithoutPosts: number;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Ya existe una categoría con este slug',
  })
  message: string;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request',
  })
  error: string;
}

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'Categoría eliminada correctamente',
  })
  message: string;
}
