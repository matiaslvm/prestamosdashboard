-- Script SQL para crear usuario de prueba
-- Ejecuta este script en Supabase SQL Editor

-- Crear usuario de prueba
INSERT INTO usuarios (username, password_hash) 
VALUES (
  'prueba',
  '$2b$10$eag8RvgJseurnpsKuQviAOjMMh6O.V9Zg7tKZMXyPb3w5osGEZvoq'
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = '$2b$10$eag8RvgJseurnpsKuQviAOjMMh6O.V9Zg7tKZMXyPb3w5osGEZvoq';

-- Verificar que se creó
SELECT id, username, created_at FROM usuarios ORDER BY created_at DESC;

