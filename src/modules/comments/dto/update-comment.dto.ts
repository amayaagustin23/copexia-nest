import { ApiProperty } from '@nestjs/swagger';
import { CommentStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Excelente artículo, muy informativo.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Nombre del autor del comentario',
    example: 'Juan Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiProperty({
    description: 'Email del autor del comentario',
    example: 'juan@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  authorEmail?: string;

  @ApiProperty({
    description: 'Website del autor del comentario',
    example: 'https://juanperez.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  authorWebsite?: string;

  @ApiProperty({
    description: 'Estado del comentario',
    enum: CommentStatus,
    example: CommentStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}
