import React, { useState, useEffect, useContext } from 'react';
import ClienteForm from './ClienteForm';
import AuthContext from '../context/AuthContext';
import './Clientes.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

function Clientes() {
  const { getAuthHeaders } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/clientes`, { headers });
      const data = await response.json();
      setClientes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCliente(null);
    setShowModal(true);
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        loadClientes();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar cliente');
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      alert('Error al eliminar cliente');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCliente(null);
  };

  const handleSave = () => {
    loadClientes();
    handleCloseModal();
  };

  const filteredClientes = clientes.filter(cliente => {
    const fullName = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
    const telefono = cliente.telefono.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           telefono.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="clientes">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          ➕ Nuevo Cliente
        </button>
      </div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClientes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p>{searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreate} style={{ marginTop: '1rem' }}>
              Crear Primer Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="clientes-grid">
          {filteredClientes.map(cliente => (
            <div key={cliente.id} className="cliente-card">
              <div className="cliente-header">
                <h3 className="cliente-name">
                  {cliente.nombre} {cliente.apellido}
                </h3>
                <div className="cliente-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(cliente)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleDelete(cliente.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="cliente-info">
                <div className="cliente-field">
                  <span className="cliente-label">📞 Teléfono:</span>
                  <span className="cliente-value">{cliente.telefono}</span>
                </div>
                {cliente.observaciones && (
                  <div className="cliente-field">
                    <span className="cliente-label">📝 Observaciones:</span>
                    <span className="cliente-value">{cliente.observaciones}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ClienteForm
          cliente={editingCliente}
          onClose={handleCloseModal}
          onSave={handleSave}
          getAuthHeaders={getAuthHeaders}
        />
      )}
    </div>
  );
}

export default Clientes;

