import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategorias, getProductos } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Notification from '../components/Notification';

const Categorias = () => {
  const queryClient = useQueryClient();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [notification, setNotification] = useState(null);

  // Query para obtener categorías
  const {
    data: categorias = [],
    isLoading: loadingCategorias,
    error: errorCategorias,
  } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      try {
        const data = await getCategorias();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error obteniendo categorías:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Query para obtener productos por categoría
  const {
    data: productosData,
    isLoading: loadingProductos,
    error: errorProductos,
  } = useQuery({
    queryKey: ['productos', 'categoria', categoriaSeleccionada?.id],
    queryFn: async () => {
      if (!categoriaSeleccionada) return [];
      try {
        const data = await getProductos({ categoria: categoriaSeleccionada.id });
        // Asegurar que siempre devolvamos un array
        if (Array.isArray(data)) {
          return data;
        } else if (data && Array.isArray(data.results)) {
          return data.results;
        } else if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        }
        return [];
      } catch (error) {
        console.error('Error obteniendo productos por categoría:', error);
        return [];
      }
    },
    enabled: !!categoriaSeleccionada,
  });

  // Asegurar que productos siempre sea un array
  const productos = Array.isArray(productosData) ? productosData : [];

  // Prefetch productos de una categoría al pasar el mouse
  const handleCategoriaHover = (categoriaId) => {
    queryClient.prefetchQuery({
      queryKey: ['productos', 'categoria', categoriaId],
      queryFn: async () => {
        try {
          return await getProductos({ categoria: categoriaId });
        } catch (error) {
          console.error('Error en prefetch de productos:', error);
          return [];
        }
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Prefetch detalle de producto al pasar el mouse
  const handleProductoHover = (productoId) => {
    queryClient.prefetchQuery({
      queryKey: ['producto', productoId],
      queryFn: async () => {
        try {
          const { getProducto } = await import('../services/productService');
          return await getProducto(productoId);
        } catch (error) {
          console.error('Error en prefetch de producto:', error);
          return null;
        }
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const handleVolverACategorias = () => {
    setCategoriaSeleccionada(null);
  };

  if (loadingCategorias) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando categorías...</span>
        </div>
      </div>
    );
  }

  if (errorCategorias) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>Error al cargar las categorías</h4>
          <p>
            {errorCategorias.message || 
             errorCategorias.response?.data?.detail || 
             'Ocurrió un error al cargar las categorías. Verifica que el backend esté corriendo en http://localhost:8000'}
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['categorias'] })}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Si hay una categoría seleccionada, mostrar productos
  if (categoriaSeleccionada) {
    return (
      <div className="container my-5">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="mb-4">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={handleVolverACategorias}
          >
            <i className="fas fa-arrow-left me-2"></i>Volver a Categorías
          </button>
          <h1 className="display-4">{categoriaSeleccionada.nombre}</h1>
          {categoriaSeleccionada.descripcion && (
            <p className="lead text-muted">{categoriaSeleccionada.descripcion}</p>
          )}
        </div>

        {loadingProductos ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando productos...</span>
            </div>
          </div>
        ) : errorProductos ? (
          <div className="alert alert-danger">
            <h4>Error al cargar los productos</h4>
            <p>{errorProductos.message || 'Ocurrió un error al cargar los productos'}</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="alert alert-info text-center">
            <h4>No hay productos en esta categoría</h4>
            <p>Esta categoría aún no tiene productos disponibles.</p>
          </div>
        ) : (
          <div className="row g-4">
            {productos.map((producto) => (
              <div key={producto.id} className="col-md-4 col-lg-3">
                <div
                  onMouseEnter={() => handleProductoHover(producto.id)}
                >
                  <ProductCard producto={producto} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vista de lista de categorías
  return (
    <div className="container my-5">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="display-4 mb-4">Categorías</h1>
      <p className="lead text-muted mb-5">
        Explora nuestros productos organizados por categorías
      </p>

      {categorias.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No hay categorías disponibles</h4>
          <p>No hay categorías registradas en este momento.</p>
        </div>
      ) : (
        <div className="row g-4">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm hover-card"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={() => handleCategoriaHover(categoria.id)}
                onClick={() => handleCategoriaClick(categoria)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{categoria.nombre}</h5>
                  {categoria.descripcion && (
                    <p className="card-text text-muted flex-grow-1">
                      {categoria.descripcion.length > 100
                        ? `${categoria.descripcion.substring(0, 100)}...`
                        : categoria.descripcion}
                    </p>
                  )}
                  <button 
                    className="btn btn-primary mt-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCategoriaClick(categoria);
                    }}
                    type="button"
                  >
                    Ver Productos <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categorias;

