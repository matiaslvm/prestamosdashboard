// Módulo compartido para la base de datos usando Supabase
// Compatible con Vercel serverless functions

const { createClient } = require('@supabase/supabase-js');

let supabase = null;

function getSupabase() {
  if (supabase) {
    return supabase;
  }

  // Obtener credenciales de variables de entorno
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las credenciales de Supabase. Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en las variables de entorno de Vercel.');
  }

  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return supabase;
}

// Helper functions simplificadas usando Supabase directamente
async function dbGet(query, params = []) {
  const db = getSupabase();
  
  // Clientes por ID
  if (query.includes('clientes') && query.includes('WHERE id')) {
    const { data, error } = await db
      .from('clientes')
      .select('*')
      .eq('id', params[0])
      .single();
    if (error) throw error;
    return data;
  }

  // Préstamos por ID con JOIN
  if (query.includes('prestamos') && query.includes('clientes') && query.includes('WHERE p.id')) {
    const { data, error } = await db
      .from('prestamos')
      .select(`
        *,
        clientes (
          nombre,
          apellido,
          telefono
        )
      `)
      .eq('id', params[0])
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      cliente_nombre: data.clientes ? `${data.clientes.nombre} ${data.clientes.apellido}` : '',
      cliente_telefono: data.clientes?.telefono || ''
    };
  }

  // Cliente por ID (simple)
  if (query.includes('clientes WHERE id')) {
    const { data, error } = await db
      .from('clientes')
      .select('id')
      .eq('id', params[0])
      .single();
    if (error) throw error;
    return data;
  }

  // Queries agregadas
  if (query.includes('SUM') || query.includes('COUNT')) {
    return await handleAggregateQuery(db, query, params);
  }

  throw new Error(`Query no implementada: ${query}`);
}

async function dbAll(query, params = []) {
  const db = getSupabase();
  
  // Listar todos los clientes ordenados
  if (query.includes('SELECT * FROM clientes ORDER BY')) {
    const { data, error } = await db
      .from('clientes')
      .select('*')
      .order('apellido', { ascending: true })
      .order('nombre', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  // Listar préstamos con JOIN a clientes
  if (query.includes('prestamos') && query.includes('clientes') && query.includes('INNER JOIN')) {
    const { data, error } = await db
      .from('prestamos')
      .select(`
        *,
        clientes!prestamos_cliente_id_fkey (
          nombre,
          apellido,
          telefono
        )
      `)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) {
      // Si falla con foreign key, intentar sin especificar la relación
      const { data: data2, error: error2 } = await db
        .from('prestamos')
        .select(`
          *,
          clientes (
            nombre,
            apellido,
            telefono
          )
        `)
        .order('fecha_prestamo', { ascending: false });
      
      if (error2) throw error2;
      
      return (data2 || []).map(p => ({
        ...p,
        cliente_nombre: p.clientes ? `${p.clientes.nombre} ${p.clientes.apellido}` : '',
        cliente_telefono: p.clientes?.telefono || ''
      }));
    }
    
    return (data || []).map(p => ({
      ...p,
      cliente_nombre: p.clientes ? `${p.clientes.nombre} ${p.clientes.apellido}` : '',
      cliente_telefono: p.clientes?.telefono || ''
    }));
  }

  // Préstamos por cliente_id
  if (query.includes('prestamos') && query.includes('WHERE cliente_id')) {
    const { data, error } = await db
      .from('prestamos')
      .select('id')
      .eq('cliente_id', params[0]);
    if (error) throw error;
    return data || [];
  }

  throw new Error(`Query no implementada: ${query}`);
}

async function dbRun(query, params = []) {
  const db = getSupabase();
  
  // INSERT clientes
  if (query.includes('INSERT INTO clientes')) {
    const record = {
      nombre: params[0],
      apellido: params[1],
      telefono: params[2],
      observaciones: params[3] || null
    };
    
    const { data, error } = await db
      .from('clientes')
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    return { id: data.id, changes: 1 };
  }

  // INSERT préstamos
  if (query.includes('INSERT INTO prestamos')) {
    const record = {
      cliente_id: params[0],
      fecha_prestamo: params[1],
      fecha_vencimiento: params[2],
      monto_prestado: params[3],
      porcentaje_interes: params[4],
      monto_total: params[5],
      estado: params[6]
    };
    
    const { data, error } = await db
      .from('prestamos')
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    return { id: data.id, changes: 1 };
  }

  // UPDATE clientes
  if (query.includes('UPDATE clientes SET')) {
    const updates = {
      nombre: params[0],
      apellido: params[1],
      telefono: params[2],
      observaciones: params[3] || null
    };
    const id = params[4];
    
    const { data, error } = await db
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { id: data.id, changes: 1 };
  }

  // UPDATE préstamos
  if (query.includes('UPDATE prestamos SET')) {
    const updates = {
      fecha_prestamo: params[0],
      fecha_vencimiento: params[1],
      monto_prestado: params[2],
      porcentaje_interes: params[3],
      monto_total: params[4],
      estado: params[5]
    };
    const id = params[6];
    
    const { data, error } = await db
      .from('prestamos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { id: data.id, changes: 1 };
  }

  // DELETE clientes
  if (query.includes('DELETE FROM clientes')) {
    const { error } = await db
      .from('clientes')
      .delete()
      .eq('id', params[0]);
    
    if (error) throw error;
    return { id: null, changes: 1 };
  }

  // DELETE préstamos
  if (query.includes('DELETE FROM prestamos')) {
    const { error } = await db
      .from('prestamos')
      .delete()
      .eq('id', params[0]);
    
    if (error) throw error;
    return { id: null, changes: 1 };
  }

  throw new Error(`Query no implementada: ${query}`);
}

// Helper para queries agregadas
async function handleAggregateQuery(db, query, params) {
  // SUM de monto_prestado (total prestado)
  if (query.includes('SUM(monto_prestado)')) {
    const { data, error } = await db
      .from('prestamos')
      .select('monto_prestado');
    
    if (error) throw error;
    const sum = (data || []).reduce((acc, row) => acc + (parseFloat(row.monto_prestado) || 0), 0);
    return { total: sum };
  }

  // SUM de monto_total con WHERE estado
  if (query.includes('SUM(monto_total)') && query.includes('WHERE estado IN')) {
    const { data, error } = await db
      .from('prestamos')
      .select('monto_total, estado')
      .in('estado', ['Pendiente', 'Vencido']);
    
    if (error) throw error;
    const sum = (data || []).reduce((acc, row) => acc + (parseFloat(row.monto_total) || 0), 0);
    return { total: sum };
  }

  // COUNT por estado
  if (query.includes('COUNT(*)') && query.includes('WHERE estado')) {
    const estadoMatch = query.match(/estado\s*=\s*['"](.*?)['"]/);
    const estado = estadoMatch?.[1];
    
    if (estado) {
      const { count, error } = await db
        .from('prestamos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', estado);
      
      if (error) throw error;
      return { total: count || 0 };
    }
  }

  // COUNT préstamos por vencer (complejo, lo hacemos manualmente)
  if (query.includes('COUNT(*)') && query.includes('fecha_vencimiento')) {
    const { data, error } = await db
      .from('prestamos')
      .select('fecha_vencimiento, estado')
      .eq('estado', 'Pendiente');
    
    if (error) throw error;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const en7Dias = new Date();
    en7Dias.setDate(en7Dias.getDate() + 7);
    en7Dias.setHours(0, 0, 0, 0);
    
    const count = (data || []).filter(p => {
      const fechaVenc = new Date(p.fecha_vencimiento);
      fechaVenc.setHours(0, 0, 0, 0);
      return fechaVenc >= hoy && fechaVenc <= en7Dias;
    }).length;
    
    return { total: count };
  }

  throw new Error(`Aggregate query no implementada: ${query}`);
}

module.exports = { getSupabase, dbGet, dbAll, dbRun };
