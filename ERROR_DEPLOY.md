# 🐛 Solución de Errores de Deploy en Vercel

## Error Común: Build Falla

Si el build falla, verifica lo siguiente:

### 1. Verificar Variables de Entorno

Asegúrate de tener configuradas en Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

### 2. Verificar Logs Completos

En Vercel Dashboard:
1. Ve a **Deployments**
2. Haz clic en el deployment que falló
3. Revisa los **Build Logs** completos
4. Busca el error específico (no solo los warnings)

### 3. Errores Comunes y Soluciones

#### Error: "Cannot find module '@supabase/supabase-js'"
**Solución:** Las dependencias del package.json raíz deben estar instaladas. El `vercel.json` ya está configurado para instalar ambas.

#### Error: "Module not found" en funciones API
**Solución:** Verifica que las funciones en `/api` usen `require()` correctamente y que las dependencias estén en el `package.json` raíz.

#### Error: Build timeout
**Solución:** El build puede tardar. Si excede 5 minutos, verifica que no haya loops infinitos o procesos muy pesados.

#### Error: "Function Runtimes must have a valid version"
**Solución:** Ya está resuelto. El `vercel.json` está simplificado.

### 4. Probar Localmente Primero

Antes de hacer push, prueba localmente:

```bash
# Instalar dependencias
npm install
cd frontend && npm install

# Build local
cd frontend && npm run build

# Si funciona localmente, debería funcionar en Vercel
```

### 5. Limpiar y Re-deploy

Si persisten problemas:

1. En Vercel, ve a **Settings** > **General**
2. Haz clic en **Clear Build Cache**
3. Haz un nuevo deploy

### 6. Verificar Estructura de Archivos

Asegúrate de que:
- ✅ `package.json` raíz tiene las dependencias necesarias
- ✅ `frontend/package.json` tiene las dependencias de React
- ✅ `api/` contiene todas las funciones serverless
- ✅ `vercel.json` está en la raíz

## 📋 Checklist de Verificación

Antes de hacer push:

- [ ] Variables de entorno configuradas en Vercel
- [ ] `npm install` funciona localmente sin errores
- [ ] `npm run build` en frontend funciona localmente
- [ ] No hay errores de sintaxis en los archivos
- [ ] Las funciones API tienen los `require()` correctos

## 🔍 Cómo Ver el Error Completo

El mensaje que compartiste parece estar cortado. Para ver el error completo:

1. Ve a Vercel Dashboard
2. **Deployments** > [tu deployment fallido]
3. Haz clic en **View Build Logs**
4. Busca líneas que digan "Error:" o "Failed:"
5. Copia el error completo

## 💡 Si el Error Persiste

Comparte:
1. El error completo de los Build Logs (no solo los warnings)
2. Qué commit específico estás deployando
3. Si funciona localmente o no

Los warnings de "deprecated" son normales y no causan fallos del build.

