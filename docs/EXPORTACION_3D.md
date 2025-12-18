# Preparación para Exportación 3D

## Introducción

Este documento describe el proceso de preparación del proyecto urbano 2D en AutoCAD para su exportación y visualización en plataformas 3D como SketchUp, Revit, Lumion, 3ds Max, Blender, etc.

## Conceptos Básicos

### De 2D a 3D

**El proceso implica:**
1. Convertir geometría 2D plana en objetos con volumen
2. Asignar alturas apropiadas a cada elemento
3. Verificar integridad geométrica
4. Exportar en formato compatible

**Consideraciones:**
- Mantener organización por capas
- Geometría limpia (sin gaps, overlaps)
- Polilíneas cerradas donde se requiera extrusión
- Nomenclatura consistente

## Preparación de Geometría

### 1. Verificación de Polilíneas

**Objetivo:** Asegurar que todas las formas estén cerradas

**Para edificaciones:**

```
Comando: PEDIT
- Select polyline: Seleccionar edificación
- Enter an option [Close]: C (si no está cerrada)

O para múltiples:
Comando: PEDIT
- Select polyline: Seleccionar todas
- Multiple selected
- Enter an option [Close]: C
```

**Verificar cierre:**
```
Comando: LIST
- Closed: Yes (debe decir "Yes")
```

**Crear polilíneas si no existen:**
```
Comando: BOUNDARY
- Pick Points: Click dentro del área cerrada
- Capa: Mover a capa apropiada
```

### 2. Limpieza de Geometría

**Eliminar duplicados:**
```
Comando: OVERKILL
- Select objects: All
- Tolerance: 0.001
- ☑ Ignore polyline widths
- ☑ Optimize polylines
```

**Unir segmentos:**
```
Comando: JOIN
- Select source object: Primera línea
- Select objects to join: Líneas adyacentes
```

**Simplificar polilíneas complejas:**
```
Comando: PEDIT
- Select polyline: Seleccionar
- Enter an option [Fit/Spline/Decurve]: D (Decurve)
```

### 3. Separar por Alturas

**Organizar edificaciones por número de pisos:**

**Crear nuevas capas:**
```
EDIFICACIONES-1PISO (Altura: 3m)
EDIFICACIONES-2PISOS (Altura: 6m)
EDIFICACIONES-3PISOS (Altura: 9m)
EDIFICACIONES-4PISOS (Altura: 12m)
...
EDIFICACIONES-8+PISOS (Altura: 24m+)
```

**Mover objetos a capas apropiadas:**
```
Comando: PROPERTIES
- Seleccionar edificación
- Layer: Cambiar a capa según altura
```

## Métodos de Dar Altura (3D)

### Método 1: Property THICKNESS (Más simple)

**Ventaja:** Rápido, no modifica geometría 2D

**Pasos:**

1. **Seleccionar objetos por capa**
   ```
   Comando: QSELECT
   - Object type: All
   - Properties: Layer
   - Operator: = Equals
   - Value: EDIFICACIONES-3PISOS
   - OK
   ```

2. **Asignar Thickness**
   ```
   Comando: PROPERTIES (con objetos seleccionados)
   - Thickness: 9 (para 3 pisos × 3m)
   ```

3. **Ver en 3D**
   ```
   Comando: VSCURRENT
   - Select: Conceptual o Realistic
   
   O cambiar vista:
   Comando: 3DORBIT
   ```

**Tabla de alturas recomendadas:**
```
Tipo de edificación    | Pisos | Altura (m)
-----------------------|-------|------------
Vivienda baja          | 1     | 3.0
Vivienda media         | 2     | 6.0
Vivienda alta          | 3-4   | 9.0-12.0
Edificio residencial   | 5-8   | 15.0-24.0
Comercio               | 1-2   | 4.0-8.0
Oficinas               | 4-10  | 12.0-30.0
Hospital               | 3-6   | 12.0-24.0
Escuela                | 1-3   | 3.5-10.5
```

### Método 2: EXTRUDE (Más preciso)

**Ventaja:** Crea sólidos 3D editables

**Pasos:**

1. **Preparar vista**
   ```
   Comando: PLAN
   - Enter an option [Current ucs/Ucs/World]: W
   ```

2. **Extrudir edificaciones**
   ```
   Comando: EXTRUDE
   - Select objects to extrude: Seleccionar polilínea cerrada
   - Specify height of extrusion: 9 (para 3 pisos)
   - Specify angle of taper: 0 (sin inclinación)
   ```

3. **Para múltiples objetos con misma altura**
   ```
   - Seleccionar todos los de una capa
   - Comando: EXTRUDE
   - Misma altura para todos
   ```

**Crear techos inclinados:**
```
Comando: EXTRUDE
- Select objects: Polilínea del techo
- Specify height: 0
- Specify angle of taper: 15-30 (ángulo del techo)
```

### Método 3: Usar Elevation

**Para elementos al ras del suelo o elevados:**

```
Comando: PROPERTIES
- Seleccionar objeto
- Elevation: 
  * 0 = Nivel del suelo
  * 0.15 = Banqueta/acera elevada
  * -2.0 = Sótano
```

**Ejemplo: Banquetas**
```
Seleccionar todas las banquetas:
- Elevation: 0.15
- Thickness: 0.15
```

## Preparación por Tipo de Elemento

### Edificaciones

**Configuración:**
```
1. Cerrar todas las polilíneas
2. Separar por número de pisos (capas)
3. Asignar altura:
   - Thickness: Altura total
   - O EXTRUDE: Altura total
4. Elevation: 0 (nivel del suelo)
```

**Detalles adicionales (opcional):**
- Ventanas: Crear como rectángulos, elevation según piso
- Puertas: Similar a ventanas, elevation 0
- Balcones: Thickness menor, elevation según piso

### Vialidades

**Calles y avenidas:**
```
Capa: VIALIDADES-*
- Thickness: 0 (planas)
- Elevation: 0
- Material: Asfalto (en software 3D)
```

**Banquetas/aceras:**
```
Capa: VIALIDADES-PEATONALES
- Thickness: 0.15m
- Elevation: 0.15m (elevadas respecto a calle)
- Material: Concreto
```

**Pasos a desnivel (opcional):**
```
Si hay pendientes:
- Modelar con LOFT o SWEEP
- O simplificar con rampas planas
```

### Áreas Verdes

**Parques y jardines:**
```
Capa: AREAS_VERDES-*
- Thickness: 0
- Elevation: 0 o según topografía
- Material: Pasto/vegetación
```

**Árboles:**
```
Opción 1: Símbolos 2D (círculos)
- Dejar para agregar en software 3D

Opción 2: Bloques 3D simples
- Crear cilindro para tronco
- Esfera para copa
- Altura: 5-15m según tipo
```

### Servicios e Infraestructura

**Red de agua/drenaje (subterránea):**
```
- No extrudir (subterráneos)
- O Elevation: -1.5m
- Thickness: 0.5m (diámetro de tubería)
```

**Red eléctrica (aérea):**
```
Postes:
- Altura: 8-12m
- Crear como líneas verticales

Cables:
- Modelar en 3D si es necesario
- O simplificar en software 3D
```

### Mobiliario Urbano (Opcional)

**Bancas, luminarias, señales:**
```
Opción 1: Símbolos 2D
- Dejar para agregar en 3D

Opción 2: Bloques 3D
- Importar de librerías
- O crear simples con EXTRUDE/REVOLVE
```

## Topografía (Opcional pero Recomendado)

### Si tienes curvas de nivel:

**Método 1: Usar comando 3DMESH**

```
Comando: 3DMESH
- Crear malla a partir de curvas de nivel
- Requiere plugin o LISP
```

**Método 2: Superficie en Civil 3D**

```
Si tienes Civil 3D:
- Create Surface from Contours
- Export to AutoCAD
```

**Método 3: Simplificación**

```
Crear plataformas a diferentes niveles:
- Elevation: 0, 5, 10, 15, etc.
- Thickness: 0
- Conectar con rampas simples
```

## Verificación Pre-Exportación

### Checklist de Geometría

**General:**
- [ ] Todas las polilíneas cerradas (donde aplique)
- [ ] Sin gaps en geometría
- [ ] Sin overlaps no intencionales
- [ ] Capas organizadas y nombradas correctamente
- [ ] Alturas asignadas apropiadamente

**Por capa:**
```
Comando: LAYER
- Revisar cada capa
- Verificar que tenga elementos
- Verificar heights/thickness apropiados
```

**Audit:**
```
Comando: AUDIT
- Fix any errors: Yes

Comando: PURGE
- Purge all unused
```

### Vista 3D de Verificación

**Cambiar a vista 3D:**
```
Comando: 3DORBIT
- Rotar vista para inspeccionar
- Verificar que elementos tengan altura correcta
```

**Cambiar estilo visual:**
```
Comando: VSCURRENT
- 2D Wireframe: Ver todo
- Hidden: Ocultar líneas traseras
- Conceptual: Con colores
- Realistic: Con materiales
```

**Views preestablecidas:**
```
Comando: VIEW
- Top: Vista de planta
- SW Isometric: Vista isométrica sudoeste
- SE Isometric: Vista isométrica sudeste
```

### Crear Vistas de Presentación

**Para documentar el 3D:**

1. **Crear Layout 3D**
   ```
   - Nuevo Layout: PRESENTACION-3D
   - Viewport: Vista isométrica
   ```

2. **Configurar Viewport**
   ```
   - Doble click en viewport
   - Comando: 3DORBIT (ajustar vista)
   - Comando: VSCURRENT (Conceptual)
   - Zoom apropiado
   ```

3. **Añadir múltiples vistas**
   ```
   Layout con 4 viewports:
   - Top (Planta)
   - SW Isometric
   - SE Isometric
   - Front
   ```

## Formatos de Exportación

### Opción 1: DWG (Para SketchUp, Revit)

**AutoCAD a SketchUp:**

```
Guardar como:
Comando: SAVEAS
- File type: AutoCAD 2018 DWG
- Location: Especificar
- Save
```

**Importar en SketchUp:**
```
SketchUp:
- File > Import
- Files of type: AutoCAD Files (*.dwg, *.dxf)
- Options: 
  * Preserve drawing origin
  * Merge coplanar faces
- Select file y Open
```

**AutoCAD a Revit:**

```
Similar proceso:
- Guardar como DWG
- En Revit: Insert > Link CAD
- Posicionar apropiadamente
```

### Opción 2: FBX (Para Visualización)

**Exportar:**

```
Comando: 3DEXPORT o EXPORT
- File type: FBX (*.fbx)
- Especificar nombre
- Options:
  * Export: All objects o Selected
  * File type: Binary (más eficiente)
  * FBX version: Más reciente compatible
- Save
```

**Compatible con:**
- Lumion
- 3ds Max
- Blender
- Unity
- Unreal Engine

### Opción 3: OBJ (Universal)

**Exportar:**

```
Comando: EXPORT
- File type: OBJ (*.obj)
- Nombre del archivo
- Options:
  * Export normals
  * Export texture coordinates (si hay)
- Save
```

**Ventaja:**
- Formato universal
- Texto plano (puede editarse)
- Compatible con casi todo

### Opción 4: STL (Para Impresión 3D)

**Si consideras impresión 3D:**

```
Comando: STLOUT o 3DPRINT
- Select a single solid or watertight mesh
- Especificar nombre
- Binary o ASCII
```

**Nota:** 
- Requiere sólidos cerrados
- Considerar escala (usualmente 1:1000 o más para ciudades)

### Opción 5: PDF 3D

**Crear PDF con 3D interactivo:**

```
Comando: EXPORT3DPDF (si disponible)
O:
- Crear vista 3D en layout
- Imprimir a PDF con Acrobat 3D
```

## Workflow Recomendado por Software Destino

### Para SketchUp

**Preparación:**
1. Extrudir todos los edificios con EXTRUDE
2. Agrupar por tipo (mismo script de Ruby en SketchUp)
3. Exportar como DWG 2018

**En SketchUp:**
1. Import DWG
2. Clean up: Remove duplicate faces
3. Agregar materiales
4. Agregar detalles (árboles, personas, vehículos)
5. Renderizar con V-Ray o exportar a Lumion

### Para Revit

**Preparación:**
1. Usar thickness o extrude
2. Capas muy organizadas
3. Levels en AutoCAD si es posible

**En Revit:**
1. Link CAD file
2. Use como base para modelar familias
3. O convert lines to walls/floors

### Para Lumion

**Preparación:**
1. Exportar como FBX o Collada (DAE)
2. O importar DWG directamente

**En Lumion:**
1. Import modelo
2. Asignar materiales de librería
3. Agregar vegetación y entorno
4. Iluminación y renderizado

### Para Blender

**Preparación:**
1. Exportar como FBX u OBJ
2. Incluir thickness/extrusions

**En Blender:**
1. Import FBX/OBJ
2. Check scale (ajustar si necesario)
3. Separar por materiales
4. Texturizar y renderizar

## Optimización para 3D

### Reducir Complejidad

**Simplificar curvas:**
```
Polilíneas con muchos vértices:
- PEDIT > Decurve
- O reducir vértices manualmente
```

**Eliminar detalles no visibles:**
```
- Mobiliario urbano muy pequeño
- Detalles menores de servicios
- Texto y anotaciones (agregar en 3D)
```

### Agrupar Elementos

**Crear bloques:**
```
Elementos repetitivos (viviendas similares):
Comando: BLOCK
- Name: VIVIENDA_TIPO_A
- Base point: Esquina
- Select objects: Edificación
- Convert to block
```

**Ventaja:**
- Más eficiente
- Ediciones globales fáciles
- Menor tamaño de archivo

### Layer States para Exportación

**Crear estados específicos:**

```
Layer States Manager:
- EXPORT_3D_EDIFICACIONES: Solo edificios
- EXPORT_3D_VIALIDADES: Solo calles
- EXPORT_3D_COMPLETO: Todo relevante (sin anotaciones)
```

## Materiales y Texturas (Preparación)

### Asignar Materiales en AutoCAD

**Opcional pero útil:**

```
Comando: MATERIALS
- Crear material: CONCRETO
  * Color: Gris
  * Difuse map: Textura si disponible
  
- Aplicar a objetos:
  * Select object
  * Properties > Material: CONCRETO
```

**Materiales comunes:**
- ASFALTO (calles)
- CONCRETO (banquetas, algunos edificios)
- LADRILLO (edificaciones)
- VIDRIO (fachadas modernas)
- PASTO (áreas verdes)
- TIERRA (terreno)

## Troubleshooting

### Objetos no se extruyen

**Problema:** EXTRUDE no funciona en objeto

**Mensaje de error común:** 
- "Objects must be closed" 
- "Cannot extrude object"
- "0 objects extruded"

**Causa:** Polilínea no cerrada o geometría inválida

**Solución:**
```
1. Comando: PEDIT
   - Close: C
   
2. Verificar con LIST que diga "Closed: Yes"

3. Si persiste: Recrear polilínea con BOUNDARY
```

### Geometría desaparece en 3D

**Problema:** Objeto visible en 2D pero no en 3D

**Mensaje de error común:**
- Sin error, pero objeto no visible en vista 3D
- "No objects found" al usar 3DORBIT

**Causa:** Thickness = 0 o sin propiedades 3D asignadas

**Solución:**
```
Comando: PROPERTIES
- Thickness: Asignar valor > 0
```

### Archivo muy pesado

**Problema:** Archivo 3D es muy grande para exportar

**Síntomas:**
- Archivo excede tamaño máximo de exportación
- AutoCAD se vuelve lento
- "Out of memory" error
- Export falla o toma mucho tiempo

**Solución:**
```
1. PURGE -All
2. OVERKILL
3. Simplificar geometría
4. Eliminar capas innecesarias
5. Exportar por secciones si es muy grande
```

### Software destino no lee archivos

**Problema:** FBX o DWG no se importa correctamente

**Mensajes de error comunes:**
- "Unable to open file"
- "Invalid file format"
- "Version not supported"
- "Import failed" en software destino

**Solución:**
```
1. Verificar versión de DWG (usar 2018 para mayor compatibilidad)
2. Probar diferentes formatos (FBX vs OBJ)
3. Verificar unidades en ambos programas
4. Scale factor en importación
```

## Checklist Final de Exportación

**Antes de exportar:**
- [ ] Geometría limpia (AUDIT, PURGE)
- [ ] Polilíneas cerradas
- [ ] Alturas asignadas
- [ ] Capas organizadas
- [ ] Layer State para exportación creado
- [ ] Vista 3D verificada
- [ ] Elementos innecesarios removidos
- [ ] Backup guardado

**Al exportar:**
- [ ] Formato correcto seleccionado
- [ ] Opciones de exportación configuradas
- [ ] Nombre de archivo descriptivo
- [ ] Guardar en ubicación correcta
- [ ] Verificar tamaño de archivo

**Después de exportar:**
- [ ] Probar importación en software destino
- [ ] Verificar escala
- [ ] Verificar que todo se importó
- [ ] Documentar proceso

## Recursos Adicionales

### Tutoriales de Exportación

- **AutoCAD a SketchUp:** Buscar "AutoCAD to SketchUp workflow"
- **AutoCAD a Revit:** "Link CAD in Revit"
- **AutoCAD a Lumion:** "Import DWG to Lumion"

### Formatos Recomendados por Software

```
SketchUp:    DWG/DXF (preferido)
Revit:       DWG (Link CAD)
Lumion:      FBX, Collada, DWG
3ds Max:     FBX, DWG
Blender:     FBX, OBJ
Unity:       FBX
Rhino:       DWG, 3DM
```

## Conclusión

La preparación adecuada para 3D:
- Facilita workflow en software de visualización
- Reduce tiempo de post-procesamiento
- Mejora calidad de presentaciones
- Permite iteraciones más rápidas

**Siguiente paso:**
- Importar en software 3D elegido
- Agregar materiales y texturas
- Añadir vegetación y entorno
- Iluminación y renderizado final

Para más información:
- [FLUJO_MODULAR.md](FLUJO_MODULAR.md) - Workflow completo
- [CAPAS_AUTOCAD.md](CAPAS_AUTOCAD.md) - Organización de capas
- [CHECKLIST_VALIDACION.md](../validacion/CHECKLIST_VALIDACION.md) - Validación final
