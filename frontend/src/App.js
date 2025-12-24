import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import Prestamos from './components/Prestamos';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function Navigation() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  
  if (!user) return null; // No mostrar navegación si no está logueado
  
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <h1 className="nav-logo">💰 Préstamos</h1>
          <div className="nav-links">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/clientes" 
              className={location.pathname === '/clientes' ? 'nav-link active' : 'nav-link'}
            >
              👥 Clientes
            </Link>
            <Link 
              to="/prestamos" 
              className={location.pathname === '/prestamos' ? 'nav-link active' : 'nav-link'}
            >
              💵 Préstamos
            </Link>
            <button 
              onClick={logout}
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
            >
              🚪 Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clientes" 
                element={
                  <ProtectedRoute>
                    <Clientes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/prestamos" 
                element={
                  <ProtectedRoute>
                    <Prestamos />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

