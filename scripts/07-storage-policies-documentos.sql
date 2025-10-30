-- Crear bucket 'documentos' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Authenticated users can upload to documentos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view documentos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documentos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documentos" ON storage.objects;

-- Crear políticas RLS para el bucket 'documentos'
-- Permitir INSERT para usuarios autenticados
CREATE POLICY "Authenticated users can upload to documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos'
);

-- Permitir SELECT para usuarios autenticados
CREATE POLICY "Authenticated users can view documentos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos'
);

-- Permitir UPDATE para usuarios autenticados
CREATE POLICY "Authenticated users can update documentos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documentos'
)
WITH CHECK (
  bucket_id = 'documentos'
);

-- Permitir DELETE para usuarios autenticados
CREATE POLICY "Authenticated users can delete documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos'
);

