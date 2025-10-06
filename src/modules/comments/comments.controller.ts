import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Query,
	UseGuards
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CommentStatus } from '@prisma/client';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { HasRoles } from '../../common/decorators/has-roles.decorator';
import { PaginationArgs } from '../../common/pagination/pagination.interface';
import { Role } from '../../constants';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CommentsService } from './comments.service';
import {
	CommentListResponseDto,
	CommentResponseDto,
	CommentStatsDto,
} from './dto/comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('admin/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}


  // ******** ADMIN: LISTAR TODOS LOS COMENTARIOS ********
  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los comentarios (Admin)' })
  @ApiQuery({
    name: 'page',
    description: 'Número de página',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'size',
    description: 'Elementos por página',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    description: 'Buscar en contenido, nombre o email',
    example: 'excelente',
    required: false,
  })
  @ApiQuery({
    name: 'orderBy',
    description: 'Ordenar por',
    enum: ['createdAt', 'updatedAt'],
    example: 'createdAt',
    required: false,
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Fecha de inicio',
    example: '2024-01-01',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Fecha de fin',
    example: '2024-12-31',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentarios con estadísticas',
    type: CommentListResponseDto,
  })
  async findAllAdmin(
    @Query() pagination: PaginationArgs,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.commentsService.findAllAdmin(pagination);
  }

  // ******** ADMIN: OBTENER ESTADÍSTICAS ********
  @Get('stats')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de comentarios (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de comentarios',
    type: CommentStatsDto,
  })
  async getStats(@GetCurrentUser('userId') userId: string) {
    return this.commentsService.getStats();
  }

  // ******** ADMIN: OBTENER COMENTARIO POR ID ********
  @Get(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener comentario por ID (Admin)' })
  @ApiParam({
    name: 'id',
    description: 'ID del comentario',
    example: 'uuid-del-comentario',
  })
  @ApiResponse({
    status: 200,
    description: 'Comentario encontrado',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.commentsService.findOne(id);
  }

  // ******** ADMIN: ACTUALIZAR COMENTARIO ********
  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar comentario (Admin)' })
  @ApiParam({
    name: 'id',
    description: 'ID del comentario',
    example: 'uuid-del-comentario',
  })
  @ApiResponse({
    status: 200,
    description: 'Comentario actualizado exitosamente',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  // ******** ADMIN: ACTUALIZAR ESTADO DEL COMENTARIO ********
  @Patch(':id/status')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado del comentario (Admin)' })
  @ApiParam({
    name: 'id',
    description: 'ID del comentario',
    example: 'uuid-del-comentario',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del comentario actualizado exitosamente',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CommentStatus,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.commentsService.updateStatus(id, status);
  }

  // ******** ADMIN: ELIMINAR COMENTARIO ********
  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar comentario (Admin)' })
  @ApiParam({
    name: 'id',
    description: 'ID del comentario',
    example: 'uuid-del-comentario',
  })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  async remove(
    @Param('id') id: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.commentsService.remove(id);
  }
}
