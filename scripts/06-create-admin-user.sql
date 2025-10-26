-- Script para crear usuario administrador
-- IMPORTANTE: Este script debe ejecutarse DESPUÉS de crear el usuario en Supabase Auth

-- Paso 1: Crear el usuario en Supabase Auth Dashboard
-- Email: admin@empresa.com
-- Password: Admin123!
-- Confirmar email automáticamente

-- Paso 2: Obtener el UUID del usuario creado y ejecutar este script
-- Reemplazar 'UUID_DEL_USUARIO_ADMIN' con el UUID real del usuario creado

-- Insertar empleado administrador
-- NOTA: Reemplazar 'UUID_DEL_USUARIO_ADMIN' con el UUID real
/*
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
*/

-- INSTRUCCIONES PARA CREAR USUARIOS:
-- 1. Ir a Supabase Dashboard > Authentication > Users
-- 2. Click en "Add user" > "Create new user"
-- 3. Ingresar email y password
-- 4. Marcar "Auto Confirm User" para que no requiera confirmación de email
-- 5. Copiar el UUID del usuario creado
-- 6. Ejecutar los INSERT de arriba reemplazando el UUID
