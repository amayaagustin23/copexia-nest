import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Excelente artículo! NestJS realmente simplifica mucho el desarrollo backend.',
    minLength: 5,
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'Nombre del autor del comentario',
    example: 'Carlos Mendoza',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string;

  @ApiProperty({
    description: 'Email del autor del comentario',
    example: 'carlos.mendoza@email.com',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  authorEmail?: string;

  @ApiProperty({
    description: 'Website del autor del comentario',
    example: 'https://carlosdev.com',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  authorWebsite?: string;

  @ApiProperty({
    description: 'ID del comentario padre para crear una respuesta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;
}