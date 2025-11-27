import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from '../services/authService';
import { getCategorias } from '../services/productService';
import { getTotalFavoritos } from '../services/favoritosService';
import { getCarritoItemCount } from '../services/cartService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const authenticated = isAuthenticated();
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [totalCarrito, setTotalCarrito] = useState(0);

  // Determinar qué enlace está activo
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/categoria/');
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  useEffect(() => {
    loadCategorias();
    updateFavoritosCount();
    updateCarritoCount();
    
    // Escuchar evento personalizado cuando se actualiza el carrito
    const handleCarritoUpdate = () => {
      updateCarritoCount();
    };
    
    window.addEventListener('carritoUpdated', handleCarritoUpdate);
    
    // Actualizar contadores periódicamente (cada 2 segundos)
    const interval = setInterval(() => {
      updateFavoritosCount();
      updateCarritoCount();
    }, 2000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('carritoUpdated', handleCarritoUpdate);
    };
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await getCategorias();
      const categoriasArray = Array.isArray(data) ? data : (data.results || []);
      setCategorias(categoriasArray);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategorias([]);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const updateFavoritosCount = () => {
    setTotalFavoritos(getTotalFavoritos());
  };

  const updateCarritoCount = async () => {
    try {
      const count = await getCarritoItemCount();
      setTotalCarrito(count);
    } catch (error) {
      console.error('Error actualizando contador del carrito:', error);
      setTotalCarrito(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.png" alt="Story Haven Alex" height="40" className="me-2" />
          <span className="fw-bold">Story Haven Alex</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navegación central */}
          <ul className="navbar-nav mx-auto navbar-nav-centered">
            <li className="nav-item">
              <Link 
                className={`nav-link nav-link-enhanced ${isActive('/') ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-home me-1"></i>Inicio
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className={`nav-link nav-link-enhanced dropdown-toggle ${isActive('/categoria') || isActive('/categorias') ? 'active' : ''}`}
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-th-large me-1"></i>Categorías
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link 
                    className={`dropdown-item ${isActive('/categorias') ? 'active' : ''}`} 
                    to="/categorias"
                  >
                    <i className="fas fa-list me-2"></i>Ver Todas las Categorías
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {loadingCategorias ? (
                  <li>
                    <span className="dropdown-item-text">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      Cargando...
                    </span>
                  </li>
                ) : categorias.length > 0 ? (
                  categorias.map((categoria) => (
                    <li key={categoria.id}>
                      <Link 
                        className={`dropdown-item ${location.pathname === `/categoria/${categoria.id}` ? 'active' : ''}`} 
                        to={`/categoria/${categoria.id}`}
                      >
                        {categoria.nombre}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="dropdown-item-text text-muted">No hay categorías disponibles</span>
                  </li>
                )}
              </ul>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link nav-link-enhanced position-relative ${isActive('/favoritos') ? 'active' : ''}`} 
                to="/favoritos"
              >
                <i className="fas fa-heart me-1"></i>Favoritos
                {totalFavoritos > 0 && (
                  <span className="badge bg-danger rounded-pill favoritos-badge">
                    {totalFavoritos}
                  </span>
                )}
              </Link>
            </li>
          </ul>
          {/* Navegación derecha - Carrito y Acceder */}
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item">
              <Link 
                className={`nav-link nav-link-enhanced position-relative ${isActive('/carrito') ? 'active' : ''}`} 
                to="/carrito"
              >
                <i className="fas fa-shopping-cart me-1"></i>Carrito
                {totalCarrito > 0 && (
                  <span className="badge bg-danger rounded-pill carrito-badge">
                    {totalCarrito}
                  </span>
                )}
              </Link>
            </li>
            {authenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link nav-link-enhanced dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {user?.username || 'Usuario'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end user-dropdown-menu" aria-labelledby="userDropdown">
                  <li className="user-dropdown-header">
                    <div className="user-dropdown-avatar">
                      {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div className="user-dropdown-info">
                      <strong>{user?.username || 'Usuario'}</strong>
                      <small className="text-muted d-block">{user?.email || ''}</small>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      <i className="fas fa-user me-2"></i>Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/favoritos">
                      <i className="fas fa-heart me-2"></i>Mis Favoritos
                      {totalFavoritos > 0 && (
                        <span className="badge bg-danger rounded-pill ms-2">{totalFavoritos}</span>
                      )}
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className={`nav-link nav-link-enhanced nav-link-acceder ${isActive('/acceder') || isActive('/login') || isActive('/registro') ? 'active' : ''}`} 
                  to="/acceder"
                >
                  <i className="fas fa-sign-in-alt me-1"></i>Acceder
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

