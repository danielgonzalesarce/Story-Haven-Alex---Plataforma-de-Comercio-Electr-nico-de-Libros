import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  console.log('App component rendering');
  
  try {
    return (
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error en App:', error);
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error en la aplicación</h1>
        <p>{error.toString()}</p>
        <button onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }
}

export default App;
