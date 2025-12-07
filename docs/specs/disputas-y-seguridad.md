# Sistema de Disputas, Apelaciones y Seguridad - LimpiApp

## Índice
1. [Sistema de Reportes](#sistema-de-reportes)
2. [Manejo de Disputas](#manejo-de-disputas)
3. [Proceso de Apelaciones](#proceso-de-apelaciones)
4. [Protocolo de Seguridad](#protocolo-de-seguridad)
5. [Políticas de Suspensión y Banning](#políticas-de-suspensión-y-banning)
6. [Sistema de Reembolsos](#sistema-de-reembolsos)
7. [Legal y Compliance](#legal-y-compliance)

---

## Sistema de Reportes

### ¿Quién puede reportar a quién?

```
Cliente → Housekeeper
- Durante el servicio
- Después del servicio (hasta 7 días)

Housekeeper → Cliente
- Durante el servicio
- Después del servicio (hasta 7 días)

Cualquiera → Plataforma
- Bugs técnicos
- Fraude
- Contenido inapropiado
```

---

### Categorías de Reportes

#### Por Cliente contra Housekeeper

**🚨 Seguridad/Emergencia (Prioridad Alta)**
- Comportamiento amenazante o violento
- Acoso sexual
- Robo o intento de robo
- Daño intencional a propiedad
- Bajo influencia de sustancias
- Solicitud inapropiada

**⚠️ Calidad de Servicio (Prioridad Media)**
- No completó el trabajo acordado
- Calidad muy por debajo de estándar
- No siguió instrucciones
- Llegó muy tarde sin avisar
- No show (no llegó)
- Se fue antes de terminar

**📋 Profesionalismo (Prioridad Media)**
- Comportamiento poco profesional
- Lenguaje inapropiado
- Uso de teléfono excesivo
- Daño accidental a propiedad
- No respeta privacidad

**💰 Financiero (Prioridad Media)**
- Solicitud de pago fuera de la app
- Cobro de propinas excesivas
- Robo menor

**🔧 Técnico (Prioridad Baja)**
- Problemas con la app durante servicio
- Pago no procesado correctamente
- No puede contactar via chat

#### Por Housekeeper contra Cliente

**🚨 Seguridad/Emergencia (Prioridad Alta)**
- Comportamiento amenazante
- Acoso sexual o insinuaciones
- Ambiente inseguro
- Sustancias peligrosas presentes
- Solicitud de servicios ilegales/inapropiados

**⚠️ Condiciones de Trabajo (Prioridad Media)**
- Espacio muy diferente a descripción
- Condiciones insalubres
- Equipo/productos no disponibles (si cliente debía proveer)
- Mascotas agresivas no declaradas
- Personas adicionales no mencionadas

**📋 Profesionalismo (Prioridad Media)**
- Cliente no presente cuando acordado
- Cliente interfiere excesivamente
- Solicita servicios no acordados
- No paga propina prometida
- Lenguaje/trato irrespetuoso

**💰 Financiero (Prioridad Media)**
- Intento de pago fuera de plataforma
- Disputa de pago injustificada
- Solicitud de descuento no autorizado

---

### Flujo de Reporte

```
1. Usuario presiona "Reportar problema"
   ↓
2. Selecciona categoría
   ↓
3. Subcategoría específica
   ↓
4. Descripción del problema (obligatorio)
   - Campo de texto libre
   - Mínimo 50 caracteres
   ↓
5. Evidencia (opcional pero recomendado)
   - Fotos (hasta 5)
   - Videos (hasta 2)
   - Screenshots de chat
   ↓
6. ¿Es una emergencia?
   - Sí → Alerta inmediata + opción de llamar 911
   - No → Proceso normal
   ↓
7. Confirmación de envío
   - Ticket number asignado
   - Tiempo estimado de respuesta
   - Opciones de seguimiento
```

---

### Wireframe: Reportar Problema

```
┌─────────────────────────────────┐
│  ← Reportar Problema            │
├─────────────────────────────────┤
│                                 │
│  ¿Qué sucedió?                  │
│                                 │
│  SEGURIDAD Y EMERGENCIAS        │
│  ┌─────────────────────────┐   │
│  │ 🚨 Comportamiento       │   │
│  │    amenazante           │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚨 Acoso                │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚨 Robo o daño          │   │
│  └─────────────────────────┘   │
│                                 │
│  CALIDAD DE SERVICIO            │
│  ┌─────────────────────────┐   │
│  │ ⚠️ No completó trabajo   │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ ⚠️ Llegó muy tarde       │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ ⚠️ No show               │   │
│  └─────────────────────────┘   │
│                                 │
│  OTROS                          │
│  ┌─────────────────────────┐   │
│  │ 💰 Problema de pago     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🔧 Problema técnico     │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Detalles del Reporte         │
├─────────────────────────────────┤
│                                 │
│  Categoría: Robo o daño         │
│                                 │
│  ¿Qué sucedió exactamente?      │
│  ┌─────────────────────────┐   │
│  │ Describe con detalle... │   │
│  │                         │   │
│  │                         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│  Mínimo 50 caracteres (0/50)    │
│                                 │
│  Agregar evidencia:             │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ 📷  │ │     │ │     │       │
│  │Foto │ │     │ │     │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  ¿Cuándo ocurrió?               │
│  ● Durante el servicio          │
│  ○ Descubierto después          │
│                                 │
│  🚨 ¿Es una emergencia?         │
│     ☐ Sí, necesito ayuda ahora  │
│                                 │
│    ┌─────────────────────┐     │
│    │  Enviar reporte     │     │
│    └─────────────────────┘     │
│                                 │
│  Tu seguridad es nuestra        │
│  prioridad. Si estás en peligro │
│  inmediato, llama al 911.       │
│                                 │
└─────────────────────────────────┘
```

---

## Manejo de Disputas

### Tipos de Disputas

1. **Disputa de Pago**
   - Cliente reclama cobro incorrecto
   - Housekeeper reclama pago incorrecto
   - Servicios adicionales no acordados

2. **Disputa de Calidad**
   - Cliente insatisfecho con resultado
   - Housekeeper dice que completó pero cliente niega

3. **Disputa de Cancelación**
   - Quién canceló y cuándo
   - Reembolsos

4. **Disputa de Daños**
   - Propiedad dañada
   - Quién es responsable

---

### Proceso de Resolución de Disputas

```
DISPUTA INICIADA
      ↓
┌─────────────────────────────────┐
│  RECOLECCIÓN DE EVIDENCIA       │
│  (48 horas)                     │
├─────────────────────────────────┤
│  - Ambas partes presentan caso  │
│  - Fotos, videos, testimonios   │
│  - Historial de chat            │
│  - Detalles de la reserva       │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  REVISIÓN INICIAL               │
│  (24 horas)                     │
├─────────────────────────────────┤
│  - Trust & Safety revisa        │
│  - Categoriza la disputa        │
│  - Determina severidad          │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  INVESTIGACIÓN                  │
│  (2-5 días)                     │
├─────────────────────────────────┤
│  - Entrevistas si necesario     │
│  - Revisión de historial        │
│  - Consulta con legal si grave  │
│  - Verificación de evidencia    │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  DECISIÓN                       │
├─────────────────────────────────┤
│  Opciones:                      │
│  1. A favor del cliente         │
│  2. A favor del housekeeper     │
│  3. Solución intermedia         │
│  4. No concluyente              │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  IMPLEMENTACIÓN                 │
├─────────────────────────────────┤
│  - Reembolsos si aplica         │
│  - Ajustes de pago              │
│  - Warnings/suspensiones        │
│  - Actualización de records     │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  NOTIFICACIÓN                   │
├─────────────────────────────────┤
│  - Email a ambas partes         │
│  - Explicación de decisión      │
│  - Pasos tomados               │
│  - Opción de apelación (7 días) │
└─────────────────────────────────┘
```

---

### Criterios de Decisión

#### En favor del Cliente

**Reembolso Total (100%)**
- Housekeeper no llegó (no-show confirmado)
- Housekeeper llegó intoxicado
- Comportamiento inapropiado severo
- Daño significativo a propiedad
- Robo comprobado

**Reembolso Parcial (50%)**
- Servicio completado pero muy por debajo de estándar
- Llegó tarde >1 hora sin justificación
- No completó todo el trabajo acordado

**Crédito para Futuro Servicio**
- Problemas menores de calidad
- Primera ofensa del housekeeper
- Disputa ambigua

#### En favor del Housekeeper

**Pago Completo + Compensación**
- Cliente canceló durante servicio sin razón
- Cliente no estaba presente (no-show del cliente)
- Ambiente inseguro confirmado
- Cliente solicitó servicios no acordados

**Pago Completo (sin compensación)**
- Trabajo completado satisfactoriamente
- Evidencia clara de cumplimiento
- Reclamación del cliente injustificada

**Sin Acción**
- Ambas partes tienen responsabilidad
- No hay evidencia suficiente
- Disputa trivial

---

### Wireframe: Centro de Disputas

```
┌─────────────────────────────────┐
│  ← Mis Disputas                 │
├─────────────────────────────────┤
│                                 │
│  Activas (1)  Resueltas  Todas  │
│  ════════                       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔴 EN INVESTIGACIÓN     │   │
│  │                         │   │
│  │ Disputa #DSP-8472       │   │
│  │ Servicio del 15 dic     │   │
│  │                         │   │
│  │ Tipo: Calidad servicio  │   │
│  │ Con: Ana García         │   │
│  │                         │   │
│  │ Estado: Esperando       │   │
│  │ evidencia adicional     │   │
│  │                         │   │
│  │ Tiempo restante: 24h    │   │
│  │                         │   │
│  │ ┌──────────────────┐    │   │
│  │ │ Agregar evidencia│    │   │
│  │ └──────────────────┘    │   │
│  │                         │   │
│  │ [Ver detalles completos]│   │
│  └─────────────────────────┘   │
│                                 │
│  ¿Necesitas abrir una disputa?  │
│  [+ Nueva disputa]              │
│                                 │
└─────────────────────────────────┘
```

---

## Proceso de Apelaciones

### ¿Cuándo se puede apelar?

- ✅ Disputa fue resuelta en tu contra
- ✅ Cuenta fue suspendida
- ✅ Verificación fue rechazada
- ✅ Calificación fue injusta (casos especiales)
- ✅ Pago fue retenido

### Plazo para Apelar

- **7 días** desde la decisión original
- Solo **1 apelación** por caso
- Apelación es definitiva (no más apelaciones después)

---

### Flujo de Apelación

```
1. Usuario recibe decisión
   ↓
2. Dentro de 7 días, puede apelar
   ↓
3. Formulario de apelación
   - Explicación de por qué no está de acuerdo
   - Nueva evidencia (si existe)
   - Argumentos específicos
   ↓
4. Equipo de Apelaciones revisa
   - Diferente persona de la decisión original
   - Revisión completa de nuevo
   - Consulta con supervisor/legal si necesario
   ↓
5. Decisión de apelación (3-7 días)
   - Mantener decisión original
   - Modificar decisión
   - Revertir decisión
   ↓
6. Notificación FINAL
   - Decisión es irrevocable
   - No más apelaciones posibles
```

---

### Wireframe: Apelación

```
┌─────────────────────────────────┐
│  ← Apelar Decisión              │
├─────────────────────────────────┤
│                                 │
│  Disputa #DSP-8472              │
│  Decisión: A favor de cliente   │
│  Reembolso: $378                │
│                                 │
│  ──────────────────────────     │
│                                 │
│  ¿Por qué no estás de acuerdo   │
│  con esta decisión?             │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Explica tu caso con     │   │
│  │ detalle. Incluye hechos │   │
│  │ específicos y evidencia │   │
│  │ que no fue considerada. │   │
│  │                         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│  Mínimo 100 caracteres          │
│                                 │
│  ¿Tienes nueva evidencia?       │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ 📷  │ │ 📄  │ │ 🎥  │       │
│  │Foto │ │Doc  │ │Video│       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  ⚠️ IMPORTANTE:                  │
│  • Solo puedes apelar UNA vez  │
│  • La decisión de apelación es │
│    FINAL e irrevocable         │
│  • Tiempo límite: 5 días        │
│                                 │
│    ┌─────────────────────┐     │
│    │ Enviar apelación    │     │
│    └─────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

---

## Protocolo de Seguridad

### Botón de Pánico (Emergencias)

**Ubicación:**
- Visible en pantalla de servicio activo
- Acceso rápido en menú principal

**¿Qué hace?**
```
1. Usuario presiona "Emergencia"
   ↓
2. Confirmación rápida (para evitar accidentales)
   "¿Estás en peligro?"
   [SÍ - NECESITO AYUDA] [No, fue accidente]
   ↓
3. Si confirma:
   - Alerta inmediata a equipo de seguridad
   - SMS automático a número de emergencia
   - Grabación de audio comienza (si autorizó)
   - Ubicación GPS compartida
   - Opción de llamar 911 directamente
   ↓
4. Equipo de seguridad:
   - Llama al usuario en <2 minutos
   - Evalúa situación
   - Contacta autoridades si necesario
   - Mantiene registro detallado
```

**Wireframe:**
```
┌─────────────────────────────────┐
│  Servicio en Progreso           │
├─────────────────────────────────┤
│                                 │
│  ⏱️ 01:23:45                     │
│                                 │
│                                 │
│    ┌─────────────────────┐     │
│    │    🚨 EMERGENCIA    │     │
│    │   (Mantén presionado│     │
│    │     3 segundos)     │     │
│    └─────────────────────┘     │
│                                 │
└─────────────────────────────────┘

Al mantener presionado:

┌─────────────────────────────────┐
│  ⚠️ CONFIRMACIÓN DE EMERGENCIA   │
├─────────────────────────────────┤
│                                 │
│  ¿Estás en peligro inmediato?   │
│                                 │
│    ┌─────────────────────┐     │
│    │ SÍ, NECESITO AYUDA  │     │
│    │        AHORA        │     │
│    └─────────────────────┘     │
│                                 │
│    ┌─────────────────────┐     │
│    │ No, fue accidente   │     │
│    └─────────────────────┘     │
│                                 │
│  Si estás en peligro, nuestro   │
│  equipo llamará a las           │
│  autoridades inmediatamente.    │
│                                 │
└─────────────────────────────────┘

Si confirma:

┌─────────────────────────────────┐
│  🚨 ALERTA ACTIVADA              │
├─────────────────────────────────┤
│                                 │
│  Nuestro equipo ha sido         │
│  notificado y te contactará     │
│  inmediatamente.                │
│                                 │
│  Tu ubicación ha sido           │
│  compartida.                    │
│                                 │
│    ┌─────────────────────┐     │
│    │ ☎️ LLAMAR 911        │     │
│    └─────────────────────┘     │
│                                 │
│  Ayuda en camino en:            │
│        < 2 minutos              │
│                                 │
│  Grabación de audio activada    │
│                                 │
└─────────────────────────────────┘
```

---

### Protocolo para el Equipo de Seguridad

**Al recibir alerta de emergencia:**

```
T+0 min: Alerta recibida
- Revisar datos del servicio
- Ubicación del usuario
- Historial de ambas partes

T+1 min: Intentar contacto
- Llamar al usuario que activó alerta
- Si no contesta, llamar a la otra parte

T+2 min: Evaluación
- ¿Usuario responde?
  - Sí: Evaluar situación, ofrecer ayuda
  - No: Proceder a T+3

T+3 min: Escalamiento (si no hay respuesta)
- Llamar a contacto de emergencia del usuario
- Contactar autoridades locales
- Enviar información del servicio

T+5 min: Seguimiento
- Mantener contacto hasta resolver
- Documentar todo
- Preparar reporte

T+24 hrs: Post-incidente
- Seguimiento con ambas partes
- Investigación completa
- Acciones correctivas
```

---

### Medidas Preventivas de Seguridad

#### Para Housekeepers
```
✅ Compartir ubicación en tiempo real durante servicio
✅ Check-in al llegar
✅ Check-out al salir
✅ Si no hace check-out en 1 hora después de hora programada:
   → Sistema envía alerta
✅ Contacto de emergencia registrado
✅ Historial del cliente visible antes de aceptar
```

#### Para Clientes
```
✅ Perfil verificado del housekeeper visible
✅ Calificaciones y reseñas accesibles
✅ Tracking en tiempo real del housekeeper
✅ Opción de compartir detalles del servicio con contacto
```

---

## Políticas de Suspensión y Banning

### Niveles de Acción

```
┌─────────────────────────────────┐
│  SISTEMA DE STRIKES             │
├─────────────────────────────────┤
│                                 │
│  ⚠️ WARNING (Advertencia)        │
│  - Primera ofensa menor         │
│  - Email de advertencia         │
│  - Educación sobre política     │
│  - No afecta cuenta             │
│                                 │
│  🟡 STRIKE 1                     │
│  - Ofensa repetida o moderada   │
│  - Warning formal               │
│  - Requiere lectura de política │
│  - Monitoreo incrementado       │
│                                 │
│  🟠 STRIKE 2                     │
│  - Ofensa seria o 3ra repetición│
│  - Suspensión temporal (7 días) │
│  - Revisión obligatoria         │
│  - Próximo strike = permanent   │
│                                 │
│  🔴 STRIKE 3 / SUSPENSIÓN        │
│  - Cuenta suspendida 30 días    │
│  - Revisión completa            │
│  - Apelación posible            │
│  - Condiciones para regresar    │
│                                 │
│  ⛔ BAN PERMANENTE               │
│  - Ofensa grave                 │
│  - Múltiples strikes            │
│  - Fraude comprobado            │
│  - Cuenta cerrada para siempre  │
│  - No puede crear nueva cuenta  │
│                                 │
└─────────────────────────────────┘
```

---

### Causas de Suspensión/Ban Inmediato

**Ban Permanente Inmediato (sin strikes):**
- 🚫 Violencia física
- 🚫 Acoso sexual comprobado
- 🚫 Robo significativo (>$5,000)
- 🚫 Fraude comprobado con intención criminal
- 🚫 Amenazas serias
- 🚫 Cualquier delito criminal durante servicio

**Suspensión Inmediata (30 días):**
- ⚠️ Múltiples no-shows (3+)
- ⚠️ Calificación <2.5 después de 10+ servicios
- ⚠️ 3+ reportes serios
- ⚠️ Intento de pagos fuera de plataforma (repetido)
- ⚠️ Manipulación de calificaciones

---

### Proceso de Suspensión

```
TRIGGER DE SUSPENSIÓN
      ↓
┌─────────────────────────────────┐
│  REVISIÓN INMEDIATA             │
├─────────────────────────────────┤
│  - Trust & Safety revisa caso   │
│  - Verifica evidencia           │
│  - Consulta con legal si grave  │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  NOTIFICACIÓN AL USUARIO        │
├─────────────────────────────────┤
│  - Email detallado              │
│  - Razón específica             │
│  - Duración de suspensión       │
│  - Pasos para apelación         │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  SUSPENSIÓN DE CUENTA           │
├─────────────────────────────────┤
│  - No puede iniciar sesión      │
│  - Servicios activos cancelados │
│  - Pagos en revisión            │
│  - Datos preservados            │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  PERIODO DE APELACIÓN (7 días)  │
├─────────────────────────────────┤
│  - Usuario puede apelar         │
│  - Presentar evidencia nueva    │
│  - Solicitar revisión           │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│  DECISIÓN FINAL                 │
├─────────────────────────────────┤
│  Opciones:                      │
│  1. Levantar suspensión         │
│  2. Reducir suspensión          │
│  3. Mantener suspensión         │
│  4. Convertir en ban permanente │
└─────────────────────────────────┘
```

---

## Sistema de Reembolsos

### Política de Reembolsos

#### Reembolso Total (100%)
```
✅ Housekeeper no llegó (no-show)
✅ Housekeeper canceló mismo día
✅ Incidente de seguridad grave
✅ Servicio no pudo comenzar por culpa de housekeeper
✅ Fraude comprobado

Procesamiento: 5-7 días hábiles
Método: Mismo método de pago original
```

#### Reembolso Parcial (50-80%)
```
✅ Servicio incompleto (depende de % completado)
✅ Calidad significativamente inferior
✅ Cancelación con <4 horas de aviso

Procesamiento: 7-10 días hábiles
```

#### Crédito en Plataforma
```
✅ Problemas menores de calidad
✅ Primera vez con issue
✅ Ambas partes tienen responsabilidad

Disponible: Inmediatamente
Vigencia: 90 días
```

#### Sin Reembolso
```
❌ Cliente canceló con <24h aviso
❌ Cliente no estaba presente (no-show)
❌ Cliente cambió de opinión después de servicio completado
❌ Expectativas no razonables del cliente
```

---

### Proceso de Solicitud de Reembolso

```
1. Cliente va a "Historial de servicios"
   ↓
2. Selecciona servicio problemático
   ↓
3. "Solicitar reembolso"
   ↓
4. Selecciona razón:
   - Servicio no completado
   - Calidad inferior
   - Daño a propiedad
   - No show del housekeeper
   - Otro
   ↓
5. Describe el problema (mínimo 100 chars)
   ↓
6. Adjunta evidencia (fotos/videos)
   ↓
7. Indica monto esperado de reembolso
   ↓
8. Sistema crea caso de reembolso
   ↓
9. Revisión por equipo (24-48 hrs)
   ↓
10. Decisión y notificación
    ↓
11. Procesamiento de reembolso si aprobado
```

---

## Legal y Compliance

### Términos y Condiciones Clave

#### Relación Contractual
```
LimpiApp actúa como:
- Intermediario/plataforma tecnológica
- NO empleador de housekeepers
- Facilitador de servicios

Housekeepers son:
- Contratistas independientes
- Responsables de sus impuestos
- No empleados de LimpiApp

Clientes son:
- Usuarios de la plataforma
- Responsables del espacio donde se presta servicio
```

#### Limitación de Responsabilidad
```
LimpiApp NO es responsable por:
❌ Daños durante el servicio (hasta el límite del seguro)
❌ Lesiones personales (cubiertas por seguro)
❌ Disputas entre cliente y housekeeper
❌ Calidad del servicio (más allá de mediación)
❌ Pérdida de objetos personales

LimpiApp SÍ es responsable por:
✅ Seguridad de datos personales
✅ Procesamiento correcto de pagos
✅ Funcionamiento de la plataforma
✅ Proceso de verificación
✅ Mediación justa de disputas
```

#### Política de Privacidad

**Datos que Recopilamos:**
- Información personal (nombre, contacto, dirección)
- Documentos de identidad (encriptados)
- Historial de transacciones
- Ubicación durante servicios
- Mensajes entre usuarios
- Fotos subidas a la plataforma

**Uso de Datos:**
- Proveer el servicio
- Verificación de identidad
- Prevención de fraude
- Mejora de la plataforma
- Comunicación con usuarios
- Cumplimiento legal

**NO vendemos datos a terceros**

**Compartimos datos con:**
- Procesadores de pago (Stripe)
- Servicios de verificación (Onfido, etc.)
- Autoridades (si requerido por ley)

#### GDPR / Ley de Protección de Datos (México)

**Derechos de los usuarios:**
- ✅ Derecho a saber qué datos tenemos
- ✅ Derecho a corregir datos incorrectos
- ✅ Derecho a eliminar cuenta y datos (con excepciones legales)
- ✅ Derecho a descargar sus datos
- ✅ Derecho a restringir procesamiento

**Proceso para ejercer derechos:**
```
1. Email a privacy@limpiapp.com
2. Verificación de identidad
3. Procesamiento en 30 días
4. Confirmación de acción tomada
```

#### Seguros Obligatorios

**Seguro de Responsabilidad Civil (Plataforma):**
```
Cobertura mínima: $10,000,000 MXN
Cubre:
- Daños a propiedad durante servicio
- Lesiones a clientes
- Lesiones a housekeepers durante trabajo
- Robo comprobado durante servicio

Proceso de reclamo:
1. Reporte inmediato a LimpiApp
2. Evidencia fotográfica
3. Formulario de reclamo
4. Investigación de aseguradora
5. Pago si es aprobado
```

**Seguro para Housekeepers (Opcional pero Recomendado):**
```
- Seguro médico por accidentes
- Responsabilidad civil personal
- Cobertura de equipos
```

#### Compliance Fiscal

**Para Housekeepers (México):**
```
- Deben emitir facturas (CFDI) si ganan >$300k/año
- LimpiApp provee herramientas de facturación
- Housekeepers son responsables de sus impuestos
- LimpiApp puede retener impuestos si requerido por ley
```

**Para LimpiApp:**
```
- Retención de IVA en comisiones
- Reportes mensuales al SAT
- 1099/constancias fiscales para housekeepers (anual)
```

---

## Wireframes: Seguridad y Soporte

```
┌─────────────────────────────────┐
│  ← Centro de Ayuda              │
├─────────────────────────────────┤
│                                 │
│  ¿Cómo podemos ayudarte?        │
│                                 │
│  🚨 EMERGENCIAS                  │
│  ┌─────────────────────────┐   │
│  │ Estoy en peligro        │   │
│  └─────────────────────────┘   │
│                                 │
│  REPORTES URGENTES              │
│  ┌─────────────────────────┐   │
│  │ Reportar comportamiento │   │
│  │ inapropiado             │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Reportar robo o daño    │   │
│  └─────────────────────────┘   │
│                                 │
│  PROBLEMAS COMUNES              │
│  ┌─────────────────────────┐   │
│  │ Problema con pago       │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Solicitar reembolso     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Problema técnico        │   │
│  └─────────────────────────┘   │
│                                 │
│  INFORMACIÓN                    │
│  ┌─────────────────────────┐   │
│  │ 📋 Políticas            │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🔒 Privacidad           │   │
│  └─────────────────────────┘   │
│                                 │
│  ──────────────────────────     │
│                                 │
│  💬 Chat con soporte            │
│  ☎️ Línea de emergencia:        │
│     +52 55 1234 5678           │
│                                 │
└─────────────────────────────────┘
```

---

## Resumen: Pilares del Sistema de Seguridad

1. **Prevención** - Verificación rigurosa antes de activación
2. **Detección** - Monitoreo continuo de comportamiento
3. **Respuesta** - Protocolos claros para incidentes
4. **Resolución** - Proceso justo de disputas y apelaciones
5. **Mejora** - Aprender de cada incidente

**Objetivo:** Plataforma donde TODOS se sientan seguros y protegidos.

**Inversión en Seguridad:** ~10-15% de costos operativos
**Beneficio:** Confianza, retención, crecimiento sostenible
