# 👤 Crear Usuario de Prueba - Paso a Paso

## 🔍 Verificar Usuarios Existentes

1. Ve a Supabase > **Table Editor** > **usuarios**
2. ¿Ves solo el usuario `admin`?
3. Si es así, vamos a crear el usuario `prueba`

## ✅ Método 1: SQL Editor (MÁS CONFIABLE)

1. Ve a Supabase > **SQL Editor**
2. Haz clic en **"+ New query"**
3. Copia y pega este SQL:

```sql
INSERT INTO usuarios (username, password_hash) 
VALUES (
  'prueba',
  '$2b$10$eag8RvgJseurnpsKuQviAOjMMh6O.V9Zg7tKZMXyPb3w5osGEZvoq'
);
```

4. Haz clic en **"Run"**
5. Deberías ver un mensaje de éxito
6. Ve a **Table Editor** > **usuarios** y verifica que apareció

## ✅ Método 2: Table Editor

1. Ve a Supabase > **Table Editor** > **usuarios**
2. Haz clic en **"Insert row"** o el botón **"+"** (arriba a la derecha)
3. En el formulario que aparece:
   - **username**: Escribe `prueba`
   - **password_hash**: Pega este hash completo:
     ```
     $2b$10$eag8RvgJseurnpsKuQviAOjMMh6O.V9Zg7tKZMXyPb3w5osGEZvoq
     ```
4. **NO modifiques** los otros campos (id, created_at, updated_at)
5. Haz clic en **"Save"** o **"Insert"**

## 🔍 Verificar

Después de crear el usuario:

1. Ve a **Table Editor** > **usuarios**
2. Deberías ver DOS usuarios:
   - `admin`
   - `prueba`
3. Si solo ves uno, intenta refrescar la página (F5)

## 🧪 Probar Login

1. Abre tu aplicación
2. Haz logout si estás logueado
3. Intenta hacer login con:
   - Usuario: `prueba`
   - Contraseña: `prueba123`

## ⚠️ Si No Aparece el Usuario

1. Verifica que ejecutaste el SQL correctamente
2. Revisa si hay algún error en el SQL Editor
3. Intenta refrescar la página de Table Editor
4. Verifica que el hash esté completo (debe empezar con `$2b$10$`)

## 📝 Credenciales del Usuario de Prueba

- **Usuario:** `prueba`
- **Contraseña:** `prueba123`
- **Hash:** `$2b$10$eag8RvgJseurnpsKuQviAOjMMh6O.V9Zg7tKZMXyPb3w5osGEZvoq`

