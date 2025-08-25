import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post as HttpPost,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Post } from '@prisma/client';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { PaginationResult } from 'src/common/pagination';
import { PaginationArgs } from 'src/common/pagination/pagination.interface';
import { Role } from 'src/constants';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Forum / Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Listar publicaciones (público)' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Slug de la categoría para filtrar',
  })
  @ApiOkResponse({ description: 'Listado de publicaciones publicadas' })
  listPublic(@Query('category') categorySlug?: string) {
    return this.postsService.findAllPublic({ categorySlug });
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Obtener publicación por slug (público)' })
  @ApiOkResponse({ description: 'Publicación publicada' })
  getPublic(@Param('slug') slug: string) {
    return this.postsService.findBySlugPublic(slug);
  }

  // ========= ADMIN =========
  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Get all posts paginated (admin)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Paginated posts list' })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() pagination: PaginationArgs,
  ): Promise<PaginationResult<Post>> {
    return this.postsService.findAll(pagination);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HttpPost('admin')
  @ApiOperation({ summary: 'Crear publicación (admin)' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreatePostDto,
    description:
      'Datos para crear una publicación. contentHtml contiene el HTML del editor.',
  })
  @ApiCreatedResponse({ description: 'Publicación creada' })
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('admin/:id')
  @ApiOperation({ summary: 'Actualizar publicación (admin)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Publicación actualizada' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch('admin/:id')
  @ApiOperation({ summary: 'Actualizar publicación (admin)' })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdatePostDto,
    description: 'Datos parciales para actualizar una publicación',
  })
  @ApiOkResponse({ description: 'Publicación actualizada' })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Eliminar publicación (admin)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Publicación eliminada' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
