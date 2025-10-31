-- Migración: Hashear contraseñas existentes
-- IMPORTANTE: Ejecuta esto usando el endpoint /api/auth/hash-passwords
-- O ejecuta el script Node.js scripts/10-hash-passwords.js

-- Nota: Este script SQL no puede hashear directamente porque necesita bcryptjs
-- Usa el endpoint API o el script Node.js para hashear las contraseñas

-- Después de hashear, puedes eliminar este comentario

