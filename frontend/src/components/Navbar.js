import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/carrito">
                Carrito
              </Link>
            </li>
            {authenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Bienvenido, {user?.username || 'Usuario'}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">
                    Registro
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

