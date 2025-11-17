import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agregarFavorito, eliminarFavorito, esFavorito } from '../services/favoritosService';

const ProductCard = ({ producto, onFavoritoChange }) => {
  const [esFav, setEsFav] = useState(false);
  const imagenUrl = `/images/${producto.imagen}`;

  useEffect(() => {
    setEsFav(esFavorito(producto.id));
  }, [producto.id]);

  const handleFavoritoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (esFav) {
      eliminarFavorito(producto.id);
      setEsFav(false);
    } else {
      agregarFavorito(producto);
      setEsFav(true);
    }
    
    // Notificar al componente padre si hay callback
    if (onFavoritoChange) {
      onFavoritoChange();
    }
  };

  return (
    <div className="card h-100 shadow-sm position-relative">
      <button
        className="btn btn-favorito"
        onClick={handleFavoritoClick}
        aria-label={esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        title={esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <i className={`fas fa-heart ${esFav ? 'text-danger' : 'text-muted'}`}></i>
      </button>
      <Link to={`/producto/${producto.id}`} className="text-decoration-none text-dark">
        <img
          src={imagenUrl}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: '400px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=Imagen+no+disponible';
          }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{producto.nombre}</h5>
          <p className="card-text text-muted mb-2">{producto.autor}</p>
          <p className="card-text">
            <span className="badge bg-primary">{producto.categoria.nombre}</span>
          </p>
          {producto.contraportada && (
            <p className="card-text text-muted small mb-3" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '60px'
            }}>
              {producto.contraportada}
            </p>
          )}
          <div className="mt-auto">
            <h4 className="text-primary mb-0">${parseFloat(producto.precio).toFixed(2)}</h4>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

