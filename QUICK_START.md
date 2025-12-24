# ⚡ Inicio Rápido con Supabase

## 🚀 Pasos para tener todo funcionando

### 1. Configura Supabase (5 minutos)

1. Ve a [supabase.com](https://supabase.com) y crea cuenta
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** en Supabase
4. Copia y pega el contenido de `supabase/schema.sql`
5. Ejecuta el script (botón Run)
6. Ve a **Settings** > **API** y copia:
   - **Project URL**
   - **service_role key** (la clave secreta)

### 2. Configura Vercel (2 minutos)

1. Si no tienes cuenta, créala en [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. En **Settings** > **Environment Variables**, agrega:
   ```
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

### 3. Deploy (automático)

1. Haz push a GitHub
2. Vercel deploya automáticamente
3. ¡Listo! Tu app está online 🎉

## ✅ Verificación

1. Abre tu app en Vercel
2. Crea un cliente
3. Crea un préstamo
4. Verifica en Supabase > Table Editor que los datos están ahí

## 💡 Ventajas de Supabase

- ✅ **Gratis:** 500 MB de base de datos (más que suficiente)
- ✅ **Persistente:** Los datos no se pierden
- ✅ **Rápido:** PostgreSQL optimizado
- ✅ **Fácil:** Dashboard visual para ver tus datos
- ✅ **Escalable:** Puedes crecer cuando lo necesites

## 🆚 Comparación

| Característica | SQLite (local) | Supabase |
|---------------|----------------|----------|
| Persistencia | ❌ Se pierde en cold starts | ✅ Persistente |
| Escalabilidad | ❌ Limitado | ✅ Escalable |
| Dashboard | ❌ No | ✅ Sí |
| Costo | ✅ Gratis | ✅ Gratis (plan básico) |
| Configuración | ✅ Simple | ✅ Simple |

**Conclusión:** Para producción, Supabase es la mejor opción. ✅

## 🐛 Problemas Comunes

### "Faltan las credenciales"
- Verifica que las variables de entorno estén en Vercel
- Usa `SUPABASE_SERVICE_ROLE_KEY` (no anon key)

### "relation does not exist"
- Ejecuta el script SQL en Supabase
- Verifica que las tablas se crearon

### Los datos no aparecen
- Verifica RLS (Row Level Security) en Supabase
- Asegúrate de usar service_role key

## 📚 Más Información

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Guía detallada
- [DEPLOY.md](./DEPLOY.md) - Guía de deployment completo

