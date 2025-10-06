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

  // Crear 12 categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'consultoria-empresarial' },
      update: {},
      create: {
        name: 'Consultoría Empresarial',
        slug: 'consultoria-empresarial',
        description: 'Estrategias y soluciones para el crecimiento empresarial',
        color: '#3b82f6',
        icon: '🏢',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'finanzas-corporativas' },
      update: {},
      create: {
        name: 'Finanzas Corporativas',
        slug: 'finanzas-corporativas',
        description: 'Gestión financiera y análisis de inversiones',
        color: '#10b981',
        icon: '💰',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'recursos-humanos' },
      update: {},
      create: {
        name: 'Recursos Humanos',
        slug: 'recursos-humanos',
        description: 'Gestión de talento y desarrollo organizacional',
        color: '#f59e0b',
        icon: '👥',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'marketing-digital' },
      update: {},
      create: {
        name: 'Marketing Digital',
        slug: 'marketing-digital',
        description: 'Estrategias de marketing y presencia digital',
        color: '#ef4444',
        icon: '📱',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tecnologia-innovacion' },
      update: {},
      create: {
        name: 'Tecnología e Innovación',
        slug: 'tecnologia-innovacion',
        description: 'Transformación digital y nuevas tecnologías',
        color: '#8b5cf6',
        icon: '🚀',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'operaciones-logistica' },
      update: {},
      create: {
        name: 'Operaciones y Logística',
        slug: 'operaciones-logistica',
        description: 'Optimización de procesos y cadena de suministro',
        color: '#06b6d4',
        icon: '📦',
        sortOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'ventas-comercial' },
      update: {},
      create: {
        name: 'Ventas y Comercial',
        slug: 'ventas-comercial',
        description: 'Estrategias de ventas y desarrollo comercial',
        color: '#84cc16',
        icon: '💼',
        sortOrder: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'calidad-procesos' },
      update: {},
      create: {
        name: 'Calidad y Procesos',
        slug: 'calidad-procesos',
        description: 'Mejora continua y gestión de calidad',
        color: '#f97316',
        icon: '⭐',
        sortOrder: 8,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'liderazgo-gestion' },
      update: {},
      create: {
        name: 'Liderazgo y Gestión',
        slug: 'liderazgo-gestion',
        description: 'Desarrollo de liderazgo y habilidades directivas',
        color: '#ec4899',
        icon: '👑',
        sortOrder: 9,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sostenibilidad-rse' },
      update: {},
      create: {
        name: 'Sostenibilidad y RSE',
        slug: 'sostenibilidad-rse',
        description: 'Responsabilidad social y sostenibilidad empresarial',
        color: '#22c55e',
        icon: '🌱',
        sortOrder: 10,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'analisis-datos' },
      update: {},
      create: {
        name: 'Análisis de Datos',
        slug: 'analisis-datos',
        description: 'Business Intelligence y análisis de datos',
        color: '#6366f1',
        icon: '📊',
        sortOrder: 11,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'compliance-legal' },
      update: {},
      create: {
        name: 'Compliance y Legal',
        slug: 'compliance-legal',
        description: 'Cumplimiento normativo y asuntos legales',
        color: '#64748b',
        icon: '⚖️',
        sortOrder: 12,
      },
    }),
  ]);

  console.log('✅ 12 categorías creadas');

  // Crear 15 posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'estrategias-crecimiento-empresarial' },
      update: {},
      create: {
        title: 'Estrategias de Crecimiento Empresarial Sostenible',
        slug: 'estrategias-crecimiento-empresarial',
        content: `
<h1>Estrategias de Crecimiento Empresarial Sostenible</h1>

<p>El crecimiento empresarial sostenible requiere una combinación de estrategias financieras, operativas y de mercado. Te presentamos las mejores prácticas para expandir tu negocio de manera responsable.</p>

<h2>Análisis del Mercado</h2>
<p>Antes de expandir, es crucial entender el mercado objetivo y las oportunidades disponibles.</p>

<h2>Financiamiento del Crecimiento</h2>
<p>Exploramos las diferentes opciones de financiamiento para sustentar el crecimiento empresarial.</p>

<h2>Optimización de Procesos</h2>
<p>La eficiencia operativa es fundamental para sostener el crecimiento a largo plazo.</p>
        `,
        excerpt:
          'Descubre las mejores estrategias para hacer crecer tu empresa de manera sostenible y responsable.',
        featuredImage:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        status: 'PUBLISHED',
        isPinned: true,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-01-15'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'transformacion-digital-empresas' },
      update: {},
      create: {
        title: 'Transformación Digital: Guía Completa para Empresas',
        slug: 'transformacion-digital-empresas',
        content: `
<h1>Transformación Digital: Guía Completa para Empresas</h1>

<p>La transformación digital ya no es opcional, es una necesidad para mantenerse competitivo en el mercado actual.</p>

<h2>Evaluación del Estado Actual</h2>
<p>Primer paso: evaluar la madurez digital de tu organización.</p>

<h2>Roadmap de Transformación</h2>
<p>Cómo crear un plan estratégico para la transformación digital.</p>

<h2>Tecnologías Clave</h2>
<p>Las tecnologías que están marcando la diferencia en la industria.</p>
        `,
        excerpt:
          'Una guía completa para liderar la transformación digital en tu empresa.',
        featuredImage:
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-01-20'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'gestion-talento-humano' },
      update: {},
      create: {
        title: 'Gestión de Talento Humano en la Era Digital',
        slug: 'gestion-talento-humano',
        content: `
<h1>Gestión de Talento Humano en la Era Digital</h1>

<p>La gestión del talento humano evoluciona constantemente. Descubre las nuevas tendencias y mejores prácticas.</p>

<h2>Atracción de Talento</h2>
<p>Estrategias modernas para atraer los mejores profesionales.</p>

<h2>Retención y Desarrollo</h2>
<p>Cómo mantener y desarrollar el talento dentro de la organización.</p>

<h2>Tecnología en RRHH</h2>
<p>Herramientas digitales que están revolucionando la gestión de personas.</p>
        `,
        excerpt:
          'Las mejores prácticas para gestionar el talento humano en la era digital.',
        featuredImage:
          'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-01-25'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'marketing-digital-estrategias' },
      update: {},
      create: {
        title: 'Marketing Digital: Estrategias que Funcionan',
        slug: 'marketing-digital-estrategias',
        content: `
<h1>Marketing Digital: Estrategias que Funcionan</h1>

<p>El marketing digital ofrece infinitas posibilidades. Te mostramos las estrategias más efectivas.</p>

<h2>Content Marketing</h2>
<p>Cómo crear contenido que genere engagement y conversiones.</p>

<h2>SEO y SEM</h2>
<p>Optimización para motores de búsqueda y publicidad online.</p>

<h2>Redes Sociales</h2>
<p>Estrategias para maximizar el impacto en redes sociales.</p>
        `,
        excerpt:
          'Descubre las estrategias de marketing digital más efectivas para tu empresa.',
        featuredImage:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-02-01'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'finanzas-corporativas-modernas' },
      update: {},
      create: {
        title: 'Finanzas Corporativas Modernas',
        slug: 'finanzas-corporativas-modernas',
        content: `
<h1>Finanzas Corporativas Modernas</h1>

<p>Las finanzas corporativas han evolucionado significativamente. Conoce las nuevas tendencias y herramientas.</p>

<h2>Análisis Financiero</h2>
<p>Métricas clave para evaluar la salud financiera de la empresa.</p>

<h2>Gestión de Riesgos</h2>
<p>Cómo identificar y mitigar riesgos financieros.</p>

<h2>Fintech y Innovación</h2>
<p>El impacto de la tecnología en las finanzas corporativas.</p>
        `,
        excerpt:
          'Las tendencias más importantes en finanzas corporativas modernas.',
        featuredImage:
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-02-05'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'liderazgo-transformacional' },
      update: {},
      create: {
        title: 'Liderazgo Transformacional en las Organizaciones',
        slug: 'liderazgo-transformacional',
        content: `
<h1>Liderazgo Transformacional en las Organizaciones</h1>

<p>El liderazgo transformacional es clave para el éxito organizacional. Descubre sus características y beneficios.</p>

<h2>Características del Líder Transformacional</h2>
<p>Los rasgos que definen a un líder transformacional efectivo.</p>

<h2>Impacto en la Organización</h2>
<p>Cómo el liderazgo transformacional impacta positivamente en los resultados.</p>

<h2>Desarrollo de Liderazgo</h2>
<p>Estrategias para desarrollar habilidades de liderazgo transformacional.</p>
        `,
        excerpt:
          'Todo sobre el liderazgo transformacional y su impacto en las organizaciones.',
        featuredImage:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-02-10'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'optimizacion-procesos-operativos' },
      update: {},
      create: {
        title: 'Optimización de Procesos Operativos',
        slug: 'optimizacion-procesos-operativos',
        content: `
<h1>Optimización de Procesos Operativos</h1>

<p>La optimización de procesos es fundamental para mejorar la eficiencia y reducir costos operativos.</p>

<h2>Metodologías de Optimización</h2>
<p>Lean, Six Sigma y otras metodologías probadas para optimizar procesos.</p>

<h2>Herramientas de Análisis</h2>
<p>Las mejores herramientas para analizar y mejorar procesos operativos.</p>

<h2>Casos de Éxito</h2>
<p>Ejemplos reales de optimización de procesos en diferentes industrias.</p>
        `,
        excerpt: 'Aprende a optimizar los procesos operativos de tu empresa.',
        featuredImage:
          'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-02-15'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'ventas-digitales-estrategias' },
      update: {},
      create: {
        title: 'Estrategias de Ventas Digitales',
        slug: 'ventas-digitales-estrategias',
        content: `
<h1>Estrategias de Ventas Digitales</h1>

<p>El mundo de las ventas ha cambiado radicalmente. Descubre las nuevas estrategias digitales.</p>

<h2>Prospección Digital</h2>
<p>Cómo encontrar y contactar prospectos de manera efectiva.</p>

<h2>CRM y Automatización</h2>
<p>Herramientas para gestionar y automatizar el proceso de ventas.</p>

<h2>Ventas Consultivas</h2>
<p>El enfoque consultivo en la era digital.</p>
        `,
        excerpt: 'Las mejores estrategias para vender en el mundo digital.',
        featuredImage:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-02-20'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'calidad-total-empresas' },
      update: {},
      create: {
        title: 'Gestión de Calidad Total en las Empresas',
        slug: 'calidad-total-empresas',
        content: `
<h1>Gestión de Calidad Total en las Empresas</h1>

<p>La calidad total es un enfoque integral que involucra a toda la organización en la mejora continua.</p>

<h2>Principios de Calidad Total</h2>
<p>Los fundamentos de la gestión de calidad total.</p>

<h2>Herramientas de Calidad</h2>
<p>Las herramientas más efectivas para implementar calidad total.</p>

<h2>Certificaciones ISO</h2>
<p>Cómo las certificaciones ISO pueden mejorar la gestión de calidad.</p>
        `,
        excerpt:
          'Todo sobre la implementación de calidad total en las empresas.',
        featuredImage:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-02-25'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'sostenibilidad-empresarial' },
      update: {},
      create: {
        title: 'Sostenibilidad Empresarial: Más Allá del Greenwashing',
        slug: 'sostenibilidad-empresarial',
        content: `
<h1>Sostenibilidad Empresarial: Más Allá del Greenwashing</h1>

<p>La sostenibilidad empresarial real va más allá de las campañas de marketing. Descubre cómo implementarla correctamente.</p>

<h2>ESG y Sostenibilidad</h2>
<p>Los criterios ESG y su impacto en la sostenibilidad empresarial.</p>

<h2>Economía Circular</h2>
<p>Cómo implementar principios de economía circular en tu empresa.</p>

<h2>Medición de Impacto</h2>
<p>Métricas para medir el impacto real de las iniciativas de sostenibilidad.</p>
        `,
        excerpt: 'Cómo implementar sostenibilidad empresarial real y medible.',
        featuredImage:
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-03-01'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'business-intelligence-datos' },
      update: {},
      create: {
        title: 'Business Intelligence: Transformando Datos en Decisiones',
        slug: 'business-intelligence-datos',
        content: `
<h1>Business Intelligence: Transformando Datos en Decisiones</h1>

<p>El Business Intelligence es clave para tomar decisiones basadas en datos. Aprende a implementarlo correctamente.</p>

<h2>Arquitectura de BI</h2>
<p>Cómo diseñar una arquitectura de Business Intelligence efectiva.</p>

<h2>Visualización de Datos</h2>
<p>Las mejores prácticas para visualizar datos de manera efectiva.</p>

<h2>Analytics Predictivo</h2>
<p>Cómo usar analytics predictivo para anticipar tendencias.</p>
        `,
        excerpt:
          'Todo sobre Business Intelligence y cómo transformar datos en decisiones estratégicas.',
        featuredImage:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-03-05'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'compliance-empresarial' },
      update: {},
      create: {
        title: 'Compliance Empresarial: Cumplimiento Normativo',
        slug: 'compliance-empresarial',
        content: `
<h1>Compliance Empresarial: Cumplimiento Normativo</h1>

<p>El compliance empresarial es fundamental para operar de manera legal y ética. Descubre cómo implementarlo.</p>

<h2>Marco Normativo</h2>
<p>Los principales marcos normativos que afectan a las empresas.</p>

<h2>Programa de Compliance</h2>
<p>Cómo diseñar e implementar un programa de compliance efectivo.</p>

<h2>Gestión de Riesgos</h2>
<p>Cómo identificar y gestionar riesgos de compliance.</p>
        `,
        excerpt: 'Todo sobre compliance empresarial y cumplimiento normativo.',
        featuredImage:
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-03-10'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'innovacion-tecnologica-empresas' },
      update: {},
      create: {
        title: 'Innovación Tecnológica en las Empresas',
        slug: 'innovacion-tecnologica-empresas',
        content: `
<h1>Innovación Tecnológica en las Empresas</h1>

<p>La innovación tecnológica es clave para mantenerse competitivo. Descubre cómo fomentarla en tu organización.</p>

<h2>Cultura de Innovación</h2>
<p>Cómo crear una cultura que fomente la innovación tecnológica.</p>

<h2>Tecnologías Emergentes</h2>
<p>Las tecnologías que están transformando las empresas.</p>

<h2>ROI de la Innovación</h2>
<p>Cómo medir el retorno de la inversión en innovación tecnológica.</p>
        `,
        excerpt: 'Cómo fomentar la innovación tecnológica en tu empresa.',
        featuredImage:
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-03-15'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'logistica-cadena-suministro' },
      update: {},
      create: {
        title: 'Logística y Cadena de Suministro Optimizada',
        slug: 'logistica-cadena-suministro',
        content: `
<h1>Logística y Cadena de Suministro Optimizada</h1>

<p>Una cadena de suministro optimizada puede ser la diferencia entre el éxito y el fracaso empresarial.</p>

<h2>Optimización de Inventarios</h2>
<p>Cómo optimizar los inventarios para reducir costos y mejorar el servicio.</p>

<h2>Logística Verde</h2>
<p>Estrategias para hacer la logística más sostenible y eficiente.</p>

<h2>Tecnología en Logística</h2>
<p>Las tecnologías que están revolucionando la logística y cadena de suministro.</p>
        `,
        excerpt:
          'Cómo optimizar la logística y cadena de suministro de tu empresa.',
        featuredImage:
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-03-20'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'cultura-organizacional-fuerte' },
      update: {},
      create: {
        title: 'Construyendo una Cultura Organizacional Fuerte',
        slug: 'cultura-organizacional-fuerte',
        content: `
<h1>Construyendo una Cultura Organizacional Fuerte</h1>

<p>Una cultura organizacional fuerte es la base del éxito empresarial a largo plazo.</p>

<h2>Elementos de la Cultura</h2>
<p>Los elementos fundamentales que definen la cultura organizacional.</p>

<h2>Cambio Cultural</h2>
<p>Cómo liderar el cambio cultural en las organizaciones.</p>

<h2>Medición de Cultura</h2>
<p>Herramientas para medir y evaluar la cultura organizacional.</p>
        `,
        excerpt: 'Cómo construir y mantener una cultura organizacional fuerte.',
        featuredImage:
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date('2024-03-25'),
        authorId: admin.id,
      },
    }),
  ]);

  console.log('✅ 15 posts creados');

  // Asignar categorías a los posts
  const postCategoryAssignments = [
    // Post 1: Estrategias de crecimiento
    {
      postSlug: 'estrategias-crecimiento-empresarial',
      categorySlugs: ['consultoria-empresarial', 'liderazgo-gestion'],
    },
    // Post 2: Transformación digital
    {
      postSlug: 'transformacion-digital-empresas',
      categorySlugs: ['tecnologia-innovacion', 'consultoria-empresarial'],
    },
    // Post 3: Gestión de talento
    {
      postSlug: 'gestion-talento-humano',
      categorySlugs: ['recursos-humanos', 'liderazgo-gestion'],
    },
    // Post 4: Marketing digital
    {
      postSlug: 'marketing-digital-estrategias',
      categorySlugs: ['marketing-digital', 'ventas-comercial'],
    },
    // Post 5: Finanzas corporativas
    {
      postSlug: 'finanzas-corporativas-modernas',
      categorySlugs: ['finanzas-corporativas', 'analisis-datos'],
    },
    // Post 6: Liderazgo transformacional
    {
      postSlug: 'liderazgo-transformacional',
      categorySlugs: ['liderazgo-gestion', 'recursos-humanos'],
    },
    // Post 7: Optimización de procesos
    {
      postSlug: 'optimizacion-procesos-operativos',
      categorySlugs: ['operaciones-logistica', 'calidad-procesos'],
    },
    // Post 8: Ventas digitales
    {
      postSlug: 'ventas-digitales-estrategias',
      categorySlugs: ['ventas-comercial', 'marketing-digital'],
    },
    // Post 9: Calidad total
    {
      postSlug: 'calidad-total-empresas',
      categorySlugs: ['calidad-procesos', 'operaciones-logistica'],
    },
    // Post 10: Sostenibilidad
    {
      postSlug: 'sostenibilidad-empresarial',
      categorySlugs: ['sostenibilidad-rse', 'compliance-legal'],
    },
    // Post 11: Business Intelligence
    {
      postSlug: 'business-intelligence-datos',
      categorySlugs: ['analisis-datos', 'tecnologia-innovacion'],
    },
    // Post 12: Compliance
    {
      postSlug: 'compliance-empresarial',
      categorySlugs: ['compliance-legal', 'sostenibilidad-rse'],
    },
    // Post 13: Innovación tecnológica
    {
      postSlug: 'innovacion-tecnologica-empresas',
      categorySlugs: ['tecnologia-innovacion', 'analisis-datos'],
    },
    // Post 14: Logística
    {
      postSlug: 'logistica-cadena-suministro',
      categorySlugs: ['operaciones-logistica', 'calidad-procesos'],
    },
    // Post 15: Cultura organizacional
    {
      postSlug: 'cultura-organizacional-fuerte',
      categorySlugs: ['liderazgo-gestion', 'recursos-humanos'],
    },
  ];

  for (const assignment of postCategoryAssignments) {
    const post = posts.find((p) => p.slug === assignment.postSlug);
    if (post) {
      for (const categorySlug of assignment.categorySlugs) {
        const category = categories.find((c) => c.slug === categorySlug);
        if (category) {
          await prisma.postCategory.upsert({
            where: {
              postId_categoryId: {
                postId: post.id,
                categoryId: category.id,
              },
            },
            update: {},
            create: {
              postId: post.id,
              categoryId: category.id,
            },
          });
        }
      }
    }
  }

  console.log('✅ Categorías asignadas a posts');

  // Crear comentarios para cada post (entre 5 y 10 comentarios por post)
  const commentAuthors = [
    {
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      website: 'https://mariagonzalez.com',
    },
    {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      website: 'https://carlosrodriguez.com',
    },
    {
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      website: 'https://anamartinez.com',
    },
    {
      name: 'Luis Fernández',
      email: 'luis.fernandez@email.com',
      website: 'https://luisfernandez.com',
    },
    {
      name: 'Sofia López',
      email: 'sofia.lopez@email.com',
      website: 'https://sofialopez.com',
    },
    {
      name: 'Diego Pérez',
      email: 'diego.perez@email.com',
      website: 'https://diegoperez.com',
    },
    {
      name: 'Laura Sánchez',
      email: 'laura.sanchez@email.com',
      website: 'https://laurasanchez.com',
    },
    {
      name: 'Miguel Torres',
      email: 'miguel.torres@email.com',
      website: 'https://migueltorres.com',
    },
    {
      name: 'Carmen Ruiz',
      email: 'carmen.ruiz@email.com',
      website: 'https://carmenruiz.com',
    },
    {
      name: 'Javier Morales',
      email: 'javier.morales@email.com',
      website: 'https://javiermorales.com',
    },
    {
      name: 'Isabel Jiménez',
      email: 'isabel.jimenez@email.com',
      website: 'https://isabeljimenez.com',
    },
    {
      name: 'Roberto Vargas',
      email: 'roberto.vargas@email.com',
      website: 'https://robertovargas.com',
    },
    {
      name: 'Patricia Herrera',
      email: 'patricia.herrera@email.com',
      website: 'https://patriciaherrera.com',
    },
    {
      name: 'Fernando Castro',
      email: 'fernando.castro@email.com',
      website: 'https://fernandocastro.com',
    },
    {
      name: 'Monica Vega',
      email: 'monica.vega@email.com',
      website: 'https://monicavega.com',
    },
  ];

  const commentTemplates = [
    'Excelente artículo, muy informativo y bien estructurado.',
    'Muy útil para mi trabajo, gracias por compartir esta información.',
    'Interesante perspectiva, nunca había pensado en este enfoque.',
    'Muy bien explicado, fácil de entender incluso para principiantes.',
    'Gracias por estos consejos prácticos, los implementaré en mi empresa.',
    'Excelente contenido, espero más artículos como este.',
    'Muy relevante para el mercado actual, gracias por la actualización.',
    'Buen análisis, me ayudó a entender mejor el tema.',
    'Información valiosa, definitivamente lo recomendaré a mis colegas.',
    'Muy completo el artículo, cubre todos los aspectos importantes.',
    'Excelente trabajo, se nota la experiencia en el tema.',
    'Muy práctico, puedo aplicar estos conceptos inmediatamente.',
    'Bien documentado y con ejemplos claros, felicitaciones.',
    'Muy interesante, me gustaría saber más sobre este tema.',
    'Excelente calidad de contenido, seguiré leyendo sus artículos.',
  ];

  for (const post of posts) {
    const numComments = Math.floor(Math.random() * 6) + 5; // Entre 5 y 10 comentarios

    for (let i = 0; i < numComments; i++) {
      const randomAuthor =
        commentAuthors[Math.floor(Math.random() * commentAuthors.length)];
      const randomTemplate =
        commentTemplates[Math.floor(Math.random() * commentTemplates.length)];

      await prisma.comment.create({
        data: {
          content: randomTemplate,
          authorName: randomAuthor.name,
          authorEmail: randomAuthor.email,
          authorWebsite: randomAuthor.website,
          status: Math.random() > 0.3 ? 'APPROVED' : 'PENDING', // 70% aprobados, 30% pendientes
          postId: post.id,
        },
      });
    }
  }

  console.log('✅ Comentarios creados para todos los posts');

  console.log('🎉 Seed completado exitosamente!');
  console.log(`📊 Resumen:`);
  console.log(`   - 1 usuario admin`);
  console.log(`   - 12 categorías`);
  console.log(`   - 15 posts`);
  console.log(`   - Comentarios: entre 5-10 por post`);
  console.log(`   - Visualizaciones: 0 para todos los posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });