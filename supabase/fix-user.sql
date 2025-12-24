-- Script para crear o actualizar el usuario admin con el hash correcto
-- Ejecuta este script en Supabase SQL Editor si el login no funciona

-- Eliminar usuario si existe (para recrearlo)
DELETE FROM usuarios WHERE username = 'admin';

-- Crear usuario con el hash bcrypt correcto para 'admin123'
INSERT INTO usuarios (username, password_hash) 
VALUES (
  'admin',
  '$2b$10$8ivtdTV7ptAU2gOAMCM.0eoUoj6u9uB2ZpuKmTPHqfqv7.Zl5aJ3a'
);

-- Verificar que se creó correctamente
SELECT id, username, created_at FROM usuarios WHERE username = 'admin';

