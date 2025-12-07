# 🐘 PostgreSQL Setup Guide - LimpiApp

Guía completa para configurar PostgreSQL sin Prisma, usando scripts SQL puros.

---

## 📋 Tabla de Contenidos

1. [Instalación de PostgreSQL](#instalación-de-postgresql)
2. [Configuración Inicial](#configuración-inicial)
3. [Crear Base de Datos](#crear-base-de-datos)
4. [Scripts Disponibles](#scripts-disponibles)
5. [Uso Manual](#uso-manual)
6. [Troubleshooting](#troubleshooting)

---

## 1. Instalación de PostgreSQL

### macOS
```bash
# Opción 1: Homebrew
brew install postgresql@15
brew services start postgresql@15

# Opción 2: Postgres.app
# Descargar de https://postgresapp.com/
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
```bash
# Descargar de https://www.postgresql.org/download/windows/
# O usar WSL2 con Linux
```

### Docker (Recomendado para desarrollo)
```bash
# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: limpiapp-postgres
    environment:
      POSTGRES_USER: limpiapp
      POSTGRES_PASSWORD: limpiapp123
      POSTGRES_DB: limpiapp_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Iniciar PostgreSQL
docker-compose up -d

# Verificar que esté corriendo
docker-compose ps
```

---

## 2. Configuración Inicial

### Verificar Instalación
```bash
# Verificar que PostgreSQL esté corriendo
pg_isready

# Ver versión
psql --version
```

### Conectar a PostgreSQL
```bash
# Docker
docker exec -it limpiapp-postgres psql -U limpiapp -d limpiapp_dev

# Local (macOS/Linux)
psql -U postgres

# O con usuario específico
psql -U limpiapp -d limpiapp_dev
```

---

## 3. Crear Base de Datos

### Opción 1: Script Automático (Recomendado)

```bash
cd backend/scripts

# Hacer ejecutable (primera vez)
chmod +x setup-database.sh

# Ejecutar script
./setup-database.sh
```

El script hará:
1. ✅ Verificar conexión a PostgreSQL
2. ✅ Crear base de datos `limpiapp_dev`
3. ✅ Ejecutar migración del schema (14 tablas)
4. ✅ Preguntar si quieres datos de prueba
5. ✅ Sembrar datos de ejemplo (opcional)

**Usuarios de prueba creados:**
- Admin: `admin@limpiapp.com` / `admin123`
- Cliente: `maria.lopez@example.com` / `password123`
- Housekeeper: `ana.garcia@example.com` / `password123`

### Opción 2: Manual

```bash
# 1. Crear base de datos
createdb -U limpiapp limpiapp_dev

# O desde psql
psql -U postgres
CREATE DATABASE limpiapp_dev;
CREATE USER limpiapp WITH PASSWORD 'limpiapp123';
GRANT ALL PRIVILEGES ON DATABASE limpiapp_dev TO limpiapp;
\q

# 2. Ejecutar schema
psql -U limpiapp -d limpiapp_dev -f backend/prisma/migrations/001_initial_schema.sql

# 3. (Opcional) Sembrar datos
psql -U limpiapp -d limpiapp_dev -f backend/prisma/seed.sql
```

---

## 4. Scripts Disponibles

### 📁 Archivos SQL

```
backend/prisma/
├── migrations/
│   └── 001_initial_schema.sql    # Schema completo (14 tablas)
└── seed.sql                       # Datos de prueba
```

### 🔧 Scripts de Shell

```
backend/scripts/
├── setup-database.sh      # Setup automático completo
├── backup-database.sh     # Crear backup
└── restore-database.sh    # Restaurar desde backup
```

---

## 5. Uso Manual

### Conectar a la Base de Datos

```bash
# Docker
docker exec -it limpiapp-postgres psql -U limpiapp -d limpiapp_dev

# Local
psql -U limpiapp -d limpiapp_dev

# Con variables de entorno
PGPASSWORD=limpiapp123 psql -h localhost -U limpiapp -d limpiapp_dev
```

### Comandos Útiles de psql

```sql
-- Listar bases de datos
\l

-- Conectar a base de datos
\c limpiapp_dev

-- Listar tablas
\dt

-- Describir tabla
\d users
\d+ users  -- Con más detalles

-- Ver índices
\di

-- Ejecutar archivo SQL
\i /path/to/file.sql

-- Listar usuarios/roles
\du

-- Salir
\q
```

### Verificar Datos

```sql
-- Conectar
psql -U limpiapp -d limpiapp_dev

-- Ver todas las tablas
\dt

-- Contar registros
SELECT 'users' as table, COUNT(*) FROM users
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'housekeepers', COUNT(*) FROM housekeepers
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings;

-- Ver usuarios
SELECT id, email, first_name, last_name, user_type, status
FROM users;

-- Ver housekeepers disponibles
SELECT u.first_name, u.last_name, h.hourly_rate, h.average_rating
FROM housekeepers h
JOIN users u ON h.user_id = u.id
WHERE h.is_available = true;

-- Ver bookings
SELECT booking_code, scheduled_date, status
FROM bookings
ORDER BY created_at DESC;
```

---

## 6. Backups y Restauración

### Crear Backup

```bash
# Usando script
cd backend/scripts
./backup-database.sh

# Manual
pg_dump -U limpiapp -d limpiapp_dev -F p -f backup_$(date +%Y%m%d).sql

# Comprimir
gzip backup_*.sql
```

### Restaurar Backup

```bash
# Usando script (interactivo)
cd backend/scripts
./restore-database.sh

# Manual
dropdb -U limpiapp limpiapp_dev  # Cuidado!
createdb -U limpiapp limpiapp_dev
gunzip -c backup_20241204.sql.gz | psql -U limpiapp -d limpiapp_dev
```

### Backups Automáticos (Cron)

```bash
# Editar crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * cd /path/to/limpiapp/backend/scripts && ./backup-database.sh

# Backup cada 6 horas
0 */6 * * * cd /path/to/limpiapp/backend/scripts && ./backup-database.sh
```

---

## 7. Configuración de Producción

### Seguridad

```sql
-- Cambiar password del usuario
ALTER USER limpiapp WITH PASSWORD 'nuevo_password_seguro_aqui';

-- Crear usuario read-only para analytics
CREATE USER limpiapp_readonly WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE limpiapp_dev TO limpiapp_readonly;
GRANT USAGE ON SCHEMA public TO limpiapp_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO limpiapp_readonly;
```

### Performance

```sql
-- Ver queries lentas
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds';

-- Vacuum y analyze
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE limpiapp_dev;
```

### Configuración postgresql.conf

```conf
# Memoria
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

# Connections
max_connections = 100

# Logging
log_statement = 'all'
log_duration = on
```

---

## 8. Troubleshooting

### PostgreSQL no inicia

```bash
# Verificar status
docker-compose ps  # Docker
brew services list  # macOS

# Ver logs
docker-compose logs postgres  # Docker
tail -f /usr/local/var/log/postgres.log  # macOS
```

### No puedo conectar

```bash
# Verificar que esté escuchando
netstat -an | grep 5432

# Probar conexión
psql -h localhost -U limpiapp -d limpiapp_dev

# Verificar pg_hba.conf
# Docker: ya está configurado
# Local: agregar línea
# local   all             all                                     md5
```

### Error: "relation does not exist"

```bash
# Verificar que las tablas existen
psql -U limpiapp -d limpiapp_dev -c "\dt"

# Si no existen, ejecutar migración
psql -U limpiapp -d limpiapp_dev -f backend/prisma/migrations/001_initial_schema.sql
```

### Resetear completamente

```bash
# Opción 1: Script
cd backend/scripts
./setup-database.sh
# Responder 'y' cuando pregunte si quiere recrear

# Opción 2: Manual
dropdb -U limpiapp limpiapp_dev
createdb -U limpiapp limpiapp_dev
psql -U limpiapp -d limpiapp_dev -f backend/prisma/migrations/001_initial_schema.sql
psql -U limpiapp -d limpiapp_dev -f backend/prisma/seed.sql
```

### Ver espacio usado

```sql
-- Tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('limpiapp_dev'));

-- Tamaño por tabla
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 9. Migración de Datos

### Exportar datos específicos

```bash
# Solo estructura (sin datos)
pg_dump -U limpiapp -d limpiapp_dev -s -f schema_only.sql

# Solo datos
pg_dump -U limpiapp -d limpiapp_dev -a -f data_only.sql

# Tabla específica
pg_dump -U limpiapp -d limpiapp_dev -t users -f users_backup.sql

# Formato CSV
psql -U limpiapp -d limpiapp_dev -c "COPY users TO STDOUT CSV HEADER" > users.csv
```

### Importar CSV

```sql
-- Crear tabla temporal
CREATE TEMP TABLE users_import (LIKE users);

-- Importar CSV
\copy users_import FROM '/path/to/users.csv' CSV HEADER;

-- Insertar en tabla real
INSERT INTO users SELECT * FROM users_import;
```

---

## 10. Conexión desde la Aplicación

### String de Conexión

```bash
# Desarrollo
DATABASE_URL="postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev"

# Docker
DATABASE_URL="postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev"

# Producción (ejemplo)
DATABASE_URL="postgresql://user:password@db.example.com:5432/limpiapp_prod?sslmode=require"
```

### Actualizar .env

```bash
cd backend
echo 'DATABASE_URL="postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev"' >> .env
```

### Probar Conexión

```bash
# Node.js
node -e "
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://limpiapp:limpiapp123@localhost:5432/limpiapp_dev'
});
client.connect()
  .then(() => console.log('✅ Connected!'))
  .catch(err => console.error('❌ Error:', err))
  .finally(() => client.end());
"
```

---

## 📚 Recursos Adicionales

- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **psql Cheat Sheet:** https://postgrescheatsheet.com/
- **Performance Tuning:** https://wiki.postgresql.org/wiki/Performance_Optimization

---

## ✅ Checklist Rápido

Después de setup, verifica:

```bash
# 1. PostgreSQL corriendo
pg_isready

# 2. Base de datos existe
psql -U limpiapp -l | grep limpiapp_dev

# 3. Tablas creadas (deben ser 17)
psql -U limpiapp -d limpiapp_dev -c "\dt" | wc -l

# 4. Datos de prueba (si los agregaste)
psql -U limpiapp -d limpiapp_dev -c "SELECT COUNT(*) FROM users;"

# 5. Conexión desde app
curl http://localhost:3000/health
```

Si todos pasan ✅ **¡Estás listo!** 🚀

---

**¿Necesitas ayuda?** Revisa la sección de Troubleshooting o abre un issue en GitHub.
