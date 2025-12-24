# 📋 Cómo Ver los Logs de Build en Vercel

## 🔍 Dónde Están los Errores de Build

Los errores de build NO están en la pestaña "Logs" (esos son runtime logs).

### Pasos para Ver los Logs de Build:

1. **Ve a la pestaña "Deployment"** (no "Logs")
   - En el menú superior, haz clic en **"Deployment"**

2. **Selecciona el deployment que falló**
   - Deberías ver una lista de deployments
   - Busca el que tiene un ícono rojo ❌ o "Failed"
   - Haz clic en él

3. **Ver los Build Logs**
   - Dentro del deployment, verás varias pestañas
   - Busca **"Build Logs"** o **"Build"**
   - Ahí estarán los errores de compilación

## 📊 Diferencia Entre los Logs

- **"Logs" (Runtime Logs):** Muestran lo que pasa cuando la app está corriendo (después del build)
- **"Build Logs":** Muestran errores durante la compilación (npm install, build, etc.)

## 🎯 Si el Build Fue Exitoso

Si el deployment tiene un ✅ verde, entonces:
1. El build fue exitoso
2. El problema podría ser en runtime (cuando la app corre)
3. Revisa los Runtime Logs para ver errores de ejecución

## 🔄 Si Necesitas Ver el Último Build

1. Ve a **Deployments**
2. El más reciente está arriba
3. Haz clic en él
4. Ve a **"Build Logs"** o busca la sección de build

## 💡 Tip

Si no ves errores en Build Logs pero la app no funciona:
- Revisa las **Variables de Entorno** en Settings
- Verifica que las funciones API estén correctamente configuradas
- Revisa los Runtime Logs para errores de ejecución

