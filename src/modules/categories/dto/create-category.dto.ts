import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsHexColor, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Tecnología',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Slug único para la URL (formato: palabras-separadas-por-guiones)',
    example: 'tecnologia',
    pattern: '^[a-z0-9-]+$',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Descripción detallada de la categoría',
    example: 'Artículos sobre tecnología, programación y desarrollo de software',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Color hexadecimal de la categoría para la interfaz',
    example: '#3b82f6',
    pattern: '^#[0-9A-Fa-f]{6}$',
    required: false,
  })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({
    description: 'Icono emoji para representar la categoría',
    example: '💻',
    required: false,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  icon?: string;

  @ApiProperty({
    description: 'Estado de la categoría (activa/inactiva)',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Orden de clasificación para mostrar las categorías',
    example: 1,
    minimum: 0,
    maximum: 999,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
