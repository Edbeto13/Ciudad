
    // ============================================================
    // CONFIGURACI├ôN Y CONSTANTES
    // ============================================================
    const CONFIG = {
        VERSION: 2,                    // Versi├│n actual del formato de proyecto
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB m├íximo para archivos
        AUTOSAVE_INTERVAL: 5 * 60 * 1000, // 5 minutos
        HEX_SIZE: 1,                   // Tama├▒o del hex├ígono
        DEBUG: false                   // Modo debug
    };

    // Colores por tipo de m├│dulo
    const MODULE_COLORS = {
        building: 0x4a90d9,
        house: 0x8bc34a,
        road: 0x607d8b,
        park: 0x4caf50,
        water: 0x03a9f4,
        commercial: 0xff9800
    };

    // Alturas por tipo de m├│dulo
    const MODULE_HEIGHTS = {
        building: 5,
        house: 2,
        road: 0.1,
        park: 0.3,
        water: 0.1,
        commercial: 3
    };

    // ============================================================
    // ESTADO GLOBAL
    // ============================================================
    let scene, camera, renderer, controls;
    let modules = [];                  // Array de m├│dulos en la escena
    let selectedModule = null;         // M├│dulo actualmente seleccionado
    let gridHelper = null;             // Helper de la grilla
    let raycaster, mouse;              // Para selecci├│n con mouse
    let instancedMeshes = {};          // Meshes instanciados por tipo
    let pendingFileData = null;        // Datos del archivo pendiente de cargar
    let autosaveTimer = null;          // Timer de autosave
    let frameCount = 0;                // Contador de frames para FPS
    let lastFpsUpdate = 0;             // ├Ültimo update de FPS
    let nextModuleId = 1;              // ID ├║nico para m├│dulos
    let isDragging = false;            // Si estamos arrastrando un m├│dulo
    let dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Plano para arrastrar
    let dragOffset = new THREE.Vector3(); // Offset del arrastre
    let originalPosition = { q: 0, r: 0 }; // Posici├│n original antes de mover

    // ============================================================
    // UNDO/REDO STACK (Prompt 4)
    // ============================================================
    const ActionStack = {
        undoStack: [],
        redoStack: [],
        maxSize: 50,

        // Registra una nueva acci├│n
        push(action) {
            this.undoStack.push(action);
            this.redoStack = []; // Limpiar redo al hacer nueva acci├│n
            if (this.undoStack.length > this.maxSize) {
                this.undoStack.shift();
            }
            debugLog('Action pushed:', action.type);
        },

        // Deshace la ├║ltima acci├│n
        undo() {
            if (this.undoStack.length === 0) {
                showToast('Nada que deshacer', 'info');
                return false;
            }
            const action = this.undoStack.pop();
            this.redoStack.push(action);
            this.executeUndo(action);
            showToast('Deshacer: ' + action.type, 'info');
            return true;
        },

        // Rehace la ├║ltima acci├│n deshecha
        redo() {
            if (this.redoStack.length === 0) {
                showToast('Nada que rehacer', 'info');
                return false;
            }
            const action = this.redoStack.pop();
            this.undoStack.push(action);
            this.executeRedo(action);
            showToast('Rehacer: ' + action.type, 'info');
            return true;
        },

        // Ejecuta el undo de una acci├│n
        executeUndo(action) {
            switch (action.type) {
                case 'CREATE':
                    removeModuleById(action.moduleId);
                    break;
                case 'DELETE':
                    restoreModule(action.moduleData);
                    break;
                case 'MOVE':
                    moveModuleToPosition(action.moduleId, action.oldQ, action.oldR);
                    break;
                case 'ROTATE':
                    setModuleRotation(action.moduleId, action.oldRotation);
                    break;
                case 'DUPLICATE':
                    removeModuleById(action.newModuleId);
                    break;
            }
            updateModuleCount();
        },

        // Ejecuta el redo de una acci├│n
        executeRedo(action) {
            switch (action.type) {
                case 'CREATE':
                    restoreModule(action.moduleData);
                    break;
                case 'DELETE':
                    removeModuleById(action.moduleId);
                    break;
                case 'MOVE':
                    moveModuleToPosition(action.moduleId, action.newQ, action.newR);
                    break;
                case 'ROTATE':
                    setModuleRotation(action.moduleId, action.newRotation);
                    break;
                case 'DUPLICATE':
                    restoreModule(action.newModuleData);
                    break;
            }
            updateModuleCount();
        },

        // Limpia el historial
        clear() {
            this.undoStack = [];
            this.redoStack = [];
        }
    };

    // ============================================================
    // UTILIDADES
    // ============================================================

    // Log de debug
    function debugLog(...args) {
        if (CONFIG.DEBUG) {
            console.log('[DEBUG]', ...args);
        }
    }

    // Muestra un toast de notificaci├│n
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = sanitizeText(message);
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Sanitiza texto para evitar XSS
    function sanitizeText(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Abre un modal
    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    // Cierra un modal
    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Muestra modal de error
    function showError(message) {
        document.getElementById('errorMessage').textContent = sanitizeText(message);
        openModal('errorModal');
        console.error('[ERROR]', message);
    }

    // Muestra modal de progreso
    function showProgress(title, message, percent = 0) {
        document.getElementById('progressTitle').textContent = sanitizeText(title);
        document.getElementById('progressMessage').textContent = sanitizeText(message);
        document.getElementById('progressBar').style.width = percent + '%';
        openModal('progressModal');
    }

    // Oculta modal de progreso
    function hideProgress() {
        closeModal('progressModal');
    }

    // ============================================================
    // CONVERSI├ôN DE COORDENADAS HEXAGONALES (Prompt 5)
    // ============================================================

    // Convierte coordenadas hexagonales (q, r) a mundo (x, z)
    function hexToWorld(q, r) {
        const size = CONFIG.HEX_SIZE;
        const x = size * (3/2 * q);
        const z = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
        return { x, z };
    }

    // Convierte coordenadas mundo (x, z) a hexagonales (q, r)
    function worldToHex(x, z) {
        const size = CONFIG.HEX_SIZE;
        const q = (2/3 * x) / size;
        const r = (-1/3 * x + Math.sqrt(3)/3 * z) / size;
        return { q: Math.round(q), r: Math.round(r) };
    }

    // ============================================================
    // INICIALIZACI├ôN DE THREE.JS
    // ============================================================
    function getRenderSize() {
        const container = document.getElementById('container');
        if (!container) {
            return { width: window.innerWidth, height: window.innerHeight };
        }
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        return { width, height };
    }

    function setPointerFromEvent(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        mouse.set(x, y);
    }

    function init() {
        // Crear escena
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        const { width, height } = getRenderSize();

        // Crear c├ímara
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(15, 20, 15);

        // Crear renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('container').appendChild(renderer.domElement);
        renderer.domElement.style.touchAction = 'none';

        // Controles de ├│rbita
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Raycaster para selecci├│n
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        scene.add(directionalLight);

        // Crear grilla
        updateGrid();

        // Event listeners
        window.addEventListener('resize', onWindowResize);
        if (window.PointerEvent) {
            renderer.domElement.addEventListener('pointerdown', onMouseDown);
            renderer.domElement.addEventListener('pointermove', onMouseMove);
            renderer.domElement.addEventListener('pointerup', onMouseUp);
            renderer.domElement.addEventListener('pointercancel', onMouseUp);
        } else {
            renderer.domElement.addEventListener('mousedown', onMouseDown);
            renderer.domElement.addEventListener('mousemove', onMouseMove);
            renderer.domElement.addEventListener('mouseup', onMouseUp);
        }
        renderer.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
        document.addEventListener('keydown', onKeyDown);

        // Iniciar loop de renderizado
        animate();

        // Cargar autosave si existe
        loadAutosave();

        debugLog('Inicializaci├│n completada');
    }

    // Actualiza la grilla
    function updateGrid() {
        if (gridHelper) scene.remove(gridHelper);
        const size = parseInt(document.getElementById('gridSize').value) || 20;
        gridHelper = new THREE.GridHelper(size, size, 0x444444, 0x333333);
        scene.add(gridHelper);
    }

    // Maneja el redimensionamiento de ventana
    function onWindowResize() {
        const { width, height } = getRenderSize();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // ============================================================
    // GESTI├ôN DE M├ôDULOS
    // ============================================================

    // Crea geometr├¡a octagonal (8 lados)
    function createOctagonGeometry(radius, height) {
        const shape = new THREE.Shape();
        const sides = 8;
        
        // Crear el perfil octagonal en el plano XZ
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }
        shape.closePath();
        
        // Extruir para crear el volumen
        const extrudeSettings = {
            steps: 1,
            depth: height,
            bevelEnabled: false
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Rotar la geometr├¡a para que est├® vertical (eje Y)
        geometry.rotateX(Math.PI / 2);
        geometry.translate(0, 0, 0);
        
        return geometry;
    }

    // Crea un nuevo m├│dulo
    function createModule(type, q, r, rotation = 0, id = null, metadata = {}) {
        const moduleId = id || nextModuleId++;
        const worldPos = hexToWorld(q, r);
        const height = MODULE_HEIGHTS[type] || 1;
        const color = MODULE_COLORS[type] || 0xffffff;

        // Crear geometr├¡a seg├║n tipo
        let geometry;
        if (type === 'road' || type === 'water' || type === 'park') {
            // Para pisos/caminos, usar geometr├¡a m├ís plana
            geometry = new THREE.BoxGeometry(CONFIG.HEX_SIZE * 1.5, height, CONFIG.HEX_SIZE * 1.5);
        } else {
            // Para edificios y casas, usar oct├ígonos
            const radius = CONFIG.HEX_SIZE * 0.55; // Radio del oct├ígono
            geometry = createOctagonGeometry(radius, height);
        }

        const material = new THREE.MeshLambertMaterial({ 
            color: color,
            emissive: 0x000000
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(worldPos.x, height / 2, worldPos.z);
        mesh.rotation.y = rotation * Math.PI / 180;

        // Guardar datos del m├│dulo
        mesh.userData = {
            id: moduleId,
            type: type,
            q: q,
            r: r,
            rotation: rotation,
            metadata: metadata
        };

        scene.add(mesh);
        modules.push(mesh);

        if (moduleId >= nextModuleId) {
            nextModuleId = moduleId + 1;
        }

        updateModuleCount();
        return mesh;
    }

    // A├▒ade un m├│dulo en posici├│n aleatoria
    function addModule() {
        const type = document.getElementById('moduleType').value;
        const gridSize = parseInt(document.getElementById('gridSize').value) || 20;
        const q = Math.floor(Math.random() * gridSize) - gridSize / 2;
        const r = Math.floor(Math.random() * gridSize) - gridSize / 2;
        
        const mesh = createModule(type, q, r);
        
        // Registrar acci├│n para undo
        ActionStack.push({
            type: 'CREATE',
            moduleId: mesh.userData.id,
            moduleData: serializeModule(mesh)
        });

        showToast('M├│dulo a├▒adido', 'success');
    }

    // Elimina un m├│dulo por ID
    function removeModuleById(id) {
        const index = modules.findIndex(m => m.userData.id === id);
        if (index !== -1) {
            const mesh = modules[index];
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            modules.splice(index, 1);
            if (selectedModule === mesh) {
                selectedModule = null;
                updateSelectedInfo();
            }
        }
    }

    // Restaura un m├│dulo desde datos serializados
    function restoreModule(data) {
        createModule(data.type, data.q, data.r, data.rotation, data.id, data.metadata || {});
    }

    // Mueve un m├│dulo a nueva posici├│n
    function moveModuleToPosition(id, q, r) {
        const mesh = modules.find(m => m.userData.id === id);
        if (mesh) {
            const worldPos = hexToWorld(q, r);
            mesh.position.x = worldPos.x;
            mesh.position.z = worldPos.z;
            mesh.userData.q = q;
            mesh.userData.r = r;
        }
    }

    // Establece la rotaci├│n de un m├│dulo
    function setModuleRotation(id, rotation) {
        const mesh = modules.find(m => m.userData.id === id);
        if (mesh) {
            mesh.rotation.y = rotation * Math.PI / 180;
            mesh.userData.rotation = rotation;
        }
    }

    // Elimina el m├│dulo seleccionado
    function deleteSelected() {
        if (!selectedModule) {
            showToast('Ning├║n m├│dulo seleccionado', 'warning');
            return;
        }

        ActionStack.push({
            type: 'DELETE',
            moduleId: selectedModule.userData.id,
            moduleData: serializeModule(selectedModule)
        });

        removeModuleById(selectedModule.userData.id);
        selectedModule = null;
        updateSelectedInfo();
        showToast('M├│dulo eliminado', 'success');
    }

    // Duplica el m├│dulo seleccionado
    function duplicateSelected() {
        if (!selectedModule) {
            showToast('Ning├║n m├│dulo seleccionado', 'warning');
            return;
        }

        const data = selectedModule.userData;
        const newMesh = createModule(data.type, data.q + 1, data.r + 1, data.rotation, null, {...data.metadata});

        ActionStack.push({
            type: 'DUPLICATE',
            originalId: data.id,
            newModuleId: newMesh.userData.id,
            newModuleData: serializeModule(newMesh)
        });

        showToast('M├│dulo duplicado', 'success');
    }

    // Rota el m├│dulo seleccionado 90┬░
    function rotateSelected() {
        if (!selectedModule) {
            showToast('Ning├║n m├│dulo seleccionado', 'warning');
            return;
        }

        const oldRotation = selectedModule.userData.rotation;
        const newRotation = (oldRotation + 90) % 360;

        ActionStack.push({
            type: 'ROTATE',
            moduleId: selectedModule.userData.id,
            oldRotation: oldRotation,
            newRotation: newRotation
        });

        setModuleRotation(selectedModule.userData.id, newRotation);
        showToast('M├│dulo rotado', 'success');
    }

    // Serializa un m├│dulo para guardado
    function serializeModule(mesh) {
        const data = mesh.userData;
        return {
            id: data.id,
            type: data.type,
            q: data.q,
            r: data.r,
            rotation: data.rotation,
            metadata: data.metadata || {}
        };
    }

    // Actualiza el contador de m├│dulos
    function updateModuleCount() {
        document.getElementById('moduleCount').textContent = 'M├│dulos: ' + modules.length;
    }

    // Actualiza info de selecci├│n
    function updateSelectedInfo() {
        const el = document.getElementById('selectedInfo');
        if (selectedModule) {
            const data = selectedModule.userData;
            el.textContent = `Selecci├│n: ${data.type} (${data.q}, ${data.r})`;
        } else {
            el.textContent = 'Selecci├│n: ninguna';
        }
    }

    // ============================================================
    // SELECCI├ôN Y MANIPULACI├ôN CON MOUSE
    // ============================================================
    function onMouseDown(event) {
        event.preventDefault();

        setPointerFromEvent(event);

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(modules);

        if (intersects.length > 0) {
            // Seleccionar m├│dulo
            if (selectedModule && selectedModule !== intersects[0].object) {
                selectedModule.material.emissive.setHex(0x000000);
            }
            
            selectedModule = intersects[0].object;
            selectedModule.material.emissive.setHex(0x444444);
            
            // Preparar para arrastrar
            controls.enabled = false;
            isDragging = true;
            
            // Guardar posici├│n original para undo
            originalPosition.q = selectedModule.userData.q;
            originalPosition.r = selectedModule.userData.r;
            
            // Configurar plano de arrastre
            dragPlane.setFromNormalAndCoplanarPoint(
                camera.getWorldDirection(dragPlane.normal),
                intersects[0].point
            );
            
            updateSelectedInfo();
        } else {
            // Deseleccionar si hacemos click en el vac├¡o
            if (selectedModule) {
                selectedModule.material.emissive.setHex(0x000000);
                selectedModule = null;
                updateSelectedInfo();
            }
        }
    }
    
    function onMouseMove(event) {
        if (!isDragging || !selectedModule) return;
        
        event.preventDefault();

        setPointerFromEvent(event);
        
        raycaster.setFromCamera(mouse, camera);
        
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, intersectPoint);
        
        if (intersectPoint) {
            // Actualizar posici├│n del m├│dulo
            selectedModule.position.x = intersectPoint.x;
            selectedModule.position.z = intersectPoint.z;
            
            // Convertir a coordenadas hexagonales (snap a grilla)
            const hexCoords = worldToHex(intersectPoint.x, intersectPoint.z);
            const snappedPos = hexToWorld(hexCoords.q, hexCoords.r);
            
            selectedModule.position.x = snappedPos.x;
            selectedModule.position.z = snappedPos.z;
            
            selectedModule.userData.q = hexCoords.q;
            selectedModule.userData.r = hexCoords.r;
            
            updateSelectedInfo();
        }
    }
    
    function onMouseUp(event) {
        if (isDragging && selectedModule) {
            // Registrar movimiento en el historial de undo
            if (originalPosition.q !== selectedModule.userData.q || 
                originalPosition.r !== selectedModule.userData.r) {
                ActionStack.push({
                    type: 'MOVE',
                    moduleId: selectedModule.userData.id,
                    oldQ: originalPosition.q,
                    oldR: originalPosition.r,
                    newQ: selectedModule.userData.q,
                    newR: selectedModule.userData.r
                });
                showToast('M├│dulo movido', 'info');
            }
        }
        
        isDragging = false;
        controls.enabled = true;
    }
    
    function onMouseWheel(event) {
        if (!selectedModule) return;
        
        event.preventDefault();
        
        // Rotar el m├│dulo seleccionado con la rueda del mouse
        const rotationStep = event.deltaY > 0 ? -45 : 45; // 45 grados por scroll
        const oldRotation = selectedModule.userData.rotation;
        const newRotation = (oldRotation + rotationStep) % 360;
        
        ActionStack.push({
            type: 'ROTATE',
            moduleId: selectedModule.userData.id,
            oldRotation: oldRotation,
            newRotation: newRotation
        });
        
        setModuleRotation(selectedModule.userData.id, newRotation);
        showToast(`Rotado a ${newRotation}┬░`, 'info');
    }

    // ============================================================
    // ATAJOS DE TECLADO (Prompt 4)
    // ============================================================
    function onKeyDown(event) {
        // Ctrl+Z - Deshacer
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();
            undo();
        }
        // Ctrl+Y - Rehacer
        else if (event.ctrlKey && event.key === 'y') {
            event.preventDefault();
            redo();
        }
        // Ctrl+S - Guardar
        else if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            showSaveModal();
        }
        // D - Duplicar
        else if (event.key === 'd' || event.key === 'D') {
            if (!event.ctrlKey) duplicateSelected();
        }
        // R - Rotar
        else if (event.key === 'r' || event.key === 'R') {
            if (!event.ctrlKey) rotateSelected();
        }
        // Delete/Supr - Eliminar
        else if (event.key === 'Delete') {
            deleteSelected();
        }
    }

    // Funciones wrapper para undo/redo
    function undo() { ActionStack.undo(); }
    function redo() { ActionStack.redo(); }

    // ============================================================
    // GUARDADO Y CARGA DE PROYECTO (Prompt 1 & 6)
    // ============================================================

    // Muestra modal de guardado
    function showSaveModal() {
        openModal('saveModal');
    }

    // Valida el esquema del proyecto
    function validateProjectSchema(data) {
        const errors = [];
        
        // Validar campos requeridos
        if (typeof data.gridSize !== 'number' || data.gridSize < 5 || data.gridSize > 100) {
            errors.push('gridSize debe ser un n├║mero entre 5 y 100');
        }
        
        if (!data.camera || typeof data.camera !== 'object') {
            errors.push('camera debe ser un objeto');
        } else {
            if (!data.camera.position || !Array.isArray(data.camera.position) || data.camera.position.length !== 3) {
                errors.push('camera.position debe ser un array de 3 n├║meros');
            }
            if (!data.camera.target || !Array.isArray(data.camera.target) || data.camera.target.length !== 3) {
                errors.push('camera.target debe ser un array de 3 n├║meros');
            }
        }
        
        if (!Array.isArray(data.modules)) {
            errors.push('modules debe ser un array');
        } else {
            data.modules.forEach((mod, i) => {
                if (typeof mod.id !== 'number') errors.push(`modules[${i}].id debe ser un n├║mero`);
                if (typeof mod.type !== 'string') errors.push(`modules[${i}].type debe ser un string`);
                if (typeof mod.q !== 'number') errors.push(`modules[${i}].q debe ser un n├║mero`);
                if (typeof mod.r !== 'number') errors.push(`modules[${i}].r debe ser un n├║mero`);
                if (typeof mod.rotation !== 'number') errors.push(`modules[${i}].rotation debe ser un n├║mero`);
            });
        }
        
        return errors;
    }

    // Migra proyectos de versiones anteriores
    function migrateProject(data) {
        // Si no tiene versi├│n, asumir v1
        if (!data.version) {
            debugLog('Migrando proyecto de v1 a v2');
            data.version = 1;
        }
        
        // Migraci├│n de v1 a v2
        if (data.version === 1) {
            // En v1, los m├│dulos podr├¡an no tener metadata
            if (Array.isArray(data.modules)) {
                data.modules = data.modules.map(mod => ({
                    ...mod,
                    metadata: mod.metadata || {}
                }));
            }
            // A├▒adir camera si no existe
            if (!data.camera) {
                data.camera = {
                    position: [15, 20, 15],
                    target: [0, 0, 0]
                };
            }
            data.version = 2;
        }
        
        return data;
    }

    // Guarda el proyecto actual
    function saveProject() {
        try {
            showProgress('Guardando...', 'Preparando datos...', 10);
            
            const projectName = document.getElementById('projectName').value || 'mi_ciudad';
            
            // Serializar proyecto
            const projectData = {
                version: CONFIG.VERSION,
                name: projectName,
                timestamp: new Date().toISOString(),
                gridSize: parseInt(document.getElementById('gridSize').value) || 20,
                camera: {
                    position: [camera.position.x, camera.position.y, camera.position.z],
                    target: [controls.target.x, controls.target.y, controls.target.z]
                },
                modules: modules.map(serializeModule)
            };

            showProgress('Guardando...', 'Generando JSON...', 50);

            // Generar JSON compacto
            const jsonStr = JSON.stringify(projectData);

            showProgress('Guardando...', 'Descargando archivo...', 80);

            // Descargar archivo
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = sanitizeText(projectName) + '.json';
            a.click();
            URL.revokeObjectURL(url);

            hideProgress();
            closeModal('saveModal');
            showToast('Proyecto guardado correctamente', 'success');
            debugLog('Proyecto guardado:', projectData);

        } catch (error) {
            hideProgress();
            showError('Error al guardar: ' + error.message);
        }
    }

    // Exporta solo geometr├¡a (sin metadata)
    function exportGeometryOnly() {
        try {
            const projectData = {
                version: CONFIG.VERSION,
                gridSize: parseInt(document.getElementById('gridSize').value) || 20,
                camera: {
                    position: [camera.position.x, camera.position.y, camera.position.z],
                    target: [controls.target.x, controls.target.y, controls.target.z]
                },
                modules: modules.map(m => ({
                    id: m.userData.id,
                    type: m.userData.type,
                    q: m.userData.q,
                    r: m.userData.r,
                    rotation: m.userData.rotation
                }))
            };

            const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'geometria.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Geometr├¡a exportada', 'success');
        } catch (error) {
            showError('Error al exportar: ' + error.message);
        }
    }

    // Exporta con metadata completa
    function exportWithMetadata() {
        saveProject();
    }

    // Maneja la selecci├│n de archivo
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tama├▒o (Prompt 8)
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            showError('El archivo es demasiado grande. M├íximo permitido: 5 MB');
            event.target.value = '';
            return;
        }

        // Validar tipo MIME (Prompt 8)
        if (file.type && file.type !== 'application/json' && !file.name.endsWith('.json')) {
            showError('Tipo de archivo no v├ílido. Solo se permiten archivos JSON.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                pendingFileData = data;
                
                // Mostrar confirmaci├│n si hay m├│dulos (Prompt 1)
                if (modules.length > 0) {
                    openModal('loadConfirmModal');
                } else {
                    confirmLoad();
                }
            } catch (error) {
                showError('Error al parsear JSON: ' + error.message);
            }
        };
        reader.onerror = function() {
            showError('Error al leer el archivo');
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    // Confirma la carga del archivo
    function confirmLoad() {
        closeModal('loadConfirmModal');
        if (pendingFileData) {
            loadProject(pendingFileData);
            pendingFileData = null;
        }
    }

    // Carga un proyecto desde datos
    function loadProject(data) {
        try {
            showProgress('Cargando...', 'Validando esquema...', 10);

            // Migrar si es necesario (Prompt 1 & 6)
            data = migrateProject(data);

            // Validar esquema (Prompt 1)
            const errors = validateProjectSchema(data);
            if (errors.length > 0) {
                hideProgress();
                showError('JSON inv├ílido:\n' + errors.join('\n'));
                console.error('[VALIDATION]', errors);
                return;
            }

            showProgress('Cargando...', 'Limpiando escena...', 30);

            // Limpiar escena actual
            modules.forEach(mesh => {
                scene.remove(mesh);
                mesh.geometry.dispose();
                mesh.material.dispose();
            });
            modules = [];
            selectedModule = null;
            ActionStack.clear();

            showProgress('Cargando...', 'Cargando m├│dulos...', 50);

            // Restaurar configuraci├│n
            document.getElementById('gridSize').value = data.gridSize;
            updateGrid();

            // Restaurar c├ímara
            if (data.camera) {
                camera.position.set(...data.camera.position);
                controls.target.set(...data.camera.target);
            }

            // Restaurar m├│dulos
            const totalModules = data.modules.length;
            data.modules.forEach((mod, i) => {
                createModule(mod.type, mod.q, mod.r, mod.rotation, mod.id, mod.metadata || {});
                if (i % 10 === 0) {
                    const percent = 50 + (i / totalModules) * 40;
                    showProgress('Cargando...', `M├│dulo ${i + 1} de ${totalModules}...`, percent);
                }
            });

            // Actualizar nextModuleId
            if (data.modules.length > 0) {
                nextModuleId = Math.max(...data.modules.map(m => m.id)) + 1;
            }

            hideProgress();
            updateModuleCount();
            updateSelectedInfo();
            showToast('Proyecto cargado correctamente', 'success');
            debugLog('Proyecto cargado:', data);

        } catch (error) {
            hideProgress();
            showError('Error al cargar proyecto: ' + error.message);
            console.error('[LOAD ERROR]', error);
        }
    }

    // ============================================================
    // AUTOSAVE (Prompt 6)
    // ============================================================
    function toggleAutosave() {
        const enabled = document.getElementById('autosaveEnabled').checked;
        if (enabled) {
            autosaveTimer = setInterval(saveToLocalStorage, CONFIG.AUTOSAVE_INTERVAL);
            showToast('Autosave activado', 'success');
        } else {
            if (autosaveTimer) {
                clearInterval(autosaveTimer);
                autosaveTimer = null;
            }
            showToast('Autosave desactivado', 'info');
        }
    }

    function saveToLocalStorage() {
        try {
            const projectData = {
                version: CONFIG.VERSION,
                timestamp: new Date().toISOString(),
                gridSize: parseInt(document.getElementById('gridSize').value) || 20,
                camera: {
                    position: [camera.position.x, camera.position.y, camera.position.z],
                    target: [controls.target.x, controls.target.y, controls.target.z]
                },
                modules: modules.map(serializeModule)
            };
            localStorage.setItem('ciudad_autosave', JSON.stringify(projectData));
            debugLog('Autosave completado');
        } catch (error) {
            console.error('[AUTOSAVE ERROR]', error);
        }
    }

    function loadAutosave() {
        try {
            const saved = localStorage.getItem('ciudad_autosave');
            if (saved && modules.length === 0) {
                const data = JSON.parse(saved);
                if (confirm('Se encontr├│ un autosave. ┬┐Desea restaurarlo?')) {
                    loadProject(data);
                }
            }
        } catch (error) {
            console.error('[LOAD AUTOSAVE ERROR]', error);
        }
    }

    // ============================================================
    // EXPORTACI├ôN DXF (Prompt 3)
    // ============================================================
    function exportToDxf() {
        try {
            showProgress('Exportando DXF...', 'Generando entidades...', 10);

            const units = document.getElementById('exportUnits').value;
            const selectionOnly = document.getElementById('exportSelectionOnly').checked;
            const modulesToExport = selectionOnly && selectedModule ? [selectedModule] : modules;

            if (modulesToExport.length === 0) {
                hideProgress();
                showToast('No hay m├│dulos para exportar', 'warning');
                return;
            }

            // Calcular offset para normalizar coordenadas
            let minX = Infinity, minZ = Infinity;
            modulesToExport.forEach(m => {
                const pos = hexToWorld(m.userData.q, m.userData.r);
                minX = Math.min(minX, pos.x);
                minZ = Math.min(minZ, pos.z);
            });

            let dxf = '0\nSECTION\n2\nHEADER\n';
            
            // A├▒adir unidades (Prompt 3)
            dxf += '9\n$INSUNITS\n70\n' + units + '\n';
            dxf += '0\nENDSEC\n';

            // Secci├│n de tablas (capas)
            dxf += '0\nSECTION\n2\nTABLES\n';
            dxf += '0\nTABLE\n2\nLAYER\n';

            // Definir capas (Prompt 3)
            const layers = ['COLUMNAS', 'BORDES', 'TECHOS', 'PISOS'];
            const layerColors = { COLUMNAS: 5, BORDES: 7, TECHOS: 3, PISOS: 8 };
            
            layers.forEach(layer => {
                dxf += '0\nLAYER\n2\n' + layer + '\n70\n0\n62\n' + layerColors[layer] + '\n6\nCONTINUOUS\n';
            });
            
            dxf += '0\nENDTAB\n0\nENDSEC\n';

            // Secci├│n de entidades
            dxf += '0\nSECTION\n2\nENTITIES\n';

            showProgress('Exportando DXF...', 'Procesando m├│dulos...', 30);

            modulesToExport.forEach((mesh, idx) => {
                const data = mesh.userData;
                const pos = hexToWorld(data.q, data.r);
                const x = pos.x - minX;
                const z = pos.z - minZ;
                const height = MODULE_HEIGHTS[data.type] || 1;
                const size = CONFIG.HEX_SIZE / 2;

                // Determinar capa seg├║n tipo
                let layer = 'BORDES';
                if (data.type === 'building' || data.type === 'commercial') layer = 'COLUMNAS';
                else if (data.type === 'road' || data.type === 'water') layer = 'PISOS';
                else if (data.type === 'house') layer = 'TECHOS';

                // Generar 3DFACE para la base (orden consistente CW)
                dxf += '0\n3DFACE\n8\n' + layer + '\n';
                dxf += '10\n' + (x - size) + '\n20\n0\n30\n' + (z - size) + '\n';  // v1
                dxf += '11\n' + (x + size) + '\n21\n0\n31\n' + (z - size) + '\n';  // v2
                dxf += '12\n' + (x + size) + '\n22\n0\n32\n' + (z + size) + '\n';  // v3
                dxf += '13\n' + (x - size) + '\n23\n0\n33\n' + (z + size) + '\n';  // v4

                // Generar 3DFACE para el techo
                dxf += '0\n3DFACE\n8\nTECHOS\n';
                dxf += '10\n' + (x - size) + '\n20\n' + height + '\n30\n' + (z - size) + '\n';
                dxf += '11\n' + (x + size) + '\n21\n' + height + '\n31\n' + (z - size) + '\n';
                dxf += '12\n' + (x + size) + '\n22\n' + height + '\n32\n' + (z + size) + '\n';
                dxf += '13\n' + (x - size) + '\n23\n' + height + '\n33\n' + (z + size) + '\n';

                // LWPOLYLINE para el contorno
                dxf += '0\nLWPOLYLINE\n8\nBORDES\n90\n4\n70\n1\n';
                dxf += '10\n' + (x - size) + '\n20\n' + (z - size) + '\n';
                dxf += '10\n' + (x + size) + '\n20\n' + (z - size) + '\n';
                dxf += '10\n' + (x + size) + '\n20\n' + (z + size) + '\n';
                dxf += '10\n' + (x - size) + '\n20\n' + (z + size) + '\n';

                if (idx % 10 === 0) {
                    showProgress('Exportando DXF...', `M├│dulo ${idx + 1} de ${modulesToExport.length}...`, 30 + (idx / modulesToExport.length) * 60);
                }
            });

            dxf += '0\nENDSEC\n0\nEOF\n';

            showProgress('Exportando DXF...', 'Descargando...', 95);

            // Descargar archivo
            const blob = new Blob([dxf], { type: 'application/dxf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ciudad.dxf';
            a.click();
            URL.revokeObjectURL(url);

            hideProgress();
            showToast('DXF exportado correctamente', 'success');
            debugLog('DXF exportado con', modulesToExport.length, 'm├│dulos');

        } catch (error) {
            hideProgress();
            showError('Error al exportar DXF: ' + error.message);
        }
    }

    // ============================================================
    // EXPORTACI├ôN OBJ (Prompt 7)
    // ============================================================
    function exportToObj() {
        try {
            showProgress('Exportando OBJ...', 'Generando geometr├¡a...', 10);

            const selectionOnly = document.getElementById('exportSelectionOnly').checked;
            const modulesToExport = selectionOnly && selectedModule ? [selectedModule] : modules;

            if (modulesToExport.length === 0) {
                hideProgress();
                showToast('No hay m├│dulos para exportar', 'warning');
                return;
            }

            let obj = '# OBJ file generated by Ciudad Simulator\n';
            let mtl = '# MTL file generated by Ciudad Simulator\n\n';
            
            let vertexOffset = 1;
            const materials = new Set();

            showProgress('Exportando OBJ...', 'Procesando m├│dulos...', 30);

            modulesToExport.forEach((mesh, idx) => {
                const data = mesh.userData;
                const pos = hexToWorld(data.q, data.r);
                const height = MODULE_HEIGHTS[data.type] || 1;
                const size = CONFIG.HEX_SIZE / 2;
                const materialName = 'mat_' + data.type;

                // A├▒adir material si es nuevo
                if (!materials.has(materialName)) {
                    materials.add(materialName);
                    const color = MODULE_COLORS[data.type] || 0xffffff;
                    const r = ((color >> 16) & 255) / 255;
                    const g = ((color >> 8) & 255) / 255;
                    const b = (color & 255) / 255;
                    mtl += `newmtl ${materialName}\n`;
                    mtl += `Kd ${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)}\n`;
                    mtl += `Ka 0.2 0.2 0.2\n`;
                    mtl += `Ks 0.5 0.5 0.5\n\n`;
                }

                obj += `\n# Module ${data.id} (${data.type})\n`;
                obj += `usemtl ${materialName}\n`;

                // V├®rtices del cubo
                const x = pos.x, z = pos.z;
                const verts = [
                    [x - size, 0, z - size],
                    [x + size, 0, z - size],
                    [x + size, 0, z + size],
                    [x - size, 0, z + size],
                    [x - size, height, z - size],
                    [x + size, height, z - size],
                    [x + size, height, z + size],
                    [x - size, height, z + size]
                ];

                verts.forEach(v => {
                    obj += `v ${v[0].toFixed(4)} ${v[1].toFixed(4)} ${v[2].toFixed(4)}\n`;
                });

                // Caras (quads)
                const vo = vertexOffset;
                // Bottom
                obj += `f ${vo+3} ${vo+2} ${vo+1} ${vo}\n`;
                // Top
                obj += `f ${vo+4} ${vo+5} ${vo+6} ${vo+7}\n`;
                // Front
                obj += `f ${vo} ${vo+1} ${vo+5} ${vo+4}\n`;
                // Back
                obj += `f ${vo+2} ${vo+3} ${vo+7} ${vo+6}\n`;
                // Left
                obj += `f ${vo+3} ${vo} ${vo+4} ${vo+7}\n`;
                // Right
                obj += `f ${vo+1} ${vo+2} ${vo+6} ${vo+5}\n`;

                vertexOffset += 8;

                if (idx % 10 === 0) {
                    showProgress('Exportando OBJ...', `M├│dulo ${idx + 1} de ${modulesToExport.length}...`, 30 + (idx / modulesToExport.length) * 50);
                }
            });

            // A├▒adir referencia al MTL
            obj = 'mtllib ciudad.mtl\n' + obj;

            showProgress('Exportando OBJ...', 'Descargando archivos...', 90);

            // Descargar OBJ
            const objBlob = new Blob([obj], { type: 'text/plain' });
            const objUrl = URL.createObjectURL(objBlob);
            const objLink = document.createElement('a');
            objLink.href = objUrl;
            objLink.download = 'ciudad.obj';
            objLink.click();
            URL.revokeObjectURL(objUrl);

            // Descargar MTL
            const mtlBlob = new Blob([mtl], { type: 'text/plain' });
            const mtlUrl = URL.createObjectURL(mtlBlob);
            const mtlLink = document.createElement('a');
            mtlLink.href = mtlUrl;
            mtlLink.download = 'ciudad.mtl';
            mtlLink.click();
            URL.revokeObjectURL(mtlUrl);

            // Generar archivo de metadatos
            const metadata = {
                version: CONFIG.VERSION,
                modules: modulesToExport.map(m => ({
                    id: m.userData.id,
                    type: m.userData.type,
                    layer: getLayerForType(m.userData.type)
                }))
            };
            const metaBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
            const metaUrl = URL.createObjectURL(metaBlob);
            const metaLink = document.createElement('a');
            metaLink.href = metaUrl;
            metaLink.download = 'ciudad_metadata.json';
            metaLink.click();
            URL.revokeObjectURL(metaUrl);

            hideProgress();
            showToast('OBJ exportado (3 archivos)', 'success');

        } catch (error) {
            hideProgress();
            showError('Error al exportar OBJ: ' + error.message);
        }
    }

    function getLayerForType(type) {
        switch (type) {
            case 'building':
            case 'commercial':
                return 'COLUMNAS';
            case 'road':
            case 'water':
                return 'PISOS';
            case 'house':
                return 'TECHOS';
            default:
                return 'BORDES';
        }
    }

    // ============================================================
    // INSTANCING (Prompt 2)
    // ============================================================
    function toggleInstancing() {
        const useInstancing = document.getElementById('useInstancing').checked;
        debugLog('Instancing:', useInstancing ? 'enabled' : 'disabled');
        // En una implementaci├│n completa, reconstruir├¡amos la escena
        // con InstancedMesh para cada tipo de m├│dulo
        showToast('Instancing ' + (useInstancing ? 'activado' : 'desactivado'), 'info');
    }

    // ============================================================
    // DEBUG MODE (Prompt 8)
    // ============================================================
    function toggleDebug() {
        CONFIG.DEBUG = document.getElementById('debugMode').checked;
        showToast('Modo debug ' + (CONFIG.DEBUG ? 'activado' : 'desactivado'), 'info');
    }

    // ============================================================
    // LOOP DE ANIMACI├ôN (Prompt 2 - optimizado)
    // ============================================================
    function animate() {
        requestAnimationFrame(animate);
        
        // Actualizar controles
        controls.update();
        
        // Renderizar escena
        renderer.render(scene, camera);
        
        // Actualizar FPS (fuera del loop cr├¡tico)
        frameCount++;
        const now = performance.now();
        if (now - lastFpsUpdate >= 1000) {
            document.getElementById('fps').textContent = 'FPS: ' + frameCount;
            frameCount = 0;
            lastFpsUpdate = now;
        }
    }

    // ============================================================
    // INICIALIZAR APLICACI├ôN
    // ============================================================
    window.addEventListener('load', init);
    
