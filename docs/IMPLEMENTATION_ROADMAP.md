# 🗺️ Roadmap de Implementación - LimpiApp MVP

Guía detallada de qué implementar y en qué orden para tener un MVP funcional.

---

## 📊 Estado Actual del Proyecto

### ✅ Completado (70% del MVP Backend)

**Documentación:**
- [x] Wireframes completos (6 archivos)
- [x] Flujos de usuario documentados
- [x] Especificaciones técnicas
- [x] Sistema de verificación diseñado
- [x] Políticas de seguridad y disputas

**Backend - Infraestructura:**
- [x] Configuración de TypeScript
- [x] Express.js server setup
- [x] Prisma ORM configurado
- [x] Esquema de base de datos completo (14 tablas)
- [x] Middleware de autenticación (JWT)
- [x] Middleware de rate limiting
- [x] Error handling centralizado
- [x] Logger (Winston)
- [x] Socket.IO configurado

**Backend - APIs:**
- [x] Auth: Registro, Login, Refresh Token
- [x] Users: Perfil, actualización
- [x] Housekeepers: Búsqueda, perfil, reviews
- [x] Bookings: CRUD completo, accept/reject, start/complete
- [x] Payments: Estructura básica (stubs)

### 🚧 En Progreso / Por Completar (30%)

**Backend - Integraciones:**
- [ ] Stripe (pagos)
- [ ] Twilio (SMS/verificación teléfono)
- [ ] SendGrid (emails)
- [ ] AWS S3 (uploads)
- [ ] Google Maps (geolocalización)
- [ ] Stripe Identity (verificación)

**Frontend Mobile:**
- [ ] Setup React Native
- [ ] Navegación
- [ ] Pantallas de onboarding
- [ ] Autenticación UI
- [ ] Búsqueda y booking
- [ ] Integración con APIs

**Otros:**
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Deployment scripts
- [ ] CI/CD pipeline

---

## 🎯 Fases de Implementación

## **Fase 1: Backend Core (2-3 semanas)** ✅ 70% Completo

### Semana 1: Setup y Autenticación ✅
- [x] Configurar proyecto TypeScript + Express
- [x] Configurar Prisma + PostgreSQL
- [x] Crear esquema de base de datos
- [x] Implementar registro y login
- [x] JWT authentication
- [x] Middleware de seguridad

### Semana 2: APIs Principales ✅
- [x] User profile endpoints
- [x] Housekeeper endpoints
- [x] Booking endpoints
- [x] Basic search functionality

### Semana 3: Integraciones Críticas 🚧
**Prioridad Alta:**

#### 1. Stripe Payments (3-4 días)
```typescript
// TODO: Implementar en payment.controller.ts

// a) Setup Stripe
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// b) Crear PaymentIntent
export const createPaymentIntent = async (bookingId: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100, // cents
    currency: 'mxn',
    metadata: { bookingId }
  });
  return paymentIntent.client_secret;
};

// c) Confirmar pago
export const confirmPayment = async (paymentIntentId: string) => {
  const payment = await stripe.paymentIntents.confirm(paymentIntentId);
  // Update booking status
  // Create Payment record
};

// d) Webhooks
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  // Handle events
});

// e) Connect para housekeepers (payout)
// Configurar Stripe Connect para transferencias
```

**Archivos a modificar:**
- `src/controllers/payment.controller.ts`
- `src/utils/stripe.ts` (nuevo)
- `src/routes/payment.routes.ts`

**Testing:**
- Usar Stripe test mode
- Test cards: 4242 4242 4242 4242

---

#### 2. Twilio SMS (1-2 días)
```typescript
// TODO: Implementar en auth.controller.ts

import twilio from 'twilio';
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// a) Enviar código de verificación
export const sendPhoneVerificationCode = async (phone: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store code in Redis with 10 min expiration
  await redis.setex(`phone:${phone}`, 600, code);

  // Send SMS
  await client.messages.create({
    body: `Tu código de verificación LimpiApp es: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};

// b) Verificar código
export const verifyPhoneCode = async (phone: string, code: string) => {
  const storedCode = await redis.get(`phone:${phone}`);
  if (storedCode === code) {
    // Update user phoneVerified = true
    await redis.del(`phone:${phone}`);
    return true;
  }
  return false;
};
```

**Archivos a modificar:**
- `src/controllers/auth.controller.ts`
- `src/utils/sms.ts` (nuevo)
- Setup Redis para cache de códigos

---

#### 3. SendGrid Email (1 día)
```typescript
// TODO: Implementar envío de emails

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (to: string, subject: string, html: string) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    html,
  };
  await sgMail.send(msg);
};

// Templates
export const sendWelcomeEmail = async (user: User) => {
  await sendEmail(
    user.email,
    '¡Bienvenido a LimpiApp!',
    welcomeEmailTemplate(user)
  );
};

export const sendBookingConfirmation = async (booking: Booking) => {
  await sendEmail(
    booking.client.user.email,
    'Reserva confirmada',
    bookingConfirmationTemplate(booking)
  );
};
```

**Emails a implementar:**
- Welcome email
- Email verification
- Booking confirmation
- Booking reminder (24h before)
- Service completed
- Password reset

---

#### 4. AWS S3 File Upload (2 días)
```typescript
// TODO: Implementar upload de fotos

import AWS from 'aws-sdk';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

// Upload function
export const uploadToS3 = async (file: Express.Multer.File, folder: string) => {
  const key = `${folder}/${uuidv4()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  const result = await s3.upload(params).promise();
  return result.Location; // URL
};

// Route
router.post('/me/photo', authenticate, upload.single('photo'), async (req, res) => {
  const photoUrl = await uploadToS3(req.file!, 'profile-photos');

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { profilePhoto: photoUrl }
  });

  res.json({ success: true, data: { photoUrl } });
});
```

**Archivos a modificar:**
- `src/controllers/user.controller.ts`
- `src/utils/upload.ts` (nuevo)
- `src/middleware/upload.middleware.ts` (nuevo)

---

## **Fase 2: Frontend Mobile (3-4 semanas)** 🚧 0% Completo

### Semana 1: Setup y Navegación
```bash
# Inicializar proyecto React Native
npx react-native@latest init LimpiAppMobile --template react-native-template-typescript

cd LimpiAppMobile

# Instalar dependencias
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux
npm install axios react-query
npm install socket.io-client
npm install react-native-maps
npm install @stripe/stripe-react-native
```

**Estructura de carpetas:**
```
mobile/
├── src/
│   ├── screens/
│   │   ├���─ auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── client/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── BookingScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── housekeeper/
│   │       ├── DashboardScreen.tsx
│   │       ├── BookingsScreen.tsx
│   │       └── EarningsScreen.tsx
│   ├── components/
│   ├── navigation/
│   ├── store/
│   ├── services/
│   ├── utils/
│   └── types/
```

**Tareas:**
- [ ] Setup navegación básica
- [ ] Crear stack de autenticación
- [ ] Crear tab navigator para cliente
- [ ] Crear tab navigator para housekeeper
- [ ] Configurar Redux/Zustand

### Semana 2: Autenticación UI
- [ ] Pantalla de welcome/splash
- [ ] Pantalla de login
- [ ] Pantalla de registro (cliente)
- [ ] Pantalla de registro (housekeeper)
- [ ] Integración con API de auth
- [ ] Manejo de tokens (AsyncStorage)
- [ ] Protected routes

### Semana 3: Cliente Flow
- [ ] Home screen con servicios
- [ ] Búsqueda de housekeepers
- [ ] Filtros (precio, distancia, rating)
- [ ] Perfil de housekeeper
- [ ] Proceso de booking (formulario)
- [ ] Confirmación y pago (Stripe)
- [ ] Mis reservas

### Semana 4: Housekeeper Flow
- [ ] Dashboard con estadísticas
- [ ] Lista de solicitudes
- [ ] Aceptar/rechazar booking
- [ ] Servicio activo (timer)
- [ ] Navegación (Google Maps)
- [ ] Finalizar servicio
- [ ] Historial de ganancias

---

## **Fase 3: Features Avanzadas (2-3 semanas)** 🔜

### Chat en Tiempo Real (3-4 días)
```typescript
// Backend ya tiene Socket.IO configurado

// 1. Crear controlador de chat
// src/controllers/chat.controller.ts
export const sendMessage = async (req, res) => {
  const { conversationId, content } = req.body;

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: req.user!.id,
      messageContent: content
    }
  });

  // Emit via Socket.IO
  const io = req.app.get('io');
  io.to(conversationId).emit('new_message', message);

  res.json({ success: true, data: message });
};

// 2. Frontend - useChat hook
const useChat = (conversationId: string) => {
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    socket.emit('join_room', conversationId);

    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.emit('leave_room', conversationId);
    };
  }, [conversationId]);

  const sendMessage = (content: string) => {
    // Call API
    // Message will arrive via socket
  };

  return { messages, sendMessage };
};
```

### Notificaciones Push (2-3 días)
```typescript
// Setup Firebase Cloud Messaging

// 1. Backend
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const sendPushNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: any
) => {
  // Get user's FCM token from database
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user.fcmToken) return;

  await admin.messaging().send({
    token: user.fcmToken,
    notification: { title, body },
    data
  });
};

// 2. Frontend
import messaging from '@react-native-firebase/messaging';

// Request permission
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    // Send token to backend
    await api.post('/users/fcm-token', { token });
  }
};

// Listen for notifications
messaging().onMessage(async remoteMessage => {
  // Show local notification
});
```

### Tracking GPS (2 días)
```typescript
// Frontend
import Geolocation from '@react-native-community/geolocation';

const useLocationTracking = (bookingId: string, isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;

        // Send to backend via Socket.IO
        socket.emit('location_update', {
          bookingId,
          latitude,
          longitude
        });
      },
      error => console.error(error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [isActive]);
};
```

### Sistema de Calificaciones (2 días)
```typescript
// Ya está en el schema, solo falta UI

// Backend
export const createReview = async (req, res) => {
  const { bookingId, rating, review, aspects } = req.body;

  const createdReview = await prisma.review.create({
    data: {
      bookingId,
      userId: req.user!.id,
      clientToHousekeeperRating: rating,
      clientToHousekeeperReview: review,
      clientReviewAspects: aspects
    }
  });

  // Update housekeeper's average rating
  await updateHousekeeperRating(booking.housekeeperId);

  res.json({ success: true, data: createdReview });
};

// Frontend - Rating Screen
const RatingScreen = ({ booking }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const submitReview = async () => {
    await api.post('/reviews', {
      bookingId: booking.id,
      rating,
      review,
      aspects: {
        punctuality: true,
        quality: true,
        professionalism: true
      }
    });

    navigation.goBack();
  };

  return (
    <View>
      <StarRating rating={rating} onChange={setRating} />
      <TextInput value={review} onChange={setReview} />
      <Button onPress={submitReview}>Enviar</Button>
    </View>
  );
};
```

---

## **Fase 4: Verificación y Seguridad (2 semanas)** 🔜

### Verificación de Identidad - Stripe Identity (3-4 días)
```typescript
// Backend
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const startIdentityVerification = async (userId: string) => {
  const verificationSession = await stripe.identity.verificationSessions.create({
    type: 'document',
    metadata: { userId },
    options: {
      document: {
        require_live_capture: true,
        require_matching_selfie: true
      }
    }
  });

  return verificationSession.client_secret;
};

// Frontend
import { useStripeIdentity } from '@stripe/stripe-react-native';

const VerificationScreen = () => {
  const { verifyIdentity } = useStripeIdentity();

  const startVerification = async () => {
    const { clientSecret } = await api.post('/verification/start');

    const result = await verifyIdentity(clientSecret);

    if (result.status === 'verified') {
      // Update UI
    }
  };

  return <Button onPress={startVerification}>Verificar Identidad</Button>;
};
```

### Background Check Integration (2-3 días)
```typescript
// Integrar con Certicheck o similar

export const requestBackgroundCheck = async (housekeeperId: string) => {
  const housekeeper = await prisma.housekeeper.findUnique({
    where: { id: housekeeperId },
    include: { user: true }
  });

  // Call Certicheck API
  const response = await axios.post('https://api.certicheck.com/v1/checks', {
    firstName: housekeeper.user.firstName,
    lastName: housekeeper.user.lastName,
    documentNumber: housekeeper.documentNumber,
    // ...
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.CERTICHECK_API_KEY}`
    }
  });

  // Update verification record
  await prisma.verification.update({
    where: { housekeeperId },
    data: {
      backgroundCheckStatus: 'PENDING',
      backgroundCheckProvider: 'certicheck',
      backgroundCheckResult: response.data
    }
  });
};

// Webhook to receive results
app.post('/webhooks/certicheck', async (req, res) => {
  const { checkId, status, result } = req.body;

  // Update verification
  // Send notification to housekeeper
});
```

### Video Interview Scheduling (1-2 días)
```typescript
// Simple calendar integration

export const scheduleInterview = async (req, res) => {
  const { housekeeperId, preferredDate, preferredTime } = req.body;

  // Create calendar event (Google Calendar API)
  // Send email to both parties
  // Update verification record

  await prisma.verification.update({
    where: { housekeeperId },
    data: {
      interviewStatus: 'SCHEDULED',
      interviewDate: new Date(preferredDate)
    }
  });
};
```

---

## **Fase 5: Testing y QA (1-2 semanas)** 🔜

### Unit Tests
```typescript
// Setup Jest
npm install --save-dev jest @types/jest ts-jest

// Example test
describe('Auth Controller', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        userType: 'CLIENT'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
    });
  });
});
```

### Integration Tests
```typescript
// Test full flows
describe('Booking Flow', () => {
  it('should complete full booking process', async () => {
    // 1. Client creates booking
    const booking = await createBooking();

    // 2. Housekeeper accepts
    await acceptBooking(booking.id);

    // 3. Start service
    await startService(booking.id);

    // 4. Complete service
    await completeService(booking.id);

    // 5. Verify payment processed
    const payment = await getPayment(booking.id);
    expect(payment.status).toBe('CAPTURED');
  });
});
```

### E2E Tests (Mobile)
```typescript
// Detox or Appium
describe('Client Flow', () => {
  it('should complete booking', async () => {
    await element(by.id('login-email')).typeText('client@test.com');
    await element(by.id('login-password')).typeText('password');
    await element(by.id('login-button')).tap();

    await element(by.id('search-button')).tap();
    await element(by.id('housekeeper-0')).tap();
    await element(by.id('book-button')).tap();
    // ...
  });
});
```

---

## **Fase 6: Deployment (1 semana)** 🔜

### Backend Deployment

**1. AWS EC2**
```bash
# Setup script
#!/bin/bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

git clone https://github.com/tu-usuario/limpiapp.git
cd limpiapp/backend
npm install
npm run build

# Setup environment
cp .env.example .env
# Edit .env with production values

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start dist/server.js --name limpiapp-api
pm2 startup
pm2 save
```

**2. RDS PostgreSQL**
- Create RDS instance
- Update DATABASE_URL
- Run migrations

**3. ElastiCache Redis**
- Create Redis cluster
- Update REDIS_URL

**4. S3 + CloudFront**
- Create S3 bucket for uploads
- Create CloudFront distribution
- Update AWS configs

**5. Load Balancer + SSL**
- Setup Application Load Balancer
- Configure SSL certificate (AWS ACM)
- Point domain to ALB

### Mobile Deployment

**iOS:**
```bash
cd ios
pod install

# Build for TestFlight
xcodebuild -workspace LimpiApp.xcworkspace \
  -scheme LimpiApp \
  -configuration Release \
  -archivePath build/LimpiApp.xcarchive archive

# Upload to TestFlight
xcrun altool --upload-app -f LimpiApp.ipa \
  -u your@email.com -p app-specific-password
```

**Android:**
```bash
cd android
./gradlew assembleRelease

# Upload to Google Play Console (Internal Testing)
# Use Play Console web interface
```

---

## 📝 Checklist Final MVP

### Backend ✅
- [x] API REST completa
- [ ] Stripe integration
- [ ] Twilio SMS
- [ ] SendGrid emails
- [ ] AWS S3 uploads
- [ ] Tests (mínimo 50% coverage)
- [ ] Deployed a producción

### Frontend 🚧
- [ ] React Native setup
- [ ] Navegación completa
- [ ] Autenticación UI
- [ ] Cliente flow completo
- [ ] Housekeeper flow completo
- [ ] Stripe payments UI
- [ ] Real-time features
- [ ] Tests E2E críticos
- [ ] Deployed (TestFlight/Play Console)

### Verificación y Seguridad 🚧
- [ ] Stripe Identity integrado
- [ ] Background checks automatizados
- [ ] Video interview scheduling
- [ ] Trust score calculado
- [ ] Sistema de disputas funcional

### Documentación ✅
- [x] README completo
- [x] API documentation
- [x] Deployment guide
- [ ] User guides
- [ ] Video demos

---

## ⏱️ Estimación Total de Tiempo

| Fase | Duración | Status |
|------|----------|--------|
| Fase 1: Backend Core | 2-3 semanas | ✅ 70% |
| Fase 2: Frontend Mobile | 3-4 semanas | 🚧 0% |
| Fase 3: Features Avanzadas | 2-3 semanas | 🔜 |
| Fase 4: Verificación | 2 semanas | 🔜 |
| Fase 5: Testing & QA | 1-2 semanas | 🔜 |
| Fase 6: Deployment | 1 semana | 🔜 |
| **TOTAL** | **11-15 semanas** | **~3-4 meses** |

---

## 🎯 Próximo Sprint (Esta Semana)

**Prioridad 1: Completar Integraciones Backend**
1. Stripe payments (2 días)
2. Twilio SMS (1 día)
3. SendGrid emails (1 día)
4. AWS S3 uploads (1 día)

**Prioridad 2: Testing Básico**
5. Unit tests para auth (medio día)
6. Integration tests para bookings (medio día)

**Total: 5-6 días de trabajo**

---

**¡Vamos por ese MVP! 🚀**
