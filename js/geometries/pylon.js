import * as THREE from 'three';
import { COLORS } from '../ciudad.constants.js';

export function createPylon(height = 30, baseDiam = 2) {
    const group = new THREE.Group();
    
    const matTower = new THREE.MeshStandardMaterial({ color: COLORS.PYLON_TOWER, metalness: 0.7, roughness: 0.3 });
    const matHead = new THREE.MeshStandardMaterial({ color: COLORS.PYLON_HEAD, metalness: 0.6, roughness: 0.4 });
    const matSheave = new THREE.MeshStandardMaterial({ color: COLORS.PYLON_SHEAVE, metalness: 0.8, roughness: 0.2 });
    const matBase = new THREE.MeshStandardMaterial({ color: COLORS.PYLON_BASE });
    
    const baseGeom = new THREE.CylinderGeometry(baseDiam, baseDiam * 1.2, 1, 8);
    const base = new THREE.Mesh(baseGeom, matBase);
    base.position.y = 0.5;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    const topDiam = baseDiam * 0.4;
    const towerGeom = new THREE.CylinderGeometry(topDiam, baseDiam, height, 12);
    const tower = new THREE.Mesh(towerGeom, matTower);
    tower.position.y = height / 2 + 1;
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);
    
    const headW = baseDiam * 1.2;
    const headH = baseDiam * 0.6;
    const headD = baseDiam * 0.8;
    const headGeom = new THREE.BoxGeometry(headW, headH, headD);
    const head = new THREE.Mesh(headGeom, matHead);
    head.position.y = height + 1 + headH / 2;
    head.castShadow = true;
    group.add(head);
    
    const sheaveCount = 10;
    const sheaveR = baseDiam * 0.15;
    const spacing = headW / (sheaveCount + 1);
    for (let i = 0; i < sheaveCount; i++) {
        const sheaveGeom = new THREE.CylinderGeometry(sheaveR, sheaveR, sheaveR * 0.4, 16);
        const sheave = new THREE.Mesh(sheaveGeom, matSheave);
        sheave.rotation.z = Math.PI / 2;
        sheave.position.set((i - sheaveCount / 2 + 0.5) * spacing, height + 1 + headH / 2, 0);
        sheave.castShadow = true;
        group.add(sheave);
    }
    
    return group;
}
