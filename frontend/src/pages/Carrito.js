import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCarrito, removeFromCarrito, updateCarritoItem, checkout } from '../services/cartService';
import Notification from '../components/Notification';

const Carrito = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState(null);

  // Query para obtener el carrito
  const { data: carritoData, isLoading, error } = useQuery({
    queryKey: ['carrito'],
    queryFn: async () => {
      const data = await getCarrito();
      return Array.isArray(data) ? data : (data.results || []);
    },
  });

  const items = carritoData || [];
  const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

  // Mutación para eliminar item con optimistic update
  const deleteMutation = useMutation({
    mutationFn: async (itemId) => {
      await removeFromCarrito(itemId);
    },
    onMutate: async (itemId) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['carrito'] });

      // Snapshot del valor anterior
      const previousItems = queryClient.getQueryData(['carrito']);

      // Optimistic update
      queryClient.setQueryData(['carrito'], (old) => {
        return old.filter((item) => item.id !== itemId);
      });

      return { previousItems };
    },
    onError: (err, itemId, context) => {
      // Rollback en caso de error
      if (context?.previousItems) {
        queryClient.setQueryData(['carrito'], context.previousItems);
      }
      setNotification({
        message: 'Error al eliminar el producto del carrito',
        type: 'error',
      });
    },
    onSuccess: () => {
      setNotification({
        message: 'Producto eliminado del carrito',
        type: 'success',
      });
    },
    onSettled: () => {
      // Invalidar y refetch
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });

  // Mutación para actualizar cantidad con optimistic update
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, cantidad }) => {
      return await updateCarritoItem(itemId, cantidad);
    },
    onMutate: async ({ itemId, cantidad }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['carrito'] });

      // Snapshot del valor anterior
      const previousItems = queryClient.getQueryData(['carrito']);

      // Optimistic update
      queryClient.setQueryData(['carrito'], (old) => {
        return old.map((item) =>
          item.id === itemId
            ? {
                ...item,
                cantidad: cantidad,
                subtotal: parseFloat(item.producto.precio) * cantidad,
              }
            : item
        );
      });

      return { previousItems };
    },
    onError: (err, variables, context) => {
      // Rollback en caso de error
      if (context?.previousItems) {
        queryClient.setQueryData(['carrito'], context.previousItems);
      }
      const errorMessage =
        err.response?.data?.error || 'Error al actualizar la cantidad';
      setNotification({
        message: errorMessage,
        type: 'error',
      });
    },
    onSuccess: () => {
      // Invalidar para obtener datos actualizados
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });

  // Mutación para checkout
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      return await checkout();
    },
    onSuccess: (data) => {
      setNotification({
        message: data.message || 'Funcionalidad de compra actualmente en desarrollo',
        type: 'info',
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Funcionalidad de compra actualmente en desarrollo';
      setNotification({
        message,
        type: 'info',
      });
    },
  });

  const handleRemove = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const handleQuantityChange = (itemId, newCantidad) => {
    if (newCantidad < 1) {
      setNotification({
        message: 'La cantidad debe ser al menos 1',
        type: 'error',
      });
      return;
    }
    updateQuantityMutation.mutate({ itemId, cantidad: newCantidad });
  };

  const handleIncrement = (item) => {
    const newCantidad = item.cantidad + 1;
    handleQuantityChange(item.id, newCantidad);
  };

  const handleDecrement = (item) => {
    const newCantidad = item.cantidad - 1;
    if (newCantidad >= 1) {
      handleQuantityChange(item.id, newCantidad);
    }
  };

  const handleCheckout = () => {
    checkoutMutation.mutate();
  };

  // Prefetch producto al pasar el mouse
  const handleProductHover = (productoId) => {
    queryClient.prefetchQuery({
      queryKey: ['producto', productoId],
      queryFn: async () => {
        const { getProducto } = await import('../services/productService');
        return await getProducto(productoId);
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>Error al cargar el carrito</h4>
          <p>{error.message || 'Ocurrió un error al cargar el carrito'}</p>
          <button className="btn btn-primary" onClick={() => queryClient.invalidateQueries({ queryKey: ['carrito'] })}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="display-4 mb-4">Mi Carrito</h1>

      {items.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>Tu carrito está vacío</h4>
          <p>Explora nuestro catálogo y añade productos a tu carrito.</p>
          <Link to="/" className="btn btn-primary">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {items.map((item) => {
              const imagenUrl = `/images/${item.producto.imagen}`;
              return (
                <div key={item.id} className="card mb-3 shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-3">
                      <img
                        src={imagenUrl}
                        className="img-fluid rounded-start"
                        alt={item.producto.nombre}
                        style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Imagen+no+disponible';
                        }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link
                            to={`/producto/${item.producto.id}`}
                            onMouseEnter={() => handleProductHover(item.producto.id)}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {item.producto.nombre}
                          </Link>
                        </h5>
                        <p className="card-text text-muted">{item.producto.autor}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            Precio unitario: ${parseFloat(item.producto.precio).toFixed(2)}
                            {item.producto.stock !== undefined && (
                              <> | Stock disponible: {item.producto.stock}</>
                            )}
                          </small>
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <span className="fw-bold">Cantidad:</span>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleDecrement(item)}
                                disabled={updateQuantityMutation.isPending || item.cantidad <= 1}
                              >
                                -
                              </button>
                              <span className="btn btn-outline-secondary btn-sm disabled">
                                {item.cantidad}
                              </span>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleIncrement(item)}
                                disabled={
                                  updateQuantityMutation.isPending ||
                                  (item.producto.stock !== undefined &&
                                    item.cantidad >= item.producto.stock)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-end">
                            <h5 className="text-primary mb-0">
                              Subtotal: ${parseFloat(item.subtotal).toFixed(2)}
                            </h5>
                            <button
                              className="btn btn-danger btn-sm mt-2"
                              onClick={() => handleRemove(item.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Resumen del Pedido</h5>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Total de items:</span>
                  <strong>{items.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total:</span>
                  <strong className="text-primary fs-4">${total.toFixed(2)}</strong>
                </div>
                <hr />
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? 'Procesando...' : 'Proceder al Checkout'}
                </button>
                <Link to="/" className="btn btn-outline-secondary w-100">
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
