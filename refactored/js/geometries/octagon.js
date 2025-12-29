import * as THREE from 'three';
import { OCT_RADIUS, OCT_HEIGHT, OCT_FACE_DIST, COLORS } from '../constants.js';

export function createOctagon(options = {}) {
    const { matWall, matCap } = options;
    const sides = 8;
    const group = new THREE.Group();
    
    const shape = new THREE.Shape();
    for (let i = 0; i < sides; i++) {
        const ang = (2 * Math.PI / sides) * i;
        const x = OCT_RADIUS * Math.cos(ang);
        const y = OCT_RADIUS * Math.sin(ang);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    shape.closePath();
    
    const extrudeSettings = { depth: OCT_HEIGHT, bevelEnabled: false };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const mat = matWall || new THREE.MeshStandardMaterial({ color: COLORS.OCT_WALL });
    const walls = new THREE.Mesh(geom, mat);
    walls.rotation.x = -Math.PI / 2;
    walls.position.y = 0;
    walls.castShadow = true;
    walls.receiveShadow = true;
    group.add(walls);
    
    const floorGeo = new THREE.ShapeGeometry(shape);
    const matF = matCap || new THREE.MeshStandardMaterial({ color: COLORS.OCT_CAP, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeo, matF);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    group.add(floor);
    
    const roofGeo = floorGeo.clone();
    const roof = new THREE.Mesh(roofGeo, matF);
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = OCT_HEIGHT - 0.02;
    roof.receiveShadow = true;
    group.add(roof);
    
    for (let i = 0; i < sides; i++) {
        const ang = (2 * Math.PI / sides) * i;
        const vx = OCT_RADIUS * Math.cos(ang);
        const vz = OCT_RADIUS * Math.sin(ang);
        const vg = new THREE.SphereGeometry(0.05, 8, 8);
        const vm = new THREE.MeshStandardMaterial({ color: COLORS.OCT_VERTEX, emissive: COLORS.OCT_VERTEX });
        const vertex = new THREE.Mesh(vg, vm);
        vertex.position.set(vx, OCT_HEIGHT / 2, vz);
        group.add(vertex);
    }
    
    return group;
}

export function createPyramidOf6To2Octagons(options = {}) {
    const { matWall, matCap } = options;
    const octGroup = new THREE.Group();
    
    for (let i = 0; i < 6; i++) {
        const oct = createOctagon({ matWall, matCap });
        const offsetX = i * OCT_FACE_DIST;
        oct.position.set(offsetX, 0, 0);
        octGroup.add(oct);
    }
    
    for (let i = 0; i < 2; i++) {
        const oct = createOctagon({ matWall, matCap });
        const offsetX = (i + 2) * OCT_FACE_DIST;
        const offsetZ = OCT_FACE_DIST * Math.sin(Math.PI / 4);
        oct.position.set(offsetX, OCT_HEIGHT, offsetZ);
        octGroup.add(oct);
    }
    
    return octGroup;
}
