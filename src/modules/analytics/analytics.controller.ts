import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AnalyticsService } from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateVisitDto } from './dto/create-visit.dto';
import { QueryAnalyticsDto } from './dto/query-analytics.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ******** ENDPOINTS PÚBLICOS ********

  @Post('visits')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar una nueva visita a la página' })
  @ApiBody({ type: CreateVisitDto })
  @ApiResponse({
    status: 201,
    description: 'Visita registrada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async createVisit(@Body() createVisitDto: CreateVisitDto) {
    return this.analyticsService.createVisit(createVisitDto);
  }

  /**
   * Post/Put /api/v1/analytics/sessions/:sessionId
   * Actualizar sesión con duración, scroll e interacciones (público)
   * Soporta POST para navigator.sendBeacon
   */
  @Post('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  async updateSessionPost(
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.analyticsService.updateSession(sessionId, updateSessionDto);
  }

  @Put('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar sesión con datos de interacción' })
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({
    status: 200,
    description: 'Sesión actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  async updateSession(
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.analyticsService.updateSession(sessionId, updateSessionDto);
  }

  /**
   * POST /api/v1/analytics/events
   * Registrar evento personalizado (público, opcional)
   */
  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un evento personalizado' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Evento registrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.analyticsService.createEvent(createEventDto);
  }

  // ******** ENDPOINTS PRIVADOS (ADMIN) ********

  /**
   * GET /api/v1/analytics/summary
   * Obtener resumen de analytics (requiere autenticación)
   */
  @UseGuards(AccessTokenGuard)
  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener resumen de analytics (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Resumen de analytics obtenido exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getSummary(@Query() query: QueryAnalyticsDto) {
    return this.analyticsService.getSummary(query);
  }

  /**
   * GET /api/v1/analytics/visits
   * Obtener todas las visitas paginadas (requiere autenticación)
   */
  @UseGuards(AccessTokenGuard)
  @Get('visits')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las visitas paginadas (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Visitas obtenidas exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getVisits(@Query() query: QueryAnalyticsDto) {
    return this.analyticsService.getVisits(query);
  }

  /**
   * GET /api/v1/analytics/sessions
   * Obtener todas las sesiones paginadas (requiere autenticación)
   */
  @UseGuards(AccessTokenGuard)
  @Get('sessions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las sesiones paginadas (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Sesiones obtenidas exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getSessions(@Query() query: QueryAnalyticsDto) {
    return this.analyticsService.getSessions(query);
  }
}
