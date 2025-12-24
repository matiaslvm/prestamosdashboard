# Guía de Instalación y Configuración

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (viene incluido con Node.js)

## 🚀 Instalación Paso a Paso

### 1. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 2. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 3. Ejecutar la aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

El servidor backend estará disponible en `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 📝 Notas Importantes

- La base de datos SQLite se creará automáticamente en `backend/prestamos.db` la primera vez que ejecutes el servidor
- El frontend está configurado para conectarse al backend en `http://localhost:3001` por defecto
- Si necesitas cambiar el puerto del backend, edita `PORT` en `backend/server.js` y actualiza la variable `API_URL` en los componentes del frontend

## 🔧 Desarrollo

Para desarrollo con recarga automática:

**Backend:**
```bash
cd backend
npm run dev
```

(Requiere instalar nodemon: `npm install -g nodemon` o usar `npx nodemon server.js`)

**Frontend:**
Ya tiene hot-reload por defecto con `npm start`

## 📦 Estructura de Archivos

```
webprestamos/
├── backend/
│   ├── server.js          # Servidor Express y rutas API
│   ├── package.json
│   └── prestamos.db       # Base de datos SQLite (se crea automáticamente)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── App.js         # Componente principal
│   │   └── index.js       # Punto de entrada
│   └── package.json
└── README.md
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Asegúrate de haber ejecutado `npm install` en ambas carpetas (backend y frontend)

### Error de conexión entre frontend y backend
- Verifica que el backend esté corriendo en el puerto 3001
- Revisa la consola del navegador para ver errores de CORS o conexión

### La base de datos no se crea
- Verifica que tengas permisos de escritura en la carpeta `backend/`
- Revisa los logs del servidor para ver errores específicos

## 🎯 Primeros Pasos

1. Ejecuta backend y frontend
2. Abre `http://localhost:3000` en tu navegador
3. Crea tu primer cliente desde la sección "Clientes"
4. Crea tu primer préstamo desde la sección "Préstamos"
5. Visualiza las estadísticas en el Dashboard

¡Listo para usar! 🎉

