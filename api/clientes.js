const { dbAll, dbGet, dbRun } = require('./db');

// GET /api/clientes
async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Listar todos los clientes
      const clientes = await dbAll('SELECT * FROM clientes ORDER BY apellido, nombre');
      return res.status(200).json(clientes);
    }

    if (req.method === 'POST') {
      // Crear cliente
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { nombre, apellido, telefono, observaciones } = body;
      
      if (!nombre || !apellido || !telefono) {
        return res.status(400).json({ error: 'Nombre, apellido y teléfono son requeridos' });
      }

      const result = await dbRun(
        'INSERT INTO clientes (nombre, apellido, telefono, observaciones) VALUES (?, ?, ?, ?)',
        [nombre, apellido, telefono, observaciones || '']
      );

      const cliente = await dbGet('SELECT * FROM clientes WHERE id = ?', [result.id]);
      return res.status(201).json(cliente);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/clientes:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

