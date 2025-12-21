# Ciudad - Simulador de Ciudad 3D

Repositorio para el proyecto de creación de ciudad en 3D a partir de planos.

## 🚀 Características

### Visualización 3D
- Renderizado con Three.js
- Control de cámara orbital
- Grilla hexagonal configurable
- Múltiples tipos de módulos: edificios, casas, carreteras, parques, agua, comerciales

### Guardado y Carga (Prompt 1 & 6)
- Exportación/importación de proyectos en JSON
- Validación de esquema robusta
- Sistema de versionado con migración automática
- Confirmación antes de sobrescribir
- Autosave opcional en localStorage

### Optimización de Render (Prompt 2)
- Toggle para instancing (mejor FPS en escenas grandes)
- Materiales compartidos por tipo
- Loop de renderizado optimizado

### Exportación DXF (Prompt 3)
- Capas separadas: COLUMNAS, BORDES, TECHOS, PISOS
- Soporte de unidades ($INSUNITS)
- Entidades 3DFACE con orden de vértices consistente
- Opción de exportar solo selección

### Edición y Undo/Redo (Prompt 4)
- Sistema completo de undo/redo con `ActionStack`
- Atajos de teclado:
  - `Ctrl+Z` - Deshacer
  - `Ctrl+Y` - Rehacer
  - `D` - Duplicar módulo seleccionado
  - `R` - Rotar módulo 90°
  - `Supr` - Eliminar selección
  - `Ctrl+S` - Guardar proyecto

### Tests (Prompt 5)
- Tests unitarios ejecutables en navegador
- Cobertura de:
  - Conversión de coordenadas hexagonales
  - Validación de esquema JSON
  - Migración de versiones
  - Exportación DXF

### UX Mejorada (Prompt 6)
- Modales de progreso y error
- Notificaciones toast
- Autosave configurable
- Opciones de exportación: solo geometría o con metadata

### Exportación OBJ (Prompt 7)
- Generación de OBJ + MTL
- Archivo de metadata para pipeline Blender
- [Documentación del pipeline](docs/PIPELINE_EXPORTACION.md)

### Seguridad (Prompt 8)
- Sanitización de texto insertado en DOM
- Límite de tamaño de archivos (5 MB)
- Validación de tipo MIME
- Flag de modo debug

## 📁 Estructura del proyecto

```
Ciudad/
├── sumilador.html      # Aplicación principal
├── README.md           # Este archivo
├── tests/
│   ├── tests.html      # Tests ejecutables en navegador
│   └── README.md       # Documentación de tests
└── docs/
    └── PIPELINE_EXPORTACION.md  # Documentación del pipeline OBJ→Blender→DXF
```

## 🏃 Cómo usar

1. Abre `sumilador.html` en un navegador moderno
2. Usa el panel lateral para:
   - Añadir/eliminar módulos
   - Guardar/cargar proyectos
   - Exportar a DXF u OBJ
3. Interactúa con la escena 3D:
   - Click izquierdo: seleccionar módulo
   - Arrastrar: rotar cámara
   - Scroll: zoom

## 🧪 Ejecutar tests

Abre `tests/tests.html` en un navegador. Ver [tests/README.md](tests/README.md) para más detalles.

## 📜 Licencia

MIT
