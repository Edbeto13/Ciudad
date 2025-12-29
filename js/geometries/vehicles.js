import * as THREE from 'three';
import { CYBER, COLORS } from '../ciudad.constants.js';

export function createCybertruck() {
    const cyberGroup = new THREE.Group();
    const cl = CYBER.LENGTH;
    const cw = CYBER.WIDTH;
    const ch = CYBER.HEIGHT;
    
    const bodyGeo = new THREE.BoxGeometry(cl, ch * 0.4, cw);
    const matBody = new THREE.MeshStandardMaterial({ color: CYBER.COLOR_BODY, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, matBody);
    body.position.y = ch * 0.2 + CYBER.GROUND_CLEARANCE;
    body.castShadow = true;
    cyberGroup.add(body);
    
    const cabinGeo = new THREE.BoxGeometry(cl * 0.5, ch * 0.4, cw);
    const cabin = new THREE.Mesh(cabinGeo, matBody);
    cabin.position.set(-cl * 0.1, ch * 0.6 + CYBER.GROUND_CLEARANCE, 0);
    cabin.castShadow = true;
    cyberGroup.add(cabin);
    
    const matWin = new THREE.MeshStandardMaterial({ color: CYBER.COLOR_WINDOW, transparent: true, opacity: 0.5 });
    const windGeo = new THREE.PlaneGeometry(cw * 0.9, ch * 0.3);
    const windshield = new THREE.Mesh(windGeo, matWin);
    windshield.position.set(-cl * 0.12, ch * 0.65 + CYBER.GROUND_CLEARANCE, 0);
    windshield.rotation.x = -0.2;
    windshield.rotation.y = Math.PI / 2;
    cyberGroup.add(windshield);
    
    const matLight = new THREE.MeshStandardMaterial({ color: CYBER.COLOR_LIGHT, emissive: CYBER.COLOR_LIGHT });
    const lightGeo = new THREE.BoxGeometry(0.1, 0.08, cw * 0.8);
    const frontLight = new THREE.Mesh(lightGeo, matLight);
    frontLight.position.set(cl * 0.5, ch * 0.25 + CYBER.GROUND_CLEARANCE, 0);
    frontLight.castShadow = true;
    cyberGroup.add(frontLight);
    
    const matWheel = new THREE.MeshStandardMaterial({ color: CYBER.COLOR_WHEEL });
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelPositions = [
        [CYBER.WHEELBASE / 2, CYBER.GROUND_CLEARANCE / 2, cw / 2],
        [CYBER.WHEELBASE / 2, CYBER.GROUND_CLEARANCE / 2, -cw / 2],
        [-CYBER.WHEELBASE / 2, CYBER.GROUND_CLEARANCE / 2, cw / 2],
        [-CYBER.WHEELBASE / 2, CYBER.GROUND_CLEARANCE / 2, -cw / 2]
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, matWheel);
        wheel.position.set(...pos);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        cyberGroup.add(wheel);
    });
    
    return cyberGroup;
}
