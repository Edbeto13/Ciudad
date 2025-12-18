# Guía de Contribución

## Bienvenido

Gracias por tu interés en contribuir al proyecto **Ciudad**. Esta guía te ayudará a entender cómo colaborar efectivamente.

## Requisitos Previos

### Software Necesario
- AutoCAD 2018 o superior (recomendado: última versión)
- Conocimientos básicos de diseño urbano
- Familiaridad con Git (para colaboración)

### Documentación a Revisar
Antes de contribuir, lee:
1. [README.md](README.md) - Visión general del proyecto
2. [CAPAS_AUTOCAD.md](docs/CAPAS_AUTOCAD.md) - Estándares de capas
3. [FLUJO_MODULAR.md](docs/FLUJO_MODULAR.md) - Workflow del proyecto

## Cómo Contribuir

### 1. Reportar Problemas (Issues)

Si encuentras errores o tienes sugerencias:

1. Verifica que el issue no exista ya
2. Crea un nuevo issue con:
   - Título descriptivo
   - Descripción clara del problema/sugerencia
   - Pasos para reproducir (si es un bug)
   - Capturas de pantalla (si aplica)
   - Versión de AutoCAD utilizada

**Ejemplo de Issue:**
```
Título: Grosor incorrecto en capa VIALIDADES-SECUNDARIAS
Descripción: La capa VIALIDADES-SECUNDARIAS muestra grosor de 0.5mm 
en lugar de 0.3mm especificado en CAPAS_AUTOCAD.md.
Versión: AutoCAD 2024
Archivo: ciudad_modulo1_vialidades.dwg
```

### 2. Proponer Mejoras

Para proponer nuevas características:

1. Abre un issue con etiqueta "enhancement"
2. Explica:
   - Qué característica propones
   - Por qué sería útil
   - Cómo se implementaría (si tienes ideas)
3. Espera feedback antes de implementar

### 3. Contribuir Código/Diseño

#### Workflow de Contribución

1. **Fork del repositorio**
   ```bash
   # En GitHub, click en "Fork"
   ```

2. **Clonar tu fork**
   ```bash
   git clone https://github.com/TU_USUARIO/Ciudad.git
   cd Ciudad
   ```

3. **Crear rama de trabajo**
   ```bash
   git checkout -b feature/nombre-descriptivo
   # O para fixes:
   git checkout -b fix/descripcion-bug
   ```

4. **Hacer cambios**
   - Seguir estándares del proyecto
   - Trabajar en módulos específicos
   - Mantener commits organizados

5. **Commit de cambios**
   ```bash
   git add .
   git commit -m "Descripción clara del cambio"
   ```

6. **Push a tu fork**
   ```bash
   git push origin feature/nombre-descriptivo
   ```

7. **Crear Pull Request**
   - Describe los cambios claramente
   - Referencia issues relacionados
   - Incluye capturas de pantalla si es visual

## Estándares de Contribución

### Nomenclatura de Archivos

```
Correcto:
- ciudad_modulo1_vialidades.dwg
- ciudad_20240115_v02_completo.dwg
- referencia_catastro_2024.dwg

Incorrecto:
- dibujo1.dwg
- nuevo.dwg
- sin_titulo.dwg
```

### Nomenclatura de Capas

**SIEMPRE usar la convención establecida:**

```
Correcto:
- VIALIDADES-PRINCIPALES
- EDIFICACIONES-VIVIENDA
- SERVICIOS-AGUA

Incorrecto:
- vialidades
- Edificios_vivienda
- capa_agua_potable
```

### Nomenclatura de Commits

**Formato:**
```
tipo: descripción breve

Descripción detallada (opcional)
```

**Tipos:**
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código/diseño
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat: agregar ciclovías en módulo vialidades"
git commit -m "fix: corregir grosor de línea en capa SERVICIOS-AGUA"
git commit -m "docs: actualizar checklist de validación"
```

### Estándares de Diseño

#### Capas
- **Siempre** usar capas definidas en [CAPAS_AUTOCAD.md](docs/CAPAS_AUTOCAD.md)
- No crear capas nuevas sin consenso
- Respetar colores y grosores establecidos

#### Geometría
- Dibujar con precisión (usar Object Snap)
- Cerrar polilíneas donde sea necesario
- Evitar geometría duplicada
- Mantener elementos en capas correctas

#### Bloques
- Nombrar bloques descriptivamente
- Usar punto base lógico (0,0 o centro)
- Documentar bloques nuevos

#### Texto y Anotaciones
- Usar estilos de texto establecidos
- Altura de texto apropiada para escala 1:75
- Ortografía correcta
- Ubicación lógica y legible

## Proceso de Revisión

### Criterios de Aceptación

Un Pull Request será aceptado si:

1. **Funcionalidad**
   - Cumple el objetivo propuesto
   - No rompe funcionalidad existente
   - Sigue el flujo modular

2. **Calidad**
   - Código/diseño limpio y organizado
   - Geometría precisa sin errores
   - Archivo pasa AUDIT sin errores

3. **Estándares**
   - Sigue convenciones de nomenclatura
   - Usa capas correctamente
   - Documentación actualizada si necesario

4. **Documentación**
   - Cambios significativos están documentados
   - README actualizado si aplica
   - Comentarios claros en código/scripts

### Proceso de Revisión

1. **Revisión Automática**
   - Verificación de nomenclatura
   - Comprobación de estructura

2. **Revisión Manual**
   - Un miembro del equipo revisará el PR
   - Puede solicitar cambios
   - Discusión constructiva

3. **Aprobación**
   - Una vez aprobado, se hace merge
   - Tu contribución será parte del proyecto

## Buenas Prácticas

### Antes de Contribuir

- [ ] Leer documentación relevante
- [ ] Entender estándares del proyecto
- [ ] Verificar que nadie más esté trabajando en lo mismo
- [ ] Actualizar tu fork con últimos cambios

### Durante Desarrollo

- [ ] Trabajar en rama separada (no en main)
- [ ] Hacer commits frecuentes y descriptivos
- [ ] Mantener comunicación si es colaborativo
- [ ] Respaldar trabajo regularmente

### Antes de Pull Request

- [ ] Ejecutar AUDIT en archivos DWG
- [ ] Ejecutar PURGE para limpiar
- [ ] Verificar que todo esté en capas correctas
- [ ] Probar que el archivo abre correctamente
- [ ] Revisar que no hay conflictos con main

## Áreas de Contribución

### Prioritarias

1. **Desarrollo de Módulos**
   - Vialidades
   - Edificaciones
   - Servicios
   - Equipamiento
   - Áreas Verdes

2. **Documentación**
   - Tutoriales adicionales
   - Ejemplos prácticos
   - Mejoras a guías existentes

3. **Templates y Bloques**
   - Bloques de equipamiento urbano
   - Bloques de vegetación
   - Símbolos estándar
   - Cajetines personalizados

4. **Scripts y Automatización**
   - Scripts LISP útiles
   - Rutinas de automatización
   - Herramientas de validación

### Secundarias

- Traducciones (si aplica)
- Mejoras visuales
- Optimizaciones de rendimiento
- Tests y validaciones

## Código de Conducta

### Nuestros Valores

- **Respeto:** Trata a todos con respeto y consideración
- **Colaboración:** Trabajamos juntos hacia objetivos comunes
- **Profesionalismo:** Mantenemos estándares profesionales
- **Apertura:** Abiertos a nuevas ideas y feedback constructivo
- **Calidad:** Comprometidos con trabajo de alta calidad

### Comportamiento Esperado

✅ **Sí:**
- Ser respetuoso y constructivo
- Dar crédito apropiado
- Aceptar críticas constructivas
- Enfocarse en lo mejor para el proyecto
- Ayudar a otros colaboradores

❌ **No:**
- Lenguaje ofensivo o discriminatorio
- Ataques personales
- Spam o promoción no relacionada
- Compartir información privada de otros
- Conducta no profesional

### Reporte de Conducta Inapropiada

Si experimentas o presencias comportamiento inapropiado:
1. Documenta el incidente
2. Contacta a los mantenedores del proyecto
3. La confidencialidad será respetada

## Recursos para Colaboradores

### Herramientas Útiles

- **AutoCAD:** Software principal
- **Git:** Control de versiones
- **GitHub Desktop:** Cliente Git visual (opcional)
- **Visual Studio Code:** Editor para documentación

### Aprendizaje

- [AutoCAD Documentation](https://knowledge.autodesk.com/support/autocad)
- [Git Tutorial](https://git-scm.com/docs/gittutorial)
- [Markdown Guide](https://www.markdownguide.org/)

### Documentación del Proyecto

- [README.md](README.md)
- [CAPAS_AUTOCAD.md](docs/CAPAS_AUTOCAD.md)
- [FLUJO_MODULAR.md](docs/FLUJO_MODULAR.md)
- [IMPORTACION_PLANOS.md](docs/IMPORTACION_PLANOS.md)
- [EXPORTACION_3D.md](docs/EXPORTACION_3D.md)
- [CHECKLIST_VALIDACION.md](validacion/CHECKLIST_VALIDACION.md)
- [GUIA_RAPIDA.md](GUIA_RAPIDA.md)

## Contacto

### Mantenedores del Proyecto

- Principal: [Información de contacto]
- Equipo: [Lista de colaboradores principales]

### Canales de Comunicación

- **Issues:** Para bugs y sugerencias
- **Pull Requests:** Para contribuciones de código/diseño
- **Discussions:** Para preguntas generales (si está habilitado)

## Reconocimientos

Todos los contribuidores serán reconocidos en:
- README.md (sección de Contributors)
- Release notes
- Créditos del proyecto

## Licencia

Al contribuir, aceptas que tu contribución será licenciada bajo la misma licencia del proyecto.

---

## Preguntas Frecuentes

### ¿Necesito experiencia previa en Git?

No es obligatorio, pero es útil. Hay muchos tutoriales disponibles, y puedes empezar con GitHub Desktop que es más visual.

### ¿Puedo contribuir sin saber AutoCAD avanzado?

Sí. Puedes contribuir con:
- Documentación
- Revisión de estándares
- Reportar problemas
- Sugerencias de mejoras

### ¿Cómo sé en qué trabajar?

- Revisa los Issues abiertos
- Busca etiquetas como "good first issue" o "help wanted"
- Propón tu propia idea

### ¿Cuánto tiempo toma revisar un PR?

Generalmente 2-5 días. Si es urgente, menciónalo en el PR.

### ¿Qué hago si mi PR es rechazado?

- Lee el feedback cuidadosamente
- Pregunta si algo no está claro
- Haz los cambios sugeridos
- Reenvía para nueva revisión

---

**¡Gracias por contribuir a Ciudad!**

Tu aporte ayuda a crear mejores herramientas de diseño urbano para todos.
