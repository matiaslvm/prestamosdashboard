import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

function Dashboard() {
  const { getAuthHeaders } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPrestado: 0,
    totalACobrar: 0,
    prestamosActivos: 0,
    prestamosVencidos: 0,
    prestamosPorVencer: 0
  });
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [statsRes, prestamosRes] = await Promise.all([
        fetch(`${API_URL}/prestamos/stats`, { headers }),
        fetch(`${API_URL}/prestamos`, { headers })
      ]);

      const statsData = await statsRes.json();
      const prestamosData = await prestamosRes.json();

      setStats(statsData);
      setPrestamos(prestamosData);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(stats.totalPrestado)}</div>
          <div className="stat-label">Total Prestado</div>
        </div>
        <div className="stat-card stat-card-primary">
          <div className="stat-value">{formatCurrency(stats.totalACobrar)}</div>
          <div className="stat-label">Total a Cobrar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.prestamosActivos}</div>
          <div className="stat-label">Préstamos Activos</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-value">{stats.prestamosVencidos}</div>
          <div className="stat-label">Préstamos Vencidos</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-value">{stats.prestamosPorVencer}</div>
          <div className="stat-label">Por Vencer (7 días)</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Préstamos Recientes</h2>
          <Link to="/prestamos" className="btn btn-primary btn-small">
            Ver Todos
          </Link>
        </div>

        {prestamos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No hay préstamos registrados</p>
            <Link to="/prestamos" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Crear Primer Préstamo
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Total a Devolver</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.slice(0, 10).map(prestamo => (
                  <tr key={prestamo.id}>
                    <td>{prestamo.cliente_nombre}</td>
                    <td>{formatCurrency(prestamo.monto_prestado)}</td>
                    <td>{formatCurrency(prestamo.monto_total)}</td>
                    <td>{new Date(prestamo.fecha_vencimiento).toLocaleDateString('es-AR')}</td>
                    <td>
                      <span className={`badge ${prestamo.colorEstado}`}>
                        {prestamo.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

