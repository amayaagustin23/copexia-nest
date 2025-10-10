# 📊 Módulo de Analytics

## 🎯 Descripción

Módulo completo de Analytics para rastrear y analizar el comportamiento de los usuarios en el sitio web. Incluye:

- **Registro de visitas a páginas** (público)
- **Tracking de sesiones con interacciones** (público)
- **Eventos personalizados** (público)
- **Panel de analytics con resúmenes y estadísticas** (admin)

## 📁 Estructura de Archivos

```
src/modules/analytics/
├── dto/
│   ├── create-visit.dto.ts       # DTO para crear visitas
│   ├── update-session.dto.ts     # DTO para actualizar sesiones
│   ├── create-event.dto.ts       # DTO para eventos personalizados
│   ├── query-analytics.dto.ts    # DTO para queries de filtrado
│   └── index.ts                  # Barrel export
├── analytics.controller.ts       # Controlador con todos los endpoints
├── analytics.service.ts          # Lógica de negocio
├── analytics.module.ts           # Módulo de NestJS
└── README.md                     # Este archivo
```

## 🗄️ Modelos de Base de Datos

### PageVisit
Registra cada visita a una página del sitio.

```prisma
model PageVisit {
  id               String       @id @default(uuid())
  sessionId        String       @unique
  page             String
  referrer         String?
  userAgent        String
  deviceType       String
  browser          String
  os               String
  language         String
  screenResolution String
  viewportSize     String
  timestamp        DateTime     @default(now())
  createdAt        DateTime     @default(now())
  
  session          PageSession?
  events           AnalyticsEvent[]
}
```

### PageSession
Almacena información detallada de la sesión del usuario.

```prisma
model PageSession {
  id              String    @id @default(uuid())
  sessionId       String    @unique
  page            String
  entryTime       DateTime
  exitTime        DateTime?
  duration        Int?
  scrollDepth     Int?
  sectionsViewed  String[]
  interactions    Json?
  engagement      String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### AnalyticsEvent
Registra eventos personalizados (descargas, clicks especiales, etc.)

```prisma
model AnalyticsEvent {
  id          String    @id @default(uuid())
  sessionId   String
  eventType   String
  eventData   Json?
  page        String
  timestamp   DateTime
  createdAt   DateTime  @default(now())
}
```

## 🔌 Endpoints de la API

### Endpoints Públicos (Sin autenticación)

#### 1. Registrar Visita
```http
POST /analytics/visits
Content-Type: application/json

{
  "sessionId": "1703001234567-abc123def",
  "page": "/es",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "deviceInfo": {
    "type": "desktop",
    "browser": "Chrome",
    "os": "Windows"
  },
  "screenInfo": {
    "resolution": "1920x1080",
    "viewport": "1366x768"
  },
  "language": "es-ES"
}
```

**Response (201):**
```json
{
  "id": "uuid-123",
  "sessionId": "1703001234567-abc123def",
  "page": "/es",
  "timestamp": "2024-10-10T15:30:00.000Z"
}
```

---

#### 2. Actualizar Sesión
```http
PUT /analytics/sessions/:sessionId
Content-Type: application/json

{
  "sessionId": "1703001234567-abc123def",
  "exitTime": "2024-10-10T15:35:25.000Z",
  "duration": 325,
  "scrollDepth": 87,
  "sectionsViewed": ["inicio", "sobre-nosotros", "valores"],
  "interactions": [
    {
      "type": "scroll",
      "target": "25%",
      "timestamp": "2024-10-10T15:31:00.000Z"
    }
  ]
}
```

**Response (200):**
```json
{
  "id": "uuid-456",
  "sessionId": "1703001234567-abc123def",
  "duration": 325,
  "scrollDepth": 87,
  "engagement": "high"
}
```

---

#### 3. Registrar Evento Personalizado
```http
POST /analytics/events
Content-Type: application/json

{
  "sessionId": "1703001234567-abc123def",
  "eventType": "download_brochure",
  "eventData": {
    "fileName": "copexia-services.pdf"
  },
  "timestamp": "2024-10-10T15:33:00.000Z",
  "page": "/es"
}
```

---

### Endpoints Privados (Requieren autenticación)

#### 4. Obtener Resumen
```http
GET /analytics/summary?startDate=2024-10-01&endDate=2024-10-31
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "totalVisits": 1250,
  "uniqueVisitors": 890,
  "averageDuration": 145,
  "averageScrollDepth": 62,
  "topSections": [...],
  "deviceBreakdown": {...},
  "browserBreakdown": {...},
  "osBreakdown": {...},
  "engagementBreakdown": {...},
  "visitsByDay": [...]
}
```

---

#### 5. Obtener Visitas (Paginado)
```http
GET /analytics/visits?page=1&limit=50&startDate=2024-10-01&endDate=2024-10-31
Authorization: Bearer {token}
```

---

#### 6. Obtener Sesiones (Paginado)
```http
GET /analytics/sessions?page=1&limit=50&engagement=high
Authorization: Bearer {token}
```

---

## 🚀 Pasos de Instalación

### 1. Aplicar Migración de Base de Datos

```bash
# Crear y aplicar la migración
npx prisma migrate dev --name add_analytics_tables

# O si ya existe la migración
npx prisma migrate deploy
```

### 2. Generar Cliente de Prisma (Ya ejecutado)

```bash
npx prisma generate
```

### 3. Verificar que el módulo está importado en AppModule

El módulo ya está importado en `src/modules/app/app.module.ts`:

```typescript
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    // ...otros módulos
    AnalyticsModule,
  ],
})
export class AppModule {}
```

### 4. Iniciar el servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### 5. Probar los endpoints

Usa Postman o curl:

```bash
# Registrar visita
curl -X POST http://localhost:3000/analytics/visits \
  -H "Content-Type: application/json" \
  -d '{
    "page": "/es",
    "userAgent": "Mozilla/5.0...",
    "deviceInfo": {
      "type": "desktop",
      "browser": "Chrome",
      "os": "Windows"
    },
    "screenInfo": {
      "resolution": "1920x1080",
      "viewport": "1366x768"
    },
    "language": "es-ES"
  }'
```

---

## 📊 Lógica de Engagement

El nivel de engagement se calcula automáticamente basado en:

```typescript
function calculateEngagement(duration: number, scrollDepth: number): string {
  // High: más de 120 segundos O más del 75% de scroll
  if (duration > 120 || scrollDepth > 75) {
    return 'high';
  }
  
  // Low: menos de 30 segundos Y menos del 25% de scroll
  if (duration < 30 && scrollDepth < 25) {
    return 'low';
  }
  
  // Medium: todo lo demás
  return 'medium';
}
```

---

## 🔐 Autenticación

Los endpoints privados (`/summary`, `/visits`, `/sessions`) están protegidos con `AccessTokenGuard`:

```typescript
@UseGuards(AccessTokenGuard)
@Get('summary')
async getSummary(@Query() query: QueryAnalyticsDto) {
  return this.analyticsService.getSummary(query);
}
```

Para acceder a estos endpoints, necesitas:

1. Estar autenticado (cookie `token` válido)
2. O enviar el token en el header: `Authorization: Bearer {token}`

---

## 📈 Optimizaciones Recomendadas

### 1. Índices en la Base de Datos
Ya están definidos en el schema:
- `sessionId` (única búsqueda)
- `timestamp` (filtros por fecha)
- `page` (filtros por página)
- `deviceType` (agregaciones)
- `engagement` (filtros)

### 2. Caché de Resumen
Para mejorar el rendimiento, considera cachear el resumen diario con Redis:

```typescript
// Ejemplo conceptual
@Cacheable('analytics:summary', { ttl: 3600 }) // 1 hora
async getSummary(query: QueryAnalyticsDto) {
  // ...
}
```

### 3. Agregación Programada
Crear un CRON job para calcular resúmenes diarios y mejorar el rendimiento de queries:

```typescript
// analytics.cron.ts
@Cron('0 0 * * *') // Cada día a medianoche
async aggregateDailyStats() {
  // Calcular y guardar resúmenes diarios
}
```

### 4. Rate Limiting
Agregar rate limiting a los endpoints públicos:

```typescript
@Throttle(10, 60) // 10 requests por minuto
@Post('visits')
async createVisit(@Body() dto: CreateVisitDto) {
  // ...
}
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 📝 Notas Adicionales

- **IMPORTANTE**: El `sessionId` debe ser generado en el frontend y enviado al backend
- El frontend debe guardar el `sessionId` en localStorage para reutilizarlo en la misma sesión
- Las interacciones se almacenan como JSON para máxima flexibilidad
- El campo `sectionsViewed` es un array de strings para rastrear qué secciones vio el usuario
- El `timestamp` se genera automáticamente en el servidor
- El backend valida que el `sessionId` sea único (no permite duplicados)

---

## 🤝 Integración con Frontend

### Ejemplo de uso desde Next.js:

```typescript
// lib/analytics.ts

// Generar sessionId único en el frontend
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export class AnalyticsClient {
  private sessionId: string | null = null;
  
  constructor() {
    // Intentar recuperar sessionId existente o generar uno nuevo
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    // Intentar recuperar de localStorage
    let sessionId = localStorage.getItem('analytics_session');
    
    if (!sessionId) {
      // Generar nuevo sessionId
      sessionId = generateSessionId();
      localStorage.setItem('analytics_session', sessionId);
    }
    
    return sessionId;
  }
  
  async trackVisit(page: string) {
    const response = await fetch('/api/analytics/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        page,
        userAgent: navigator.userAgent,
        deviceInfo: this.getDeviceInfo(),
        screenInfo: this.getScreenInfo(),
        language: navigator.language,
      }),
    });
    
    const data = await response.json();
    return data;
  }
  
  async updateSession(data: SessionData) {
    if (!this.sessionId) return;
    
    await fetch(`/api/analytics/sessions/${this.sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        ...data,
      }),
    });
  }
}
```

---

## ✅ Checklist de Implementación

- [x] Crear modelos en Prisma
- [x] Crear DTOs con validación
- [x] Implementar AnalyticsService
- [x] Implementar AnalyticsController
- [x] Crear AnalyticsModule
- [x] Importar módulo en AppModule
- [x] Generar cliente de Prisma
- [ ] Ejecutar migración de base de datos
- [ ] Probar endpoints públicos
- [ ] Probar endpoints privados
- [ ] Integrar con frontend
- [ ] Agregar rate limiting (opcional)
- [ ] Implementar caché (opcional)
- [ ] Crear job de agregación diaria (opcional)

---

## 📞 Soporte

Si tienes preguntas o encuentras algún problema, revisa:

1. Los logs del servidor en la consola
2. La documentación de Swagger en `/api/docs`
3. Los ejemplos de request/response en este README

---

**¡Listo para rastrear analytics! 🚀**

