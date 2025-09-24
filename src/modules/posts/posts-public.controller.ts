import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationArgs } from 'src/common/pagination/pagination.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
    CommentResponseDto,
    ErrorResponseDto,
    LikeResponseDto,
    PaginatedPostListResponseDto,
    PostResponseDto
} from './dto/post-response.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts Públicos')
@Controller('public/posts')
export class PostsPublicController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los posts públicos' })
  @ApiResponse({ status: 200, description: 'Lista de posts públicos', type: PaginatedPostListResponseDto })
  findAll(@Query() pagination: PaginationArgs) {
    return this.postsService.findAllPublic(pagination);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener post por slug' })
  @ApiResponse({ status: 200, description: 'Post encontrado', type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  findOneBySlug(@Param('slug') slug: string) {
    return this.postsService.findOnePublic(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener post por ID' })
  @ApiResponse({ status: 200, description: 'Post encontrado', type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Dar like a un post' })
  @ApiResponse({ status: 200, description: 'Like agregado', type: LikeResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  likePost(@Param('id') id: string) {
    return this.postsService.likePost(id);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Quitar like de un post' })
  @ApiResponse({ status: 200, description: 'Like removido', type: LikeResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  unlikePost(@Param('id') id: string) {
    return this.postsService.unlikePost(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Crear comentario en un post' })
  @ApiResponse({ status: 201, description: 'Comentario creado', type: CommentResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o comentario padre no válido', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  createComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    return this.postsService.createComment(id, createCommentDto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Obtener comentarios de un post' })
  @ApiResponse({ status: 200, description: 'Comentarios obtenidos', type: [CommentResponseDto] })
  @ApiResponse({ status: 404, description: 'Post no encontrado', type: ErrorResponseDto })
  getComments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }
}