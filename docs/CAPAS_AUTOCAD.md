# Organización de Capas en AutoCAD

## Introducción

La organización por capas es fundamental para mantener un proyecto urbano ordenado, facilitar la colaboración y permitir la exportación a diferentes formatos, incluyendo 3D.

## Estructura de Capas Principal

### 1. VIALIDADES

**Propósito:** Sistema de circulación vehicular y peatonal

#### Subcapas:
- `VIALIDADES-PRINCIPALES` (Color: Rojo, Grosor: 0.5mm)
  - Avenidas principales
  - Vías de alta capacidad
  
- `VIALIDADES-SECUNDARIAS` (Color: Amarillo, Grosor: 0.3mm)
  - Calles locales
  - Vías residenciales
  
- `VIALIDADES-PEATONALES` (Color: Naranja, Grosor: 0.2mm)
  - Banquetas/aceras
  - Paseos peatonales
  
- `VIALIDADES-CICLOVIAS` (Color: Verde claro, Grosor: 0.25mm)
  - Ciclovías segregadas
  - Carriles bici

**Propiedades:**
- Tipo de línea: Continua para vías existentes, Discontinua para propuestas
- Altura Z: 0 (nivel del suelo)

### 2. EDIFICACIONES

**Propósito:** Construcciones y estructuras urbanas

#### Subcapas:
- `EDIFICACIONES-VIVIENDA` (Color: Cyan, Grosor: 0.4mm)
  - Vivienda unifamiliar
  - Vivienda multifamiliar
  - Conjuntos residenciales
  
- `EDIFICACIONES-COMERCIAL` (Color: Magenta, Grosor: 0.4mm)
  - Centros comerciales
  - Mercados
  - Locales comerciales
  
- `EDIFICACIONES-INDUSTRIAL` (Color: Gris, Grosor: 0.4mm)
  - Zonas industriales
  - Bodegas
  - Talleres

**Propiedades:**
- Tipo de línea: Continua
- Altura Z: Variable según número de pisos
- Atributo: Número de pisos, uso específico

### 3. SERVICIOS

**Propósito:** Infraestructura de servicios básicos

#### Subcapas:
- `SERVICIOS-AGUA` (Color: Azul, Grosor: 0.3mm)
  - Red de distribución
  - Tanques de almacenamiento
  - Plantas de tratamiento
  
- `SERVICIOS-DRENAJE` (Color: Azul oscuro, Grosor: 0.3mm)
  - Red de alcantarillado
  - Colectores
  - Plantas de tratamiento
  
- `SERVICIOS-ENERGIA` (Color: Amarillo, Grosor: 0.25mm)
  - Red eléctrica
  - Subestaciones
  - Paneles solares/renovables
  
- `SERVICIOS-TELECOMUNICACIONES` (Color: Verde oscuro, Grosor: 0.2mm)
  - Red de fibra óptica
  - Torres de comunicación
  
- `SERVICIOS-ALIMENTACION` (Color: Naranja, Grosor: 0.35mm)
  - Mercados
  - Supermercados
  - Centros de distribución de alimentos

**Propiedades:**
- Tipo de línea: Discontinua para redes subterráneas
- Símbolos especiales para nodos y conexiones

### 4. SALUD_EDUCACION

**Propósito:** Equipamiento social y servicios básicos

#### Subcapas:
- `SALUD-HOSPITALES` (Color: Rojo brillante, Grosor: 0.5mm)
  - Hospitales generales
  - Hospitales especializados
  
- `SALUD-CLINICAS` (Color: Rojo, Grosor: 0.4mm)
  - Centros de salud
  - Clínicas
  
- `EDUCACION-UNIVERSIDADES` (Color: Azul brillante, Grosor: 0.5mm)
  - Universidades
  - Centros de educación superior
  
- `EDUCACION-ESCUELAS` (Color: Azul, Grosor: 0.4mm)
  - Escuelas primarias
  - Escuelas secundarias
  
- `EDUCACION-BIBLIOTECAS` (Color: Cyan, Grosor: 0.35mm)
  - Bibliotecas públicas
  - Centros culturales

**Propiedades:**
- Tipo de línea: Continua
- Símbolo identificador en cada edificación
- Atributo: Capacidad, nivel educativo

### 5. AREAS_VERDES

**Propósito:** Espacios públicos y áreas naturales

#### Subcapas:
- `AREAS_VERDES-PARQUES` (Color: Verde, Grosor: 0.3mm)
  - Parques urbanos
  - Parques vecinales
  
- `AREAS_VERDES-PLAZAS` (Color: Verde claro, Grosor: 0.3mm)
  - Plazas públicas
  - Plazoletas
  
- `AREAS_VERDES-JARDINES` (Color: Verde brillante, Grosor: 0.25mm)
  - Jardines comunitarios
  - Áreas verdes menores
  
- `AREAS_VERDES-ARBOLADO` (Color: Verde oscuro, Grosor: 0.15mm)
  - Árboles individuales
  - Alineaciones arbóreas
  
- `AREAS_VERDES-RECREATIVAS` (Color: Verde amarillento, Grosor: 0.3mm)
  - Canchas deportivas
  - Áreas de juegos
  - Espacios recreativos

**Propiedades:**
- Patrón de relleno: Diferentes tipos de vegetación
- Altura Z: Variable según topografía

### 6. ANOTACIONES

**Propósito:** Información, textos y dimensiones

#### Subcapas:
- `ANOTACIONES-TEXTOS` (Color: Blanco, Grosor: Por defecto)
  - Nombres de calles
  - Nombres de edificios
  - Etiquetas generales
  
- `ANOTACIONES-DIMENSIONES` (Color: Cyan claro, Grosor: 0.15mm)
  - Cotas de calles
  - Dimensiones de lotes
  - Alturas de edificios
  
- `ANOTACIONES-SIMBOLOS` (Color: Blanco, Grosor: Por defecto)
  - Norte
  - Escala gráfica
  - Leyendas
  
- `ANOTACIONES-NUMEROS` (Color: Amarillo claro, Grosor: Por defecto)
  - Números de manzana
  - Números de lote
  - Referencias

**Propiedades:**
- Tamaño de texto: Ajustado a escala 1:75
- Altura de texto recomendada: 2.5mm en papel (187.5mm en modelo)

## Capas Adicionales Recomendadas

### TOPOGRAFIA
- Curvas de nivel
- Elevaciones
- Pendientes

### MOBILIARIO_URBANO
- Bancas
- Luminarias
- Señalización

### TRANSPORTE_PUBLICO
- Paraderos
- Estaciones
- Rutas

## Convenciones Generales

### Colores
- Usar colores estándar de AutoCAD
- Mantener coherencia en todo el proyecto
- Considerar impresión en blanco y negro

### Grosores de Línea
- Jerarquía visual según importancia
- Rango: 0.15mm a 0.5mm
- Configurar Plot Style Table apropiado

### Tipos de Línea
- `Continuous`: Elementos existentes permanentes
- `Dashed`: Elementos propuestos o bajo tierra
- `Hidden`: Elementos ocultos o demolición
- `Phantom`: Líneas de referencia

## Configuración Recomendada

### Layer Properties Manager
```
Configuración sugerida:
- Freeze/Thaw: Para control de visibilidad
- Lock/Unlock: Para proteger capas terminadas
- Color: Según estándar arriba
- Linetype: Según tipo de elemento
- Lineweight: Según jerarquía
```

### Layer States
Crear estados de capa para diferentes vistas:
- `PRESENTACION_GENERAL`: Todas las capas visibles
- `VIALIDADES_SOLO`: Solo sistema vial
- `EDIFICACIONES_SOLO`: Solo edificaciones
- `SERVICIOS_SOLO`: Solo infraestructura
- `SALUD_EDUCACION_SOLO`: Solo equipamiento
- `AREAS_VERDES_SOLO`: Solo espacios públicos
- `3D_EXPORT`: Capas preparadas para 3D

## Mejores Prácticas

1. **Nombrar consistentemente:** Usar MAYÚSCULAS y guiones bajos
2. **No dibujar en Layer 0:** Reservar para bloques
3. **Agrupar capas:** Usar filtros de capa
4. **Documentar:** Agregar descripciones a cada capa
5. **Respaldar:** Guardar Layer States regularmente
6. **Coordinar:** Mantener sincronización en trabajo colaborativo

## Exportación

### Para Impresión
- Usar CTB (Color-dependent plot style)
- Verificar grosores de línea
- Revisar escalas de texto

### Para 3D
- Asignar alturas Z correctas
- Verificar cerrado de polilíneas
- Preparar para extrusión

## Validación de Capas

Antes de finalizar:
- [ ] Todos los elementos están en capas correctas
- [ ] Nomenclatura consistente
- [ ] Colores y grosores apropiados
- [ ] Layer States creados
- [ ] Documentación actualizada
- [ ] Sin elementos en Layer 0 (excepto definiciones de bloques)
