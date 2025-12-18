# Guía de Importación de Planos Base

## Introducción

La importación correcta de planos base es fundamental para establecer referencias precisas en el proyecto urbano. Esta guía cubre diferentes formatos y métodos de importación.

## Formatos Compatibles

### Formatos Nativos de AutoCAD

1. **DWG (Drawing)**
   - Formato nativo de AutoCAD
   - Mejor opción para preservar toda la información
   - Geometría, capas, estilos de texto, etc.

2. **DXF (Drawing Exchange Format)**
   - Formato de intercambio universal
   - Compatible con múltiples aplicaciones CAD
   - Texto plano, puede perder algunos atributos

### Formatos de Imágenes y Documentos

3. **PDF**
   - Común en documentación oficial
   - Requiere importación o attach
   - Puede contener vectores o raster

4. **Imágenes (JPG, PNG, TIFF, etc.)**
   - Útiles para fotos aéreas o escaneos
   - Requieren georreferenciación
   - Menor precisión que formatos vectoriales

5. **Formatos GIS (SHP, KML, etc.)**
   - Datos geoespaciales
   - Requiere plugin o conversión
   - Útil para contexto geográfico

## Método 1: Importar Archivos DWG/DXF

### Opción A: INSERT (Insertar como Bloque)

**Cuándo usar:**
- Plano base que no cambiará
- Archivo pequeño
- Se necesita copiar la geometría al archivo actual

**Pasos:**

1. **Abrir archivo destino**
   ```
   Archivo: ciudad_base.dwg
   ```

2. **Ejecutar comando INSERT**
   ```
   Comando: INSERT (o I)
   Atajo: Ctrl+Shift+I
   ```

3. **Configurar inserción**
   ```
   Dialog Box:
   - Browse: Seleccionar archivo DWG/DXF
   - Insertion Point: Especificar 0,0,0
   - Scale: X=1, Y=1, Z=1
   - Rotation: 0
   - ☑ Explode (opcional, para descomponer)
   ```

4. **Verificar inserción**
   ```
   Comando: ZOOM Extents
   Comando: LIST (seleccionar objeto insertado)
   ```

**Ventajas:**
- Copia toda la geometría al archivo
- No depende del archivo original
- Fácil de manejar

**Desventajas:**
- Aumenta tamaño del archivo
- No se actualiza si el original cambia
- Puede generar nombres de capa conflictivos

### Opción B: XREF (Referencia Externa)

**Cuándo usar:**
- Plano base que puede actualizarse
- Archivo grande
- Trabajo colaborativo
- Mantener archivos separados

**Pasos:**

1. **Abrir archivo destino**
   ```
   Archivo: ciudad_base.dwg
   ```

2. **Ejecutar comando XREF**
   ```
   Comando: XREF (o XR)
   Atajo: Ctrl+Alt+R
   ```

3. **Attach DWG**
   ```
   En External References Palette:
   - Click en "Attach DWG"
   - Seleccionar archivo
   - Reference Type: Attachment
   - Insertion Point: 0,0,0
   - Scale: 1
   - Rotation: 0
   - Path Type: Relative (recomendado)
   ```

4. **Configurar capa de XREF**
   ```
   Crear capa: REFERENCIA-XREF
   Mover XREF a esta capa
   Color: Gris (8)
   Lock: Activar
   ```

**Ventajas:**
- Archivo principal más ligero
- Se actualiza automáticamente
- Ideal para colaboración
- Fácil de reemplazar

**Desventajas:**
- Depende de archivo externo
- Puede causar problemas si se mueve
- Requiere gestión de rutas

**Mejores prácticas con XREF:**
```
Estructura de carpetas:
proyecto/
├── ciudad_base.dwg
└── referencias/
    ├── catastro.dwg
    ├── topografia.dwg
    └── servicios_existentes.dwg
```

### Configuración de Capas después de Importar

**Problema:** Capas del archivo importado pueden no seguir nomenclatura

**Solución:**

1. **Identificar capas importadas**
   ```
   Comando: LAYER
   - Capas suelen tener prefijo del archivo
   - Ejemplo: catastro|LOTES, catastro|VIAS
   ```

2. **Renombrar capas (si INSERT con Explode)**
   ```
   Comando: RENAME
   - Old Name: nombre_original
   - New Name: nombre_estándar
   ```

3. **Para XREF: Controlar visibilidad**
   ```
   - No renombrar capas de XREF
   - Usar Layer States para control
   - VP Freeze en viewports donde no se necesite
   ```

4. **Organizar con filtros**
   ```
   Layer Properties Manager:
   - Crear filtro: *XREF*
   - Agrupar capas relacionadas
   ```

## Método 2: Importar Archivos PDF

### Opción A: PDFIMPORT (AutoCAD 2017+)

**Convierte PDF a geometría editable**

**Pasos:**

1. **Ejecutar comando**
   ```
   Comando: PDFIMPORT
   ```

2. **Seleccionar archivo PDF**
   ```
   - Browse al archivo PDF
   - Si el PDF tiene múltiples páginas, seleccionar la deseada
   ```

3. **Configurar importación**
   ```
   Options:
   - ☑ Import TrueType text as text objects
   - ☑ Import SHX text as text objects
   - ☑ Use PDF layers
   - Scale: Especificar si se conoce
   - Rotation: 0 (usualmente)
   ```

4. **Especificar punto de inserción**
   ```
   - Pick point: 0,0 (o según necesidad)
   ```

5. **Verificar y ajustar escala**
   ```
   Medir distancia conocida:
   Comando: DIST
   - Seleccionar dos puntos
   - Comparar con dimensión real
   - Ajustar con SCALE si necesario
   ```

**Ventajas:**
- Geometría editable
- Texto reconocible
- Capas preservadas (si el PDF las tiene)

**Desventajas:**
- PDFs raster no se convierten bien
- Puede generar geometría compleja
- Archivos pesados

### Opción B: PDFATTACH (Referencia PDF)

**Adjunta PDF como imagen referenciada**

**Pasos:**

1. **Ejecutar comando**
   ```
   Comando: PDFATTACH
   ```

2. **Seleccionar y configurar**
   ```
   - Select PDF: Browse al archivo
   - Page: Seleccionar página
   - Insertion Point: 0,0
   - Scale: 1 (ajustar después)
   - Rotation: 0
   ```

3. **Configurar transparencia**
   ```
   Comando: PROPERTIES (con PDF seleccionado)
   - Contrast: Ajustar (ej: 75)
   - Fade: Ajustar (ej: 50)
   - Monochrome: Opcional
   ```

4. **Lock la capa**
   ```
   Mover PDF a capa REFERENCIA-PDF
   Lock la capa para evitar mover accidentalmente
   ```

**Ventajas:**
- Archivo ligero
- Rápido
- Útil como referencia visual

**Desventajas:**
- No editable
- Calidad dependiente del PDF original
- Difícil medir con precisión

## Método 3: Importar Imágenes (Fotos Aéreas, Escaneos)

### Comando: IMAGEATTACH

**Pasos:**

1. **Preparar imagen**
   ```
   Formato recomendado: TIFF o PNG
   Resolución: Al menos 300 DPI para escaneos
   Georreferenciada si es posible
   ```

2. **Ejecutar comando**
   ```
   Comando: IMAGEATTACH
   ```

3. **Seleccionar archivo**
   ```
   - Browse a la imagen
   - Insertion Point: 0,0
   ```

4. **Configurar escala**
   ```
   Si la imagen tiene escala conocida:
   - Medir distancia conocida en imagen
   - Calcular factor de escala
   - Aplicar con SCALE
   
   Ejemplo:
   - Distancia en imagen: 100 unidades
   - Distancia real: 500m
   - Factor: 500/100 = 5
   - Comando: SCALE, Factor: 5
   ```

5. **Ajustar transparencia**
   ```
   Comando: PROPERTIES (con imagen seleccionada)
   - Transparency: 50-70% (según necesidad)
   ```

6. **Configurar capa**
   ```
   Capa: REFERENCIA-IMAGEN
   Lock: Activar
   Mostrar/Ocultar según necesidad
   ```

### Georreferenciación de Imágenes

**Si la imagen tiene coordenadas geográficas:**

1. **Activar Geolocation**
   ```
   Comando: GEOMAP
   ```

2. **Establecer coordenadas**
   ```
   - Define Location From File (si hay .tfw, .jgw, etc.)
   - O manualmente con puntos de control
   ```

3. **Verificar**
   ```
   Comando: GEOGRAPHICLOCATION
   - Revisar coordenadas
   ```

## Método 4: Importar desde GIS

### Usando Map 3D o Civil 3D

**Si tienes AutoCAD Map 3D o Civil 3D:**

1. **Importar Shapefile**
   ```
   Task Pane > Map Explorer
   - Data > Connect to Data
   - Add SHP file
   - Import to drawing
   ```

2. **Convertir a geometría AutoCAD**
   ```
   - Export drawing objects
   - Seleccionar capas
   - Convert to AutoCAD objects
   ```

### Usando Conversores Externos

**Alternativa: Convertir SHP a DXF**

1. **Usar QGIS (gratuito)**
   ```
   - Abrir shapefile en QGIS
   - Layer > Save As
   - Format: AutoCAD DXF
   - CRS: Apropiado para tu zona
   - Save
   ```

2. **Importar DXF resultante**
   ```
   Seguir Método 1 (INSERT o XREF)
   ```

## Escalado y Ajuste de Planos Importados

### Verificar Escala

**Método de distancia conocida:**

1. **Identificar distancia conocida**
   ```
   Ejemplo: Una calle que mide 12m de ancho
   ```

2. **Medir en el dibujo**
   ```
   Comando: DIST
   - First point: Un lado de la calle
   - Second point: Otro lado
   - Resultado: Ej. 0.16 unidades
   ```

3. **Calcular factor de escala**
   ```
   Factor = Distancia Real / Distancia Medida
   Factor = 12 / 0.16 = 75
   ```

4. **Escalar el objeto**
   ```
   Comando: SCALE
   - Select objects: Seleccionar plano importado
   - Base point: Punto de referencia fijo
   - Scale factor: 75
   ```

### Rotar Plano

**Si el norte no está alineado:**

1. **Comando ROTATE**
   ```
   Comando: ROTATE
   - Select objects: Plano importado
   - Base point: Punto de rotación
   - Rotation angle: Ángulo (o usar Reference)
   ```

2. **Usando Reference**
   ```
   Comando: ROTATE
   - Select objects: Plano
   - Base point: Punto de rotación
   - Specify rotation angle or [Reference]: R
   - Specify reference angle <0>: Pick dos puntos de línea que debe ser vertical/horizontal
   - Specify new angle: 0 (o 90, según orientación deseada)
   ```

### Alinear con Coordenadas

**Si tienes puntos de control con coordenadas:**

1. **Comando ALIGN**
   ```
   Comando: ALIGN
   - Select objects: Plano
   - Specify first source point: Punto 1 en plano
   - Specify first destination point: Coordenada 1 real
   - Specify second source point: Punto 2 en plano
   - Specify second destination point: Coordenada 2 real
   - Specify third source point or [Continue]: C
   - Scale objects based on alignment points [Yes/No]: Y
   ```

## Limpieza y Optimización

### Después de Importar

1. **Audit del archivo**
   ```
   Comando: AUDIT
   - Fix any errors: Yes
   ```

2. **Purge elementos innecesarios**
   ```
   Comando: PURGE
   - Options: Purge all
   - Confirmar eliminación
   ```

3. **Eliminar duplicados**
   ```
   Comando: OVERKILL
   - Select objects: All
   - Tolerance: 0.0001
   ```

4. **Simplificar polilíneas complejas**
   ```
   Comando: PEDIT
   - Select polyline: Seleccionar
   - Enter an option [Spline]: S
   - Or use SIMPLIFY for complex polylines
   ```

### Organizar Capas Importadas

```
Ejemplo de organización:
REFERENCIA-CATASTRO-LOTES
REFERENCIA-CATASTRO-VIAS
REFERENCIA-TOPOGRAFIA-CURVAS
REFERENCIA-SERVICIOS-AGUA
REFERENCIA-SERVICIOS-ELECTRICIDAD
```

## Checklist de Importación

**Antes de importar:**
- [ ] Archivo fuente preparado y accesible
- [ ] Conocer escala del plano (si aplica)
- [ ] Identificar puntos de referencia
- [ ] Decidir método: INSERT, XREF, ATTACH
- [ ] Preparar estructura de carpetas

**Durante importación:**
- [ ] Punto de inserción correcto (usualmente 0,0)
- [ ] Escala verificada
- [ ] Rotación correcta (norte arriba)
- [ ] Capa apropiada asignada
- [ ] Transparencia/fade configurado

**Después de importar:**
- [ ] Verificar escala midiendo distancia conocida
- [ ] Ejecutar AUDIT
- [ ] Ejecutar PURGE
- [ ] Lock capa de referencia
- [ ] Crear Layer State para referencia
- [ ] Guardar archivo
- [ ] Documentar origen del plano importado

## Solución de Problemas

### Plano muy grande o muy pequeño

**Problema:** El plano aparece pero no se ve (muy grande) o es un punto (muy pequeño)

**Solución:**
```
Comando: ZOOM Extents
Si aún no se ve:
- Comando: LIST (seleccionar objeto)
- Verificar coordenadas
- Si están en millones: Objeto muy lejos del origen
  - Comando: MOVE
  - From point: Punto actual del objeto
  - To point: 0,0
```

### Plano en coordenadas geográficas

**Problema:** Coordenadas en formato lat/lon o UTM (valores grandes)

**Solución:**
```
1. Establecer sistema de coordenadas:
   Comando: GEOGRAPHICLOCATION
   
2. O trasladar al origen:
   Comando: MOVE
   - From: Punto del plano
   - To: 0,0
   - Ajustar escala si necesario
```

### PDF no se importa correctamente

**Problema:** PDFIMPORT genera geometría muy compleja o incorrecta

**Solución:**
```
1. Intentar PDFATTACH en lugar de PDFIMPORT
2. Convertir PDF a DWG con herramienta externa
3. Usar como referencia visual únicamente
4. Re-crear geometría manualmente sobre PDF attached
```

### Imagen distorsionada

**Problema:** Imagen se ve estirada o comprimida

**Solución:**
```
1. Verificar aspect ratio:
   Comando: PROPERTIES (imagen seleccionada)
   - Scale X y Scale Y deben mantener proporción
   
2. Re-insertar con "Maintain aspect ratio" activado

3. Si es escaneo: Verificar que el escaneo original esté correcto
```

## Documentación

**Importante:** Documentar origen de cada plano importado

**Crear archivo de texto: fuentes_planos.txt**
```
ARCHIVO: catastro_base.dwg
ORIGEN: Municipio de [Ciudad]
FECHA: 2024-01-15
ESCALA ORIGINAL: 1:1000
COORDENADAS: UTM Zona 13N
CONTACTO: catastro@municipio.gob
NOTAS: Información actualizada a enero 2024

ARCHIVO: foto_aerea.jpg
ORIGEN: Google Earth Pro
FECHA: 2023-12-01
RESOLUCIÓN: 4800x3600 px
ÁREA: Lat 19.4326, Lon -99.1332
NOTAS: Imagen referencial, no oficial
```

## Conclusión

La importación correcta de planos base es crucial para el éxito del proyecto. Considera:

- **Método apropiado** según tipo de archivo y necesidad
- **Verificación de escala** siempre
- **Organización** en capas dedicadas
- **Documentación** del origen
- **Backup** antes de operaciones mayores

Para continuar con el proyecto:
- [FLUJO_MODULAR.md](FLUJO_MODULAR.md) - Siguiente fase de desarrollo
- [CAPAS_AUTOCAD.md](CAPAS_AUTOCAD.md) - Organización de capas
