import React, { useState, useEffect } from 'react';
import './PrestamoForm.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

function PrestamoForm({ prestamo, clientes, onClose, onSave, getAuthHeaders }) {
  const [formData, setFormData] = useState({
    cliente_id: '',
    fecha_prestamo: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    monto_prestado: '',
    porcentaje_interes: 60,
    estado: 'Pendiente'
  });
  const [montoTotal, setMontoTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prestamo) {
      const fechaVenc = prestamo.fecha_vencimiento.split('T')[0];
      const fechaPrest = prestamo.fecha_prestamo.split('T')[0];
      
      setFormData({
        cliente_id: prestamo.cliente_id.toString(),
        fecha_prestamo: fechaPrest,
        fecha_vencimiento: fechaVenc,
        monto_prestado: prestamo.monto_prestado.toString(),
        porcentaje_interes: prestamo.porcentaje_interes,
        estado: prestamo.estado
      });
      setMontoTotal(prestamo.monto_total);
    } else {
      // Calcular fecha de vencimiento por defecto (+1 mes)
      const fechaPrestamo = new Date();
      fechaPrestamo.setMonth(fechaPrestamo.getMonth() + 1);
      setFormData(prev => ({
        ...prev,
        fecha_vencimiento: fechaPrestamo.toISOString().split('T')[0]
      }));
    }
  }, [prestamo]);

  useEffect(() => {
    // Calcular monto total cuando cambian monto_prestado o porcentaje_interes
    if (formData.monto_prestado && formData.porcentaje_interes) {
      const monto = parseFloat(formData.monto_prestado) || 0;
      const porcentaje = parseFloat(formData.porcentaje_interes) || 0;
      const total = monto + (monto * porcentaje / 100);
      setMontoTotal(total);
    } else {
      setMontoTotal(0);
    }
  }, [formData.monto_prestado, formData.porcentaje_interes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Si cambia la fecha de préstamo, calcular fecha de vencimiento por defecto
    if (name === 'fecha_prestamo' && !prestamo) {
      const fechaPrestamo = new Date(value);
      fechaPrestamo.setMonth(fechaPrestamo.getMonth() + 1);
      setFormData(prev => ({
        ...prev,
        fecha_vencimiento: fechaPrestamo.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cliente_id || !formData.fecha_prestamo || !formData.monto_prestado) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (parseFloat(formData.monto_prestado) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    setLoading(true);

    try {
      const url = prestamo 
        ? `${API_URL}/prestamos/${prestamo.id}`
        : `${API_URL}/prestamos`;
      
      const method = prestamo ? 'PUT' : 'POST';

      const payload = {
        cliente_id: parseInt(formData.cliente_id),
        fecha_prestamo: formData.fecha_prestamo,
        fecha_vencimiento: formData.fecha_vencimiento,
        monto_prestado: parseFloat(formData.monto_prestado),
        porcentaje_interes: parseFloat(formData.porcentaje_interes),
        estado: formData.estado
      };

      const headers = getAuthHeaders();
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar préstamo');
      }
    } catch (error) {
      console.error('Error guardando préstamo:', error);
      alert('Error al guardar préstamo');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {prestamo ? 'Editar Préstamo' : 'Nuevo Préstamo'}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="cliente_id">Cliente *</label>
            <select
              id="cliente_id"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              required
              disabled={!!prestamo}
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} {cliente.apellido} - {cliente.telefono}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="fecha_prestamo">Fecha del Préstamo *</label>
              <input
                type="date"
                id="fecha_prestamo"
                name="fecha_prestamo"
                value={formData.fecha_prestamo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="fecha_vencimiento">Fecha de Vencimiento *</label>
              <input
                type="date"
                id="fecha_vencimiento"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="monto_prestado">Monto Prestado *</label>
              <input
                type="number"
                id="monto_prestado"
                name="monto_prestado"
                value={formData.monto_prestado}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="porcentaje_interes">Porcentaje de Interés (%) *</label>
              <input
                type="number"
                id="porcentaje_interes"
                name="porcentaje_interes"
                value={formData.porcentaje_interes}
                onChange={handleChange}
                step="0.1"
                min="0"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Monto Total a Devolver</label>
            <div className="monto-total-display">
              <strong>{formatCurrency(montoTotal)}</strong>
              <small>
                ({formatCurrency(parseFloat(formData.monto_prestado) || 0)} + 
                {formatCurrency((parseFloat(formData.monto_prestado) || 0) * (parseFloat(formData.porcentaje_interes) || 0) / 100)})
              </small>
            </div>
          </div>

          {prestamo && (
            <div className="input-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Vencido">Vencido</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PrestamoForm;

