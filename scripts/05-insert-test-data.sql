-- Script para insertar datos de prueba en el sistema
-- IMPORTANTE: Ejecutar después de crear las tablas y antes de crear usuarios en Supabase Auth

-- Insertar roles básicos
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Gerente', 'Gestión de equipos y reportes'),
('Empleado', 'Usuario estándar'),
('Supervisor', 'Supervisión de personal')
ON CONFLICT DO NOTHING;

-- Insertar sectores
INSERT INTO sectores (nombre_sector, descripcion) VALUES
('Recursos Humanos', 'Gestión de personal y capacitaciones'),
('Tecnología', 'Desarrollo y soporte técnico'),
('Ventas', 'Gestión comercial y atención al cliente'),
('Administración', 'Gestión administrativa y contable'),
('Producción', 'Área de producción y manufactura')
ON CONFLICT DO NOTHING;

-- NOTA IMPORTANTE: Los empleados se deben crear DESPUÉS de crear los usuarios en Supabase Auth
-- porque necesitamos el UUID del usuario autenticado

-- Ejemplo de cómo insertar empleados después de crear usuarios en Supabase:
-- 1. Crear usuario en Supabase Auth (email: admin@empresa.com, password: admin123)
-- 2. Obtener el UUID del usuario creado
-- 3. Insertar el empleado con ese UUID

-- Ejemplo de inserción de empleado (reemplazar 'UUID_DEL_USUARIO' con el UUID real):
/*
INSERT INTO empleados (dni, nombre, apellido, fecha_nacimiento, direccion, telefono, email, activo, id_sector) VALUES
('12345678', 'Juan', 'Pérez', '1990-01-15', 'Av. Siempre Viva 123', '3814567890', 'admin@empresa.com', true, 1);
*/

-- Insertar capacitaciones de ejemplo
INSERT INTO capacitaciones (nombre_capacitacion, institucion, fecha_inicio, fecha_fin, descripcion) VALUES
('Seguridad e Higiene', 'Instituto de Seguridad Laboral', '2024-01-10', '2024-01-12', 'Capacitación obligatoria en seguridad laboral'),
('Liderazgo y Gestión de Equipos', 'Universidad Empresarial', '2024-02-01', '2024-02-15', 'Desarrollo de habilidades de liderazgo'),
('Excel Avanzado', 'Centro de Capacitación Técnica', '2024-03-05', '2024-03-07', 'Manejo avanzado de planillas de cálculo'),
('Primeros Auxilios', 'Cruz Roja Argentina', '2024-04-10', '2024-04-11', 'Capacitación en primeros auxilios básicos')
ON CONFLICT DO NOTHING;
