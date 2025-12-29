import * as THREE from 'three';

export function exportToDXF(objects, scale) {
    let dxf = '0\nSECTION\n2\nENTITIES\n';
    
    objects.forEach(obj => {
        if (!obj.userData || !obj.userData.type) return;
        const type = obj.userData.type;
        const pos = obj.position;
        const rot = obj.rotation.y;
        
        if (type === 'straight') {
            const len = obj.userData.params.length || 100;
            const sx = pos.x - len / 2 * Math.sin(rot);
            const sz = pos.z - len / 2 * Math.cos(rot);
            const ex = pos.x + len / 2 * Math.sin(rot);
            const ez = pos.z + len / 2 * Math.cos(rot);
            dxf += createDXFLine(sx / scale, sz / scale, ex / scale, ez / scale, 'CARRETERA');
        } else if (type === 'curve') {
            const rad = obj.userData.params.radius || 50;
            const cx = pos.x;
            const cz = pos.z;
            const startAng = rot;
            const endAng = rot + Math.PI / 2;
            dxf += createDXFArc(cx / scale, cz / scale, rad / scale, startAng * 180 / Math.PI, endAng * 180 / Math.PI, 'CARRETERA');
        } else if (type === 'roundabout') {
            const diam = obj.userData.params.diameter || 50;
            dxf += createDXFCircle(pos.x / scale, pos.z / scale, diam / 2 / scale, 'GLORIETA');
        } else if (type === 'octagon') {
            const oct = obj.userData.octagonVertices || [];
            oct.forEach((v, i) => {
                const wp = new THREE.Vector3(v.x, v.y, v.z);
                obj.localToWorld(wp);
                const next = oct[(i + 1) % oct.length];
                const wpNext = new THREE.Vector3(next.x, next.y, next.z);
                obj.localToWorld(wpNext);
                dxf += createDXFLine(wp.x / scale, wp.z / scale, wpNext.x / scale, wpNext.z / scale, 'OCTAGON');
            });
        } else if (type === 'pyramid') {
            dxf += `999\nPYRAMID at (${(pos.x / scale).toFixed(2)}, ${(pos.z / scale).toFixed(2)})\n`;
        } else if (type === 'vehicle') {
            const vx = pos.x / scale;
            const vz = pos.z / scale;
            dxf += createDXFCircle(vx, vz, 0.5, 'VEHICLE');
        } else if (type === 'pylon') {
            const px = pos.x / scale;
            const pz = pos.z / scale;
            const h = (obj.userData.params.height || 30) / scale;
            dxf += createDXFLine(px, pz, px, pz, 'PYLON');
            dxf += `999\nPYLON H=${h.toFixed(2)}m\n`;
        }
    });
    
    dxf += '0\nENDSEC\n0\nEOF\n';
    return dxf;
}

function createDXFLine(x1, y1, x2, y2, layer) {
    return `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(4)}\n20\n${y1.toFixed(4)}\n30\n0.0\n11\n${x2.toFixed(4)}\n21\n${y2.toFixed(4)}\n31\n0.0\n`;
}

function createDXFArc(cx, cy, r, startAng, endAng, layer) {
    return `0\nARC\n8\n${layer}\n10\n${cx.toFixed(4)}\n20\n${cy.toFixed(4)}\n30\n0.0\n40\n${r.toFixed(4)}\n50\n${startAng.toFixed(2)}\n51\n${endAng.toFixed(2)}\n`;
}

function createDXFCircle(cx, cy, r, layer) {
    return `0\nCIRCLE\n8\n${layer}\n10\n${cx.toFixed(4)}\n20\n${cy.toFixed(4)}\n30\n0.0\n40\n${r.toFixed(4)}\n`;
}

export function downloadDXF(content, filename = 'ciudad.dxf') {
    const blob = new Blob([content], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
