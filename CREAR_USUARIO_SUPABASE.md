# 👤 Crear Usuario desde Supabase - Guía Rápida

## ✅ Opción 1: Desde Table Editor (MÁS FÁCIL)

1. Ve a Supabase > **Table Editor** > **usuarios**
2. Haz clic en **"Insert row"** o el botón **"+"**
3. Completa los campos:
   - **username**: `prueba` (o el nombre que quieras)
   - **password_hash**: `$2b$10$[pega el hash que generamos abajo]`
   - Los campos `id`, `created_at`, `updated_at` se llenan automáticamente
4. Haz clic en **"Save"** o **"Insert"**

## 🔐 Generar Hash de Contraseña

Para generar el hash de una contraseña, ejecuta:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tucontraseña', 10).then(hash => console.log(hash));"
```

### Ejemplo: Usuario "prueba" con contraseña "prueba123"

El hash generado es:
```
$2b$10$[se generará cuando ejecutes el comando]
```

## 📝 Ejemplo Completo

**Usuario de prueba:**
- Username: `prueba`
- Password: `prueba123`
- Hash: (ejecuta el comando de arriba para generarlo)

## ✅ Opción 2: Desde SQL Editor

1. Ve a Supabase > **SQL Editor**
2. Ejecuta este SQL (reemplaza el hash con el que generaste):

```sql
INSERT INTO usuarios (username, password_hash) 
VALUES (
  'prueba',
  '$2b$10$[pega el hash generado aquí]'
);
```

## 🔍 Verificar que Funcionó

1. Ve a **Table Editor** > **usuarios**
2. Deberías ver el nuevo usuario
3. Prueba hacer login con ese usuario y contraseña

## ⚠️ Importante

- El `password_hash` debe empezar con `$2b$10$`
- Usa el hash completo que genera bcrypt
- No uses la contraseña directamente en el campo `password_hash`

