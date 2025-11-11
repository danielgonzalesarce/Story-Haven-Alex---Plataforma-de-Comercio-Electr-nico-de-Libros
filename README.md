# 📚 Story Haven Alex - Plataforma de Comercio Electrónico

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.2.8-green.svg)](https://www.djangoproject.com/)

Una plataforma de comercio electrónico completa (full-stack) para una librería online, desarrollada con Django REST Framework en el backend y React en el frontend.

🔗 **Repositorio:** [GitHub](https://github.com/danielgonzalesarce/Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros)

## 🎯 Descripción

**Story Haven Alex** es una aplicación web moderna que permite a los usuarios explorar, buscar y comprar libros, mangas, novelas gráficas y cómics. La plataforma incluye un sistema de autenticación con JWT, gestión de carrito de compras (tanto para usuarios registrados como invitados), filtros avanzados de búsqueda y un diseño responsive y profesional.

## ✨ Características Principales

### Backend (Django)
- ✅ API RESTful con Django REST Framework
- ✅ Autenticación con JWT (SimpleJWT)
- ✅ Modelos: Usuario, Categoría, Producto, CarritoItem
- ✅ Sistema de carrito para usuarios autenticados e invitados
- ✅ Filtros avanzados (precio, categoría, búsqueda por nombre/autor)
- ✅ Paginación y ordenamiento
- ✅ CORS configurado para comunicación con frontend
- ✅ Panel de administración Django

### Frontend (React)
- ✅ Interfaz moderna y responsive con Bootstrap
- ✅ Página de inicio con sección hero, historia y productos destacados
- ✅ Catálogo completo con filtros avanzados
- ✅ Detalle de productos
- ✅ Carrito de compras (localStorage para invitados)
- ✅ Autenticación (Login/Registro)
- ✅ Notificaciones visuales
- ✅ Diseño profesional con gradientes y animaciones

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.x**
- **Django 5.2.8**
- **Django REST Framework**
- **djangorestframework-simplejwt** (Autenticación JWT)
- **django-cors-headers** (CORS)
- **SQLite** (Base de datos)

### Frontend
- **React 19.2.0**
- **React Router DOM** (Navegación)
- **Axios** (Peticiones HTTP)
- **Bootstrap 5.3.8** (Estilos)
- **Font Awesome 6.4.0** (Iconos)

## 📦 Archivos de Instalación

- **INSTALL.md** - Guía de instalación detallada paso a paso
- **install.sh** - Script de instalación automática para Linux/Mac
- **install.bat** - Script de instalación automática para Windows
- **requirements.txt** - Dependencias de Python (backend)

## 📁 Estructura del Proyecto

```
ecommerce/
├── backend/
│   ├── backend/
│   │   ├── settings.py      # Configuración Django
│   │   └── urls.py          # URLs principales
│   ├── tienda/
│   │   ├── models.py        # Modelos de datos
│   │   ├── views.py         # Vistas/Endpoints API
│   │   ├── serializers.py   # Serializers DRF
│   │   ├── urls.py          # URLs de la app
│   │   ├── admin.py         # Configuración admin
│   │   └── management/
│   │       └── commands/
│   │           └── poblar_datos.py  # Comando para poblar BD
│   └── manage.py
│
└── frontend/
    ├── public/
    │   ├── images/          # Imágenes de productos (25 imágenes)
    │   └── logo.png         # Logo de la tienda
    └── src/
        ├── components/      # Componentes React
        ├── pages/           # Páginas principales
        ├── services/        # Servicios API
        └── App.js           # Componente principal
```

## 🚀 Instalación Rápida

### Opción 1: Instalación Automática (Recomendada)

**Windows:**
```bash
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Opción 2: Instalación Manual

Para una guía detallada paso a paso, consulta el archivo [INSTALL.md](INSTALL.md)

### Instalación Rápida Manual

**Prerrequisitos:**
- Python 3.8+
- Node.js 14+
- npm o yarn

**Backend:**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py poblar_datos
python manage.py runserver 8000
```

**Frontend (en otra terminal):**
```bash
cd frontend
npm install
npm start
```

> 📖 **Para más detalles:** Lee la [Guía de Instalación Completa](INSTALL.md)

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/registro/` - Registro de usuario
- `POST /api/auth/login/` - Inicio de sesión

### Productos
- `GET /api/productos/` - Listado de productos (con filtros)
- `GET /api/productos/{id}/` - Detalle de producto

### Categorías
- `GET /api/categorias/` - Listado de categorías

### Carrito
- `GET /api/carrito/` - Ver carrito
- `POST /api/carrito/` - Añadir producto al carrito
- `DELETE /api/carrito/{id}/` - Eliminar item del carrito
- `GET /api/carrito/total/` - Obtener total del carrito
- `POST /api/carrito/checkout/` - Checkout (en desarrollo)

## 🎨 Características del Diseño

- **Paleta de colores profesional** con gradientes modernos
- **Diseño responsive** para móviles, tablets y desktop
- **Animaciones suaves** en interacciones
- **Sección Hero** con llamada a la acción
- **Productos destacados** en la página principal
- **Filtros avanzados** para búsqueda de productos

## 📝 Notas Importantes

- El sistema de checkout está marcado como "en desarrollo" y muestra un mensaje informativo
- Los usuarios invitados pueden usar el carrito (se guarda en localStorage)
- Las imágenes de productos deben estar en `frontend/public/images/`
- El backend debe estar corriendo en el puerto 8000 para que el frontend funcione correctamente

## 👤 Autor

Desarrollado como proyecto de comercio electrónico full-stack.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub!

