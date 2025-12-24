import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import Prestamos from './components/Prestamos';
import './App.css';

function Navigation() {
  const location = useLocation();
  
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
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/prestamos" element={<Prestamos />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

