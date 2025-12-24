# ⚡ Pasos Rápidos - Resumen Visual

## 🎯 Objetivo
Configurar Supabase para que tu aplicación guarde datos persistentes.

---

## 📍 Dónde Estar y Qué Hacer

### 1️⃣ En Supabase: Crear Tablas

**Dónde:** [app.supabase.com](https://app.supabase.com) → Tu Proyecto

**Qué hacer:**
```
1. Menú lateral → "SQL Editor"
2. Click "+ New query"
3. Copiar TODO el contenido de: supabase/schema.sql
4. Pegar en el editor
5. Click "Run" (o Ctrl+Enter)
6. ✅ Deberías ver "Success"
```

**Verificar:**
```
Menú lateral → "Table Editor"
✅ Deberías ver: clientes y prestamos
```

---

### 2️⃣ En Supabase: Obtener Credenciales

**Dónde:** [app.supabase.com](https://app.supabase.com) → Tu Proyecto

**Qué hacer:**
```
1. Menú lateral → "Settings" → "API"
2. Copiar "Project URL" (ej: https://xxxxx.supabase.co)
3. Copiar "service_role" key (la secreta, NO la anon)
   👁️ Click en el ojo para verla completa
```

**Guarda estos dos valores en un lugar seguro** 📝

---

### 3️⃣ En Vercel: Configurar Variables

**Dónde:** [vercel.com](https://vercel.com) → Tu Proyecto

**Qué hacer:**
```
1. Pestaña "Settings" → "Environment Variables"
2. Click "+ Add New"
   
   Variable 1:
   Key: SUPABASE_URL
   Value: [pega tu Project URL]
   ✅ Marca: Production, Preview, Development
   Click "Save"

   Variable 2:
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: [pega tu service_role key]
   ✅ Marca: Production, Preview, Development
   Click "Save"
```

**Verificar:**
```
Deberías ver 2 variables guardadas:
✅ SUPABASE_URL
✅ SUPABASE_SERVICE_ROLE_KEY
```

---

### 4️⃣ En Vercel: Deploy

**Dónde:** [vercel.com](https://vercel.com) → Tu Proyecto

**Qué hacer:**
```
Si ya tienes código en GitHub:
→ Vercel hará deploy automático

Si no:
→ Conecta tu repositorio de GitHub
→ Vercel hará deploy automático
```

---

### 5️⃣ Probar

**Dónde:** Tu aplicación en Vercel

**Qué hacer:**
```
1. Abre tu app (ej: tu-proyecto.vercel.app)
2. Click "Clientes" → "➕ Nuevo Cliente"
3. Completa y guarda
4. Vuelve a Supabase → "Table Editor" → "clientes"
5. ✅ Deberías ver el cliente que creaste
```

---

## 🎉 ¡Listo!

Si puedes crear clientes y préstamos, y verlos en Supabase, **todo está funcionando correctamente**.

---

## 📋 Checklist Rápido

- [ ] Tablas creadas en Supabase
- [ ] Credenciales copiadas
- [ ] Variables agregadas en Vercel
- [ ] Deploy hecho
- [ ] Probé crear un cliente
- [ ] Veo los datos en Supabase

---

## 🆘 Si Algo Falla

1. **"Faltan credenciales"** → Verifica variables en Vercel
2. **"relation does not exist"** → Ejecuta el SQL nuevamente
3. **Datos no se guardan** → Verifica que usaste service_role key (no anon)

Ver [GUIA_PASO_A_PASO.md](./GUIA_PASO_A_PASO.md) para más detalles.

