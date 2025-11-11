# 🚀 Guía de Instalación - Story Haven Alex

Esta guía te ayudará a instalar y ejecutar el proyecto **Story Haven Alex** en tu máquina local paso a paso.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.8 o superior** - [Descargar Python](https://www.python.org/downloads/)
- **Node.js 14+ y npm** - [Descargar Node.js](https://nodejs.org/)
- **Git** - [Descargar Git](https://git-scm.com/downloads)

### Verificar instalaciones

Abre tu terminal (PowerShell en Windows, Terminal en Mac/Linux) y ejecuta:

```bash
python --version
node --version
npm --version
git --version
```

Si todos los comandos muestran versiones, estás listo para continuar.

## 📥 Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/danielgonzalesarce/Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros.git
cd Story-Haven-Alex---Plataforma-de-Comercio-Electr-nico-de-Libros
```

## 🔧 Paso 2: Configurar el Backend (Django)

### 2.1 Navegar a la carpeta backend

```bash
cd backend
```

### 2.2 Crear entorno virtual

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

> 💡 **Nota:** Cuando el entorno virtual esté activado, verás `(venv)` al inicio de tu línea de comandos.

### 2.3 Instalar dependencias de Python

```bash
pip install django==5.2.8 djangorestframework djangorestframework-simplejwt django-cors-headers
```

O si tienes un archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 2.4 Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 2.5 Poblar la base de datos con datos de ejemplo

```bash
python manage.py poblar_datos
```

Esto creará 5 categorías y 25 productos de ejemplo.

### 2.6 (Opcional) Crear superusuario para el panel de administración

```bash
python manage.py createsuperuser
```

Sigue las instrucciones para crear un usuario administrador.

### 2.7 Iniciar el servidor del backend

```bash
python manage.py runserver 8000
```

El backend estará disponible en: **http://localhost:8000**

> ✅ **Verificación:** Abre tu navegador y visita `http://localhost:8000/api/`. Deberías ver la API de Django REST Framework.

## 🎨 Paso 3: Configurar el Frontend (React)

### 3.1 Abrir una nueva terminal

> ⚠️ **Importante:** Mantén el servidor del backend corriendo en la terminal anterior y abre una **nueva terminal** para el frontend.

### 3.2 Navegar a la carpeta frontend

```bash
cd frontend
```

### 3.3 Instalar dependencias de Node.js

```bash
npm install
```

Esto puede tardar unos minutos la primera vez.

### 3.4 Iniciar el servidor de desarrollo

```bash
npm start
```

El frontend se abrirá automáticamente en: **http://localhost:3000**

> ✅ **Verificación:** Deberías ver la página de inicio de Story Haven Alex con el diseño profesional.

## 🎉 ¡Listo!

Ahora tienes ambos servidores corriendo:

- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:3000

## 🧪 Probar la Aplicación

1. **Explorar productos:** Navega por el catálogo en la página principal
2. **Ver detalles:** Haz clic en cualquier producto para ver más información
3. **Añadir al carrito:** Prueba añadir productos al carrito (funciona sin registro)
4. **Registrarse:** Crea una cuenta nueva en "Registro"
5. **Iniciar sesión:** Prueba el login con tu cuenta

## 🛠️ Solución de Problemas

### Error: "python no se reconoce como comando"

- **Windows:** Usa `py` en lugar de `python`
- **Mac/Linux:** Usa `python3` en lugar de `python`

### Error: "ModuleNotFoundError: No module named 'django'"

Asegúrate de que el entorno virtual esté activado y ejecuta:
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

### Error: "npm no se reconoce como comando"

Asegúrate de que Node.js esté instalado correctamente. Reinicia tu terminal después de instalar Node.js.

### Error de CORS en el navegador

Verifica que:
1. El backend esté corriendo en el puerto 8000
2. El frontend esté corriendo en el puerto 3000
3. En `backend/backend/settings.py` esté configurado:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
   ]
   ```

### La página está en blanco

1. Abre la consola del navegador (F12)
2. Revisa si hay errores en la pestaña "Console"
3. Verifica que el backend esté corriendo
4. Asegúrate de que las imágenes estén en `frontend/public/images/`

### Error al poblar datos

Si el comando `poblar_datos` falla:
1. Asegúrate de haber ejecutado las migraciones primero
2. Verifica que las imágenes existan en `frontend/public/images/`
3. Revisa los mensajes de error en la terminal

## 📚 Recursos Adicionales

- **Panel de administración Django:** http://localhost:8000/admin/
- **API REST:** http://localhost:8000/api/
- **Documentación Django:** https://docs.djangoproject.com/
- **Documentación React:** https://react.dev/

## 💡 Consejos

- **Mantén ambos servidores corriendo** mientras desarrollas
- **Usa Ctrl+C** en la terminal para detener los servidores
- **Recarga la página** (F5) si no ves los cambios
- **Revisa la consola del navegador** (F12) para ver errores

## 🆘 ¿Necesitas Ayuda?

Si encuentras algún problema:

1. Revisa la sección de "Solución de Problemas" arriba
2. Verifica que todos los prerrequisitos estén instalados
3. Asegúrate de seguir los pasos en orden
4. Abre un issue en el repositorio de GitHub

---

¡Disfruta explorando Story Haven Alex! 📚✨

