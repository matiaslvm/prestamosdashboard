# 🔐 Configuración del Sistema de Login

## 📋 Pasos para Configurar el Login

### 1. Crear la Tabla de Usuarios en Supabase

1. Ve a tu proyecto en Supabase
2. Abre **SQL Editor**
3. Ejecuta el script `supabase/auth.sql`
4. Verifica que la tabla `usuarios` se creó correctamente

### 2. Crear Usuario Inicial

Tienes dos opciones:

#### Opción A: Usando el Script (Recomendado)

```bash
# Desde la raíz del proyecto
npm install  # Instalar dependencias (bcrypt, jsonwebtoken)

# Configurar variables de entorno localmente (opcional)
export SUPABASE_URL=https://tu-proyecto.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Crear usuario
npm run create-user admin admin123
```

#### Opción B: Manualmente en Supabase

1. Ve a Supabase > **Table Editor** > **usuarios**
2. Haz clic en **"Insert row"**
3. Completa:
   - `username`: admin
   - `password_hash`: Necesitas generar un hash bcrypt de tu contraseña
4. Para generar el hash, puedes usar:
   ```javascript
   const bcrypt = require('bcrypt');
   bcrypt.hash('admin123', 10).then(hash => console.log(hash));
   ```

### 3. Configurar Variable de Entorno en Vercel

1. Ve a Vercel > Tu Proyecto > **Settings** > **Environment Variables**
2. Agrega:
   ```
   Key: JWT_SECRET
   Value: [genera una clave secreta aleatoria y segura]
   ```
   Puedes generar una clave secreta con:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 4. Credenciales por Defecto

**Usuario:** `admin`  
**Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia estas credenciales después del primer login en producción.

## 🔒 Cómo Funciona

1. **Login:** El usuario ingresa usuario y contraseña
2. **Verificación:** El backend verifica las credenciales contra Supabase
3. **Token:** Si es correcto, se genera un JWT token
4. **Almacenamiento:** El token se guarda en localStorage
5. **Protección:** Todas las peticiones API incluyen el token en el header
6. **Verificación:** El backend verifica el token en cada petición

## 🛡️ Rutas Protegidas

Todas las rutas excepto `/login` están protegidas:
- `/` (Dashboard)
- `/clientes`
- `/prestamos`

Si no estás autenticado, serás redirigido a `/login`.

## 📝 Crear Nuevos Usuarios

Para crear nuevos usuarios, puedes:

1. Usar el script:
   ```bash
   npm run create-user nombreusuario contraseña
   ```

2. O hacerlo directamente en Supabase Table Editor (necesitarás generar el hash de la contraseña)

## 🔄 Cambiar Contraseña

Por ahora, para cambiar una contraseña:

1. Ve a Supabase > Table Editor > usuarios
2. Edita el usuario
3. Genera un nuevo hash de la nueva contraseña
4. Actualiza el campo `password_hash`

## ✅ Verificación

Después de configurar:

1. Haz deploy en Vercel
2. Abre tu aplicación
3. Deberías ver la pantalla de login
4. Ingresa: `admin` / `admin123`
5. Deberías acceder al dashboard

## 🐛 Solución de Problemas

### "Usuario o contraseña incorrectos"
- Verifica que el usuario existe en Supabase
- Verifica que el hash de la contraseña es correcto
- Revisa los logs en Vercel Functions

### "Token inválido"
- Verifica que `JWT_SECRET` está configurado en Vercel
- Limpia localStorage y vuelve a iniciar sesión

### No puedo acceder a las rutas
- Verifica que estás logueado
- Revisa la consola del navegador para errores
- Verifica que el token se está enviando en los headers

