# 📚 Story Haven Alex - Plataforma de Comercio Electrónico

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.2.8-green.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.16.1-red.svg)](https://www.django-rest-framework.org/)

Una plataforma de comercio electrónico completa (full-stack) para una librería online, desarrollada con Django REST Framework en el backend y React en el frontend.

🔗 **Repositorio:** [GitHub](https://github.com/danielgonzalesarce/Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Modelos de Datos](#-modelos-de-datos)
- [Características del Diseño](#-características-del-diseño)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Desarrollo](#-desarrollo)
- [Pruebas](#-pruebas)
- [Despliegue](#-despliegue)
- [Contribuciones](#-contribuciones)
- [Licencia](#-licencia)
- [Autor](#-autor)

---

## 🎯 Descripción

**Story Haven Alex** es una aplicación web moderna y completa que permite a los usuarios explorar, buscar y comprar libros, mangas, novelas gráficas y cómics. La plataforma ofrece una experiencia de usuario fluida con un sistema robusto de autenticación, gestión de carrito de compras, historial de pedidos y mucho más.

### ¿Por qué Story Haven Alex?

- 🛒 **Carrito inteligente**: Funciona tanto para usuarios registrados como invitados
- 🔐 **Autenticación segura**: Sistema JWT para máxima seguridad
- 📱 **Diseño responsive**: Optimizado para todos los dispositivos
- 🎨 **Interfaz moderna**: Diseño profesional con animaciones suaves
- 🔍 **Búsqueda avanzada**: Filtros por categoría, precio y búsqueda por nombre/autor
- 📚 **Catálogo completo**: Más de 25 productos de ejemplo incluidos
- 💳 **Sistema de compras**: Historial completo de pedidos
- ⭐ **Favoritos**: Guarda tus productos favoritos

---

## ✨ Características Principales

### 🔧 Backend (Django REST Framework)

#### Autenticación y Usuarios
- ✅ Sistema de autenticación con JWT (JSON Web Tokens)
- ✅ Registro de nuevos usuarios
- ✅ Login seguro con tokens de acceso y refresh
- ✅ Gestión de perfiles de usuario
- ✅ Panel de administración Django completo

#### Gestión de Productos
- ✅ CRUD completo de productos
- ✅ Categorización de productos (Libros, Mangas, Novelas Gráficas, Cómics, etc.)
- ✅ Búsqueda avanzada por nombre, autor y categoría
- ✅ Filtros por rango de precios
- ✅ Paginación y ordenamiento
- ✅ Gestión de stock
- ✅ Imágenes de productos y contraportadas

#### Carrito de Compras
- ✅ Carrito para usuarios autenticados (persistente en BD)
- ✅ Carrito para usuarios invitados (session-based)
- ✅ Gestión de cantidades
- ✅ Cálculo automático de totales
- ✅ Validación de stock disponible

#### Sistema de Compras
- ✅ Proceso de checkout completo
- ✅ Registro de compras en base de datos
- ✅ Historial de compras por usuario
- ✅ Detalles de cada compra (items, precios, fechas)
- ✅ Estados de compra (pendiente, completada, cancelada)
- ✅ Métodos de pago configurables

#### API RESTful
- ✅ Endpoints RESTful bien estructurados
- ✅ Serializers para validación de datos
- ✅ Permisos y autenticación por endpoint
- ✅ CORS configurado para frontend
- ✅ Manejo de errores robusto

### 🎨 Frontend (React)

#### Páginas Principales
- ✅ **Home**: Página de inicio con hero section, historia y productos destacados
- ✅ **Catálogo**: Vista completa de productos con filtros avanzados
- ✅ **Detalle de Producto**: Vista detallada con descripción completa y contraportada
- ✅ **Carrito**: Gestión completa del carrito de compras
- ✅ **Favoritos**: Lista de productos guardados como favoritos
- ✅ **Historial de Compras**: Todas las compras realizadas por el usuario
- ✅ **Perfil**: Gestión del perfil de usuario

#### Autenticación
- ✅ Página de Login con validación
- ✅ Página de Registro con validación de formularios
- ✅ Manejo de tokens JWT
- ✅ Protección de rutas privadas
- ✅ Logout seguro

#### Páginas Informativas
- ✅ **Sobre Nosotros**: Información sobre la tienda
- ✅ **Contacto**: Formulario de contacto
- ✅ **Preguntas Frecuentes**: FAQ completo
- ✅ **Política de Privacidad**: Términos y condiciones

#### Componentes Reutilizables
- ✅ **Navbar**: Navegación principal con carrito y usuario
- ✅ **Footer**: Pie de página con enlaces importantes
- ✅ **ProductCard**: Tarjeta de producto reutilizable
- ✅ **Notification**: Sistema de notificaciones toast
- ✅ **ErrorBoundary**: Manejo de errores de React

#### Características de UX/UI
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Animaciones suaves y transiciones
- ✅ Notificaciones visuales para acciones del usuario
- ✅ Loading states y manejo de errores
- ✅ Búsqueda en tiempo real
- ✅ Filtros interactivos
- ✅ Gradientes modernos y paleta de colores profesional

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Python** | 3.8+ | Lenguaje de programación |
| **Django** | 5.2.8 | Framework web |
| **Django REST Framework** | 3.16.1 | API RESTful |
| **djangorestframework-simplejwt** | 5.5.1 | Autenticación JWT |
| **django-cors-headers** | 4.9.0 | Configuración CORS |
| **SQLite** | - | Base de datos (desarrollo) |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Biblioteca UI |
| **React Router DOM** | 7.9.5 | Enrutamiento |
| **Axios** | 1.13.2 | Cliente HTTP |
| **Bootstrap** | 5.3.8 | Framework CSS |
| **@tanstack/react-query** | 5.90.10 | Gestión de estado del servidor |
| **React Scripts** | 5.0.1 | Build tools |

### Herramientas de Desarrollo

- **Git** - Control de versiones
- **npm/yarn** - Gestión de paquetes Node.js
- **pip** - Gestión de paquetes Python
- **venv** - Entornos virtuales Python

---

## 📁 Estructura del Proyecto

```
Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros/
│
├── backend/                          # Backend Django
│   ├── backend/                      # Configuración del proyecto
│   │   ├── __init__.py
│   │   ├── settings.py               # Configuración Django
│   │   ├── urls.py                   # URLs principales
│   │   ├── wsgi.py                   # WSGI config
│   │   └── asgi.py                   # ASGI config
│   │
│   ├── tienda/                       # App principal de la tienda
│   │   ├── __init__.py
│   │   ├── models.py                 # Modelos: Producto, Categoria, CarritoItem, Compra
│   │   ├── views.py                  # Vistas/Endpoints API
│   │   ├── serializers.py            # Serializers DRF
│   │   ├── urls.py                   # URLs de la app
│   │   ├── admin.py                  # Configuración admin Django
│   │   ├── tests.py                  # Tests unitarios
│   │   │
│   │   ├── migrations/               # Migraciones de BD
│   │   │   ├── 0001_initial.py
│   │   │   ├── 0002_producto_contraportada.py
│   │   │   └── 0003_compra_compraitem.py
│   │   │
│   │   └── management/
│   │       └── commands/
│   │           └── poblar_datos.py  # Comando para poblar BD con datos de ejemplo
│   │
│   ├── manage.py                     # Script de gestión Django
│   ├── requirements.txt              # Dependencias Python
│   └── db.sqlite3                    # Base de datos SQLite (no incluido en git)
│
├── frontend/                         # Frontend React
│   ├── public/                       # Archivos públicos
│   │   ├── images/                   # Imágenes de productos (25 imágenes)
│   │   ├── logo.png                  # Logo de la tienda
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── src/                          # Código fuente React
│   │   ├── components/               # Componentes reutilizables
│   │   │   ├── Navbar.js             # Barra de navegación
│   │   │   ├── Footer.js             # Pie de página
│   │   │   ├── ProductCard.js        # Tarjeta de producto
│   │   │   ├── Notification.js       # Notificaciones toast
│   │   │   └── ErrorBoundary.js      # Manejo de errores
│   │   │
│   │   ├── pages/                    # Páginas principales
│   │   │   ├── Home.js                # Página de inicio
│   │   │   ├── DetalleProducto.js    # Detalle de producto
│   │   │   ├── Carrito.js            # Carrito de compras
│   │   │   ├── Favoritos.js          # Productos favoritos
│   │   │   ├── HistorialCompras.js   # Historial de compras
│   │   │   ├── Perfil.js             # Perfil de usuario
│   │   │   ├── Login.js              # Login
│   │   │   ├── Registro.js           # Registro
│   │   │   ├── Acceder.js            # Página de acceso
│   │   │   ├── Categorias.js         # Vista de categorías
│   │   │   ├── SobreNosotros.js      # Sobre nosotros
│   │   │   ├── Contacto.js           # Contacto
│   │   │   ├── PreguntasFrecuentes.js # FAQ
│   │   │   └── PoliticaPrivacidad.js # Política de privacidad
│   │   │
│   │   ├── services/                 # Servicios API
│   │   │   ├── api.js                # Configuración Axios
│   │   │   ├── authService.js        # Servicios de autenticación
│   │   │   ├── productService.js     # Servicios de productos
│   │   │   ├── cartService.js        # Servicios de carrito
│   │   │   ├── compraService.js      # Servicios de compras
│   │   │   └── categoriaService.js   # Servicios de categorías
│   │   │
│   │   ├── App.js                    # Componente principal
│   │   ├── App.css                   # Estilos principales
│   │   ├── index.js                  # Punto de entrada
│   │   └── index.css                 # Estilos globales
│   │
│   ├── package.json                  # Dependencias Node.js
│   └── package-lock.json
│
├── .gitignore                        # Archivos ignorados por Git
├── README.md                         # Este archivo
├── INSTALL.md                        # Guía de instalación detallada
├── LICENSE                           # Licencia MIT
├── install.sh                        # Script de instalación Linux/Mac
└── install.bat                       # Script de instalación Windows
```

---

## 🚀 Instalación

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.8 o superior** - [Descargar Python](https://www.python.org/downloads/)
- **Node.js 14+ y npm** - [Descargar Node.js](https://nodejs.org/)
- **Git** - [Descargar Git](https://git-scm.com/downloads)

### Verificar Instalaciones

```bash
python --version  # Debe mostrar Python 3.8 o superior
node --version    # Debe mostrar Node.js 14 o superior
npm --version     # Debe mostrar npm 6 o superior
git --version     # Debe mostrar Git instalado
```

### Opción 1: Instalación Automática (Recomendada)

#### Windows:
```bash
install.bat
```

#### Linux/Mac:
```bash
chmod +x install.sh
./install.sh
```

### Opción 2: Instalación Manual

#### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/danielgonzalesarce/Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros.git
cd Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros
```

#### Paso 2: Configurar el Backend

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Poblar base de datos con datos de ejemplo
python manage.py poblar_datos

# (Opcional) Crear superusuario para el panel de administración
python manage.py createsuperuser

# Iniciar servidor del backend
python manage.py runserver 8000
```

El backend estará disponible en: **http://localhost:8000**

#### Paso 3: Configurar el Frontend

Abre una **nueva terminal** (mantén el backend corriendo):

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend se abrirá automáticamente en: **http://localhost:3000**

> 📖 **Para más detalles:** Consulta la [Guía de Instalación Completa](INSTALL.md)

---

## 💻 Uso

### Acceso a la Aplicación

Una vez que ambos servidores estén corriendo:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Panel de Administración**: http://localhost:8000/admin/

### Funcionalidades Principales

1. **Explorar Productos**
   - Navega por el catálogo en la página principal
   - Usa los filtros para encontrar productos específicos
   - Haz clic en cualquier producto para ver detalles completos

2. **Carrito de Compras**
   - Añade productos al carrito (funciona sin registro)
   - Gestiona las cantidades desde el carrito
   - El carrito se guarda automáticamente

3. **Autenticación**
   - Regístrate creando una cuenta nueva
   - Inicia sesión con tus credenciales
   - Accede a funciones adicionales como historial de compras

4. **Compras**
   - Completa el proceso de checkout
   - Visualiza tu historial de compras
   - Revisa los detalles de cada compra

5. **Favoritos**
   - Guarda productos como favoritos
   - Accede a ellos desde tu perfil

---

## 📡 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/registro/` | Registro de nuevo usuario | No requerida |
| `POST` | `/api/auth/login/` | Inicio de sesión | No requerida |

**Ejemplo de registro:**
```json
POST /api/auth/registro/
{
  "username": "usuario",
  "email": "usuario@example.com",
  "password": "contraseña123",
  "password2": "contraseña123"
}
```

**Ejemplo de login:**
```json
POST /api/auth/login/
{
  "username": "usuario",
  "password": "contraseña123"
}
```

### Productos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/productos/` | Listado de productos (con filtros) | No requerida |
| `GET` | `/api/productos/{id}/` | Detalle de producto | No requerida |

**Filtros disponibles:**
- `?categoria={id}` - Filtrar por categoría
- `?precio_min={precio}` - Precio mínimo
- `?precio_max={precio}` - Precio máximo
- `?search={texto}` - Búsqueda por nombre o autor
- `?ordering={campo}` - Ordenar (precio, nombre, -precio, etc.)

### Categorías

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/categorias/` | Listado de categorías | No requerida |

### Carrito

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/carrito/` | Ver carrito del usuario | Requerida |
| `POST` | `/api/carrito/` | Añadir producto al carrito | Requerida |
| `PUT` | `/api/carrito/{id}/` | Actualizar cantidad | Requerida |
| `DELETE` | `/api/carrito/{id}/` | Eliminar item del carrito | Requerida |
| `GET` | `/api/carrito/total/` | Obtener total del carrito | Requerida |
| `POST` | `/api/carrito/checkout/` | Procesar compra | Requerida |

**Ejemplo de añadir al carrito:**
```json
POST /api/carrito/
{
  "producto": 1,
  "cantidad": 2
}
```

### Compras

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/compras/` | Historial de compras del usuario | Requerida |
| `GET` | `/api/compras/{id}/` | Detalle de compra específica | Requerida |

---

## 🗄️ Modelos de Datos

### Categoria
- `id` (PK)
- `nombre` (CharField, único)
- `descripcion` (TextField)
- `created_at` (DateTimeField)

### Producto
- `id` (PK)
- `nombre` (CharField)
- `autor` (CharField)
- `descripcion` (TextField)
- `contraportada` (TextField, opcional)
- `precio` (DecimalField)
- `imagen` (CharField - nombre del archivo)
- `categoria` (ForeignKey a Categoria)
- `stock` (IntegerField)
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

### CarritoItem
- `id` (PK)
- `usuario` (ForeignKey a User, opcional)
- `producto` (ForeignKey a Producto)
- `cantidad` (IntegerField)
- `session_key` (CharField, para usuarios invitados)
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

### Compra
- `id` (PK)
- `usuario` (ForeignKey a User)
- `total` (DecimalField)
- `fecha_compra` (DateTimeField)
- `estado` (CharField: pendiente, completada, cancelada)
- `metodo_pago` (CharField)

### CompraItem
- `id` (PK)
- `compra` (ForeignKey a Compra)
- `producto` (ForeignKey a Producto)
- `cantidad` (IntegerField)
- `precio_unitario` (DecimalField)
- `subtotal` (DecimalField)

---

## 🎨 Características del Diseño

### Paleta de Colores
- **Primario**: Gradientes modernos en tonos azules y púrpuras
- **Secundario**: Colores complementarios para acentos
- **Fondo**: Fondos claros y oscuros según el contexto
- **Texto**: Contraste optimizado para legibilidad

### Diseño Responsive
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación para tablets y desktop
- **Navegación**: Menú hamburguesa en móviles
- **Grid System**: Sistema de grid flexible con Bootstrap

### Componentes UI
- **Cards**: Tarjetas de producto con hover effects
- **Buttons**: Botones con estados (hover, active, disabled)
- **Forms**: Formularios con validación visual
- **Modals**: Modales para confirmaciones
- **Notifications**: Sistema de notificaciones toast

### Animaciones
- Transiciones suaves en hover
- Animaciones de carga
- Efectos de scroll
- Transiciones de página

---

## 📸 Capturas de Pantalla

> 💡 **Nota**: Las capturas de pantalla se pueden agregar aquí mostrando las diferentes secciones de la aplicación.

### Página de Inicio
- Hero section con llamada a la acción
- Sección de historia
- Productos destacados

### Catálogo de Productos
- Vista de grid de productos
- Filtros laterales
- Búsqueda en tiempo real

### Detalle de Producto
- Imagen grande del producto
- Información completa
- Botones de acción (añadir al carrito, favoritos)

### Carrito de Compras
- Lista de productos
- Resumen de totales
- Botón de checkout

---

## 🔧 Desarrollo

### Estructura de Desarrollo

1. **Backend**: Desarrollo en Django con DRF
   - Modelos en `tienda/models.py`
   - Vistas en `tienda/views.py`
   - Serializers en `tienda/serializers.py`

2. **Frontend**: Desarrollo en React
   - Componentes en `src/components/`
   - Páginas en `src/pages/`
   - Servicios API en `src/services/`

### Comandos Útiles

#### Backend
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Poblar datos de ejemplo
python manage.py poblar_datos

# Ejecutar servidor de desarrollo
python manage.py runserver 8000

# Ejecutar tests
python manage.py test
```

#### Frontend
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Crear build de producción
npm run build

# Ejecutar tests
npm test
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (no incluido en git):

```env
# Backend
SECRET_KEY=tu-secret-key-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 🧪 Pruebas

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 🚀 Despliegue

### Backend (Producción)

1. Configurar variables de entorno
2. Usar PostgreSQL en lugar de SQLite
3. Configurar `ALLOWED_HOSTS` en `settings.py`
4. Configurar `DEBUG=False`
5. Configurar servidor WSGI (Gunicorn, uWSGI)
6. Configurar servidor web (Nginx, Apache)

### Frontend (Producción)

1. Crear build de producción:
```bash
cd frontend
npm run build
```

2. Servir archivos estáticos con Nginx o servidor estático
3. Configurar proxy para API del backend

### Opciones de Despliegue

- **Backend**: Heroku, Railway, DigitalOcean, AWS, Google Cloud
- **Frontend**: Vercel, Netlify, GitHub Pages, AWS S3 + CloudFront

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor sigue estos pasos:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guía de Contribución

- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que todos los tests pasen

---

## 📝 Notas Importantes

- ⚠️ El sistema de checkout está completamente funcional y guarda las compras en la base de datos
- 💾 Los usuarios invitados pueden usar el carrito (se guarda en localStorage)
- 🖼️ Las imágenes de productos deben estar en `frontend/public/images/`
- 🔌 El backend debe estar corriendo en el puerto 8000 para que el frontend funcione correctamente
- 🔐 En producción, asegúrate de cambiar el `SECRET_KEY` de Django
- 📦 La base de datos SQLite es solo para desarrollo, usa PostgreSQL en producción

---

## 🐛 Solución de Problemas

### Error: "python no se reconoce como comando"
- **Windows**: Usa `py` en lugar de `python`
- **Mac/Linux**: Usa `python3` en lugar de `python`

### Error: "ModuleNotFoundError: No module named 'django'"
Asegúrate de que el entorno virtual esté activado:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Error de CORS en el navegador
Verifica que:
1. El backend esté corriendo en el puerto 8000
2. El frontend esté corriendo en el puerto 3000
3. `CORS_ALLOWED_ORIGINS` esté configurado en `settings.py`

### La página está en blanco
1. Abre la consola del navegador (F12)
2. Revisa errores en la pestaña "Console"
3. Verifica que el backend esté corriendo
4. Asegúrate de que las imágenes estén en `frontend/public/images/`

---

## 📚 Recursos Adicionales

- [Documentación Django](https://docs.djangoproject.com/)
- [Documentación Django REST Framework](https://www.django-rest-framework.org/)
- [Documentación React](https://react.dev/)
- [Documentación Bootstrap](https://getbootstrap.com/docs/)
- [Documentación React Router](https://reactrouter.com/)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Daniel Gonzales Arce**

- GitHub: [@danielgonzalesarce](https://github.com/danielgonzalesarce)
- Repositorio: [Story Haven Alex](https://github.com/danielgonzalesarce/Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros)

---

## ⭐ Agradecimientos

- Django y Django REST Framework por el excelente framework
- React por la biblioteca de UI
- Bootstrap por el sistema de diseño
- Todos los contribuidores y usuarios del proyecto

---

⭐ **Si te gusta este proyecto, no olvides darle una estrella en GitHub!**

---

<div align="center">

**Hecho con ❤️ usando Django y React**

[⬆ Volver arriba](#-story-haven-alex---plataforma-de-comercio-electrónico)

</div>
