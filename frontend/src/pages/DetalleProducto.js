import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducto } from '../services/productService';
import { addToCarrito } from '../services/cartService';
import Notification from '../components/Notification';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadProducto();
  }, [id]);

  const loadProducto = async () => {
    try {
      const data = await getProducto(id);
      setProducto(data);
    } catch (error) {
      console.error('Error cargando producto:', error);
      setNotification({ message: 'Error al cargar el producto', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCarrito(producto.id, cantidad);
      setNotification({ message: 'Producto añadido al carrito', type: 'success' });
    } catch (error) {
      console.error('Error añadiendo al carrito:', error);
      setNotification({ message: 'Error al añadir al carrito', type: 'error' });
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

          <div className="mb-4">
            <h2 className="text-primary">${parseFloat(producto.precio).toFixed(2)}</h2>
            <p className="text-muted">
              Stock disponible: <strong>{producto.stock}</strong>
            </p>
          </div>

          <div className="mb-4">
            <label className="form-label">Cantidad:</label>
            <div className="input-group" style={{ maxWidth: '150px' }}>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={producto.stock}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={handleAddToCart}
            disabled={producto.stock === 0}
          >
            {producto.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;

