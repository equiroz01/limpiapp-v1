# Sistema de Verificación Robusto - LimpiApp

## Índice
1. [Visión General](#visión-general)
2. [Verificación de Housekeepers](#verificación-de-housekeepers)
3. [Verificación de Clientes](#verificación-de-clientes)
4. [Proveedores y Tecnología](#proveedores-y-tecnología)
5. [Niveles de Verificación](#niveles-de-verificación)
6. [Proceso de Revisión](#proceso-de-revisión)
7. [Re-verificación Periódica](#re-verificación-periódica)
8. [Sistema de Confianza y Badges](#sistema-de-confianza-y-badges)

---

## Visión General

### Principios Fundamentales

1. **Seguridad Primero**: La verificación no es opcional, es obligatoria
2. **Transparencia**: Los usuarios saben qué se verifica y por qué
3. **Privacidad**: Los datos sensibles están encriptados y protegidos
4. **Automatización + Humano**: Combinar tecnología con revisión manual
5. **Mejora Continua**: Monitoreo constante del comportamiento

### Objetivos

- ✅ Reducir fraude y riesgo a menos del 0.5%
- ✅ Tiempo de verificación: 24-72 horas
- ✅ Tasa de aprobación: ~85-90% (filtrar apropiadamente)
- ✅ Experiencia del usuario: Fluida pero rigurosa
- ✅ Cumplimiento legal: 100% compliance

---

## Verificación de Housekeepers

### Nivel 1: Verificación Básica (OBLIGATORIO)

#### 1.1 Identidad Gubernamental

**Documentos Aceptados:**
- INE (México)
- Pasaporte
- Cédula Profesional
- Licencia de Conducir (complementario)

**Proceso:**
```
1. Captura de documento
   - Foto del frente
   - Foto del reverso
   - Verificación de no ser fotocopia

2. Selfie con documento
   - Liveness detection (prueba de vida)
   - Facial matching con foto del documento
   - Verificación anti-spoofing

3. Validación automática
   - OCR para extraer datos
   - Validación de formato
   - Verificación de seguridad del documento
   - Match de datos con registro

4. Validación con autoridades (opcional pero recomendado)
   - API del INE (si disponible)
   - Verificación de autenticidad
```

**Tecnología:**
- **Stripe Identity** (recomendado)
- **Onfido** (alternativa premium)
- **Veriff** (alternativa)
- **Custom con AWS Rekognition + Textract**

**Datos Extraídos y Validados:**
- Nombre completo
- Fecha de nacimiento (>18 años)
- Dirección
- Número de documento
- Vigencia del documento
- Nacionalidad

#### 1.2 Verificación de Teléfono

**Proceso:**
```
1. Ingreso de número celular
2. Envío de SMS con código OTP (6 dígitos)
3. Validación del código en 10 minutos
4. Verificación de que el número no esté en blacklist
5. Verificación de que el número no esté duplicado
```

**Validaciones Adicionales:**
- Número no debe estar asociado a múltiples cuentas
- Carrier validation (no VoIP en algunos casos)
- Geolocalización del número vs. ubicación del usuario

**Tecnología:**
- Twilio Verify
- AWS SNS
- MessageBird

#### 1.3 Verificación de Email

**Proceso:**
```
1. Envío de email con link de verificación
2. Click en link dentro de 24 horas
3. Validación de que email no esté en blacklist
4. Verificación anti-disposable email
```

**Validaciones:**
- No emails temporales (10minutemail, guerrillamail, etc.)
- Dominio válido y activo
- No asociado a múltiples cuentas sospechosas

#### 1.4 Prueba de Dirección

**Proceso:**
```
1. Ingreso de dirección de residencia
2. Verificación con comprobante:
   - Recibo de luz/agua/gas (últimos 3 meses)
   - Estado de cuenta bancario
   - Contrato de arrendamiento

3. Validación de que dirección coincida con área de servicio
4. Geocoding de la dirección
```

**Importancia:**
- Contacto en caso de emergencia
- Verificación de zona de cobertura
- Prevención de fraude

#### 1.5 Video Entrevista (Manual)

**Proceso:**
```
1. Agendar video llamada con equipo de LimpiApp
2. Entrevista de 10-15 minutos
3. Preguntas clave:
   - Experiencia previa
   - Motivación
   - Disponibilidad
   - Referencias
   - Conocimiento de productos de limpieza
   - Manejo de situaciones difíciles

4. Evaluación de:
   - Actitud y profesionalismo
   - Habilidades de comunicación
   - Red flags
```

**Cuándo:**
- Obligatorio para todos antes de activación
- Puede ser grabado para referencia

---

### Nivel 2: Verificación de Antecedentes (OBLIGATORIO)

#### 2.1 Antecedentes Penales

**Qué se verifica:**
- Registro criminal a nivel nacional
- Búsqueda en bases de datos estatales
- Casos penales pendientes
- Órdenes de aprehensión
- Delitos sexuales (registro especial)
- Fraudes financieros

**Descalificaciones Automáticas:**
- ❌ Delitos violentos (asalto, homicidio)
- ❌ Delitos sexuales
- ❌ Robo/fraude en los últimos 7 años
- ❌ Delitos contra menores
- ❌ Secuestro/extorsión

**Evaluación Caso por Caso:**
- ⚠️ Delitos menores hace más de 7 años
- ⚠️ Faltas administrativas
- ⚠️ Infracciones de tránsito (no descalifica)

**Proveedores:**
- **México:**
  - Antecedentes No Penales (oficiales)
  - Infonavit Check
  - Buró de Crédito (opcional)
- **Servicios Privados:**
  - Certicheck (México)
  - First Advantage
  - Sterling Backgrounds

**Tiempo de Procesamiento:**
- 3-7 días hábiles

#### 2.2 Referencias Laborales

**Requisitos:**
- Mínimo 2 referencias
- Máximo 3 referencias

**Información Requerida:**
```
Para cada referencia:
- Nombre completo
- Relación (ex-empleador, cliente anterior, supervisor)
- Teléfono de contacto
- Email (opcional)
- Periodo de tiempo que trabajaron juntos
```

**Proceso de Validación:**
```
1. Llamada telefónica del equipo de LimpiApp
2. Preguntas clave:
   - ¿Confirma que conoce a [Nombre]?
   - ¿Qué tipo de trabajo realizó?
   - ¿Cuánto tiempo trabajaron juntos?
   - ¿Cómo calificaría su desempeño? (1-10)
   - ¿Era puntual y confiable?
   - ¿Hubo algún incidente?
   - ¿La contrataría nuevamente?
   - ¿La recomendaría?

3. Documentación de respuestas
4. Flag si respuestas son negativas
```

**Red Flags:**
- Referencias no contestan después de 3 intentos
- Referencias dan información negativa
- Referencias parecen falsas
- Periodos de tiempo no coinciden

#### 2.3 Verificación de Experiencia

**Documentos Solicitados (al menos uno):**
- Cartas de recomendación
- Constancias laborales
- Certificados de cursos de limpieza
- Fotos de trabajos anteriores (portfolio)
- Referencias de clientes previos en otras plataformas

**Validación:**
- Verificar autenticidad de documentos
- Contactar empleadores anteriores si es posible
- Verificar certificados con instituciones

---

### Nivel 3: Verificación Avanzada (OPCIONAL - Badges Premium)

#### 3.1 Certificaciones Profesionales

**Certificaciones Reconocidas:**
- Certificación en limpieza profesional
- Certificación en productos químicos
- Primeros auxilios
- Manejo de alimentos (si ofrece cocina)
- Capacitación en COVID-19 y bioseguridad

**Beneficios:**
- Badge especial en perfil
- Mayor visibilidad en búsquedas
- Tarifas premium

#### 3.2 Seguro de Responsabilidad Civil

**Requisitos:**
- Póliza de seguro vigente
- Cobertura mínima: $500,000 MXN
- Cobertura contra:
  - Daños a propiedad
  - Robo
  - Lesiones
  - Negligencia

**Opciones:**
- Housekeeper trae su propio seguro
- LimpiApp ofrece seguro grupal con descuento

#### 3.3 Verificación Financiera (Opcional)

**Para prevenir fraude:**
- Verificación de cuenta bancaria real
- Historial crediticio básico
- No búsqueda de score, solo validación de identidad

---

## Verificación de Clientes

### ¿Por qué verificar clientes?

1. **Proteger a Housekeepers** de situaciones peligrosas
2. **Prevenir fraude** en pagos
3. **Reducir no-shows** y cancelaciones abusivas
4. **Crear ambiente seguro** para todos

---

### Nivel 1: Verificación Básica de Cliente (OBLIGATORIO)

#### 1.1 Verificación de Email y Teléfono

**Mismo proceso que housekeepers:**
- Email con link de verificación
- SMS con código OTP
- Validación anti-fraude

#### 1.2 Método de Pago Válido

**Proceso:**
```
1. Agregar tarjeta de crédito/débito
2. Pre-autorización de $1 (luego reembolsado)
3. Validación con Stripe/Mercado Pago
4. Verificación 3D Secure (obligatorio)
5. Validación de que tarjeta no esté en blacklist
```

**Validaciones:**
- Tarjeta válida y activa
- Fondos suficientes
- No reportada como robada
- Nombre en tarjeta coincide con cuenta

#### 1.3 Verificación de Identidad (Para primera reserva)

**Opción A: Verificación Ligera**
```
- Solo nombre completo y fecha de nacimiento
- No se requiere documento
- Se verifica con datos de tarjeta
```

**Opción B: Verificación Completa (RECOMENDADO)**
```
- Foto de INE/Pasaporte
- Selfie
- Mismo proceso que housekeepers pero simplificado
```

**Cuándo es obligatoria la verificación completa:**
- Primera reserva
- Reservas de alto valor (>$2,000)
- Si housekeeper lo solicita
- Si el cliente tiene historial negativo

#### 1.4 Verificación de Dirección

**Proceso:**
```
1. Ingreso de dirección del servicio
2. Validación con Google Maps
3. Confirmación de que es una dirección real
4. No es obligatorio comprobante para clientes
```

**Casos especiales:**
- Hoteles/Airbnb: Validar con reserva
- Oficinas: Validar con datos corporativos

---

### Nivel 2: Sistema de Confianza del Cliente

#### 2.1 Score de Confianza (Trust Score)

**Factores que aumentan el score:**
- ✅ Email verificado: +10 puntos
- ✅ Teléfono verificado: +10 puntos
- ✅ Identidad verificada: +20 puntos
- ✅ Método de pago válido: +15 puntos
- ✅ Primera reserva completada: +20 puntos
- ✅ 5 reservas sin incidentes: +10 puntos
- ✅ Buen historial de calificaciones: +15 puntos

**Factores que reducen el score:**
- ❌ Cancelación tardía: -10 puntos
- ❌ No-show: -20 puntos
- ❌ Disputa/reclamo: -15 puntos
- ❌ Calificación baja de housekeeper: -5 puntos
- ❌ Reporte de comportamiento inapropiado: -50 puntos

**Rangos:**
- 0-30: Cliente de riesgo (restricciones)
- 31-60: Cliente nuevo (normal)
- 61-80: Cliente confiable (preferido)
- 81-100: Cliente excelente (VIP)

#### 2.2 Calificaciones de Housekeepers

**Después de cada servicio, housekeeper califica al cliente:**

**Preguntas (no públicas, solo internas):**
1. ¿El cliente fue respetuoso? ⭐⭐⭐⭐⭐
2. ¿El espacio estaba como se describió? ⭐⭐⭐⭐⭐
3. ¿Las instrucciones fueron claras? ⭐⭐⭐⭐⭐
4. ¿Volvería a trabajar con este cliente? Sí/No

**Red flags para el sistema:**
- Múltiples calificaciones bajas (promedio <3.5)
- Reportes de comportamiento inapropiado
- Solicitudes fuera de la plataforma (pago en efectivo, etc.)

---

## Proveedores y Tecnología

### Verificación de Identidad

#### Opción 1: Stripe Identity (RECOMENDADO)
```
Ventajas:
✅ Integrado con Stripe Payments
✅ Cobertura en 40+ países incluyendo México
✅ Liveness detection avanzado
✅ Precios competitivos ($1.50 por verificación)
✅ Compliance con regulaciones
✅ API fácil de integrar

Desventajas:
❌ Depende de tener Stripe como procesador de pagos
```

**Pricing:**
- $1.50 USD por verificación de identidad
- $0.35 USD por verificación de documento solo

**Implementación:**
```javascript
// Ejemplo de integración
const stripe = require('stripe')('sk_...');

const verificationSession = await stripe.identity.verificationSessions.create({
  type: 'document',
  metadata: {
    user_id: 'hk_123456',
    user_type: 'housekeeper'
  },
  options: {
    document: {
      require_live_capture: true,
      require_matching_selfie: true,
    },
  },
});
```

#### Opción 2: Onfido
```
Ventajas:
✅ Especialista en KYC/AML
✅ Detección de fraude muy avanzada
✅ Soporte en 195+ países
✅ Verificación de 2500+ tipos de documentos
✅ Panel de administración robusto

Desventajas:
❌ Más costoso ($2-5 por verificación)
❌ Integración más compleja
```

**Pricing:**
- Plan Starter: $2 por verificación básica
- Plan Pro: $3-5 por verificación con background check

#### Opción 3: Veriff
```
Ventajas:
✅ UX muy fluida
✅ 98% de tasa de conversión
✅ Procesamiento rápido (<6 segundos)
✅ Soporte completo en LATAM

Desventajas:
❌ Precio medio-alto
```

#### Opción 4: Custom (AWS Rekognition + Textract)
```
Ventajas:
✅ Control total
✅ Más barato a gran escala
✅ Personalizable

Desventajas:
❌ Requiere desarrollo significativo
❌ Tú eres responsable del compliance
❌ Menor precisión inicial
```

**Componentes:**
- AWS Rekognition (facial matching, liveness)
- AWS Textract (OCR de documentos)
- Custom validation logic

---

### Verificación de Antecedentes

#### México

**Antecedentes Penales Oficiales:**
```
Proveedor: Gobierno de México
URL: https://www.gob.mx/antecedentespenales
Costo: Gratuito (para el individuo)
Tiempo: 24-48 horas

Proceso:
1. Housekeeper solicita su constancia
2. Descarga PDF oficial
3. Sube a LimpiApp
4. Validamos autenticidad con QR/folio
```

**Servicios Privados:**

1. **Certicheck (México)**
   - Costo: $200-500 MXN por verificación
   - Tiempo: 3-5 días
   - Incluye: Penales, civiles, juicios
   - API: Sí disponible

2. **Infocheck**
   - Costo: $300-800 MXN
   - Tiempo: 2-4 días
   - Incluye: Penales, laborales, educativos
   - API: Limitada

3. **First Advantage (Internacional)**
   - Costo: $15-30 USD
   - Tiempo: 3-7 días
   - Cobertura global
   - API: Sí, muy completa

4. **Sterling Check**
   - Costo: $20-40 USD
   - Líder en background checks
   - API robusta

**Recomendación para LimpiApp:**
```
Combinación:
1. Constancia oficial (gratuita) - Obligatoria
2. Certicheck (paga) - Para verificación más profunda
3. Referencias manuales - Siempre

Costo total por housekeeper: $200-500 MXN
```

---

### Verificación de Referencias

**Herramientas:**

1. **Manual (RECOMENDADO para MVP)**
   - Equipo hace llamadas
   - Usa script estandarizado
   - Documenta en CRM
   - Costo: Tiempo del equipo

2. **Checkr** (Automatizado)
   - $5-10 USD por referencia
   - Envía formularios automáticos
   - API disponible

3. **SkillSurvey**
   - Especializado en referencias
   - $15-25 por verificación completa

---

## Niveles de Verificación

### Sistema de Badges

```
┌─────────────────────────────────────┐
│  NIVELES DE VERIFICACIÓN            │
├─────────────────────────────────────┤
│                                     │
│  🥉 BRONCE - Verificación Básica    │
│  ✓ Identidad verificada             │
│  ✓ Teléfono verificado              │
│  ✓ Email verificado                 │
│  ✓ Video entrevista                 │
│                                     │
│  🥈 PLATA - Verificación Completa   │
│  ✓ Todo lo de Bronce                │
│  ✓ Antecedentes penales             │
│  ✓ 2 referencias verificadas        │
│  ✓ Prueba de dirección              │
│                                     │
│  🥇 ORO - Verificación Premium      │
│  ✓ Todo lo de Plata                 │
│  ✓ Certificación profesional        │
│  ✓ Seguro de responsabilidad civil  │
│  ✓ 3+ referencias verificadas       │
│  ✓ Portfolio de trabajos            │
│                                     │
│  💎 DIAMANTE - Elite                │
│  ✓ Todo lo de Oro                   │
│  ✓ 100+ servicios completados       │
│  ✓ Promedio 4.9+ estrellas          │
│  ✓ 0 incidentes                     │
│  ✓ Re-verificación anual            │
│                                     │
└─────────────────────────────────────┘
```

### Requisitos Mínimos para Activación

**Housekeeper puede empezar a recibir solicitudes con:**
- ✅ Verificación PLATA mínimo
- ✅ Video entrevista completada
- ✅ Antecedentes penales limpios
- ✅ Al menos 2 referencias positivas
- ✅ Método de pago configurado (para recibir dinero)

**Cliente puede reservar con:**
- ✅ Email verificado
- ✅ Teléfono verificado
- ✅ Método de pago válido
- ✅ Para primera reserva: Foto de perfil real

---

## Proceso de Revisión

### Equipo de Trust & Safety

**Composición del equipo:**
```
1 Trust & Safety Manager
2-3 Verification Specialists (para empezar)
Soporte de tecnología automatizada

A medida que creces:
- 1 especialista por cada 500 housekeepers activos
```

**Responsabilidades:**
1. Revisar documentos manualmente
2. Hacer video entrevistas
3. Llamar referencias
4. Investigar reportes
5. Manejar apelaciones
6. Actualizar políticas

### Workflow de Revisión

```
NUEVO HOUSEKEEPER APLICA
         ↓
┌────────────────────────────┐
│  VERIFICACIÓN AUTOMÁTICA   │
│  - Identidad (Stripe/Onfido)│
│  - Liveness detection      │
│  - OCR de documentos       │
│  - Email/teléfono          │
└────────────────────────────┘
         ↓
    ¿Pasó automática?
         ↓
    NO ← → SÍ
     ↓         ↓
┌─────────┐  ┌──────────────┐
│ REVISIÓN │  │ VIDEO        │
│ MANUAL   │  │ ENTREVISTA   │
│ (Docs)   │  │ (Agendada)   │
└─────────┘  └──────────────┘
     ↓              ↓
     └──────┬───────┘
            ↓
    ¿Aprobado?
         ↓
    NO ← → SÍ
     ↓         ↓
┌─────────┐  ┌──────────────────┐
│RECHAZADO│  │ ANTECEDENTES     │
│ (Email) │  │ (3-7 días)       │
└─────────┘  └──────────────────┘
                    ↓
            ┌──────────────────┐
            │ REFERENCIAS      │
            │ (Llamadas)       │
            └──────────────────┘
                    ↓
            ¿Todo aprobado?
                 ↓
            NO ← → SÍ
             ↓         ↓
        ┌─────────┐  ┌───────────┐
        │RECHAZADO│  │ ACTIVADO  │
        │         │  │ ✅        │
        └─────────┘  └───────────┘
```

### Tiempos de Procesamiento

```
Verificación automática de identidad: 2-10 minutos
Video entrevista (agendar + realizar): 1-2 días
Antecedentes penales: 3-7 días
Referencias (llamadas): 2-5 días
Revisión manual de documentos: 1 día

TOTAL: 5-10 días hábiles (promedio: 7 días)
```

### SLAs (Service Level Agreements)

```
- Verificación automática: <10 minutos
- Revisión manual de docs: <24 horas
- Video entrevista (agendar): <48 horas
- Referencias: <5 días hábiles
- Antecedentes: <7 días hábiles
- Respuesta a apelaciones: <3 días hábiles
```

---

## Re-verificación Periódica

### ¿Por qué re-verificar?

1. **Seguridad continua**: Las personas cambian
2. **Compliance**: Regulaciones lo pueden requerir
3. **Confianza**: Mantener altos estándares
4. **Detectar fraude**: Identificar patrones

### Frecuencia de Re-verificación

**Housekeepers:**
```
Nivel Bronce: Cada 6 meses
Nivel Plata: Cada 12 meses
Nivel Oro: Cada 12 meses
Nivel Diamante: Cada 24 meses
```

**Qué se re-verifica:**
- ✅ Antecedentes penales actualizados
- ✅ Teléfono sigue activo
- ✅ Email sigue activo
- ✅ Referencias adicionales (si disponible)
- ✅ Certificaciones vigentes
- ✅ Seguro vigente (si aplica)

**Clientes:**
```
- Método de pago: Cada transacción (automático)
- Identidad: Solo si hay red flags
- Teléfono/Email: Si reportan cambio
```

### Triggers para Re-verificación Inmediata

**Para Housekeepers:**
- 🚨 3 o más reportes de clientes
- 🚨 Calificación promedio <3.5
- 🚨 Comportamiento sospechoso
- 🚨 Disputa de pago
- 🚨 Cambio de información personal

**Para Clientes:**
- 🚨 2 o más reportes de housekeepers
- 🚨 Chargebacks/disputas
- 🚨 No-shows repetidos
- 🚨 Calificación <3.0 de housekeepers

---

## Sistema de Confianza y Badges

### Badges Visibles en Perfil de Housekeeper

```
┌─────────────────────────────┐
│  Ana García  ⭐ 4.9         │
│  Housekeeper profesional    │
├─────────────────────────────┤
│  VERIFICACIONES:            │
│                             │
│  ✅ Identidad verificada    │
│  ✅ Antecedentes limpios    │
│  ✅ Referencias verificadas │
│  ✅ Certificación prof.     │
│  ✅ Con seguro              │
│  ✅ COVID-19 certified      │
│                             │
│  🥇 NIVEL ORO               │
│                             │
│  📊 ESTADÍSTICAS:           │
│  • 487 servicios            │
│  • 98% tasa de aceptación  │
│  • 100% tasa completación  │
│  • Miembro desde: 2023     │
│                             │
└─────────────────────────────┘
```

### Badges Especiales

```
🏆 Top Housekeeper
   (Top 5% en la plataforma)

⚡ Respuesta Rápida
   (Acepta en <5 minutos)

💚 Favorita de Clientes
   (20+ clientes repiten)

🌟 Excelencia Consistente
   (100+ servicios, 4.9+ rating)

🛡️ Super Segura
   (Todos los checks + seguro)

♻️ Eco-Friendly
   (Usa productos ecológicos)

👨‍🍳 Multi-Servicio
   (Ofrece 5+ servicios)

📚 Certificada
   (Certificaciones oficiales)
```

---

## Implementación Técnica

### Base de Datos

```sql
-- Tabla de verificaciones
CREATE TABLE verifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    user_type VARCHAR(20), -- client, housekeeper

    -- Identidad
    identity_status VARCHAR(20), -- pending, approved, rejected
    identity_provider VARCHAR(50), -- stripe, onfido, manual
    identity_session_id VARCHAR(255),
    identity_verified_at TIMESTAMP,
    identity_expires_at TIMESTAMP,

    -- Documentos
    document_type VARCHAR(50),
    document_number VARCHAR(100) ENCRYPTED,
    document_country VARCHAR(2),
    document_expiry DATE,

    -- Email y teléfono
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP,
    phone_verified BOOLEAN DEFAULT false,
    phone_verified_at TIMESTAMP,

    -- Antecedentes (solo housekeepers)
    background_check_status VARCHAR(20),
    background_check_provider VARCHAR(50),
    background_check_completed_at TIMESTAMP,
    background_check_expires_at TIMESTAMP,
    background_check_result JSONB,

    -- Referencias
    references_status VARCHAR(20),
    references_count INT DEFAULT 0,
    references_data JSONB,

    -- Video entrevista
    interview_status VARCHAR(20),
    interview_conducted_by UUID REFERENCES users(id),
    interview_date TIMESTAMP,
    interview_notes TEXT ENCRYPTED,
    interview_rating INT,

    -- Nivel de verificación
    verification_level VARCHAR(20), -- bronze, silver, gold, diamond

    -- Re-verificación
    needs_reverification BOOLEAN DEFAULT false,
    last_verified_at TIMESTAMP,
    next_verification_due TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de documentos subidos
CREATE TABLE verification_documents (
    id UUID PRIMARY KEY,
    verification_id UUID REFERENCES verifications(id),
    document_type VARCHAR(50), -- id_front, id_back, selfie, proof_address, etc.
    file_url VARCHAR(500) ENCRYPTED,
    status VARCHAR(20), -- pending, approved, rejected
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de trust score
CREATE TABLE trust_scores (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    user_type VARCHAR(20),

    score INT DEFAULT 0, -- 0-100

    -- Componentes del score
    verification_score INT,
    behavioral_score INT,
    transaction_score INT,
    review_score INT,

    -- Historial
    score_history JSONB,

    -- Flags
    risk_level VARCHAR(20), -- low, medium, high
    is_flagged BOOLEAN DEFAULT false,
    flag_reasons TEXT[],

    last_calculated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

```javascript
// Iniciar verificación de identidad
POST /api/v1/verification/identity/start
{
  "userType": "housekeeper",
  "provider": "stripe" // or "onfido"
}

Response:
{
  "sessionId": "vs_1234567890",
  "clientSecret": "vs_secret_...",
  "url": "https://verify.stripe.com/start/..."
}

// Verificar email
POST /api/v1/verification/email/send
GET /api/v1/verification/email/verify/:token

// Verificar teléfono
POST /api/v1/verification/phone/send-code
POST /api/v1/verification/phone/verify-code
{
  "code": "123456"
}

// Subir documentos
POST /api/v1/verification/documents
Content-Type: multipart/form-data
{
  "documentType": "id_front",
  "file": [binary]
}

// Iniciar background check
POST /api/v1/verification/background-check/initiate
{
  "provider": "certicheck",
  "consent": true
}

// Agendar video entrevista
POST /api/v1/verification/interview/schedule
{
  "preferredDate": "2024-12-10",
  "preferredTime": "10:00"
}

// Obtener estado de verificación
GET /api/v1/verification/status

Response:
{
  "identityVerified": true,
  "emailVerified": true,
  "phoneVerified": true,
  "backgroundCheckStatus": "completed",
  "referencesVerified": 2,
  "interviewCompleted": true,
  "verificationLevel": "silver",
  "canAcceptBookings": true,
  "nextSteps": [
    "Upload certificate to reach Gold level"
  ]
}
```

---

## Costos Estimados de Verificación

### Por Housekeeper (One-time)

```
Verificación de identidad (Stripe):      $1.50 USD
Background check (Certicheck):          $5.00 USD (200 MXN)
Referencias (manual - tiempo equipo):   $3.00 USD
Video entrevista (tiempo equipo):       $5.00 USD
Infraestructura y tech:                 $1.00 USD

TOTAL por housekeeper:                  ~$15.50 USD
                                        (~310 MXN)
```

### Por Cliente (One-time)

```
Verificación de email/teléfono:         $0.10 USD
Verificación de pago (Stripe):          Incluido
Verificación de identidad (opcional):   $1.50 USD

TOTAL por cliente:                      ~$0.10 - $1.60 USD
```

### Costos Anuales (Estimado para 1000 housekeepers activos)

```
Verificaciones iniciales (200 nuevos/año):  $3,100 USD
Re-verificaciones (1000 housekeepers):      $1,500 USD
Equipo Trust & Safety (2 personas):         $40,000 USD
Herramientas y software:                    $5,000 USD
Contingencias:                              $2,000 USD

TOTAL anual:                                ~$51,600 USD
                                            (~4,300 USD/mes)
```

**ROI:**
- Si cada housekeeper genera $100/mes en comisiones
- 1000 housekeepers = $100,000/mes
- Costo de verificación = 4.3% de ingresos
- **Totalmente justificado para la seguridad y confianza**

---

## Métricas de Éxito

### KPIs del Sistema de Verificación

```
✅ Tasa de aprobación de housekeepers: 85-90%
✅ Tiempo promedio de verificación: <7 días
✅ Tasa de fraude: <0.5%
✅ Incidentes de seguridad: <0.1%
✅ Satisfacción con proceso: >4.5/5
✅ Tasa de re-verificación completa: >95%
✅ Falsos positivos: <5%
✅ Tiempo de respuesta a apelaciones: <3 días
```

---

## Conclusión

Un sistema de verificación robusto es la **columna vertebral de la confianza** en LimpiApp.

**Inversión inicial:** ~$15 USD por housekeeper
**Beneficio:** Plataforma segura, usuarios confiados, menor riesgo legal

**El proceso debe ser:**
- ✅ **Riguroso** pero no excesivamente complicado
- ✅ **Rápido** pero no sacrificando seguridad
- ✅ **Transparente** para generar confianza
- ✅ **Continuo** con re-verificaciones periódicas

Esto es lo que diferenciará a LimpiApp de competidores que no toman la verificación en serio.
