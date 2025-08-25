import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { Role } from 'src/constants';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Forum / Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ========= PÚBLICO =========
  @Get()
  @ApiOperation({ summary: 'Listar categorías (público)' })
  @ApiOkResponse({ description: 'Listado de categorías' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener categoría por slug (público)' })
  @ApiOkResponse({ description: 'Categoría encontrada (o null)' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  // ========= ADMIN =========
  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Crear categoría (admin)' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Datos para crear una categoría',
  })
  @ApiCreatedResponse({ description: 'Categoría creada' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar categoría (admin)' })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Datos parciales para actualizar una categoría',
  })
  @ApiOkResponse({ description: 'Categoría actualizada' })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar categoría (admin)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Categoría eliminada' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
