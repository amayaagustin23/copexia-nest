import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { PaginationArgs } from 'src/common/pagination/pagination.interface';
import { Role } from 'src/constants';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CategoriesService } from './categories.service';
import {
  CategoryResponseDto,
  CategoryWithPostsResponseDto,
  ErrorResponseDto,
  PaginatedCategoriesResponseDto,
  SuccessResponseDto,
} from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categorías Admin')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@HasRoles(Role.ADMIN)
@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada correctamente',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o slug duplicado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
    type: ErrorResponseDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías (paginado)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías paginada',
    type: PaginatedCategoriesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
    type: ErrorResponseDto,
  })
  findAll(@Query() pagination: PaginationArgs) {
    return this.categoriesService.findAllAdmin(pagination);
  }
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener categoría por slug' })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
    type: CategoryWithPostsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
    type: ErrorResponseDto,
  })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
    type: CategoryWithPostsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
    type: ErrorResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o slug duplicado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
    type: ErrorResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar categoría con posts',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
    type: ErrorResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
