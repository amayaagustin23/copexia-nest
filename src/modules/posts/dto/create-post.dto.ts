import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PostStatusDto {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty() // HTML del editor
  contentHtml: string;

  @IsEnum(PostStatusDto)
  @IsOptional()
  status?: PostStatusDto;

  @IsString()
  @IsNotEmpty()
  categoryId: string; // o pasá categorySlug si preferís
}
