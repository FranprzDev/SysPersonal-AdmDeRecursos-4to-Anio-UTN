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

-- Políticas para empleados (todos pueden leer empleados activos)
CREATE POLICY "Empleados visibles para todos" ON empleados
FOR SELECT USING (activo = true);

CREATE POLICY "Admin puede todo en empleados" ON empleados
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "RRHH puede gestionar empleados" ON empleados
FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'rrhh'));

-- Políticas para sectores
CREATE POLICY "Sectores visibles para todos" ON sectores
FOR SELECT USING (true);

CREATE POLICY "Admin y RRHH pueden gestionar sectores" ON sectores
FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'rrhh'));

-- Políticas para roles
CREATE POLICY "Roles visibles para todos" ON roles
FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar roles" ON roles
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para fichas médicas (usuarios autenticados)
CREATE POLICY "Authenticated users can view fichas médicas" ON fichas_medicas
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage fichas médicas" ON fichas_medicas
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para asistencias
CREATE POLICY "Empleados pueden ver su asistencia" ON asistencias
FOR SELECT USING (
  dni_empleado = (auth.jwt() ->> 'dni') OR 
  auth.jwt() ->> 'role' IN ('admin', 'rrhh', 'supervisor')
);

CREATE POLICY "Empleados pueden registrar su asistencia" ON asistencias
FOR INSERT WITH CHECK (dni_empleado = (auth.jwt() ->> 'dni'));

CREATE POLICY "Admin y RRHH pueden gestionar asistencias" ON asistencias
FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'rrhh'));

-- Políticas para historial (solo lectura para admin y RRHH)
CREATE POLICY "Admin y RRHH pueden ver historial empleados" ON historial_empleados
FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'rrhh'));

CREATE POLICY "Admin y RRHH pueden ver historial sectores" ON historial_sectores
FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'rrhh'));
