const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar base de datos
const dbPath = path.join(__dirname, 'prestamos.db');
const db = new sqlite3.Database(dbPath);

// Crear tablas si no existen
db.serialize(() => {
  // Tabla de clientes
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono TEXT NOT NULL,
    observaciones TEXT
  )`);

  // Tabla de préstamos
  db.run(`CREATE TABLE IF NOT EXISTS prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    fecha_prestamo TEXT NOT NULL,
    fecha_vencimiento TEXT NOT NULL,
    monto_prestado REAL NOT NULL,
    porcentaje_interes REAL NOT NULL DEFAULT 60,
    monto_total REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
  )`);
});

// Helper para promisificar consultas
const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Función para calcular monto total
const calcularMontoTotal = (montoPrestado, porcentajeInteres) => {
  return montoPrestado + (montoPrestado * porcentajeInteres / 100);
};

// Función para determinar estado del préstamo
const determinarEstado = (fechaVencimiento, estadoActual) => {
  if (estadoActual === 'Pagado') return 'Pagado';
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);
  
  if (vencimiento < hoy) return 'Vencido';
  return 'Pendiente';
};

// ========== RUTAS DE CLIENTES ==========

// GET /api/clientes - Listar todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await dbAll('SELECT * FROM clientes ORDER BY apellido, nombre');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/clientes/:id - Obtener un cliente
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await dbGet('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/clientes - Crear cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, apellido, telefono, observaciones } = req.body;
    
    if (!nombre || !apellido || !telefono) {
      return res.status(400).json({ error: 'Nombre, apellido y teléfono son requeridos' });
    }

    const result = await dbRun(
      'INSERT INTO clientes (nombre, apellido, telefono, observaciones) VALUES (?, ?, ?, ?)',
      [nombre, apellido, telefono, observaciones || '']
    );

    const cliente = await dbGet('SELECT * FROM clientes WHERE id = ?', [result.id]);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/clientes/:id - Actualizar cliente
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { nombre, apellido, telefono, observaciones } = req.body;
    
    if (!nombre || !apellido || !telefono) {
      return res.status(400).json({ error: 'Nombre, apellido y teléfono son requeridos' });
    }

    await dbRun(
      'UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, observaciones = ? WHERE id = ?',
      [nombre, apellido, telefono, observaciones || '', req.params.id]
    );

    const cliente = await dbGet('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/clientes/:id - Eliminar cliente
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    // Verificar si tiene préstamos asociados
    const prestamos = await dbAll('SELECT id FROM prestamos WHERE cliente_id = ?', [req.params.id]);
    if (prestamos.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el cliente porque tiene préstamos asociados' 
      });
    }

    const result = await dbRun('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== RUTAS DE PRÉSTAMOS ==========

// GET /api/prestamos - Listar todos los préstamos con datos del cliente
app.get('/api/prestamos', async (req, res) => {
  try {
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

    res.json(prestamosActualizados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/prestamos/:id - Obtener un préstamo
app.get('/api/prestamos/:id', async (req, res) => {
  try {
    const prestamo = await dbGet(`
      SELECT 
        p.*,
        c.nombre || ' ' || c.apellido as cliente_nombre,
        c.telefono as cliente_telefono
      FROM prestamos p
      INNER JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/prestamos - Crear préstamo
app.post('/api/prestamos', async (req, res) => {
  try {
    const { cliente_id, fecha_prestamo, fecha_vencimiento, monto_prestado, porcentaje_interes } = req.body;
    
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

    res.status(201).json(prestamo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/prestamos/:id - Actualizar préstamo
app.put('/api/prestamos/:id', async (req, res) => {
  try {
    const { fecha_prestamo, fecha_vencimiento, monto_prestado, porcentaje_interes, estado } = req.body;
    
    const prestamoActual = await dbGet('SELECT * FROM prestamos WHERE id = ?', [req.params.id]);
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
      [fechaPrestamo, fechaVencimiento, montoPrestado, porcentaje, montoTotal, estadoFinal, req.params.id]
    );

    const prestamo = await dbGet(`
      SELECT 
        p.*,
        c.nombre || ' ' || c.apellido as cliente_nombre,
        c.telefono as cliente_telefono
      FROM prestamos p
      INNER JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/prestamos/:id - Eliminar préstamo
app.delete('/api/prestamos/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM prestamos WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json({ message: 'Préstamo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/prestamos/stats - Estadísticas para el dashboard
app.get('/api/prestamos/stats', async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const en7Dias = new Date();
    en7Dias.setDate(en7Dias.getDate() + 7);
    en7Dias.setHours(0, 0, 0, 0);

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

    res.json({
      totalPrestado: totalPrestado.total || 0,
      totalACobrar: totalACobrar.total || 0,
      prestamosActivos: activos.total || 0,
      prestamosVencidos: vencidos.total || 0,
      prestamosPorVencer: porVencer.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Cerrar base de datos al terminar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Base de datos cerrada.');
    process.exit(0);
  });
});

