export function serializeScene(objects) {
    const data = [];
    objects.forEach(obj => {
        if (!obj.userData || !obj.userData.type) return;
        const item = {
            type: obj.userData.type,
            position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
            rotation: obj.rotation.y,
            params: obj.userData.params || {}
        };
        data.push(item);
    });
    return JSON.stringify(data, null, 2);
}

export function saveSceneToFile(json, filename = 'escena.json') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function loadSceneFromFile(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const data = JSON.parse(evt.target.result);
                callback(data);
            } catch (err) {
                console.error('Error al cargar escena:', err);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
