# Sistema de Gestión de Préstamos

Aplicación web simple para gestionar préstamos personales, clientes y vencimientos.

## 🚀 Características

- ✅ Gestión completa de clientes (crear, editar, eliminar)
- ✅ Registro de préstamos con cálculos automáticos
- ✅ Dashboard con métricas en tiempo real
- ✅ Diseño mobile-first y responsive
- ✅ Filtros y búsqueda
- ✅ Exportación a CSV

## 📦 Estructura del Proyecto

```
webprestamos/
├── api/              # Serverless functions para Vercel (usa Supabase)
├── backend/          # API Node.js + Express (para desarrollo local)
├── frontend/         # Aplicación React
├── supabase/         # Scripts SQL para Supabase
└── README.md
```

## 🗄️ Base de Datos

Esta aplicación usa **Supabase** (PostgreSQL) para almacenar los datos de forma persistente.

- ✅ Datos persistentes en la nube
- ✅ Plan gratuito generoso (500 MB)
- ✅ Fácil de configurar
- ✅ Perfecto para producción

Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para configuración detallada.

## 🛠️ Instalación y Uso

### Para Desarrollo Local

1. **Configura Supabase:**
   - Crea una cuenta en [supabase.com](https://supabase.com)
   - Ejecuta el script `supabase/schema.sql` en el SQL Editor
   - Obtén tus credenciales (URL y Service Role Key)

2. **Backend (opcional, para desarrollo local):**
   ```bash
   cd backend
   npm install
   # Configura las variables de entorno en .env
   npm start
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Para Producción (Vercel)

Ver [DEPLOY.md](./DEPLOY.md) y [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instrucciones completas.

## 📋 Modelos de Datos

### Cliente
- id (auto)
- nombre (string)
- apellido (string)
- telefono (string)
- observaciones (string, opcional)

### Préstamo
- id (auto)
- cliente_id (foreign key)
- fecha_prestamo (date)
- fecha_vencimiento (date)
- monto_prestado (decimal)
- porcentaje_interes (decimal, default: 60)
- monto_total (decimal, calculado)
- estado (string: 'Pendiente' | 'Pagado' | 'Vencido')

## 🔌 Endpoints API

### Clientes
- `GET /api/clientes` - Listar todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Préstamos
- `GET /api/prestamos` - Listar todos los préstamos
- `GET /api/prestamos/:id` - Obtener un préstamo
- `POST /api/prestamos` - Crear préstamo
- `PUT /api/prestamos/:id` - Actualizar préstamo
- `DELETE /api/prestamos/:id` - Eliminar préstamo
- `GET /api/prestamos/stats` - Obtener estadísticas del dashboard

## 💡 Cálculo de Intereses

El monto total a devolver se calcula automáticamente:

```
monto_total = monto_prestado + (monto_prestado * porcentaje_interes / 100)
```

## 🎨 Diseño

- Mobile-first approach
- Tarjetas (cards) para mejor organización visual
- Colores de estado:
  - 🟢 Verde: Pagado
  - 🟡 Amarillo: Por vencer (próximos 7 días)
  - 🔴 Rojo: Vencido

