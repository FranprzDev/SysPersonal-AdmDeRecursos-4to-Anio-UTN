-- Deshabilitar RLS en la tabla usuarios para permitir acceso al login
-- IMPORTANTE: La tabla usuarios necesita acceso público para el endpoint de login
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- O si prefieres mantener RLS habilitado, crea una política que permita SELECT:
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir SELECT en usuarios para login" ON usuarios
-- FOR SELECT USING (true);

-- Verificar que los usuarios existan
SELECT * FROM usuarios;

-- Si no existen usuarios, ejecuta:
-- INSERT INTO usuarios (email, password, rol_sistema, dni_empleado, activo) VALUES
-- ('admin@empresa.com', '$2a$10$...', 'admin', NULL, true),
-- ('rrhh@empresa.com', '$2a$10$...', 'rrhh', NULL, true),
-- ('supervisor@empresa.com', '$2a$10$...', 'supervisor', NULL, true)
-- ON CONFLICT (email) DO UPDATE SET activo = true;

