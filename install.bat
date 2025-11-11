@echo off
REM Script de instalación automática para Windows
REM Story Haven Alex - Plataforma de Comercio Electrónico

echo.
echo 🚀 Instalando Story Haven Alex...
echo.

REM Verificar Python
echo 📦 Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python no está instalado. Por favor instálalo primero.
    pause
    exit /b 1
)
echo ✅ Python encontrado
python --version

REM Verificar Node.js
echo 📦 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Por favor instálalo primero.
    pause
    exit /b 1
)
echo ✅ Node.js encontrado
node --version

REM Verificar npm
echo 📦 Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no está instalado. Por favor instálalo primero.
    pause
    exit /b 1
)
echo ✅ npm encontrado
npm --version

echo.
echo 🔧 Configurando Backend...

REM Backend setup
cd backend

REM Crear entorno virtual
echo 📦 Creando entorno virtual...
python -m venv venv

REM Activar entorno virtual
echo 🔌 Activando entorno virtual...
call venv\Scripts\activate.bat

REM Instalar dependencias
echo 📥 Instalando dependencias de Python...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Ejecutar migraciones
echo 🗄️ Ejecutando migraciones...
python manage.py makemigrations
python manage.py migrate

REM Poblar datos
echo 📚 Poblando base de datos con datos de ejemplo...
python manage.py poblar_datos

echo.
echo ✅ Backend configurado correctamente!
echo.

REM Frontend setup
echo 🎨 Configurando Frontend...
cd ..\frontend

REM Instalar dependencias
echo 📥 Instalando dependencias de Node.js...
call npm install

echo.
echo ✅ Frontend configurado correctamente!
echo.
echo 📝 Próximos pasos:
echo.
echo 1. Para iniciar el backend, ejecuta:
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver 8000
echo.
echo 2. En otra terminal, para iniciar el frontend:
echo    cd frontend
echo    npm start
echo.
echo 🎉 ¡Instalación completada!
echo.
pause

