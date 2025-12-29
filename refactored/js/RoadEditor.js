import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { 
    SCALE, BASE_REAL_X, BASE_REAL_Z, OCT_AREA, OCT_HEIGHT, OCT_RADIUS, 
    OCT_FACE_DIST, CYBER, COLORS, SNAP_DISTANCE_ROAD, SNAP_DISTANCE_VEHICLE 
} from './constants.js';
import { createRoadStraight, createRoadCurve, createRoundabout, createRadialHub } from './geometries/roads.js';
import { createOctagon, createPyramidOf6To2Octagons } from './geometries/octagon.js';
import { createCybertruck } from './geometries/vehicles.js';
import { createPylon } from './geometries/pylon.js';
import { findSnapTarget, snapToTarget, showSnapIndicator } from './utils/snap.js';
import { serializeScene, saveSceneToFile, loadSceneFromFile } from './utils/serialization.js';
import { exportToDXF, downloadDXF } from './export/dxf.js';

export class RoadEditor {
    constructor() {
        this.initScene();
        this.initLights();
        this.initMaterials();
        this.initControls();
        this.initEventListeners();
        this.objects = [];
        this.selected = null;
        this.dragMode = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        this.vehicleController = null;
        this.keyState = {};
        
        this.loadDefaultScene();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(COLORS.BACKGROUND);
        
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera.position.set(0, 150, 200);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        
        const gPlane = new THREE.PlaneGeometry(10000, 10000);
        const mPlane = new THREE.MeshStandardMaterial({ color: COLORS.GRASS, roughness: 0.9 });
        this.ground = new THREE.Mesh(gPlane, mPlane);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    initLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);
        
        const sun = new THREE.DirectionalLight(0xffffff, 1.2);
        sun.position.set(100, 200, 50);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 4096;
        sun.shadow.mapSize.height = 4096;
        sun.shadow.camera.left = -300;
        sun.shadow.camera.right = 300;
        sun.shadow.camera.top = 300;
        sun.shadow.camera.bottom = -300;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 500;
        this.scene.add(sun);
    }

    initMaterials() {
        this.matRoad = new THREE.MeshStandardMaterial({ color: COLORS.ROAD, roughness: 0.8 });
        this.matLine = new THREE.MeshStandardMaterial({ color: COLORS.LINES, emissive: COLORS.LINES, emissiveIntensity: 0.3 });
        this.matOctWall = new THREE.MeshStandardMaterial({ color: COLORS.OCT_WALL, roughness: 0.7 });
        this.matOctCap = new THREE.MeshStandardMaterial({ color: COLORS.OCT_CAP, side: THREE.DoubleSide, roughness: 0.8 });
        this.matSelected = new THREE.MeshStandardMaterial({ 
            color: COLORS.SELECTED, 
            emissive: COLORS.SELECTED_EMISSIVE, 
            emissiveIntensity: 0.5 
        });
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.01;
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        document.getElementById('rngLen')?.addEventListener('input', (e) => this.updateLength(e));
        document.getElementById('rngRad')?.addEventListener('input', (e) => this.updateRadius(e));
        document.getElementById('rngDiam')?.addEventListener('input', (e) => this.updateDiameter(e));
        document.getElementById('rngHeight')?.addEventListener('input', (e) => this.updatePylonHeight(e));
        document.getElementById('rngBaseDiam')?.addEventListener('input', (e) => this.updatePylonBaseDiam(e));
        document.getElementById('rngRot')?.addEventListener('input', (e) => this.updateRotation(e));
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        
        if (this.vehicleController) {
            this.updateVehicle();
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(e) {
        if (e.button !== 0) return;
        
        this.updateMousePosition(e);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const hits = this.raycaster.intersectObjects(this.objects, true);
        if (hits.length > 0) {
            let obj = hits[0].object;
            while (obj.parent && !this.objects.includes(obj)) {
                obj = obj.parent;
            }
            if (this.objects.includes(obj)) {
                this.selectObject(obj);
                this.dragMode = true;
                this.controls.enabled = false;
            }
        } else {
            this.deselectObject();
        }
    }

    onMouseMove(e) {
        if (!this.dragMode || !this.selected) return;
        
        this.updateMousePosition(e);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersect = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.plane, intersect);
        
        if (intersect) {
            this.selected.position.x = intersect.x;
            this.selected.position.z = intersect.z;
            
            const snapDist = this.selected.userData.type === 'cybertruck' ? SNAP_DISTANCE_VEHICLE : SNAP_DISTANCE_ROAD;
            const target = findSnapTarget(intersect, this.scene, snapDist, this.selected);
            
            if (target) {
                snapToTarget(this.selected, target, true);
                showSnapIndicator(true);
            } else {
                showSnapIndicator(false);
            }
        }
    }

    onMouseUp() {
        this.dragMode = false;
        this.controls.enabled = true;
        showSnapIndicator(false);
    }

    onKeyDown(e) {
        this.keyState[e.key.toLowerCase()] = true;
        
        if (e.key === 'Delete' && this.selected) {
            this.deleteSelected();
        }
    }

    onKeyUp(e) {
        this.keyState[e.key.toLowerCase()] = false;
    }

    updateMousePosition(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    selectObject(obj) {
        this.deselectObject();
        this.selected = obj;
        this.updateMaterial(obj, this.matSelected);
        this.showProperties(obj);
    }

    deselectObject() {
        if (this.selected) {
            this.updateMaterial(this.selected, null);
            this.selected = null;
            this.hideProperties();
        }
    }

    updateMaterial(obj, mat) {
        obj.traverse(child => {
            if (child.isMesh && child.material) {
                if (mat) {
                    child.userData.originalMaterial = child.material;
                    child.material = mat;
                } else if (child.userData.originalMaterial) {
                    child.material = child.userData.originalMaterial;
                    delete child.userData.originalMaterial;
                }
            }
        });
    }

    showProperties(obj) {
        const panel = document.getElementById('propPanel');
        if (!panel) return;
        
        panel.style.display = 'block';
        
        document.getElementById('controls-straight').style.display = 'none';
        document.getElementById('controls-curve').style.display = 'none';
        document.getElementById('controls-roundabout').style.display = 'none';
        document.getElementById('controls-pylon').style.display = 'none';
        
        const type = obj.userData.type;
        if (type === 'straight') {
            document.getElementById('controls-straight').style.display = 'block';
            document.getElementById('rngLen').value = obj.userData.params.length || 100;
            document.getElementById('lblLen').textContent = (obj.userData.params.length || 100) + 'm';
        } else if (type === 'curve') {
            document.getElementById('controls-curve').style.display = 'block';
            document.getElementById('rngRad').value = obj.userData.params.radius || 50;
            document.getElementById('lblRad').textContent = (obj.userData.params.radius || 50) + 'm';
        } else if (type === 'parametricRoundabout') {
            document.getElementById('controls-roundabout').style.display = 'block';
            document.getElementById('rngDiam').value = obj.userData.params.diameter || 50;
            document.getElementById('lblDiam').textContent = (obj.userData.params.diameter || 50) + 'm';
            const area = Math.PI * Math.pow(obj.userData.params.diameter / 2, 2);
            document.getElementById('lblArea').textContent = `Área: ${area.toFixed(1)} m²`;
        } else if (type === 'pylon') {
            document.getElementById('controls-pylon').style.display = 'block';
            document.getElementById('rngHeight').value = obj.userData.params.height || 30;
            document.getElementById('lblHeight').textContent = (obj.userData.params.height || 30) + 'm';
            document.getElementById('rngBaseDiam').value = obj.userData.params.baseDiameter || 2;
            document.getElementById('lblBaseDiam').textContent = (obj.userData.params.baseDiameter || 2) + 'm';
        }
        
        document.getElementById('rngRot').value = (obj.rotation.y * 180 / Math.PI).toFixed(0);
        document.getElementById('lblRot').textContent = (obj.rotation.y * 180 / Math.PI).toFixed(0) + '°';
    }

    hideProperties() {
        const panel = document.getElementById('propPanel');
        if (panel) panel.style.display = 'none';
    }

    updateLength(e) {
        if (!this.selected || this.selected.userData.type !== 'straight') return;
        const len = parseFloat(e.target.value);
        document.getElementById('lblLen').textContent = len + 'm';
        this.rebuildStraight(this.selected, len);
    }

    updateRadius(e) {
        if (!this.selected || this.selected.userData.type !== 'curve') return;
        const rad = parseFloat(e.target.value);
        document.getElementById('lblRad').textContent = rad + 'm';
        this.rebuildCurve(this.selected, rad);
    }

    updateDiameter(e) {
        if (!this.selected || this.selected.userData.type !== 'parametricRoundabout') return;
        const diam = parseFloat(e.target.value);
        document.getElementById('lblDiam').textContent = diam + 'm';
        const area = Math.PI * Math.pow(diam / 2, 2);
        document.getElementById('lblArea').textContent = `Área: ${area.toFixed(1)} m²`;
        this.rebuildRoundabout(this.selected, diam);
    }

    updatePylonHeight(e) {
        if (!this.selected || this.selected.userData.type !== 'pylon') return;
        const h = parseFloat(e.target.value);
        document.getElementById('lblHeight').textContent = h + 'm';
        this.rebuildPylon(this.selected, h, this.selected.userData.params.baseDiameter);
    }

    updatePylonBaseDiam(e) {
        if (!this.selected || this.selected.userData.type !== 'pylon') return;
        const d = parseFloat(e.target.value);
        document.getElementById('lblBaseDiam').textContent = d + 'm';
        this.rebuildPylon(this.selected, this.selected.userData.params.height, d);
    }

    updateRotation(e) {
        if (!this.selected) return;
        const deg = parseFloat(e.target.value);
        document.getElementById('lblRot').textContent = deg + '°';
        this.selected.rotation.y = deg * Math.PI / 180;
        this.selected.userData.rotation = this.selected.rotation.y;
    }

    rebuildStraight(obj, len) {
        const pos = obj.position.clone();
        const rot = obj.rotation.y;
        this.scene.remove(obj);
        const idx = this.objects.indexOf(obj);
        if (idx > -1) this.objects.splice(idx, 1);
        
        const newRoad = createRoadStraight(len, { matRoad: this.matRoad, matLine: this.matLine });
        newRoad.position.copy(pos);
        newRoad.rotation.y = rot;
        newRoad.userData = { type: 'straight', params: { length: len }, rotation: rot };
        
        const halfLen = len / 2;
        newRoad.userData.connectorPoints = [
            new THREE.Vector3(0, 0, -halfLen),
            new THREE.Vector3(0, 0, halfLen)
        ];
        
        this.scene.add(newRoad);
        this.objects.push(newRoad);
        this.selectObject(newRoad);
    }

    rebuildCurve(obj, rad) {
        const pos = obj.position.clone();
        const rot = obj.rotation.y;
        this.scene.remove(obj);
        const idx = this.objects.indexOf(obj);
        if (idx > -1) this.objects.splice(idx, 1);
        
        const newCurve = createRoadCurve(rad, { matRoad: this.matRoad, matLine: this.matLine });
        newCurve.position.copy(pos);
        newCurve.rotation.y = rot;
        newCurve.userData = { type: 'curve', params: { radius: rad }, rotation: rot };
        
        newCurve.userData.connectorPoints = [
            new THREE.Vector3(rad, 0, 0),
            new THREE.Vector3(0, 0, rad)
        ];
        
        this.scene.add(newCurve);
        this.objects.push(newCurve);
        this.selectObject(newCurve);
    }

    rebuildRoundabout(obj, diam) {
        const pos = obj.position.clone();
        const rot = obj.rotation.y;
        this.scene.remove(obj);
        const idx = this.objects.indexOf(obj);
        if (idx > -1) this.objects.splice(idx, 1);
        
        const newRoundabout = createRoundabout(diam, { matRoad: this.matRoad, matLine: this.matLine });
        newRoundabout.position.copy(pos);
        newRoundabout.rotation.y = rot;
        newRoundabout.userData = { type: 'parametricRoundabout', params: { diameter: diam }, rotation: rot };
        
        this.scene.add(newRoundabout);
        this.objects.push(newRoundabout);
        this.selectObject(newRoundabout);
    }

    rebuildPylon(obj, height, baseDiam) {
        const pos = obj.position.clone();
        const rot = obj.rotation.y;
        this.scene.remove(obj);
        const idx = this.objects.indexOf(obj);
        if (idx > -1) this.objects.splice(idx, 1);
        
        const newPylon = createPylon(height, baseDiam);
        newPylon.position.copy(pos);
        newPylon.rotation.y = rot;
        newPylon.userData = { type: 'pylon', params: { height, baseDiameter: baseDiam }, rotation: rot };
        
        this.scene.add(newPylon);
        this.objects.push(newPylon);
        this.selectObject(newPylon);
    }

    deleteSelected() {
        if (!this.selected) return;
        this.scene.remove(this.selected);
        const idx = this.objects.indexOf(this.selected);
        if (idx > -1) this.objects.splice(idx, 1);
        this.selected = null;
        this.hideProperties();
    }

    addStraight() {
        const road = createRoadStraight(100, { matRoad: this.matRoad, matLine: this.matLine });
        road.userData = { type: 'straight', params: { length: 100 }, rotation: 0 };
        road.userData.connectorPoints = [
            new THREE.Vector3(0, 0, -50),
            new THREE.Vector3(0, 0, 50)
        ];
        this.scene.add(road);
        this.objects.push(road);
        this.selectObject(road);
    }

    addCurve() {
        const curve = createRoadCurve(50, { matRoad: this.matRoad, matLine: this.matLine });
        curve.userData = { type: 'curve', params: { radius: 50 }, rotation: 0 };
        curve.userData.connectorPoints = [
            new THREE.Vector3(50, 0, 0),
            new THREE.Vector3(0, 0, 50)
        ];
        this.scene.add(curve);
        this.objects.push(curve);
        this.selectObject(curve);
    }

    addParametricRoundabout() {
        const roundabout = createRoundabout(50, { matRoad: this.matRoad, matLine: this.matLine });
        roundabout.userData = { type: 'parametricRoundabout', params: { diameter: 50 }, rotation: 0 };
        this.scene.add(roundabout);
        this.objects.push(roundabout);
        this.selectObject(roundabout);
    }

    addRadialHub() {
        const hub = createRadialHub({ matRoad: this.matRoad, matLine: this.matLine });
        hub.userData = { type: 'radialHub', params: {}, rotation: 0 };
        this.scene.add(hub);
        this.objects.push(hub);
        this.selectObject(hub);
    }

    addOctagon() {
        const oct = createOctagon({ matWall: this.matOctWall, matCap: this.matOctCap });
        oct.userData = { type: 'octagon', params: {}, rotation: 0 };
        this.scene.add(oct);
        this.objects.push(oct);
        this.selectObject(oct);
    }

    addPyramid() {
        const pyr = createPyramidOf6To2Octagons({ matWall: this.matOctWall, matCap: this.matOctCap });
        pyr.userData = { type: 'pyramid', params: {}, rotation: 0 };
        this.scene.add(pyr);
        this.objects.push(pyr);
        this.selectObject(pyr);
    }

    addPylon() {
        const pylon = createPylon(30, 2);
        pylon.userData = { type: 'pylon', params: { height: 30, baseDiameter: 2 }, rotation: 0 };
        this.scene.add(pylon);
        this.objects.push(pylon);
        this.selectObject(pylon);
    }

    addCybertruck() {
        const cyber = createCybertruck();
        cyber.userData = { 
            type: 'cybertruck', 
            params: { 
                length: CYBER.LENGTH, 
                width: CYBER.WIDTH, 
                wheelbase: CYBER.WHEELBASE 
            }, 
            rotation: 0,
            velocity: new THREE.Vector3(),
            speed: 0
        };
        cyber.userData.connectorPoints = [new THREE.Vector3(0, 0, 0)];
        this.scene.add(cyber);
        this.objects.push(cyber);
        this.selectObject(cyber);
        this.vehicleController = cyber;
    }

    updateVehicle() {
        if (!this.vehicleController) return;
        
        const v = this.vehicleController;
        const ud = v.userData;
        let accel = 0;
        let turn = 0;
        let turbo = 1;
        
        if (this.keyState['w'] || this.keyState['arrowup']) accel = 1;
        if (this.keyState['s'] || this.keyState['arrowdown']) accel = -1;
        if (this.keyState['a'] || this.keyState['arrowleft']) turn = 1;
        if (this.keyState['d'] || this.keyState['arrowright']) turn = -1;
        if (this.keyState['shift']) turbo = 2;
        
        if (accel !== 0) {
            ud.speed += accel * CYBER.ACCELERATION * 0.016 * turbo;
            ud.speed = Math.max(-CYBER.MAX_SPEED, Math.min(CYBER.MAX_SPEED, ud.speed));
        } else {
            ud.speed *= CYBER.FRICTION;
            if (Math.abs(ud.speed) < 0.1) ud.speed = 0;
        }
        
        if (turn !== 0 && Math.abs(ud.speed) > 0.5) {
            v.rotation.y += turn * CYBER.TURN_RATE * 0.016 * (ud.speed / CYBER.MAX_SPEED);
            ud.rotation = v.rotation.y;
        }
        
        if (ud.speed !== 0) {
            const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), v.rotation.y);
            v.position.addScaledVector(forward, ud.speed * 0.016);
            
            this.camera.position.x = v.position.x + 30 * Math.cos(v.rotation.y + Math.PI / 4);
            this.camera.position.z = v.position.z + 30 * Math.sin(v.rotation.y + Math.PI / 4);
            this.camera.position.y = v.position.y + 15;
            this.camera.lookAt(v.position);
        }
    }

    generatePyramidGrid() {
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 12; col++) {
                const pyr = createPyramidOf6To2Octagons({ matWall: this.matOctWall, matCap: this.matOctCap });
                pyr.position.x = col * (6 * OCT_FACE_DIST + 5);
                pyr.position.z = row * (OCT_FACE_DIST * Math.sin(Math.PI / 4) + 5 + OCT_HEIGHT);
                pyr.userData = { type: 'pyramid', params: {}, rotation: 0 };
                this.scene.add(pyr);
                this.objects.push(pyr);
            }
        }
    }

    generatePerimeterRoad() {
        const w = BASE_REAL_X;
        const h = BASE_REAL_Z;
        const straightLen = (w - 2 * 50) / 2;
        const straightLen2 = h - 2 * 50;
        
        const top = createRoadStraight(straightLen, { matRoad: this.matRoad, matLine: this.matLine });
        top.position.set(-straightLen / 2 - 50, 0, -h / 2);
        top.rotation.y = Math.PI / 2;
        top.userData = { type: 'straight', params: { length: straightLen }, rotation: top.rotation.y };
        this.scene.add(top);
        this.objects.push(top);
        
        const top2 = createRoadStraight(straightLen, { matRoad: this.matRoad, matLine: this.matLine });
        top2.position.set(straightLen / 2 + 50, 0, -h / 2);
        top2.rotation.y = Math.PI / 2;
        top2.userData = { type: 'straight', params: { length: straightLen }, rotation: top2.rotation.y };
        this.scene.add(top2);
        this.objects.push(top2);
        
        const bottom = createRoadStraight(straightLen, { matRoad: this.matRoad, matLine: this.matLine });
        bottom.position.set(-straightLen / 2 - 50, 0, h / 2);
        bottom.rotation.y = Math.PI / 2;
        bottom.userData = { type: 'straight', params: { length: straightLen }, rotation: bottom.rotation.y };
        this.scene.add(bottom);
        this.objects.push(bottom);
        
        const bottom2 = createRoadStraight(straightLen, { matRoad: this.matRoad, matLine: this.matLine });
        bottom2.position.set(straightLen / 2 + 50, 0, h / 2);
        bottom2.rotation.y = Math.PI / 2;
        bottom2.userData = { type: 'straight', params: { length: straightLen }, rotation: bottom2.rotation.y };
        this.scene.add(bottom2);
        this.objects.push(bottom2);
        
        const left = createRoadStraight(straightLen2, { matRoad: this.matRoad, matLine: this.matLine });
        left.position.set(-w / 2, 0, 0);
        left.userData = { type: 'straight', params: { length: straightLen2 }, rotation: 0 };
        this.scene.add(left);
        this.objects.push(left);
        
        const right = createRoadStraight(straightLen2, { matRoad: this.matRoad, matLine: this.matLine });
        right.position.set(w / 2, 0, 0);
        right.userData = { type: 'straight', params: { length: straightLen2 }, rotation: 0 };
        this.scene.add(right);
        this.objects.push(right);
        
        const corners = [
            { x: -w / 2, z: -h / 2, r: Math.PI },
            { x: w / 2, z: -h / 2, r: -Math.PI / 2 },
            { x: w / 2, z: h / 2, r: 0 },
            { x: -w / 2, z: h / 2, r: Math.PI / 2 }
        ];
        
        corners.forEach(c => {
            const curve = createRoadCurve(50, { matRoad: this.matRoad, matLine: this.matLine });
            curve.position.set(c.x, 0, c.z);
            curve.rotation.y = c.r;
            curve.userData = { type: 'curve', params: { radius: 50 }, rotation: c.r };
            this.scene.add(curve);
            this.objects.push(curve);
        });
        
        const glorieta = createRoundabout(50, { matRoad: this.matRoad, matLine: this.matLine });
        glorieta.userData = { type: 'parametricRoundabout', params: { diameter: 50 }, rotation: 0 };
        this.scene.add(glorieta);
        this.objects.push(glorieta);
    }

    showBaseArea() {
        const existing = this.scene.getObjectByName('baseArea');
        if (existing) {
            this.scene.remove(existing);
            const idx = this.objects.indexOf(existing);
            if (idx > -1) this.objects.splice(idx, 1);
            return;
        }
        
        const w = BASE_REAL_X;
        const h = BASE_REAL_Z;
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0x444444, 
            transparent: true, 
            opacity: 0.3, 
            side: THREE.DoubleSide 
        });
        const plane = new THREE.Mesh(geo, mat);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = 0.05;
        plane.name = 'baseArea';
        plane.userData = { type: 'baseArea', params: { width: w, depth: h } };
        this.scene.add(plane);
        this.objects.push(plane);
    }

    saveScene() {
        const json = serializeScene(this.objects);
        saveSceneToFile(json);
    }

    loadSavedScene() {
        loadSceneFromFile((data) => this.deserializeScene(data));
    }

    clearScene() {
        if (!confirm('¿Eliminar toda la escena?')) return;
        this.objects.forEach(obj => this.scene.remove(obj));
        this.objects = [];
        this.selected = null;
        this.hideProperties();
    }

    deserializeScene(data) {
        this.clearScene();
        
        data.forEach(item => {
            let obj = null;
            
            switch (item.type) {
                case 'straight':
                    obj = createRoadStraight(item.params.length || 100, { 
                        matRoad: this.matRoad, 
                        matLine: this.matLine 
                    });
                    obj.userData.connectorPoints = [
                        new THREE.Vector3(0, 0, -(item.params.length || 100) / 2),
                        new THREE.Vector3(0, 0, (item.params.length || 100) / 2)
                    ];
                    break;
                case 'curve':
                    obj = createRoadCurve(item.params.radius || 50, { 
                        matRoad: this.matRoad, 
                        matLine: this.matLine 
                    });
                    obj.userData.connectorPoints = [
                        new THREE.Vector3(item.params.radius || 50, 0, 0),
                        new THREE.Vector3(0, 0, item.params.radius || 50)
                    ];
                    break;
                case 'parametricRoundabout':
                    obj = createRoundabout(item.params.diameter || 50, { 
                        matRoad: this.matRoad, 
                        matLine: this.matLine 
                    });
                    break;
                case 'radialHub':
                    obj = createRadialHub({ matRoad: this.matRoad, matLine: this.matLine });
                    break;
                case 'octagon':
                    obj = createOctagon({ matWall: this.matOctWall, matCap: this.matOctCap });
                    break;
                case 'pyramid':
                    obj = createPyramidOf6To2Octagons({ matWall: this.matOctWall, matCap: this.matOctCap });
                    break;
                case 'pylon':
                    obj = createPylon(item.params.height || 30, item.params.baseDiameter || 2);
                    break;
                case 'cybertruck':
                    obj = createCybertruck();
                    obj.userData.velocity = new THREE.Vector3();
                    obj.userData.speed = 0;
                    obj.userData.connectorPoints = [new THREE.Vector3(0, 0, 0)];
                    break;
            }
            
            if (obj) {
                obj.position.set(item.position.x, item.position.y, item.position.z);
                obj.rotation.y = item.rotation;
                obj.userData.type = item.type;
                obj.userData.params = item.params;
                obj.userData.rotation = item.rotation;
                this.scene.add(obj);
                this.objects.push(obj);
            }
        });
    }

    loadDefaultScene() {
        const cyber = createCybertruck();
        cyber.position.set(0, 0, 0);
        cyber.userData = { 
            type: 'cybertruck', 
            params: { 
                length: CYBER.LENGTH, 
                width: CYBER.WIDTH, 
                wheelbase: CYBER.WHEELBASE 
            }, 
            rotation: 0,
            velocity: new THREE.Vector3(),
            speed: 0,
            connectorPoints: [new THREE.Vector3(0, 0, 0)]
        };
        this.scene.add(cyber);
        this.objects.push(cyber);
        this.vehicleController = cyber;
        
        const pylon = createPylon(30, 2);
        pylon.position.set(20, 0, 20);
        pylon.userData = { type: 'pylon', params: { height: 30, baseDiameter: 2 }, rotation: 0 };
        this.scene.add(pylon);
        this.objects.push(pylon);
    }

    exportDXF() {
        const dxfContent = exportToDXF(this.objects, SCALE);
        downloadDXF(dxfContent);
    }
}
