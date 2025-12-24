import React, { useState } from 'react';
import './Calculadora.css';

function Calculadora() {
  const [monto, setMonto] = useState('');
  const [interes, setInteres] = useState(60);
  const [dias, setDias] = useState(30);
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const montoNum = parseFloat(monto);
    if (!montoNum || montoNum <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    const interesDecimal = interes / 100;
    const interesCalculado = montoNum * interesDecimal;
    const total = montoNum + interesCalculado;
    const interesPorDia = interesCalculado / dias;
    const totalPorDia = total / dias;

    setResultado({
      montoPrestado: montoNum,
      interes: interesCalculado,
      total,
      interesPorDia,
      totalPorDia,
      dias
    });
  };

  const limpiar = () => {
    setMonto('');
    setInteres(60);
    setDias(30);
    setResultado(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="calculadora">
      <div className="page-header">
        <h1 className="page-title">🧮 Calculadora de Préstamos</h1>
        <p className="page-subtitle">Calcula intereses rápidamente sin crear un préstamo</p>
      </div>

      <div className="calculadora-container">
        <div className="calculadora-card">
          <h2 className="card-title">Datos del Préstamo</h2>
          
          <div className="calculadora-form">
            <div className="input-group">
              <label htmlFor="monto">
                💵 Monto a Prestar
              </label>
              <input
                type="number"
                id="monto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="Ej: 10000"
                step="0.01"
                min="0"
              />
            </div>

            <div className="input-group">
              <label htmlFor="interes">
                📊 Porcentaje de Interés (%)
              </label>
              <div className="input-with-button">
                <input
                  type="number"
                  id="interes"
                  value={interes}
                  onChange={(e) => setInteres(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="0"
                />
                <div className="quick-buttons">
                  <button
                    type="button"
                    className="btn-quick"
                    onClick={() => setInteres(30)}
                  >
                    30%
                  </button>
                  <button
                    type="button"
                    className="btn-quick"
                    onClick={() => setInteres(60)}
                  >
                    60%
                  </button>
                  <button
                    type="button"
                    className="btn-quick"
                    onClick={() => setInteres(100)}
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="dias">
                📅 Plazo (días)
              </label>
              <div className="input-with-button">
                <input
                  type="number"
                  id="dias"
                  value={dias}
                  onChange={(e) => setDias(parseInt(e.target.value) || 0)}
                  min="1"
                />
                <div className="quick-buttons">
                  <button
                    type="button"
                    className="btn-quick"
                    onClick={() => setDias(7)}
                  >
                    7 días
                  </button>
                  <button
                    type="button"
                    className="btn-quick"
                    onClick={() => setDias(30)}
                  >
                    30 días
                  </button>
                  <button
                    type="button"
                    className="btn-quick"
                    onClick={() => setDias(60)}
                  >
                    60 días
                  </button>
                </div>
              </div>
            </div>

            <div className="calculadora-actions">
              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={calcular}
              >
                🧮 Calcular
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-large"
                onClick={limpiar}
              >
                🗑️ Limpiar
              </button>
            </div>
          </div>
        </div>

        {resultado && (
          <div className="resultado-card">
            <h2 className="card-title">📊 Resultado del Cálculo</h2>
            
            <div className="resultado-grid">
              <div className="resultado-item">
                <div className="resultado-label">Monto Prestado</div>
                <div className="resultado-value">{formatCurrency(resultado.montoPrestado)}</div>
              </div>

              <div className="resultado-item">
                <div className="resultado-label">Interés ({interes}%)</div>
                <div className="resultado-value resultado-interes">
                  {formatCurrency(resultado.interes)}
                </div>
              </div>

              <div className="resultado-item resultado-total">
                <div className="resultado-label">💰 Total a Devolver</div>
                <div className="resultado-value resultado-total-value">
                  {formatCurrency(resultado.total)}
                </div>
              </div>

              <div className="resultado-item resultado-divider">
                <div className="resultado-label">📅 Por {resultado.dias} días</div>
              </div>

              <div className="resultado-item">
                <div className="resultado-label">Interés por día</div>
                <div className="resultado-value resultado-small">
                  {formatCurrency(resultado.interesPorDia)}
                </div>
              </div>

              <div className="resultado-item">
                <div className="resultado-label">Total por día</div>
                <div className="resultado-value resultado-small">
                  {formatCurrency(resultado.totalPorDia)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculadora;

