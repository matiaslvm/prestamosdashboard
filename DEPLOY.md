# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a deployar la aplicación de gestión de préstamos en Vercel.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com) (gratuita)
2. Git instalado y repositorio configurado
3. Node.js 18+ instalado localmente

## 🔧 Configuración para Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <tu-repositorio-github>
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

3. **Variables de Entorno (Opcional):**
   - En la configuración del proyecto en Vercel
   - Ve a "Settings" > "Environment Variables"
   - Agrega si necesitas: `REACT_APP_API_URL` (normalmente no es necesario)

4. **Deploy:**
   - Vercel hará el deploy automáticamente
   - La aplicación estará disponible en `https://tu-proyecto.vercel.app`

### Opción 2: Deploy desde CLI

1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login en Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Sigue las instrucciones:**
   - Selecciona el proyecto
   - Confirma la configuración
   - Vercel hará el build y deploy

## 📁 Estructura para Vercel

La aplicación está configurada con:

- **Frontend:** Se build en `frontend/build` y se sirve como sitio estático
- **API:** Las funciones serverless están en `/api` y se ejecutan como serverless functions
- **Base de Datos:** SQLite usando `/tmp` en Vercel (persistente durante la ejecución)

## ⚙️ Configuración de Build

Vercel detectará automáticamente:
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/build`
- **Framework Preset:** React

## 🔍 Verificación Post-Deploy

Después del deploy, verifica:

1. ✅ El frontend carga correctamente
2. ✅ Las rutas `/api/*` funcionan
3. ✅ Puedes crear clientes y préstamos
4. ✅ El dashboard muestra estadísticas

## 🐛 Solución de Problemas

### Error: "Module not found"
- Verifica que `better-sqlite3` esté en `package.json` raíz
- Asegúrate de que todas las dependencias estén instaladas

### Error: "Database locked" o problemas con SQLite
- En Vercel, SQLite usa `/tmp` que es efímero
- Considera migrar a una base de datos persistente (PostgreSQL, MySQL) para producción

### Error: "CORS" en producción
- Las funciones API ya tienen CORS configurado
- Verifica que las rutas `/api/*` estén correctamente configuradas en `vercel.json`

### La base de datos se resetea
- SQLite en `/tmp` es efímero en Vercel
- Para producción, considera usar:
  - **Vercel Postgres** (recomendado)
  - **PlanetScale** (MySQL serverless)
  - **Supabase** (PostgreSQL)
  - **Turso** (SQLite distribuido)

## 🔄 Actualizar el Deploy

Cada vez que hagas `git push` a la rama principal, Vercel hará un nuevo deploy automáticamente.

Para deploy manual:
```bash
vercel --prod
```

## 📝 Notas Importantes

1. **Base de Datos:** SQLite en `/tmp` funciona pero es efímero. Para producción real, migra a una base de datos persistente.

2. **Límites de Vercel:**
   - Plan gratuito: 100GB bandwidth/mes
   - Serverless functions: 10 segundos timeout (hobby plan)
   - Base de datos en `/tmp` se resetea en cada cold start

3. **Mejores Prácticas:**
   - Usa variables de entorno para configuración sensible
   - Considera usar Vercel Postgres para producción
   - Implementa caching donde sea posible

## 🎯 Próximos Pasos

1. Deploy exitoso ✅
2. Configurar dominio personalizado (opcional)
3. Migrar a base de datos persistente (recomendado para producción)
4. Configurar monitoreo y logs

¡Tu aplicación está lista para producción! 🎉

