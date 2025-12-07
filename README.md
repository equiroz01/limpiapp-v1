# 🧹 LimpiApp - Plataforma de Servicios de Limpieza

**"Uber para Housekeepers"** - Conectando clientes con profesionales de limpieza verificados

---

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Desarrollo](#desarrollo)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Visión General

LimpiApp es una plataforma móvil que conecta clientes con housekeepers profesionales para servicios por hora, incluyendo:

- 🧹 Limpieza general y profunda
- 🍳 Cocina / Preparación de alimentos
- 🚿 Limpieza de baños
- 🧺 Lavandería
- 📦 Organización de espacios

### Características Principales

**Para Clientes:**
- Búsqueda y reserva de housekeepers verificados
- Calificaciones y reseñas transparentes
- Tracking en tiempo real del servicio
- Pagos seguros integrados
- Historial completo de servicios

**Para Housekeepers:**
- Verificación exhaustiva (identidad + antecedentes)
- Control total de horarios y tarifas
- Pagos rápidos y seguros
- Herramientas profesionales (timer, navegación)
- Dashboard con métricas

**Seguridad:**
- Sistema de verificación robusto (3 niveles)
- Botón de pánico integrado
- Seguros de responsabilidad civil
- Proceso de disputas y apelaciones
- Monitoreo continuo de comportamiento

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│     FRONTEND (React Native)             │
│     iOS + Android                       │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│     API GATEWAY                         │
│     Express.js + TypeScript             │
└───────────────┬─────────────────────────┘
                │
      ┌─────────┴─────────┐
      ▼                   ▼
┌─────────────┐   ┌───────────────┐
│ PostgreSQL  │   │ Redis Cache   │
│ (Prisma ORM)│   │               │
└─────────────┘   └───────────────┘
      │
      ▼
┌─────────────────────────────────────────┐
│   SERVICIOS EXTERNOS                    │
│   • Stripe (Pagos)                      │
│   • Google Maps (Geolocalización)       │
│   • Twilio (SMS)                        │
│   • SendGrid (Email)                    │
│   • AWS S3 (Storage)                    │
│   • Stripe Identity (Verificación)      │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías

### Backend
- **Runtime:** Node.js 18+ con TypeScript
- **Framework:** Express.js 4
- **ORM:** Prisma 5
- **Database:** PostgreSQL 15
- **Cache:** Redis
- **Auth:** JWT (jsonwebtoken)
- **Realtime:** Socket.IO
- **Validation:** express-validator
- **Logging:** Winston
- **Security:** Helmet, bcrypt, rate-limiting

### Frontend Mobile (Pendiente)
- React Native 0.73
- React Navigation 6
- Redux Toolkit / Zustand
- React Query
- Socket.IO Client
- React Native Maps
- Axios

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS (EC2, RDS, S3, CloudFront)

---

## 📁 Estructura del Proyecto

```
limpiapp/
├── backend/                # API Backend
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Helper functions
│   │   └── server.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── mobile/                 # React Native App (TODO)
│
├── docs/                   # Documentation
│   ├── wireframes/         # UI wireframes (6 files)
│   ├── user-flows/         # User flow diagrams
│   ├── specs/              # Technical specs
│   │   ├── especificaciones-tecnicas.md
│   │   ├── sistema-verificacion.md
│   │   └── disputas-y-seguridad.md
│   └── README.md
│
└── README.md               # Este archivo
```

---

## 🚀 Instalación y Configuración

### Prerequisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 15.0
Redis (opcional para cache)
```

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/limpiapp.git
cd limpiapp
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/limpiapp_dev"

# JWT
JWT_SECRET=tu-secret-key-muy-seguro
JWT_REFRESH_SECRET=tu-refresh-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave_de_stripe

# Twilio (SMS)
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token

# SendGrid (Email)
SENDGRID_API_KEY=tu_sendgrid_key

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET=limpiapp-uploads
```

### 4. Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Crear base de datos
createdb limpiapp_dev

# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar Prisma Client
npx prisma generate

# (Opcional) Seed data
npm run prisma:seed
```

#### Opción B: Docker Compose

```bash
# Crear docker-compose.yml en /backend
docker-compose up -d

# Ejecutar migraciones
npx prisma migrate deploy
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: limpiapp
      POSTGRES_PASSWORD: limpiapp123
      POSTGRES_DB: limpiapp_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 5. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor con hot-reload
npm run build            # Compila TypeScript a JavaScript
npm start                # Inicia servidor de producción

# Base de Datos
npm run prisma:generate  # Genera Prisma Client
npm run prisma:migrate   # Ejecuta migraciones
npm run prisma:studio    # Abre Prisma Studio (GUI)
npm run prisma:seed      # Seed data

# Calidad de Código
npm run lint             # ESLint
npm run format           # Prettier
npm test                 # Jest tests

# Logs
logs/combined.log        # Todos los logs
logs/error.log           # Solo errores
```

### Workflow de Desarrollo

1. **Crear feature branch**
```bash
git checkout -b feature/nombre-feature
```

2. **Hacer cambios y commits**
```bash
git add .
git commit -m "feat: descripción del feature"
```

3. **Push y crear Pull Request**
```bash
git push origin feature/nombre-feature
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Autenticación
Todas las rutas protegidas requieren header:
```
Authorization: Bearer {access_token}
```

### Endpoints Principales

#### Auth
```http
POST   /auth/register              # Registro
POST   /auth/login                 # Login
POST   /auth/refresh-token         # Refresh token
POST   /auth/verify-email          # Verificar email
POST   /auth/verify-phone/send-code # Enviar código SMS
POST   /auth/verify-phone/verify   # Verificar teléfono
POST   /auth/forgot-password       # Olvidé contraseña
POST   /auth/reset-password        # Reset contraseña
```

#### Users
```http
GET    /users/me                   # Obtener perfil
PUT    /users/me                   # Actualizar perfil
POST   /users/me/photo             # Subir foto
```

#### Housekeepers
```http
GET    /housekeepers/search        # Buscar housekeepers
GET    /housekeepers/:id           # Ver perfil
GET    /housekeepers/:id/reviews   # Ver reseñas
PUT    /housekeepers/profile       # Actualizar perfil (auth)
```

#### Bookings
```http
POST   /bookings                   # Crear reserva
GET    /bookings                   # Listar reservas
GET    /bookings/:id               # Ver detalles
PUT    /bookings/:id/accept        # Aceptar (housekeeper)
PUT    /bookings/:id/reject        # Rechazar (housekeeper)
DELETE /bookings/:id               # Cancelar
PUT    /bookings/:id/start         # Iniciar servicio
PUT    /bookings/:id/complete      # Finalizar servicio
```

#### Payments
```http
POST   /payments/methods           # Agregar tarjeta
GET    /payments/methods           # Listar tarjetas
DELETE /payments/methods/:id       # Eliminar tarjeta
POST   /payments/process           # Procesar pago
```

### Ejemplos de Uso

#### Registro de Cliente
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "password123",
    "firstName": "María",
    "lastName": "López",
    "userType": "CLIENT",
    "phone": "+5215512345678"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "password123"
  }'
```

#### Crear Reserva
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "housekeeperId": "uuid-housekeeper",
    "addressId": "uuid-address",
    "scheduledDate": "2024-12-10",
    "scheduledStartTime": "2024-12-10T15:00:00Z",
    "estimatedDurationMinutes": 120,
    "servicesRequested": ["cleaning", "bathrooms"],
    "homeSize": "medium",
    "hasPets": false,
    "specialInstructions": "Por favor tocar el timbre dos veces"
  }'
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Estructura de Tests
```
backend/
└── src/
    └── __tests__/
        ├── auth.test.ts
        ├── users.test.ts
        ├── bookings.test.ts
        └── ...
```

---

## 🚢 Deployment

### Producción con Docker

```bash
# Build imagen
docker build -t limpiapp-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  limpiapp-backend
```

### Deploy a AWS

1. **EC2 Setup**
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar y setup
git clone https://github.com/tu-usuario/limpiapp.git
cd limpiapp/backend
npm install
npm run build

# Iniciar con PM2
pm2 start dist/server.js --name limpiapp-api
pm2 startup
pm2 save
```

2. **RDS PostgreSQL**
- Crear instancia RDS PostgreSQL
- Configurar security groups
- Ejecutar migraciones: `npx prisma migrate deploy`

3. **S3 para Uploads**
- Crear bucket S3
- Configurar políticas de acceso
- Habilitar CORS

4. **CloudFront CDN**
- Crear distribución CloudFront
- Apuntar a S3 bucket

---

## 📊 Base de Datos

### Modelos Principales

- **User** - Usuario base (cliente o housekeeper)
- **Client** - Perfil de cliente
- **Housekeeper** - Perfil de housekeeper
- **Booking** - Reserva/servicio
- **Payment** - Pago
- **Review** - Calificación y reseña
- **Verification** - Datos de verificación
- **TrustScore** - Score de confianza
- **Notification** - Notificaciones
- **Message** - Chat

### Diagrama ER
Ver archivo `docs/specs/especificaciones-tecnicas.md` para el esquema completo.

---

## 🔒 Seguridad

### Implementado
- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Helmet (security headers)
- ✅ CORS configurado
- ✅ Input validation
- ✅ SQL injection prevention (Prisma)

### Por Implementar
- ⏳ 2FA (Two-factor authentication)
- ⏳ API key management
- ⏳ Encryption at rest
- ⏳ Security audit logging
- ⏳ DDoS protection

---

## 📝 Roadmap

### Fase 1: MVP (Actual)
- [x] Backend API básico
- [x] Autenticación JWT
- [x] Modelos de base de datos
- [x] APIs de bookings
- [ ] App móvil React Native
- [ ] Integración Stripe
- [ ] Verificación básica

### Fase 2: Features Core
- [ ] Chat en tiempo real
- [ ] Tracking GPS
- [ ] Notificaciones push
- [ ] Sistema de calificaciones
- [ ] Panel admin web

### Fase 3: Escalamiento
- [ ] Verificación automática
- [ ] Analytics dashboard
- [ ] Sistema de referidos
- [ ] Suscripciones premium

---

## 🤝 Contributing

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Tests para nuevas features

---

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para más detalles

---

## 👥 Equipo

- **Product Owner:** [Tu Nombre]
- **Backend:** [Desarrollador Backend]
- **Mobile:** [Desarrollador React Native]
- **DevOps:** [DevOps Engineer]

---

## 📞 Contacto y Soporte

- **Email:** soporte@limpiapp.com
- **GitHub Issues:** [Reportar problema](https://github.com/tu-usuario/limpiapp/issues)
- **Documentación:** [Ver docs completos](./docs/README.md)

---

## 🙏 Agradecimientos

- Anthropic Claude para documentación y arquitectura
- Comunidad open source
- Beta testers

---

**¡Hecho con ❤️ en México 🇲🇽**
