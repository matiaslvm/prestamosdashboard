-- Script SQL para agregar autenticación simple
-- Ejecuta este script DESPUÉS de ejecutar schema.sql

-- Tabla de usuarios para login simple
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índice para búsquedas rápidas por username
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);

-- Trigger para actualizar updated_at (eliminar si existe primero)
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura (necesario para login)
-- Eliminar política si existe antes de crearla
DROP POLICY IF EXISTS "Allow select on usuarios" ON usuarios;
CREATE POLICY "Allow select on usuarios" ON usuarios
    FOR SELECT USING (true);

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

-- NOTA IMPORTANTE: 
-- Este hash es válido para la contraseña 'admin123'
-- En producción, cambia la contraseña después del primer login

