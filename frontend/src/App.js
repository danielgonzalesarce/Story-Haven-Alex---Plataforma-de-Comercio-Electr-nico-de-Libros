import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Categorias from './pages/Categorias';
import Favoritos from './pages/Favoritos';
import Acceder from './pages/Acceder';
import Login from './pages/Login';
import Registro from './pages/Registro';
import HistorialCompras from './pages/HistorialCompras';
import SobreNosotros from './pages/SobreNosotros';
import Contacto from './pages/Contacto';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import Perfil from './pages/Perfil';

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  console.log('App component rendering');
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/categoria/:categoriaId" element={<Home />} />
                  <Route path="/categorias" element={<Categorias />} />
                  <Route path="/producto/:id" element={<DetalleProducto />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/favoritos" element={<Favoritos />} />
                  <Route path="/historial" element={<HistorialCompras />} />
                  <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
                  <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/acceder" element={<Acceder />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ErrorBoundary>
      </QueryClientProvider>
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
