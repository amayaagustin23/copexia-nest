import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Excelente artículo, muy informativo.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Nombre del autor del comentario',
    example: 'Juan Pérez',
  })
  @IsNotEmpty()
  @IsString()
  authorName: string;

  @ApiProperty({
    description: 'Email del autor del comentario',
    example: 'juan@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorEmail?: string;

  @ApiProperty({
    description: 'Website del autor del comentario',
    example: 'https://juanperez.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorWebsite?: string;

  @ApiProperty({
    description: 'ID del post al que pertenece el comentario',
    example: 'uuid-del-post',
  })
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty({
    description: 'ID del comentario padre (para respuestas)',
    example: 'uuid-del-comentario-padre',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}
