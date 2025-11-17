// Servicio para gestionar favoritos usando localStorage

const FAVORITOS_KEY = 'story_haven_favoritos';

/**
 * Obtiene todos los favoritos del localStorage
 */
export const getFavoritos = () => {
  try {
    const favoritos = localStorage.getItem(FAVORITOS_KEY);
    return favoritos ? JSON.parse(favoritos) : [];
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    return [];
  }
};

/**
 * Agrega un producto a favoritos
 */
export const agregarFavorito = (producto) => {
  try {
    const favoritos = getFavoritos();
    // Verificar si el producto ya está en favoritos
    const existe = favoritos.some(fav => fav.id === producto.id);
    if (!existe) {
      favoritos.push(producto);
      localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error agregando favorito:', error);
    return false;
  }
};

/**
 * Elimina un producto de favoritos
 */
export const eliminarFavorito = (productoId) => {
  try {
    const favoritos = getFavoritos();
    const nuevosFavoritos = favoritos.filter(fav => fav.id !== productoId);
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(nuevosFavoritos));
    return true;
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    return false;
  }
};

/**
 * Verifica si un producto está en favoritos
 */
export const esFavorito = (productoId) => {
  try {
    const favoritos = getFavoritos();
    return favoritos.some(fav => fav.id === productoId);
  } catch (error) {
    console.error('Error verificando favorito:', error);
    return false;
  }
};

/**
 * Obtiene el número total de favoritos
 */
export const getTotalFavoritos = () => {
  return getFavoritos().length;
};

/**
 * Limpia todos los favoritos
 */
export const limpiarFavoritos = () => {
  try {
    localStorage.removeItem(FAVORITOS_KEY);
    return true;
  } catch (error) {
    console.error('Error limpiando favoritos:', error);
    return false;
  }
};

