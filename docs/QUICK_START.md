# 🚀 Quick Start Guide - LimpiApp

Guía rápida para levantar el MVP del backend en 5 minutos.

---

## ⚡ Inicio Rápido (5 minutos)

### 1. Prerequisitos
```bash
# Verifica que tengas instalado:
node --version  # >= 18.0.0
npm --version   # >= 9.0.0
```

### 2. Clonar e Instalar

```bash
# Clonar repo
git clone https://github.com/tu-usuario/limpiapp.git
cd limpiapp/backend

# Instalar dependencias
npm install
```

### 3. Base de Datos - Opción Fácil (Docker)

```bash
# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
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

volumes:
  postgres_data:
EOF

# Iniciar PostgreSQL
docker-compose up -d

# Esperar 5 segundos para que inicie
sleep 5
```

### 4. Configurar Variables de Entorno

```bash
# Crear .env
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
API_VERSION=v1

DATABASE_URL="postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev?schema=public"

JWT_SECRET=mi-super-secreto-cambiar-en-produccion
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=mi-refresh-secreto
JWT_REFRESH_EXPIRES_IN=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

CORS_ORIGIN=http://localhost:3001,http://localhost:19006

LOG_LEVEL=debug
EOF
```

### 5. Migrar Base de Datos

```bash
# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar Prisma Client
npx prisma generate
```

### 6. Iniciar Servidor

```bash
npm run dev
```

✅ **Listo!** Tu servidor está corriendo en `http://localhost:3000`

---

## 🧪 Probar la API

### Health Check
```bash
curl http://localhost:3000/health
```

### Registrar Usuario Cliente
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "password123",
    "firstName": "María",
    "lastName": "López",
    "userType": "CLIENT",
    "phone": "+5215512345678"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-generado",
      "email": "maria@example.com",
      "firstName": "María",
      "lastName": "López",
      "userType": "CLIENT",
      "status": "PENDING_VERIFICATION"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Registrar Housekeeper
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ana@example.com",
    "password": "password123",
    "firstName": "Ana",
    "lastName": "García",
    "userType": "HOUSEKEEPER",
    "phone": "+5215587654321"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "password123"
  }'
```

Guarda el `accessToken` de la respuesta para las siguientes llamadas.

### Ver Perfil
```bash
# Reemplaza TOKEN con tu accessToken
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer TOKEN"
```

### Buscar Housekeepers
```bash
curl http://localhost:3000/api/v1/housekeepers/search
```

---

## 🗄️ Ver la Base de Datos

```bash
# Abrir Prisma Studio (GUI para ver/editar datos)
npx prisma studio
```

Abre automáticamente en `http://localhost:5555`

---

## 📁 Estructura de Archivos Creados

```
backend/
├── prisma/
│   └── schema.prisma          # ✅ Esquema de DB completo
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts      # ✅ Login, registro, tokens
│   │   ├── user.controller.ts      # ✅ Perfil de usuario
│   │   ├── housekeeper.controller.ts # ✅ Housekeepers
│   │   ├── booking.controller.ts   # ✅ Reservas
│   │   └── payment.controller.ts   # 🚧 Stubs (TODO: Stripe)
│   ├── routes/
│   │   ├── auth.routes.ts          # ✅
│   │   ├── user.routes.ts          # ✅
│   │   ├── housekeeper.routes.ts   # ✅
│   │   ├── booking.routes.ts       # ✅
│   │   └── payment.routes.ts       # ✅
│   ├── middleware/
│   │   ├── auth.middleware.ts      # ✅ JWT auth
│   │   ├── error.middleware.ts     # ✅ Error handling
│   │   └── rateLimiter.middleware.ts # ✅ Rate limiting
│   ├── utils/
│   │   └── logger.ts               # ✅ Winston logger
│   └── server.ts                   # ✅ Express app
├── package.json                    # ✅
├── tsconfig.json                   # ✅
├── .env.example                    # ✅
├── .gitignore                      # ✅
└── docker-compose.yml              # ✅
```

---

## 🎯 Próximos Pasos

### Funcionalidad Básica Funcionando ✅
- [x] Registro de usuarios (cliente y housekeeper)
- [x] Login con JWT
- [x] Refresh tokens
- [x] CRUD de perfil de usuario
- [x] Búsqueda de housekeepers
- [x] Crear/ver/aceptar/rechazar/cancelar reservas
- [x] Sistema de calificaciones (estructura)

### TODO: Integraciones Externas 🚧
- [ ] **Stripe** - Procesar pagos reales
- [ ] **Twilio** - Enviar SMS de verificación
- [ ] **SendGrid** - Enviar emails
- [ ] **AWS S3** - Subir fotos de perfil
- [ ] **Google Maps** - Búsqueda geoespacial
- [ ] **Stripe Identity** - Verificación de identidad

### TODO: Features Avanzadas 🔜
- [ ] Chat en tiempo real (Socket.IO ya configurado)
- [ ] Notificaciones push
- [ ] Sistema de disputas completo
- [ ] Panel de administración
- [ ] Analytics y métricas
- [ ] Tests unitarios y de integración

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev           # Servidor con hot-reload
npm run build         # Compilar TypeScript
npm start             # Servidor de producción

# Base de Datos
npx prisma studio     # GUI para ver datos
npx prisma migrate dev # Nueva migración
npx prisma generate   # Regenerar Prisma Client

# Ver logs
tail -f logs/combined.log  # Todos los logs
tail -f logs/error.log     # Solo errores

# Docker
docker-compose up -d      # Iniciar DB
docker-compose down       # Detener DB
docker-compose logs -f    # Ver logs
```

---

## 🐛 Troubleshooting

### Error: Cannot connect to database
```bash
# Verifica que PostgreSQL esté corriendo
docker-compose ps

# Si no está corriendo:
docker-compose up -d

# Verifica la conexión
psql "postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev"
```

### Error: Prisma Client not generated
```bash
npx prisma generate
```

### Error: Port 3000 already in use
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso en puerto 3000
lsof -ti:3000 | xargs kill
```

### Error: JWT_SECRET is not defined
```bash
# Asegúrate de tener el archivo .env
# y que tenga JWT_SECRET definido
cat .env | grep JWT_SECRET
```

---

## 📚 Recursos

- **Documentación Completa:** `./README.md`
- **Wireframes:** `./docs/wireframes/`
- **Especificaciones Técnicas:** `./docs/specs/especificaciones-tecnicas.md`
- **Sistema de Verificación:** `./docs/specs/sistema-verificacion.md`
- **Seguridad y Disputas:** `./docs/specs/disputas-y-seguridad.md`

---

## ✅ Checklist de Verificación

Después de seguir esta guía, deberías poder:

- [ ] Ver `http://localhost:3000/health` retorna OK
- [ ] Registrar un cliente vía API
- [ ] Registrar un housekeeper vía API
- [ ] Hacer login y recibir JWT token
- [ ] Ver perfil de usuario autenticado
- [ ] Abrir Prisma Studio y ver los datos
- [ ] Ver logs en `logs/combined.log`

Si todos los checks están ✅, **¡estás listo para empezar a desarrollar!**

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa la documentación completa en `README.md`
2. Busca en los issues de GitHub
3. Crea un nuevo issue con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs relevantes
   - Tu entorno (OS, Node version, etc.)

---

**Happy Coding! 🚀**

  Usuario Cliente:
  - Email: cliente@limpiapp.com
  - Password: Test123456
  - Tipo: CLIENT

  Usuario Profesional:
  - Email: profesional@limpiapp.com
  - Password: Test123456
  - Tipo: HOUSEKEEPER
