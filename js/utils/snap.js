import * as THREE from 'three';

export function findSnapTarget(position, scene, snapDistance, selected) {
    let closest = null;
    let minDist = Infinity;
    
    scene.traverse(obj => {
        if (!obj.userData || !obj.userData.connectorPoints || obj === selected || obj.parent === selected) return;
        const points = obj.userData.connectorPoints;
        points.forEach(pt => {
            const wp = new THREE.Vector3();
            obj.localToWorld(wp.copy(pt));
            const d = position.distanceTo(wp);
            if (d < minDist && d < snapDistance) {
                minDist = d;
                closest = { point: wp, object: obj };
            }
        });
    });
    
    return closest;
}

export function snapToTarget(mesh, snapTarget, angleMatch = false) {
    const localSnap = new THREE.Vector3();
    mesh.worldToLocal(localSnap.copy(snapTarget.point));
    
    const connectorPoints = mesh.userData.connectorPoints;
    if (!connectorPoints || connectorPoints.length === 0) return;
    
    let closestConnector = connectorPoints[0];
    let minDist = Infinity;
    connectorPoints.forEach(cp => {
        const d = localSnap.distanceTo(cp);
        if (d < minDist) {
            minDist = d;
            closestConnector = cp;
        }
    });
    
    const offset = new THREE.Vector3().subVectors(snapTarget.point, mesh.localToWorld(closestConnector.clone()));
    mesh.position.add(offset);
    
    if (angleMatch && snapTarget.object.userData.rotation !== undefined) {
        mesh.rotation.y = snapTarget.object.userData.rotation;
        mesh.userData.rotation = mesh.rotation.y;
    }
}

export function showSnapIndicator(visible) {
    const indicator = document.getElementById('snapMsg');
    if (indicator) {
        indicator.style.opacity = visible ? '1' : '0';
    }
}
