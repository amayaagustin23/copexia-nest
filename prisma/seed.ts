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
        description: 'Gestión del talento y desarrollo organizacional',
        color: '#f59e0b',
        icon: '👥',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'marketing-estrategico' },
      update: {},
      create: {
        name: 'Marketing Estratégico',
        slug: 'marketing-estrategico',
        description: 'Estrategias de marketing y posicionamiento de marca',
        color: '#8b5cf6',
        icon: '📈',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'operaciones' },
      update: {},
      create: {
        name: 'Operaciones',
        slug: 'operaciones',
        description: 'Optimización de procesos y eficiencia operativa',
        color: '#ef4444',
        icon: '⚙️',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'liderazgo' },
      update: {},
      create: {
        name: 'Liderazgo',
        slug: 'liderazgo',
        description: 'Desarrollo de liderazgo y gestión de equipos',
        color: '#06b6d4',
        icon: '🎯',
        sortOrder: 6,
      },
    }),
  ]);

  console.log('✅ Categorías creadas');

  // Crear posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'estrategia-crecimiento-empresarial' },
      update: {},
      create: {
        title: 'Estrategias de Crecimiento Empresarial: Guía Completa',
        slug: 'estrategia-crecimiento-empresarial',
        content: `
<h1>Estrategias de Crecimiento Empresarial: Guía Completa</h1>

<p>El crecimiento empresarial sostenible es el objetivo de toda organización. Te presentamos las estrategias más efectivas para escalar tu empresa de manera inteligente y rentable.</p>

<h2>Tipos de Crecimiento Empresarial</h2>

<ul>
  <li><strong>Crecimiento Orgánico</strong>: Expansión basada en recursos internos</li>
  <li><strong>Crecimiento por Adquisiciones</strong>: Compra de empresas competidoras o complementarias</li>
  <li><strong>Crecimiento por Alianzas</strong>: Partnerships estratégicos</li>
  <li><strong>Crecimiento Geográfico</strong>: Expansión a nuevos mercados</li>
</ul>

<h2>Factores Clave para el Crecimiento</h2>

<ol>
  <li><strong>Análisis de Mercado</strong>: Comprender las necesidades del cliente</li>
  <li><strong>Innovación Continua</strong>: Mantenerse a la vanguardia</li>
  <li><strong>Gestión del Talento</strong>: Contratar y retener a los mejores</li>
  <li><strong>Optimización de Procesos</strong>: Eficiencia operativa</li>
  <li><strong>Finanzas Sólidas</strong>: Gestión de capital y flujo de caja</li>
</ol>

<h2>Métricas de Crecimiento</h2>

<p>Para medir el éxito del crecimiento, es fundamental monitorear:</p>

<ul>
  <li>Ingresos recurrentes (ARR/MRR)</li>
  <li>Tasa de retención de clientes</li>
  <li>Crecimiento de empleados</li>
  <li>Participación de mercado</li>
  <li>ROI de inversiones</li>
</ul>

<p>Recuerda que el crecimiento sostenible requiere paciencia, planificación estratégica y ejecución disciplinada.</p>
        `,
        excerpt:
          'Descubre las estrategias más efectivas para hacer crecer tu empresa de manera sostenible y rentable.',
        featuredImage:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        status: 'PUBLISHED',
        isPinned: true,
        viewCount: 1850,
        likeCount: 124,
        publishedAt: new Date('2024-01-15'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'gestion-financiera-corporativa' },
      update: {},
      create: {
        title:
          'Gestión Financiera Corporativa: Fundamentos y Mejores Prácticas',
        slug: 'gestion-financiera-corporativa',
        content: `
<h1>Gestión Financiera Corporativa: Fundamentos y Mejores Prácticas</h1>

<p>La gestión financiera eficiente es el pilar fundamental de cualquier empresa exitosa. Te guiamos a través de los conceptos esenciales y estrategias probadas.</p>

<h2>Componentes Clave de la Gestión Financiera</h2>

<ul>
  <li><strong>Planificación Financiera</strong>: Presupuestos y proyecciones</li>
  <li><strong>Control de Costos</strong>: Optimización de gastos operativos</li>
  <li><strong>Gestión de Liquidez</strong>: Flujo de caja y capital de trabajo</li>
  <li><strong>Análisis de Rentabilidad</strong>: Métricas financieras clave</li>
</ul>

<h2>Herramientas de Análisis Financiero</h2>

<ol>
  <li><strong>Estado de Resultados</strong>: P&L para análisis de rentabilidad</li>
  <li><strong>Balance General</strong>: Posición financiera de la empresa</li>
  <li><strong>Flujo de Efectivo</strong>: Movimientos de dinero</li>
  <li><strong>Ratios Financieros</strong>: Indicadores de performance</li>
</ol>

<h2>Métricas Financieras Esenciales</h2>

<p>Para una gestión efectiva, monitorea constantemente:</p>

<ul>
  <li><strong>ROI (Retorno sobre Inversión)</strong>: Rentabilidad de inversiones</li>
  <li><strong>ROE (Retorno sobre Patrimonio)</strong>: Eficiencia del capital propio</li>
  <li><strong>Margen Bruto</strong>: Rentabilidad de productos/servicios</li>
  <li><strong>Razón Corriente</strong>: Capacidad de pago a corto plazo</li>
</ul>

<h2>Mejores Prácticas</h2>

<ul>
  <li>Mantén registros financieros actualizados</li>
  <li>Implementa controles internos robustos</li>
  <li>Diversifica fuentes de financiamiento</li>
  <li>Invierte en tecnología financiera</li>
  <li>Asesórate con expertos cuando sea necesario</li>
</ul>

<p>Una gestión financiera sólida no solo protege tu empresa, sino que la posiciona para el crecimiento sostenible.</p>
        `,
        excerpt:
          'Aprende los fundamentos de la gestión financiera corporativa y las mejores prácticas para optimizar tu empresa.',
        featuredImage:
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 1420,
        likeCount: 98,
        publishedAt: new Date('2024-01-20'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'gestion-talento-recursos-humanos' },
      update: {},
      create: {
        title: 'Gestión del Talento: Estrategias Modernas de RRHH',
        slug: 'gestion-talento-recursos-humanos',
        content: `
<h1>Gestión del Talento: Estrategias Modernas de RRHH</h1>

<p>En el mundo empresarial actual, el talento humano es el activo más valioso. Te presentamos las estrategias más efectivas para atraer, desarrollar y retener a los mejores profesionales.</p>

<h2>Estrategias de Atracción de Talento</h2>

<ul>
  <li><strong>Employer Branding</strong>: Construye una marca empleadora sólida</li>
  <li><strong>Recruitment Marketing</strong>: Promociona oportunidades de manera atractiva</li>
  <li><strong>Redes Profesionales</strong>: LinkedIn, eventos y networking</li>
  <li><strong>Programas de Referidos</strong>: Incentiva a empleados actuales</li>
</ul>

<h2>Desarrollo y Retención</h2>

<ol>
  <li><strong>Planes de Carrera</strong>: Rutas claras de crecimiento profesional</li>
  <li><strong>Capacitación Continua</strong>: Inversión en desarrollo de habilidades</li>
  <li><strong>Mentoría</strong>: Programas de acompañamiento</li>
  <li><strong>Reconocimiento</strong>: Sistemas de incentivos y valoración</li>
</ol>

<h2>Herramientas Tecnológicas para RRHH</h2>

<p>Las siguientes herramientas pueden transformar tu gestión de talento:</p>

<ul>
  <li><strong>ATS (Applicant Tracking Systems)</strong>: Gestión de candidatos</li>
  <li><strong>LMS (Learning Management Systems)</strong>: Plataformas de capacitación</li>
  <li><strong>Performance Management</strong>: Evaluación de desempeño</li>
  <li><strong>Employee Engagement</strong>: Medición de satisfacción laboral</li>
</ul>

<h2>Métricas Clave en RRHH</h2>

<ul>
  <li><strong>Time to Hire</strong>: Tiempo promedio de contratación</li>
  <li><strong>Turnover Rate</strong>: Tasa de rotación de personal</li>
  <li><strong>Employee Satisfaction</strong>: Nivel de satisfacción laboral</li>
  <li><strong>Training ROI</strong>: Retorno de inversión en capacitación</li>
</ul>

<p>Recuerda que una gestión efectiva del talento no solo mejora la productividad, sino que crea una cultura organizacional fuerte y sostenible.</p>
        `,
        excerpt:
          'Descubre las estrategias modernas de gestión del talento para atraer, desarrollar y retener a los mejores profesionales.',
        featuredImage:
          'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 1680,
        likeCount: 112,
        publishedAt: new Date('2024-01-25'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'marketing-estrategico-digital' },
      update: {},
      create: {
        title: 'Marketing Estratégico Digital: Guía para Empresas',
        slug: 'marketing-estrategico-digital',
        content: `
<h1>Marketing Estratégico Digital: Guía para Empresas</h1>

<p>En la era digital, el marketing estratégico es fundamental para el éxito empresarial. Te guiamos a través de las mejores prácticas y herramientas para maximizar tu presencia digital.</p>

<h2>Pilares del Marketing Digital Estratégico</h2>

<ul>
  <li><strong>Análisis de Audiencia</strong>: Conoce a tu cliente ideal</li>
  <li><strong>Posicionamiento de Marca</strong>: Diferenciación en el mercado</li>
  <li><strong>Estrategia de Contenido</strong>: Valor para tu audiencia</li>
  <li><strong>Canales de Distribución</strong>: Dónde y cómo comunicar</li>
</ul>

<h2>Herramientas Esenciales</h2>

<ol>
  <li><strong>Google Analytics</strong>: Análisis de tráfico web</li>
  <li><strong>SEMrush/Ahrefs</strong>: Investigación de keywords y competencia</li>
  <li><strong>HubSpot/Salesforce</strong>: CRM y automatización</li>
  <li><strong>Hootsuite/Buffer</strong>: Gestión de redes sociales</li>
</ol>

<h2>Métricas Clave a Monitorear</h2>

<p>Para medir el éxito de tu estrategia digital:</p>

<ul>
  <li><strong>ROI de Marketing</strong>: Retorno de inversión</li>
  <li><strong>CAC (Customer Acquisition Cost)</strong>: Costo de adquisición</li>
  <li><strong>LTV (Lifetime Value)</strong>: Valor de vida del cliente</li>
  <li><strong>Engagement Rate</strong>: Interacción con tu contenido</li>
</ul>

<h2>Tendencias 2024</h2>

<ul>
  <li>Marketing de influencia auténtico</li>
  <li>Personalización con IA</li>
  <li>Contenido en video corto</li>
  <li>Marketing de comunidad</li>
  <li>Sostenibilidad como diferenciador</li>
</ul>

<p>El marketing digital exitoso requiere consistencia, creatividad y análisis constante de resultados.</p>
        `,
        excerpt:
          'Descubre las estrategias de marketing digital más efectivas para hacer crecer tu empresa en el mundo digital.',
        featuredImage:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 1950,
        likeCount: 145,
        publishedAt: new Date('2024-01-30'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'optimizacion-procesos-operativos' },
      update: {},
      create: {
        title: 'Optimización de Procesos Operativos: Eficiencia Empresarial',
        slug: 'optimizacion-procesos-operativos',
        content: `
<h1>Optimización de Procesos Operativos: Eficiencia Empresarial</h1>

<p>La optimización de procesos es clave para mejorar la eficiencia operativa y reducir costos. Te presentamos metodologías probadas para transformar tu operación.</p>

<h2>Metodologías de Optimización</h2>

<ul>
  <li><strong>Lean Six Sigma</strong>: Eliminación de desperdicios y variabilidad</li>
  <li><strong>Kaizen</strong>: Mejora continua incremental</li>
  <li><strong>Business Process Reengineering</strong>: Rediseño radical de procesos</li>
  <li><strong>Value Stream Mapping</strong>: Mapeo de flujo de valor</li>
</ul>

<h2>Pasos para Optimizar Procesos</h2>

<ol>
  <li><strong>Mapeo de Procesos Actuales</strong>: Documenta el estado actual</li>
  <li><strong>Identificación de Cuellos de Botella</strong>: Encuentra puntos de fricción</li>
  <li><strong>Análisis de Causa Raíz</strong>: Entiende los problemas fundamentales</li>
  <li><strong>Diseño de Procesos Mejorados</strong>: Crea soluciones eficientes</li>
  <li><strong>Implementación y Monitoreo</strong>: Ejecuta y mide resultados</li>
</ol>

<h2>Herramientas de Automatización</h2>

<p>La tecnología puede acelerar significativamente la optimización:</p>

<ul>
  <li><strong>RPA (Robotic Process Automation)</strong>: Automatización de tareas repetitivas</li>
  <li><strong>Workflow Management</strong>: Gestión de flujos de trabajo</li>
  <li><strong>ERP Systems</strong>: Integración de procesos empresariales</li>
  <li><strong>Business Intelligence</strong>: Análisis de datos operativos</li>
</ul>

<h2>Métricas de Eficiencia Operativa</h2>

<ul>
  <li><strong>Throughput</strong>: Volumen de producción por tiempo</li>
  <li><strong>Cycle Time</strong>: Tiempo total del proceso</li>
  <li><strong>First Pass Yield</strong>: Calidad en primera ejecución</li>
  <li><strong>Cost per Unit</strong>: Costo por unidad producida</li>
</ul>

<p>La optimización continua de procesos no solo mejora la eficiencia, sino que también aumenta la satisfacción del cliente y la competitividad empresarial.</p>
        `,
        excerpt:
          'Aprende las mejores metodologías y herramientas para optimizar los procesos operativos de tu empresa.',
        featuredImage:
          'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 1380,
        likeCount: 87,
        publishedAt: new Date('2024-02-05'),
        authorId: admin.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'liderazgo-transformacional-empresas' },
      update: {},
      create: {
        title: 'Liderazgo Transformacional: Guiando Empresas hacia el Éxito',
        slug: 'liderazgo-transformacional-empresas',
        content: `
<h1>Liderazgo Transformacional: Guiando Empresas hacia el Éxito</h1>

<p>El liderazgo transformacional es fundamental para el crecimiento empresarial sostenible. Te mostramos cómo desarrollar las habilidades necesarias para liderar equipos de alto rendimiento.</p>

<h2>Características del Liderazgo Transformacional</h2>

<ul>
  <li><strong>Inspiración</strong>: Motiva hacia una visión compartida</li>
  <li><strong>Estimulación Intelectual</strong>: Fomenta la creatividad e innovación</li>
  <li><strong>Consideración Individual</strong>: Apoya el desarrollo personal</li>
  <li><strong>Influencia Idealizada</strong>: Actúa como modelo a seguir</li>
</ul>

<h2>Competencias Clave del Líder</h2>

<ol>
  <li><strong>Inteligencia Emocional</strong>: Autoconciencia y gestión de emociones</li>
  <li><strong>Comunicación Efectiva</strong>: Transmite ideas claramente</li>
  <li><strong>Pensamiento Estratégico</strong>: Visión de largo plazo</li>
  <li><strong>Adaptabilidad</strong>: Flexibilidad ante cambios</li>
  <li><strong>Empoderamiento</strong>: Delega y desarrolla talento</li>
</ol>

<h2>Estrategias de Desarrollo de Liderazgo</h2>

<p>Para fortalecer tus habilidades de liderazgo:</p>

<ul>
  <li><strong>Mentoría</strong>: Aprende de líderes experimentados</li>
  <li><strong>Feedback 360°</strong>: Recibe retroalimentación integral</li>
  <li><strong>Coaching Ejecutivo</strong>: Desarrollo profesional personalizado</li>
  <li><strong>Formación Continua</strong>: Cursos y certificaciones</li>
</ul>

<h2>Liderazgo en la Era Digital</h2>

<ul>
  <li><strong>Liderazgo Distribuido</strong>: Equipos remotos y virtuales</li>
  <li><strong>Agilidad Organizacional</strong>: Adaptación rápida a cambios</li>
  <li><strong>Innovación Constante</strong>: Cultura de mejora continua</li>
  <li><strong>Diversidad e Inclusión</strong>: Equipos diversos y equitativos</li>
</ul>

<h2>Impacto del Liderazgo en Resultados</h2>

<p>Un liderazgo efectivo se traduce en:</p>

<ul>
  <li>Mayor engagement de empleados</li>
  <li>Mejor performance organizacional</li>
  <li>Innovación y creatividad</li>
  <li>Retención de talento</li>
  <li>Crecimiento sostenible</li>
</ul>

<p>El liderazgo transformacional no es solo una habilidad, es una filosofía que transforma organizaciones completas hacia la excelencia.</p>
        `,
        excerpt:
          'Descubre las claves del liderazgo transformacional para guiar tu empresa hacia el éxito sostenible.',
        featuredImage:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        status: 'PUBLISHED',
        isPinned: false,
        viewCount: 2100,
        likeCount: 167,
        publishedAt: new Date('2024-02-10'),
        authorId: admin.id,
      },
    }),
  ]);

  console.log('✅ Posts creados');

  // Asignar categorías a posts
  await Promise.all([
    // Post 1: Estrategias de Crecimiento - Consultoría Empresarial
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[0].id,
          categoryId: categories[0].id, // Consultoría Empresarial
        },
      },
      update: {},
      create: {
        postId: posts[0].id,
        categoryId: categories[0].id,
      },
    }),

    // Post 2: Gestión Financiera - Finanzas Corporativas
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[1].id,
          categoryId: categories[1].id, // Finanzas Corporativas
        },
      },
      update: {},
      create: {
        postId: posts[1].id,
        categoryId: categories[1].id,
      },
    }),

    // Post 3: Gestión del Talento - Recursos Humanos
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[2].id,
          categoryId: categories[2].id, // Recursos Humanos
        },
      },
      update: {},
      create: {
        postId: posts[2].id,
        categoryId: categories[2].id,
      },
    }),

    // Post 4: Marketing Digital - Marketing Estratégico
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[3].id,
          categoryId: categories[3].id, // Marketing Estratégico
        },
      },
      update: {},
      create: {
        postId: posts[3].id,
        categoryId: categories[3].id,
      },
    }),

    // Post 5: Optimización de Procesos - Operaciones
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[4].id,
          categoryId: categories[4].id, // Operaciones
        },
      },
      update: {},
      create: {
        postId: posts[4].id,
        categoryId: categories[4].id,
      },
    }),

    // Post 6: Liderazgo Transformacional - Liderazgo
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[5].id,
          categoryId: categories[5].id, // Liderazgo
        },
      },
      update: {},
      create: {
        postId: posts[5].id,
        categoryId: categories[5].id,
      },
    }),
  ]);

  console.log('✅ Categorías asignadas a posts');

  // Crear comentarios de ejemplo
  await Promise.all([
    prisma.comment.create({
      data: {
        content:
          'Excelente guía sobre crecimiento empresarial! Las métricas que mencionas son clave para medir el éxito. ¿Podrías profundizar más en el análisis de mercado?',
        authorName: 'Roberto Martínez',
        authorEmail: 'roberto.martinez@empresa.com',
        authorWebsite: 'https://robertomartinez.com',
        status: 'APPROVED',
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Muy útil la información sobre gestión financiera. Estoy implementando un ERP en mi empresa y estos conceptos me ayudan mucho.',
        authorName: 'Carmen López',
        authorEmail: 'carmen.lopez@finanzas.com',
        status: 'APPROVED',
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'El tema de gestión del talento es fundamental. ¿Tienes experiencia con herramientas específicas de ATS que recomiendes?',
        authorName: 'Diego Ramírez',
        authorEmail: 'diego.ramirez@rrhh.com',
        status: 'PENDING',
        postId: posts[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Las tendencias de marketing digital 2024 que mencionas son muy actuales. ¿Cómo ves el impacto de la IA en el marketing estratégico?',
        authorName: 'Sofia Herrera',
        authorEmail: 'sofia.herrera@marketing.com',
        status: 'APPROVED',
        postId: posts[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Lean Six Sigma es una metodología que he implementado con éxito en mi empresa. ¿Podrías compartir más sobre Value Stream Mapping?',
        authorName: 'Andrés Vega',
        authorEmail: 'andres.vega@operaciones.com',
        status: 'APPROVED',
        postId: posts[4].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'El liderazgo transformacional es clave en la era digital. Me interesa mucho el tema de equipos remotos. ¿Tienes algún artículo específico sobre eso?',
        authorName: 'María González',
        authorEmail: 'maria.gonzalez@liderazgo.com',
        status: 'APPROVED',
        postId: posts[5].id,
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
