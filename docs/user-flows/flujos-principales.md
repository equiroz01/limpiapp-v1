# Flujos de Usuario Principales - LimpiApp

## 1. Flujo Cliente: Registro y Primera Reserva

### Objetivo
Permitir que un nuevo usuario se registre y realice su primera reserva de servicio.

### Flujo
```
1. Pantalla de Bienvenida
   ↓
2. Selección: "Soy Cliente"
   ↓
3. Registro - Paso 1: Datos Básicos
   - Nombre, Email, Teléfono, Contraseña
   - O registro con Google/Facebook
   ↓
4. Registro - Paso 2: Dirección Principal
   - Buscar/seleccionar dirección en mapa
   - Agregar detalles (depto, referencias)
   ↓
5. Registro - Paso 3: Preferencias (Opcional)
   - Tamaño de hogar
   - Servicios de interés
   - Frecuencia estimada
   ↓
6. Home - Pantalla Principal
   - Ver servicios disponibles
   - Buscar housekeeper
   ↓
7. Búsqueda de Servicio
   - Seleccionar tipo de servicio
   - Fecha y hora
   - Duración
   ↓
8. Resultados de Búsqueda
   - Ver lista de housekeepers disponibles
   - Filtrar por precio, calificación, distancia
   ↓
9. Perfil de Housekeeper
   - Ver información detallada
   - Leer reseñas
   - Verificar disponibilidad
   ↓
10. Iniciar Reserva
    - Confirmar fecha/hora
    - Seleccionar servicios específicos
    - Agregar instrucciones
    ↓
11. Resumen y Confirmación
    - Revisar detalles
    - Ver precio total
    ↓
12. Método de Pago
    - Seleccionar/agregar tarjeta
    - Agregar propina (opcional)
    ↓
13. Confirmación de Reserva
    - Recibir código de reserva
    - Esperar confirmación de housekeeper
```

### Puntos de Salida
- Usuario puede guardar búsqueda y continuar después
- Usuario puede agregar housekeeper a favoritos
- Usuario puede compartir perfil de housekeeper

---

## 2. Flujo Cliente: Seguimiento de Servicio

### Objetivo
Seguir el progreso de un servicio desde la confirmación hasta la finalización.

### Flujo
```
1. Notificación: "Reserva confirmada por housekeeper"
   ↓
2. Pre-servicio (Mis Reservas)
   - Ver detalles de la reserva
   - Contactar housekeeper
   - Modificar/cancelar si es necesario
   ↓
3. Notificación: "Housekeeper en camino"
   - Ver ubicación en tiempo real
   ↓
4. Notificación: "Housekeeper llegó"
   - Servicio comienza
   ↓
5. Durante el Servicio
   - Ver progreso en tiempo real
   - Ver tiempo transcurrido
   - Opción de contactar housekeeper
   ↓
6. Notificación: "Servicio completado"
   ↓
7. Calificación y Reseña
   - Calificar con estrellas (1-5)
   - Escribir reseña
   - Seleccionar aspectos destacados
   - Agregar propina
   ↓
8. Recibo Final
   - Ver desglose de pago
   - Descargar/enviar recibo
   - Opción de reservar de nuevo
```

### Variaciones
- **Cancelación anticipada**: Cliente cancela antes de 24h (gratis)
- **Cancelación tardía**: Cliente cancela con menos de 24h (cargo)
- **No show de housekeeper**: Proceso de reporte y reembolso
- **Problema durante servicio**: Chat de soporte en vivo

---

## 3. Flujo Housekeeper: Registro y Verificación

### Objetivo
Registrar y verificar a un nuevo proveedor de servicios.

### Flujo
```
1. Pantalla de Bienvenida
   ↓
2. Selección: "Soy Housekeeper"
   ↓
3. Registro - Paso 1: Datos Personales
   - Nombre, fecha nacimiento, contacto
   ↓
4. Registro - Paso 2: Experiencia y Servicios
   - Años de experiencia
   - Servicios que ofrece
   - Equipo propio o no
   - Descripción profesional
   ↓
5. Registro - Paso 3: Verificación de Identidad
   - Foto de perfil
   - Documento oficial (INE/Pasaporte)
   - Fotos del documento
   ↓
6. Registro - Paso 4: Verificación de Antecedentes
   - Autorización para verificación
   - Referencias laborales (mín. 2)
   ↓
7. Registro - Paso 5: Tarifas y Disponibilidad
   - Establecer tarifa por hora
   - Área de cobertura
   - Horarios disponibles por día
   ↓
8. Envío de Solicitud
   - Esperar aprobación del equipo
   ↓
9. Proceso de Verificación (Backend)
   - Validación de documentos
   - Verificación de antecedentes
   - Llamadas a referencias
   ↓
10. Notificación: Aprobación/Rechazo
    ↓
11. Si aprobado: Activación de Cuenta
    - Tutorial de la app
    - Dashboard activo
```

### Tiempos Estimados
- Verificación de identidad: 24-48 horas
- Verificación de antecedentes: 3-5 días hábiles
- Proceso completo: 5-7 días

---

## 4. Flujo Housekeeper: Aceptar y Completar Servicio

### Objetivo
Gestionar una solicitud de servicio desde la notificación hasta el pago.

### Flujo
```
1. Notificación: "Nueva solicitud de servicio"
   - Ver detalles básicos
   - Tiempo límite: 15 minutos para responder
   ↓
2. Ver Solicitud Completa
   - Información del cliente
   - Detalles del servicio
   - Ubicación y distancia
   - Monto a ganar
   ↓
3. Decisión: Aceptar o Rechazar
   ↓
4A. Si RECHAZA
    - Solicitud pasa a otro housekeeper
    - Fin del flujo
    ↓
4B. Si ACEPTA
    ↓
5. Confirmación de Aceptación
   - Cliente recibe notificación
   - Servicio agregado al calendario
   ↓
6. Pre-servicio
   - Revisar detalles
   - Contactar cliente si necesario
   - Preparar materiales
   ↓
7. Día del Servicio - Salir hacia ubicación
   - Activar "En camino"
   - Cliente puede ver tracking
   ↓
8. Llegada al Destino
   - Marcar "Llegué al lugar"
   - Cliente recibe notificación
   ↓
9. Inicio del Servicio
   - Activar timer
   - Cliente ve servicio "En progreso"
   ↓
10. Durante el Servicio
    - Actualizar progreso (opcional)
    - Marcar áreas completadas
    - Pausar timer si necesario
    ↓
11. Finalización
    - Detener timer
    - Revisar duración total
    - Agregar notas finales
    ↓
12. Confirmación de Finalización
    - Cliente recibe notificación
    - Ver cálculo de pago
    ↓
13. Cliente Califica Servicio
    ↓
14. Pago Procesado
    - Dinero disponible en 24-48h
    - Ver en historial de ganancias
```

### Escenarios Alternativos
- **Cliente no está**: Protocolo de espera (15 min), luego marcar como no-show
- **Tiempo extra**: Sistema calcula automáticamente el cobro adicional
- **Problema durante servicio**: Reportar a soporte, pausar timer
- **Cliente solicita cambios**: Ajustar en la app, requiere confirmación

---

## 5. Flujo: Chat y Comunicación

### Objetivo
Facilitar comunicación entre cliente y housekeeper antes, durante y después del servicio.

### Flujo
```
1. Trigger de Comunicación
   - Reserva confirmada
   - O desde perfil de housekeeper
   ↓
2. Abrir Chat
   - Ver historial de mensajes
   - Estado online/offline
   ↓
3. Enviar Mensaje
   - Texto
   - Imagen (opcional)
   - Ubicación (opcional)
   ↓
4. Notificación al Receptor
   - Push notification
   - Badge en icono de mensajes
   ↓
5. Respuesta
   - Lectura confirmada (✓✓)
   ↓
6. Opciones Rápidas
   - "Voy en camino"
   - "Ya llegué"
   - "Gracias"
```

### Reglas de Comunicación
- Chat disponible solo después de confirmación de reserva
- Chat permanece disponible 7 días después del servicio
- Palabras inapropiadas son filtradas
- Solicitudes de pago fuera de la app están prohibidas
- Sistema de reporte de abuso

---

## 6. Flujo: Sistema de Calificaciones

### Objetivo
Mantener calidad del servicio mediante retroalimentación bidireccional.

### Flujo Cliente Califica a Housekeeper
```
1. Servicio Completado
   ↓
2. Prompt de Calificación
   - Aparece automáticamente
   - O desde historial de servicios
   ↓
3. Calificación con Estrellas (1-5)
   ↓
4. Reseña Escrita (Opcional)
   - Campo de texto libre
   - 500 caracteres máx
   ↓
5. Aspectos Destacados (Opcional)
   - Puntualidad
   - Profesionalismo
   - Calidad
   - Amabilidad
   - Limpieza
   ↓
6. Propina (Opcional)
   - 10%, 15%, 20%, o custom
   ↓
7. Enviar Calificación
   ↓
8. Actualización de Perfil de Housekeeper
   - Promedio recalculado
   - Reseña visible públicamente
```

### Flujo Housekeeper Califica a Cliente
```
1. Servicio Completado
   ↓
2. Calificación Privada del Cliente
   - Estrellas (1-5)
   - No es pública
   ↓
3. Comentarios Internos
   - ¿Cliente fue puntual?
   - ¿Instrucciones claras?
   - ¿Espacio como se describió?
   - ¿Volvería a trabajar con este cliente?
   ↓
4. Enviar Calificación
   ↓
5. Sistema Evalúa
   - Clientes problemáticos son marcados
   - Múltiples calificaciones bajas = restricciones
```

---

## 7. Flujo: Cancelaciones y Reembolsos

### Objetivo
Gestionar cancelaciones de manera justa para ambas partes.

### Flujo Cliente Cancela

#### Cancelación Temprana (>24h antes)
```
1. Cliente accede a "Detalles de Reserva"
   ↓
2. Selecciona "Cancelar reserva"
   ↓
3. Confirma motivo de cancelación
   ↓
4. Sistema procesa
   - Reembolso 100%
   - Notifica a housekeeper
   - Libera slot en calendario
   ↓
5. Confirmación de Cancelación
   - Email/notificación
   - Reembolso en 5-7 días
```

#### Cancelación Tardía (<24h antes)
```
1. Cliente selecciona "Cancelar reserva"
   ↓
2. Sistema muestra advertencia
   - Cargo por cancelación: 50% del total
   ↓
3. Cliente confirma
   ↓
4. Sistema procesa
   - Retiene 50% (va a housekeeper como compensación)
   - Reembolsa 50% al cliente
   - Notifica a housekeeper
```

### Flujo Housekeeper Cancela

#### Housekeeper cancela con aviso (>2h antes)
```
1. Housekeeper accede a servicio
   ↓
2. Selecciona "No puedo asistir"
   ↓
3. Indica motivo
   ↓
4. Sistema:
   - Reembolso 100% al cliente
   - Marca advertencia en cuenta de housekeeper
   - Ofrece housekeepers alternativos al cliente
```

#### Housekeeper no aparece (no-show)
```
1. Cliente reporta no-show
   ↓
2. Sistema verifica con housekeeper
   ↓
3. Si confirmado:
   - Reembolso 100% + crédito bonus al cliente
   - Penalización severa a housekeeper
   - Suspensión temporal o permanente
```

---

## 8. Flujo: Pagos y Facturación

### Flujo de Pago Estándar
```
1. Cliente confirma reserva
   ↓
2. Pre-autorización de tarjeta
   - Monto total + buffer (20%)
   ↓
3. Servicio completado
   ↓
4. Cálculo de monto final
   - Tiempo base
   - Tiempo extra (si aplica)
   - Propina (si aplica)
   ↓
5. Cargo a tarjeta
   - Captura de pre-autorización
   - Monto final ajustado
   ↓
6. Distribución de fondos
   - Comisión plataforma: 10-20%
   - Pago a housekeeper: 80-90%
   ↓
7. Housekeeper recibe pago
   - Disponible en 24-48h
   - Transferencia a cuenta bancaria
```

### Métodos de Retiro (Housekeeper)
- Transferencia bancaria (estándar)
- PayPal
- Tarjeta de débito
- Retiro mínimo: $500
- Frecuencia: Semanal o por demanda

---

## Resumen de Puntos Críticos

### Para el Cliente
1. **Registro simple** - Máximo 3 minutos
2. **Búsqueda intuitiva** - Filtros claros
3. **Transparencia de precios** - Sin cargos ocultos
4. **Tracking en tiempo real** - Tranquilidad
5. **Sistema de calificaciones** - Confianza

### Para Housekeeper
1. **Verificación rigurosa** - Seguridad para todos
2. **Control de agenda** - Aceptar/rechazar libremente
3. **Pagos transparentes** - Saber cuánto ganarás
4. **Herramientas profesionales** - Timer, checklist, navegación
5. **Soporte activo** - Ayuda cuando se necesita

### Para la Plataforma
1. **KYC completo** - Verificación de identidad
2. **Sistema anti-fraude** - Detección de patrones sospechosos
3. **Moderación de contenido** - Reseñas y mensajes
4. **Manejo de disputas** - Proceso claro de resolución
5. **Cumplimiento legal** - Regulaciones locales
