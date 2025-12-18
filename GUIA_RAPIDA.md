# Guía Rápida de Referencia

## Comandos Esenciales de AutoCAD

### Navegación y Visualización
```
ZOOM          - Acercar/Alejar vista
  Z > E       - Zoom Extents (ver todo)
  Z > W       - Zoom Window (área específica)
  Z > P       - Zoom Previous (vista anterior)
  
PAN (P)       - Mover vista (o rueda del mouse)
REGEN         - Regenerar display
REDRAW        - Refrescar pantalla
```

### Dibujo Básico
```
LINE (L)      - Dibujar líneas
PLINE (PL)    - Dibujar polilíneas
CIRCLE (C)    - Dibujar círculos
ARC (A)       - Dibujar arcos
RECTANG (REC) - Dibujar rectángulos
POLYGON (POL) - Dibujar polígonos regulares
```

### Modificación
```
MOVE (M)      - Mover objetos
COPY (CO)     - Copiar objetos
ROTATE (RO)   - Rotar objetos
SCALE (SC)    - Escalar objetos
MIRROR (MI)   - Reflejar objetos
OFFSET (O)    - Offset (copiar paralelo)
TRIM (TR)     - Recortar objetos
EXTEND (EX)   - Extender objetos
FILLET (F)    - Redondear esquinas
CHAMFER (CHA) - Biselar esquinas
ARRAY (AR)    - Crear arrays/matrices
STRETCH (S)   - Estirar objetos
```

### Edición Avanzada
```
PEDIT         - Editar polilíneas
  J (Join)    - Unir segmentos
  C (Close)   - Cerrar polilínea
  
EXPLODE (X)   - Descomponer bloques/polilíneas
JOIN (J)      - Unir líneas en polilínea
OVERKILL      - Eliminar duplicados
BOUNDARY (BO) - Crear polilínea de área cerrada
```

### Capas
```
LAYER (LA)    - Administrador de capas
LAYERP        - Propiedades de capa
LAYMCH        - Match layer (copiar capa)
LAYCUR        - Hacer capa actual
LAYOFF        - Apagar capa de objeto
LAYISO        - Aislar capa
LAYON         - Encender todas las capas
```

### Bloques y Referencias
```
BLOCK (B)     - Crear bloque
INSERT (I)    - Insertar bloque
WBLOCK (W)    - Escribir bloque a archivo
XREF (XR)     - Referencias externas
XATTACH       - Adjuntar referencia
EXPLODE (X)   - Explotar bloque
```

### Anotaciones
```
TEXT          - Texto de línea simple
MTEXT (MT)    - Texto multilínea
DTEXT (DT)    - Texto dinámico
DIM           - Menú de dimensiones
DIMLINEAR     - Cota lineal
DIMALIGNED    - Cota alineada
DIMRADIUS     - Cota de radio
DIMDIAMETER   - Cota de diámetro
LEADER        - Línea de referencia
```

### Información y Medición
```
DIST (DI)     - Medir distancia
AREA (AA)     - Medir área
LIST (LI)     - Información de objeto
PROPERTIES    - Paleta de propiedades
ID            - Identificar coordenadas
```

### Selección
```
QSELECT       - Selección rápida (por propiedades)
SELECT        - Seleccionar objetos
SELECTSIMILAR - Seleccionar similares
ALL           - Seleccionar todo
PREVIOUS (P)  - Selección anterior
```

### Utilidades
```
PURGE         - Limpiar archivo
AUDIT         - Auditar/reparar archivo
RECOVER       - Recuperar archivo dañado
SAVEAS        - Guardar como
EXPORT        - Exportar a otros formatos
UNDO (U)      - Deshacer
REDO          - Rehacer
```

### 3D (Para Preparación 3D)
```
EXTRUDE       - Extrudir 2D a 3D
REVOLVE       - Revolucionar perfil
LOFT          - Crear superficie/sólido por secciones
SWEEP         - Barrer perfil por trayectoria
3DORBIT       - Órbita 3D
VSCURRENT     - Estilo visual actual
HIDE          - Ocultar líneas traseras
```

## Atajos de Teclado Importantes

### Teclas de Función
```
F1  - Ayuda
F2  - Expandir línea de comandos
F3  - Toggle Object Snap
F5  - Toggle Isoplane (isométrico)
F6  - Toggle Dynamic UCS
F7  - Toggle Grid
F8  - Toggle Ortho Mode
F9  - Toggle Snap Mode
F10 - Toggle Polar Tracking
F11 - Toggle Object Snap Tracking
F12 - Toggle Dynamic Input
```

### Combinaciones Ctrl
```
Ctrl+N - Nuevo dibujo
Ctrl+O - Abrir archivo
Ctrl+S - Guardar
Ctrl+P - Imprimir/Plot
Ctrl+Z - Deshacer
Ctrl+Y - Rehacer
Ctrl+C - Copiar al clipboard
Ctrl+V - Pegar desde clipboard
Ctrl+X - Cortar
Ctrl+A - Seleccionar todo
Ctrl+L - Layer Properties Manager
Ctrl+Shift+S - Guardar como
```

### Entrada de Comandos
```
ESC        - Cancelar comando
ENTER      - Repetir último comando
SPACEBAR   - Repetir último comando o Enter
@          - Última coordenada
#          - Usar valor directo (override)
'          - Comando transparente
```

## Referencias Rápidas del Proyecto

### Escala 1:75
```
Relación: 1 unidad en dibujo = 75 unidades reales
En model space: Dibujar a tamaño REAL
En viewport: Configurar a 1:75xp

Tamaños de texto:
Deseado en papel (mm) × 75 = Altura en modelo
Ejemplo: 2.5mm × 75 = 187.5 unidades
```

### Alturas Típicas (Para 3D)
```
Vivienda 1 piso:     3.0m
Vivienda 2 pisos:    6.0m
Vivienda 3 pisos:    9.0m
Edificio 5 pisos:    15.0m
Edificio 8 pisos:    24.0m

Comercio (1 piso):   4.0m
Oficinas (por piso): 3.0-3.5m
Hospital (por piso): 4.0m
```

### Anchos de Vialidades
```
Vía primaria:        12-20m
Vía secundaria:      8-12m
Vía local:           6-8m
Ciclovía:            2-3m
Banqueta/Acera:      1.5-4m
```

### Ratios de Equipamiento
```
SALUD:
Hospital:       1 cada 50,000 hab, área: 10,000m²+
Centro salud:   1 cada 10,000 hab, área: 500-1,500m²
Clínica:        1 cada 2,500 hab, área: 200-500m²

EDUCACIÓN:
Preescolar:     1 cada 1,000 hab, área: 1,000-2,000m²
Primaria:       1 cada 2,500 hab, área: 3,000-8,000m²
Secundaria:     1 cada 7,500 hab, área: 8,000-15,000m²

ÁREAS VERDES:
Ratio mínimo:   9-16 m²/habitante
Acceso:         Max 800m (10 min caminando)
```

### Colores por Capa (Estándar Proyecto)
```
1 (Rojo)         - Vialidades principales, Clínicas
2 (Amarillo)     - Vialidades secundarias, Energía
3 (Verde)        - Ciclovías, Parques, Jardines
4 (Cyan)         - Vivienda, Bibliotecas
5 (Azul)         - Agua, Escuelas
6 (Magenta)      - Comercial
8 (Gris)         - Industrial, Referencia
10 (Rojo brill.) - Hospitales
```

## Workflow Modular Resumido

### Fase 1: Preparación
```
1. Crear archivo desde plantilla
2. Importar planos base
3. Configurar capas
```

### Fase 2: Desarrollo por Módulos
```
Semana 1: Vialidades
Semana 2: Edificaciones
Semana 3: Servicios
Semana 4: Salud y Educación
Semana 5: Áreas Verdes
```

### Fase 3: Integración
```
1. Consolidar módulos
2. Verificar compatibilidad
3. Agregar anotaciones
```

### Fase 4: Validación
```
1. Checklist de validación
2. Documentación técnica
3. Crear layouts de presentación
```

### Fase 5: Preparación 3D (Opcional)
```
1. Asignar alturas
2. Verificar geometría
3. Exportar
```

## Solución Rápida de Problemas Comunes

### No veo lo que dibujo
```
1. ZOOM Extents
2. Verificar que esté en capa visible
3. REGEN
```

### Líneas muy gruesas/delgadas
```
1. Verificar LINEWEIGHT (LWT) activado/desactivado
2. Revisar grosor de capa en Layer Properties
3. Verificar Plot Style Table
```

### Texto muy grande/pequeño
```
1. Verificar altura de texto
2. Para escala 1:75: Altura = Deseado × 75
3. Usar SCALETEXT para corregir múltiples
```

### Objeto no se puede seleccionar
```
1. Capa está LOCKED - desbloquear
2. Objeto en capa apagada - encender
3. Objeto es XREF - no editable directamente
```

### Archivo muy lento
```
1. PURGE -All
2. AUDIT
3. OVERKILL (eliminar duplicados)
4. REGEN
```

### Coordenadas muy grandes
```
1. Verificar UCS
2. MOVE objetos cerca del origen 0,0
3. Verificar unidades correctas
```

## Checklist Rápido Pre-Entrega

```
□ AUDIT ejecutado sin errores
□ PURGE aplicado
□ Todas las capas con elementos
□ Textos legibles a escala
□ Escala verificada (medir distancia conocida)
□ Norte indicado
□ Escala gráfica incluida
□ Cajetín completo
□ Layouts configurados
□ Archivo guardado con nombre correcto
□ Backup realizado
```

## Recursos y Documentación

### Documentación del Proyecto
```
README.md                      - Visión general
docs/CAPAS_AUTOCAD.md         - Organización de capas detallada
docs/FLUJO_MODULAR.md         - Workflow completo paso a paso
docs/IMPORTACION_PLANOS.md    - Guía de importación
docs/EXPORTACION_3D.md        - Preparación para 3D
validacion/CHECKLIST_VALIDACION.md - Lista de verificación completa
templates/GUIA_PLANTILLA.md   - Crear plantilla base
```

### Enlaces Útiles (Externos - Consultar si accesible)
```
AutoCAD Documentation:
- Autodesk Knowledge Network
- AutoCAD Command Reference
- AutoCAD Tips & Tricks

Normativa Urbana:
- Reglamento de construcción local
- Normas de diseño urbano
- Estándares de accesibilidad
```

## Tips Profesionales

### Productividad
```
1. Aprende atajos de teclado - son más rápidos que menús
2. Usa QSELECT para selecciones complejas
3. Crea bloques para elementos repetitivos
4. Usa XREF para archivos grandes colaborativos
5. Guarda frecuentemente (Ctrl+S)
6. Mantén capas organizadas desde el inicio
```

### Calidad
```
1. Dibuja con precisión - usa Object Snap (F3)
2. Usa coordenadas y medidas exactas
3. Verifica dimensiones con DIST
4. Mantén geometría limpia - sin gaps u overlaps
5. Usa AUDIT y PURGE regularmente
```

### Colaboración
```
1. Sigue nomenclatura estándar de capas
2. Documenta cambios importantes
3. Usa Layer States para diferentes vistas
4. Comunica convenciones al equipo
5. Respeta estructura establecida
```

## Contacto y Soporte

Para preguntas sobre el proyecto:
- Consultar documentación en /docs/
- Revisar checklist en /validacion/
- Consultar con asesor académico

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0
