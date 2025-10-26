# Instrucciones de Setup - SysPersonal

## Paso 1: Ejecutar Scripts SQL en Supabase

Ve a tu proyecto de Supabase → SQL Editor y ejecuta los siguientes scripts EN ORDEN:

### 1. Crear Tablas
Ejecuta: `scripts/01-create-tables.sql`

### 2. Crear Triggers de Auditoría
Ejecuta: `scripts/02-create-triggers.sql`

### 3. Configurar Políticas de Seguridad (RLS)
Ejecuta: `scripts/04-rls-policies.sql`

### 4. Insertar Datos de Prueba
Ejecuta: `scripts/99-insert-sample-data.sql`

## Paso 2: Crear Usuario en Supabase Auth

### Opción A: Desde la aplicación (Recomendado)
1. Ve a `/auth/register` en tu aplicación
2. Registra un usuario con email: `admin@empresa.com`
3. Contraseña: la que prefieras (mínimo 6 caracteres)
4. Verifica tu email si Supabase lo requiere

### Opción B: Desde Supabase Dashboard
1. Ve a Authentication → Users en tu dashboard de Supabase
2. Click en "Add user" → "Create new user"
3. Email: `admin@empresa.com`
4. Password: la que prefieras
5. Click en "Create user"

## Paso 3: Iniciar Sesión

1. Ve a `/auth/login`
2. Ingresa:
   - Email: `admin@empresa.com`
   - Password: la que configuraste
3. Deberías acceder al dashboard

## Credenciales de Prueba

Una vez que ejecutes el script `99-insert-sample-data.sql`, tendrás estos empleados en el sistema:

**Administrador:**
- DNI: 12345678
- Email: admin@empresa.com
- Nombre: Admin Sistema

**Gerente:**
- DNI: 23456789
- Email: juan.perez@empresa.com
- Nombre: Juan Pérez

**Empleados:**
- DNI: 34567890
- Email: maria.gonzalez@empresa.com
- Nombre: María González

- DNI: 45678901
- Email: carlos.rodriguez@empresa.com
- Nombre: Carlos Rodríguez

## Notas Importantes

1. El email del usuario de Supabase Auth DEBE coincidir con el email del empleado en la tabla `empleados`
2. Si tienes problemas de autenticación, verifica que:
   - Las tablas estén creadas correctamente
   - Los datos de prueba estén insertados
   - El usuario exista en Supabase Auth
   - El email coincida entre Auth y la tabla empleados

## Solución de Problemas

### "Error al iniciar sesión"
- Verifica que el usuario exista en Supabase Auth
- Verifica que la contraseña sea correcta
- Revisa la consola del navegador para más detalles

### "No se muestran datos"
- Ejecuta el script `99-insert-sample-data.sql`
- Verifica que las tablas tengan datos con: `SELECT * FROM empleados;`

### "Access denied" o errores de permisos
- Ejecuta el script `04-rls-policies.sql` para configurar RLS
- Verifica que el usuario tenga un empleado asociado con su email
