-- Insertar roles iniciales
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Gerente', 'Responsable de la gestión general'),
('Supervisor', 'Supervisa equipos de trabajo'),
('Analista', 'Realiza análisis y reportes'),
('Técnico', 'Ejecuta tareas técnicas especializadas'),
('Administrativo', 'Gestiona tareas administrativas'),
('Operario', 'Realiza operaciones de producción')
ON CONFLICT (nombre_rol) DO NOTHING;

-- Insertar sectores iniciales
INSERT INTO sectores (nombre_sector, descripcion) VALUES
('Recursos Humanos', 'Gestión del personal y desarrollo organizacional'),
('Sistemas', 'Tecnología de la información y soporte técnico'),
('Administración', 'Gestión administrativa y financiera'),
('Producción', 'Área de producción y manufactura'),
('Ventas', 'Gestión comercial y atención al cliente'),
('Logística', 'Gestión de almacenes y distribución')
ON CONFLICT (nombre_sector) DO NOTHING;
