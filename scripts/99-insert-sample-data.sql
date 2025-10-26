-- Script para insertar datos de prueba en el sistema
-- Ejecutar DESPUÉS de crear las tablas

-- Insertar roles básicos
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Gerente', 'Gestión de equipos y reportes'),
('Empleado', 'Acceso básico'),
('Supervisor', 'Supervisión de personal')
ON CONFLICT (nombre_rol) DO NOTHING;

-- Insertar sectores
INSERT INTO sectores (nombre_sector, descripcion) VALUES
('Recursos Humanos', 'Gestión de personal y administración'),
('Tecnología', 'Desarrollo y soporte técnico'),
('Ventas', 'Área comercial'),
('Administración', 'Gestión administrativa y contable')
ON CONFLICT (nombre_sector) DO NOTHING;

-- Insertar empleado administrador de prueba
-- IMPORTANTE: Este empleado debe coincidir con el email del usuario de Supabase Auth
INSERT INTO empleados (dni, nombre, apellido, fecha_nacimiento, email, telefono, direccion, activo, id_sector)
VALUES 
('12345678', 'Admin', 'Sistema', '1990-01-01', 'admin@empresa.com', '1234567890', 'Calle Principal 123', true, 1)
ON CONFLICT (dni) DO NOTHING;

-- Asignar rol de administrador
INSERT INTO empleado_rol (dni_empleado, id_rol)
SELECT '12345678', id_rol FROM roles WHERE nombre_rol = 'Administrador'
ON CONFLICT DO NOTHING;

-- Insertar más empleados de ejemplo
INSERT INTO empleados (dni, nombre, apellido, fecha_nacimiento, email, telefono, direccion, activo, id_sector, dni_supervisor)
VALUES 
('23456789', 'Juan', 'Pérez', '1985-05-15', 'juan.perez@empresa.com', '1234567891', 'Av. Libertad 456', true, 2, '12345678'),
('34567890', 'María', 'González', '1992-08-20', 'maria.gonzalez@empresa.com', '1234567892', 'Calle 9 de Julio 789', true, 3, '12345678'),
('45678901', 'Carlos', 'Rodríguez', '1988-03-10', 'carlos.rodriguez@empresa.com', '1234567893', 'Av. San Martín 321', true, 2, '23456789')
ON CONFLICT (dni) DO NOTHING;

-- Asignar roles a empleados
INSERT INTO empleado_rol (dni_empleado, id_rol)
SELECT '23456789', id_rol FROM roles WHERE nombre_rol = 'Gerente'
ON CONFLICT DO NOTHING;

INSERT INTO empleado_rol (dni_empleado, id_rol)
SELECT '34567890', id_rol FROM roles WHERE nombre_rol = 'Empleado'
ON CONFLICT DO NOTHING;

INSERT INTO empleado_rol (dni_empleado, id_rol)
SELECT '45678901', id_rol FROM roles WHERE nombre_rol = 'Empleado'
ON CONFLICT DO NOTHING;

-- Insertar capacitaciones de ejemplo
INSERT INTO capacitaciones (nombre_capacitacion, institucion, fecha_inicio, fecha_fin, descripcion)
VALUES 
('Seguridad e Higiene', 'Instituto de Seguridad', '2024-01-15', '2024-01-16', 'Capacitación obligatoria en seguridad laboral'),
('Liderazgo y Gestión', 'Universidad Empresarial', '2024-02-01', '2024-02-28', 'Desarrollo de habilidades de liderazgo'),
('Excel Avanzado', 'Centro de Capacitación', '2024-03-10', '2024-03-12', 'Herramientas avanzadas de Excel')
ON CONFLICT DO NOTHING;

-- Asignar capacitaciones a empleados
INSERT INTO empleado_capacitacion (dni_empleado, id_capacitacion, fecha_realizacion)
SELECT '12345678', id_capacitacion, '2024-01-16' FROM capacitaciones WHERE nombre_capacitacion = 'Seguridad e Higiene'
ON CONFLICT DO NOTHING;

INSERT INTO empleado_capacitacion (dni_empleado, id_capacitacion, fecha_realizacion)
SELECT '23456789', id_capacitacion, '2024-02-28' FROM capacitaciones WHERE nombre_capacitacion = 'Liderazgo y Gestión'
ON CONFLICT DO NOTHING;

-- Insertar registros de asistencia de ejemplo
INSERT INTO asistencias (dni_empleado, fecha, hora_ingreso, hora_salida)
VALUES 
('12345678', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '08:00:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:00:00'),
('23456789', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '08:15:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:30:00'),
('34567890', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '08:30:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:15:00')
ON CONFLICT DO NOTHING;
