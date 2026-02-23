# AulaSegura

Sistema de control de acceso para instituciones educativas mediante RFID, NFC y QR. Monorepo que integra un backend API REST (NestJS) y un dashboard web de administración (React Native Web).

---

## 📋 Descripción

AulaSegura permite gestionar el acceso a aulas y espacios de un centro educativo en tiempo real: registro de entradas/salidas, gestión de horarios y permisos, administración de usuarios y credenciales (tarjetas RFID, tags NFC, códigos QR).

El proyecto está dividido en dos aplicaciones independientes:

| App | Descripción | Ruta |
|-----|-------------|------|
| **Backend** | API REST con NestJS y arquitectura limpia | `apps/backend/` |
| **Frontend** | Dashboard de administración web (React Native Web) | `apps/frontend/` |

### 🌐 Demo en producción

> **https://aulasegura.fmontes.dev/**

---

## 🏗️ Arquitectura del Monorepo

```
AulaSegura/
├── apps/
│   ├── backend/          # API REST (NestJS + TypeORM + MariaDB)
│   └── frontend/         # Dashboard web (React Native Web + Expo)
└── docker-compose.yml    # Orquestación global (opcional)
```

### Backend — NestJS (Clean Architecture)

API REST que expone todos los recursos del sistema. Sigue una **Arquitectura Limpia** organizada por módulos funcionales:

```
src/{modulo}/
├── application/      # Casos de uso y servicios
├── domain/           # Entidades e interfaces de repositorio
├── infrastructure/   # Implementaciones, guards, decoradores
└── presentation/     # Controladores, DTOs y mappers
```

**Módulos principales:** `auth` · `users` · `courses` · `subjects` · `departments` · `academic-years` · `rooms` · `schedules` · `readers` · `tags` · `permissions` · `access`

### Frontend — React Native Web

Panel de administración web. Orientado exclusivamente al **rol administrador** y uso desde **escritorio/navegador**.

---

## 🛠️ Stack Tecnológico

### Backend

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| **NestJS** | ^11.0.1 | Framework backend progresivo de Node.js |
| **TypeScript** | ^5.7.3 | Tipado estático |
| **TypeORM** | ^0.3.27 | ORM para gestión de base de datos |
| **mysql2** | ^3.15.1 | Driver MariaDB/MySQL para TypeORM |
| **@nestjs/jwt** | ^11.0.1 | Módulo JWT para NestJS |
| **@nestjs/passport** | ^11.0.5 | Integración Passport con NestJS |
| **passport-jwt** | ^4.0.1 | Estrategia JWT para Passport |
| **@node-rs/bcrypt** | ^1.10.7 | Hash de contraseñas |
| **class-validator** | ^0.14.2 | Validación de DTOs |
| **class-transformer** | ^0.5.1 | Serialización/deserialización de objetos |
| **@nestjs/swagger** | ^11.2.0 | Documentación OpenAPI automática |
| **rxjs** | ^7.8.1 | Programación reactiva |
| **@faker-js/faker** | ^10.0.0 | Generación de datos de prueba (seeders) |
| **typeorm-extension** | ^3.7.1 | Utilidades de seeding para TypeORM |

**Infraestructura:** Docker · Docker Compose · PM2 · Nginx · MariaDB 11.4.9

---

### Frontend

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| **React Native + Expo** | 0.81.5 / ~54.0.29 | Base de la aplicación |
| **React Native Web** | ^0.21.0 | Renderizado en navegador |
| **TypeScript** | ~5.9.2 | Tipado estático |
| **Expo Router** | ~6.0.19 | Routing file-based con historial |
| **React Native Paper** | ^5.14.5 | Componentes Material Design 3 |
| **TanStack Query** | ^5.90.20 | Caché y sincronización de datos del servidor |
| **Axios** | ^1.13.2 | Cliente HTTP con interceptores |
| **React Hook Form** | ^7.71.1 | Gestión de formularios |
| **Zod** | ^3.23.8 | Validación de esquemas |
| **expo-secure-store** | ^15.0.8 | Almacenamiento seguro de tokens |
| **react-native-paper-dates** | ^0.23.3 | Selector de fechas MD3 |
| **react-native-reanimated-carousel** | ^4.0.3 | Carrusel de avatares |
| **@expo-google-fonts/roboto** | ^0.4.2 | Tipografía Roboto |
| **victory-native** | ^41.20.2 | Gráficas y analíticas |

**Diseño:** Material Design 3 · Primary `#182D73` · Secondary `#306AC6` · Tertiary `#3B82F6`

---

## 🐳 Servicios Docker

El `docker-compose.yml` raíz orquesta **5 servicios** en la red `aulasegura-network`:

| Servicio | Contenedor | Puerto | Imagen / Build | Descripción |
|----------|-----------|--------|----------------|--------------|
| **backend** | `aulasegura-nestjs` | `8000` | `apps/backend/Dockerfile` | API NestJS + PM2 |
| **database** | `aulasegura-mariadb` | `3306` | `yobasystems/alpine-mariadb:11.4.9` | Base de datos MariaDB |
| **phpmyadmin** | `aulasegura-phpmyadmin` | `8085` | `phpmyadmin:apache` | Gestión visual de la BD |
| **imageserver** | `aulasegura-nginx-images` | `8090` | `nginx:1.29.3-alpine` | Servidor de imágenes estáticas |
| **frontend** | `aulasegura-reactnative` | `8081` | `apps/frontend/Dockerfile` | Dashboard web (Expo dev server) |

Todos los servicios comparten la red `aulasegura-network` (bridge). Los datos de MariaDB se persisten en el volumen `mariadb_data`.

---

## 🚀 Instalación y Arranque

### Prerrequisitos
- Docker y Docker Compose
---

#### 1. Acceder al directorio
```bash
cd aulasegura
```

#### 2. Configurar variables de entorno
```bash
cp env.example .env
```

Edita `.env` con tus valores:

```env
# Database
DB_HOST=database
DB_PORT=3306
DB_DATABASE=aulasegura
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DB_ROOT_PASSWORD=tu_contraseña_root_db

# Application
NODE_ENV=development
WEB_SERVER_PORT=8000

# JWT
JWT_ACCESS_SECRET=tu_clave_secreta_jwt_access
JWT_REFRESH_SECRET=tu_clave_secreta_jwt_refresh
JWT_ACCESS_EXPIRATION=1d
JWT_REFRESH_EXPIRATION=7d

# Tag Configuration (RFID/NFC)
TAG_PEPPER=tu_clave_secreta_para_encriptacion_en_db

# Image Server Configuration (Nginx)
EXPO_PUBLIC_NESTJS_API_URL=http://<tu_direccion_ip>:8000
EXPO_PUBLIC_IMAGE_SERVER_URL=http://<tu_direccion_ip>:8090

# CORS Configuration
CORS_ORIGINS=http://<tu_direccion_ip>:8081
```

#### 3. Levantar servicios
```bash
docker-compose up -d
```

Docker Compose construirá la imagen, instalará dependencias y levantará todos los servicios automáticamente.

#### 4. Poblar la base de datos
```bash
npm run seed:dev
```

Esto inserta ~842 registros de prueba: roles, años académicos, departamentos, cursos, asignaturas, salas, lectores, tags, horarios y permisos.

**Usuarios de prueba** (contraseña: `AulaSegura@1234`):

| Email | Nombre | Rol |
|-------|--------|-----|
| `admin@gva.es` | Ana Morales Martínez | Administrador |
| `teacher@gva.es` | Luis Torregrosa Pérez | Profesor |
| `pagado@gva.es` | Paco García Donat | Profesor |
| `janitor@gva.es` | Marta Fernández Ruiz | Conserje |
| `staff@gva.es` | Eva Mendes López | Personal de apoyo |

---

#### 5. Modo desarrollo local
```bash
npm install
npm run web
```

#### 5b. Modo desarrollo con Docker (hot reload)
```bash
# Primera vez (construye la imagen)
docker-compose up --build

# Siguientes veces
docker-compose up
```

La app queda disponible en `http://localhost:8081`.

---

## 📚 Documentación API

Una vez iniciado el backend, accede a la documentación Swagger en:

```
http://localhost:8000/api/docs
```

---

## 🔐 Funcionalidades

### Backend
- Autenticación JWT (access + refresh tokens)
- Gestión de usuarios, roles y permisos granulares
- Gestión académica: cursos, asignaturas, departamentos, años académicos
- Control de salas y lectores RFID
- Tags NFC/RFID y códigos QR
- Horarios semanales y por evento
- Registro de accesos en tiempo real

### Frontend (Dashboard Admin)
- Login con validación (React Hook Form + Zod)
- Sidebar colapsable y topbar responsive
- Dashboard con KPIs y widgets en tiempo real
- Gestión completa de usuarios (crear, editar, eliminar, avatar)
- Gestión académica: cursos, departamentos, asignaturas
- Filtros globales sincronizados con URL
- Paginación persistente por pantalla
- Sistema de diseño Material Design 3 con colores corporativos

### Secciones en desarrollo (frontend)
- 🔄 Espacios: aulas, lectores, plano del centro
- 🔄 Acceso: permisos, reservas, validaciones
- 🔄 Credenciales: RFID, NFC
- 🔄 Supervisión: analíticas, incidencias, logs
- 🔄 Notificaciones y configuración del sistema

---

## 🗄️ Gestión de Base de Datos

```bash
# Acceder a phpMyAdmin
http://localhost:8085

# Acceso directo a MariaDB
docker exec -it aulasegura-mariadb mariadb -u[usuario] -p[password] aulasegura

# Backup
docker exec aulasegura-mariadb mysqldump -u[usuario] -p[password] aulasegura > backup.sql
```

---


## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta los archivos [LICENSE](apps/backend/LICENSE) y [LICENSE](apps/frontend/LICENSE) de cada aplicación para más detalles.
