import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Título del post',
    example: 'Introducción a NestJS: El Framework de Node.js',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Contenido del post en formato markdown',
    example:
      '# Introducción a NestJS\n\nNestJS es un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.',
    minLength: 10,
  })
  @IsString()
  content: string;

  @ApiProperty({
    description:
      'Resumen del post (se genera automáticamente si no se proporciona)',
    example:
      'Aprende los fundamentos de NestJS, el framework de Node.js que está revolucionando el desarrollo backend.',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({
    description: 'URL de la imagen destacada del post',
    example: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    required: false,
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({
    description: 'Estado del post',
    example: 'PUBLISHED',
    enum: PostStatus,
    default: PostStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({
    description: 'Si el post debe aparecer fijado en la lista',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiProperty({
    description: 'IDs de las categorías a las que pertenece el post',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '456e7890-e89b-12d3-a456-426614174001',
    ],
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
