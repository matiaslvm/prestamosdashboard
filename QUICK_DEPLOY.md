# ⚡ Deploy Rápido en Vercel

## Pasos Rápidos

### 1. Prepara el código
```bash
# Asegúrate de estar en el directorio raíz
cd /Users/zoho/Desktop/WidgetsMati/webprestamos

# Instala dependencias del proyecto raíz (better-sqlite3)
npm install
```

### 2. Sube a GitHub (si aún no lo has hecho)
```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin <tu-repo-url>
git push -u origin main
```

### 3. Deploy en Vercel

**Opción A: Desde la Web (Más fácil)**
1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente la configuración
5. Click en "Deploy"

**Opción B: Desde CLI**
```bash
# Instala Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 4. ¡Listo! 🎉

Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`

## ⚠️ Nota Importante sobre la Base de Datos

SQLite en `/tmp` funciona pero **los datos se perderán** cuando:
- La función serverless tenga un "cold start"
- Vercel reinicie el servidor
- Pasen más de 24 horas sin actividad

**Para producción real**, considera migrar a:
- Vercel Postgres (recomendado)
- PlanetScale
- Supabase
- Turso

## 🔍 Verificar que Funciona

1. Abre tu URL de Vercel
2. Ve a la sección "Clientes" y crea uno
3. Ve a "Préstamos" y crea un préstamo
4. Verifica el Dashboard

## 🐛 Si algo falla

Revisa los logs en Vercel Dashboard > Deployments > [tu deploy] > Functions

