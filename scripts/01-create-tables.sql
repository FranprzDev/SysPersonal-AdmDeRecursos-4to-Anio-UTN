-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
  dni VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  activo BOOLEAN DEFAULT true,
  id_sector INTEGER,
  dni_supervisor VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (dni_supervisor) REFERENCES empleados(dni) ON DELETE SET NULL
);

-- Tabla de sectores
CREATE TABLE IF NOT EXISTS sectores (
  id_sector SERIAL PRIMARY KEY,
  nombre_sector VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  dni_supervisor VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (dni_supervisor) REFERENCES empleados(dni) ON DELETE SET NULL
);

-- Agregar FK de sector a empleados
ALTER TABLE empleados 
ADD CONSTRAINT fk_empleado_sector 
FOREIGN KEY (id_sector) REFERENCES sectores(id_sector) ON DELETE SET NULL;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id_rol SERIAL PRIMARY KEY,
  nombre_rol VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación empleado-rol (N:M)
CREATE TABLE IF NOT EXISTS empleado_rol (
  dni_empleado VARCHAR(20) NOT NULL,
  id_rol INTEGER NOT NULL,
  fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (dni_empleado, id_rol),
  FOREIGN KEY (dni_empleado) REFERENCES empleados(dni) ON DELETE CASCADE,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

-- Tabla de capacitaciones
CREATE TABLE IF NOT EXISTS capacitaciones (
  id_capacitacion SERIAL PRIMARY KEY,
  nombre_capacitacion VARCHAR(200) NOT NULL,
  institucion VARCHAR(200),
  fecha_inicio DATE,
  fecha_fin DATE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación empleado-capacitacion (N:M)
CREATE TABLE IF NOT EXISTS empleado_capacitacion (
  dni_empleado VARCHAR(20) NOT NULL,
  id_capacitacion INTEGER NOT NULL,
  fecha_realizacion DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (dni_empleado, id_capacitacion),
  FOREIGN KEY (dni_empleado) REFERENCES empleados(dni) ON DELETE CASCADE,
  FOREIGN KEY (id_capacitacion) REFERENCES capacitaciones(id_capacitacion) ON DELETE CASCADE
);

-- Tabla de fichas médicas
CREATE TABLE IF NOT EXISTS fichas_medicas (
  id_ficha SERIAL PRIMARY KEY,
  dni_empleado VARCHAR(20) NOT NULL UNIQUE,
  grupo_sanguineo VARCHAR(10),
  alergias TEXT,
  enfermedades_preexistentes TEXT,
  aptitud_medica VARCHAR(20) CHECK (aptitud_medica IN ('Apto', 'No apto')),
  fecha_control DATE,
  observaciones TEXT,
  documento_adjunto TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (dni_empleado) REFERENCES empleados(dni) ON DELETE CASCADE
);

-- Tabla de estudios médicos
CREATE TABLE IF NOT EXISTS estudios (
  id_estudio SERIAL PRIMARY KEY,
  id_ficha INTEGER NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  fecha DATE NOT NULL,
  ruta_archivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (id_ficha) REFERENCES fichas_medicas(id_ficha) ON DELETE CASCADE
);

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
  id_asistencia SERIAL PRIMARY KEY,
  dni_empleado VARCHAR(20) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora_ingreso TIMESTAMP WITH TIME ZONE,
  hora_salida TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (dni_empleado, fecha),
  FOREIGN KEY (dni_empleado) REFERENCES empleados(dni) ON DELETE CASCADE
);

-- Tabla de historial de empleados
CREATE TABLE IF NOT EXISTS historial_empleados (
  id_historial SERIAL PRIMARY KEY,
  dni_empleado VARCHAR(20) NOT NULL,
  usuario_modificador VARCHAR(100),
  fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campo_modificado VARCHAR(100),
  valor_anterior TEXT,
  valor_nuevo TEXT,
  FOREIGN KEY (dni_empleado) REFERENCES empleados(dni) ON DELETE CASCADE
);

-- Tabla de historial de sectores
CREATE TABLE IF NOT EXISTS historial_sectores (
  id_historial SERIAL PRIMARY KEY,
  id_sector INTEGER NOT NULL,
  usuario_modificador VARCHAR(100),
  fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campo_modificado VARCHAR(100),
  valor_anterior TEXT,
  valor_nuevo TEXT,
  FOREIGN KEY (id_sector) REFERENCES sectores(id_sector) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_empleados_activo ON empleados(activo);
CREATE INDEX IF NOT EXISTS idx_empleados_sector ON empleados(id_sector);
CREATE INDEX IF NOT EXISTS idx_empleados_supervisor ON empleados(dni_supervisor);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX IF NOT EXISTS idx_asistencias_empleado ON asistencias(dni_empleado);
CREATE INDEX IF NOT EXISTS idx_historial_empleados_fecha ON historial_empleados(fecha_modificacion);
CREATE INDEX IF NOT EXISTS idx_historial_sectores_fecha ON historial_sectores(fecha_modificacion);
