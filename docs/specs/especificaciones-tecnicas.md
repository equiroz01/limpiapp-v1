# Especificaciones Técnicas - LimpiApp

## 1. Arquitectura del Sistema

### Visión General
```
┌─────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN            │
├──────────────┬──────────────────────────┤
│  App Cliente │  App Housekeeper         │
│  (iOS/Android)│ (iOS/Android)           │
│              │                          │
│  Panel Admin Web                        │
└──────────────┴──────────────────────────┘
              ▼
┌─────────────────────────────────────────┐
│         API GATEWAY / LOAD BALANCER     │
└─────────────────────────────────────────┘
              ▼
┌─────────────────────────────────────────┐
│         CAPA DE APLICACIÓN (Backend)    │
├─────────────────────────────────────────┤
│  • Servicios REST API                   │
│  • GraphQL API (opcional)               │
│  • WebSocket (real-time)                │
│  • Microservicios                       │
└─────────────────────────────────────────┘
              ▼
┌─────────────────────────────────────────┐
│         CAPA DE SERVICIOS               │
├─────────────────────────────────────────┤
│  Auth Service  │  User Service          │
│  Booking Svc   │  Payment Service       │
│  Notification  │  Geolocation Svc       │
│  Chat Service  │  Rating Service        │
└─────────────────────────────────────────┘
              ▼
┌─────────────────────────────────────────┐
│         CAPA DE DATOS                   │
├─────────────────────────────────────────┤
│  PostgreSQL    │  MongoDB               │
│  Redis Cache   │  ElasticSearch         │
└─────────────────────────────────────────┘
              ▼
┌─────────────────────────────────────────┐
│         SERVICIOS EXTERNOS              │
├─────────────────────────────────────────┤
│  Stripe/Payment │ Google Maps           │
│  SendGrid/Email │ Twilio/SMS            │
│  AWS S3/Storage │ Firebase/Push         │
│  Cloudflare/CDN │ Auth0/Cognito         │
└─────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico Recomendado

### Frontend Mobile (Apps Nativas)

#### Opción 1: React Native (Recomendada)
```javascript
// Ventajas: Un código base para iOS y Android
// Performance cercano a nativo
// Gran ecosistema

Tecnologías:
- React Native 0.73+
- React Navigation 6
- Redux Toolkit / Zustand (state management)
- React Query (data fetching)
- Axios (HTTP client)
- Socket.io-client (real-time)
- React Native Maps
- React Native Geolocation
- AsyncStorage / MMKV (local storage)
- React Native Paper / Native Base (UI)
```

#### Opción 2: Flutter
```dart
// Ventajas: Excelente performance
// UI hermosa out-of-the-box
// Compilación a código nativo

Tecnologías:
- Flutter 3.x
- Dart 3.x
- Provider / Riverpod (state)
- Dio (HTTP)
- Google Maps Flutter
- Firebase Flutter SDK
```

### Backend

#### Opción 1: Node.js + Express (Recomendada para MVP)
```javascript
Tecnologías:
- Node.js 20 LTS
- Express.js 4.x
- TypeScript
- Prisma / TypeORM (ORM)
- Socket.io (WebSockets)
- JWT (autenticación)
- bcrypt (passwords)
- multer (file uploads)
- joi / zod (validación)
- winston (logging)
```

#### Opción 2: Python + Django/FastAPI
```python
Tecnologías:
- Python 3.11+
- FastAPI / Django 4.x
- PostgreSQL
- Celery (tareas async)
- Redis (cache/queues)
- SQLAlchemy / Django ORM
```

### Base de Datos

#### PostgreSQL (Principal)
```sql
Uso:
- Usuarios (clientes y housekeepers)
- Reservas
- Transacciones
- Calificaciones
- Configuraciones

Ventajas:
- ACID compliant
- Relaciones complejas
- JSON support
- Full-text search
```

#### MongoDB (Complementaria - Opcional)
```javascript
Uso:
- Mensajes de chat
- Logs de actividad
- Notificaciones
- Datos de tracking

Ventajas:
- Flexible schema
- Escalabilidad horizontal
- Queries rápidos en documentos
```

#### Redis
```
Uso:
- Cache de sesiones
- Rate limiting
- Queues (bull/bee)
- Pub/Sub para real-time
- Cache de búsquedas frecuentes
```

### Servicios en la Nube

#### AWS (Amazon Web Services)
```
- EC2: Servidores de aplicación
- RDS: PostgreSQL administrado
- ElastiCache: Redis administrado
- S3: Almacenamiento de fotos/documentos
- CloudFront: CDN
- Lambda: Funciones serverless
- SQS: Message queues
- SNS: Notificaciones push
- CloudWatch: Monitoring
```

#### Alternativas
- **Google Cloud Platform (GCP)**
  - App Engine, Cloud SQL, Cloud Storage

- **Azure**
  - App Service, Azure Database, Blob Storage

- **DigitalOcean** (Más económico para MVP)
  - Droplets, Managed Databases, Spaces

---

## 3. Modelos de Datos (Esquema de Base de Datos)

### Usuarios Base
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_photo_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    user_type VARCHAR(20) NOT NULL, -- 'client' or 'housekeeper'
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, banned
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

### Clientes
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY REFERENCES users(id),
    preferences JSONB, -- tamaño hogar, servicios favoritos
    total_bookings INT DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(3,2), -- rating dado a housekeepers
    wallet_balance DECIMAL(10,2) DEFAULT 0
);
```

### Housekeepers
```sql
CREATE TABLE housekeepers (
    id UUID PRIMARY KEY REFERENCES users(id),
    bio TEXT,
    years_experience INT,
    hourly_rate DECIMAL(8,2) NOT NULL,
    services_offered TEXT[], -- ['cleaning', 'cooking', 'bathrooms']
    has_own_supplies BOOLEAN DEFAULT false,
    coverage_radius_km INT DEFAULT 10,
    availability_schedule JSONB, -- horarios por día de semana

    -- Verificación
    is_verified BOOLEAN DEFAULT false,
    verification_status VARCHAR(20), -- pending, approved, rejected
    identity_verified BOOLEAN DEFAULT false,
    background_check_status VARCHAR(20),
    background_check_date DATE,

    -- Estadísticas
    total_services INT DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(3,2),
    total_reviews INT DEFAULT 0,
    acceptance_rate DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    cancellation_rate DECIMAL(5,2),

    -- Estado
    is_available BOOLEAN DEFAULT false,
    currently_serving BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Direcciones
```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    label VARCHAR(50), -- 'home', 'office', 'other'
    street_address VARCHAR(255) NOT NULL,
    apartment_number VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'MX',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    additional_instructions TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Reservas (Bookings)
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE NOT NULL, -- ej: LMP-4532

    -- Participantes
    client_id UUID REFERENCES clients(id),
    housekeeper_id UUID REFERENCES housekeepers(id),
    address_id UUID REFERENCES addresses(id),

    -- Tiempo
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIME NOT NULL,
    scheduled_end_time TIME NOT NULL,
    estimated_duration_minutes INT NOT NULL,

    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    actual_duration_minutes INT,

    -- Servicios
    services_requested TEXT[] NOT NULL,
    home_size VARCHAR(20), -- small, medium, large
    has_pets BOOLEAN DEFAULT false,
    special_instructions TEXT,

    -- Pricing
    base_price DECIMAL(8,2) NOT NULL,
    extra_services_price DECIMAL(8,2) DEFAULT 0,
    extra_time_price DECIMAL(8,2) DEFAULT 0,
    subtotal DECIMAL(8,2) NOT NULL,
    service_fee DECIMAL(8,2) NOT NULL,
    tax DECIMAL(8,2) NOT NULL,
    tip DECIMAL(8,2) DEFAULT 0,
    total_price DECIMAL(8,2) NOT NULL,

    -- Estado
    status VARCHAR(20) NOT NULL,
    -- pending, accepted, rejected, cancelled,
    -- in_progress, completed, disputed

    cancellation_reason TEXT,
    cancelled_by VARCHAR(20), -- client, housekeeper, system
    cancelled_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_housekeeper ON bookings(housekeeper_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
```

### Pagos
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),

    -- Monto
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',

    -- Método de pago
    payment_method VARCHAR(50), -- card, cash, paypal
    payment_provider VARCHAR(50), -- stripe, paypal

    -- IDs externos
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),

    -- Estado
    status VARCHAR(20), -- pending, authorized, captured, failed, refunded

    -- Metadata
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),

    refund_amount DECIMAL(10,2),
    refund_reason TEXT,
    refunded_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);
```

### Transferencias a Housekeepers
```sql
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    housekeeper_id UUID REFERENCES housekeepers(id),

    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,

    -- Relacionado
    booking_ids UUID[], -- array de bookings incluidos

    -- Método
    payout_method VARCHAR(50), -- bank_transfer, paypal

    -- Estado
    status VARCHAR(20), -- pending, processing, completed, failed

    -- Banking
    bank_account_id UUID,
    transaction_reference VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

### Calificaciones y Reseñas
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) UNIQUE,

    -- De cliente a housekeeper (público)
    client_to_housekeeper_rating INT CHECK (client_to_housekeeper_rating BETWEEN 1 AND 5),
    client_to_housekeeper_review TEXT,
    client_review_aspects JSONB, -- {punctuality: true, quality: true, ...}

    -- De housekeeper a cliente (privado)
    housekeeper_to_client_rating INT CHECK (housekeeper_to_client_rating BETWEEN 1 AND 5),
    housekeeper_comments TEXT, -- solo para uso interno

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

### Mensajes/Chat
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    client_id UUID REFERENCES users(id),
    housekeeper_id UUID REFERENCES users(id),

    last_message_at TIMESTAMP,
    last_message_preview TEXT,

    client_unread_count INT DEFAULT 0,
    housekeeper_unread_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id),

    message_type VARCHAR(20), -- text, image, location
    message_content TEXT NOT NULL,
    media_url VARCHAR(500),

    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

### Notificaciones
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),

    type VARCHAR(50) NOT NULL,
    -- booking_confirmed, housekeeper_arrived, service_completed, etc.

    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB, -- metadata adicional

    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,

    push_sent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

### Documentos de Verificación
```sql
CREATE TABLE verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    housekeeper_id UUID REFERENCES housekeepers(id),

    document_type VARCHAR(50), -- id_card, passport, background_check
    document_number VARCHAR(100),

    front_image_url VARCHAR(500),
    back_image_url VARCHAR(500),

    status VARCHAR(20), -- pending, approved, rejected
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    reviewed_at TIMESTAMP,

    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. APIs Principales

### Autenticación
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/verify-phone
```

### Usuarios
```
GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me
POST   /api/v1/users/me/photo
GET    /api/v1/users/:id/public-profile
```

### Housekeepers (Búsqueda y Perfil)
```
GET    /api/v1/housekeepers/search
       ?lat=19.4326&lng=-99.1332&radius=10
       &date=2024-12-15&time=15:00&duration=120
       &services[]=cleaning&services[]=bathrooms
       &min_rating=4.0&max_price=200

GET    /api/v1/housekeepers/:id
GET    /api/v1/housekeepers/:id/reviews
GET    /api/v1/housekeepers/:id/availability
```

### Reservas
```
POST   /api/v1/bookings              # Crear reserva
GET    /api/v1/bookings              # Listar mis reservas
GET    /api/v1/bookings/:id          # Detalles
PUT    /api/v1/bookings/:id          # Modificar
DELETE /api/v1/bookings/:id          # Cancelar

# Flujo específico para housekeepers
PUT    /api/v1/bookings/:id/accept   # Aceptar
PUT    /api/v1/bookings/:id/reject   # Rechazar
PUT    /api/v1/bookings/:id/start    # Iniciar servicio
PUT    /api/v1/bookings/:id/complete # Finalizar
```

### Pagos
```
POST   /api/v1/payments/methods           # Agregar tarjeta
GET    /api/v1/payments/methods           # Listar
DELETE /api/v1/payments/methods/:id      # Eliminar
POST   /api/v1/payments/process           # Procesar pago
GET    /api/v1/payments/history           # Historial
```

### Calificaciones
```
POST   /api/v1/reviews
GET    /api/v1/reviews/booking/:booking_id
```

### Chat
```
GET    /api/v1/conversations
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
PUT    /api/v1/conversations/:id/mark-read
```

### WebSocket Events (Real-time)
```javascript
// Cliente escucha
socket.on('booking:accepted')
socket.on('booking:cancelled')
socket.on('housekeeper:en-route')
socket.on('housekeeper:arrived')
socket.on('service:started')
socket.on('service:completed')
socket.on('message:received')
socket.on('location:update')

// Housekeeper escucha
socket.on('booking:new-request')
socket.on('booking:cancelled-by-client')
socket.on('message:received')
```

---

## 5. Seguridad

### Autenticación
- JWT tokens (access + refresh)
- Tokens expiran en 1 hora
- Refresh tokens en 7 días
- HTTPOnly cookies para web
- Secure storage en mobile

### Autorización
```javascript
// Middleware de ejemplo
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Uso
router.get('/housekeepers/earnings',
  authenticate,
  authorize(['housekeeper']),
  getEarnings
);
```

### Encriptación
- Passwords: bcrypt (salt rounds: 12)
- Datos sensibles en BD: AES-256
- HTTPS/TLS para todas las comunicaciones
- Certificados SSL válidos

### Rate Limiting
```javascript
// Login attempts
- 5 intentos por 15 minutos por IP
- 3 intentos por 15 minutos por email

// API general
- 100 requests por minuto por usuario autenticado
- 20 requests por minuto por IP no autenticada
```

### Validación de Inputs
- Sanitización de todos los inputs
- Validación de tipos y formatos
- Prevención de SQL injection
- Prevención de XSS

---

## 6. Servicios de Terceros Requeridos

### Pagos
**Stripe** (Recomendado)
```javascript
Características necesarias:
- Payment Intents (PCI compliance)
- Connect (para pagos a housekeepers)
- Webhooks (confirmaciones)
- Refunds
- Dispute handling
```

### Mapas y Geolocalización
**Google Maps Platform**
```javascript
APIs necesarias:
- Maps SDK (iOS/Android)
- Geocoding API
- Directions API
- Distance Matrix API
- Places API
```

### Notificaciones Push
**Firebase Cloud Messaging (FCM)**
```javascript
- Notificaciones iOS
- Notificaciones Android
- Topics y targeting
- Analytics
```

### SMS
**Twilio**
```javascript
- Verificación de teléfono
- Códigos OTP
- Notificaciones críticas
```

### Email
**SendGrid / AWS SES**
```javascript
- Emails transaccionales
- Confirmaciones
- Recordatorios
- Marketing (opcional)
```

### Almacenamiento de Archivos
**AWS S3 / Cloudflare R2**
```javascript
- Fotos de perfil
- Documentos de verificación
- Fotos de chat
- Receipts/facturas
```

### Verificación de Identidad
**Stripe Identity / Onfido / Jumio**
```javascript
- Verificación de documentos
- Liveness check
- Background checks
```

---

## 7. Monitoreo y Analytics

### Logging
```javascript
Winston + CloudWatch / Datadog
- Error logging
- Request logging
- Performance metrics
```

### Analytics
```javascript
- Google Analytics / Mixpanel
- Eventos de usuario
- Conversion funnels
- Retention metrics
```

### Monitoring
```javascript
- Uptime monitoring (Pingdom, StatusPage)
- Error tracking (Sentry)
- Performance (New Relic, DataDog)
```

---

## 8. Estimación de Costos Mensuales (Fase MVP)

### Infraestructura (AWS)
- EC2 (t3.medium x 2): $70
- RDS PostgreSQL (db.t3.medium): $80
- ElastiCache Redis: $40
- S3 Storage (100GB): $3
- CloudFront CDN: $20
- **Subtotal: ~$213/mes**

### Servicios de Terceros
- Stripe: 2.9% + $0.30 por transacción
- Google Maps: $200/mes (estimado)
- Firebase: $25/mes
- Twilio SMS: $50/mes
- SendGrid: $15/mes
- **Subtotal: ~$290/mes + comisiones**

### **Total Estimado MVP: $500-700/mes**

*A medida que escales, estos costos crecerán proporcionalmente al uso.*
