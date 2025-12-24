const { dbGet } = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET /api/prestamos/stats
async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar autenticación
  const authResult = verifyToken(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: authResult.error });
  }

  try {
    if (req.method === 'GET') {
      // Total prestado
      const totalPrestado = await dbGet(`
        SELECT COALESCE(SUM(monto_prestado), 0) as total 
        FROM prestamos
      `);

      // Total a cobrar (solo préstamos pendientes o vencidos)
      const totalACobrar = await dbGet(`
        SELECT COALESCE(SUM(monto_total), 0) as total 
        FROM prestamos 
        WHERE estado IN ('Pendiente', 'Vencido')
      `);

      // Préstamos activos (pendientes)
      const activos = await dbGet(`
        SELECT COUNT(*) as total 
        FROM prestamos 
        WHERE estado = 'Pendiente'
      `);

      // Préstamos vencidos
      const vencidos = await dbGet(`
        SELECT COUNT(*) as total 
        FROM prestamos 
        WHERE estado = 'Vencido'
      `);

      // Préstamos por vencer en 7 días
      const porVencer = await dbGet(`
        SELECT COUNT(*) as total 
        FROM prestamos 
        WHERE estado = 'Pendiente' 
        AND fecha_vencimiento >= date('now') 
        AND fecha_vencimiento <= date('now', '+7 days')
      `);

      return res.status(200).json({
        totalPrestado: totalPrestado?.total || 0,
        totalACobrar: totalACobrar?.total || 0,
        prestamosActivos: activos?.total || 0,
        prestamosVencidos: vencidos?.total || 0,
        prestamosPorVencer: porVencer?.total || 0
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/prestamos/stats:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

