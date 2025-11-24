import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getProductos, getCategorias } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Notification from '../components/Notification';

const Home = () => {
  const { categoriaId } = useParams(); // Obtener el ID de categoría de la URL
  const queryClient = useQueryClient();
  const [productos, setProductos] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [filtros, setFiltros] = useState({
    precio_min: '',
    precio_max: '',
    search: '',
    ordering: '',
  });
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Prefetch producto al pasar el mouse
  const handleProductoHover = (productoId) => {
    queryClient.prefetchQuery({
      queryKey: ['producto', productoId],
      queryFn: async () => {
        const { getProducto } = await import('../services/productService');
        return await getProducto(productoId);
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  useEffect(() => {
    loadCategorias();
    if (!categoriaId) {
      loadProductosDestacados();
      loadProductos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Si hay un categoriaId en la URL, encontrar la categoría seleccionada
    if (categoriaId && categorias.length > 0) {
      const categoria = categorias.find(cat => cat.id === parseInt(categoriaId));
      setCategoriaSeleccionada(categoria);
      setMostrarFiltros(true); // Mostrar filtros automáticamente cuando hay categoría seleccionada
      loadProductos();
    } else if (!categoriaId) {
      setCategoriaSeleccionada(null);
      setMostrarFiltros(false); // Ocultar filtros cuando no hay categoría
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId, categorias]);

  useEffect(() => {
    if (mostrarFiltros || categoriaId) {
      loadProductos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.precio_min, filtros.precio_max, filtros.search, filtros.ordering, mostrarFiltros, categoriaId]);

  const loadCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const data = await getCategorias();
      const categoriasArray = Array.isArray(data) ? data : (data.results || []);
      setCategorias(categoriasArray);
      
      // Si hay categoriaId en la URL, encontrar la categoría
      if (categoriaId) {
        const categoria = categoriasArray.find(cat => cat.id === parseInt(categoriaId));
        setCategoriaSeleccionada(categoria);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategorias([]);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const loadProductosDestacados = async () => {
    setLoadingDestacados(true);
    try {
      const data = await getProductos({ ordering: '-created_at' });
      const productosArray = Array.isArray(data) ? data : (data.results || []);
      setProductosDestacados(productosArray.slice(0, 4)); // Primeros 4 productos más recientes
    } catch (error) {
      console.error('Error cargando productos destacados:', error);
      setProductosDestacados([]);
    } finally {
      setLoadingDestacados(false);
    }
  };

  const loadProductos = async (url = null) => {
    setLoading(true);
    try {
      const params = url ? {} : { ...filtros };
      // Si hay categoriaId en la URL, agregarlo a los parámetros
      if (categoriaId && !url) {
        params.categoria = categoriaId;
      }
      const data = url
        ? await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((res) => res.json())
        : await getProductos(params);

      setProductos(Array.isArray(data) ? data : (data.results || data || []));
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProductos([]);
      setNotification({ 
        message: error.message || 'Error al cargar productos. Verifica que el backend esté corriendo en http://localhost:8000', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFiltros({
      precio_min: '',
      precio_max: '',
      search: '',
      ordering: '',
    });
  };

  const scrollToProductos = () => {
    const element = document.getElementById('seccion-productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Hero Section - Solo mostrar si no hay categoría seleccionada */}
      {!categoriaId && (
        <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6">
              <h1 className="hero-title">Bienvenido a Story Haven Alex</h1>
              <p className="hero-subtitle">
                Tu librería online donde cada página cuenta una historia. 
                Descubre mundos infinitos entre las páginas de nuestros libros, mangas, 
                novelas gráficas y cómics cuidadosamente seleccionados.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary btn-lg me-3" onClick={scrollToProductos}>
                  Explorar Catálogo
                </button>
                <Link to="/carrito" className="btn btn-outline-light btn-lg">
                  Ver Carrito
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image">
                <div className="hero-icon-wrapper">
                  <i className="fas fa-book-open hero-icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Historia Section - Solo mostrar si no hay categoría seleccionada */}
      {!categoriaId && (
        <section className="historia-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="section-title mb-4">Nuestra Historia</h2>
              <div className="historia-content">
                <p className="lead">
                  Story Haven Alex nació de la pasión por compartir historias que inspiran, 
                  emocionan y transforman. Somos más que una librería; somos un refugio para 
                  los amantes de la lectura, un lugar donde cada libro encuentra a su lector 
                  y cada lector encuentra su próxima aventura.
                </p>
                <p>
                  Desde clásicos literarios hasta los últimos lanzamientos de mangas, 
                  desde novelas gráficas que desafían la imaginación hasta cómics que 
                  capturan la esencia de nuestros héroes favoritos. En Story Haven Alex, 
                  creemos que cada historia merece ser contada y cada lector merece encontrar 
                  exactamente lo que busca.
                </p>
                <p className="mb-0">
                  Únete a nuestra comunidad de lectores apasionados y descubre por qué 
                  decimos que aquí, cada página es una puerta a otro mundo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Productos Destacados - Solo mostrar si no hay categoría seleccionada */}
      {!categoriaId && (
        <section className="destacados-section py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="section-title">Productos Destacados</h2>
              <p className="section-subtitle">Descubre nuestras últimas incorporaciones</p>
            </div>
          </div>
          {loadingDestacados ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : productosDestacados.length > 0 ? (
            <div className="row g-4">
              {productosDestacados.map((producto) => (
                <div
                  key={producto.id}
                  className="col-md-6 col-lg-3"
                  onMouseEnter={() => handleProductoHover(producto.id)}
                >
                  <ProductCard producto={producto} />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info text-center">
              <p>No hay productos destacados disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Sección de Productos Completa */}
      <section id="seccion-productos" className="productos-section py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              {categoriaSeleccionada ? (
                <>
                  <h2 className="section-title">Productos de {categoriaSeleccionada.nombre}</h2>
                  <p className="section-subtitle">
                    {categoriaSeleccionada.descripcion || `Explora todos los productos de ${categoriaSeleccionada.nombre}`}
                  </p>
                  <div className="mt-3">
                    <Link to="/" className="btn btn-outline-secondary me-2">
                      <i className="fas fa-arrow-left me-2"></i>Ver Todas las Categorías
                    </Link>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    >
                      <i className="fas fa-filter me-2"></i>
                      {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="section-title">Nuestro Catálogo Completo</h2>
                  <p className="section-subtitle">Explora todos nuestros productos</p>
                  <button
                    className="btn btn-outline-primary mt-3"
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  >
                    {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filtros - Siempre mostrar si hay categoría seleccionada */}
          {(mostrarFiltros || categoriaId) && (
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">
                  <i className="fas fa-filter me-2"></i>Filtros de Búsqueda
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Buscar</label>
                    <input
                      type="text"
                      className="form-control"
                      name="search"
                      value={filtros.search}
                      onChange={handleFilterChange}
                      placeholder="Nombre o autor..."
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Precio Mín</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio_min"
                      value={filtros.precio_min}
                      onChange={handleFilterChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Precio Máx</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio_max"
                      value={filtros.precio_max}
                      onChange={handleFilterChange}
                      placeholder="999"
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Ordenar</label>
                    <select
                      className="form-select"
                      name="ordering"
                      value={filtros.ordering}
                      onChange={handleFilterChange}
                    >
                      <option value="">Por defecto</option>
                      <option value="precio">Precio: Menor a Mayor</option>
                      <option value="-precio">Precio: Mayor a Menor</option>
                      <option value="nombre">Nombre: A-Z</option>
                      <option value="-nombre">Nombre: Z-A</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-secondary mt-3" onClick={clearFilters}>
                  <i className="fas fa-times me-2"></i>Limpiar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Productos */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : productos.length === 0 ? (
            <div className="alert alert-info text-center">
              <h4>No se encontraron productos</h4>
              <p>Intenta ajustar los filtros de búsqueda.</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="col-md-4 col-lg-3"
                    onMouseEnter={() => handleProductoHover(producto.id)}
                  >
                    <ProductCard producto={producto} />
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {(nextPage || prevPage) && (
                <div className="d-flex justify-content-center mt-5 gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => loadProductos(prevPage)}
                    disabled={!prevPage}
                  >
                    <i className="fas fa-arrow-left me-2"></i>Anterior
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => loadProductos(nextPage)}
                    disabled={!nextPage}
                  >
                    Siguiente<i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
