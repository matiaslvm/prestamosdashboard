import React, { useState, useEffect, useContext, useCallback } from 'react';
import PrestamoForm from './PrestamoForm';
import AuthContext from '../context/AuthContext';
import './Prestamos.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

function Prestamos() {
  const { getAuthHeaders } = useContext(AuthContext);
  const [prestamos, setPrestamos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrestamo, setEditingPrestamo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortBy, setSortBy] = useState('fecha_prestamo');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [prestamosRes, clientesRes] = await Promise.all([
        fetch(`${API_URL}/prestamos`, { headers }),
        fetch(`${API_URL}/clientes`, { headers })
      ]);

      const prestamosData = await prestamosRes.json();
      const clientesData = await clientesRes.json();

      setPrestamos(prestamosData);
      setClientes(clientesData);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    if (clientes.length === 0) {
      alert('Primero debes crear al menos un cliente');
      return;
    }
    setEditingPrestamo(null);
    setShowModal(true);
  };

  const handleEdit = (prestamo) => {
    setEditingPrestamo(prestamo);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este préstamo?')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/prestamos/${id}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        loadData();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar préstamo');
      }
    } catch (error) {
      console.error('Error eliminando préstamo:', error);
      alert('Error al eliminar préstamo');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPrestamo(null);
  };

  const handleSave = () => {
    loadData();
    handleCloseModal();
  };

  const handleToggleEstado = async (prestamo) => {
    const nuevoEstado = prestamo.estado === 'Pagado' ? 'Pendiente' : 'Pagado';
    
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/prestamos/${prestamo.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...prestamo,
          estado: nuevoEstado
        })
      });

      if (response.ok) {
        loadData();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar estado');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Cliente', 'Fecha Préstamo', 'Fecha Vencimiento', 'Monto Prestado', 'Interés %', 'Total a Devolver', 'Estado'].join(','),
      ...filteredAndSortedPrestamos.map(p => [
        p.cliente_nombre,
        p.fecha_prestamo,
        p.fecha_vencimiento,
        p.monto_prestado,
        p.porcentaje_interes,
        p.monto_total,
        p.estado
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prestamos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  // Filtrar y ordenar préstamos
  let filteredAndSortedPrestamos = prestamos.filter(prestamo => {
    const matchSearch = prestamo.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCliente = !filterCliente || prestamo.cliente_id.toString() === filterCliente;
    const matchEstado = !filterEstado || prestamo.estado === filterEstado;
    return matchSearch && matchCliente && matchEstado;
  });

  // Ordenar
  filteredAndSortedPrestamos.sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'cliente':
        aVal = a.cliente_nombre.toLowerCase();
        bVal = b.cliente_nombre.toLowerCase();
        break;
      case 'monto':
        aVal = a.monto_prestado;
        bVal = b.monto_prestado;
        break;
      case 'vencimiento':
        aVal = new Date(a.fecha_vencimiento);
        bVal = new Date(b.fecha_vencimiento);
        break;
      case 'estado':
        aVal = a.estado;
        bVal = b.estado;
        break;
      default:
        aVal = new Date(a.fecha_prestamo);
        bVal = new Date(b.fecha_prestamo);
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="prestamos">
      <div className="page-header">
        <h1 className="page-title">Préstamos</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {prestamos.length > 0 && (
            <button className="btn btn-secondary btn-small" onClick={handleExport}>
              📥 Exportar CSV
            </button>
          )}
          <button className="btn btn-primary" onClick={handleCreate}>
            ➕ Nuevo Préstamo
          </button>
        </div>
      </div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="🔍 Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCliente}
          onChange={(e) => setFilterCliente(e.target.value)}
        >
          <option value="">Todos los clientes</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} {cliente.apellido}
            </option>
          ))}
        </select>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
          <option value="Vencido">Vencido</option>
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field);
            setSortOrder(order);
          }}
        >
          <option value="fecha_prestamo-desc">Fecha (más reciente)</option>
          <option value="fecha_prestamo-asc">Fecha (más antiguo)</option>
          <option value="vencimiento-asc">Vencimiento (próximo)</option>
          <option value="vencimiento-desc">Vencimiento (lejano)</option>
          <option value="cliente-asc">Cliente (A-Z)</option>
          <option value="cliente-desc">Cliente (Z-A)</option>
          <option value="monto-desc">Monto (mayor)</option>
          <option value="monto-asc">Monto (menor)</option>
          <option value="estado-asc">Estado</option>
        </select>
      </div>

      {filteredAndSortedPrestamos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💵</div>
          <p>
            {searchTerm || filterCliente || filterEstado 
              ? 'No se encontraron préstamos con los filtros aplicados' 
              : 'No hay préstamos registrados'}
          </p>
          {!searchTerm && !filterCliente && !filterEstado && (
            <button className="btn btn-primary" onClick={handleCreate} style={{ marginTop: '1rem' }}>
              Crear Primer Préstamo
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Vista Desktop - Tabla */}
          <div className="card table-view">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Fecha Préstamo</th>
                    <th>Vencimiento</th>
                    <th>Monto</th>
                    <th>Interés</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedPrestamos.map(prestamo => (
                    <tr key={prestamo.id} className={`prestamo-row prestamo-${prestamo.colorEstado}`}>
                      <td>
                        <div className="cliente-cell">
                          <strong>{prestamo.cliente_nombre}</strong>
                          <small>{prestamo.cliente_telefono}</small>
                        </div>
                      </td>
                      <td>{formatDate(prestamo.fecha_prestamo)}</td>
                      <td>{formatDate(prestamo.fecha_vencimiento)}</td>
                      <td>{formatCurrency(prestamo.monto_prestado)}</td>
                      <td>{prestamo.porcentaje_interes}%</td>
                      <td><strong>{formatCurrency(prestamo.monto_total)}</strong></td>
                      <td>
                        <span className={`badge ${prestamo.colorEstado}`}>
                          {prestamo.estado}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleEdit(prestamo)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => handleToggleEstado(prestamo)}
                            title={prestamo.estado === 'Pagado' ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
                          >
                            {prestamo.estado === 'Pagado' ? '↩️' : '✅'}
                          </button>
                          <button
                            className="btn-icon btn-icon-danger"
                            onClick={() => handleDelete(prestamo.id)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vista Mobile - Cards */}
          <div className="prestamos-mobile-view">
            {filteredAndSortedPrestamos.map(prestamo => (
              <div key={prestamo.id} className={`prestamo-mobile-card prestamo-${prestamo.colorEstado}`}>
                <div className="prestamo-mobile-header">
                  <div>
                    <h3 className="prestamo-mobile-cliente">{prestamo.cliente_nombre}</h3>
                    <p className="prestamo-mobile-telefono">{prestamo.cliente_telefono}</p>
                  </div>
                  <span className={`badge ${prestamo.colorEstado}`}>
                    {prestamo.estado}
                  </span>
                </div>

                <div className="prestamo-mobile-body">
                  <div className="prestamo-mobile-row">
                    <span className="prestamo-mobile-label">Monto:</span>
                    <span className="prestamo-mobile-value">{formatCurrency(prestamo.monto_prestado)}</span>
                  </div>
                  <div className="prestamo-mobile-row">
                    <span className="prestamo-mobile-label">Total:</span>
                    <span className="prestamo-mobile-value prestamo-mobile-total">
                      {formatCurrency(prestamo.monto_total)}
                    </span>
                  </div>
                  <div className="prestamo-mobile-row">
                    <span className="prestamo-mobile-label">Interés:</span>
                    <span className="prestamo-mobile-value">{prestamo.porcentaje_interes}%</span>
                  </div>
                  <div className="prestamo-mobile-row">
                    <span className="prestamo-mobile-label">Vencimiento:</span>
                    <span className="prestamo-mobile-value">{formatDate(prestamo.fecha_vencimiento)}</span>
                  </div>
                </div>

                <div className="prestamo-mobile-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(prestamo)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleToggleEstado(prestamo)}
                    title={prestamo.estado === 'Pagado' ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
                  >
                    {prestamo.estado === 'Pagado' ? '↩️' : '✅'}
                  </button>
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleDelete(prestamo.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <PrestamoForm
          prestamo={editingPrestamo}
          clientes={clientes}
          onClose={handleCloseModal}
          onSave={handleSave}
          getAuthHeaders={getAuthHeaders}
        />
      )}
    </div>
  );
}

export default Prestamos;

