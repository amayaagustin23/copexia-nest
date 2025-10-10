# ✅ Módulo de Analytics - Implementación Completa

## 🎉 ¡Todo Listo!

Se ha implementado completamente el módulo de Analytics para tu aplicación NestJS.

---

## 📦 Archivos Creados

### 1. Schema de Prisma (Actualizado)
- ✅ `prisma/schema.prisma`
  - Modelo `PageVisit` - Registra visitas
  - Modelo `PageSession` - Almacena sesiones con interacciones
  - Modelo `AnalyticsEvent` - Eventos personalizados
  - Índices optimizados para queries rápidas

### 2. Módulo de Analytics
```
src/modules/analytics/
├── dto/
│   ├── create-visit.dto.ts       ✅ Validación para crear visitas
│   ├── update-session.dto.ts     ✅ Validación para actualizar sesiones
│   ├── create-event.dto.ts       ✅ Validación para eventos
│   ├── query-analytics.dto.ts    ✅ Validación para filtros y paginación
│   └── index.ts                  ✅ Barrel export
├── analytics.controller.ts       ✅ 6 endpoints (3 públicos + 3 admin)
├── analytics.service.ts          ✅ Toda la lógica de negocio
├── analytics.module.ts           ✅ Módulo NestJS
├── README.md                     ✅ Documentación completa
└── EXAMPLES.md                   ✅ 14 ejemplos de requests
```

### 3. Integración
- ✅ `src/modules/app/app.module.ts` - AnalyticsModule importado

---

## 🚀 Próximos Pasos

### Paso 1: Aplicar Migración de Base de Datos

```bash
cd /Users/agustinamaya/Desktop/repos/Copexia/copexia-nest

# Crear y aplicar la migración
npx prisma migrate dev --name add_analytics_tables
```

Esto creará las siguientes tablas:
- `page_visits`
- `page_sessions`
- `analytics_events`

---

### Paso 2: Verificar que el Servidor Inicia

```bash
# Modo desarrollo
npm run start:dev

# O modo producción
npm run build
npm run start:prod
```

---

### Paso 3: Probar los Endpoints

#### 🔓 Endpoint Público (Sin autenticación)

```bash
curl -X POST http://localhost:3000/analytics/visits \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "1703001234567-abc123def",
    "page": "/es",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
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

#### 🔐 Endpoint Privado (Con autenticación)

Primero haz login para obtener el token:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@copexia.com",
    "password": "tu-password"
  }'
```

Luego usa el resumen:
```bash
curl -X GET "http://localhost:3000/analytics/summary" \
  -H "Cookie: token=TU_TOKEN_AQUI"
```

---

## 📊 Endpoints Disponibles

### Públicos (Sin autenticación)
1. `POST /analytics/visits` - Registrar visita
2. `PUT /analytics/sessions/:sessionId` - Actualizar sesión
3. `POST /analytics/events` - Registrar evento personalizado

### Privados (Requieren autenticación)
4. `GET /analytics/summary` - Resumen de analytics
5. `GET /analytics/visits` - Todas las visitas (paginado)
6. `GET /analytics/sessions` - Todas las sesiones (paginado)

---

## 📖 Documentación Completa

### Archivo Principal
📄 **[src/modules/analytics/README.md](src/modules/analytics/README.md)**
- Descripción completa del módulo
- Estructura de archivos
- Modelos de base de datos
- Todos los endpoints con ejemplos
- Lógica de engagement
- Optimizaciones recomendadas
- Integración con frontend
- Checklist de implementación

### Ejemplos de Requests
📄 **[src/modules/analytics/EXAMPLES.md](src/modules/analytics/EXAMPLES.md)**
- 14 ejemplos detallados de requests
- Escenarios de prueba completos
- Queries para análisis
- Configuración de Postman

---

## 🔍 Características Implementadas

### ✅ Tracking de Visitas
- Registro automático de device info (desktop/mobile/tablet)
- Detección de browser y OS
- Captura de referrer y user agent
- Screen resolution y viewport size
- Lenguaje del navegador

### ✅ Sesiones con Interacciones
- Duración de la sesión
- Scroll depth (profundidad de scroll)
- Secciones vistas
- Interacciones detalladas (clicks, scrolls, views)
- Cálculo automático de engagement (low/medium/high)

### ✅ Eventos Personalizados
- Descargas
- Clicks en botones
- Reproducciones de video
- Envíos de formularios
- Cualquier evento custom

### ✅ Panel de Analytics (Admin)
- Total de visitas
- Visitantes únicos
- Duración promedio
- Scroll depth promedio
- Top secciones más vistas
- Breakdown por device type
- Breakdown por browser
- Breakdown por OS
- Breakdown por engagement
- Visitas por día (cuando se filtran fechas)

### ✅ Filtros y Paginación
- Filtro por rango de fechas
- Filtro por engagement level
- Paginación completa
- Ordenamiento por fecha

---

## 🔒 Seguridad

- ✅ Endpoints públicos sin límite (considera agregar rate limiting)
- ✅ Endpoints privados protegidos con `AccessTokenGuard`
- ✅ Validación de DTOs con class-validator
- ✅ Relaciones con CASCADE para mantener integridad

---

## 🎯 Lógica de Engagement

El sistema calcula automáticamente el nivel de engagement:

```
High Engagement:
  - Duración > 120 segundos, O
  - Scroll depth > 75%

Low Engagement:
  - Duración < 30 segundos, Y
  - Scroll depth < 25%

Medium Engagement:
  - Todo lo demás
```

---

## 🗃️ Estructura de Base de Datos

### Tabla: page_visits
```sql
- id (UUID)
- session_id (String, UNIQUE, INDEXED)
- page (String, INDEXED)
- referrer (String, nullable)
- user_agent (String)
- device_type (String, INDEXED)
- browser (String)
- os (String)
- language (String)
- screen_resolution (String)
- viewport_size (String)
- timestamp (DateTime, INDEXED, DEFAULT now())
- created_at (DateTime, DEFAULT now())
```

### Tabla: page_sessions
```sql
- id (UUID)
- session_id (String, UNIQUE, INDEXED)
- page (String, INDEXED)
- entry_time (DateTime, INDEXED)
- exit_time (DateTime, nullable)
- duration (Int, nullable)
- scroll_depth (Int, nullable)
- sections_viewed (String[])
- interactions (Json, nullable)
- engagement (String, INDEXED, nullable)
- created_at (DateTime, DEFAULT now())
- updated_at (DateTime, DEFAULT now())
```

### Tabla: analytics_events
```sql
- id (UUID)
- session_id (String, INDEXED)
- event_type (String, INDEXED)
- event_data (Json, nullable)
- page (String)
- timestamp (DateTime, INDEXED)
- created_at (DateTime, DEFAULT now())
```

---

## 📈 Optimizaciones Incluidas

✅ **Índices en BD** - Para queries rápidas
✅ **Paginación** - Para manejar grandes volúmenes
✅ **Agregaciones eficientes** - GROUP BY optimizados
✅ **Raw SQL para visitsByDay** - Mejor performance

### Optimizaciones Recomendadas (Opcionales)
- [ ] Rate Limiting en endpoints públicos
- [ ] Caché de resumen con Redis (TTL 1 hora)
- [ ] CRON job para agregación diaria
- [ ] Tabla de resúmenes pre-calculados

---

## 🧪 Testing

### Probar Endpoint Público
```bash
# Desde el directorio del proyecto
curl -X POST http://localhost:3000/analytics/visits \
  -H "Content-Type: application/json" \
  -d @test-visit.json
```

### Verificar en Base de Datos
```sql
-- Ver todas las visitas
SELECT * FROM page_visits ORDER BY timestamp DESC LIMIT 10;

-- Ver todas las sesiones
SELECT * FROM page_sessions ORDER BY entry_time DESC LIMIT 10;

-- Ver eventos
SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 10;
```

---

## 🌐 Integración con Frontend

### Ejemplo con Next.js App Router

```typescript
// lib/analytics.ts
export class Analytics {
  private sessionId: string | null = null;
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async trackVisit(page: string) {
    const response = await fetch(`${this.baseUrl}/analytics/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        deviceInfo: this.getDeviceInfo(),
        screenInfo: this.getScreenInfo(),
        language: navigator.language,
      }),
    });

    const data = await response.json();
    this.sessionId = data.sessionId;
    localStorage.setItem('analytics_session', this.sessionId);

    return data;
  }

  async updateSession(data: SessionData) {
    if (!this.sessionId) return;

    await fetch(`${this.baseUrl}/analytics/sessions/${this.sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        ...data,
      }),
    });
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);

    return {
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      browser: this.getBrowser(),
      os: this.getOS(),
    };
  }

  private getScreenInfo() {
    return {
      resolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };
  }
}

// Usar en _app.tsx o layout.tsx
export const analytics = new Analytics();
```

---

## ✅ Checklist Final

### Backend (Completado)
- [x] Actualizar schema.prisma con modelos de analytics
- [x] Crear DTOs con validación
- [x] Implementar AnalyticsService con toda la lógica
- [x] Implementar AnalyticsController con 6 endpoints
- [x] Crear AnalyticsModule
- [x] Importar módulo en AppModule
- [x] Generar cliente de Prisma
- [x] Crear documentación completa
- [x] Crear ejemplos de requests

### Base de Datos (Pendiente)
- [ ] Ejecutar migración: `npx prisma migrate dev --name add_analytics_tables`
- [ ] Verificar tablas creadas en PostgreSQL

### Testing (Pendiente)
- [ ] Probar POST /analytics/visits
- [ ] Probar PUT /analytics/sessions/:sessionId
- [ ] Probar POST /analytics/events
- [ ] Probar GET /analytics/summary (con auth)
- [ ] Probar GET /analytics/visits (con auth)
- [ ] Probar GET /analytics/sessions (con auth)

### Frontend (Pendiente)
- [ ] Crear cliente de analytics en frontend
- [ ] Integrar trackVisit() en páginas
- [ ] Implementar scroll tracking
- [ ] Implementar section view tracking
- [ ] Agregar tracking de eventos (downloads, clicks, etc.)
- [ ] Implementar updateSession() al salir de la página

### Opcional
- [ ] Agregar rate limiting
- [ ] Implementar caché con Redis
- [ ] Crear CRON job para agregación diaria
- [ ] Agregar tests unitarios
- [ ] Agregar tests E2E

---

## 🆘 Solución de Problemas

### Error: "Session not found"
- Verifica que el sessionId enviado en PUT/POST existe
- Asegúrate de guardar el sessionId después del POST /visits

### Error: "No token provided"
- Los endpoints admin requieren autenticación
- Haz login primero y usa la cookie `token`

### Error de migración
- Verifica que PostgreSQL está corriendo
- Revisa el DATABASE_URL en .env
- Usa `npx prisma migrate reset` si necesitas reiniciar

### Queries lentas
- Verifica que los índices están creados
- Considera implementar caché para el resumen
- Revisa el tamaño de la tabla y considera particionamiento

---

## 📞 Recursos

- 📖 **Documentación Principal:** `src/modules/analytics/README.md`
- 📋 **Ejemplos de Requests:** `src/modules/analytics/EXAMPLES.md`
- 🔧 **Schema de Prisma:** `prisma/schema.prisma`
- 🌐 **Swagger Docs:** `http://localhost:3000/api/docs` (si está configurado)

---

## 🎯 Siguiente Paso Inmediato

```bash
# 1. Aplicar la migración
npx prisma migrate dev --name add_analytics_tables

# 2. Iniciar el servidor
npm run start:dev

# 3. Probar el primer endpoint
curl -X POST http://localhost:3000/analytics/visits \
  -H "Content-Type: application/json" \
  -d '{
    "page": "/es",
    "userAgent": "Mozilla/5.0",
    "deviceInfo": {"type": "desktop", "browser": "Chrome", "os": "Windows"},
    "screenInfo": {"resolution": "1920x1080", "viewport": "1366x768"},
    "language": "es-ES"
  }'
```

---

**🚀 ¡El módulo de Analytics está listo para usar!**

Si necesitas ayuda con la integración en el frontend o tienes alguna pregunta, revisa la documentación en `src/modules/analytics/README.md` y `EXAMPLES.md`.

---

_Desarrollado para Copexia | Última actualización: Octubre 2024_

