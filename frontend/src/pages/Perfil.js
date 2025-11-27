import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, updatePerfil, cambiarPassword, getPerfil } from '../services/authService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompras } from '../services/compraService';
import { getTotalFavoritos } from '../services/favoritosService';
import { getCarritoItemCount } from '../services/cartService';
import Notification from '../components/Notification';

const Perfil = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('informacion');
  const [notification, setNotification] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [stats, setStats] = useState({
    totalCompras: 0,
    totalFavoritos: 0,
    totalCarrito: 0,
    totalGastado: 0
  });
  const [showAllCompras, setShowAllCompras] = useState(false);

  // Formulario de edición de perfil
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  // Formulario de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password2: ''
  });

  // Obtener perfil del usuario
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        return await getPerfil();
      } catch (error) {
        return getCurrentUser();
      }
    },
    enabled: isAuthenticated(),
  });

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Inicializar formulario cuando se carga el usuario
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
    }
  }, [user]);

  // Obtener compras del usuario
  const { data: compras = [] } = useQuery({
    queryKey: ['compras'],
    queryFn: async () => {
      try {
        return await getCompras();
      } catch (error) {
        return [];
      }
    },
    enabled: isAuthenticated(),
  });

  // Actualizar estadísticas
  useEffect(() => {
    if (compras && compras.length > 0) {
      const totalGastado = compras.reduce((sum, compra) => sum + parseFloat(compra.total || 0), 0);
      setStats(prev => ({
        ...prev,
        totalCompras: compras.length,
        totalGastado: totalGastado
      }));
    }

    // Obtener favoritos y carrito
    setStats(prev => ({
      ...prev,
      totalFavoritos: getTotalFavoritos(),
    }));

    getCarritoItemCount().then(count => {
      setStats(prev => ({
        ...prev,
        totalCarrito: count
      }));
    });
  }, [compras]);

  // Mutación para actualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: updatePerfil,
    onSuccess: (data) => {
      setNotification({ message: data.message || 'Perfil actualizado correctamente', type: 'success' });
      setEditingProfile(false);
      refetchUser();
      // Recargar página después de 1 segundo para actualizar navbar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      const message = error.response?.data?.error || 
                     Object.values(error.response?.data || {})[0]?.[0] || 
                     'Error al actualizar el perfil';
      setNotification({ message, type: 'error' });
    }
  });

  // Mutación para cambiar contraseña
  const changePasswordMutation = useMutation({
    mutationFn: cambiarPassword,
    onSuccess: () => {
      setNotification({ message: 'Contraseña actualizada correctamente', type: 'success' });
      setChangingPassword(false);
      setPasswordForm({
        old_password: '',
        new_password: '',
        new_password2: ''
      });
    },
    onError: (error) => {
      const message = error.response?.data?.error || 
                     Object.values(error.response?.data || {})[0]?.[0] || 
                     'Error al cambiar la contraseña';
      setNotification({ message, type: 'error' });
    }
  });

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (passwordForm.new_password !== passwordForm.new_password2) {
      setNotification({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    // Validar longitud mínima
    if (passwordForm.new_password.length < 8) {
      setNotification({ message: 'La contraseña debe tener al menos 8 caracteres', type: 'error' });
      return;
    }

    changePasswordMutation.mutate({
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
      new_password2: passwordForm.new_password2
    });
  };

  if (!isAuthenticated() || !user) {
    return null;
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="perfil-page">
      {/* Hero Section */}
      <div className="perfil-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <Link to="/" className="btn-back">
                <i className="fas fa-arrow-left me-2"></i>Volver al Inicio
              </Link>
              <h1 className="perfil-hero-title">
                <span className="perfil-hero-icon">
                  <i className="fas fa-user-circle"></i>
                </span>
                Mi Perfil
              </h1>
              <p className="perfil-hero-subtitle">
                Gestiona tu información personal y revisa tu actividad en Story Haven Alex
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <div className="perfil-avatar-large">
                <div className="perfil-avatar-circle">
                  {getInitials(user.username)}
                </div>
                <div className="perfil-avatar-badge">
                  <i className="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Estadísticas Rápidas */}
        <div className="row g-4 mb-5">
          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="stat-icon stat-icon-compras">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalCompras}</h3>
                <p>Compras Realizadas</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="stat-icon stat-icon-favoritos">
                <i className="fas fa-heart"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalFavoritos}</h3>
                <p>Favoritos</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="stat-icon stat-icon-carrito">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalCarrito}</h3>
                <p>En el Carrito</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="stat-icon stat-icon-gastado">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-content">
                <h3>${stats.totalGastado.toFixed(2)}</h3>
                <p>Total Gastado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Sidebar de Navegación */}
          <div className="col-lg-3 mb-4">
            <div className="perfil-sidebar">
              <div className="perfil-sidebar-header">
                <div className="perfil-sidebar-avatar">
                  {getInitials(user.username)}
                </div>
                <h4>{user.username || 'Usuario'}</h4>
                <p className="text-muted mb-0">{user.email || 'No especificado'}</p>
              </div>
              <div className="perfil-sidebar-nav">
                <button
                  className={`perfil-nav-item ${activeTab === 'informacion' ? 'active' : ''}`}
                  onClick={() => setActiveTab('informacion')}
                >
                  <i className="fas fa-user me-2"></i>
                  Información Personal
                </button>
                <button
                  className={`perfil-nav-item ${activeTab === 'compras' ? 'active' : ''}`}
                  onClick={() => setActiveTab('compras')}
                >
                  <i className="fas fa-shopping-bag me-2"></i>
                  Mis Compras
                  {stats.totalCompras > 0 && (
                    <span className="perfil-nav-badge">{stats.totalCompras}</span>
                  )}
                </button>
                <button
                  className={`perfil-nav-item ${activeTab === 'favoritos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('favoritos')}
                >
                  <i className="fas fa-heart me-2"></i>
                  Favoritos
                  {stats.totalFavoritos > 0 && (
                    <span className="perfil-nav-badge">{stats.totalFavoritos}</span>
                  )}
                </button>
                <button
                  className={`perfil-nav-item ${activeTab === 'seguridad' ? 'active' : ''}`}
                  onClick={() => setActiveTab('seguridad')}
                >
                  <i className="fas fa-shield-alt me-2"></i>
                  Seguridad
                </button>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="col-lg-9">
            <div className="perfil-content">
              {/* Tab: Información Personal */}
              {activeTab === 'informacion' && (
                <div className="perfil-tab-content">
                  <div className="perfil-tab-header">
                    <h2>
                      <i className="fas fa-user me-2"></i>
                      Información Personal
                    </h2>
                    <p className="text-muted">Gestiona tu información personal y preferencias</p>
                  </div>
                  
                  {!editingProfile ? (
                    <>
                      <div className="perfil-info-card">
                        <div className="perfil-info-item">
                          <div className="perfil-info-label">
                            <i className="fas fa-user me-2"></i>
                            Nombre de Usuario
                          </div>
                          <div className="perfil-info-value">{user.username || 'No especificado'}</div>
                        </div>
                        <div className="perfil-info-item">
                          <div className="perfil-info-label">
                            <i className="fas fa-envelope me-2"></i>
                            Correo Electrónico
                          </div>
                          <div className="perfil-info-value">{user.email || 'No especificado'}</div>
                        </div>
                        <div className="perfil-info-item">
                          <div className="perfil-info-label">
                            <i className="fas fa-id-card me-2"></i>
                            Nombre Completo
                          </div>
                          <div className="perfil-info-value">
                            {user.first_name || user.last_name 
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                              : 'No especificado'}
                          </div>
                        </div>
                        <div className="perfil-info-item">
                          <div className="perfil-info-label">
                            <i className="fas fa-calendar-alt me-2"></i>
                            Miembro desde
                          </div>
                          <div className="perfil-info-value">
                            {user.date_joined 
                              ? new Date(user.date_joined).toLocaleDateString('es-ES', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })
                              : 'Fecha no disponible'}
                          </div>
                        </div>
                      </div>
                      <div className="perfil-actions">
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setEditingProfile(true)}
                        >
                          <i className="fas fa-edit me-2"></i>
                          Editar Perfil
                        </button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="perfil-form">
                      <div className="perfil-form-card">
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="fas fa-user me-2"></i>
                            Nombre de Usuario
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={profileForm.username}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="fas fa-envelope me-2"></i>
                            Correo Electrónico
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              <i className="fas fa-id-card me-2"></i>
                              Nombre
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="first_name"
                              value={profileForm.first_name}
                              onChange={handleProfileChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              <i className="fas fa-id-card me-2"></i>
                              Apellido
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="last_name"
                              value={profileForm.last_name}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>
                        <div className="perfil-form-actions">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setEditingProfile(false);
                              setProfileForm({
                                username: user.username || '',
                                email: user.email || '',
                                first_name: user.first_name || '',
                                last_name: user.last_name || ''
                              });
                            }}
                            disabled={updateProfileMutation.isPending}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Guardando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Guardar Cambios
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Tab: Mis Compras */}
              {activeTab === 'compras' && (
                <div className="perfil-tab-content">
                  <div className="perfil-tab-header">
                    <h2>
                      <i className="fas fa-shopping-bag me-2"></i>
                      Mis Compras
                    </h2>
                    <p className="text-muted">Revisa el historial de todas tus compras</p>
                  </div>
                  {compras && compras.length > 0 ? (
                    <div className="perfil-compras-list">
                      {(showAllCompras ? compras : compras.slice(0, 5)).map((compra) => (
                        <div key={compra.id} className="perfil-compra-item">
                          <div className="perfil-compra-header">
                            <div>
                              <h5>Compra #{compra.id}</h5>
                              <p className="text-muted mb-0">
                                {new Date(compra.fecha_compra).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="perfil-compra-total">
                              <strong>${parseFloat(compra.total || 0).toFixed(2)}</strong>
                            </div>
                          </div>
                          <div className="perfil-compra-status">
                            <span className={`badge badge-${compra.estado === 'completada' ? 'success' : 'warning'}`}>
                              {compra.estado || 'pendiente'}
                            </span>
                            <span className="badge badge-info">{compra.metodo_pago || 'stripe'}</span>
                          </div>
                        </div>
                      ))}
                      {compras.length > 5 && (
                        <div className="text-center mt-4">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => setShowAllCompras(!showAllCompras)}
                          >
                            {showAllCompras ? (
                              <>
                                <i className="fas fa-chevron-up me-2"></i>
                                Ver Menos
                              </>
                            ) : (
                              <>
                                <i className="fas fa-chevron-down me-2"></i>
                                Ver Todas las Compras ({compras.length})
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="perfil-empty-state">
                      <i className="fas fa-shopping-bag"></i>
                      <h4>Aún no has realizado compras</h4>
                      <p>Cuando realices tu primera compra, aparecerá aquí</p>
                      <Link to="/" className="btn btn-primary">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Explorar Catálogo
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Favoritos */}
              {activeTab === 'favoritos' && (
                <div className="perfil-tab-content">
                  <div className="perfil-tab-header">
                    <h2>
                      <i className="fas fa-heart me-2"></i>
                      Mis Favoritos
                    </h2>
                    <p className="text-muted">Productos que has guardado en tu lista de favoritos</p>
                  </div>
                  {stats.totalFavoritos > 0 ? (
                    <div className="text-center">
                      <Link to="/favoritos" className="btn btn-primary">
                        <i className="fas fa-heart me-2"></i>
                        Ver Mis Favoritos ({stats.totalFavoritos})
                      </Link>
                    </div>
                  ) : (
                    <div className="perfil-empty-state">
                      <i className="fas fa-heart"></i>
                      <h4>No tienes favoritos aún</h4>
                      <p>Guarda productos que te interesen haciendo clic en el corazón</p>
                      <Link to="/" className="btn btn-primary">
                        <i className="fas fa-search me-2"></i>
                        Explorar Catálogo
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'seguridad' && (
                <div className="perfil-tab-content">
                  <div className="perfil-tab-header">
                    <h2>
                      <i className="fas fa-shield-alt me-2"></i>
                      Seguridad
                    </h2>
                    <p className="text-muted">Gestiona la seguridad de tu cuenta</p>
                  </div>
                  
                  {!changingPassword ? (
                    <>
                      <div className="perfil-info-card">
                        <div className="perfil-info-item">
                          <div className="perfil-info-label">
                            <i className="fas fa-lock me-2"></i>
                            Contraseña
                          </div>
                          <div className="perfil-info-value">
                            <span className="text-muted">••••••••</span>
                            <button 
                              className="btn btn-sm btn-primary ms-3"
                              onClick={() => setChangingPassword(true)}
                            >
                              <i className="fas fa-key me-1"></i>
                              Cambiar Contraseña
                            </button>
                          </div>
                        </div>
                        <div className="perfil-info-item">
                          <div className="perfil-info-label">
                            <i className="fas fa-shield-alt me-2"></i>
                            Autenticación de Dos Factores
                          </div>
                          <div className="perfil-info-value">
                            <span className="text-muted">No disponible</span>
                          </div>
                        </div>
                        <div className="perfil-info-item">
                          <div className="perfil-info-label">
                            <i className="fas fa-history me-2"></i>
                            Actividad Reciente
                          </div>
                          <div className="perfil-info-value">
                            <span className="text-muted">Sesión activa</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handlePasswordSubmit} className="perfil-form">
                      <div className="perfil-form-card">
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="fas fa-lock me-2"></i>
                            Contraseña Actual
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="old_password"
                            value={passwordForm.old_password}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="current-password"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="fas fa-key me-2"></i>
                            Nueva Contraseña
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="new_password"
                            value={passwordForm.new_password}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                          />
                          <small className="form-text text-muted">
                            La contraseña debe tener al menos 8 caracteres
                          </small>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="fas fa-key me-2"></i>
                            Confirmar Nueva Contraseña
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="new_password2"
                            value={passwordForm.new_password2}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                          />
                        </div>
                        <div className="perfil-form-actions">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setChangingPassword(false);
                              setPasswordForm({
                                old_password: '',
                                new_password: '',
                                new_password2: ''
                              });
                            }}
                            disabled={changePasswordMutation.isPending}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={changePasswordMutation.isPending}
                          >
                            {changePasswordMutation.isPending ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Cambiando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Cambiar Contraseña
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

