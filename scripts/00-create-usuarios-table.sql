-- Tabla de usuarios para autenticación simple
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol_sistema VARCHAR(20) NOT NULL CHECK (rol_sistema IN ('admin', 'rrhh', 'supervisor')),
  dni_empleado VARCHAR(20),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (dni_empleado) REFERENCES empleados(dni) ON DELETE SET NULL
);

-- Insertar usuarios de prueba (password sin hashear para simplicidad del TFI)
INSERT INTO usuarios (email, password, rol_sistema, dni_empleado) VALUES
('admin@empresa.com', 'admin123', 'admin', NULL),
('rrhh@empresa.com', 'rrhh123', 'rrhh', NULL),
('supervisor@empresa.com', 'supervisor123', 'supervisor', NULL)
ON CONFLICT (email) DO NOTHING;
