# Sistema de Gestión de Personal

Trabajo Final Integrador - Administración de Recursos  
Universidad Tecnológica Nacional - Facultad Regional Tucumán

## Descripción

Sistema web completo para la gestión integral de recursos humanos, desarrollado con Next.js 15, TypeScript y Supabase. Permite administrar empleados, sectores, roles, capacitaciones, asistencias y fichas médicas con un sistema de autenticación y roles de usuario.

## Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **UI:** shadcn/ui + Tailwind CSS
- **Gráficos:** Recharts
- **Exportación:** xlsx (SheetJS)

## Requisitos Funcionales Implementados

### RF1 - Gestión de Empleados
- Alta, modificación y baja lógica de empleados
- Validación de datos y DNI único

### RF2 - Baja Lógica
- Cambio de estado activo/inactivo
- Preservación de datos históricos

### RF3 - Asignación de Sectores
- Asignación y cambio de sectores
- Registro de cambios

### RF4 - Relación con Supervisores
- Asignación de supervisores
- Visualización de jerarquía

### RF5 - Gestión de Capacitaciones
- CRUD de capacitaciones
- Asignación a empleados
- Historial completo

### RF6 - Búsqueda Avanzada
- Filtros múltiples combinables
- Búsqueda en tiempo real

### RF7 - Historial de Modificaciones
- Auditoría automática con triggers
- Trazabilidad completa de cambios

### RF8 - Exportación a Excel
- Exportación de empleados, sectores y capacitaciones
- Formato .xlsx

### RF9 - Fichas Médicas
- Gestión de información médica
- Upload de documentos a Supabase Storage
- Datos sensibles protegidos

### RF10 - Registro de Asistencia
- Marcado de ingreso/salida
- Validaciones de horario
- Historial de asistencias

### RF11 - Dashboard de Desempeño
- Métricas generales
- Gráficos interactivos
- Indicadores por sector

## Instalación y Configuración

### 1. Clonar el repositorio

\`\`\`bash
git clone <url-del-repositorio>
cd tfi-gestion-personal
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Supabase

#### 3.1 Crear proyecto en Supabase
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar las credenciales (URL y Anon Key)

#### 3.2 Configurar variables de entorno
Las variables ya están configuradas en el proyecto de Vercel. Si ejecutas localmente, crea un archivo `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
\`\`\`

#### 3.3 Ejecutar scripts SQL en Supabase

En el SQL Editor de Supabase, ejecutar en orden:

1. **`scripts/01-create-tables.sql`** - Crea todas las tablas
2. **`scripts/02-create-triggers.sql`** - Crea triggers de auditoría
3. **`scripts/04-rls-policies.sql`** - Configura políticas de seguridad
4. **`scripts/05-insert-test-data.sql`** - Inserta datos de prueba (roles, sectores, capacitaciones)

### 4. Crear usuario administrador

#### 4.1 En Supabase Dashboard
1. Ir a **Authentication** → **Users**
2. Click en **Add user** → **Create new user**
3. Ingresar:
   - Email: `admin@empresa.com`
   - Password: `Admin123!`
4. Marcar **Auto Confirm User** (importante)
5. Click en **Create user**
6. Copiar el **UUID** del usuario creado

#### 4.2 Crear empleado asociado
En el SQL Editor de Supabase, ejecutar (reemplazar `UUID_DEL_USUARIO` con el UUID copiado):

\`\`\`sql
-- Insertar empleado administrador
INSERT INTO empleados (dni, nombre, apellido, fecha_nacimiento, direccion, telefono, email, activo, id_sector) 
VALUES (
  '12345678', 
  'Admin', 
  'Sistema', 
  '1990-01-01', 
  'Dirección Admin', 
  '3814000000', 
  'admin@empresa.com', 
  true, 
  1
);

-- Asignar rol de Administrador
INSERT INTO empleado_rol (dni_empleado, id_rol) 
VALUES ('12345678', 1);
\`\`\`

### 5. Ejecutar el proyecto

\`\`\`bash
npm run dev
\`\`\`

Abrir [http://localhost:3000](http://localhost:3000)

## Credenciales de Acceso

### Usuario Administrador
- **Email:** admin@empresa.com
- **Password:** Admin123!
- **Permisos:** Acceso completo al sistema

## Estructura del Proyecto

\`\`\`
/app
  /auth/login          - Página de inicio de sesión
  /dashboard           - Dashboard principal con métricas
  /dashboard/empleados - Gestión de empleados
  /dashboard/sectores  - Gestión de sectores
  /dashboard/roles     - Gestión de roles
  /dashboard/capacitaciones - Gestión de capacitaciones
  /dashboard/asistencia - Registro de asistencia
  /dashboard/fichas-medicas - Fichas médicas
  /dashboard/reportes  - Exportación de datos
  /dashboard/historial - Auditoría de cambios
  /dashboard/desempeno - Dashboard de desempeño

/components
  /ui                  - Componentes shadcn/ui
  /empleados           - Componentes de empleados
  /sectores            - Componentes de sectores
  /roles               - Componentes de roles
  /capacitaciones      - Componentes de capacitaciones
  /asistencia          - Componentes de asistencia
  /fichas-medicas      - Componentes de fichas médicas
  /reportes            - Componentes de reportes
  /historial           - Componentes de historial
  /desempeno           - Componentes de dashboard
  /layout              - Sidebar y header

/lib
  /supabase            - Clientes de Supabase
  /utils               - Utilidades

/scripts
  *.sql                - Scripts de base de datos
\`\`\`

## Roles del Sistema

### Admin
- Acceso completo a todas las funcionalidades
- Gestión de empleados, sectores, roles
- Acceso a fichas médicas
- Exportación de datos
- Visualización de auditoría

### RRHH
- Gestión de empleados
- Gestión de capacitaciones
- Acceso a fichas médicas
- Exportación de datos
- Visualización de reportes

### Supervisor
- Visualización de empleados a su cargo
- Consulta de información básica
- Sin permisos de edición

## Características de Seguridad

- **Autenticación:** Supabase Auth con email/password
- **Row Level Security (RLS):** Políticas de seguridad a nivel de base de datos
- **Roles y Permisos:** Sistema de roles con permisos diferenciados
- **Auditoría:** Registro automático de todos los cambios
- **Protección de Datos:** Datos médicos con acceso restringido

## Funcionalidades Destacadas

### Búsqueda Avanzada
Filtros combinables por nombre, DNI, sector, rol, estado, supervisor y capacitación.

### Historial de Auditoría
Registro automático mediante triggers de PostgreSQL de todos los cambios en empleados y sectores.

### Dashboard de Desempeño
Gráficos interactivos con Recharts mostrando:
- Empleados por sector
- Asistencia mensual
- Capacitaciones realizadas

### Exportación a Excel
Exportación de datos a formato .xlsx para empleados, sectores y capacitaciones.

### Fichas Médicas
Gestión completa de información médica con upload de documentos a Supabase Storage.

## Soporte

Para problemas o consultas sobre el sistema, contactar al equipo de desarrollo.

## Licencia

Proyecto académico - Universidad Tecnológica Nacional
