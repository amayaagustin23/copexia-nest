import { Injectable, NotFoundException } from '@nestjs/common';
import { paginatePrisma } from '../../common/pagination';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateVisitDto } from './dto/create-visit.dto';
import { QueryAnalyticsDto } from './dto/query-analytics.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) { }


  /**
   * Calcula el nivel de engagement basado en duración y scroll depth
   */
  private calculateEngagement(duration: number, scrollDepth: number): string {
    // High engagement: más de 120 segundos O más del 75% de scroll
    if (duration > 120 || scrollDepth > 75) {
      return 'high';
    }

    // Low engagement: menos de 30 segundos Y menos del 25% de scroll
    if (duration < 30 && scrollDepth < 25) {
      return 'low';
    }

    // Medium engagement: todo lo demás
    return 'medium';
  }

  /**
   * Registrar una nueva visita a la página
   */
  async createVisit(createVisitDto: CreateVisitDto) {
    // Verificar si ya existe una visita con este sessionId
    const existingVisit = await this.prisma.pageVisit.findUnique({
      where: { sessionId: createVisitDto.sessionId },
    });

    if (existingVisit) {
      // Si ya existe, actualizar la página actual
      const visit = await this.prisma.pageVisit.update({
        where: { sessionId: createVisitDto.sessionId },
        data: {
          page: createVisitDto.page,
          referrer: createVisitDto.referrer,
          userAgent: createVisitDto.userAgent,
          deviceType: createVisitDto.deviceInfo.type,
          browser: createVisitDto.deviceInfo.browser,
          os: createVisitDto.deviceInfo.os,
          language: createVisitDto.language,
          screenResolution: createVisitDto.screenInfo.resolution,
          viewportSize: createVisitDto.screenInfo.viewport,
          timestamp: new Date(), // Actualizar timestamp
        },
      });

      return {
        id: visit.id,
        sessionId: visit.sessionId,
        page: visit.page,
        referrer: visit.referrer,
        userAgent: visit.userAgent,
        deviceType: visit.deviceType,
        browser: visit.browser,
        os: visit.os,
        language: visit.language,
        screenResolution: visit.screenResolution,
        viewportSize: visit.viewportSize,
        timestamp: visit.timestamp,
      };
    }

    // Si no existe, crear nueva visita
    const visit = await this.prisma.pageVisit.create({
      data: {
        sessionId: createVisitDto.sessionId,
        page: createVisitDto.page,
        referrer: createVisitDto.referrer,
        userAgent: createVisitDto.userAgent,
        deviceType: createVisitDto.deviceInfo.type,
        browser: createVisitDto.deviceInfo.browser,
        os: createVisitDto.deviceInfo.os,
        language: createVisitDto.language,
        screenResolution: createVisitDto.screenInfo.resolution,
        viewportSize: createVisitDto.screenInfo.viewport,
      },
    });

    return {
      id: visit.id,
      sessionId: visit.sessionId,
      page: visit.page,
      referrer: visit.referrer,
      userAgent: visit.userAgent,
      deviceType: visit.deviceType,
      browser: visit.browser,
      os: visit.os,
      language: visit.language,
      screenResolution: visit.screenResolution,
      viewportSize: visit.viewportSize,
      timestamp: visit.timestamp,
    };
  }

  /**
   * Actualizar sesión con datos de interacción
   */
  async updateSession(sessionId: string, updateSessionDto: UpdateSessionDto) {
    // Verificar que existe la visita
    const visit = await this.prisma.pageVisit.findUnique({
      where: { sessionId },
    });

    if (!visit) {
      // Si no existe la visita, crear una visita básica primero
      const newVisit = await this.prisma.pageVisit.create({
        data: {
          sessionId,
          page: updateSessionDto.sectionsViewed[0] || '/unknown',
          userAgent: 'Unknown',
          deviceType: 'unknown',
          browser: 'unknown',
          os: 'unknown',
          language: 'unknown',
          screenResolution: 'unknown',
          viewportSize: 'unknown',
        },
      });

      // Usar la nueva visita para crear la sesión
      const session = await this.prisma.pageSession.upsert({
        where: { sessionId },
        create: {
          sessionId,
          page: newVisit.page,
          entryTime: newVisit.timestamp,
          exitTime: new Date(updateSessionDto.exitTime),
          duration: updateSessionDto.duration,
          scrollDepth: updateSessionDto.scrollDepth,
          sectionsViewed: updateSessionDto.sectionsViewed,
          interactions: updateSessionDto.interactions
            ? JSON.parse(JSON.stringify(updateSessionDto.interactions))
            : [],
          engagement: this.calculateEngagement(
            updateSessionDto.duration,
            updateSessionDto.scrollDepth,
          ),
        },
        update: {
          exitTime: new Date(updateSessionDto.exitTime),
          duration: updateSessionDto.duration,
          scrollDepth: updateSessionDto.scrollDepth,
          sectionsViewed: updateSessionDto.sectionsViewed,
          interactions: updateSessionDto.interactions
            ? JSON.parse(JSON.stringify(updateSessionDto.interactions))
            : [],
          engagement: this.calculateEngagement(
            updateSessionDto.duration,
            updateSessionDto.scrollDepth,
          ),
        },
      });

      return {
        id: session.id,
        sessionId: session.sessionId,
        page: session.page,
        entryTime: session.entryTime,
        exitTime: session.exitTime,
        duration: session.duration,
        scrollDepth: session.scrollDepth,
        sectionsViewed: session.sectionsViewed,
        interactions: session.interactions,
        engagement: session.engagement,
      };
    }

    // Calcular engagement
    const engagement = this.calculateEngagement(
      updateSessionDto.duration,
      updateSessionDto.scrollDepth,
    );

    // Crear o actualizar la sesión
    const session = await this.prisma.pageSession.upsert({
      where: { sessionId },
      create: {
        sessionId,
        page: visit.page,
        entryTime: visit.timestamp,
        exitTime: new Date(updateSessionDto.exitTime),
        duration: updateSessionDto.duration,
        scrollDepth: updateSessionDto.scrollDepth,
        sectionsViewed: updateSessionDto.sectionsViewed,
        interactions: updateSessionDto.interactions
          ? JSON.parse(JSON.stringify(updateSessionDto.interactions))
          : [],
        engagement,
      },
      update: {
        exitTime: new Date(updateSessionDto.exitTime),
        duration: updateSessionDto.duration,
        scrollDepth: updateSessionDto.scrollDepth,
        sectionsViewed: updateSessionDto.sectionsViewed,
        interactions: updateSessionDto.interactions
          ? JSON.parse(JSON.stringify(updateSessionDto.interactions))
          : [],
        engagement,
      },
    });

    return {
      id: session.id,
      sessionId: session.sessionId,
      page: session.page,
      entryTime: session.entryTime,
      exitTime: session.exitTime,
      duration: session.duration,
      scrollDepth: session.scrollDepth,
      sectionsViewed: session.sectionsViewed,
      interactions: session.interactions,
      engagement: session.engagement,
    };
  }

  /**
   * Registrar un evento personalizado
   */
  async createEvent(createEventDto: CreateEventDto) {
    // Verificar que existe la visita
    const visit = await this.prisma.pageVisit.findUnique({
      where: { sessionId: createEventDto.sessionId },
    });

    if (!visit) {
      throw new NotFoundException('Session not found');
    }

    const event = await this.prisma.analyticsEvent.create({
      data: {
        sessionId: createEventDto.sessionId,
        eventType: createEventDto.eventType,
        eventData: createEventDto.eventData || {},
        page: createEventDto.page,
        timestamp: new Date(createEventDto.timestamp),
      },
    });

    return {
      id: event.id,
      sessionId: event.sessionId,
      eventType: event.eventType,
      eventData: event.eventData,
      timestamp: event.timestamp,
      page: event.page,
    };
  }

  /**
   * Obtener resumen de analytics
   */
  async getSummary(query: QueryAnalyticsDto) {
    const dateFilter: any = {};

    if (query.startDate && query.endDate) {
      dateFilter.timestamp = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const sessionDateFilter: any = {};
    if (query.startDate && query.endDate) {
      sessionDateFilter.entryTime = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    // Total de visitas
    const totalVisits = await this.prisma.pageVisit.count({
      where: dateFilter,
    });

    // Visitantes únicos (por sessionId)
    const uniqueVisitorsResult = await this.prisma.pageVisit.groupBy({
      by: ['sessionId'],
      where: dateFilter,
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // Duración y scroll promedio
    const avgStats = await this.prisma.pageSession.aggregate({
      where: {
        ...sessionDateFilter,
        duration: { not: null },
      },
      _avg: {
        duration: true,
        scrollDepth: true,
      },
    });

    // Top secciones vistas
    const sessions = await this.prisma.pageSession.findMany({
      where: sessionDateFilter,
      select: {
        sectionsViewed: true,
      },
    });

    const sectionCounts: Record<string, number> = {};
    sessions.forEach((session) => {
      const sections = session.sectionsViewed as string[];
      sections.forEach((section) => {
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
      });
    });

    const topSections = Object.entries(sectionCounts)
      .map(([section, views]) => ({ section, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Device breakdown
    const devices = await this.prisma.pageVisit.groupBy({
      by: ['deviceType'],
      where: dateFilter,
      _count: true,
    });

    const deviceBreakdown = devices.map((d) => ({
      type: d.deviceType || 'Unknown',
      count: d._count,
    }));

    // Browser breakdown
    const browsers = await this.prisma.pageVisit.groupBy({
      by: ['browser'],
      where: dateFilter,
      _count: true,
      orderBy: {
        _count: {
          browser: 'desc',
        },
      },
    });

    const browserBreakdown = browsers.map((b) => ({
      browser: b.browser || 'Unknown',
      count: b._count,
    }));

    // OS breakdown
    const osList = await this.prisma.pageVisit.groupBy({
      by: ['os'],
      where: dateFilter,
      _count: true,
      orderBy: {
        _count: {
          os: 'desc',
        },
      },
    });

    const osBreakdown = osList.map((os) => ({
      os: os.os || 'Unknown',
      count: os._count,
    }));

    // Engagement breakdown
    const engagements = await this.prisma.pageSession.groupBy({
      by: ['engagement'],
      where: {
        ...sessionDateFilter,
        engagement: { not: null },
      },
      _count: true,
    });

    const engagementBreakdown = engagements.map((e) => ({
      engagement: e.engagement,
      count: e._count,
    }));

    // Calculate Bounce Rate (sessions with duration < 10s or only 1 page view - simplified here as low duration)
    const totalSessions = await this.prisma.pageSession.count({
      where: sessionDateFilter,
    });

    const bouncedSessions = await this.prisma.pageSession.count({
      where: {
        ...sessionDateFilter,
        duration: { lt: 10 }, // Assuming < 10 seconds is a bounce
      },
    });

    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

    // Visits by day
    let visitsByDay: any[] = [];
    if (query.startDate && query.endDate) {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);

      // Obtener visitas por día
      const visitsRaw = await this.prisma.$queryRaw<any[]>`
        SELECT 
          DATE(timestamp) as date,
          COUNT(*) as visits,
          COUNT(DISTINCT session_id) as unique_visitors
        FROM page_visits
        WHERE timestamp >= ${startDate} AND timestamp <= ${endDate}
        GROUP BY DATE(timestamp)
        ORDER BY date ASC
      `;

      visitsByDay = visitsRaw.map((row) => ({
        date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
        visits: Number(row.visits),
        uniqueVisitors: Number(row.unique_visitors),
      }));
    }

    return {
      totalVisits,
      uniqueVisitors,
      totalSessions,
      totalEvents: 0, // Placeholder if not tracking events count yet
      avgSessionDuration: Math.round(avgStats._avg.duration || 0),
      averageScrollDepth: Math.round(avgStats._avg.scrollDepth || 0),
      bounceRate,
      topPages: topSections.map(s => ({ page: s.section, visits: s.views })), // Rename for frontend compatibility
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      engagementBreakdown,
      dailyVisits: visitsByDay, // Rename for frontend compatibility
    };
  }

  /**
   * Obtener todas las visitas (paginado)
   */
  async getVisits(query: QueryAnalyticsDto) {
    const where: any = {};

    if (query.startDate && query.endDate) {
      where.timestamp = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const result = await paginatePrisma(
      this.prisma.pageVisit,
      {
        where,
        orderBy: {
          timestamp: 'desc',
        },
      },
      {
        page: query.page || 1,
        size: query.limit || 50,
      },
    );

    return {
      visits: result.data,
      total: result.total,
      page: result.page,
      limit: result.size,
      totalPages: Math.ceil(result.total / result.size),
    };
  }

  /**
   * Obtener todas las sesiones (paginado)
   */
  async getSessions(query: QueryAnalyticsDto) {
    const where: any = {};

    if (query.startDate && query.endDate) {
      where.entryTime = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    if (query.engagement) {
      where.engagement = query.engagement;
    }

    const result = await paginatePrisma(
      this.prisma.pageSession,
      {
        where,
        orderBy: {
          entryTime: 'desc',
        },
      },
      {
        page: query.page || 1,
        size: query.limit || 50,
      },
    );

    return {
      sessions: result.data,
      total: result.total,
      page: result.page,
      limit: result.size,
      totalPages: Math.ceil(result.total / result.size),
    };
  }
}

