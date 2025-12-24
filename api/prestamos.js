const { dbAll, dbGet, dbRun } = require('./db');
const { calcularMontoTotal, determinarEstado } = require('./utils');

// GET /api/prestamos, POST /api/prestamos
async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Listar todos los préstamos
      const prestamos = await dbAll(`
        SELECT 
          p.*,
          c.nombre || ' ' || c.apellido as cliente_nombre,
          c.telefono as cliente_telefono
        FROM prestamos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        ORDER BY p.fecha_prestamo DESC
      `);
      
      // Actualizar estados basados en fechas
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const en7Dias = new Date();
      en7Dias.setDate(en7Dias.getDate() + 7);
      en7Dias.setHours(0, 0, 0, 0);

      const prestamosActualizados = prestamos.map(p => {
        const estado = determinarEstado(p.fecha_vencimiento, p.estado);
        const fechaVenc = new Date(p.fecha_vencimiento);
        fechaVenc.setHours(0, 0, 0, 0);
        
        let colorEstado = 'pendiente';
        if (estado === 'Pagado') {
          colorEstado = 'pagado';
        } else if (estado === 'Vencido') {
          colorEstado = 'vencido';
        } else if (fechaVenc <= en7Dias && fechaVenc >= hoy) {
          colorEstado = 'por-vencer';
        }

        return { ...p, estado, colorEstado };
      });

      return res.status(200).json(prestamosActualizados);
    }

    if (req.method === 'POST') {
      // Crear préstamo
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { cliente_id, fecha_prestamo, fecha_vencimiento, monto_prestado, porcentaje_interes } = body;
      
      if (!cliente_id || !fecha_prestamo || !monto_prestado) {
        return res.status(400).json({ error: 'Cliente, fecha de préstamo y monto son requeridos' });
      }

      // Verificar que el cliente existe
      const cliente = await dbGet('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      // Calcular fecha de vencimiento por defecto si no se proporciona
      let fechaVencimiento = fecha_vencimiento;
      if (!fechaVencimiento) {
        const fechaPrestamo = new Date(fecha_prestamo);
        fechaPrestamo.setMonth(fechaPrestamo.getMonth() + 1);
        fechaVencimiento = fechaPrestamo.toISOString().split('T')[0];
      }

      // Calcular monto total
      const porcentaje = porcentaje_interes || 60;
      const montoTotal = calcularMontoTotal(monto_prestado, porcentaje);
      const estado = determinarEstado(fechaVencimiento, 'Pendiente');

      const result = await dbRun(
        `INSERT INTO prestamos 
         (cliente_id, fecha_prestamo, fecha_vencimiento, monto_prestado, porcentaje_interes, monto_total, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cliente_id, fecha_prestamo, fechaVencimiento, monto_prestado, porcentaje, montoTotal, estado]
      );

      const prestamo = await dbGet(`
        SELECT 
          p.*,
          c.nombre || ' ' || c.apellido as cliente_nombre,
          c.telefono as cliente_telefono
        FROM prestamos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = ?
      `, [result.id]);

      return res.status(201).json(prestamo);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/prestamos:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

