# 🗄️ Configuración de Supabase

Esta guía te ayudará a configurar Supabase como base de datos para la aplicación de préstamos.

## 📋 Paso 1: Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita (más que suficiente para este proyecto)
3. Crea un nuevo proyecto
4. Anota tu **Project URL** y las **API Keys**

## 🔑 Paso 2: Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **service_role key** (la clave secreta, NO la anon key para el backend)

## 📝 Paso 3: Crear las tablas

1. En Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase/schema.sql` de este proyecto
3. Copia y pega todo el contenido en el SQL Editor
4. Haz clic en **Run** para ejecutar el script
5. Verifica que las tablas se crearon correctamente en **Table Editor**

## ⚙️ Paso 4: Configurar variables de entorno en Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** > **Environment Variables**
3. Agrega las siguientes variables:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

**⚠️ IMPORTANTE:** Usa `SUPABASE_SERVICE_ROLE_KEY` (no la anon key) porque necesitamos permisos completos para el backend.

## 🚀 Paso 5: Deploy

1. Haz commit y push de los cambios
2. Vercel hará el deploy automáticamente
3. ¡Listo! Tu aplicación ahora usa Supabase

## ✅ Verificación

Después del deploy:

1. Abre tu aplicación en Vercel
2. Crea un cliente
3. Crea un préstamo
4. Verifica en Supabase > Table Editor que los datos se guardaron

## 🔒 Seguridad (Opcional pero Recomendado)

Para producción, considera:

1. **Row Level Security (RLS):** Ya está habilitado en el schema
2. **Políticas más restrictivas:** Ajusta las políticas según tus necesidades
3. **API Keys:** Nunca expongas el `service_role` key en el frontend

## 📊 Plan Gratuito de Supabase

El plan gratuito incluye:
- ✅ 500 MB de base de datos
- ✅ 2 GB de ancho de banda
- ✅ 50,000 usuarios activos mensuales
- ✅ Más que suficiente para este proyecto

## 🐛 Solución de Problemas

### Error: "Faltan las credenciales de Supabase"
- Verifica que las variables de entorno estén configuradas en Vercel
- Asegúrate de usar `SUPABASE_SERVICE_ROLE_KEY` (no anon key)

### Error: "relation does not exist"
- Ejecuta el script SQL en Supabase SQL Editor
- Verifica que las tablas se crearon correctamente

### Error de permisos
- Verifica que RLS esté configurado correctamente
- Asegúrate de usar el `service_role` key (no anon key)

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)

