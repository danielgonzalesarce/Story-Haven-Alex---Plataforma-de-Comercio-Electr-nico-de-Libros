import api from './api';

/**
 * Obtener todas las compras del usuario autenticado
 */
export const getCompras = async () => {
  try {
    const response = await api.get('/compras/');
    // Asegurar que siempre devolvemos un array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Si viene en formato de paginación
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    // Si viene vacío o null, devolver array vacío
    return [];
  } catch (error) {
    // Si es 404 y el usuario está autenticado, devolver array vacío
    if (error.response?.status === 404) {
      console.warn('Endpoint de compras no encontrado, devolviendo lista vacía');
      return [];
    }
    throw error;
  }
};

/**
 * Obtener una compra específica por ID
 */
export const getCompra = async (compraId) => {
  const response = await api.get(`/compras/${compraId}/`);
  return response.data;
};

/**
 * Realizar checkout y crear compra
 */
export const realizarCompra = async (metodoPago = 'stripe') => {
  const response = await api.post('/carrito/checkout/', {
    metodo_pago: metodoPago
  });
  return response.data;
};

