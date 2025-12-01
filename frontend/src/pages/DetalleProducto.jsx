import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getProducto } from '../services/productService';
import { addToCarrito, getCarrito } from '../services/cartService';
import Notification from '../components/Notification';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [notification, setNotification] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cantidadEnCarrito, setCantidadEnCarrito] = useState(0);

  // Query para obtener el carrito y verificar si el producto ya está en él
  const { data: carritoData } = useQuery({
    queryKey: ['carrito'],
    queryFn: async () => {
      try {
        const data = await getCarrito();
        return Array.isArray(data) ? data : (data.results || []);
      } catch (error) {
        console.error('Error cargando carrito:', error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    loadProducto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Actualizar cantidad en carrito cuando cambia el carrito o el producto
  useEffect(() => {
    if (producto && carritoData) {
      const itemEnCarrito = carritoData.find(item => item.producto.id === producto.id);
      setCantidadEnCarrito(itemEnCarrito ? itemEnCarrito.cantidad : 0);
    } else {
      setCantidadEnCarrito(0);
    }
  }, [producto, carritoData]);

  const loadProducto = async () => {
    try {
      const data = await getProducto(id);
      setProducto(data);
      // Resetear cantidad cuando cambia el producto
      setCantidad(1);
    } catch (error) {
      console.error('Error cargando producto:', error);
      setNotification({ message: 'Error al cargar el producto', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    if (producto && producto.stock !== undefined) {
      // Stock disponible = stock total - cantidad ya en carrito
      const stockDisponible = producto.stock - cantidadEnCarrito;
      if (cantidad < stockDisponible) {
        setCantidad(cantidad + 1);
        // Limpiar notificación si había una
        if (notification && notification.type === 'warning') {
          setNotification(null);
        }
      } else {
        setNotification({
          message: `Solo puedes agregar ${stockDisponible} unidad${stockDisponible === 1 ? '' : 'es'} más. Ya tienes ${cantidadEnCarrito} en el carrito.`,
          type: 'warning',
        });
      }
    } else {
      setCantidad(cantidad + 1);
    }
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (producto && producto.stock !== undefined) {
      // Stock disponible = stock total - cantidad ya en carrito
      const stockDisponible = producto.stock - cantidadEnCarrito;
      if (value > stockDisponible) {
        setNotification({
          message: `Solo puedes agregar ${stockDisponible} unidad${stockDisponible === 1 ? '' : 'es'} más. Ya tienes ${cantidadEnCarrito} en el carrito.`,
          type: 'warning',
        });
        setCantidad(Math.max(1, stockDisponible));
      } else if (value < 1) {
        setCantidad(1);
      } else {
        setCantidad(value);
        // Limpiar notificación si había una
        if (notification && notification.type === 'warning') {
          setNotification(null);
        }
      }
    } else {
      setCantidad(Math.max(1, value));
    }
  };

  const handleAddToCart = async () => {
    if (!producto) return;

    // Stock disponible = stock total - cantidad ya en carrito
    const stockDisponible = producto.stock !== undefined 
      ? producto.stock - cantidadEnCarrito 
      : null;

    // Validar stock antes de añadir
    if (stockDisponible !== null && cantidad > stockDisponible) {
      setNotification({
        message: `Solo puedes agregar ${stockDisponible} unidad${stockDisponible === 1 ? '' : 'es'} más. Ya tienes ${cantidadEnCarrito} en el carrito.`,
        type: 'error',
      });
      setCantidad(Math.max(1, stockDisponible));
      return;
    }

    if (cantidad < 1) {
      setNotification({
        message: 'La cantidad debe ser al menos 1',
        type: 'error',
      });
      return;
    }

    setAddingToCart(true);
    try {
      await addToCarrito(producto.id, cantidad);
      
      // Invalidar y refetch el carrito para actualizar el contador en el Navbar y la cantidad en carrito
      await queryClient.invalidateQueries({ queryKey: ['carrito'] });
      
      // Disparar evento personalizado para actualizar el Navbar
      window.dispatchEvent(new CustomEvent('carritoUpdated'));
      
      setNotification({
        message: `${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} añadida${cantidad === 1 ? '' : 's'} al carrito`,
        type: 'success',
      });
      
      // Resetear cantidad después de añadir para permitir agregar más
      setCantidad(1);
    } catch (error) {
      console.error('Error añadiendo al carrito:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al añadir al carrito';
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>Producto no encontrado</h4>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const imagenUrl = `/images/${producto.imagen}`;

  return (
    <div className="container my-5">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/')}>
        ← Volver
      </button>

      <div className="row">
        <div className="col-md-6">
          <img
            src={imagenUrl}
            className="img-fluid rounded shadow"
            alt={producto.nombre}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x700?text=Imagen+no+disponible';
            }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-5 mb-3">{producto.nombre}</h1>
          <h3 className="text-muted mb-3">{producto.autor}</h3>
          <p className="mb-3">
            <span className="badge bg-primary fs-6">{producto.categoria.nombre}</span>
          </p>
          <p className="lead mb-4">{producto.descripcion}</p>

          {producto.contraportada && (
            <div className="mb-4">
              <h4 className="mb-3">Sobre este libro</h4>
              <div className="card bg-light border-0 p-4">
                <p className="mb-0" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                  {producto.contraportada}
                </p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-primary mb-3">${parseFloat(producto.precio).toFixed(2)}</h2>
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="text-muted">
                Stock disponible: <strong className="text-dark">{producto.stock}</strong>
              </span>
              {cantidadEnCarrito > 0 && (
                <span className="badge bg-info text-white">
                  <i className="fas fa-shopping-cart me-1"></i>
                  {cantidadEnCarrito} en el carrito
                </span>
              )}
              {producto.stock > 0 && producto.stock < 10 && (
                <span className="badge bg-warning text-dark">
                  <i className="fas fa-exclamation-triangle me-1"></i>Últimas unidades
                </span>
              )}
              {producto.stock === 0 && (
                <span className="badge bg-danger">
                  <i className="fas fa-times-circle me-1"></i>Sin Stock
                </span>
              )}
            </div>
            {cantidadEnCarrito > 0 && (
              <div className="alert alert-info mb-3">
                <i className="fas fa-info-circle me-2"></i>
                Ya tienes <strong>{cantidadEnCarrito}</strong> unidad{cantidadEnCarrito === 1 ? '' : 'es'} de este producto en tu carrito.
                Puedes agregar hasta <strong>{producto.stock - cantidadEnCarrito}</strong> unidad{(producto.stock - cantidadEnCarrito) === 1 ? '' : 'es'} más.
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold mb-3">
              <i className="fas fa-shopping-cart me-2"></i>Cantidad:
            </label>
            <div className="d-flex align-items-center gap-3">
              <div className="btn-group" role="group" style={{ maxWidth: '200px' }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleDecrement}
                  disabled={cantidad <= 1 || addingToCart}
                  style={{ minWidth: '45px' }}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input
                  type="number"
                  className="form-control text-center fw-bold"
                  value={cantidad}
                  onChange={handleQuantityChange}
                  min="1"
                  max={producto.stock !== undefined ? producto.stock - cantidadEnCarrito : undefined}
                  disabled={addingToCart || producto.stock === 0 || (producto.stock !== undefined && producto.stock - cantidadEnCarrito <= 0)}
                  style={{
                    maxWidth: '80px',
                    fontSize: '1.1rem',
                    borderLeft: 'none',
                    borderRight: 'none',
                  }}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleIncrement}
                  disabled={
                    addingToCart ||
                    producto.stock === 0 ||
                    (producto.stock !== undefined && cantidad >= producto.stock - cantidadEnCarrito)
                  }
                  style={{ minWidth: '45px' }}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              {producto.stock !== undefined && (
                <span className="text-muted small">
                  Máx: {producto.stock - cantidadEnCarrito} unidad{(producto.stock - cantidadEnCarrito) === 1 ? '' : 'es'} disponibles para agregar
                </span>
              )}
            </div>
            {producto.stock !== undefined && cantidad > 0 && (
              <div className="mt-2">
                <p className="text-muted mb-0 small">
                  Subtotal: <strong className="text-primary">
                    ${(parseFloat(producto.precio) * cantidad).toFixed(2)}
                  </strong>
                </p>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={handleAddToCart}
            disabled={
              producto.stock === 0 || 
              addingToCart || 
              cantidad < 1 || 
              (producto.stock !== undefined && cantidad > producto.stock - cantidadEnCarrito)
            }
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}
          >
            {addingToCart ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Añadiendo...
              </>
            ) : producto.stock === 0 ? (
              <>
                <i className="fas fa-times-circle me-2"></i>Sin Stock Disponible
              </>
            ) : (
              <>
                <i className="fas fa-cart-plus me-2"></i>
                Añadir {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} al Carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;

