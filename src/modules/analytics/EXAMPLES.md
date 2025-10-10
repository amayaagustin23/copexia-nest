# 📋 Ejemplos de Requests para Analytics API

## 🔓 Endpoints Públicos

### 1. Registrar Visita a la Página Principal (Español)

**Request:**
```http
POST http://localhost:3000/analytics/visits
Content-Type: application/json

{
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "page": "/es",
  "referrer": "https://google.com/search?q=copexia",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

**Response (201 Created):**
```json
{
  "id": "8a5c3e89-2f1d-4b3a-9e7f-1c4d6b8a2e5f",
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "page": "/es",
  "referrer": "https://google.com/search?q=copexia",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "deviceType": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "language": "es-ES",
  "screenResolution": "1920x1080",
  "viewportSize": "1366x768",
  "timestamp": "2024-10-10T15:30:00.000Z"
}
```

---

### 2. Registrar Visita desde Mobile (Safari/iOS)

**Request:**
```http
POST http://localhost:3000/analytics/visits
Content-Type: application/json

{
  "sessionId": "1703001234567-mobile-user",
  "page": "/en",
  "referrer": "https://www.linkedin.com/company/copexia",
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "deviceInfo": {
    "type": "mobile",
    "browser": "Safari",
    "os": "iOS"
  },
  "screenInfo": {
    "resolution": "393x852",
    "viewport": "393x726"
  },
  "language": "en-US"
}
```

---

### 3. Actualizar Sesión con Interacciones (Engagement Alto)

**Request:**
```http
PUT http://localhost:3000/analytics/sessions/1703001234567-k8j9h6g5f4d3
Content-Type: application/json

{
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "exitTime": "2024-10-10T15:37:45.000Z",
  "duration": 465,
  "scrollDepth": 92,
  "sectionsViewed": [
    "hero",
    "sobre-nosotros",
    "valores",
    "servicios",
    "casos-de-exito",
    "blog",
    "contacto"
  ],
  "interactions": [
    {
      "type": "scroll",
      "target": "25%",
      "timestamp": "2024-10-10T15:31:15.000Z"
    },
    {
      "type": "section_view",
      "target": "sobre-nosotros",
      "timestamp": "2024-10-10T15:31:30.000Z"
    },
    {
      "type": "scroll",
      "target": "50%",
      "timestamp": "2024-10-10T15:32:45.000Z"
    },
    {
      "type": "section_view",
      "target": "valores",
      "timestamp": "2024-10-10T15:33:00.000Z"
    },
    {
      "type": "button_click",
      "target": "cta-contacto-hero",
      "timestamp": "2024-10-10T15:34:15.000Z",
      "metadata": {
        "text": "Contáctanos",
        "color": "primary"
      }
    },
    {
      "type": "section_view",
      "target": "servicios",
      "timestamp": "2024-10-10T15:34:30.000Z"
    },
    {
      "type": "scroll",
      "target": "75%",
      "timestamp": "2024-10-10T15:35:20.000Z"
    },
    {
      "type": "section_view",
      "target": "blog",
      "timestamp": "2024-10-10T15:36:00.000Z"
    },
    {
      "type": "link_click",
      "target": "blog-post-1",
      "timestamp": "2024-10-10T15:36:30.000Z",
      "metadata": {
        "title": "Transformación Digital en 2024"
      }
    },
    {
      "type": "scroll",
      "target": "100%",
      "timestamp": "2024-10-10T15:37:00.000Z"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "f3e8d2c1-9b7a-4e6d-8c5b-2a1f3e7d9c8b",
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "page": "/es",
  "entryTime": "2024-10-10T15:30:00.000Z",
  "exitTime": "2024-10-10T15:37:45.000Z",
  "duration": 465,
  "scrollDepth": 92,
  "sectionsViewed": [
    "hero",
    "sobre-nosotros",
    "valores",
    "servicios",
    "casos-de-exito",
    "blog",
    "contacto"
  ],
  "interactions": [...],
  "engagement": "high"
}
```

---

### 4. Actualizar Sesión (Engagement Bajo)

**Request:**
```http
PUT http://localhost:3000/analytics/sessions/1703001234567-abc123def
Content-Type: application/json

{
  "sessionId": "1703001234567-abc123def",
  "exitTime": "2024-10-10T15:30:20.000Z",
  "duration": 20,
  "scrollDepth": 15,
  "sectionsViewed": [
    "hero"
  ],
  "interactions": [
    {
      "type": "scroll",
      "target": "15%",
      "timestamp": "2024-10-10T15:30:10.000Z"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "...",
  "sessionId": "1703001234567-abc123def",
  "duration": 20,
  "scrollDepth": 15,
  "engagement": "low"
}
```

---

### 5. Registrar Evento Personalizado: Descarga de Brochure

**Request:**
```http
POST http://localhost:3000/analytics/events
Content-Type: application/json

{
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "eventType": "download_brochure",
  "eventData": {
    "fileName": "copexia-servicios-2024.pdf",
    "fileSize": "2.5MB",
    "downloadUrl": "/downloads/brochure-servicios.pdf",
    "language": "es"
  },
  "timestamp": "2024-10-10T15:34:45.000Z",
  "page": "/es"
}
```

**Response (201 Created):**
```json
{
  "id": "d4c3b2a1-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "eventType": "download_brochure",
  "eventData": {
    "fileName": "copexia-servicios-2024.pdf",
    "fileSize": "2.5MB",
    "downloadUrl": "/downloads/brochure-servicios.pdf",
    "language": "es"
  },
  "timestamp": "2024-10-10T15:34:45.000Z",
  "page": "/es"
}
```

---

### 6. Registrar Evento: Video Reproducido

**Request:**
```http
POST http://localhost:3000/analytics/events
Content-Type: application/json

{
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "eventType": "video_played",
  "eventData": {
    "videoId": "intro-copexia-2024",
    "videoTitle": "Introducción a Copexia",
    "duration": 120,
    "playedSeconds": 45
  },
  "timestamp": "2024-10-10T15:35:30.000Z",
  "page": "/es"
}
```

---

### 7. Registrar Evento: Formulario de Contacto Enviado

**Request:**
```http
POST http://localhost:3000/analytics/events
Content-Type: application/json

{
  "sessionId": "1703001234567-k8j9h6g5f4d3",
  "eventType": "form_submitted",
  "eventData": {
    "formType": "contact",
    "fields": ["name", "email", "phone", "message"],
    "source": "hero-cta"
  },
  "timestamp": "2024-10-10T15:36:15.000Z",
  "page": "/es"
}
```

---

## 🔐 Endpoints Privados (Admin)

> **Nota:** Estos endpoints requieren autenticación. Primero debes hacer login y obtener el token.

### 8. Obtener Resumen General (Sin filtros)

**Request:**
```http
GET http://localhost:3000/analytics/summary
Cookie: token={tu-token-de-autenticacion}
```

**Response (200 OK):**
```json
{
  "totalVisits": 2547,
  "uniqueVisitors": 1823,
  "averageDuration": 167,
  "averageScrollDepth": 68,
  "topSections": [
    {
      "section": "hero",
      "views": 2547
    },
    {
      "section": "sobre-nosotros",
      "views": 1890
    },
    {
      "section": "valores",
      "views": 1645
    },
    {
      "section": "servicios",
      "views": 1523
    },
    {
      "section": "contacto",
      "views": 1342
    },
    {
      "section": "blog",
      "views": 987
    }
  ],
  "deviceBreakdown": {
    "desktop": 1423,
    "mobile": 956,
    "tablet": 168
  },
  "browserBreakdown": {
    "Chrome": 1532,
    "Safari": 621,
    "Firefox": 254,
    "Edge": 98,
    "Opera": 42
  },
  "osBreakdown": {
    "Windows": 1234,
    "Android": 645,
    "iOS": 412,
    "macOS": 234,
    "Linux": 22
  },
  "engagementBreakdown": {
    "high": 892,
    "medium": 1123,
    "low": 532
  },
  "visitsByDay": []
}
```

---

### 9. Obtener Resumen con Filtro de Fechas

**Request:**
```http
GET http://localhost:3000/analytics/summary?startDate=2024-10-01T00:00:00.000Z&endDate=2024-10-31T23:59:59.999Z
Cookie: token={tu-token-de-autenticacion}
```

**Response (200 OK):**
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
  "visitsByDay": [
    {
      "date": "2024-10-01",
      "visits": 35,
      "uniqueVisitors": 28
    },
    {
      "date": "2024-10-02",
      "visits": 42,
      "uniqueVisitors": 35
    },
    {
      "date": "2024-10-03",
      "visits": 38,
      "uniqueVisitors": 31
    }
    // ... más días
  ]
}
```

---

### 10. Obtener Todas las Visitas (Primera Página)

**Request:**
```http
GET http://localhost:3000/analytics/visits?page=1&limit=20
Cookie: token={tu-token-de-autenticacion}
```

**Response (200 OK):**
```json
{
  "visits": [
    {
      "id": "8a5c3e89-2f1d-4b3a-9e7f-1c4d6b8a2e5f",
      "sessionId": "1703001234567-k8j9h6g5f4d3",
      "page": "/es",
      "referrer": "https://google.com/search?q=copexia",
      "userAgent": "Mozilla/5.0...",
      "deviceType": "desktop",
      "browser": "Chrome",
      "os": "Windows",
      "language": "es-ES",
      "screenResolution": "1920x1080",
      "viewportSize": "1366x768",
      "timestamp": "2024-10-10T15:30:00.000Z",
      "createdAt": "2024-10-10T15:30:00.000Z"
    }
    // ... 19 visitas más
  ],
  "total": 2547,
  "page": 1,
  "limit": 20,
  "totalPages": 128
}
```

---

### 11. Obtener Visitas con Filtro de Fechas

**Request:**
```http
GET http://localhost:3000/analytics/visits?page=1&limit=50&startDate=2024-10-10T00:00:00.000Z&endDate=2024-10-10T23:59:59.999Z
Cookie: token={tu-token-de-autenticacion}
```

---

### 12. Obtener Todas las Sesiones (Primera Página)

**Request:**
```http
GET http://localhost:3000/analytics/sessions?page=1&limit=20
Cookie: token={tu-token-de-autenticacion}
```

**Response (200 OK):**
```json
{
  "sessions": [
    {
      "id": "f3e8d2c1-9b7a-4e6d-8c5b-2a1f3e7d9c8b",
      "sessionId": "1703001234567-k8j9h6g5f4d3",
      "page": "/es",
      "entryTime": "2024-10-10T15:30:00.000Z",
      "exitTime": "2024-10-10T15:37:45.000Z",
      "duration": 465,
      "scrollDepth": 92,
      "sectionsViewed": [
        "hero",
        "sobre-nosotros",
        "valores",
        "servicios",
        "casos-de-exito",
        "blog",
        "contacto"
      ],
      "interactions": [...],
      "engagement": "high",
      "createdAt": "2024-10-10T15:30:00.000Z",
      "updatedAt": "2024-10-10T15:37:45.000Z"
    }
    // ... 19 sesiones más
  ],
  "total": 1823,
  "page": 1,
  "limit": 20,
  "totalPages": 92
}
```

---

### 13. Filtrar Sesiones por Engagement Alto

**Request:**
```http
GET http://localhost:3000/analytics/sessions?engagement=high&page=1&limit=30
Cookie: token={tu-token-de-autenticacion}
```

---

### 14. Filtrar Sesiones por Engagement Bajo y Fechas

**Request:**
```http
GET http://localhost:3000/analytics/sessions?engagement=low&startDate=2024-10-01T00:00:00.000Z&endDate=2024-10-31T23:59:59.999Z&page=1&limit=50
Cookie: token={tu-token-de-autenticacion}
```

---

## 🧪 Escenarios de Prueba Completos

### Escenario 1: Usuario navega toda la página (High Engagement)

1. **Paso 1:** Registrar visita
```http
POST /analytics/visits
{
  "page": "/es",
  "userAgent": "...",
  "deviceInfo": { "type": "desktop", "browser": "Chrome", "os": "Windows" },
  "screenInfo": { "resolution": "1920x1080", "viewport": "1366x768" },
  "language": "es-ES"
}
```

2. **Paso 2:** Guardar el `sessionId` devuelto (ej: `1703001234567-xyz`)

3. **Paso 3:** Al salir de la página, actualizar sesión
```http
PUT /analytics/sessions/1703001234567-xyz
{
  "sessionId": "1703001234567-xyz",
  "exitTime": "2024-10-10T15:40:00.000Z",
  "duration": 600,
  "scrollDepth": 95,
  "sectionsViewed": ["hero", "sobre-nosotros", "valores", "servicios", "blog", "contacto"],
  "interactions": [...]
}
```

---

### Escenario 2: Usuario abandona rápidamente (Low Engagement)

1. **Paso 1:** Registrar visita
```http
POST /analytics/visits
```

2. **Paso 2:** Usuario cierra la página en 15 segundos
```http
PUT /analytics/sessions/{sessionId}
{
  "sessionId": "...",
  "exitTime": "...",
  "duration": 15,
  "scrollDepth": 10,
  "sectionsViewed": ["hero"],
  "interactions": []
}
```

---

### Escenario 3: Usuario descarga brochure y envía formulario

1. **Registrar visita**
2. **Registrar evento de descarga**
```http
POST /analytics/events
{
  "eventType": "download_brochure",
  ...
}
```
3. **Registrar evento de formulario**
```http
POST /analytics/events
{
  "eventType": "form_submitted",
  ...
}
```
4. **Actualizar sesión al salir**

---

## 📊 Queries para Análisis

### Consulta 1: ¿Cuántas visitas tuvimos hoy?
```http
GET /analytics/summary?startDate=2024-10-10T00:00:00.000Z&endDate=2024-10-10T23:59:59.999Z
```

### Consulta 2: ¿Cuál es el engagement promedio este mes?
```http
GET /analytics/summary?startDate=2024-10-01T00:00:00.000Z&endDate=2024-10-31T23:59:59.999Z
```

### Consulta 3: ¿Qué dispositivos usan más nuestros visitantes?
```http
GET /analytics/summary
```
Ver campo: `deviceBreakdown`

### Consulta 4: ¿Qué secciones son más vistas?
```http
GET /analytics/summary
```
Ver campo: `topSections`

### Consulta 5: Listar sesiones con bajo engagement para análisis
```http
GET /analytics/sessions?engagement=low&limit=100
```

---

## 🚀 Colección de Postman

Puedes importar estos ejemplos a Postman copiándolos o crear una nueva colección con estas requests.

**Variables de entorno sugeridas:**
```json
{
  "base_url": "http://localhost:3000",
  "token": "tu-token-aqui",
  "session_id": "auto-generated"
}
```

---

**¡Listo para rastrear! 📈**

