# Flujo de Trabajo Modular

## Introducción

Este documento describe el flujo de trabajo modular para el desarrollo del proyecto urbano en AutoCAD a escala 1:75. El enfoque modular permite validación por etapas y facilita la colaboración.

## Visión General del Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    FASE 1: PREPARACIÓN                       │
│  - Configuración inicial                                     │
│  - Importación de planos base                                │
│  - Configuración de capas                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FASE 2: DESARROLLO POR MÓDULOS                  │
│  - Módulo 1: Vialidades                                      │
│  - Módulo 2: Edificaciones                                   │
│  - Módulo 3: Servicios                                       │
│  - Módulo 4: Salud y Educación                              │
│  - Módulo 5: Áreas Verdes                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               FASE 3: INTEGRACIÓN                            │
│  - Verificación de compatibilidad                            │
│  - Ajustes y coordinación                                    │
│  - Anotaciones y dimensiones                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            FASE 4: VALIDACIÓN ACADÉMICA                      │
│  - Revisión de requisitos                                    │
│  - Documentación técnica                                     │
│  - Presentación                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          FASE 5: PREPARACIÓN PARA 3D (Opcional)             │
│  - Asignación de alturas                                     │
│  - Verificación de geometría                                 │
│  - Exportación                                               │
└─────────────────────────────────────────────────────────────┘
```

## FASE 1: Preparación

### 1.1 Configuración Inicial

**Objetivo:** Establecer el entorno de trabajo correcto

**Pasos:**

1. **Crear nuevo dibujo**
   - Abrir AutoCAD
   - `File > New`
   - Seleccionar plantilla métrica (acad.dwt o plantilla personalizada)

2. **Configurar unidades**
   ```
   Comando: UNITS
   - Tipo: Decimal
   - Precisión: 0.00
   - Unidades de dibujo: Metros
   ```

3. **Configurar escala**
   ```
   Escala del proyecto: 1:75
   - En espacio modelo: Dibujar a tamaño real
   - En layout/presentación: Configurar viewport a 1:75
   ```

4. **Configurar límites del dibujo**
   ```
   Comando: LIMITS
   - Esquina inferior izquierda: 0,0
   - Esquina superior derecha: Según tamaño del proyecto (ej: 1000,1000)
   
   Comando: ZOOM
   - Opción: All
   ```

**Entregable:** Archivo base configurado `ciudad_base.dwg`

### 1.2 Importación de Planos Base

**Objetivo:** Establecer referencias geométricas

**Pasos:**

1. **Preparar planos de referencia**
   - Formato preferido: DXF o DWG
   - Alternativa: PDF o imágenes georeferenciadas

2. **Importar planos**
   ```
   Para DWG/DXF:
   Comando: INSERT o XREF
   - Usar XREF para mantener referencia externa
   - Escalar apropiadamente
   
   Para PDF:
   Comando: PDFIMPORT
   - Especificar punto de inserción
   - Verificar escala
   
   Para imágenes:
   Comando: IMAGEATTACH
   - Especificar punto de inserción
   - Configurar transparencia si es necesario
   ```

3. **Crear capa de referencia**
   ```
   Capa: REFERENCIA-BASE
   Color: Gris claro (8)
   Grosor: ByLayer
   Estado: Lock (para no modificar)
   ```

4. **Georeferenciar (opcional)**
   ```
   Comando: GEOMAP
   - Establecer coordenadas si se requiere georreferenciación
   ```

**Entregable:** Planos base importados y referenciados

### 1.3 Configuración de Capas

**Objetivo:** Crear estructura de capas según estándar

**Pasos:**

1. **Abrir Layer Properties Manager**
   ```
   Comando: LAYER o LA
   Atajo: Ctrl+L (Windows) / Cmd+L (Mac)
   ```

2. **Crear capas principales**
   - Ver detalles en [CAPAS_AUTOCAD.md](CAPAS_AUTOCAD.md)
   - Usar convención de nombres establecida
   - Asignar colores y grosores

3. **Configurar Layer States**
   ```
   En Layer Properties Manager:
   - Click en "Layer States Manager"
   - Crear estados básicos:
     * TRABAJO_COMPLETO
     * PRESENTACION
     * EXPORTACION_3D
   ```

4. **Crear filtros de capa**
   ```
   - Filtro: VIALIDADES* (todas las capas de vialidades)
   - Filtro: EDIFICACIONES* (todas las capas de edificaciones)
   - Etc.
   ```

**Entregable:** Estructura de capas completa

## FASE 2: Desarrollo por Módulos

### Módulo 1: Vialidades (Semana 1)

**Objetivo:** Diseñar sistema de movilidad completo

**Tareas:**

1. **Vialidades Principales**
   - Capa: `VIALIDADES-PRINCIPALES`
   - Dibujar avenidas principales
   - Ancho típico: 12-20m (según normativa)
   - Comando: PLINE (polilíneas)

2. **Vialidades Secundarias**
   - Capa: `VIALIDADES-SECUNDARIAS`
   - Dibujar calles locales
   - Ancho típico: 8-12m

3. **Vialidades Peatonales**
   - Capa: `VIALIDADES-PEATONALES`
   - Banquetas/aceras: 2-4m de ancho
   - Paseos peatonales

4. **Ciclovías**
   - Capa: `VIALIDADES-CICLOVIAS`
   - Ancho: 2-3m
   - Segregadas de vehículos

**Validación del Módulo:**
- [ ] Conectividad completa
- [ ] Anchos apropiados
- [ ] Jerarquía vial clara
- [ ] Cumple normativa local
- [ ] Sin intersecciones problemáticas

**Entregable:** `ciudad_modulo1_vialidades.dwg`

### Módulo 2: Edificaciones (Semana 2)

**Objetivo:** Diseñar edificaciones según usos

**Tareas:**

1. **Zonificación**
   - Definir zonas: residencial, comercial, mixta
   - Considerar compatibilidad de usos

2. **Vivienda**
   - Capa: `EDIFICACIONES-VIVIENDA`
   - Densidad baja: unifamiliar (lotes 120-200m²)
   - Densidad media: multifamiliar (4-8 pisos)
   - Densidad alta: departamentos (8+ pisos)

3. **Comercial**
   - Capa: `EDIFICACIONES-COMERCIAL`
   - Locales comerciales en planta baja
   - Centros comerciales (según demanda)
   - Mercados tradicionales

4. **Industrial (si aplica)**
   - Capa: `EDIFICACIONES-INDUSTRIAL`
   - Separado de zonas residenciales
   - Acceso a vías principales

**Validación del Módulo:**
- [ ] Densidad apropiada
- [ ] Compatibilidad de usos
- [ ] Separación de zonas
- [ ] Acceso vehicular y peatonal
- [ ] Cumple índices de construcción

**Entregable:** `ciudad_modulo2_edificaciones.dwg`

### Módulo 3: Servicios (Semana 3)

**Objetivo:** Diseñar infraestructura de servicios básicos

**Tareas:**

1. **Agua Potable**
   - Capa: `SERVICIOS-AGUA`
   - Red de distribución
   - Tanques elevados/cisternas
   - Plantas de tratamiento/captación

2. **Drenaje**
   - Capa: `SERVICIOS-DRENAJE`
   - Red de alcantarillado
   - Pendientes adecuadas
   - Colectores principales

3. **Energía Eléctrica**
   - Capa: `SERVICIOS-ENERGIA`
   - Red de distribución
   - Subestaciones
   - Consideración de energías renovables

4. **Alimentación**
   - Capa: `SERVICIOS-ALIMENTACION`
   - Mercados (1 cada 2000-5000 hab)
   - Supermercados
   - Centros de distribución

**Validación del Módulo:**
- [ ] Cobertura completa
- [ ] Capacidad adecuada
- [ ] Redundancia en sistemas críticos
- [ ] Sostenibilidad considerada
- [ ] Normativa cumplida

**Entregable:** `ciudad_modulo3_servicios.dwg`

### Módulo 4: Salud y Educación (Semana 4)

**Objetivo:** Ubicar equipamiento social

**Tareas:**

1. **Salud**
   - Capa: `SALUD-HOSPITALES` y `SALUD-CLINICAS`
   - Hospital general (1 cada 50,000 hab)
   - Centros de salud (1 cada 10,000 hab)
   - Clínicas barriales (1 cada 2,500 hab)
   - Acceso a vías principales
   - Radio de cobertura máximo: 15 min caminando

2. **Educación**
   - Capa: `EDUCACION-ESCUELAS` y `EDUCACION-UNIVERSIDADES`
   - Preescolar/Jardín (1 cada 1,000 hab)
   - Primaria (1 cada 2,500 hab)
   - Secundaria (1 cada 7,500 hab)
   - Universidad/Superior (según contexto)
   - Bibliotecas públicas

**Validación del Módulo:**
- [ ] Cobertura por radio de influencia
- [ ] Capacidad vs. población proyectada
- [ ] Accesibilidad adecuada
- [ ] Alejado de zonas de riesgo
- [ ] Espacios suficientes

**Entregable:** `ciudad_modulo4_salud_educacion.dwg`

### Módulo 5: Áreas Verdes y Espacios Públicos (Semana 5)

**Objetivo:** Diseñar sistema de espacios públicos

**Tareas:**

1. **Jerarquía de Espacios**
   - Parques metropolitanos (> 10 ha)
   - Parques urbanos (1-10 ha)
   - Parques vecinales (< 1 ha)
   - Plazas y plazoletas

2. **Áreas Verdes**
   - Capa: `AREAS_VERDES-PARQUES`
   - Mínimo: 9-16 m² de área verde por habitante
   - Distribución equitativa
   - Conectividad (corredores verdes)

3. **Espacios Recreativos**
   - Capa: `AREAS_VERDES-RECREATIVAS`
   - Canchas deportivas
   - Áreas de juegos infantiles
   - Equipamiento deportivo

4. **Arbolado Urbano**
   - Capa: `AREAS_VERDES-ARBOLADO`
   - Alineaciones en calles
   - Especies nativas preferidas

**Validación del Módulo:**
- [ ] Ratio m²/habitante cumplido
- [ ] Distribución equitativa
- [ ] Accesibilidad (máx 10 min caminando)
- [ ] Conectividad entre espacios
- [ ] Diversidad de espacios

**Entregable:** `ciudad_modulo5_areas_verdes.dwg`

## FASE 3: Integración

### 3.1 Consolidación

**Objetivo:** Unificar todos los módulos

**Pasos:**

1. **Abrir archivo base**
   ```
   Archivo: ciudad_base.dwg
   ```

2. **Importar módulos**
   ```
   Comando: INSERT o XREF
   - Insertar cada módulo desarrollado
   - Verificar escala y punto de inserción
   - Opción: Usar XREF para mantener archivos separados
   ```

3. **Bind (si usaste XREF)**
   ```
   Comando: XREF
   - Seleccionar cada referencia
   - Bind > Insert
   ```

### 3.2 Verificación de Compatibilidad

**Objetivo:** Asegurar que todos los elementos funcionen juntos

**Checklist:**

- [ ] Vialidades conectan con edificaciones
- [ ] Servicios cubren todas las edificaciones
- [ ] Equipamiento accesible desde vialidades
- [ ] Áreas verdes bien distribuidas
- [ ] Sin superposiciones no deseadas
- [ ] Sin gaps en cobertura

**Herramientas:**
```
Comando: OVERKILL - Eliminar geometría duplicada
Comando: AUDIT - Verificar integridad del archivo
Comando: PURGE - Limpiar elementos no utilizados
```

### 3.3 Anotaciones y Dimensiones

**Objetivo:** Documentar el diseño

**Tareas:**

1. **Textos**
   - Capa: `ANOTACIONES-TEXTOS`
   - Nombres de calles
   - Identificación de edificios
   - Etiquetas de zonas

2. **Dimensiones**
   - Capa: `ANOTACIONES-DIMENSIONES`
   - Anchos de vías
   - Dimensiones de lotes
   - Alturas de edificios (si aplica)

3. **Símbolos**
   - Capa: `ANOTACIONES-SIMBOLOS`
   - Norte
   - Escala gráfica
   - Leyenda

**Configuración de texto:**
```
Altura de texto en modelo = Altura deseada en papel × 75
Ejemplo: Texto de 2.5mm en papel = 187.5 en modelo (2.5 × 75)
```

**Entregable:** `ciudad_completo_anotado.dwg`

## FASE 4: Validación Académica

### 4.1 Revisión de Requisitos

**Objetivo:** Verificar cumplimiento de objetivos

**Checklist de Validación:**
- Ver [CHECKLIST_VALIDACION.md](../validacion/CHECKLIST_VALIDACION.md)

### 4.2 Documentación Técnica

**Objetivo:** Preparar memoria descriptiva

**Documentos a generar:**

1. **Memoria Descriptiva**
   - Descripción del proyecto
   - Justificación de decisiones de diseño
   - Normativa aplicada
   - Cálculos de población y servicios

2. **Cuadro de Áreas**
   - Área total del proyecto
   - Áreas por uso de suelo
   - Áreas de vialidades
   - Áreas verdes
   - Densidad poblacional

3. **Especificaciones Técnicas**
   - Materiales (si aplica)
   - Normas aplicadas
   - Referencias

### 4.3 Presentación

**Objetivo:** Preparar layouts para impresión/presentación

**Pasos:**

1. **Crear Layouts**
   ```
   - Layout 1: Planta general (escala 1:75)
   - Layout 2: Planta de vialidades
   - Layout 3: Planta de edificaciones
   - Layout 4: Planta de servicios
   - Layout 5: Planta de equipamiento
   - Layout 6: Planta de áreas verdes
   - Layout 7: Detalles específicos (escala mayor)
   ```

2. **Configurar Viewports**
   ```
   Comando: MVIEW
   - Crear viewport
   - Activar viewport: Doble click dentro
   - Comando: ZOOM
   - Especificar escala: 1/75xp (para escala 1:75)
   - Layer: Configurar VP Freeze para capas no relevantes
   ```

3. **Cajetín/Title Block**
   - Crear o importar cajetín estándar
   - Información del proyecto
   - Escala
   - Fecha
   - Autor/Institución

**Entregable:** Archivo con layouts completos

## FASE 5: Preparación para 3D (Opcional)

### 5.1 Asignación de Alturas

**Objetivo:** Preparar geometría para visualización 3D

**Pasos:**

1. **Asignar propiedad Thickness**
   ```
   Seleccionar objetos:
   Comando: PROPERTIES
   - Thickness: Altura del elemento
   
   Ejemplo:
   - Edificio de 3 pisos: Thickness = 9m (3 × 3m)
   - Banqueta: Thickness = 0.15m
   ```

2. **Usar comando EXTRUDE**
   ```
   Comando: EXTRUDE
   - Seleccionar polilínea cerrada
   - Especificar altura
   ```

3. **Verificar Elevation**
   ```
   Comando: PROPERTIES
   - Elevation: Altura base del objeto (Z)
   ```

### 5.2 Verificación de Geometría

**Checklist:**
- [ ] Todas las polilíneas cerradas
- [ ] Sin gaps en geometría
- [ ] Alturas Z correctas
- [ ] Elementos agrupados apropiadamente

**Herramientas:**
```
Comando: BOUNDARY - Crear polilíneas cerradas
Comando: JOIN - Unir polilíneas
Comando: PEDIT - Editar polilíneas
```

### 5.3 Exportación

**Formatos comunes:**

1. **Para SketchUp**
   ```
   Comando: EXPORT
   - Formato: DWG (compatible con SketchUp)
   - Versión: SketchUp puede importar DWG
   ```

2. **Para Revit**
   ```
   Comando: EXPORT
   - Formato: DWG
   - Configurar capas apropiadamente
   ```

3. **Para Visualización 3D**
   ```
   Comando: 3DEXPORT
   - Formato: FBX o OBJ
   ```

**Entregable:** Archivos preparados para 3D

## Buenas Prácticas Generales

### Organización de Archivos

```
Convención de nombres:
ciudad_AAAAMMDD_v##_descripcion.dwg

Ejemplo:
ciudad_20240115_v01_base.dwg
ciudad_20240122_v02_vialidades.dwg
ciudad_20240315_v10_final.dwg
```

### Respaldos

- Guardar versiones regularmente
- Usar control de versiones si es posible
- Backup automático de AutoCAD configurado

### Trabajo Colaborativo

- Usar XREF para separar trabajo por módulos
- Coordinar nomenclatura de capas
- Reuniones de sincronización regulares
- Documentar cambios importantes

### Performance

- Usar PURGE regularmente
- Eliminar geometría innecesaria
- Limitar uso de bloques complejos
- Considerar referencias externas para elementos pesados

## Troubleshooting

### Problemas Comunes

**Archivo muy pesado:**
- Ejecutar PURGE -All
- Ejecutar OVERKILL
- Eliminar referencias no utilizadas
- Simplificar geometría compleja

**Elementos desplazados:**
- Verificar UCS (User Coordinate System)
- Revisar punto base del dibujo
- Comando: BASE (establecer punto base)

**Escalas incorrectas:**
- Verificar unidades de dibujo
- Revisar escala de bloques insertados
- Usar SCALE para corregir

**Capas desorganizadas:**
- Usar Layer Translator
- Reorganizar con filtros
- Documentar estructura

## Conclusión

Este flujo modular permite:
- Desarrollo organizado por etapas
- Validación continua
- Facilita trabajo en equipo
- Permite ajustes sin rehacer todo
- Base sólida para expansión futura

Para más información, consultar:
- [CAPAS_AUTOCAD.md](CAPAS_AUTOCAD.md)
- [IMPORTACION_PLANOS.md](IMPORTACION_PLANOS.md)
- [EXPORTACION_3D.md](EXPORTACION_3D.md)
- [CHECKLIST_VALIDACION.md](../validacion/CHECKLIST_VALIDACION.md)
