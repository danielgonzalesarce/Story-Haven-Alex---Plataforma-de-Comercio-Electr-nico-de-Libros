import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCarrito, removeFromCarrito, updateCarritoItem, checkout } from '../services/cartService';
import { isAuthenticated } from '../services/authService';
import Notification from '../components/Notification';

const Carrito = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState(null);

  // Query para obtener el carrito con refetch automático
  const { data: carritoData, isLoading, error, refetch } = useQuery({
    queryKey: ['carrito'],
    queryFn: async () => {
      const data = await getCarrito();
      return Array.isArray(data) ? data : (data.results || []);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Escuchar eventos de actualización del carrito
  useEffect(() => {
    const handleCarritoUpdate = () => {
      refetch();
    };
    
    window.addEventListener('carritoUpdated', handleCarritoUpdate);
    return () => {
      window.removeEventListener('carritoUpdated', handleCarritoUpdate);
    };
  }, [refetch]);

  const items = carritoData || [];
  const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  const totalItems = items.reduce((sum, item) => sum + (item.cantidad || 1), 0);

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
      // Disparar evento para actualizar el Navbar
      window.dispatchEvent(new CustomEvent('carritoUpdated'));
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
      // Disparar evento para actualizar el Navbar
      window.dispatchEvent(new CustomEvent('carritoUpdated'));
    },
  });

  // Mutación para checkout
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      return await checkout('stripe');
    },
    onSuccess: (data) => {
      setNotification({
        message: data.message || 'Compra realizada exitosamente',
        type: 'success',
      });
      // Invalidar queries del carrito y compras
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
      queryClient.invalidateQueries({ queryKey: ['compras'] });
      // Disparar evento para actualizar el Navbar
      window.dispatchEvent(new CustomEvent('carritoUpdated'));
      // Redirigir al historial después de 2 segundos
      setTimeout(() => {
        navigate('/historial');
      }, 2000);
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Error al procesar la compra. Por favor, intenta nuevamente.';
      setNotification({
        message,
        type: 'error',
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
    if (!isAuthenticated()) {
      setNotification({
        message: 'Debes iniciar sesión para realizar una compra',
        type: 'warning',
      });
      setTimeout(() => {
        navigate('/acceder');
      }, 2000);
      return;
    }
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
    <div className="carrito-page">
      <div className="container py-4">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="carrito-title mb-0">
            <i className="fas fa-shopping-cart me-2"></i>Mi Carrito
          </h1>
          <span className="carrito-badge-count badge bg-primary rounded-pill">
            {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="carrito-vacio">
            <div className="text-center py-5">
              <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
              <h3 className="mb-3">Tu carrito está vacío</h3>
              <p className="text-muted mb-4">Explora nuestro catálogo y añade productos a tu carrito.</p>
              <Link to="/" className="btn btn-primary btn-lg">
                <i className="fas fa-book me-2"></i>Ir al Catálogo
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="carrito-items">
                {items.map((item) => {
                  const imagenUrl = `/images/${item.producto.imagen}`;
                  return (
                    <div key={item.id} className="carrito-item-card">
                      <div className="carrito-item-image">
                        <Link to={`/producto/${item.producto.id}`} onMouseEnter={() => handleProductHover(item.producto.id)}>
                          <img
                            src={imagenUrl}
                            alt={item.producto.nombre}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/120x160?text=Imagen+no+disponible';
                            }}
                          />
                        </Link>
                      </div>
                      <div className="carrito-item-content">
                        <div className="carrito-item-header">
                          <Link
                            to={`/producto/${item.producto.id}`}
                            onMouseEnter={() => handleProductHover(item.producto.id)}
                            className="carrito-item-title"
                          >
                            {item.producto.nombre}
                          </Link>
                          <button
                            className="carrito-item-remove"
                            onClick={() => handleRemove(item.id)}
                            disabled={deleteMutation.isPending}
                            title="Eliminar del carrito"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <p className="carrito-item-author">{item.producto.autor}</p>
                        <div className="carrito-item-info">
                          <span className="carrito-item-price">
                            ${parseFloat(item.producto.precio).toFixed(2)}
                            <small className="text-muted ms-1">c/u</small>
                          </span>
                          {item.producto.stock !== undefined && (
                            <span className="carrito-item-stock">
                              <i className="fas fa-box me-1"></i>
                              Stock: {item.producto.stock}
                            </span>
                          )}
                        </div>
                        <div className="carrito-item-actions">
                          <div className="carrito-quantity-control">
                            <label className="carrito-quantity-label">Cantidad:</label>
                            <div className="quantity-buttons">
                              <button
                                className="quantity-btn"
                                onClick={() => handleDecrement(item)}
                                disabled={updateQuantityMutation.isPending || item.cantidad <= 1}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span className="quantity-value">{item.cantidad}</span>
                              <button
                                className="quantity-btn"
                                onClick={() => handleIncrement(item)}
                                disabled={
                                  updateQuantityMutation.isPending ||
                                  (item.producto.stock !== undefined && item.cantidad >= item.producto.stock)
                                }
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="carrito-item-subtotal">
                            <span className="subtotal-label">Subtotal:</span>
                            <span className="subtotal-value">${parseFloat(item.subtotal).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="carrito-summary-card">
                <div className="carrito-summary-header">
                  <h5 className="mb-0">
                    <i className="fas fa-receipt me-2"></i>Resumen del Pedido
                  </h5>
                </div>
                <div className="carrito-summary-body">
                  <div className="summary-row">
                    <span>Productos diferentes:</span>
                    <strong>{items.length}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Total de unidades:</span>
                    <strong>{totalItems}</strong>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-total">
                    <span>Total a pagar:</span>
                    <strong className="total-amount">${total.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="carrito-summary-footer">
                  <button
                    className="btn btn-checkout w-100 mb-3"
                    onClick={handleCheckout}
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-credit-card me-2"></i>
                        Proceder al Checkout
                      </>
                    )}
                  </button>
                  <Link to="/" className="btn btn-continue-shopping w-100">
                    <i className="fas fa-arrow-left me-2"></i>
                    Seguir Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
