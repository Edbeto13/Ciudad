# Plantilla Base de AutoCAD - Guía de Creación

## Introducción

Este documento describe cómo crear la plantilla base (`plantilla_autocad.dwt`) para el proyecto urbano. Una plantilla bien configurada ahorra tiempo y asegura consistencia.

## Creación de la Plantilla

### Paso 1: Crear Nuevo Dibujo

1. Abrir AutoCAD
2. `File > New`
3. Seleccionar: `acad.dwt` (métrico) o `acadiso.dwt`

### Paso 2: Configurar Unidades

```
Comando: UNITS

Configuración:
- Type: Decimal
- Precision: 0.00
- Insertion scale: Meters
- Angle Type: Decimal Degrees
- Angle Precision: 0
```

### Paso 3: Configurar Límites

```
Comando: LIMITS
- Lower left corner: 0,0
- Upper right corner: 1000,1000

Comando: ZOOM
- All
```

### Paso 4: Crear Estructura de Capas

Ver [CAPAS_AUTOCAD.md](../docs/CAPAS_AUTOCAD.md) para detalles completos.

**Script rápido para crear capas principales:**

```lisp
; Copiar en Command Line o crear archivo .scr

-LAYER NEW VIALIDADES-PRINCIPALES COLOR 1 VIALIDADES-PRINCIPALES LWEIGHT 0.50 VIALIDADES-PRINCIPALES 
-LAYER NEW VIALIDADES-SECUNDARIAS COLOR 2 VIALIDADES-SECUNDARIAS LWEIGHT 0.30 VIALIDADES-SECUNDARIAS
-LAYER NEW VIALIDADES-PEATONALES COLOR 30 VIALIDADES-PEATONALES LWEIGHT 0.20 VIALIDADES-PEATONALES
-LAYER NEW VIALIDADES-CICLOVIAS COLOR 3 VIALIDADES-CICLOVIAS LWEIGHT 0.25 VIALIDADES-CICLOVIAS

-LAYER NEW EDIFICACIONES-VIVIENDA COLOR 4 EDIFICACIONES-VIVIENDA LWEIGHT 0.40 EDIFICACIONES-VIVIENDA
-LAYER NEW EDIFICACIONES-COMERCIAL COLOR 6 EDIFICACIONES-COMERCIAL LWEIGHT 0.40 EDIFICACIONES-COMERCIAL
-LAYER NEW EDIFICACIONES-INDUSTRIAL COLOR 8 EDIFICACIONES-INDUSTRIAL LWEIGHT 0.40 EDIFICACIONES-INDUSTRIAL

-LAYER NEW SERVICIOS-AGUA COLOR 5 SERVICIOS-AGUA LWEIGHT 0.30 SERVICIOS-AGUA
-LAYER NEW SERVICIOS-DRENAJE COLOR 150 SERVICIOS-DRENAJE LWEIGHT 0.30 SERVICIOS-DRENAJE
-LAYER NEW SERVICIOS-ENERGIA COLOR 2 SERVICIOS-ENERGIA LWEIGHT 0.25 SERVICIOS-ENERGIA
-LAYER NEW SERVICIOS-TELECOMUNICACIONES COLOR 90 SERVICIOS-TELECOMUNICACIONES LWEIGHT 0.20 SERVICIOS-TELECOMUNICACIONES
-LAYER NEW SERVICIOS-ALIMENTACION COLOR 30 SERVICIOS-ALIMENTACION LWEIGHT 0.35 SERVICIOS-ALIMENTACION

-LAYER NEW SALUD-HOSPITALES COLOR 10 SALUD-HOSPITALES LWEIGHT 0.50 SALUD-HOSPITALES
-LAYER NEW SALUD-CLINICAS COLOR 1 SALUD-CLINICAS LWEIGHT 0.40 SALUD-CLINICAS
-LAYER NEW EDUCACION-UNIVERSIDADES COLOR 170 EDUCACION-UNIVERSIDADES LWEIGHT 0.50 EDUCACION-UNIVERSIDADES
-LAYER NEW EDUCACION-ESCUELAS COLOR 5 EDUCACION-ESCUELAS LWEIGHT 0.40 EDUCACION-ESCUELAS
-LAYER NEW EDUCACION-BIBLIOTECAS COLOR 4 EDUCACION-BIBLIOTECAS LWEIGHT 0.35 EDUCACION-BIBLIOTECAS

-LAYER NEW AREAS_VERDES-PARQUES COLOR 3 AREAS_VERDES-PARQUES LWEIGHT 0.30 AREAS_VERDES-PARQUES
-LAYER NEW AREAS_VERDES-PLAZAS COLOR 120 AREAS_VERDES-PLAZAS LWEIGHT 0.30 AREAS_VERDES-PLAZAS
-LAYER NEW AREAS_VERDES-JARDINES COLOR 90 AREAS_VERDES-JARDINES LWEIGHT 0.25 AREAS_VERDES-JARDINES
-LAYER NEW AREAS_VERDES-ARBOLADO COLOR 70 AREAS_VERDES-ARBOLADO LWEIGHT 0.15 AREAS_VERDES-ARBOLADO
-LAYER NEW AREAS_VERDES-RECREATIVAS COLOR 100 AREAS_VERDES-RECREATIVAS LWEIGHT 0.30 AREAS_VERDES-RECREATIVAS

-LAYER NEW ANOTACIONES-TEXTOS COLOR 7 ANOTACIONES-TEXTOS LWEIGHT DEFAULT ANOTACIONES-TEXTOS
-LAYER NEW ANOTACIONES-DIMENSIONES COLOR 140 ANOTACIONES-DIMENSIONES LWEIGHT 0.15 ANOTACIONES-DIMENSIONES
-LAYER NEW ANOTACIONES-SIMBOLOS COLOR 7 ANOTACIONES-SIMBOLOS LWEIGHT DEFAULT ANOTACIONES-SIMBOLOS
-LAYER NEW ANOTACIONES-NUMEROS COLOR 50 ANOTACIONES-NUMEROS LWEIGHT DEFAULT ANOTACIONES-NUMEROS

-LAYER NEW REFERENCIA-BASE COLOR 8 REFERENCIA-BASE LWEIGHT 0.15 REFERENCIA-BASE LOCK REFERENCIA-BASE
```

### Paso 5: Configurar Estilos de Texto

```
Comando: STYLE

Estilo 1: STANDARD
- Font: Arial
- Height: 0 (variable)
- Width Factor: 1.0
- Oblique Angle: 0

Estilo 2: TITULOS
- Font: Arial Bold
- Height: 0
- Width Factor: 1.0

Estilo 3: ANOTACIONES
- Font: Arial Narrow
- Height: 187.5 (para escala 1:75, 2.5mm en papel)
- Width Factor: 0.9
```

### Paso 6: Configurar Estilos de Cota

```
Comando: DIMSTYLE

Estilo: CIUDAD_1-75

Lines:
- Extend beyond dim lines: 2
- Offset from origin: 2
- Baseline spacing: 10

Symbols and Arrows:
- Arrow size: 3
- Center marks: Mark, Size: 3

Text:
- Text style: ANOTACIONES
- Text height: 187.5 (2.5mm × 75)
- Vertical: Centered
- Horizontal: Centered
- Offset from dim line: 2

Fit:
- Scale: 1
- Fine tuning: Place text manually

Primary Units:
- Unit format: Decimal
- Precision: 0.00
- Suffix: m
- Scale factor: 1
```

### Paso 7: Configurar Plot Style

```
Comando: PAGESETUP

Plot Style Table:
- Crear nuevo: ciudad.ctb (color-dependent)

Configurar grosores:
Color 1 (Red): 0.50mm
Color 2 (Yellow): 0.30mm
Color 3 (Green): 0.30mm
Color 4 (Cyan): 0.40mm
Color 5 (Blue): 0.30mm
Color 6 (Magenta): 0.40mm
Color 7 (White): 0.15mm
Color 8 (Gray): 0.15mm
...etc
```

### Paso 8: Crear Cajetín/Title Block

**Opción A: Dibujar Cajetín Simple**

```
Crear en espacio papel (Layout):

Rectángulo exterior: 297 × 210mm (A4 landscape)
Margen: 10mm

Cajetín (esquina inferior derecha):
- Tamaño: 180 × 60mm
- Divisiones según necesidad

Campos típicos:
- PROYECTO: [Nombre]
- UBICACIÓN: [Lugar]
- CONTENIDO: [Descripción]
- ESCALA: 1:75
- FECHA: [dd/mm/aaaa]
- DIBUJÓ: [Nombre]
- REVISÓ: [Nombre]
- INSTITUCIÓN: [Universidad/Empresa]
- LÁMINA: 01/XX
```

**Opción B: Usar Plantilla Existente**

```
Importar cajetín:
Comando: INSERT
- Browse: Seleccionar archivo con cajetín
- Insertion point: Según layout
- Explode: No (mantener como bloque)
```

### Paso 9: Crear Layouts

**Layout 1: PLANTA GENERAL**
```
- Paper size: A1 (594 × 841mm) o A3 (297 × 420mm)
- Orientation: Landscape
- Plot scale: 1:1 (en papel)
- Viewport scale: 1:75xp (en model space)
```

**Layout 2: PLANTA VIALIDADES**
```
Similar configuración
Layer freeze: Todas excepto VIALIDADES-* y ANOTACIONES-*
```

**Layout 3-7:** Similar para cada tema

### Paso 10: Configurar Variables del Sistema

```
Configuraciones recomendadas:

LTSCALE = 75 (para escala 1:75)
MSLTSCALE = 1
PSLTSCALE = 1

DIMSCALE = 75 (para dimensiones a escala)

SNAPUNIT = 1,1 (snap cada metro)
GRIDUNIT = 5,5 (grid cada 5 metros)

LUNITS = 2 (decimal)
LUPREC = 2 (dos decimales)

PICKBOX = 5
APERTURE = 10
```

### Paso 11: Crear Bloques Base

**Bloque: NORTE**
```
Comando: BLOCK
- Name: NORTE
- Base point: Centro
- Objects: Flecha de norte con texto "N"
- Escala: Apropiada para planos
```

**Bloque: ESCALA GRÁFICA**
```
Para escala 1:75:
- Crear barra con divisiones cada 75m (1m en papel)
- Labels: 0, 75, 150, 225, 300 metros
```

**Bloque: ÁRBOL (Símbolo)**
```
- Círculo de 3m de diámetro (típico)
- Copa simplificada
```

**Bloque: PERSONA (Escala)**
```
- Altura: 1.75m aprox
- Silueta simple
```

**Bloque: VEHÍCULO (Escala)**
```
- Largo: 4.5m × Ancho: 1.8m (auto típico)
- Rectángulo simplificado
```

### Paso 12: Guardar como Plantilla

```
Comando: SAVEAS
- Files of type: AutoCAD Drawing Template (*.dwt)
- File name: plantilla_autocad.dwt
- Location: /templates/
- Description: Plantilla para proyecto urbano 1:75
- Measurement: Metric
- Save
```

## Uso de la Plantilla

### Crear Nuevo Dibujo desde Plantilla

```
File > New
- Select Template: plantilla_autocad.dwt
```

O:

```
Comando: NEW
- Use a Template
- Browse: plantilla_autocad.dwt
```

### Verificación Post-Creación

- [ ] Unidades: Metros
- [ ] Escala base: 1:75
- [ ] Capas: Todas presentes con colores correctos
- [ ] Estilos de texto: Configurados
- [ ] Estilos de cota: Configurados
- [ ] Layouts: Creados con viewports
- [ ] Cajetín: Visible y editable
- [ ] Bloques: Disponibles

## Mantenimiento de la Plantilla

### Actualizar Plantilla

1. Abrir archivo .dwt
2. Hacer cambios necesarios
3. Guardar (sobrescribir)
4. Documentar cambios en changelog

### Versionado

```
Convención de nombres:
plantilla_autocad_v1.0.dwt
plantilla_autocad_v1.1.dwt (con cambios menores)
plantilla_autocad_v2.0.dwt (con cambios mayores)
```

### Changelog de Plantilla

```
Versión 1.0 (2024-01-15)
- Creación inicial
- Capas básicas configuradas
- Cajetín estándar

Versión 1.1 (2024-01-20)
- Agregadas capas de topografía
- Actualizado estilo de cotas
- Nuevo bloque de escala gráfica
```

## Distribución de la Plantilla

### Para Trabajo en Equipo

1. **Ubicación centralizada**
   ```
   Servidor compartido:
   \\servidor\proyectos\templates\plantilla_autocad.dwt
   ```

2. **Configurar AutoCAD para buscar plantilla**
   ```
   Options > Files > Template Settings
   - Add: Ruta al folder de templates
   ```

3. **Instrucciones al equipo**
   - Siempre usar plantilla oficial
   - No modificar plantilla individual
   - Reportar necesidades de cambios

## Troubleshooting

### Plantilla no aparece en lista

**Solución:**
- Verificar que esté en folder correcto
- Verificar extensión .dwt (no .dwg)
- Reiniciar AutoCAD
- Agregar folder en Options > Files

### Capas desaparecen al crear nuevo dibujo

**Solución:**
- Verificar que plantilla se guardó correctamente
- No debe estar en Layer 0 al guardar
- Usar PURGE antes de guardar plantilla

### Escalas incorrectas

**Solución:**
- Revisar DIMSCALE = 75
- Revisar LTSCALE = 75
- Verificar que viewport esté en 1:75xp

## Recursos Adicionales

### Plantillas Avanzadas

**Atributos dinámicos en cajetín:**
```
Comando: ATTDEF
- Tag: PROYECTO_NOMBRE
- Prompt: Nombre del proyecto
- Default: [A llenar]
- En bloque del cajetín
```

**Campos automáticos:**
```
Comando: FIELD
- Date (Fecha automática)
- Filename (Nombre de archivo)
- Author (Autor desde propiedades)
```

### Scripts de Automatización

**Para crear capas masivamente:**
Guardar como `crear_capas.scr` y ejecutar con `SCRIPT`

**Para configurar variables:**
Guardar como `config_vars.scr`

## Conclusión

Una plantilla bien configurada:
- Ahorra tiempo de configuración
- Asegura consistencia
- Reduce errores
- Facilita colaboración
- Profesionaliza el trabajo

**Siguiente paso:**
Una vez creada la plantilla, seguir [FLUJO_MODULAR.md](../docs/FLUJO_MODULAR.md) para desarrollo del proyecto.
