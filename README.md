# 🚗 Aplicación Móvil LAVA 2

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](https://lava2.com)

Aplicación móvil que conecta usuarios que necesitan servicios de lavado de vehículos con trabajadores especializados en Colombia. Este proyecto incluye un frontend desarrollado en React y un backend basado en Node.js y Express.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 📖 Descripción

LAVA 2 es una plataforma de lavado de vehículos a domicilio que permite:

- **Usuarios**: Solicitar servicios de lavado, gestionar reservaciones y calificar servicios.
- **Trabajadores**: Ofrecer servicios, gestionar disponibilidad y recibir calificaciones.
- **Administradores**: Gestionar catálogos de servicios, trabajadores y usuarios.

### Problema que Resuelve

Facilita la conexión entre clientes y trabajadores especializados en lavado de vehículos, optimizando la gestión de servicios a domicilio.

---

## ✨ Características Principales

- **Autenticación y Seguridad**:

  - Sistema JWT con Access y Refresh Tokens.
  - Contraseñas hasheadas con bcrypt.
  - Rate limiting y CORS configurado.

- **Gestión de Usuarios**:

  - Registro y autenticación de usuarios.
  - Gestión de perfiles y métodos de pago.

- **Reservaciones**:

  - Sistema de reservaciones con validaciones de negocio.
  - Cancelación permitida hasta 1 hora antes del servicio.

- **Calificaciones**:

  - Calificación obligatoria para servicios (1-5 estrellas).
  - Calificación opcional para trabajadores.

- **Notificaciones**:
  - Sistema de notificaciones almacenadas en base de datos.

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Framework**: React 18+
- **Librerías**: React Router, TailwindCSS, Axios
- **Herramientas**: Vite, ESLint, Prettier

### Backend

- **Framework**: Node.js con Express
- **Base de Datos**: PostgreSQL 14+
- **ORM**: Prisma
- **Autenticación**: JSON Web Tokens (JWT), bcrypt
- **Validación**: express-validator, libphonenumber-js
- **Otros**: Multer para uploads, Redis para caching

### Testing

- **Framework**: Jest
- **Cobertura**: ≥ 80%

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular con separación de responsabilidades:

```
Aplicacion Movil LAVA 2/
├── backend/                # Backend API
│   ├── src/                # Código fuente
│   ├── prisma/             # Esquema y migraciones de base de datos
│   ├── tests/              # Pruebas unitarias e integración
│   └── package.json        # Dependencias y scripts
├── src/                    # Frontend
│   ├── components/         # Componentes reutilizables
│   ├── navigation/         # Lógica de navegación
│   ├── services/           # Llamadas a la API
│   ├── styles/             # Estilos globales
│   └── package.json        # Dependencias y scripts
└── README.md               # Documentación principal
```

---

## ✅ Requisitos Previos

- **Node.js**: 18+
- **PostgreSQL**: 14+
- **Redis**: 7+
- **npm**: 9+

---

## 🚀 Instalación

### Clonar el Repositorio

```bash
# Clonar el repositorio
$ git clone https://github.com/usuario/lava2.git
$ cd lava2
```

### Instalar Dependencias

#### Frontend

```bash
$ cd src
$ npm install
```

#### Backend

```bash
$ cd backend
$ npm install
```

### Configurar Base de Datos

1. Crear un archivo `.env` en `backend/` basado en `.env.example`.
2. Ejecutar migraciones:

```bash
$ cd backend
$ npx prisma migrate dev
```

---

## 🔧 Configuración

### Variables de Entorno

#### Frontend (`src/.env`):

```env
VITE_API_URL=http://localhost:3000
```

#### Backend (`backend/.env`):

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/lava2_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecreto
JWT_REFRESH_SECRET=supersecreto_refresh
```

---

## 🖥️ Uso

### Ejecutar en Desarrollo

#### Frontend

```bash
$ cd src
$ npm run dev
```

#### Backend

```bash
$ cd backend
$ npm run dev
```

---

## 📜 Scripts Disponibles

| Comando          | Descripción                           |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Inicia el servidor en modo desarrollo |
| `npm run build`  | Compila el proyecto                   |
| `npm run test`   | Ejecuta las pruebas                   |
| `npm run lint`   | Ejecuta el linter                     |
| `npm run format` | Formatea el código                    |

---

## 🗂️ Estructura de Carpetas

```
Aplicacion Movil LAVA 2/
├── backend/                # Backend API
│   ├── src/                # Código fuente
│   ├── prisma/             # Esquema y migraciones de base de datos
│   ├── tests/              # Pruebas unitarias e integración
│   └── package.json        # Dependencias y scripts
├── src/                    # Frontend
│   ├── components/         # Componentes reutilizables
│   ├── navigation/         # Lógica de navegación
│   ├── services/           # Llamadas a la API
│   ├── styles/             # Estilos globales
│   └── package.json        # Dependencias y scripts
└── README.md               # Documentación principal
```

---

## 🧪 Testing

### Ejecutar Pruebas

```bash
$ cd backend
$ npm run test
```

---

## 🚢 Deployment

1. Configurar variables de entorno para producción.
2. Compilar el backend y frontend:

```bash
$ cd backend
$ npm run build

$ cd src
$ npm run build
```

3. Desplegar en un servidor (Heroku, AWS, etc.).

---

## 🤝 Contribución

1. Haz un fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`).
3. Realiza tus cambios y haz commit (`git commit -m 'feat: nueva feature'`).
4. Sube tus cambios (`git push origin feature/nueva-feature`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto es privado y propiedad de LAVA 2.
