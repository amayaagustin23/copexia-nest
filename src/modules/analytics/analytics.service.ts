import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (duration > 120 || scrollDepth > 75) return 'high';
    if (duration < 30 && scrollDepth < 25) return 'low';
    return 'medium';
  }

  /**
   * Registrar una nueva visita (Session + Visitor Upsert)
   */
  async createVisit(createVisitDto: CreateVisitDto) {
    const { sessionId: visitorId, page, referrer, userAgent, language, deviceInfo, screenInfo } = createVisitDto;

    // 1. Upsert Visitor (using the frontend side ID)
    const visitor = await this.prisma.analyticsVisitor.upsert({
      where: { id: visitorId },
      create: {
        id: visitorId,
        userAgent,
        deviceType: deviceInfo.type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        language,
        screenResolution: screenInfo.resolution,
        viewportSize: screenInfo.viewport,
      },
      update: {
        lastSeen: new Date(),
        userAgent,
        language,
        viewportSize: screenInfo.viewport,
      },
    });

    // 2. Find or Create Active Session
    let session = await this.prisma.analyticsSession.findFirst({
      where: { visitorId: visitor.id },
      orderBy: { startTime: 'desc' },
    });

    const now = new Date();
    const isSessionExpired = session && session.startTime
      ? (now.getTime() - session.startTime.getTime() > 30 * 60 * 1000)
      : true;

    if (!session || isSessionExpired) {
      session = await this.prisma.analyticsSession.create({
        data: {
          visitorId: visitor.id,
          startTime: now,
          pageViews: {},
        },
      });
    }

    // 3. Update Page Stats in JSON
    const currentStats = (session.pageViews as Record<string, any>) || {};

    if (!currentStats[page]) {
      currentStats[page] = { views: 1, duration: 0, scroll: 0 };
    } else {
      currentStats[page].views = (currentStats[page].views || 0) + 1;
    }

    await this.prisma.analyticsSession.update({
      where: { id: session.id },
      data: { pageViews: currentStats }
    });

    return {
      success: true,
      visitorId: visitor.id,
      sessionId: session.id, // This is the UUID of the session record
      page: page,
    };
  }

  /**
   * Actualizar métricas de la sesión
   */
  async updateSession(identifier: string, updateSessionDto: UpdateSessionDto) {
    console.log('[AnalyticsService] updateSession called', { identifier, updateSessionDto });

    try {
      // Attempt to find by ID (UUID) or by visitorId if it matches the frontend sid
      let session = await this.prisma.analyticsSession.findFirst({
        where: {
          OR: [
            { id: identifier },
            { visitorId: identifier }
          ]
        },
        orderBy: { startTime: 'desc' },
      });

      if (!session) {
        console.warn('[AnalyticsService] Session not found for identifier:', identifier);
        return { success: false, error: 'Session not found' };
      }

      console.log('[AnalyticsService] Session found:', session.id);

      // Update JSON Stats for specific Page
      // Note: frontend sends sectionsViewed, but we use it as context if empty
      const page = updateSessionDto.sectionsViewed && updateSessionDto.sectionsViewed.length > 0
        ? updateSessionDto.sectionsViewed[0]
        : '/unknown';

      console.log('[AnalyticsService] Updating stats for page:', page);

      const currentStats = (session.pageViews as Record<string, any>) || {};

      if (!currentStats[page]) {
        currentStats[page] = { views: 1, duration: 0, scroll: 0 };
      }

      // Update metrics
      currentStats[page].duration = (currentStats[page].duration || 0) + updateSessionDto.duration;
      currentStats[page].scroll = Math.max(currentStats[page].scroll || 0, updateSessionDto.scrollDepth);

      // Calculate session-wide metrics
      const newEndTime = new Date(updateSessionDto.exitTime);
      if (isNaN(newEndTime.getTime())) {
        console.error('[AnalyticsService] Invalid exitTime:', updateSessionDto.exitTime);
        throw new BadRequestException('Invalid exitTime');
      }

      const sessionDuration = Math.round((newEndTime.getTime() - session.startTime.getTime()) / 1000);
      const engagement = this.calculateEngagement(sessionDuration, updateSessionDto.scrollDepth);

      console.log('[AnalyticsService] Saving updates:', {
        sessionId: session.id,
        page,
        duration: sessionDuration,
        engagement
      });

      await this.prisma.analyticsSession.update({
        where: { id: session.id },
        data: {
          pageViews: currentStats,
          duration: sessionDuration,
          endTime: newEndTime,
          engagement
        }
      });

      return { success: true, updated: true };
    } catch (error) {
      console.error('[AnalyticsService] Error in updateSession:', error);
      throw error; // Re-throw to let NestJS handle it (500)
    }
  }

  async createEvent(createEventDto: CreateEventDto) {
    const { sessionId: identifier, eventType, eventData, page } = createEventDto;

    const session = await this.prisma.analyticsSession.findFirst({
      where: {
        OR: [
          { id: identifier },
          { visitorId: identifier }
        ]
      },
      orderBy: { startTime: 'desc' },
    });

    if (!session) return { success: false, error: 'No active session' };

    const event = await this.prisma.analyticsEvent.create({
      data: {
        sessionId: session.id,
        eventType,
        eventData: eventData ?? {},
        page,
        timestamp: new Date(),
      } as any,
    });

    return { success: true, eventId: event.id };
  }

  async getSummary(query: QueryAnalyticsDto) {
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    const startDate = query.startDate ? new Date(query.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessions = await this.prisma.analyticsSession.findMany({
      where: {
        startTime: { gte: startDate, lte: endDate },
      },
      include: {
        visitor: true
      }
    });

    let totalVisits = 0;
    const pageCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const osCounts: Record<string, number> = {};

    const totalEvents = await this.prisma.analyticsEvent.count({
      where: {
        timestamp: { gte: startDate, lte: endDate }
      }
    });

    sessions.forEach(s => {
      const stats = (s.pageViews as Record<string, any>) || {};
      Object.keys(stats).forEach(rawPage => {
        const views = stats[rawPage].views || 0;
        totalVisits += views;

        let cleanName = rawPage.replace(/^\/[a-zA-Z]{2}(\/|#|$)/, '$1');
        if (cleanName === '/' || cleanName === '') cleanName = 'Inicio';
        else cleanName = cleanName.replace(/^[\/#]/, '');

        if (!cleanName || cleanName.toLowerCase() === 'unknown') return;
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        pageCounts[cleanName] = (pageCounts[cleanName] || 0) + views;
      });

      if (s.visitor) {
        deviceCounts[s.visitor.deviceType] = (deviceCounts[s.visitor.deviceType] || 0) + 1;
        browserCounts[s.visitor.browser] = (browserCounts[s.visitor.browser] || 0) + 1;
        osCounts[s.visitor.os] = (osCounts[s.visitor.os] || 0) + 1;
      }


    });

    const totalSessions = sessions.length;
    const uniqueVisitors = new Set(sessions.map(s => s.visitorId)).size;
    const totalDuration = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    const topPages = Object.entries(pageCounts)
      .map(([page, visits]) => ({ page, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    const bounced = sessions.filter(s => (s.duration || 0) < 10).length;
    const bounceRate = totalSessions > 0 ? (bounced / totalSessions) * 100 : 0;

    const rawDaily = await this.prisma.$queryRaw<any[]>`
        SELECT CAST("startTime" AS DATE) as date, COUNT(*) as sessions
        FROM analytics_sessions
        WHERE "startTime" BETWEEN ${startDate} AND ${endDate}
        GROUP BY date
        ORDER BY date
    `;

    const dailyVisits = rawDaily.map(d => ({
      date: typeof d.date === 'string' ? d.date : d.date.toISOString().split('T')[0],
      visits: Number(d.sessions),
    }));

    return {
      totalVisits,
      uniqueVisitors,
      totalSessions,
      totalEvents,
      averageScrollDepth: 0,
      topPages,
      dailyVisits,
      deviceBreakdown: Object.entries(deviceCounts).map(([type, count]) => ({ type, count })),
      browserBreakdown: Object.entries(browserCounts).map(([browser, count]) => ({ browser, count })),
      osBreakdown: Object.entries(osCounts)
        .filter(([os]) => os !== 'Unknown')
        .map(([os, count]) => ({ os, count })),
    };
  }


  async getVisits(query: QueryAnalyticsDto) { return { visits: [], total: 0, page: 1, limit: 50, totalPages: 0 }; }
  async getSessions(query: QueryAnalyticsDto) {
    const result = await paginatePrisma(this.prisma.analyticsSession, {
      where: {},
      orderBy: { startTime: 'desc' },
      include: { visitor: true }
    }, { page: 1, size: 50 });
    return { sessions: result.data, total: result.total, page: 1, limit: 50, totalPages: 1 };
  }
}
