# Copexia Backend

Backend API para el sistema de gestión de contenido desarrollado con NestJS, Prisma y PostgreSQL.

## 🚀 Características

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT con refresh tokens
- **Internacionalización**: Soporte para ES/EN
- **Email**: Integración con Mailjet
- **AWS**: Servicios S3 para archivos
- **Documentación**: API documentada con Swagger

## 📋 Requisitos

- Node.js 20+
- Yarn
- PostgreSQL 15+
- Docker (opcional, solo para desarrollo)

## 🛠️ Instalación

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd copexia-nest
```

2. **Instalar dependencias**
```bash
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb copexia_db

# Ejecutar migraciones
npx prisma migrate dev

# Opcional: Poblar con datos de prueba
npx prisma db seed
```

5. **Ejecutar en desarrollo**
```bash
yarn start:dev
```

### Con Docker (Desarrollo)

```bash
# Levantar servicios
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🌐 URLs

- **API**: `http://localhost:3000`
- **Swagger**: `http://localhost:3000/api`
- **Base de datos**: `localhost:5432`

## 📁 Estructura del Proyecto

```
src/
├── common/           # Decoradores, interceptors, interfaces
├── config/           # Configuraciones de la aplicación
├── constants/        # Constantes globales
├── i18n/            # Internacionalización
├── modules/         # Módulos de la aplicación
│   ├── auth/        # Autenticación
│   ├── categories/  # Gestión de categorías
│   ├── comments/    # Sistema de comentarios
│   ├── posts/       # Gestión de posts
│   └── users/       # Gestión de usuarios
├── services/        # Servicios compartidos
└── utils/           # Utilidades
```

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema
- **Post**: Posts del blog
- **Category**: Categorías
- **Comment**: Comentarios
- **PostCategory**: Relación muchos a muchos

### Comandos Útiles

```bash
# Ver estado de la base de datos
npx prisma studio

# Resetear base de datos
npx prisma migrate reset

# Generar cliente Prisma
npx prisma generate
```

## 🔧 Scripts Disponibles

```bash
yarn start              # Producción
yarn start:dev          # Desarrollo
yarn start:debug        # Debug
yarn build              # Compilar
yarn test               # Tests
yarn test:e2e           # Tests E2E
yarn lint               # Linting
yarn format             # Formateo
```

## 📚 Documentación API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva en:
- **Swagger UI**: `http://localhost:3000/api`

## 🔐 Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/copexia_db

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET_KEY=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_SENDER=noreply@example.com
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_SECRET_KEY=your-mailjet-secret-key

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET=your-s3-bucket

# URLs
FRONTEND_URL=http://localhost:3001
API_URL=http://localhost:3000/api/v1
```

## 🚀 Producción

El proyecto está desplegado en producción usando:
- **Servidor**: Ubuntu con PM2
- **Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Base de datos**: PostgreSQL

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.