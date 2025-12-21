# Tests del Simulador de Ciudad

## Cómo ejecutar los tests

### Opción 1: Abrir en navegador
Simplemente abre el archivo `tests.html` en cualquier navegador moderno:

```bash
# En Linux/macOS
xdg-open tests/tests.html
# o
open tests/tests.html

# En Windows
start tests/tests.html
```

### Opción 2: Servidor local
Si necesitas ejecutar los tests con un servidor local:

```bash
# Con Python
python -m http.server 8000
# Luego abre http://localhost:8000/tests/tests.html

# Con Node.js
npx serve
# Luego abre http://localhost:3000/tests/tests.html
```

## Tests incluidos

### 1. Conversión de Coordenadas (hexCoord <-> world)
- `hexToWorld` en origen (0,0)
- `hexToWorld` con coordenadas positivas
- `hexToWorld` con coordenadas negativas  
- `worldToHex` en origen
- Verificación de que `hexToWorld` y `worldToHex` son funciones inversas

### 2. Validación de Esquema de Proyecto
- Proyecto válido no genera errores
- `gridSize` fuera de rango genera error
- `camera` faltante genera error
- Módulos con campos faltantes generan error

### 3. Migración de Versiones
- Proyecto sin versión se migra a v2
- Se añade `camera` si falta
- Se añade `metadata` a módulos si falta

### 4. Serialización (save/load roundtrip)
- `saveProject` y `loadProject` son funciones inversas
- JSON generado es válido

### 5. Exportación DXF
- Header incluye `$INSUNITS`
- Unidades correctas según selección
- Incluye todas las capas requeridas (COLUMNAS, BORDES, TECHOS, PISOS)
- Estructura de capas válida

### 6. Seguridad
- Sanitización de texto para prevenir XSS
- Validación de límite de tamaño de archivo

## Resultados esperados

Al ejecutar los tests, deberías ver un panel con:
- ✅ Tests pasados en verde
- ❌ Tests fallidos en rojo
- Resumen con totales

Todos los tests deben pasar para considerar el código como válido.
