import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Pass1234', 10);

  // Crear usuario admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@copexia.com' },
    update: {},
    create: {
      name: 'Admin Copexia',
      email: 'admin@copexia.com',
      password,
    },
  });

  console.log('✅ Usuario admin creado');

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tecnologia' },
      update: {},
      create: {
        name: 'Tecnología',
        slug: 'tecnologia',
        description: 'Artículos sobre tecnología, programación y desarrollo',
        color: '#3b82f6',
        icon: '💻',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'negocios' },
      update: {},
      create: {
        name: 'Negocios',
        slug: 'negocios',
        description: 'Estrategias de negocio y emprendimiento',
        color: '#10b981',
        icon: '💼',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'productividad' },
      update: {},
      create: {
        name: 'Productividad',
        slug: 'productividad',
        description: 'Tips y herramientas para mejorar la productividad',
        color: '#f59e0b',
        icon: '⚡',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutoriales' },
      update: {},
      create: {
        name: 'Tutoriales',
        slug: 'tutoriales',
        description: 'Guías paso a paso y tutoriales prácticos',
        color: '#8b5cf6',
        icon: '📚',
        sortOrder: 4,
      },
    }),
  ]);

  console.log('✅ Categorías creadas');

  // Crear posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'introduccion-a-nestjs' },
      update: {},
      create: {
        title: 'Introducción a NestJS: El Framework de Node.js',
        slug: 'introduccion-a-nestjs',
        content: `
# Introducción a NestJS

NestJS es un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables. Utiliza TypeScript por defecto y está construido sobre Express (por defecto) y opcionalmente puede usar Fastify.

## Características principales

- **Arquitectura modular**: Organiza tu código en módulos reutilizables
- **TypeScript**: Soporte completo para TypeScript
- **Decoradores**: Utiliza decoradores para definir rutas, controladores y servicios
- **Inyección de dependencias**: Sistema robusto de DI integrado
- **Microservicios**: Soporte nativo para microservicios

## Ejemplo básico

\`\`\`typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }
}
\`\`\`

NestJS te permite crear aplicaciones robustas y mantenibles con una curva de aprendizaje suave.
        `,
        excerpt:
          'Aprende los fundamentos de NestJS, el framework de Node.js que está revolucionando el desarrollo backend.',
        featuredImage:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        status: 'PUBLISHED',
        isPinned: true,
        viewCount: 1250,
        likeCount: 89,
        commentCount: 12,
        publishedAt: new Date('2024-01-15'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'estrategias-marketing-digital' },
      update: {},
      create: {
        title: 'Estrategias de Marketing Digital para Emprendedores',
        slug: 'estrategias-marketing-digital',
        content: `
# Estrategias de Marketing Digital para Emprendedores

El marketing digital se ha convertido en una herramienta esencial para cualquier emprendimiento moderno. Aquí te comparto las estrategias más efectivas:

## 1. SEO (Search Engine Optimization)

- Investigación de palabras clave
- Optimización de contenido
- Link building
- Experiencia de usuario

## 2. Marketing en Redes Sociales

- Contenido de valor
- Engagement con la audiencia
- Publicidad dirigida
- Influencer marketing

## 3. Email Marketing

- Listas segmentadas
- Automatización
- Personalización
- Análisis de métricas

## 4. Marketing de Contenidos

- Blog corporativo
- Videos educativos
- Podcasts
- Webinars

La clave está en la consistencia y el análisis constante de resultados.
        `,
        excerpt:
          'Descubre las estrategias de marketing digital más efectivas para hacer crecer tu emprendimiento.',
        featuredImage:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 890,
        likeCount: 67,
        commentCount: 8,
        publishedAt: new Date('2024-01-20'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'herramientas-productividad-2024' },
      update: {},
      create: {
        title: 'Las Mejores Herramientas de Productividad para 2024',
        slug: 'herramientas-productividad-2024',
        content: `
# Las Mejores Herramientas de Productividad para 2024

La productividad personal es clave para el éxito profesional. Aquí tienes las herramientas más efectivas:

## Gestión de Tareas

- **Notion**: Todo-en-uno para notas, tareas y proyectos
- **Todoist**: Gestión de tareas simple y efectiva
- **Asana**: Para equipos y proyectos complejos

## Gestión del Tiempo

- **RescueTime**: Análisis automático del tiempo
- **Toggl**: Tracking de tiempo por proyecto
- **Forest**: Técnica Pomodoro gamificada

## Comunicación

- **Slack**: Comunicación empresarial
- **Zoom**: Videollamadas profesionales
- **Loom**: Grabación de pantalla rápida

## Organización

- **Obsidian**: Base de conocimiento personal
- **Evernote**: Captura de ideas
- **Google Workspace**: Suite completa

Elige las que mejor se adapten a tu flujo de trabajo.
        `,
        excerpt:
          'Descubre las herramientas más efectivas para maximizar tu productividad en 2024.',
        featuredImage:
          'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 654,
        likeCount: 45,
        commentCount: 6,
        publishedAt: new Date('2024-01-25'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'tutorial-prisma-nestjs' },
      update: {},
      create: {
        title: 'Tutorial: Integrando Prisma con NestJS',
        slug: 'tutorial-prisma-nestjs',
        content: `
# Tutorial: Integrando Prisma con NestJS

Prisma es un ORM moderno que se integra perfectamente con NestJS. Te muestro cómo configurarlo paso a paso.

## 1. Instalación

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## 2. Configuración del Schema

\`\`\`prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
\`\`\`

## 3. Servicio en NestJS

\`\`\`typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
\`\`\`

## 4. Uso en Controladores

\`\`\`typescript
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.user.findMany();
  }
}
\`\`\`

¡Y listo! Ya tienes Prisma funcionando con NestJS.
        `,
        excerpt:
          'Aprende a integrar Prisma ORM con NestJS de manera efectiva en este tutorial paso a paso.',
        featuredImage:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 432,
        likeCount: 34,
        commentCount: 4,
        publishedAt: new Date('2024-01-30'),
        authorId: admin.id,
      },
    }),
  ]);

  console.log('✅ Posts creados');

  // Asignar categorías a posts
  await Promise.all([
    // Post 1: Tecnología + Tutoriales
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[0].id,
          categoryId: categories[0].id,
        },
      },
      update: {},
      create: {
        postId: posts[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[0].id,
          categoryId: categories[3].id,
        },
      },
      update: {},
      create: {
        postId: posts[0].id,
        categoryId: categories[3].id,
      },
    }),

    // Post 2: Negocios
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[1].id,
          categoryId: categories[1].id,
        },
      },
      update: {},
      create: {
        postId: posts[1].id,
        categoryId: categories[1].id,
      },
    }),

    // Post 3: Productividad
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[2].id,
          categoryId: categories[2].id,
        },
      },
      update: {},
      create: {
        postId: posts[2].id,
        categoryId: categories[2].id,
      },
    }),

    // Post 4: Tecnología + Tutoriales
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[3].id,
          categoryId: categories[0].id,
        },
      },
      update: {},
      create: {
        postId: posts[3].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[3].id,
          categoryId: categories[3].id,
        },
      },
      update: {},
      create: {
        postId: posts[3].id,
        categoryId: categories[3].id,
      },
    }),
  ]);

  console.log('✅ Categorías asignadas a posts');

  // Crear comentarios de ejemplo
  await Promise.all([
    prisma.comment.create({
      data: {
        content:
          'Excelente artículo! NestJS realmente simplifica mucho el desarrollo backend. ¿Tienes algún tutorial sobre microservicios?',
        authorName: 'Carlos Mendoza',
        authorEmail: 'carlos.mendoza@email.com',
        authorWebsite: 'https://carlosdev.com',
        status: 'APPROVED',
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Muy útil la información sobre marketing digital. Estoy empezando mi emprendimiento y esto me ayuda mucho.',
        authorName: 'Ana García',
        authorEmail: 'ana.garcia@email.com',
        status: 'APPROVED',
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Notion es increíble! Lo uso para todo. ¿Recomiendas alguna alternativa gratuita?',
        authorName: 'Miguel Torres',
        authorEmail: 'miguel.torres@email.com',
        status: 'PENDING',
        postId: posts[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Perfecto tutorial! Prisma es una herramienta muy potente. Gracias por compartir.',
        authorName: 'Laura Sánchez',
        authorEmail: 'laura.sanchez@email.com',
        status: 'APPROVED',
        postId: posts[3].id,
      },
    }),
  ]);

  console.log('✅ Comentarios creados');

  console.log('🎉 Seed completo ejecutado correctamente!');
  console.log('📧 Usuario admin: admin@copexia.com');
  console.log('🔑 Contraseña: Pass1234');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
