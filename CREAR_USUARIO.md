# 🔐 Crear Usuario - Guía Rápida

## ✅ Opción 1: Usar el Script SQL (MÁS FÁCIL)

El script `supabase/auth.sql` ya incluye un usuario por defecto con hash bcrypt real.

1. Ve a Supabase > **SQL Editor**
2. Ejecuta el script `supabase/auth.sql` completo
3. El usuario `admin` con contraseña `admin123` se creará automáticamente
4. ¡Listo! Ya puedes hacer login

## 🔧 Opción 2: Crear Manualmente en Supabase

Si prefieres crear el usuario manualmente:

1. Ve a Supabase > **Table Editor** > **usuarios**
2. Haz clic en **"Insert row"** o **"Insert"**
3. Completa:
   - **username**: `admin`
   - **password_hash**: `$2b$10$8ivtdTV7ptAU2gOAMCM.0eoUoj6u9uB2ZpuKmTPHqfqv7.Zl5aJ3a`
4. Haz clic en **"Save"**

## 📝 Credenciales por Defecto

**Usuario:** `admin`  
**Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia estas credenciales después del primer login en producción.

## 🔄 Opción 3: Usar el Script Node.js (si tienes variables de entorno)

Si tienes configuradas las variables de entorno `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`:

```bash
npm run create-user admin admin123
```

O con usuario y contraseña personalizados:

```bash
npm run create-user miusuario micontraseña
```

## ✅ Verificar que Funcionó

1. Ve a Supabase > **Table Editor** > **usuarios**
2. Deberías ver una fila con:
   - username: `admin`
   - password_hash: `$2b$10$8ivtdTV7ptAU2gOAMCM...`

## 🎯 Siguiente Paso

Después de crear el usuario:
1. Configura `JWT_SECRET` en Vercel
2. Haz deploy
3. Abre tu app y prueba el login con `admin` / `admin123`

