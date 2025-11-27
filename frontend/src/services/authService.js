import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/registro/', userData);
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getPerfil = async () => {
  const response = await api.get('/auth/perfil/');
  // Actualizar usuario en localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

/**
 * Actualizar perfil del usuario
 */
export const updatePerfil = async (userData) => {
  const response = await api.patch('/auth/perfil/', userData);
  // Actualizar usuario en localStorage
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    // Actualizar token si cambió
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
  }
  return response.data;
};

/**
 * Cambiar contraseña del usuario
 */
export const cambiarPassword = async (passwordData) => {
  const response = await api.post('/auth/cambiar-password/', passwordData);
  return response.data;
};

