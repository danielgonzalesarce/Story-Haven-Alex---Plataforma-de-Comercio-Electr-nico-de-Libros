import api from './api';

const getSessionKey = () => {
  let sessionKey = localStorage.getItem('cart_session_key');
  if (!sessionKey) {
    sessionKey = generateSessionKey();
    localStorage.setItem('cart_session_key', sessionKey);
  }
  return sessionKey;
};

const generateSessionKey = () => {
  return 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getCarrito = async () => {
  const sessionKey = getSessionKey();
  const response = await api.get('/carrito/', { params: { session_key: sessionKey } });
  return response.data;
};

export const addToCarrito = async (productoId, cantidad = 1) => {
  const sessionKey = getSessionKey();
  const response = await api.post('/carrito/', {
    producto: productoId,
    cantidad: cantidad,
    session_key: sessionKey,
  });
  
  // Actualizar session_key si viene en la respuesta
  if (response.data.session_key) {
    localStorage.setItem('cart_session_key', response.data.session_key);
  }
  
  return response.data;
};

export const removeFromCarrito = async (itemId) => {
  await api.delete(`/carrito/${itemId}/`);
};

export const getCarritoTotal = async () => {
  const sessionKey = getSessionKey();
  const response = await api.get('/carrito/total/', { params: { session_key: sessionKey } });
  return response.data;
};

export const checkout = async () => {
  const sessionKey = getSessionKey();
  const response = await api.post('/carrito/checkout/', {}, { params: { session_key: sessionKey } });
  return response.data;
};

/**
 * Obtiene el número total de items en el carrito
 */
export const getCarritoItemCount = async () => {
  try {
    const data = await getCarrito();
    const itemsArray = Array.isArray(data) ? data : (data.results || []);
    // Sumar las cantidades de todos los items
    return itemsArray.reduce((total, item) => total + (item.cantidad || 1), 0);
  } catch (error) {
    console.error('Error obteniendo cantidad del carrito:', error);
    return 0;
  }
};

