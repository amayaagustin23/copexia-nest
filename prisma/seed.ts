// prisma/seed.ts
import { PostStatus, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
  const password = await bcrypt.hash('Pass1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password,
      role: Role.ADMIN,
    },
  });

  console.log('👤 Admin seed: admin@example.com / Pass1234');
}

const categories = [
  {
    name: 'Novedades',
    slug: 'novedades',
    description:
      'Actualizaciones y anuncios importantes sobre Copexia y nuestros servicios.',
  },
  {
    name: 'Servicios',
    slug: 'servicios',
    description:
      'Publicaciones relacionadas a los servicios que brinda Copexia.',
  },
  {
    name: 'Casos de éxito',
    slug: 'casos-de-exito',
    description:
      'Historias reales de proyectos y resultados alcanzados con nuestros clientes.',
  },
  {
    name: 'Investigación',
    slug: 'investigacion',
    description:
      'Artículos, hallazgos y aprendizajes de nuestras líneas de investigación.',
  },
  {
    name: 'Eventos',
    slug: 'eventos',
    description:
      'Charlas, workshops y encuentros en los que participamos o organizamos.',
  },
  {
    name: 'Comunicados',
    slug: 'comunicados',
    description: 'Comunicaciones institucionales y notas de prensa de Copexia.',
  },
] as const;

const posts = [
  {
    title: 'Lanzamiento del foro de Copexia',
    slug: 'lanzamiento-del-foro-de-copexia',
    excerpt:
      'Presentamos nuestro nuevo espacio para compartir novedades, investigaciones y casos reales.',
    contentHtml: `
      <h1>Lanzamiento del foro de Copexia</h1>
      <p>Bienvenidos al nuevo foro de <strong>Copexia</strong>. 
      Aquí publicaremos <em>novedades</em>, investigaciones y mejores prácticas.</p>
      <p>Te invitamos a explorar las categorías y seguir las publicaciones.</p>
    `,
    status: PostStatus.PUBLISHED,
    categorySlug: 'novedades',
    // publishedAt se setea automático si no lo pasás (ver función seedPosts)
  },
  {
    title: 'Cómo medimos la adopción tecnológica',
    slug: 'como-medimos-la-adopcion-tecnologica',
    excerpt:
      'Un marco práctico para medir adopción tecnológica en organizaciones.',
    contentHtml: `
      <h1>Cómo medimos la adopción tecnológica</h1>
      <p>Nuestro enfoque integra métricas cuantitativas y cualitativas, con foco en impacto.</p>
      <ul>
        <li>Indicadores de uso</li>
        <li>Encuestas de satisfacción</li>
        <li>Resultados de negocio</li>
      </ul>
    `,
    status: PostStatus.PUBLISHED,
    categorySlug: 'servicios',
  },
  {
    title: 'Caso de éxito: optimización de reportes en Power BI',
    slug: 'caso-exito-optimizacion-powerbi',
    excerpt:
      'Reducimos tiempos de actualización y mejoramos performance de dashboards críticos.',
    contentHtml: `
      <h1>Caso de éxito: Power BI</h1>
      <p>Optimizamos modelos y queries, logrando mejoras de rendimiento de hasta 60%.</p>
      <p>Claves: modelado tabular, particionado y gobernanza de datos.</p>
    `,
    status: PostStatus.PUBLISHED,
    categorySlug: 'casos-de-exito',
  },
  {
    title: 'Roadmap de investigación 2025',
    slug: 'roadmap-investigacion-2025',
    excerpt: 'Líneas de investigación que estaremos impulsando durante el año.',
    contentHtml: `
      <h1>Roadmap de investigación 2025</h1>
      <p>Exploraremos analítica aumentada, MLOps ligero y métricas de adopción.</p>
    `,
    status: PostStatus.DRAFT,
    categorySlug: 'investigacion',
  },
] as const;

async function seedCategories() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
      },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
      },
    });
  }
  console.log(`📚 Categorías seed: ${categories.length} categorías`);
}

async function seedPosts() {
  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        contentHtml: p.contentHtml,
        status: p.status,
        publishedAt: p.status === PostStatus.PUBLISHED ? new Date() : null,
        category: { connect: { slug: p.categorySlug } }, // slug es @unique → se puede conectar por slug
      },
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        contentHtml: p.contentHtml,
        status: p.status,
        publishedAt: p.status === PostStatus.PUBLISHED ? new Date() : null,
        category: { connect: { slug: p.categorySlug } },
      },
    });
  }
  console.log(`📝 Posts seed: ${posts.length} publicaciones`);
}

async function main() {
  await seedAdmin();
  await seedCategories();
  await seedPosts();
  console.log('✅ Seed ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
