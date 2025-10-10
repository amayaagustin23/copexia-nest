# 🌐 Integración de Analytics con Frontend

## 📋 Generación de SessionId

El `sessionId` debe ser generado en el frontend. Aquí tienes diferentes opciones:

### Opción 1: Generación Simple (Recomendada)

```typescript
function generateSessionId(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomString}`;
}

// Ejemplo: "1703001234567-abc123def"
```

### Opción 2: Generación Segura con Crypto API

```typescript
function generateSecureSessionId(): string {
  const timestamp = Date.now();
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const randomString = Array.from(randomBytes, byte => byte.toString(36)).join('');
  return `${timestamp}-${randomString}`;
}
```

### Opción 3: Usando UUID (Requiere librería)

```bash
npm install uuid
npm install @types/uuid --save-dev
```

```typescript
import { v4 as uuidv4 } from 'uuid';

function generateUuidSessionId(): string {
  return uuidv4();
}
```

---

## 🔧 Implementación Completa

### React/Next.js Hook

```typescript
// hooks/useAnalytics.ts
import { useState, useEffect } from 'react';

interface AnalyticsData {
  sessionId: string;
  page: string;
  deviceInfo: {
    type: string;
    browser: string;
    os: string;
  };
  screenInfo: {
    resolution: string;
    viewport: string;
  };
  language: string;
}

export function useAnalytics() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Generar o recuperar sessionId
    let currentSessionId = localStorage.getItem('analytics_session');
    
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      localStorage.setItem('analytics_session', currentSessionId);
    }
    
    setSessionId(currentSessionId);
  }, []);

  const generateSessionId = (): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomString}`;
  };

  const trackVisit = async (page: string) => {
    if (!sessionId) return;

    try {
      const response = await fetch('/api/v1/analytics/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          page,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          deviceInfo: getDeviceInfo(),
          screenInfo: getScreenInfo(),
          language: navigator.language,
        }),
      });

      if (response.ok) {
        setIsTracking(true);
        console.log('✅ Visita registrada:', page);
      }
    } catch (error) {
      console.error('❌ Error al registrar visita:', error);
    }
  };

  const updateSession = async (data: {
    exitTime: string;
    duration: number;
    scrollDepth: number;
    sectionsViewed: string[];
    interactions?: any[];
  }) => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/v1/analytics/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...data,
        }),
      });

      if (response.ok) {
        console.log('✅ Sesión actualizada');
      }
    } catch (error) {
      console.error('❌ Error al actualizar sesión:', error);
    }
  };

  const trackEvent = async (eventType: string, eventData: any = {}) => {
    if (!sessionId) return;

    try {
      const response = await fetch('/api/v1/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          eventType,
          eventData,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
        }),
      });

      if (response.ok) {
        console.log('✅ Evento registrado:', eventType);
      }
    } catch (error) {
      console.error('❌ Error al registrar evento:', error);
    }
  };

  return {
    sessionId,
    isTracking,
    trackVisit,
    updateSession,
    trackEvent,
  };
}

// Funciones auxiliares
function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);

  return {
    type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
    browser: getBrowser(),
    os: getOS(),
  };
}

function getBrowser(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function getOS(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

function getScreenInfo() {
  return {
    resolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
}
```

### Uso en Componentes

```tsx
// components/PageTracker.tsx
import { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface PageTrackerProps {
  page: string;
}

export function PageTracker({ page }: PageTrackerProps) {
  const { trackVisit, updateSession, trackEvent } = useAnalytics();

  useEffect(() => {
    // Registrar visita al cargar la página
    trackVisit(page);

    // Configurar tracking de scroll
    let scrollDepth = 0;
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const newScrollDepth = Math.round((currentScroll / maxScroll) * 100);
      
      if (newScrollDepth > scrollDepth) {
        scrollDepth = newScrollDepth;
        
        // Enviar evento de scroll cada 25%
        if (scrollDepth % 25 === 0) {
          trackEvent('scroll', { 
            depth: scrollDepth,
            target: `${scrollDepth}%` 
          });
        }
      }
    };

    // Configurar tracking de tiempo
    const startTime = Date.now();
    let sectionsViewed: string[] = [];

    // Observer para secciones vistas
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.className;
          if (!sectionsViewed.includes(sectionId)) {
            sectionsViewed.push(sectionId);
            trackEvent('section_view', { section: sectionId });
          }
        }
      });
    });

    // Observar todas las secciones
    document.querySelectorAll('section, .section, [data-section]').forEach((section) => {
      sectionObserver.observe(section);
    });

    // Limpiar al salir de la página
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      
      updateSession({
        exitTime: new Date().toISOString(),
        duration,
        scrollDepth,
        sectionsViewed,
        interactions: [], // Se pueden agregar más interacciones aquí
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sectionObserver.disconnect();
    };
  }, [page, trackVisit, updateSession, trackEvent]);

  return null; // Este componente no renderiza nada
}
```

### Uso en App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { PageTracker } from '../components/PageTracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <PageTracker page={window.location.pathname} />
        {children}
      </body>
    </html>
  );
}
```

### Tracking de Eventos Específicos

```tsx
// components/DownloadButton.tsx
import { useAnalytics } from '../hooks/useAnalytics';

interface DownloadButtonProps {
  fileName: string;
  fileUrl: string;
}

export function DownloadButton({ fileName, fileUrl }: DownloadButtonProps) {
  const { trackEvent } = useAnalytics();

  const handleDownload = async () => {
    // Registrar el evento
    await trackEvent('download_brochure', {
      fileName,
      fileSize: '2.5MB', // Si tienes esta info
      downloadUrl: fileUrl,
    });

    // Procesar la descarga
    window.open(fileUrl, '_blank');
  };

  return (
    <button onClick={handleDownload}>
      Descargar {fileName}
    </button>
  );
}
```

### Tracking de Formularios

```tsx
// components/ContactForm.tsx
import { useAnalytics } from '../hooks/useAnalytics';

export function ContactForm() {
  const { trackEvent } = useAnalytics();

  const handleSubmit = async (formData: FormData) => {
    // Registrar evento de envío
    await trackEvent('form_submitted', {
      formType: 'contact',
      fields: ['name', 'email', 'phone', 'message'],
      source: 'contact-page',
    });

    // Procesar el formulario
    // ...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
```

---

## 🎯 Flujo Completo de Tracking

1. **Al cargar la página:**
   - Generar o recuperar `sessionId`
   - Llamar a `trackVisit()`
   - Configurar listeners para scroll y tiempo

2. **Durante la navegación:**
   - Trackear eventos de scroll
   - Trackear secciones vistas
   - Trackear clicks en botones/links importantes

3. **Al salir de la página:**
   - Llamar a `updateSession()` con datos finales
   - Incluir duración, scroll depth, secciones vistas

4. **Eventos personalizados:**
   - Usar `trackEvent()` para acciones específicas
   - Descargas, formularios, clicks en CTAs, etc.

---

## 📊 Ejemplo de SessionId Generado

```typescript
// Frontend genera:
const sessionId = "1703001234567-abc123def";

// Backend recibe y guarda:
{
  "sessionId": "1703001234567-abc123def",
  "page": "/es",
  "timestamp": "2025-10-10T02:17:24.378Z",
  // ... otros datos
}
```

---

## ⚠️ Consideraciones Importantes

1. **Unicidad**: El backend valida que el `sessionId` sea único
2. **Persistencia**: Guardar en localStorage para reutilizar en la misma sesión
3. **Limpieza**: Considerar limpiar localStorage después de X días
4. **Fallback**: Si no se puede generar sessionId, no enviar la visita
5. **Privacidad**: El sessionId no debe contener información personal

---

**🚀 ¡Listo para implementar analytics en tu frontend!**
