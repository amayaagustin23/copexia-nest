#!/usr/bin/env node

/**
 * Script genérico para generar colección de Postman
 * Escanea automáticamente proyectos NestJS con Swagger
 *
 * Uso: node scripts/generate-postman-generic.mjs [options]
 *
 * Opciones:
 * --base-url <url>     URL base de la API (default: http://localhost:4000)
 * --output-dir <dir>   Directorio de salida (default: ./postman)
 * --controllers <dir>  Directorio de controladores (default: ./src/modules)
 * --name <name>        Nombre de la colección (default: API Collection)
 */

import fs from 'fs';
import path from 'path';

/**
 * Detecta configuración automáticamente
 */
function detectDefaultConfig() {
  // Detectar puerto automáticamente
  const packageJson = detectPackageJson();
  const detectedPort = detectPort(packageJson);

  // Detectar nombre del proyecto automáticamente
  const projectName = detectProjectName(packageJson);

  return {
    baseUrl: `http://localhost:${detectedPort}`,
    outputDir: './postman',
    controllersDir: './src/modules',
    collectionName: projectName || 'API Collection',
    version: packageJson.version || '1.0.0',
    port: detectedPort,
  };
}

/**
 * Detecta package.json y lo lee
 */
function detectPackageJson() {
  try {
    const packagePath = './package.json';
    if (fs.existsSync(packagePath)) {
      return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    }
  } catch (error) {
    console.warn('⚠️  No se pudo leer package.json');
  }
  return {};
}

/**
 * Detecta el puerto automáticamente
 */
function detectPort(packageJson) {
  // Buscar en scripts de package.json
  if (packageJson.scripts) {
    for (const [key, value] of Object.entries(packageJson.scripts)) {
      if (typeof value === 'string') {
        const portMatch = value.match(/--port\s+(\d+)/);
        if (portMatch) return parseInt(portMatch[1]);

        const envPortMatch = value.match(/PORT=(\d+)/);
        if (envPortMatch) return parseInt(envPortMatch[1]);
      }
    }
  }

  // Buscar en variables de entorno
  if (process.env.PORT) return parseInt(process.env.PORT);

  // Puertos comunes por defecto
  return 4000;
}

/**
 * Detecta el nombre del proyecto automáticamente
 */
function detectProjectName(packageJson) {
  if (packageJson.name) {
    return packageJson.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ');
  }
  return null;
}

// Configuración por defecto dinámica
const DEFAULT_CONFIG = detectDefaultConfig();

// Parsear argumentos de línea de comandos
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--base-url':
        config.baseUrl = args[++i];
        break;
      case '--output-dir':
        config.outputDir = args[++i];
        break;
      case '--controllers':
        config.controllersDir = args[++i];
        break;
      case '--name':
        config.collectionName = args[++i];
        break;
      case '--help':
      case '-h':
        console.log(`
Uso: node scripts/generate-postman-generic.mjs [options]

Opciones:
  --base-url <url>     URL base de la API (default: ${DEFAULT_CONFIG.baseUrl})
  --output-dir <dir>   Directorio de salida (default: ${DEFAULT_CONFIG.outputDir})
  --controllers <dir>  Directorio de controladores (default: ${DEFAULT_CONFIG.controllersDir})
  --name <name>        Nombre de la colección (default: ${DEFAULT_CONFIG.collectionName})
  --help, -h           Mostrar esta ayuda

Ejemplos:
  node scripts/generate-postman-generic.mjs
  node scripts/generate-postman-generic.mjs --base-url https://api.example.com
  node scripts/generate-postman-generic.mjs --name "Mi API" --output-dir ./docs
        `);
        process.exit(0);
    }
  }

  return config;
}

/**
 * Genera fecha en formato dd-mm-yyyy
 */
function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Escanea directorios recursivamente buscando archivos .ts
 */
function scanDirectory(dir, extensions = ['.ts']) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...scanDirectory(fullPath, extensions));
    } else if (extensions.some((ext) => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extrae información de un controlador NestJS
 */
function parseController(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Buscar el decorador @Controller de forma más flexible
    let basePath = null;

    // Primero intentar con regex simple
    const controllerMatch = content.match(/@Controller\(['"`]([^'"`]+)['"`]\)/);
    if (controllerMatch) {
      basePath = controllerMatch[1];
    } else {
      // Buscar línea por línea
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('@Controller')) {
          const match = line.match(/@Controller\(['"`]([^'"`]+)['"`]\)/);
          if (match) {
            basePath = match[1];
            console.log(`✅ Encontrado @Controller: ${basePath}`);
            break;
          }
        }
      }
    }

    if (!basePath) {
      return null;
    }

    // Buscar la clase del controlador
    const classMatch = content.match(/export class (\w+)/);
    if (!classMatch) {
      return null;
    }

    const className = classMatch[1];

    // Buscar métodos con decoradores HTTP de forma más simple
    const methods = [];

    // Buscar todos los métodos con decoradores HTTP (con o sin path)
    const methodRegex =
      /@(Get|Post|Put|Patch|Delete|Options|Head)\(['"`]?([^'"`]*?)['"`]?\)/g;
    let match;

    while ((match = methodRegex.exec(content)) !== null) {
      const httpMethod = match[1].toUpperCase();
      const endpointPath = match[2];

      // Buscar descripción en las líneas siguientes
      const lines = content.split('\n');
      const matchLineIndex =
        content.substring(0, match.index).split('\n').length - 1;
      let description = `${httpMethod} ${endpointPath}`;

      // Buscar @ApiOperation en las siguientes líneas
      for (
        let i = matchLineIndex;
        i < Math.min(matchLineIndex + 5, lines.length);
        i++
      ) {
        if (lines[i].includes('@ApiOperation')) {
          const descMatch = lines[i].match(/summary:\s*['"`]([^'"`]+)['"`]/);
          if (descMatch) {
            description = descMatch[1];
            break;
          }
        }
      }

      // Buscar parámetros de query en las siguientes líneas
      let hasQuery = false;
      for (
        let i = matchLineIndex;
        i < Math.min(matchLineIndex + 10, lines.length);
        i++
      ) {
        if (lines[i].includes('@Query()')) {
          hasQuery = true;
          break;
        }
      }

      // Construir el path completo correctamente
      let fullPath;
      if (!endpointPath || endpointPath.trim() === '') {
        // Endpoint raíz sin path adicional
        fullPath = basePath;
      } else if (endpointPath.startsWith('/')) {
        fullPath = `${basePath}${endpointPath}`;
      } else {
        fullPath = `${basePath}/${endpointPath}`;
      }

      methods.push({
        method: httpMethod,
        path: endpointPath,
        name: description,
        hasQuery,
        fullPath,
      });
    }

    return {
      className,
      basePath,
      methods,
      filePath,
    };
  } catch (error) {
    console.warn(`⚠️  Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Genera un request de Postman
 */
function generateRequest(endpoint, config) {
  const headers = [{ key: 'Content-Type', value: 'application/json' }];

  // Agregar Authorization si el endpoint requiere autenticación
  if (endpoint.requiresAuth) {
    headers.push({ key: 'Authorization', value: 'Bearer {{jwt_token}}' });
  }

  const request = {
    method: endpoint.method,
    header: headers,
    url: {
      raw: `{{base_url}}${endpoint.fullPath}`,
      host: ['{{base_url}}'],
      path: endpoint.fullPath.split('/').filter((p) => p),
    },
  };

  // Agregar query parameters si existen
  if (endpoint.hasQuery) {
    request.url.query = [
      {
        key: 'page',
        value: '1',
        description: 'Número de página',
      },
      {
        key: 'perPage',
        value: '10',
        description: 'Elementos por página',
      },
      {
        key: 'search',
        value: '',
        description: 'Término de búsqueda',
        disabled: true,
      },
    ];
  }

  // Agregar body para métodos POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    request.body = {
      mode: 'raw',
      raw: JSON.stringify(
        findAndParseDTOs(config.controllersDir, endpoint),
        null,
        2,
      ),
    };
  }

  return request;
}

/**
 * Busca y parsea DTOs para generar bodies de ejemplo
 */
function findAndParseDTOs(controllersDir, endpoint) {
  try {
    // Extraer el nombre del módulo del path del endpoint
    const moduleName = extractModuleName(endpoint.fullPath, controllersDir);

    if (!moduleName) {
      return generateGenericBody(endpoint);
    }

    // Buscar DTOs específicos del módulo
    const modulePath = path.join(controllersDir, moduleName);
    const dtoFiles = findDTOFiles(modulePath);

    console.log(
      `🔍 Buscando DTOs para módulo '${moduleName}' en: ${modulePath}`,
    );
    console.log(`📁 DTOs encontrados: ${dtoFiles.length} archivos`);

    // Parsear todos los DTOs del módulo
    for (const dtoFile of dtoFiles) {
      const dtoBody = parseDTOFile(dtoFile, endpoint);
      if (dtoBody && Object.keys(dtoBody).length > 0) {
        console.log(`✅ DTO parseado: ${path.basename(dtoFile)}`);
        return dtoBody;
      }
    }

    // Si no se encuentran DTOs específicos, usar generación genérica
    return generateGenericBody(endpoint);
  } catch (error) {
    console.warn(
      `⚠️  Error buscando DTOs para ${endpoint.fullPath}:`,
      error.message,
    );
    return generateGenericBody(endpoint);
  }
}

/**
 * Extrae el nombre del módulo del path del endpoint dinámicamente
 */
function extractModuleName(endpointPath, modulesDir) {
  // Remover leading slash y split por /
  const parts = endpointPath.replace(/^\//, '').split('/');

  // Buscar dinámicamente en todos los módulos disponibles
  const availableModules = getAvailableModules(modulesDir);

  for (const part of parts) {
    // Skip prefixes comunes pero dinámicamente
    if (isCommonPrefix(part)) continue;

    // Verificar si existe una carpeta con este nombre en modules
    if (availableModules.includes(part)) {
      return part;
    }
  }

  return null;
}

/**
 * Obtiene todos los módulos disponibles dinámicamente
 */
function getAvailableModules(modulesDir) {
  try {
    if (!fs.existsSync(modulesDir)) return [];

    return fs
      .readdirSync(modulesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (error) {
    return [];
  }
}

/**
 * Detecta si un string es un prefijo común dinámicamente
 */
function isCommonPrefix(part) {
  const commonPrefixes = [
    'admin',
    'public',
    'api',
    'v1',
    'v2',
    'internal',
    'external',
  ];
  return commonPrefixes.includes(part.toLowerCase());
}

/**
 * Busca archivos DTO en un módulo específico dinámicamente
 */
function findDTOFiles(modulePath) {
  const dtoFiles = [];

  if (!fs.existsSync(modulePath)) {
    return dtoFiles;
  }

  try {
    // Buscar DTOs en la carpeta 'dto' específica
    const dtoDir = path.join(modulePath, 'dto');
    if (fs.existsSync(dtoDir)) {
      const dtoDirFiles = fs.readdirSync(dtoDir);
      for (const file of dtoDirFiles) {
        if (isDTOFile(file)) {
          dtoFiles.push(path.join(dtoDir, file));
        }
      }
    }

    // Buscar DTOs en el directorio raíz del módulo
    const files = fs.readdirSync(modulePath);
    for (const file of files) {
      if (isDTOFile(file)) {
        dtoFiles.push(path.join(modulePath, file));
      }
    }

    // Buscar DTOs en subdirectorios dinámicamente
    const subdirs = fs
      .readdirSync(modulePath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && dirent.name !== 'dto')
      .map((dirent) => dirent.name);

    for (const subdir of subdirs) {
      const subdirPath = path.join(modulePath, subdir);
      const subdirFiles = fs.readdirSync(subdirPath);

      for (const file of subdirFiles) {
        if (isDTOFile(file)) {
          dtoFiles.push(path.join(subdirPath, file));
        }
      }
    }
  } catch (error) {
    console.warn(
      `⚠️  Error leyendo módulo para DTOs ${modulePath}:`,
      error.message,
    );
  }

  return dtoFiles;
}

/**
 * Detecta si un archivo es un DTO dinámicamente
 */
function isDTOFile(filename) {
  const dtoPatterns = [
    '.dto.ts',
    '.dto.js',
    'Dto.ts',
    'Dto.js',
    'DTO.ts',
    'DTO.js',
  ];

  return dtoPatterns.some((pattern) => filename.endsWith(pattern));
}

/**
 * Parsea un archivo DTO y genera un body de ejemplo
 */
function parseDTOFile(filePath, endpoint) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Buscar interfaces o clases que puedan ser DTOs
    const dtoMatches = content.match(
      /export\s+(?:class|interface)\s+(\w+)(?:\s+extends\s+\w+)?\s*[{(]/g,
    );
    if (!dtoMatches) return null;

    // Buscar propiedades en la primera clase/interface
    const firstMatch = dtoMatches[0];
    const className = firstMatch.match(
      /export\s+(?:class|interface)\s+(\w+)/,
    )[1];

    // Extraer propiedades del DTO
    const properties = extractDTOProperties(content, className);

    // Generar valores de ejemplo basados en las propiedades
    return generateExampleFromProperties(properties, endpoint);
  } catch (error) {
    return null;
  }
}

/**
 * Extrae propiedades de un DTO
 */
function extractDTOProperties(content, className) {
  const properties = [];

  // Buscar la definición de la clase/interface - capturar hasta el final de la clase
  const classRegex = new RegExp(
    `export\\s+(?:class|interface)\\s+${className}\\s*\\{[\\s\\S]*?^\\}`,
    'gm',
  );
  const classMatch = classRegex.exec(content);

  if (!classMatch) {
    return properties;
  }

  const classContent = classMatch[0];

  // Buscar propiedades con decoradores @ApiProperty
  // Mejorar el parsing para capturar mejor las propiedades
  const lines = classContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Buscar líneas que contengan @ApiProperty
    if (line.includes('@ApiProperty')) {
      // Buscar la propiedad saltando el bloque del @ApiProperty y decoradores de validación
      let j = i + 1;

      // Saltar el bloque completo del @ApiProperty (hasta encontrar })
      while (j < lines.length && !lines[j].trim().includes('}')) {
        j++;
      }

      // Saltar la línea del cierre del @ApiProperty
      j++;

      // Saltar decoradores de validación
      while (j < lines.length && lines[j].trim().startsWith('@')) {
        j++;
      }

      // Ahora buscar la propiedad
      if (j < lines.length) {
        const propLine = lines[j].trim();

        // Buscar patrones de propiedad: nombre: tipo o nombre?: tipo
        const propMatch = propLine.match(/^(\w+)\??\s*:\s*([^;,}]+);?$/);
        if (propMatch) {
          const propertyName = propMatch[1];
          const type = propMatch[2].trim();

          // Buscar descripción y ejemplo en todo el bloque del @ApiProperty
          let description = '';
          let example = '';

          // Buscar en las líneas del @ApiProperty
          for (
            let k = i;
            k < Math.min(i + 10, lines.length) &&
            !lines[k].trim().includes('}');
            k++
          ) {
            const apiLine = lines[k];
            const descMatch = apiLine.match(
              /description:\s*['"`]([^'"`]+)['"`]/,
            );
            if (descMatch) description = descMatch[1];

            const exampleMatch = apiLine.match(
              /example:\s*['"`]([^'"`]+)['"`]/,
            );
            if (exampleMatch) example = exampleMatch[1];
          }

          properties.push({
            name: propertyName,
            type: type,
            description: description,
            example: example,
          });
        }
      }
    }
  }

  // Si no se encuentran con @ApiProperty, buscar propiedades simples
  if (properties.length === 0) {
    const simplePropRegex = /(\w+)\s*[:?]\s*([^;,}]+)/g;
    while ((match = simplePropRegex.exec(classContent)) !== null) {
      if (!match[1].match(/^(export|class|interface|extends|implements)$/)) {
        properties.push({
          name: match[1],
          type: match[2].trim(),
          description: '',
        });
      }
    }
  }

  return properties;
}

/**
 * Genera valores de ejemplo basados en las propiedades del DTO
 */
function generateExampleFromProperties(properties, endpoint) {
  const body = {};

  for (const prop of properties) {
    body[prop.name] = generateExampleValue(prop, endpoint);
  }

  return body;
}

/**
 * Genera un valor de ejemplo para una propiedad
 */
function generateExampleValue(property, endpoint) {
  const { name, type, description, example } = property;
  const lowerName = name.toLowerCase();

  // Usar el ejemplo del DTO si está disponible
  if (example && example.trim() !== '') {
    return example;
  }

  // Valores específicos por nombre de campo
  if (lowerName.includes('email')) return '{{admin_email}}';
  if (lowerName.includes('password')) return '{{admin_password}}';
  if (lowerName.includes('id')) return '{{sample_id}}';
  if (lowerName.includes('token')) return '{{jwt_token}}';

  // Valores específicos por tipo
  if (type.includes('string')) {
    if (lowerName.includes('name')) return 'Nombre de ejemplo';
    if (lowerName.includes('title')) return 'Título de ejemplo';
    if (lowerName.includes('content')) return 'Contenido de ejemplo...';
    if (lowerName.includes('description')) return 'Descripción de ejemplo';
    if (lowerName.includes('slug')) return 'slug-ejemplo';
    if (lowerName.includes('url') || lowerName.includes('website'))
      return 'https://ejemplo.com';
    return 'Valor de texto';
  }

  if (type.includes('number') || type.includes('int')) {
    return 1;
  }

  if (type.includes('boolean')) {
    return true;
  }

  if (type.includes('array') || type.includes('[]')) {
    return [];
  }

  if (type.includes('date')) {
    return new Date().toISOString();
  }

  // Valores por contexto del endpoint
  if (endpoint.fullPath.includes('auth')) {
    if (lowerName.includes('email')) return '{{admin_email}}';
    if (lowerName.includes('password')) return '{{admin_password}}';
  }

  if (endpoint.fullPath.includes('posts')) {
    if (lowerName.includes('title')) return 'Título del post';
    if (lowerName.includes('content')) return 'Contenido del post...';
    if (lowerName.includes('excerpt')) return 'Resumen del post';
    if (lowerName.includes('status')) return 'PUBLISHED';
  }

  if (endpoint.fullPath.includes('categories')) {
    if (lowerName.includes('name')) return 'Nombre de la categoría';
    if (lowerName.includes('color')) return '#3b82f6';
    if (lowerName.includes('icon')) return '📁';
  }

  // Valor por defecto
  return 'Valor de ejemplo';
}

/**
 * Genera un body genérico cuando no se encuentran DTOs específicos
 */
function generateGenericBody(endpoint) {
  const baseBody = {};

  // Generar campos comunes basados en el path
  if (endpoint.fullPath.includes('auth/login')) {
    return {
      email: '{{admin_email}}',
      password: '{{admin_password}}',
    };
  }

  if (endpoint.fullPath.includes('posts')) {
    return {
      title: 'Título del post',
      content: 'Contenido del post...',
      excerpt: 'Resumen del post',
      status: 'PUBLISHED',
    };
  }

  if (endpoint.fullPath.includes('categories')) {
    return {
      name: 'Nombre de la categoría',
      slug: 'slug-categoria',
      description: 'Descripción de la categoría',
      color: '#3b82f6',
      icon: '📁',
      isActive: true,
    };
  }

  if (endpoint.fullPath.includes('comments')) {
    return {
      content: 'Contenido del comentario',
      authorName: 'Nombre del autor',
      authorEmail: 'email@ejemplo.com',
      authorWebsite: 'https://ejemplo.com',
    };
  }

  if (endpoint.fullPath.includes('users')) {
    return {
      name: 'Nombre del usuario',
      email: 'usuario@ejemplo.com',
      role: 'USER',
    };
  }

  return baseBody;
}

/**
 * Escanea todos los controladores
 */
function scanControllers(config) {
  const controllersDir = path.resolve(config.controllersDir);
  console.log(`🔍 Escaneando módulos en: ${controllersDir}`);

  // Verificar si el directorio existe
  if (!fs.existsSync(controllersDir)) {
    console.warn(`⚠️  Directorio no encontrado: ${controllersDir}`);
    return [];
  }

  // Obtener todos los módulos (carpetas) en el directorio
  const modules = fs
    .readdirSync(controllersDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  console.log(
    `📁 Módulos encontrados: ${modules.length} - ${modules.join(', ')}`,
  );

  const controllers = [];

  // Para cada módulo, buscar controladores
  for (const module of modules) {
    const modulePath = path.join(controllersDir, module);
    const controllerFiles = findControllerFiles(modulePath);

    console.log(
      `🔍 Módulo '${module}': ${controllerFiles.length} controladores`,
    );

    for (const file of controllerFiles) {
      const controller = parseController(file);
      if (controller && controller.methods.length > 0) {
        controller.module = module; // Agregar información del módulo
        controllers.push(controller);
      }
    }
  }

  console.log(`📁 Total controladores encontrados: ${controllers.length}`);
  return controllers;
}

/**
 * Busca archivos controlador en un módulo específico dinámicamente
 */
function findControllerFiles(modulePath) {
  const controllerFiles = [];

  try {
    // Buscar controladores en el directorio raíz del módulo
    const files = fs.readdirSync(modulePath);
    for (const file of files) {
      if (isControllerFile(file)) {
        controllerFiles.push(path.join(modulePath, file));
      }
    }

    // Buscar controladores en subdirectorios dinámicamente
    const subdirs = fs
      .readdirSync(modulePath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const subdir of subdirs) {
      const subdirPath = path.join(modulePath, subdir);
      const subdirFiles = fs.readdirSync(subdirPath);

      for (const file of subdirFiles) {
        if (isControllerFile(file)) {
          controllerFiles.push(path.join(subdirPath, file));
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Error leyendo módulo ${modulePath}:`, error.message);
  }

  return controllerFiles;
}

/**
 * Detecta si un archivo es un controlador dinámicamente
 */
function isControllerFile(filename) {
  const controllerPatterns = [
    '.controller.ts',
    '.controller.js',
    'Controller.ts',
    'Controller.js',
  ];

  return controllerPatterns.some((pattern) => filename.endsWith(pattern));
}

/**
 * Genera la colección de Postman
 */
function generateCollection(controllers, config) {
  const collection = {
    info: {
      name: config.collectionName,
      description: `Colección generada automáticamente para ${config.collectionName}`,
      version: config.version,
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{jwt_token}}',
          type: 'string',
        },
      ],
    },
    variable: [
      { key: 'base_url', value: config.baseUrl, type: 'string' },
      { key: 'jwt_token', value: '', type: 'string' },
      { key: 'admin_email', value: 'admin@example.com', type: 'string' },
      { key: 'admin_password', value: 'password123', type: 'string' },
      {
        key: 'sample_id',
        value: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string',
      },
      {
        key: 'sample_category_id',
        value: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string',
      },
      {
        key: 'sample_post_id',
        value: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string',
      },
      {
        key: 'sample_user_id',
        value: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string',
      },
      { key: 'api_key', value: 'your-api-key-here', type: 'string' },
    ],
    item: [],
  };

  // Agregar endpoints de autenticación primero
  const authEndpoints = controllers
    .flatMap((c) => c.methods)
    .filter((m) => m.fullPath.includes('auth'));

  if (authEndpoints.length > 0) {
    const authFolder = {
      name: 'Auth',
      item: authEndpoints.map((endpoint) => ({
        name: endpoint.name,
        request: generateRequest(endpoint, config),
        response: [],
      })),
    };
    collection.item.push(authFolder);
  }

  // Agregar otros endpoints agrupados por controlador
  const otherControllers = controllers.filter(
    (c) => !c.methods.some((m) => m.fullPath.includes('auth')),
  );

  for (const controller of otherControllers) {
    const folder = {
      name: controller.className.replace('Controller', ''),
      item: controller.methods.map((endpoint) => ({
        name: endpoint.name,
        request: generateRequest(endpoint, config),
        response: [],
      })),
    };
    collection.item.push(folder);
  }

  return collection;
}

/**
 * Genera el environment de Postman
 */
function generateEnvironment(config) {
  return {
    id: `${config.collectionName.toLowerCase().replace(/\s+/g, '-')}-env`,
    name: `${config.collectionName} Environment`,
    values: [
      {
        key: 'base_url',
        value: config.baseUrl,
        type: 'default',
        enabled: true,
      },
      { key: 'jwt_token', value: '', type: 'secret', enabled: true },
      {
        key: 'admin_email',
        value: 'admin@example.com',
        type: 'default',
        enabled: true,
      },
      {
        key: 'admin_password',
        value: 'password123',
        type: 'secret',
        enabled: true,
      },
      {
        key: 'sample_category_id',
        value: '123e4567-e89b-12d3-a456-426614174000',
        type: 'default',
        enabled: true,
      },
      {
        key: 'sample_post_id',
        value: '123e4567-e89b-12d3-a456-426614174000',
        type: 'default',
        enabled: true,
      },
    ],
    _postman_variable_scope: 'environment',
  };
}

/**
 * Función principal
 */
function main() {
  try {
    const config = parseArgs();

    console.log('🚀 Generando colección de Postman genérica...');
    console.log(`📋 Configuración:`);
    console.log(`   - URL Base: ${config.baseUrl}`);
    console.log(`   - Directorio de salida: ${config.outputDir}`);
    console.log(`   - Controladores: ${config.controllersDir}`);
    console.log(`   - Nombre: ${config.collectionName}`);

    // Crear directorio si no existe
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    const dateStr = getCurrentDate();
    const baseFileName = `${config.collectionName.replace(/\s+/g, '-')}-${dateStr}`;

    // Escanear controladores
    const controllers = scanControllers(config);

    if (controllers.length === 0) {
      console.log('⚠️  No se encontraron controladores válidos');
      console.log(
        `   Verifica que el directorio ${config.controllersDir} contenga archivos .ts con decoradores @Controller`,
      );
      process.exit(1);
    }

    // Generar colección
    const collection = generateCollection(controllers, config);
    const collectionPath = path.join(
      config.outputDir,
      `${baseFileName}.postman_collection.json`,
    );
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    console.log(`✅ Colección generada: ${collectionPath}`);

    // Generar environment
    const environment = generateEnvironment(config);
    const environmentPath = path.join(
      config.outputDir,
      `${baseFileName}-Environment.postman_environment.json`,
    );
    fs.writeFileSync(environmentPath, JSON.stringify(environment, null, 2));
    console.log(`✅ Environment generado: ${environmentPath}`);

    // Estadísticas
    const totalEndpoints = controllers.reduce(
      (total, c) => total + c.methods.length,
      0,
    );
    console.log(`📊 Total de endpoints generados: ${totalEndpoints}`);
    console.log(`📁 Archivos generados en: ${config.outputDir}`);

    console.log('\n🎉 ¡Generación completada exitosamente!');
    console.log('\n📋 Para usar en Postman:');
    console.log('1. Importa ambos archivos JSON en Postman');
    console.log('2. Selecciona el environment correspondiente');
    console.log('3. Configura las variables según tu API');
    console.log('4. ¡Listo para probar todos los endpoints!');
  } catch (error) {
    console.error('❌ Error generando la colección:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  DEFAULT_CONFIG,
  generateCollection,
  generateEnvironment,
  parseArgs,
  scanControllers
};

