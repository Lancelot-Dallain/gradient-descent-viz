import * as THREE from 'three';

export class GradientVis {
    constructor(scene) {
        this.scene = scene;

        // Ball for current position
        const ballGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const ballMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.ball = new THREE.Mesh(ballGeo, ballMat);
        this.scene.add(this.ball);

        // Arrow for gradient
        this.arrowHelper = null;

        // Line for path
        this.pathGeometry = new THREE.BufferGeometry();
        // Use vertexColors to allow per-point coloring
        this.pathMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            linewidth: 2
        });
        this.pathLine = new THREE.Line(this.pathGeometry, this.pathMaterial);
        this.scene.add(this.pathLine);
    }

    update(pos, grad, funcVal) {
        // Update ball position
        // World coords: x -> x, y -> height (z in math), z -> y (y in math)
        // Surface mapping confirmed: World Z = Parameter Y.
        this.ball.position.set(pos.x, funcVal, pos.y);

        // Update arrow
        // Gradient is steepest ascent. Descent is -grad.
        // World Descent: X = -gx, Z = -gy.
        const dir = new THREE.Vector3(-grad.x, 0, -grad.y).normalize();
        const origin = this.ball.position;
        const length = grad.length();
        const hex = 0x00ff00;

        if (this.arrowHelper) {
            this.scene.remove(this.arrowHelper);
        }

        // Only show arrow if gradient is significant
        if (length > 0.001) {
            this.arrowHelper = new THREE.ArrowHelper(dir, origin, Math.min(length, 2), hex);
            this.scene.add(this.arrowHelper);
        }
    }

    updatePath(history, funcDef) {
        const points = [];
        const colors = [];
        const color = new THREE.Color();
        const len = history.length;

        history.forEach((p, i) => {
            const z = funcDef.f(p.x, p.y);
            points.push(new THREE.Vector3(p.x, z + 0.02, p.y));

            // Calculate t from 0 (oldest) to 1 (newest)
            const t = len > 1 ? i / (len - 1) : 1;

            // Rainbow Effect: Hue cycles from 0.6 (Blue) to 0.0 (Red) or similar
            // Let's go from Blue (start) to Red (end) -> 0.6 to 0.0
            // Or user asked for "Rainbow", let's do a full cycle 0 -> 1
            const hue = t * 0.8; // 0 (Red) to 0.8 (Magenta)

            // Fade Effect: Lightness/Intensity
            // Oldest points (t=0) should be faded (darker or transparent look)
            // Newest points (t=1) should be bright
            const lightness = 0.1 + 0.4 * t; // 0.1 (dim) to 0.5 (normal/bright for HSL)

            color.setHSL(hue, 1.0, lightness);
            colors.push(color.r, color.g, color.b);
        });

        this.pathGeometry.setFromPoints(points);
        this.pathGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }
}
