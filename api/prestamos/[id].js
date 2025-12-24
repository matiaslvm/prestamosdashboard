const { dbGet, dbRun } = require('../db');
const { calcularMontoTotal, determinarEstado } = require('../utils');

// GET /api/prestamos/:id, PUT /api/prestamos/:id, DELETE /api/prestamos/:id
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
      // Obtener un préstamo
      const prestamo = await dbGet(`
        SELECT 
          p.*,
          c.nombre || ' ' || c.apellido as cliente_nombre,
          c.telefono as cliente_telefono
        FROM prestamos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = ?
      `, [id]);
      
      if (!prestamo) {
        return res.status(404).json({ error: 'Préstamo no encontrado' });
      }
      return res.status(200).json(prestamo);
    }

    if (req.method === 'PUT') {
      // Actualizar préstamo
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { fecha_prestamo, fecha_vencimiento, monto_prestado, porcentaje_interes, estado } = body;
      
      const prestamoActual = await dbGet('SELECT * FROM prestamos WHERE id = ?', [id]);
      if (!prestamoActual) {
        return res.status(404).json({ error: 'Préstamo no encontrado' });
      }

      // Usar valores actuales si no se proporcionan nuevos
      const fechaPrestamo = fecha_prestamo || prestamoActual.fecha_prestamo;
      const fechaVencimiento = fecha_vencimiento || prestamoActual.fecha_vencimiento;
      const montoPrestado = monto_prestado || prestamoActual.monto_prestado;
      const porcentaje = porcentaje_interes !== undefined ? porcentaje_interes : prestamoActual.porcentaje_interes;
      const estadoFinal = estado || determinarEstado(fechaVencimiento, prestamoActual.estado);

      // Recalcular monto total
      const montoTotal = calcularMontoTotal(montoPrestado, porcentaje);

      await dbRun(
        `UPDATE prestamos 
         SET fecha_prestamo = ?, fecha_vencimiento = ?, monto_prestado = ?, 
             porcentaje_interes = ?, monto_total = ?, estado = ?
         WHERE id = ?`,
        [fechaPrestamo, fechaVencimiento, montoPrestado, porcentaje, montoTotal, estadoFinal, id]
      );

      const prestamo = await dbGet(`
        SELECT 
          p.*,
          c.nombre || ' ' || c.apellido as cliente_nombre,
          c.telefono as cliente_telefono
        FROM prestamos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = ?
      `, [id]);

      return res.status(200).json(prestamo);
    }

    if (req.method === 'DELETE') {
      // Eliminar préstamo
      const result = await dbRun('DELETE FROM prestamos WHERE id = ?', [id]);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Préstamo no encontrado' });
      }
      return res.status(200).json({ message: 'Préstamo eliminado correctamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/prestamos/[id]:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

