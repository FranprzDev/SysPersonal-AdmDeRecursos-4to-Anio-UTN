ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_sistema_check;

ALTER TABLE usuarios ADD CONSTRAINT usuarios_rol_sistema_check 
CHECK (rol_sistema IN ('admin', 'rrhh', 'supervisor', 'empleado'));

CREATE OR REPLACE FUNCTION crear_usuario_empleado()
RETURNS TRIGGER AS $$
DECLARE
    usuario_existente RECORD;
BEGIN
    IF TG_OP = 'INSERT' THEN
        SELECT * INTO usuario_existente
        FROM usuarios
        WHERE email = NEW.email OR dni_empleado = NEW.dni
        LIMIT 1;
        
        IF NOT FOUND THEN
            INSERT INTO usuarios (email, password, rol_sistema, dni_empleado, activo)
            VALUES (
                NEW.email,
                NEW.dni,
                'empleado',
                NEW.dni,
                NEW.activo
            );
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        SELECT * INTO usuario_existente
        FROM usuarios
        WHERE dni_empleado = OLD.dni
        LIMIT 1;
        
        IF FOUND THEN
            UPDATE usuarios
            SET 
                email = NEW.email,
                activo = NEW.activo,
                dni_empleado = NEW.dni
            WHERE dni_empleado = OLD.dni;
        ELSE
            INSERT INTO usuarios (email, password, rol_sistema, dni_empleado, activo)
            VALUES (
                NEW.email,
                NEW.dni,
                'empleado',
                NEW.dni,
                NEW.activo
            )
            ON CONFLICT (email) DO UPDATE
            SET 
                dni_empleado = NEW.dni,
                activo = NEW.activo,
                rol_sistema = 'empleado';
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE usuarios
        SET activo = false
        WHERE dni_empleado = OLD.dni;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_crear_usuario_empleado ON empleados;

CREATE TRIGGER trigger_crear_usuario_empleado
AFTER INSERT OR UPDATE OR DELETE ON empleados
FOR EACH ROW
EXECUTE FUNCTION crear_usuario_empleado();

