-- Script para ejecutar SOLO si ya ejecutaste auth.sql antes
-- Este script solo crea el usuario sin recrear triggers ni políticas

-- Crear usuario por defecto (cambia la contraseña después del primer login)
-- Usuario: admin
-- Contraseña: admin123
-- Hash bcrypt generado para 'admin123' con 10 rounds
INSERT INTO usuarios (username, password_hash) 
VALUES (
  'admin',
  '$2b$10$8ivtdTV7ptAU2gOAMCM.0eoUoj6u9uB2ZpuKmTPHqfqv7.Zl5aJ3a'
)
ON CONFLICT (username) DO NOTHING;

-- Verificar que el usuario se creó
SELECT username, created_at FROM usuarios WHERE username = 'admin';

