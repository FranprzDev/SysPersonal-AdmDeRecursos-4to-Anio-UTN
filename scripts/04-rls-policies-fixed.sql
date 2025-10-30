-- Habilitar RLS en todas las tablas
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectores ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleado_rol ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleado_capacitacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas_medicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudios ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_sectores ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Empleados visibles para todos" ON empleados;
DROP POLICY IF EXISTS "Admin puede todo en empleados" ON empleados;
DROP POLICY IF EXISTS "RRHH puede gestionar empleados" ON empleados;
DROP POLICY IF EXISTS "Sectores visibles para todos" ON sectores;
DROP POLICY IF EXISTS "Admin y RRHH pueden gestionar sectores" ON sectores;
DROP POLICY IF EXISTS "Roles visibles para todos" ON roles;
DROP POLICY IF EXISTS "Admin puede gestionar roles" ON roles;
DROP POLICY IF EXISTS "Admin y RRHH pueden ver fichas médicas" ON fichas_medicas;
DROP POLICY IF EXISTS "Admin y RRHH pueden gestionar fichas médicas" ON fichas_medicas;
DROP POLICY IF EXISTS "Empleados pueden ver su asistencia" ON asistencias;
DROP POLICY IF EXISTS "Empleados pueden registrar su asistencia" ON asistencias;
DROP POLICY IF EXISTS "Admin y RRHH pueden gestionar asistencias" ON asistencias;
DROP POLICY IF EXISTS "Admin y RRHH pueden ver historial empleados" ON historial_empleados;
DROP POLICY IF EXISTS "Admin y RRHH pueden ver historial sectores" ON historial_sectores;

-- Políticas para empleados (todos pueden leer empleados activos)
CREATE POLICY "Empleados visibles para todos" ON empleados
FOR SELECT USING (activo = true);

CREATE POLICY "Authenticated users can manage empleados" ON empleados
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para sectores
CREATE POLICY "Sectores visibles para todos" ON sectores
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage sectores" ON sectores
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para roles
CREATE POLICY "Roles visibles para todos" ON roles
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage roles" ON roles
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para fichas médicas (usuarios autenticados)
CREATE POLICY "Authenticated users can view fichas médicas" ON fichas_medicas
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage fichas médicas" ON fichas_medicas
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para capacitaciones
CREATE POLICY "Capacitaciones visibles para todos" ON capacitaciones
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage capacitaciones" ON capacitaciones
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage empleado_capacitacion" ON empleado_capacitacion
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para asistencias
CREATE POLICY "Authenticated users can view asistencias" ON asistencias
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage asistencias" ON asistencias
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para historial (solo lectura para usuarios autenticados)
CREATE POLICY "Authenticated users can view historial empleados" ON historial_empleados
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view historial sectores" ON historial_sectores
FOR SELECT USING (auth.role() = 'authenticated');

