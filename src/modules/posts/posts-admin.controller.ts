import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { PaginationArgs } from 'src/common/pagination/pagination.interface';
import { Role } from 'src/constants';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePostDto } from './dto/create-post.dto';
import {
	ErrorResponseDto,
	PaginatedPostListResponseDto,
	PostResponseDto,
	PostStatsResponseDto,
	SuccessResponseDto
} from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts Admin')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@HasRoles(Role.ADMIN)
@Controller('admin/posts')
export class PostsAdminController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo post' })
  @ApiResponse({ status: 201, description: 'Post creado correctamente', type: PostResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o categorías no existen', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Acceso denegado', type: ErrorResponseDto })
  create(@Body() createPostDto: CreatePostDto, @GetCurrentUser('userId') userId: string) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los posts (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de posts', type: PaginatedPostListResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Acceso denegado', type: ErrorResponseDto })
  findAll(@Query() pagination: PaginationArgs) {
    return this.postsService.findAllAdmin(pagination);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de posts' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas', type: PostStatsResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Acceso denegado', type: ErrorResponseDto })
  getStats() {
    return this.postsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener post por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Post encontrado', type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Acceso denegado', type: ErrorResponseDto })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar post' })
  @ApiResponse({ status: 200, description: 'Post actualizado', type: PostResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o categorías no existen', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Acceso denegado', type: ErrorResponseDto })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar post' })
  @ApiResponse({ status: 200, description: 'Post eliminado', type: SuccessResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Acceso denegado', type: ErrorResponseDto })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}