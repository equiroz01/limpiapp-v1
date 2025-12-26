# 📊 Resumen de Scripts SQL - LimpiApp

## ✅ Scripts Creados para PostgreSQL

### 📁 Estructura de Archivos

```
limpiapp/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql     ⭐ Schema completo
│   │   └── seed.sql                       ⭐ Datos de prueba
│   └── scripts/
│       ├── setup-database.sh              ⭐ Setup automático
│       ├── backup-database.sh             ⭐ Crear backups
│       └── restore-database.sh            ⭐ Restaurar backups
└── POSTGRESQL_SETUP.md                    ⭐ Documentación completa
```

---

## 🗄️ Schema SQL (001_initial_schema.sql)

### Tablas Creadas (17 total)

#### Core Tables
1. **users** - Usuario base (clientes, housekeepers, admins)
2. **clients** - Perfil de clientes
3. **housekeepers** - Perfil de housekeepers
4. **addresses** - Direcciones de servicio

#### Booking & Payments
5. **bookings** - Reservas de servicios
6. **payments** - Pagos procesados
7. **payment_methods** - Métodos de pago guardados
8. **payouts** - Pagos a housekeepers

#### Reviews & Trust
9. **reviews** - Calificaciones bidireccionales
10. **verifications** - Datos de verificación
11. **trust_scores** - Score de confianza

#### Communication
12. **conversations** - Conversaciones de chat
13. **messages** - Mensajes individuales
14. **notifications** - Notificaciones push/email/SMS

#### Safety
15. **disputes** - Disputas entre usuarios

#### Banking
16. **bank_accounts** - Cuentas bancarias para payouts

### ENUMs Creados (7 total)
- `user_type` - CLIENT, HOUSEKEEPER, ADMIN
- `user_status` - ACTIVE, SUSPENDED, BANNED, PENDING_VERIFICATION
- `verification_status` - PENDING, APPROVED, REJECTED, NEEDS_REVIEW
- `booking_status` - PENDING, ACCEPTED, REJECTED, CANCELLED, IN_PROGRESS, COMPLETED, DISPUTED
- `payment_status` - PENDING, AUTHORIZED, CAPTURED, FAILED, REFUNDED, PARTIALLY_REFUNDED
- `dispute_status` - OPEN, INVESTIGATING, RESOLVED, CLOSED
- `risk_level` - LOW, MEDIUM, HIGH

### Índices Creados (35+)
- Índices en campos clave para performance
- Índices compuestos para queries comunes
- Índices GiST para búsqueda geoespacial (lat/lng)

### Triggers
- `update_updated_at_column()` en todas las tablas relevantes

---

## 🌱 Datos de Prueba (seed.sql)

### Usuarios Creados

**Admin:**
- Email: `admin@limpiapp.com`
- Password: `admin123`
- Tipo: ADMIN

**Clientes (3):**
1. María López
   - Email: `maria.lopez@example.com`
   - Password: `password123`
   - 5 servicios completados
   - $2,500 gastados

2. Carlos Ruiz
   - Email: `carlos.ruiz@example.com`
   - Password: `password123`
   - 2 servicios

3. Laura Martínez
   - Email: `laura.martinez@example.com`
   - Password: `password123`
   - 1 servicio

**Housekeepers (4):**
1. Ana García ⭐ 4.9 (Top rated)
   - Email: `ana.garcia@example.com`
   - Password: `password123`
   - $150/hora
   - 487 servicios completados
   - Nivel: ORO ✅

2. Laura Martínez ⭐ 4.8
   - Email: `laura.m@example.com`
   - Password: `password123`
   - $140/hora
   - 189 servicios
   - Nivel: PLATA ✅

3. Carmen López ⭐ 4.7
   - Email: `carmen.lopez@example.com`
   - Password: `password123`
   - $135/hora
   - 156 servicios
   - Nivel: PLATA ✅

4. Sofía Ramírez (Pendiente verificación)
   - Email: `sofia.ramirez@example.com`
   - Password: `password123`
   - $130/hora
   - Nueva en la plataforma
   - Nivel: BRONCE 🔄

### Datos Adicionales
- **4 Direcciones** guardadas
- **3 Reservas** (1 completada, 1 aceptada, 1 pendiente)
- **1 Reseña** de 5 estrellas
- **3 Notificaciones** de ejemplo
- **7 Trust Scores** calculados

---

## 🛠️ Scripts de Shell

### 1. setup-database.sh

**Qué hace:**
- Verifica conexión a PostgreSQL
- Crea base de datos `limpiapp_dev`
- Ejecuta migración del schema
- Opcionalmente siembra datos de prueba
- Muestra resumen de usuarios creados

**Uso:**
```bash
cd backend/scripts
./setup-database.sh
```

### 2. backup-database.sh

**Qué hace:**
- Crea backup timestamped de la BD
- Comprime con gzip
- Guarda en `backend/backups/`
- Limpia backups antiguos (mantiene últimos 10)

**Uso:**
```bash
cd backend/scripts
./backup-database.sh
```

**Resultado:**
```
backups/limpiapp_dev_backup_20241204_152030.sql.gz
```

### 3. restore-database.sh

**Qué hace:**
- Lista backups disponibles
- Permite seleccionar cuál restaurar
- Confirma antes de borrar BD actual
- Restaura desde backup comprimido

**Uso:**
```bash
cd backend/scripts
./restore-database.sh
```

---

## 🚀 Inicio Rápido

### Opción 1: Docker (Más fácil)

```bash
cd limpiapp/backend

# 1. Iniciar PostgreSQL
docker-compose up -d

# 2. Ejecutar setup
cd scripts
./setup-database.sh

# 3. ¡Listo!
```

### Opción 2: PostgreSQL Local

```bash
# 1. Instalar PostgreSQL
brew install postgresql@15  # macOS
# o
sudo apt install postgresql  # Linux

# 2. Iniciar PostgreSQL
brew services start postgresql@15  # macOS
# o
sudo systemctl start postgresql  # Linux

# 3. Ejecutar setup
cd limpiapp/backend/scripts
./setup-database.sh

# 4. ¡Listo!
```

---

## 📊 Verificación Post-Setup

```bash
# Conectar a la BD
psql -U limpiapp -d limpiapp_dev

# Verificar tablas (debe mostrar 17)
\dt

# Contar usuarios
SELECT 'Total users:', COUNT(*) FROM users;
SELECT 'Clients:', COUNT(*) FROM clients;
SELECT 'Housekeepers:', COUNT(*) FROM housekeepers;
SELECT 'Bookings:', COUNT(*) FROM bookings;

# Ver housekeepers disponibles
SELECT 
  u.first_name || ' ' || u.last_name as name,
  h.hourly_rate,
  h.average_rating,
  h.total_services
FROM housekeepers h
JOIN users u ON h.user_id = u.id
WHERE h.is_available = true
ORDER BY h.average_rating DESC;
```

**Output esperado:**
```
      name       | hourly_rate | average_rating | total_services 
-----------------+-------------+----------------+----------------
 Ana García      |      150.00 |           4.90 |            487
 Laura Martínez  |      140.00 |           4.80 |            189
 Carmen López    |      135.00 |           4.70 |            156
```

---

## 🔗 Conexión desde la App

### String de Conexión

```bash
# Actualizar .env
cd backend
echo 'DATABASE_URL="postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev"' > .env
```

### Probar Conexión

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm run dev

# Probar API
curl http://localhost:3000/health

# Login de prueba
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "maria.lopez@example.com", "password": "password123"}'
```

---

## 📝 Variables de Entorno

Crear `backend/.env`:
```env
NODE_ENV=development
PORT=3000

# PostgreSQL
DATABASE_URL="postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev"

# JWT
JWT_SECRET=tu-secret-muy-seguro-cambiar-en-produccion
JWT_REFRESH_SECRET=tu-refresh-secret

# Otros...
```

---

## 🎯 Comandos Útiles

### Gestión de BD

```bash
# Ver todas las BDs
psql -U limpiapp -l

# Conectar
psql -U limpiapp -d limpiapp_dev

# Ejecutar SQL desde archivo
psql -U limpiapp -d limpiapp_dev -f archivo.sql

# Backup manual
pg_dump -U limpiapp -d limpiapp_dev > backup.sql

# Restaurar manual
psql -U limpiapp -d limpiapp_dev < backup.sql

# Resetear BD
dropdb -U limpiapp limpiapp_dev && createdb -U limpiapp limpiapp_dev
```

### Queries Útiles

```sql
-- Ver tamaño de BD
SELECT pg_size_pretty(pg_database_size('limpiapp_dev'));

-- Ver tamaño por tabla
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename))
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- Ver queries activas
SELECT pid, query, state 
FROM pg_stat_activity 
WHERE datname = 'limpiapp_dev';

-- Cancelar query
SELECT pg_cancel_backend(pid);

-- Terminar conexión
SELECT pg_terminate_backend(pid);
```

---

## 🆘 Troubleshooting

### PostgreSQL no inicia

```bash
# Docker
docker-compose logs postgres
docker-compose restart postgres

# Local
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql    # Linux
```

### No puedo conectar

```bash
# Verificar que esté escuchando
netstat -an | grep 5432

# Verificar configuración
cat /usr/local/var/postgresql@15/postgresql.conf  # macOS

# Verificar permisos
cat /usr/local/var/postgresql@15/pg_hba.conf  # macOS
```

### Resetear todo

```bash
cd backend/scripts
./setup-database.sh
# Responder 'y' cuando pregunte si quieres recrear
```

---

## 📚 Documentación Completa

Ver: **POSTGRESQL_SETUP.md** para guía detallada con:
- Instalación paso a paso
- Configuración de producción
- Performance tuning
- Backups automáticos
- Migración de datos
- Y mucho más...

---

## ✅ Checklist

- [x] Script SQL de schema completo
- [x] Script SQL de seed data
- [x] Script de setup automático
- [x] Script de backup
- [x] Script de restore
- [x] Documentación completa
- [x] Docker Compose configurado
- [x] Variables de entorno de ejemplo
- [x] Usuarios de prueba creados
- [x] Datos de ejemplo cargados

---

## 🎉 ¡Todo Listo!

Tienes todo lo necesario para trabajar con PostgreSQL directamente:
- ✅ Schema completo con 17 tablas
- ✅ Datos de prueba listos para usar
- ✅ Scripts automatizados para gestión
- ✅ Backups y restauración
- ✅ Documentación detallada

**Siguiente paso:** Ejecuta `./scripts/setup-database.sh` y empieza a desarrollar!

🚀 **Happy Coding!**
