# 🚀 GUÍA DE IMPLEMENTACIÓN BACKEND - LAVA 2
## Arquitectura Cliente-Servidor

Esta guía proporciona instrucciones detalladas para implementar el backend de la aplicación móvil LAVA 2 utilizando arquitectura cliente-servidor.

---

## 📋 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico Recomendado](#stack-tecnológico-recomendado)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Estructura del Proyecto Backend](#estructura-del-proyecto-backend)
5. [Base de Datos](#base-de-datos)
6. [Endpoints API por Pantalla](#endpoints-api-por-pantalla)
7. [Autenticación y Seguridad](#autenticación-y-seguridad)
8. [Variables de Entorno](#variables-de-entorno)
9. [Integración Frontend-Backend](#integración-frontend-backend)
10. [Flujos de Datos Críticos](#flujos-de-datos-críticos)
11. [Guía de Despliegue](#guía-de-despliegue)

---

## 1. RESUMEN EJECUTIVO

**LAVA 2** es una aplicación móvil de lavado de vehículos que requiere un backend robusto con las siguientes características clave:

- Sistema de autenticación con JWT
- Gestión de perfiles de usuario
- Sistema de reservaciones
- Catálogo de servicios
- Gestión de trabajadores
- Sistema de notificaciones
- Historial de servicios
- Métodos de pago

**Pantallas implementadas en el frontend:**
1. Login
2. Registro
3. Completar Datos
4. Home
5. Perfil
6. Editar Perfil
7. Métodos de Pago
8. Servicios
9. Lista de Trabajadores
10. Detalle de Trabajador
11. Notificaciones
12. Historial

---

## 2. STACK TECNOLÓGICO RECOMENDADO

### Backend
```
- Node.js v18+ (Runtime)
- Express.js v4.18+ (Framework web)
- PostgreSQL v14+ (Base de datos principal)
- Redis (Caché y sesiones)
- JWT (JSON Web Tokens para autenticación)
- Bcrypt (Hash de contraseñas)
- Multer (Upload de archivos)
- Nodemailer (Envío de emails)
- Socket.io (Notificaciones en tiempo real - opcional)
```

### Alternativas
- **TypeScript** en lugar de JavaScript puro
- **Prisma ORM** o **TypeORM** para gestión de base de datos
- **MongoDB** si se prefiere NoSQL
- **NestJS** como framework alternativo más estructurado

---

## 3. ARQUITECTURA DEL SISTEMA

### 3.1 Diagrama de Arquitectura

```
┌─────────────────┐
│   FRONTEND      │
│  (React/TSX)    │
│   Port: 3000    │
└────────┬────────┘
         │ HTTP/HTTPS
         │ REST API
         ↓
┌─────────────────┐
│   BACKEND API   │
│  (Express.js)   │
│   Port: 5000    │
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    ↓         ↓            ↓
┌────────┐ ┌──────┐  ┌────────┐
│  DB    │ │Redis │  │ Storage│
│Postgres│ │Cache │  │ (S3)   │
└────────┘ └──────┘  └────────┘
```

### 3.2 Patrón MVC (Model-View-Controller)

```
backend/
├── models/          # Modelos de datos (interacción con DB)
├── controllers/     # Lógica de negocio
├── routes/          # Definición de endpoints
├── middleware/      # Autenticación, validación, etc.
├── services/        # Servicios auxiliares (email, upload, etc.)
└── utils/           # Funciones utilitarias
```

---

## 4. ESTRUCTURA DEL PROYECTO BACKEND

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de PostgreSQL
│   │   ├── redis.js             # Configuración de Redis
│   │   └── multer.js            # Configuración de upload
│   │
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Service.js           # Modelo de servicios
│   │   ├── Worker.js            # Modelo de trabajadores
│   │   ├── Booking.js           # Modelo de reservaciones
│   │   ├── Payment.js           # Modelo de métodos de pago
│   │   ├── Notification.js      # Modelo de notificaciones
│   │   └── ServiceHistory.js    # Modelo de historial
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, registro, tokens
│   │   ├── userController.js    # Perfil, edición
│   │   ├── serviceController.js # CRUD servicios
│   │   ├── workerController.js  # CRUD trabajadores
│   │   ├── bookingController.js # Reservaciones
│   │   ├── paymentController.js # Métodos de pago
│   │   ├── notificationController.js # Notificaciones
│   │   └── historyController.js # Historial
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── service.routes.js
│   │   ├── worker.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── notification.routes.js
│   │   └── history.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js   # Verificación JWT
│   │   ├── validate.middleware.js # Validación de datos
│   │   ├── upload.middleware.js # Upload de archivos
│   │   └── error.middleware.js  # Manejo de errores
│   │
│   ├── services/
│   │   ├── emailService.js      # Envío de emails
│   │   ├── uploadService.js     # Upload a S3/Cloud
│   │   ├── notificationService.js # Push notifications
│   │   └── paymentService.js    # Integración pasarelas
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── hashPassword.js
│   │   └── validators.js
│   │
│   ├── app.js                   # Configuración de Express
│   └── server.js                # Entry point
│
├── uploads/                     # Archivos temporales
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
├── package.json
└── README.md
```

---

## 5. BASE DE DATOS

### 5.1 Diagrama Entidad-Relación

```sql
-- Tabla de Usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_photo_url VARCHAR(500),
  car_type VARCHAR(100),
  license_plate VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Métodos de Pago
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  card_holder_name VARCHAR(255) NOT NULL,
  card_last_digits VARCHAR(4) NOT NULL,
  card_type VARCHAR(50) NOT NULL, -- VISA, MasterCard, etc.
  bank_name VARCHAR(100),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Servicios
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER,
  category VARCHAR(100), -- Premium, Completo, Exterior, etc.
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Trabajadores
CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  position VARCHAR(100), -- Especialista, Jefe, etc.
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_services INTEGER DEFAULT 0,
  bio TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reservaciones
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id),
  worker_id INTEGER REFERENCES workers(id),
  booking_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled
  total_price DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Historial de Servicios
CREATE TABLE service_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  booking_id INTEGER REFERENCES bookings(id),
  service_name VARCHAR(255),
  worker_name VARCHAR(255),
  service_date TIMESTAMP,
  cost DECIMAL(10, 2),
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  is_pending_review BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50), -- vehicle_received, vehicle_ready, payment_success, booking_confirmed
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_service_history_user_id ON service_history(user_id);
```

---

## 6. ENDPOINTS API POR PANTALLA

### 6.1 AUTENTICACIÓN (Login & Registro)

#### **POST /api/auth/register**
```javascript
// Descripción: Registro de nuevo usuario
// Frontend: RegisterScreen.tsx (handleRegister)

// Request Body:
{
  "email": "usuario@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

// Response (201):
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "userId": 123
}

// Errores posibles:
// 400: Email ya registrado
// 400: Contraseñas no coinciden
// 400: Formato de email inválido
```

#### **POST /api/auth/login**
```javascript
// Descripción: Inicio de sesión
// Frontend: LoginScreen.tsx (handleLogin)

// Request Body:
{
  "email": "usuario@example.com",
  "password": "password123"
}

// Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "profilePhoto": "https://..."
  }
}

// Errores posibles:
// 401: Credenciales inválidas
// 404: Usuario no encontrado
```

---

### 6.2 COMPLETAR DATOS

#### **PUT /api/users/:id/complete-profile**
```javascript
// Descripción: Completar datos del perfil post-registro
// Frontend: CompleteDataScreen.tsx (handleSubmit)
// Auth: Requiere Bearer token

// Request (multipart/form-data):
{
  "fullName": "Juan Pérez García",
  "phone": "+57 300 123 4567",
  "carType": "Chevrolet Onix",
  "licensePlate": "ZGO 679",
  "profilePhoto": [File] // Imagen
}

// Response (200):
{
  "success": true,
  "message": "Perfil completado exitosamente",
  "user": {
    "id": 123,
    "fullName": "Juan Pérez García",
    "phone": "+57 300 123 4567",
    "carType": "Chevrolet Onix",
    "licensePlate": "ZGO 679",
    "profilePhotoUrl": "https://storage.../profile_123.jpg"
  }
}
```

---

### 6.3 HOME

#### **GET /api/services/featured**
```javascript
// Descripción: Obtener servicios destacados para el home
// Frontend: HomeScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "services": [
    {
      "id": 1,
      "name": "Lavado Premium",
      "description": "Lavado completo con encerado",
      "price": 25000,
      "imageUrl": "https://...",
      "category": "premium"
    },
    // ... más servicios
  ]
}
```

#### **GET /api/notifications/unread-count**
```javascript
// Descripción: Contador de notificaciones no leídas
// Frontend: HomeScreen.tsx (para badge del ícono de campana)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "unreadCount": 4
}
```

---

### 6.4 PERFIL

#### **GET /api/users/:id/profile**
```javascript
// Descripción: Obtener datos completos del perfil
// Frontend: ProfileScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "user": {
    "id": 123,
    "fullName": "Alison Perez Sanchez",
    "email": "alison.perez@email.com",
    "phone": "+57 300 123 4567",
    "profilePhotoUrl": "https://...",
    "carType": "Chevrolet Onix",
    "licensePlate": "ZGO 679"
  }
}
```

---

### 6.5 EDITAR PERFIL

#### **PUT /api/users/:id**
```javascript
// Descripción: Actualizar datos del perfil
// Frontend: EditProfileScreen.tsx (handleSave)
// Auth: Requiere Bearer token

// Request (multipart/form-data):
{
  "fullName": "Alison Perez Sanchez",
  "email": "alison.perez@email.com",
  "phone": "+57 300 123 4567",
  "currentPassword": "oldPassword123", // Solo si cambia contraseña
  "newPassword": "newPassword456", // Solo si cambia contraseña
  "profilePhoto": [File] // Opcional
}

// Response (200):
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "user": { /* datos actualizados */ }
}

// Errores:
// 400: Email ya en uso
// 401: Contraseña actual incorrecta
```

---

### 6.6 MÉTODOS DE PAGO

#### **GET /api/payment-methods**
```javascript
// Descripción: Obtener métodos de pago del usuario
// Frontend: PaymentMethodsScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "paymentMethods": [
    {
      "id": 1,
      "cardHolderName": "Alison Pérez Sánchez",
      "cardType": "MasterCard",
      "cardLastDigits": "1235",
      "bankName": "Banco de Bogotá",
      "isDefault": true
    }
  ]
}
```

#### **POST /api/payment-methods**
```javascript
// Descripción: Agregar nuevo método de pago
// Frontend: PaymentMethodsScreen.tsx (handleSave)
// Auth: Requiere Bearer token

// Request Body:
{
  "cardHolderName": "Juan Pérez",
  "cardNumber": "4111111111111111", // Se guardará solo últimos 4 dígitos
  "cardType": "VISA",
  "expiryDate": "12/25",
  "cvv": "123",
  "bankName": "Bancolombia",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "city": "Bogotá",
  "address": "Calle 123 #45-67"
}

// Response (201):
{
  "success": true,
  "message": "Método de pago agregado exitosamente",
  "paymentMethod": {
    "id": 2,
    "cardLastDigits": "1111",
    "cardType": "VISA"
  }
}
```

#### **DELETE /api/payment-methods/:id**
```javascript
// Descripción: Eliminar método de pago
// Frontend: PaymentMethodsScreen.tsx (handleDelete)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "message": "Método de pago eliminado"
}
```

---

### 6.7 SERVICIOS

#### **GET /api/services**
```javascript
// Descripción: Listar todos los servicios disponibles
// Frontend: ServicesScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Query params opcionales:
// ?category=premium
// ?priceMin=10000
// ?priceMax=50000

// Response (200):
{
  "success": true,
  "services": [
    {
      "id": 1,
      "name": "Lavado Premium",
      "description": "Lavado completo interior y exterior con cera protectora",
      "price": 25000,
      "durationMinutes": 60,
      "category": "premium",
      "imageUrl": "https://...",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Lavado Express",
      "description": "Lavado rápido exterior",
      "price": 10000,
      "durationMinutes": 20,
      "category": "express",
      "imageUrl": "https://...",
      "isActive": true
    }
    // ... más servicios
  ]
}
```

---

### 6.8 TRABAJADORES

#### **GET /api/workers**
```javascript
// Descripción: Listar todos los trabajadores
// Frontend: WorkersListScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "workers": [
    {
      "id": 1,
      "fullName": "Manuel Pérez",
      "photoUrl": "https://...",
      "position": "Especialista Senior",
      "rating": 4.8,
      "totalServices": 245,
      "isAvailable": true
    },
    // ... más trabajadores
  ]
}
```

#### **GET /api/workers/:id**
```javascript
// Descripción: Detalle completo de un trabajador
// Frontend: WorkerDetailScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "worker": {
    "id": 1,
    "fullName": "Manuel Pérez",
    "photoUrl": "https://...",
    "position": "Especialista Senior",
    "rating": 4.8,
    "totalServices": 245,
    "bio": "10 años de experiencia en lavado premium...",
    "isAvailable": true,
    "specialties": ["Lavado Premium", "Pulido", "Encerado"],
    "schedule": {
      "monday": "8:00 AM - 6:00 PM",
      "tuesday": "8:00 AM - 6:00 PM",
      // ... otros días
    }
  }
}
```

---

### 6.9 NOTIFICACIONES

#### **GET /api/notifications**
```javascript
// Descripción: Obtener todas las notificaciones del usuario
// Frontend: NotificationsScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Query params opcionales:
// ?unreadOnly=true
// ?limit=20
// ?offset=0

// Response (200):
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "type": "vehicle_received",
      "title": "Vehículo recibido en el centro de Lavado",
      "body": "¡Tu vehículo ha sido recibido! 🚗 Nuestro equipo ya está trabajando para dejarlo impecable.",
      "timestamp": "2024-11-11T09:41:00Z",
      "isRead": false
    },
    {
      "id": 2,
      "type": "vehicle_ready",
      "title": "Vehículo listo",
      "body": "¡Tu vehículo está listo! 🚗 Ya puedes pasar a recogerlo en el centro de lavado.",
      "timestamp": "2024-11-11T11:30:00Z",
      "isRead": false
    }
    // ... más notificaciones
  ]
}
```

#### **PUT /api/notifications/:id/mark-read**
```javascript
// Descripción: Marcar notificación como leída
// Frontend: NotificationsScreen.tsx (al hacer click)
// Auth: Requiere Bearer token

// Response (200):
{
  "success": true,
  "message": "Notificación marcada como leída"
}
```

---

### 6.10 HISTORIAL DE SERVICIOS

#### **GET /api/service-history**
```javascript
// Descripción: Obtener historial de servicios del usuario
// Frontend: HistoryScreen.tsx (useEffect)
// Auth: Requiere Bearer token

// Query params opcionales:
// ?limit=10
// ?offset=0
// ?dateFrom=2024-01-01
// ?dateTo=2024-12-31

// Response (200):
{
  "success": true,
  "history": [
    {
      "id": 1,
      "serviceId": 1,
      "serviceName": "Lavado Premium",
      "workerName": "Juan Pérez",
      "serviceDate": "2024-10-15T10:00:00Z",
      "cost": 25000,
      "rating": 5,
      "isPendingReview": false
    },
    {
      "id": 2,
      "serviceId": 3,
      "serviceName": "Lavado Exterior",
      "workerName": "Carlos Ramírez",
      "serviceDate": "2024-10-01T14:30:00Z",
      "cost": 12000,
      "rating": 0,
      "isPendingReview": true
    }
    // ... más registros
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

#### **POST /api/service-history/:id/rate**
```javascript
// Descripción: Calificar un servicio
// Frontend: HistoryScreen.tsx (handleRateClick)
// Auth: Requiere Bearer token

// Request Body:
{
  "rating": 5, // 1-5
  "comment": "Excelente servicio" // Opcional
}

// Response (200):
{
  "success": true,
  "message": "Servicio calificado exitosamente"
}
```

---

### 6.11 RESERVACIONES

#### **POST /api/bookings**
```javascript
// Descripción: Crear nueva reservación
// Frontend: Desde pantalla de servicios o trabajadores
// Auth: Requiere Bearer token

// Request Body:
{
  "serviceId": 1,
  "workerId": 2,
  "bookingDate": "2024-11-20T10:00:00Z",
  "paymentMethodId": 1,
  "notes": "Por favor usar productos sin olor fuerte"
}

// Response (201):
{
  "success": true,
  "message": "Reservación creada exitosamente",
  "booking": {
    "id": 123,
    "confirmationCode": "LAVA-2024-123",
    "serviceDate": "2024-11-20T10:00:00Z",
    "serviceName": "Lavado Premium",
    "workerName": "Manuel Pérez",
    "totalPrice": 25000,
    "status": "confirmed"
  }
}
```

#### **GET /api/bookings**
```javascript
// Descripción: Listar reservaciones del usuario
// Frontend: Sección "Mis Reservaciones" en perfil
// Auth: Requiere Bearer token

// Query params:
// ?status=pending,confirmed,in_progress (opcional)

// Response (200):
{
  "success": true,
  "bookings": [
    {
      "id": 123,
      "confirmationCode": "LAVA-2024-123",
      "serviceDate": "2024-11-20T10:00:00Z",
      "serviceName": "Lavado Premium",
      "workerName": "Manuel Pérez",
      "status": "confirmed",
      "totalPrice": 25000
    }
  ]
}
```

---

## 7. AUTENTICACIÓN Y SEGURIDAD

### 7.1 Flujo de Autenticación JWT

```javascript
// 1. Usuario hace login
// 2. Backend genera JWT token con payload:
{
  "userId": 123,
  "email": "usuario@example.com",
  "iat": 1699704000, // Issued at
  "exp": 1700308800  // Expires (7 días)
}

// 3. Frontend guarda token en localStorage
localStorage.setItem('authToken', token);

// 4. En cada request, frontend envía token en header:
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// 5. Middleware valida token en cada endpoint protegido
```

### 7.2 Middleware de Autenticación (auth.middleware.js)

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Extraer token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Agregar userId al request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = authMiddleware;
```

### 7.3 Seguridad de Contraseñas

```javascript
const bcrypt = require('bcrypt');

// Al registrar usuario:
const hashedPassword = await bcrypt.hash(password, 10);

// Al hacer login:
const isValidPassword = await bcrypt.compare(password, user.password_hash);
```

### 7.4 Validación de Datos

```javascript
// Middleware de validación (validate.middleware.js)
const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener mínimo 6 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contraseñas no coinciden'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateRegistration };
```

---

## 8. VARIABLES DE ENTORNO

### 8.1 Archivo .env

```bash
# Servidor
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lava2_db
DB_USER=postgres
DB_PASSWORD=your_db_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# Email (Nodemailer con Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_app_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="LAVA 2 <noreply@lava2.com>"

# AWS S3 (para almacenamiento de imágenes)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=lava2-uploads

# Cloudinary (alternativa a S3)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:3000

# Notificaciones Push (opcional)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Pasarelas de pago (futuro)
STRIPE_SECRET_KEY=sk_test_...
MERCADOPAGO_ACCESS_TOKEN=TEST-...
```

### 8.2 Archivo .env.example

```bash
# Copiar este archivo a .env y rellenar con valores reales

NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lava2_db
DB_USER=postgres
DB_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

FRONTEND_URL=http://localhost:3000
```

---

## 9. INTEGRACIÓN FRONTEND-BACKEND

### 9.1 Configuración de Axios en Frontend

```typescript
// src/services/api.ts

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 9.2 Service de Autenticación

```typescript
// src/services/authService.ts

import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const authService = {
  // Login
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Registro
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
```

### 9.3 Service de Usuario

```typescript
// src/services/userService.ts

import api from './api';

export const userService = {
  // Obtener perfil
  async getProfile(userId: number) {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  // Actualizar perfil
  async updateProfile(userId: number, data: FormData) {
    const response = await api.put(`/users/${userId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Completar perfil
  async completeProfile(userId: number, data: FormData) {
    const response = await api.put(`/users/${userId}/complete-profile`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
```

### 9.4 Service de Servicios

```typescript
// src/services/serviceService.ts

import api from './api';

export const serviceService = {
  // Obtener todos los servicios
  async getAllServices() {
    const response = await api.get('/services');
    return response.data;
  },

  // Obtener servicios destacados
  async getFeaturedServices() {
    const response = await api.get('/services/featured');
    return response.data;
  },

  // Obtener servicio por ID
  async getServiceById(serviceId: number) {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  }
};
```

### 9.5 Ejemplo de Uso en Componente

```typescript
// components/LoginScreen.tsx

import { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 🔗 Aquí se conecta con el backend
    setLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      
      toast.success('¡Bienvenido!');
      onLoginSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... JSX del componente
  );
}
```

---

## 10. FLUJOS DE DATOS CRÍTICOS

### 10.1 Flujo de Registro

```
1. Usuario llena formulario en RegisterScreen
   ↓
2. Frontend valida:
   - Email válido
   - Contraseñas coinciden
   - Longitud mínima
   ↓
3. POST /api/auth/register
   {
     email, password, confirmPassword
   }
   ↓
4. Backend valida y crea usuario:
   - Verifica email único
   - Hash de contraseña con bcrypt
   - Inserta en DB
   ↓
5. Response: { success: true, userId: 123 }
   ↓
6. Frontend navega a CompleteDataScreen
   ↓
7. Usuario completa perfil con foto
   ↓
8. PUT /api/users/:id/complete-profile
   (multipart/form-data con foto)
   ↓
9. Backend:
   - Upload foto a S3/Cloudinary
   - Actualiza registro en DB
   ↓
10. Response: { success: true, user: {...} }
    ↓
11. Frontend navega a Home
```

### 10.2 Flujo de Reservación

```
1. Usuario ve lista de servicios en ServicesScreen
   ↓
2. GET /api/services
   ↓
3. Usuario selecciona servicio
   ↓
4. Frontend muestra modal/pantalla de reservación
   ↓
5. Usuario selecciona:
   - Fecha y hora
   - Trabajador (opcional)
   - Método de pago
   ↓
6. POST /api/bookings
   {
     serviceId,
     workerId,
     bookingDate,
     paymentMethodId
   }
   ↓
7. Backend:
   - Valida disponibilidad de trabajador
   - Valida método de pago existe
   - Crea reservación en DB
   - Envía email de confirmación
   - Crea notificación
   ↓
8. Response: { success: true, booking: {...} }
   ↓
9. Frontend muestra confirmación
   ↓
10. Usuario recibe notificación push (opcional)
```

### 10.3 Flujo de Notificaciones

```
1. Backend detecta evento:
   - Vehículo recibido
   - Vehículo listo
   - Pago procesado
   - Reserva confirmada
   ↓
2. notificationService crea registro:
   INSERT INTO notifications
   (user_id, title, body, type)
   ↓
3. (Opcional) Envía push notification
   vía Firebase Cloud Messaging
   ↓
4. Frontend polling o WebSocket:
   GET /api/notifications/unread-count
   cada 30 segundos
   ↓
5. Actualiza badge en Navigation Bar
   ↓
6. Usuario abre NotificationsScreen
   ↓
7. GET /api/notifications
   ↓
8. Frontend renderiza lista
   ↓
9. Usuario hace click en notificación
   ↓
10. PUT /api/notifications/:id/mark-read
    ↓
11. Badge actualizado
```

---

## 11. GUÍA DE DESPLIEGUE

### 11.1 Preparación del Entorno

#### Desarrollo Local
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos PostgreSQL
createdb lava2_db
psql lava2_db < database/schema.sql

# 3. Configurar .env
cp .env.example .env
# Editar .env con valores reales

# 4. Iniciar servidor
npm run dev # con nodemon
# o
npm start
```

#### Producción

```bash
# 1. Variables de entorno de producción
NODE_ENV=production
DB_HOST=<RDS_ENDPOINT>
JWT_SECRET=<STRONG_SECRET>
# etc...

# 2. Build (si usa TypeScript)
npm run build

# 3. Iniciar con PM2
pm2 start dist/server.js --name lava2-api
pm2 save
pm2 startup
```

### 11.2 Opciones de Hosting

#### Backend API

**Opción 1: AWS (Recomendado para producción)**
- **EC2**: Servidor virtual Linux (Ubuntu 22.04)
- **RDS PostgreSQL**: Base de datos managed
- **ElastiCache Redis**: Caché managed
- **S3**: Almacenamiento de imágenes
- **CloudFront**: CDN para assets
- **Load Balancer**: Para alta disponibilidad

**Opción 2: Heroku (Rápido para MVP)**
```bash
# Desplegar a Heroku
heroku create lava2-api
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git push heroku main
```

**Opción 3: Railway / Render**
- Deploy automático desde GitHub
- PostgreSQL incluido
- SSL gratis
- Escalado automático

#### Base de Datos

**Producción:**
- AWS RDS PostgreSQL (managed)
- Google Cloud SQL
- Neon.tech (serverless Postgres)

**Desarrollo:**
- PostgreSQL local
- Docker container

#### Almacenamiento de Imágenes

**Opción 1: AWS S3**
```javascript
// uploadService.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

async function uploadToS3(file, userId) {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/profiles/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  return result.Location; // URL pública
}
```

**Opción 2: Cloudinary**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(file) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'lava2/profiles',
    resource_type: 'image'
  });
  return result.secure_url;
}
```

### 11.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to AWS EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/lava2-api
            git pull origin main
            npm install --production
            pm2 restart lava2-api
```

### 11.4 Monitoreo y Logs

```javascript
// logger.js usando Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

**Servicios de monitoreo recomendados:**
- **Sentry**: Para tracking de errores
- **New Relic**: Para performance monitoring
- **DataDog**: Para logs y métricas
- **PM2 Plus**: Para monitoreo de Node.js

---

## 12. CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Setup Inicial
- [ ] Crear repositorio Git
- [ ] Inicializar proyecto Node.js
- [ ] Instalar dependencias base
- [ ] Configurar ESLint y Prettier
- [ ] Crear estructura de carpetas
- [ ] Configurar variables de entorno

### Fase 2: Base de Datos
- [ ] Instalar PostgreSQL
- [ ] Crear base de datos
- [ ] Ejecutar schema SQL
- [ ] Configurar conexión en código
- [ ] Crear modelos/ORM
- [ ] Seeders con datos de prueba

### Fase 3: Autenticación
- [ ] Implementar registro de usuarios
- [ ] Implementar login con JWT
- [ ] Middleware de autenticación
- [ ] Hash de contraseñas con bcrypt
- [ ] Refresh tokens (opcional)

### Fase 4: Endpoints Core
- [ ] CRUD de usuarios
- [ ] Upload de imágenes (perfil)
- [ ] CRUD de servicios
- [ ] CRUD de trabajadores
- [ ] Sistema de reservaciones
- [ ] Métodos de pago
- [ ] Historial de servicios
- [ ] Notificaciones

### Fase 5: Integraciones
- [ ] Servicio de email (Nodemailer)
- [ ] Almacenamiento S3/Cloudinary
- [ ] Push notifications (Firebase)
- [ ] Pasarela de pagos (futuro)

### Fase 6: Testing
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración
- [ ] Tests de endpoints (Supertest)
- [ ] Coverage mínimo 70%

### Fase 7: Despliegue
- [ ] Configurar servidor de producción
- [ ] Deploy de base de datos
- [ ] Deploy de API
- [ ] Configurar dominio y SSL
- [ ] Monitoreo y logs
- [ ] Backups automáticos

---

## 13. RECURSOS Y DOCUMENTACIÓN

### Documentación Oficial
- Node.js: https://nodejs.org/docs
- Express.js: https://expressjs.com
- PostgreSQL: https://www.postgresql.org/docs
- JWT: https://jwt.io/introduction

### Tutoriales Recomendados
- Node.js + Express + PostgreSQL: [Tutorial completo]
- JWT Authentication: [Guía de implementación]
- File Upload con Multer: [Documentación]
- Deployment en AWS: [Tutorial paso a paso]

### Herramientas
- Postman: Para testing de API
- DBeaver: Cliente de PostgreSQL
- VS Code: Editor recomendado
- Git: Control de versiones

---

## 14. CONTACTO Y SOPORTE

Para dudas sobre la implementación del backend:

- **Documentación frontend**: Ver archivos en `/components`
- **Comentarios en código**: Todos los archivos `.tsx` tienen comentarios `// 🔗 Endpoint sugerido`
- **Issues**: Abrir en el repositorio para dudas específicas

---

## CONCLUSIÓN

Esta guía proporciona todo lo necesario para implementar el backend de LAVA 2 usando arquitectura cliente-servidor con Node.js y PostgreSQL.

**Pasos siguientes:**
1. Revisar los comentarios en el código frontend (archivos `.tsx`)
2. Implementar endpoints según esta guía
3. Probar cada endpoint con Postman
4. Integrar con frontend progresivamente
5. Desplegar a producción

**Tiempo estimado de implementación:**
- Backend básico: 2-3 semanas
- Integraciones: 1 semana
- Testing y deployment: 1 semana
- **Total: 4-5 semanas**

---

**Última actualización:** Noviembre 2024  
**Versión del documento:** 1.0
