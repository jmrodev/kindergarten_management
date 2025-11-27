# 🛠️ Utilidades de Validación y Seguridad

Conjunto de utilidades reutilizables para validación, sanitización y seguridad de formularios.

## 📁 Estructura

```
utils/
├── index.js                    # Exportación centralizada
├── validationPatterns.js       # Patrones regex y configuración
├── sanitization.js             # Funciones de sanitización XSS
├── securityValidation.js       # Validaciones de seguridad (SQL, XSS)
├── formValidation.js           # Validación de formularios
├── dataConverters.js           # Conversiones de datos (fechas, nombres, etc.)
└── README.md                   # Esta documentación
```

## 🚀 Uso Rápido

### 1. Importación Simple

```javascript
import { 
    sanitizeInput, 
    validateSecurity, 
    VALIDATION_PATTERNS 
} from '../utils';
```

### 2. Con el Hook Personalizado

```javascript
import useFormValidation from '../hooks/useFormValidation';

function MyForm() {
    const { 
        formData, 
        errors, 
        handleChange, 
        handleNestedChange, 
        handleSubmit 
    } = useFormValidation({
        nombre: '',
        direccion: { calle: '', numero: '' }
    });

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <input 
                name="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange(e, 'name')}
            />
            {errors.nombre && <span>{errors.nombre}</span>}
        </form>
    );
}
```

## 📚 Funciones Disponibles

### Sanitización

```javascript
import { sanitizeInput, sanitizeObject, escapeHtml } from '../utils';

// Sanitizar string individual
const clean = sanitizeInput('<script>alert()</script>'); // ''

// Sanitizar objeto completo
const cleanObj = sanitizeObject({
    nombre: '<b>Juan</b>',
    direccion: { calle: 'Main<script>' }
});

// Escapar HTML
const escaped = escapeHtml('<div>Test</div>'); // '&lt;div&gt;Test&lt;/div&gt;'
```

### Validación de Seguridad

```javascript
import { 
    validateSecurity, 
    isSafeFromSQLInjection,
    isSafeFromXSS 
} from '../utils';

// Validación completa
const result = validateSecurity("' OR '1'='1", VALIDATION_PATTERNS.name);
// { isValid: false, error: 'Entrada no válida...' }

// Verificaciones específicas
const safe = isSafeFromSQLInjection("Juan Pérez"); // true
const unsafe = isSafeFromXSS("<script>"); // false
```

### Validación de Campos

```javascript
import { validateField, COMMON_VALIDATION_RULES } from '../utils';

const result = validateField('Juan', {
    required: true,
    patternType: 'name',
    maxLength: 100
});
// { isValid: true, error: null, sanitizedValue: 'Juan' }

// Usar reglas predefinidas
const emailResult = validateField(
    'test@email.com', 
    COMMON_VALIDATION_RULES.email
);
```

### Patrones y Configuración

```javascript
import { 
    VALIDATION_PATTERNS, 
    VALIDATION_MESSAGES, 
    MAX_LENGTHS 
} from '../utils';

// Usar patrones
const pattern = VALIDATION_PATTERNS.phone; // /^[\d\s\-()]+$/

// Mensajes de error
const msg = VALIDATION_MESSAGES.name; // 'Solo se permiten letras y espacios'

// Límites de longitud
const max = MAX_LENGTHS.name; // 100
```

### Conversiones de Datos

```javascript
import { 
    formatDateForInput,
    formatDateForDisplay,
    formatFullName,
    formatAddress,
    calculateAge
} from '../utils';

// Convertir fecha ISO a formato input
const dateForInput = formatDateForInput('2019-03-15T03:00:00.000Z'); 
// '2019-03-15'

// Mostrar fecha formateada
const dateDisplay = formatDateForDisplay('2019-03-15T03:00:00.000Z'); 
// '15/03/2019'

// Formatear nombre completo
const fullName = formatFullName({
    nombre: 'Juan',
    segundoNombre: 'Carlos',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'González'
});
// 'Juan Carlos Pérez González'

// Formatear dirección
const address = formatAddress({
    calle: 'San Martín',
    numero: '123',
    ciudad: 'Tandil',
    provincia: 'Buenos Aires'
});
// 'San Martín 123, Tandil, Buenos Aires'

// Calcular edad
const age = calculateAge('2019-03-15'); 
// 5 (años)
```

## 🔍 Patrones Disponibles

| Patrón | Descripción | Ejemplo |
|--------|-------------|---------|
| `name` | Letras, espacios, tildes, ñ | `María José` |
| `address` | Alfanumérico + #, º, -, . | `Calle 5 #123` |
| `phone` | Números, espacios, -, () | `(011) 4567-8900` |
| `email` | Email válido | `test@example.com` |
| `postalCode` | Alfanumérico con guión | `1234-AB` |
| `numeric` | Solo números | `12345` |
| `alphanumeric` | Letras y números | `abc123` |
| `date` | YYYY-MM-DD | `2024-01-15` |
| `url` | URL http/https | `https://example.com` |

## 🛡️ Protecciones Implementadas

### SQL Injection
Detecta y bloquea:
- Keywords: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `DROP`, `UNION`
- Comentarios: `--`, `/*`, `*/`
- Caracteres peligrosos: `;`, `'`, `"`

### XSS (Cross-Site Scripting)
Detecta y bloquea:
- Tags: `<script>`, `<iframe>`, `<object>`
- Atributos: `onclick`, `onerror`, `onload`
- Protocols: `javascript:`

### Path Traversal
Detecta y bloquea:
- `../`, `..\\`
- Versiones encoded: `%2e%2e%2f`

## 💡 Ejemplos de Uso Real

### Formulario Completo con Hook

```javascript
import useFormValidation from '../hooks/useFormValidation';

function StudentForm() {
    const { formData, errors, handleChange, handleNestedChange, handleSubmit } = 
        useFormValidation({
            nombre: '',
            apellido: '',
            direccion: { calle: '', numero: '' }
        });

    const onSubmit = (data) => {
        console.log('Datos validados y sanitizados:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input 
                name="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange(e, 'name')}
                isInvalid={!!errors.nombre}
            />
            
            <input 
                name="calle"
                value={formData.direccion.calle}
                onChange={(e) => 
                    handleNestedChange('direccion', 'calle', e.target.value, 'address')
                }
                isInvalid={!!errors['direccion.calle']}
            />
            
            <button type="submit">Enviar</button>
        </form>
    );
}
```

### Validación Manual

```javascript
import { sanitizeInput, validateSecurity, VALIDATION_PATTERNS } from '../utils';

function handleInput(value) {
    // 1. Sanitizar
    const clean = sanitizeInput(value);
    
    // 2. Validar
    const validation = validateSecurity(clean, VALIDATION_PATTERNS.name);
    
    if (!validation.isValid) {
        showError(validation.error);
        return;
    }
    
    // 3. Usar valor limpio
    saveToState(clean);
}
```

## 🧪 Testing

```javascript
import { sanitizeInput, validateSecurity } from '../utils';

test('Bloquea SQL Injection', () => {
    const result = validateSecurity("' OR '1'='1");
    expect(result.isValid).toBe(false);
});

test('Permite nombres válidos', () => {
    const result = validateSecurity("María José", VALIDATION_PATTERNS.name);
    expect(result.isValid).toBe(true);
});
```

## 🔄 Extensión

### Agregar Nuevo Patrón

```javascript
// En validationPatterns.js
export const VALIDATION_PATTERNS = {
    // ... patrones existentes
    customPattern: /^[a-z0-9\-]+$/
};

export const VALIDATION_MESSAGES = {
    // ... mensajes existentes
    customPattern: 'Solo minúsculas, números y guiones'
};
```

### Agregar Nueva Validación

```javascript
// En securityValidation.js
export const isSafeFromCustomAttack = (value) => {
    // Tu lógica aquí
    return true;
};
```

## ⚠️ Notas Importantes

1. **No confiar solo en validación frontend** - Siempre validar en el backend
2. **Usar prepared statements** - En el backend para queries SQL
3. **Logs de seguridad** - Las funciones hacen console.warn de intentos de ataque
4. **Performance** - Las validaciones son rápidas pero evitar validar en cada keystroke si no es necesario

## 📖 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
