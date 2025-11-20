# LAVA 2 - Flujo de Navegación Condicional

## Diagrama de Navegación Principal

```
┌─────────────┐
│   LOGIN     │
│             │
│  Validación:│
│  • Email    │
│  • Password │
│  • Min 6    │
└─────┬───────┘
      │ ✓ Validación exitosa
      │ (800ms delay)
      ▼
┌─────────────┐
│    HOME     │◄─────────────────┐
│             │                  │
│  Opciones:  │                  │
│  • Servicios│                  │
│  • Workers  │                  │
│  • Profile  │                  │
└─────────────┘                  │
                                 │
┌─────────────┐                  │
│  REGISTRO   │                  │
│             │                  │
│  Validación:│                  │
│  • Email    │                  │
│  • Password │                  │
│    - Min 8  │                  │
│    - 1 MAY  │                  │
│    - 1 NUM  │                  │
│  • Confirm  │                  │
└─────┬───────┘                  │
      │ ✓ Validación exitosa     │
      │ (800ms delay)             │
      ▼                           │
┌─────────────┐                  │
│ COMPLETAR   │                  │
│   DATOS     │                  │
│             │                  │
│  Validación:│                  │
│  • Todos los│                  │
│    campos   │                  │
│  • Checkbox │                  │
│    Términos │                  │
└─────┬───────┘                  │
      │ ✓ Validación exitosa     │
      │ (800ms delay)             │
      └───────────────────────────┘
```

## Flujos de Navegación Detallados

### 1. FLUJO: LOGIN → HOME

**Frame Origen:** Login
**Condiciones de validación:**
- ✓ Campo Email: no vacío + formato válido (contiene @ y .)
- ✓ Campo Contraseña: no vacío + longitud ≥ 6 caracteres

**Proceso:**
1. Usuario completa email y contraseña
2. Usuario hace clic en botón "Continuar"
3. Sistema valida campos:
   - Si hay errores → Toast rojo con mensaje específico
   - Si todo es válido → Toast verde "¡Inicio de sesión exitoso!"
4. Delay de 800ms (para que el usuario vea el feedback)
5. Navegación automática a Home

**Feedback visual:**
- Botón "Continuar": escala 0.98 + opacidad 90% al hacer clic
- Campos con error: borde rojo #FF3B30 + icono de alerta
- Toast de éxito: fondo verde con check

**Animación:** Push (slide right → left), 300ms, ease-out

---

### 2. FLUJO: REGISTRO → COMPLETAR DATOS → HOME

#### Paso 1: Registro → Completar Datos

**Frame Origen:** Registro
**Condiciones de validación:**
- ✓ Email: no vacío + formato válido (regex)
- ✓ Contraseña: 
  - Mínimo 8 caracteres
  - Al menos 1 letra mayúscula
  - Al menos 1 número
- ✓ Confirmar contraseña: debe coincidir con la contraseña
- ✓ Checkbox "Términos y Condiciones": marcado (si existe)

**Proceso:**
1. Usuario completa todos los campos
2. Usuario hace clic en "Registrate"
3. Sistema valida secuencialmente:
   - Campos vacíos → Error "Completa todos los campos"
   - Formato email → Error "Email inválido"
   - Formato contraseña → Error "Contraseña debe tener 8+ chars, 1 MAY, 1 NUM"
   - Contraseñas coinciden → Error "Las contraseñas no coinciden"
4. Si todo es válido → Toast "¡Cuenta creada exitosamente!"
5. Delay 800ms
6. Navegación a Completar Datos

**Feedback visual:**
- Botón animado: escala + opacidad
- Campos válidos: borde verde #00CC00
- Campos con error: borde rojo #FF3B30 + icono alerta
- Toast personalizado según el tipo de error

**Animación:** Push (slide right → left), 300ms

---

#### Paso 2: Completar Datos → Home

**Frame Origen:** Completar_Datos
**Condiciones de validación:**
- ✓ Todos los campos obligatorios completos:
  - Nombre
  - Apellidos
  - Tipo de Documento
  - Número de Documento
  - Método de Pago
  - Número de Cuenta
  - Modelo/Marca del vehículo
  - Placa
  - Ciudad
  - Dirección
- ✓ Checkbox "Términos y Condiciones": marcado
- ⚠️ Upload de foto: opcional (pero validado si obligatorio)
- ⚠️ Cuidado especial: opcional

**Proceso:**
1. Usuario completa formulario en grid de 2 columnas
2. Usuario marca checkbox de Términos
3. Usuario hace clic en "Guardar Informacion"
4. Sistema valida:
   - Si faltan campos → Pop-up flotante rojo
   - Si checkbox no marcado → Pop-up flotante rojo
5. Si todo válido → Toast "¡Información guardada exitosamente!"
6. Delay 800ms
7. Navegación a Home

**Feedback visual:**
- Botón "Guardar Informacion": escala 0.98 + opacidad 90%
- Campos válidos: borde verde #00CC00
- Campos con error: borde rojo #FF3B30
- Pop-ups flotantes personalizados con X para cerrar

**Animación:** Push (slide right → left), 300ms

---

## Validaciones Implementadas

### Login Screen
```typescript
// Email: formato válido
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contraseña: mínimo 6 caracteres
password.length >= 6
```

### Register Screen
```typescript
// Email: formato válido
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contraseña: 8+ chars, 1 mayúscula, 1 número
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// Confirmación: debe coincidir
password === confirmPassword
```

### Complete Data Screen
```typescript
// Validar todos los campos (excepto opcionales)
const camposVacios = Object.entries(formData).filter(([key, value]) => {
  if (key === 'cuidadoEspecial') return false;
  return !value;
});

// Checkbox términos
termsAccepted === true
```

---

## Estados de Error y Feedback

### Tipos de Toast

1. **Error Toast (Rojo)**
   - Background: #FFD8D6
   - Border: 1.5px solid #FF3B30
   - Título: #D70015 (bold)
   - Descripción: #333333
   - Duración: 5000ms

2. **Success Toast (Verde)**
   - Mensaje: "¡Éxito!"
   - Auto-cierre después de mostrar
   - Duración: 800ms antes de navegación

### Estados de Campos

1. **Campo Normal**
   - Border: 1.5px #DDDDDD
   - Background: #FFFFFF

2. **Campo con Error**
   - Border: 2px #FF3B30
   - Icono de alerta: triángulo rojo con "!"

3. **Campo Válido** (opcional)
   - Border: 2px #00CC00
   - Checkmark verde

---

## Animaciones y Transiciones

### Botones
- **Active state:** `scale(0.98)` + `opacity: 90%`
- **Transition:** `all 150ms ease-out`
- **Touch target:** ≥ 44×44 pt (accesibilidad)

### Navegación entre pantallas
- **Tipo:** Push (slide)
- **Dirección:** right → left
- **Duración:** 300ms
- **Easing:** ease-out

### Delays
- **Toast → Navegación:** 800ms
- Permite al usuario ver el feedback antes de cambiar de pantalla

---

## Mapa de Navegación Completo

```
APP ENTRY POINT
│
├─ Login
│  ├─ Validar credenciales
│  ├─ → Home (si éxito)
│  └─ → Registro (link inferior)
│
├─ Registro
│  ├─ Validar datos
│  ├─ → Completar Datos (si éxito)
│  └─ → Login (link "¿Ya tienes cuenta?")
│
├─ Completar Datos
│  ├─ Validar campos + términos
│  ├─ → Home (si éxito)
│  └─ ← Registro (flecha atrás)
│
└─ Home
   ├─ → Profile
   │  └─ → Métodos de Pago
   │
   ├─ → Servicios
   │  └─ → Detalle Servicio (futuro)
   │
   ├─ → Workers List
   │  └─ → Worker Detail
   │     └─ Agregar Reseña
   │
   └─ → Salir (vuelve a Login)
```

---

## Testing de Flujos

### Caso 1: Login Exitoso
1. Ingresar email válido: `test@example.com`
2. Ingresar contraseña válida: `password123`
3. Click "Continuar"
4. ✓ Debe mostrar toast verde
5. ✓ Debe navegar a Home en 800ms

### Caso 2: Registro Completo
1. Ingresar email: `nuevo@test.com`
2. Ingresar contraseña: `Test1234`
3. Confirmar contraseña: `Test1234`
4. Click "Registrate"
5. ✓ Debe navegar a Completar Datos
6. Completar todos los campos
7. Marcar checkbox términos
8. Click "Guardar Informacion"
9. ✓ Debe navegar a Home

### Caso 3: Validaciones de Error
1. Intentar login con campos vacíos
   - ✓ Debe mostrar toast rojo
   - ✓ Campos deben tener borde rojo
2. Intentar registro con contraseña débil
   - ✓ Debe mostrar mensaje específico
3. No marcar términos en Completar Datos
   - ✓ Debe mostrar pop-up de error

---

## Notas de Implementación

- ✅ Todas las validaciones están implementadas
- ✅ Feedback visual con toasts personalizados
- ✅ Animaciones de botones (scale + opacity)
- ✅ Delays apropiados antes de navegación
- ✅ Estados de error por campo individual
- ✅ Navegación condicional basada en validaciones
- ✅ Consistencia visual (colores, tipografía, espaciados)

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0
**Framework:** React + TypeScript + Tailwind CSS
