# Simulador de Pirámides Octagonales - Código Refactorizado

## 📁 Estructura del Proyecto

```
refactored/
├── index.html              # Estructura HTML (solo interfaz)
├── styles.css              # Estilos completos
└── js/
    ├── main.js            # Punto de entrada
    ├── constants.js       # Constantes y configuración
    ├── RoadEditor.js      # Clase principal del editor
    ├── geometries/        # Módulos de geometrías
    │   ├── roads.js       # Carreteras (rectas, curvas, glorietas)
    │   ├── octagon.js     # Octágonos y pirámides
    │   ├── vehicles.js    # Vehículos (Cybertruck)
    │   └── pylon.js       # Pilar de teleférico
    ├── utils/             # Utilidades
    │   ├── snap.js        # Sistema de snap/conexión
    │   └── serialization.js # Guardar/cargar escenas
    └── export/            # Exportación
        └── dxf.js         # Exportación a formato DXF
```

## 🎯 Características Mantenidas

- ✅ Todas las funcionalidades del original
- ✅ Sistema de snap para carreteras
- ✅ Control de vehículos (WASD/Flechas)
- ✅ Exportación DXF completa
- ✅ Guardar/cargar escenas
- ✅ Grid de pirámides
- ✅ Carretera perimetral
- ✅ Pilar de teleférico editable
- ✅ Glorieta paramétrica
- ✅ Distribuidor radial

## 🔧 Mejoras Implementadas

### Modularización
- **Separación HTML/CSS/JS**: Cada tecnología en su archivo
- **ES Modules**: Imports/exports estándar
- **Responsabilidad única**: Cada módulo tiene una función clara

### Organización del Código
- **constants.js**: Centraliza todos los valores numéricos y colores
- **geometries/**: Funciones puras para crear geometrías 3D
- **utils/**: Utilidades reutilizables (snap, serialización)
- **export/**: Lógica de exportación aislada

### Mantenibilidad
- Nombres descriptivos y consistentes
- Lógica de negocio separada de la presentación
- Fácil de extender con nuevas geometrías
- Sin duplicación de código

## 🚀 Uso

1. Abre `index.html` directamente en un navegador moderno
2. Usa los botones del panel izquierdo para añadir elementos
3. Selecciona elementos haciendo clic
4. Edita propiedades en el panel derecho
5. Exporta a DXF cuando termines

## 🔗 Compatibilidad

- **window.editor**: Expuesto globalmente para botones HTML
- **Three.js 0.168.0**: CDN, sin dependencias locales
- **Navegadores modernos**: Chrome, Firefox, Edge, Safari

## 📝 Notas Técnicas

- Escala 1:300 (210×150m reales = 70×50cm modelo)
- Octágonos: 50m², altura 3m
- Pirámides: 6→2 octágonos
- Cybertruck: dimensiones reales (5.68×2.03m)
- Pilar teleférico: altura 15-45m, diámetro base 1.5-3m
