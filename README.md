# Ciudad - Proyecto de Maqueta Urbana en AutoCAD

## Descripción del Proyecto

Diseño de maqueta urbana en AutoCAD a escala **1:75** que cubre las necesidades básicas de una comunidad urbana sostenible.

### Necesidades Cubiertas

1. **Vivienda** - Zonas residenciales y edificaciones habitacionales
2. **Alimentación** - Mercados, supermercados y centros de distribución
3. **Agua** - Sistema de distribución y tratamiento de agua
4. **Energía** - Infraestructura eléctrica y energías renovables
5. **Salud** - Centros de salud, clínicas y hospitales
6. **Educación** - Escuelas, bibliotecas y centros educativos
7. **Movilidad** - Red vial, transporte público y ciclovías
8. **Espacios Públicos** - Parques, plazas y áreas recreativas

## Estructura del Proyecto

```
Ciudad/
├── README.md                          # Este archivo
├── docs/
│   ├── CAPAS_AUTOCAD.md              # Organización de capas
│   ├── FLUJO_MODULAR.md              # Workflow del proyecto
│   ├── IMPORTACION_PLANOS.md         # Guía de importación
│   └── EXPORTACION_3D.md             # Preparación para 3D
├── templates/
│   └── plantilla_autocad.dwt         # Plantilla base (crear en AutoCAD)
└── validacion/
    └── CHECKLIST_VALIDACION.md       # Lista de verificación académica
```

## Inicio Rápido

### 1. Configuración Inicial en AutoCAD

1. Crear nuevo dibujo desde plantilla
2. Configurar unidades: metros
3. Establecer escala: 1:75
4. Importar planos base de referencia

### 2. Organización de Capas

Ver documentación detallada en [CAPAS_AUTOCAD.md](docs/CAPAS_AUTOCAD.md)

**Capas principales:**
- VIALIDADES
- EDIFICACIONES
- SERVICIOS
- SALUD_EDUCACION
- AREAS_VERDES
- ANOTACIONES

### 3. Workflow Modular

Seguir el flujo documentado en [FLUJO_MODULAR.md](docs/FLUJO_MODULAR.md) para desarrollo y validación.

## Escala del Proyecto

**Escala:** 1:75

- 1 unidad en AutoCAD = 75 unidades reales
- Ejemplo: 1m en dibujo = 75m en realidad
- Configurar apropiadamente para mediciones precisas

## Validación Académica

Consultar [CHECKLIST_VALIDACION.md](validacion/CHECKLIST_VALIDACION.md) para requisitos de validación.

## Exportación a 3D

Para preparar el modelo para exportación 3D, revisar [EXPORTACION_3D.md](docs/EXPORTACION_3D.md)

## Contribuciones

Este proyecto está diseñado para ser modular y escalable. Las contribuciones deben seguir la estructura de capas establecida.

## Licencia

Proyecto académico desarrollado para validación urbana.