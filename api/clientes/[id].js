const { dbGet, dbRun, dbAll } = require('../db');

// GET /api/clientes/:id, PUT /api/clientes/:id, DELETE /api/clientes/:id
async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Obtener un cliente
      const cliente = await dbGet('SELECT * FROM clientes WHERE id = ?', [id]);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      return res.status(200).json(cliente);
    }

    if (req.method === 'PUT') {
      // Actualizar cliente
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { nombre, apellido, telefono, observaciones } = body;
      
      if (!nombre || !apellido || !telefono) {
        return res.status(400).json({ error: 'Nombre, apellido y teléfono son requeridos' });
      }

      await dbRun(
        'UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, observaciones = ? WHERE id = ?',
        [nombre, apellido, telefono, observaciones || '', id]
      );

      const cliente = await dbGet('SELECT * FROM clientes WHERE id = ?', [id]);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      return res.status(200).json(cliente);
    }

    if (req.method === 'DELETE') {
      // Eliminar cliente
      const prestamos = await dbAll('SELECT id FROM prestamos WHERE cliente_id = ?', [id]);
      if (prestamos.length > 0) {
        return res.status(400).json({ 
          error: 'No se puede eliminar el cliente porque tiene préstamos asociados' 
        });
      }

      const result = await dbRun('DELETE FROM clientes WHERE id = ?', [id]);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      return res.status(200).json({ message: 'Cliente eliminado correctamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/clientes/[id]:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

