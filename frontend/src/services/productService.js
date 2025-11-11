import api from './api';

export const getProductos = async (params = {}) => {
  const response = await api.get('/productos/', { params });
  return response.data;
};

export const getProducto = async (id) => {
  const response = await api.get(`/productos/${id}/`);
  return response.data;
};

export const getCategorias = async () => {
  const response = await api.get('/categorias/');
  // Asegurar que siempre devolvamos un array
  const data = response.data;
  return Array.isArray(data) ? data : (data.results || []);
};

