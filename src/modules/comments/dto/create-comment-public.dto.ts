import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentPublicDto {
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
    description: 'ID del comentario padre (para respuestas)',
    example: 'uuid-del-comentario-padre',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    description: 'ID del post (se ignora, se usa el de la URL)',
    example: 'uuid-del-post',
    required: false,
  })
  @Allow()
  postId?: string;
}
