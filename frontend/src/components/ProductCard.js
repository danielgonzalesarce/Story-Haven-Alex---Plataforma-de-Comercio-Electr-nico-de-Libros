import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ producto }) => {
  const imagenUrl = `/images/${producto.imagen}`;

  return (
    <div className="card h-100 shadow-sm">
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
          <div className="mt-auto">
            <h4 className="text-primary mb-0">${parseFloat(producto.precio).toFixed(2)}</h4>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

