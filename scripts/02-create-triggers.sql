-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para empleados
CREATE TRIGGER update_empleados_updated_at
BEFORE UPDATE ON empleados
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para sectores
CREATE TRIGGER update_sectores_updated_at
BEFORE UPDATE ON sectores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para fichas_medicas
CREATE TRIGGER update_fichas_medicas_updated_at
BEFORE UPDATE ON fichas_medicas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Función para registrar cambios en empleados
CREATE OR REPLACE FUNCTION log_empleado_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.nombre != NEW.nombre THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'nombre', OLD.nombre, NEW.nombre);
    END IF;
    
    IF OLD.apellido != NEW.apellido THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'apellido', OLD.apellido, NEW.apellido);
    END IF;
    
    IF OLD.email != NEW.email THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'email', OLD.email, NEW.email);
    END IF;
    
    IF OLD.telefono IS DISTINCT FROM NEW.telefono THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'telefono', OLD.telefono, NEW.telefono);
    END IF;
    
    IF OLD.direccion IS DISTINCT FROM NEW.direccion THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'direccion', OLD.direccion, NEW.direccion);
    END IF;
    
    IF OLD.id_sector IS DISTINCT FROM NEW.id_sector THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'id_sector', OLD.id_sector::TEXT, NEW.id_sector::TEXT);
    END IF;
    
    IF OLD.dni_supervisor IS DISTINCT FROM NEW.dni_supervisor THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'dni_supervisor', OLD.dni_supervisor, NEW.dni_supervisor);
    END IF;
    
    IF OLD.activo != NEW.activo THEN
        INSERT INTO historial_empleados (dni_empleado, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.dni, current_user, 'activo', OLD.activo::TEXT, NEW.activo::TEXT);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auditoría de empleados
CREATE TRIGGER audit_empleado_changes
AFTER UPDATE ON empleados
FOR EACH ROW
EXECUTE FUNCTION log_empleado_changes();

-- Función para registrar cambios en sectores
CREATE OR REPLACE FUNCTION log_sector_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.nombre_sector != NEW.nombre_sector THEN
        INSERT INTO historial_sectores (id_sector, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id_sector, current_user, 'nombre_sector', OLD.nombre_sector, NEW.nombre_sector);
    END IF;
    
    IF OLD.descripcion IS DISTINCT FROM NEW.descripcion THEN
        INSERT INTO historial_sectores (id_sector, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id_sector, current_user, 'descripcion', OLD.descripcion, NEW.descripcion);
    END IF;
    
    IF OLD.dni_supervisor IS DISTINCT FROM NEW.dni_supervisor THEN
        INSERT INTO historial_sectores (id_sector, usuario_modificador, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id_sector, current_user, 'dni_supervisor', OLD.dni_supervisor, NEW.dni_supervisor);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auditoría de sectores
CREATE TRIGGER audit_sector_changes
AFTER UPDATE ON sectores
FOR EACH ROW
EXECUTE FUNCTION log_sector_changes();
