#!/bin/bash

# Script de instalación automática para Linux/Mac
# Story Haven Alex - Plataforma de Comercio Electrónico

echo "🚀 Instalando Story Haven Alex..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Python
echo "📦 Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python encontrado: $(python3 --version)${NC}"

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"

# Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm encontrado: $(npm --version)${NC}"

echo ""
echo "🔧 Configurando Backend..."

# Backend setup
cd backend

# Crear entorno virtual
echo "📦 Creando entorno virtual..."
python3 -m venv venv

# Activar entorno virtual
echo "🔌 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📥 Instalando dependencias de Python..."
pip install --upgrade pip
pip install -r requirements.txt

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
python manage.py makemigrations
python manage.py migrate

# Poblar datos
echo "📚 Poblando base de datos con datos de ejemplo..."
python manage.py poblar_datos

echo ""
echo -e "${GREEN}✅ Backend configurado correctamente!${NC}"
echo ""

# Frontend setup
echo "🎨 Configurando Frontend..."
cd ../frontend

# Instalar dependencias
echo "📥 Instalando dependencias de Node.js..."
npm install

echo ""
echo -e "${GREEN}✅ Frontend configurado correctamente!${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo ""
echo "1. Para iniciar el backend, ejecuta:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python manage.py runserver 8000"
echo ""
echo "2. En otra terminal, para iniciar el frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo -e "${GREEN}🎉 ¡Instalación completada!${NC}"

