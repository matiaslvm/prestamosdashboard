# 📖 Guía Paso a Paso - Configuración de Supabase

Esta guía te llevará paso a paso para configurar Supabase y tener tu aplicación funcionando.

## ✅ Paso 1: Acceder a tu Proyecto en Supabase

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (o créalo si aún no lo tienes)

**¿Dónde estás?** Estás en el dashboard principal de Supabase.

---

## 📝 Paso 2: Crear las Tablas (SQL Editor)

### 2.1. Abrir el SQL Editor

1. En el menú lateral izquierdo, busca y haz clic en **"SQL Editor"** (ícono de terminal/código)
2. Verás una pantalla con un editor de código SQL

### 2.2. Crear una Nueva Query

1. Haz clic en el botón **"+ New query"** (arriba a la izquierda)
2. Se abrirá un editor vacío

### 2.3. Copiar el Script SQL

1. Abre el archivo `supabase/schema.sql` de este proyecto
2. **Copia TODO el contenido** del archivo (Ctrl+C / Cmd+C)
3. Pégalo en el editor de Supabase (Ctrl+V / Cmd+V)

### 2.4. Ejecutar el Script

1. Haz clic en el botón **"Run"** (arriba a la derecha, o presiona Ctrl+Enter)
2. Espera unos segundos
3. Deberías ver un mensaje de éxito: **"Success. No rows returned"** o similar

### 2.5. Verificar que Funcionó

1. En el menú lateral, haz clic en **"Table Editor"**
2. Deberías ver dos tablas:
   - ✅ `clientes`
   - ✅ `prestamos`

**¡Perfecto! Las tablas están creadas.** 🎉

---

## 🔑 Paso 3: Obtener tus Credenciales

### 3.1. Ir a Settings

1. En el menú lateral izquierdo, busca y haz clic en **"Settings"** (ícono de engranaje ⚙️)
2. Se abrirá un submenú

### 3.2. Ir a API

1. Dentro de Settings, haz clic en **"API"**
2. Verás una página con información de tu proyecto

### 3.3. Copiar las Credenciales

Necesitas copiar **DOS valores**:

#### A) Project URL
- Busca la sección **"Project URL"**
- Verás algo como: `https://xxxxxxxxxxxxx.supabase.co`
- Haz clic en el ícono de copiar 📋 o selecciona y copia
- **Guárdalo en un lugar seguro** (lo necesitarás después)

#### B) service_role key (IMPORTANTE)
- Busca la sección **"Project API keys"**
- Verás dos keys:
  - `anon` `public` - ❌ NO uses esta
  - `service_role` `secret` - ✅ **USA ESTA**
- Haz clic en el ícono de "eye" 👁️ para ver la key completa
- Haz clic en el ícono de copiar 📋
- **Guárdalo en un lugar seguro** (es secreta, no la compartas)

**⚠️ IMPORTANTE:** La `service_role` key es secreta y tiene permisos completos. Solo úsala en el backend (Vercel), nunca en el frontend.

---

## 🌐 Paso 4: Configurar Vercel

### 4.1. Ir a tu Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión
3. Selecciona tu proyecto (o conéctalo desde GitHub si aún no lo has hecho)

### 4.2. Abrir Settings

1. En tu proyecto, haz clic en la pestaña **"Settings"** (arriba)
2. En el menú lateral izquierdo, busca y haz clic en **"Environment Variables"**

### 4.3. Agregar Variables de Entorno

Necesitas agregar **DOS variables**:

#### Variable 1: SUPABASE_URL
1. Haz clic en **"+ Add New"**
2. En **"Key"**, escribe: `SUPABASE_URL`
3. En **"Value"**, pega tu Project URL (la que copiaste en el Paso 3.3.A)
4. Selecciona los ambientes: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **"Save"**

#### Variable 2: SUPABASE_SERVICE_ROLE_KEY
1. Haz clic en **"+ Add New"** otra vez
2. En **"Key"**, escribe: `SUPABASE_SERVICE_ROLE_KEY`
3. En **"Value"**, pega tu service_role key (la que copiaste en el Paso 3.3.B)
4. Selecciona los ambientes: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **"Save"**

### 4.4. Verificar

Deberías ver algo así:
```
SUPABASE_URL                    https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY       eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**¡Perfecto! Las variables están configuradas.** 🎉

---

## 🚀 Paso 5: Deploy (si aún no lo has hecho)

### 5.1. Si ya tienes el código en GitHub

1. Vercel detectará automáticamente los cambios
2. Hará un nuevo deploy automáticamente
3. O puedes hacer clic en **"Redeploy"** en el último deployment

### 5.2. Si necesitas hacer deploy por primera vez

1. En Vercel, haz clic en **"Deployments"**
2. Si no hay deployments, conecta tu repositorio de GitHub
3. Vercel hará el build y deploy automáticamente

---

## ✅ Paso 6: Verificar que Todo Funciona

### 6.1. Abrir tu Aplicación

1. Ve a tu proyecto en Vercel
2. Haz clic en el dominio (ej: `tu-proyecto.vercel.app`)
3. Se abrirá tu aplicación

### 6.2. Probar la Aplicación

1. **Crear un Cliente:**
   - Haz clic en "Clientes" en el menú
   - Haz clic en "➕ Nuevo Cliente"
   - Completa el formulario y guarda

2. **Verificar en Supabase:**
   - Vuelve a Supabase
   - Ve a **"Table Editor"**
   - Haz clic en la tabla **"clientes"**
   - Deberías ver el cliente que acabas de crear ✅

3. **Crear un Préstamo:**
   - En tu app, ve a "Préstamos"
   - Haz clic en "➕ Nuevo Préstamo"
   - Selecciona el cliente que creaste
   - Completa el formulario y guarda

4. **Verificar el Dashboard:**
   - Ve al Dashboard en tu app
   - Deberías ver las estadísticas actualizadas

**¡Si todo esto funciona, estás listo!** 🎉🎉🎉

---

## 🐛 Solución de Problemas

### Error: "Faltan las credenciales de Supabase"
**Solución:**
- Verifica que las variables de entorno estén en Vercel
- Asegúrate de haber hecho "Save" después de agregarlas
- Haz un nuevo deploy después de agregar las variables

### Error: "relation does not exist"
**Solución:**
- Vuelve al Paso 2 y ejecuta el script SQL nuevamente
- Verifica en "Table Editor" que las tablas existen

### Los datos no se guardan
**Solución:**
- Verifica que usaste `SUPABASE_SERVICE_ROLE_KEY` (no anon key)
- Revisa los logs en Vercel > Deployments > [tu deploy] > Functions
- Verifica que RLS (Row Level Security) esté configurado correctamente

### No veo las tablas en Table Editor
**Solución:**
- Verifica que ejecutaste el script SQL correctamente
- Revisa si hay errores en el SQL Editor
- Intenta ejecutar el script nuevamente

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa los logs en Vercel (Deployments > Functions)
2. Revisa los logs en Supabase (Logs en el menú lateral)
3. Verifica que copiaste correctamente las credenciales

---

## ✅ Checklist Final

Marca cada paso cuando lo completes:

- [ ] ✅ Creé las tablas en Supabase (SQL Editor)
- [ ] ✅ Verifiqué que las tablas existen (Table Editor)
- [ ] ✅ Copié mi Project URL
- [ ] ✅ Copié mi service_role key
- [ ] ✅ Agregué SUPABASE_URL en Vercel
- [ ] ✅ Agregué SUPABASE_SERVICE_ROLE_KEY en Vercel
- [ ] ✅ Hice deploy en Vercel
- [ ] ✅ Probé crear un cliente
- [ ] ✅ Probé crear un préstamo
- [ ] ✅ Verifiqué que los datos se guardan en Supabase

**Si todos están marcados, ¡estás listo para usar tu aplicación!** 🚀

