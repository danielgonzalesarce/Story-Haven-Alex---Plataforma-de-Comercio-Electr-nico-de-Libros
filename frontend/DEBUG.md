# Guía de Depuración - React App en Blanco

## Pasos para diagnosticar el problema:

1. **Abre la consola del navegador (F12)**
   - Ve a la pestaña "Console"
   - Busca errores en rojo
   - Copia cualquier error que veas

2. **Verifica que el backend esté corriendo**
   ```bash
   cd backend
   python manage.py runserver 8000
   ```

3. **Verifica que el frontend esté corriendo**
   ```bash
   cd frontend
   npm start
   ```

4. **Si ves errores de CORS o conexión:**
   - Asegúrate de que el backend esté en `http://localhost:8000`
   - Verifica que `CORS_ALLOWED_ORIGINS` en `backend/settings.py` incluya `http://localhost:3000`

5. **Si la página está completamente en blanco:**
   - Revisa la consola del navegador para errores de JavaScript
   - Verifica que todas las dependencias estén instaladas: `npm install`
   - Intenta limpiar el caché: `npm start -- --reset-cache`

6. **Para probar una versión simplificada:**
   - Temporalmente renombra `App.js` a `App.full.js`
   - Renombra `App.simple.js` a `App.js`
   - Recarga la página

## Errores comunes:

- **"Cannot find module"**: Ejecuta `npm install`
- **"CORS error"**: Verifica que el backend esté corriendo y CORS configurado
- **"Network error"**: El backend no está corriendo o está en un puerto diferente
- **Página en blanco sin errores**: Puede ser un error silencioso, revisa la pestaña "Network" en las DevTools

