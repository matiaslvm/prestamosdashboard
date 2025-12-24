# 🐛 Debug del Login

## Verificar que el Usuario Existe en Supabase

1. Ve a Supabase > **Table Editor** > **usuarios**
2. Verifica que existe un usuario con:
   - `username`: `admin`
   - `password_hash`: Debe empezar con `$2b$10$...`

## Verificar el Hash de la Contraseña

El hash correcto para `admin123` debería ser:
```
$2b$10$8ivtdTV7ptAU2gOAMCM.0eoUoj6u9uB2ZpuKmTPHqfqv7.Zl5aJ3a
```

Si el hash es diferente, necesitas actualizarlo.

## Ver Logs de Runtime en Vercel

1. Ve a Vercel Dashboard > Tu Proyecto
2. Ve a la pestaña **"Logs"** (Runtime Logs, no Build Logs)
3. Intenta hacer login
4. Deberías ver logs que dicen:
   - "Login attempt: ..."
   - "Comparando contraseña para usuario: ..."
   - "Password match: true/false"

## Si el Usuario No Existe

Ejecuta este SQL en Supabase:

```sql
INSERT INTO usuarios (username, password_hash) 
VALUES (
  'admin',
  '$2b$10$8ivtdTV7ptAU2gOAMCM.0eoUoj6u9uB2ZpuKmTPHqfqv7.Zl5aJ3a'
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = '$2b$10$8ivtdTV7ptAU2gOAMCM.0eoUoj6u9uB2ZpuKmTPHqfqv7.Zl5aJ3a';
```

Esto creará o actualizará el usuario con el hash correcto.

## Verificar Variables de Entorno

En Vercel > Settings > Environment Variables, verifica:
- ✅ `SUPABASE_URL` está configurada
- ✅ `SUPABASE_SERVICE_ROLE_KEY` está configurada (NO la anon key)
- ✅ `JWT_SECRET` está configurada

## Probar Localmente

Si quieres probar localmente primero:

1. Crea un archivo `.env.local` en la raíz:
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
JWT_SECRET=tu-secreto
```

2. Ejecuta el backend localmente y prueba el login

