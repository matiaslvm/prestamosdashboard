// Utilidades compartidas

// Función para calcular monto total
function calcularMontoTotal(montoPrestado, porcentajeInteres) {
  return montoPrestado + (montoPrestado * porcentajeInteres / 100);
}

// Función para determinar estado del préstamo
function determinarEstado(fechaVencimiento, estadoActual) {
  if (estadoActual === 'Pagado') return 'Pagado';
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);
  
  if (vencimiento < hoy) return 'Vencido';
  return 'Pendiente';
}

module.exports = { calcularMontoTotal, determinarEstado };

