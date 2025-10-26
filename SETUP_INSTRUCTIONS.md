# Instrucciones de Configuración Paso a Paso

## Configuración Inicial de Supabase

### Paso 1: Ejecutar Scripts SQL

Ir al **SQL Editor** en Supabase Dashboard y ejecutar en este orden:

#### 1.1 Crear Tablas
Copiar y ejecutar todo el contenido de `scripts/01-create-tables.sql`

Esto creará las siguientes tablas:
- empleados
- roles
- empleado_rol
- sectores
- capacitaciones
- empleado_capacitacion
- fichas_medicas
- estudios
- asistencias
- historial_empleados
- historial_sectores

#### 1.2 Crear Triggers de Auditoría
Copiar y ejecutar todo el contenido de `scripts/02-create-triggers.sql`

Esto creará triggers automáticos que registran todos los cambios en empleados y sectores.

#### 1.3 Configurar Row Level Security
Copiar y ejecutar todo el contenido de `scripts/04-rls-policies.sql`

Esto configurará las políticas de seguridad para proteger los datos.

#### 1.4 Insertar Datos Iniciales
Copiar y ejecutar todo el contenido de `scripts/05-insert-test-data.sql`

Esto insertará:
- 4 roles básicos (Administrador, Gerente, Empleado, Supervisor)
- 5 sectores (RRHH, Tecnología, Ventas, Administración, Producción)
- 4 capacitaciones de ejemplo

### Paso 2: Crear Usuario Administrador

#### 2.1 Crear usuario en Supabase Auth

1. En Supabase Dashboard, ir a **Authentication** → **Users**
2. Click en **Add user**
3. Seleccionar **Create new user**
4. Completar:
   \`\`\`
   Email: admin@empresa.com
   Password: Admin123!
   \`\`\`
5. **IMPORTANTE:** Marcar la opción **Auto Confirm User**
6. Click en **Create user**
7. **Copiar el UUID** del usuario creado (aparece en la columna ID)

#### 2.2 Crear empleado asociado al usuario

En el **SQL Editor**, ejecutar este script reemplazando `'UUID_AQUI'` con el UUID copiado:

\`\`\`sql
-- Insertar empleado administrador
INSERT INTO empleados (
  dni, 
  nombre, 
  apellido, 
  fecha_nacimiento, 
  direccion, 
  telefono, 
  email, 
  activo, 
  id_sector
) VALUES (
  '12345678', 
  'Admin', 
  'Sistema', 
  '1990-01-01', 
  'Dirección Administrativa', 
  '3814000000', 
  'admin@empresa.com', 
  true, 
  1
);

-- Asignar rol de Administrador
INSERT INTO empleado_rol (dni_empleado, id_rol) 
VALUES ('12345678', 1);
\`\`\`

### Paso 3: Configurar Storage (para fichas médicas)

1. En Supabase Dashboard, ir a **Storage**
2. Click en **Create bucket**
3. Nombre: `fichas-medicas`
4. Marcar como **Public** (opcional, según requisitos de seguridad)
5. Click en **Create bucket**

### Paso 4: Verificar Configuración

#### 4.1 Verificar tablas creadas
En SQL Editor, ejecutar:
\`\`\`sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
\`\`\`

Deberías ver 11 tablas.

#### 4.2 Verificar datos iniciales
\`\`\`sql
SELECT * FROM roles;
SELECT * FROM sectores;
SELECT * FROM capacitaciones;
SELECT * FROM empleados;
\`\`\`

#### 4.3 Verificar RLS habilitado
\`\`\`sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
\`\`\`

Todas las tablas deben tener `rowsecurity = true`.

### Paso 5: Probar el Login

1. Ejecutar el proyecto: `npm run dev`
2. Ir a `http://localhost:3000`
3. Click en **Iniciar Sesión**
4. Ingresar:
   - Email: `admin@empresa.com`
   - Password: `Admin123!`
5. Deberías ser redirigido al dashboard

## Crear Usuarios Adicionales

### Usuario RRHH

1. En Supabase Auth, crear usuario:
   - Email: `rrhh@empresa.com`
   - Password: `Rrhh123!`
   - Auto Confirm: ✓

2. En SQL Editor:
\`\`\`sql
INSERT INTO empleados (dni, nombre, apellido, fecha_nacimiento, direccion, telefono, email, activo, id_sector) 
VALUES ('23456789', 'María', 'González', '1992-05-15', 'Calle RRHH 456', '3814111111', 'rrhh@empresa.com', true, 1);

INSERT INTO empleado_rol (dni_empleado, id_rol) 
VALUES ('23456789', 2);
\`\`\`

### Usuario Supervisor

1. En Supabase Auth, crear usuario:
   - Email: `supervisor@empresa.com`
   - Password: `Super123!`
   - Auto Confirm: ✓

2. En SQL Editor:
\`\`\`sql
INSERT INTO empleados (dni, nombre, apellido, fecha_nacimiento, direccion, telefono, email, activo, id_sector) 
VALUES ('34567890', 'Carlos', 'Rodríguez', '1988-08-20', 'Av. Supervisor 789', '3814222222', 'supervisor@empresa.com', true, 2);

INSERT INTO empleado_rol (dni_empleado, id_rol) 
VALUES ('34567890', 4);
\`\`\`

## Solución de Problemas Comunes

### Error: "No se puede iniciar sesión"
- Verificar que el usuario tenga **Auto Confirm** activado
- Verificar que las credenciales sean correctas
- Verificar que las variables de entorno estén configuradas

### Error: "No se pueden ver los datos"
- Verificar que RLS esté configurado correctamente
- Verificar que el empleado esté asociado al usuario de auth
- Verificar que el rol esté asignado correctamente

### Error: "No se pueden subir archivos"
- Verificar que el bucket `fichas-medicas` exista
- Verificar los permisos del bucket

### Error: "Los triggers no funcionan"
- Verificar que los triggers estén creados: `SELECT * FROM pg_trigger;`
- Verificar que las funciones existan: `SELECT * FROM pg_proc WHERE proname LIKE 'audit%';`

## Verificación Final

Checklist de configuración completa:

- [ ] Todas las tablas creadas (11 tablas)
- [ ] Triggers de auditoría creados
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas RLS configuradas
- [ ] Datos iniciales insertados (roles, sectores, capacitaciones)
- [ ] Usuario admin creado en Supabase Auth
- [ ] Empleado admin creado y asociado
- [ ] Rol admin asignado
- [ ] Bucket de storage creado
- [ ] Login funcional
- [ ] Dashboard accesible

Si todos los items están marcados, el sistema está listo para usar.
