import * as THREE from 'three';

export class Surface {
    constructor(scene, funcDef) {
        this.scene = scene;
        this.mesh = null;
        this.updateFunction(funcDef);
    }

    updateFunction(funcDef) {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            // Dispose children of the group
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }

        this.funcDef = funcDef;
        const range = funcDef.range;
        const segments = 100;
        const geometry = new THREE.PlaneGeometry(range[1] - range[0], range[1] - range[0], segments, segments);

        const count = geometry.attributes.position.count;
        const colors = [];
        const color = new THREE.Color();
        const min = funcDef.range[0];
        const max = funcDef.range[1];
        const rangeVal = max - min || 1;

        // Adjust vertices based on function value
        for (let i = 0; i < count; i++) {
            const x = geometry.attributes.position.getX(i);
            const y = geometry.attributes.position.getY(i);

            // Fix: After rotation (-90 deg X), Local Y becomes World -Z.
            // We want World Z to correspond to Parameter Y.
            // So we need Parameter Y = -Local Y.
            // So we calculate f(x, -y).

            const z = funcDef.f(x, -y);
            geometry.attributes.position.setZ(i, z);

            // Simple coloring based on height
            const t = (z - min) / rangeVal;
            color.setHSL((1 - t) * 0.7, 1, 0.5);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();

        // Solid Material
        const materialSolid = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            vertexColors: true,
            metalness: 0.1,
            roughness: 0.5,
            wireframe: false,
            transparent: true,
            opacity: 0.8
        });

        // Wireframe Material
        const materialWire = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        this.mesh = new THREE.Group();

        const solidMesh = new THREE.Mesh(geometry, materialSolid);
        const wireMesh = new THREE.Mesh(geometry, materialWire);

        // Rotate both
        solidMesh.rotation.x = -Math.PI / 2;
        wireMesh.rotation.x = -Math.PI / 2;

        // Lift wireframe slightly to avoid z-fighting
        wireMesh.position.y = 0.001;

        this.mesh.add(solidMesh);
        this.mesh.add(wireMesh);

        this.scene.add(this.mesh);
    }

    updateVertices(funcDef, offsetX, offsetY) {
        if (!this.mesh) return;

        // We need to iterate over children because this.mesh is a Group
        this.mesh.children.forEach(child => {
            if (child.isMesh) {
                const geometry = child.geometry;
                const count = geometry.attributes.position.count;
                const color = new THREE.Color();
                const min = funcDef.range[0]; // Approximation for color scaling
                const max = funcDef.range[1];
                const range = max - min || 1;

                for (let i = 0; i < count; i++) {
                    const x = geometry.attributes.position.getX(i);
                    const y = geometry.attributes.position.getY(i);

                    // Apply offset to the function evaluation
                    // The visual Y is the math -Z (or parameter Y)
                    // We want to shift the function: f(x + dx, y + dy)
                    // But wait, our coordinate system is weird.
                    // Geometry X = Math X
                    // Geometry Y = Math -Y (Parameter Y inverted)
                    // So Math Y = -Geometry Y

                    const mathX = x + offsetX;
                    const mathY = -y + offsetY;

                    const z = funcDef.f(mathX, mathY);
                    geometry.attributes.position.setZ(i, z);

                    // Color
                    const t = (z - min) / range;
                    color.setHSL((1 - t) * 0.7, 1, 0.5);
                    geometry.attributes.color.setXYZ(i, color.r, color.g, color.b);
                }
                geometry.attributes.position.needsUpdate = true;
                geometry.attributes.color.needsUpdate = true;
                geometry.computeVertexNormals();
            }
        });
    }
}
