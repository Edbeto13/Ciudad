import * as THREE from 'three';
import { COLORS } from '../ciudad.constants.js';

export function createRoadStraight(len, options = {}) {
    const { matRoad, matLine } = options;
    const g = new THREE.BoxGeometry(10, 0.2, len);
    const road = new THREE.Mesh(g, matRoad || new THREE.MeshStandardMaterial({ color: COLORS.ROAD }));
    road.castShadow = true;
    road.receiveShadow = true;
    
    const lineGeo1 = new THREE.BoxGeometry(0.3, 0.22, len);
    const lineGeo2 = lineGeo1.clone();
    const ml = matLine || new THREE.MeshStandardMaterial({ color: COLORS.LINES });
    const line1 = new THREE.Mesh(lineGeo1, ml);
    const line2 = new THREE.Mesh(lineGeo2, ml);
    line1.position.x = -2.5;
    line1.castShadow = true;
    line2.position.x = 2.5;
    line2.castShadow = true;
    
    road.add(line1, line2);
    return road;
}

export function createRoadCurve(rad, options = {}) {
    const { matRoad, matLine } = options;
    const shape = new THREE.Shape();
    const seg = 32;
    const w = 10;
    const outerR = rad + w / 2;
    const innerR = rad - w / 2;
    
    for (let i = 0; i <= seg; i++) {
        const t = Math.PI / 2 * i / seg;
        const x = outerR * Math.cos(t);
        const y = outerR * Math.sin(t);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    for (let i = seg; i >= 0; i--) {
        const t = Math.PI / 2 * i / seg;
        const x = innerR * Math.cos(t);
        const y = innerR * Math.sin(t);
        shape.lineTo(x, y);
    }
    shape.closePath();
    
    const extrudeSettings = { depth: 0.2, bevelEnabled: false };
    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const road = new THREE.Mesh(g, matRoad || new THREE.MeshStandardMaterial({ color: COLORS.ROAD }));
    road.rotation.x = -Math.PI / 2;
    road.castShadow = true;
    road.receiveShadow = true;
    
    const lineR1 = rad - 2.5;
    const lineR2 = rad + 2.5;
    const curve1 = new THREE.EllipseCurve(0, 0, lineR1, lineR1, 0, Math.PI / 2, false, 0);
    const curve2 = new THREE.EllipseCurve(0, 0, lineR2, lineR2, 0, Math.PI / 2, false, 0);
    const pts1 = curve1.getPoints(50);
    const pts2 = curve2.getPoints(50);
    const g1 = new THREE.BufferGeometry().setFromPoints(pts1);
    const g2 = new THREE.BufferGeometry().setFromPoints(pts2);
    const ml = matLine || new THREE.LineBasicMaterial({ color: COLORS.LINES, linewidth: 2 });
    const line1 = new THREE.Line(g1, ml);
    const line2 = new THREE.Line(g2, ml);
    line1.rotation.x = -Math.PI / 2;
    line1.position.y = 0.11;
    line2.rotation.x = -Math.PI / 2;
    line2.position.y = 0.11;
    road.add(line1, line2);
    
    return road;
}

export function createRoundabout(diam, options = {}) {
    const { matRoad, matLine } = options;
    const w = 10;
    const R = diam / 2 + w / 2;
    const r = diam / 2 - w / 2;
    
    const shape = new THREE.Shape();
    const pts = 64;
    for (let i = 0; i <= pts; i++) {
        const t = 2 * Math.PI * i / pts;
        const x = R * Math.cos(t);
        const y = R * Math.sin(t);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    for (let i = pts; i >= 0; i--) {
        const t = 2 * Math.PI * i / pts;
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        shape.lineTo(x, y);
    }
    shape.closePath();
    
    const extrudeSettings = { depth: 0.2, bevelEnabled: false };
    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const road = new THREE.Mesh(g, matRoad || new THREE.MeshStandardMaterial({ color: COLORS.ROAD }));
    road.rotation.x = -Math.PI / 2;
    road.castShadow = true;
    road.receiveShadow = true;
    
    const lineR1 = diam / 2 - 2.5;
    const lineR2 = diam / 2 + 2.5;
    const curve1 = new THREE.EllipseCurve(0, 0, lineR1, lineR1, 0, 2 * Math.PI, false, 0);
    const curve2 = new THREE.EllipseCurve(0, 0, lineR2, lineR2, 0, 2 * Math.PI, false, 0);
    const pts1 = curve1.getPoints(100);
    const pts2 = curve2.getPoints(100);
    const g1 = new THREE.BufferGeometry().setFromPoints(pts1);
    const g2 = new THREE.BufferGeometry().setFromPoints(pts2);
    const ml = matLine || new THREE.LineBasicMaterial({ color: COLORS.LINES, linewidth: 2 });
    const line1 = new THREE.Line(g1, ml);
    const line2 = new THREE.Line(g2, ml);
    line1.rotation.x = -Math.PI / 2;
    line1.position.y = 0.11;
    line2.rotation.x = -Math.PI / 2;
    line2.position.y = 0.11;
    road.add(line1, line2);
    
    return road;
}

export function createRadialHub(options = {}) {
    const { matRoad, matLine } = options;
    const hubGroup = new THREE.Group();
    const glorieta = createRoundabout(100, { matRoad, matLine });
    hubGroup.add(glorieta);
    
    const armCount = 8;
    for (let i = 0; i < armCount; i++) {
        const angle = (2 * Math.PI / armCount) * i;
        const road = createRoadStraight(100, { matRoad, matLine });
        const cx = 50 * Math.cos(angle);
        const cz = 50 * Math.sin(angle);
        road.position.set(cx, 0, cz);
        road.rotation.y = angle + Math.PI / 2;
        const ex = 100 * Math.cos(angle);
        const ez = 100 * Math.sin(angle);
        road.position.set(ex / 2, 0, ez / 2);
        hubGroup.add(road);
    }
    
    return hubGroup;
}
