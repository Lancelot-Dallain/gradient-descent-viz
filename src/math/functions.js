import * as THREE from 'three';

export const functions = {
    parabola: {
        name: 'Parabola (x² + y²)',
        f: (x, y) => x * x + y * y,
        grad: (x, y) => new THREE.Vector2(2 * x, 2 * y),
        range: [-2, 2],
        scale: 1
    },
    valleyX: {
        name: 'Valley X (x²)',
        f: (x, y) => x * x,
        grad: (x, y) => new THREE.Vector2(2 * x, 0),
        range: [-2, 2],
        scale: 1
    },
    valleyY: {
        name: 'Valley Y (y²)',
        f: (x, y) => y * y,
        grad: (x, y) => new THREE.Vector2(0, 2 * y),
        range: [-2, 2],
        scale: 1
    },
    rosenbrock: {
        name: 'Rosenbrock',
        f: (x, y) => (Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2)) / 200,
        grad: (x, y) => {
            const dx = (-2 * (1 - x) - 400 * x * (y - x * x)) / 200;
            const dy = (200 * (y - x * x)) / 200;
            return new THREE.Vector2(dx, dy);
        },
        range: [-2, 2],
        scale: 0.5
    },
    saddle: {
        name: 'Saddle Point',
        f: (x, y) => x * x - y * y,
        grad: (x, y) => new THREE.Vector2(2 * x, -2 * y),
        range: [-2, 2],
        scale: 1
    },
    rastrigin: {
        name: 'Rastrigin (Local Minima)',
        // f(x,y) = 10*2 + (x^2 - 10cos(2pi*x)) + (y^2 - 10cos(2pi*y))
        // Scaled for viz
        f: (x, y) => (20 + x * x - 10 * Math.cos(2 * Math.PI * x) + y * y - 10 * Math.cos(2 * Math.PI * y)) / 20,
        grad: (x, y) => {
            const dx = (2 * x + 20 * Math.PI * Math.sin(2 * Math.PI * x)) / 20;
            const dy = (2 * y + 20 * Math.PI * Math.sin(2 * Math.PI * y)) / 20;
            return new THREE.Vector2(dx, dy);
        },
        range: [-2, 2],
        scale: 0.5
    },
    himmelblau: {
        name: 'Himmelblau (Multi-modal)',
        // f(x,y) = (x^2+y-11)^2 + (x+y^2-7)^2
        // Scaled
        f: (x, y) => (Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2)) / 100,
        grad: (x, y) => {
            // df/dx = 2(x^2+y-11)(2x) + 2(x+y^2-7)
            // df/dy = 2(x^2+y-11) + 2(x+y^2-7)(2y)
            const dx = (4 * x * (x * x + y - 11) + 2 * (x + y * y - 7)) / 100;
            const dy = (2 * (x * x + y - 11) + 4 * y * (x + y * y - 7)) / 100;
            return new THREE.Vector2(dx, dy);
        },
        range: [-4, 4],
        scale: 0.2
    },
    cosineWave: {
        name: 'Cosine Wave (x*cos(x))',
        // f(x,y) = 0.5 * (x*cos(x) + y*cos(y))
        f: (x, y) => 0.5 * (x * Math.cos(x) + y * Math.cos(y)),
        grad: (x, y) => {
            // d/dx(x*cos(x)) = cos(x) - x*sin(x)
            const dx = 0.5 * (Math.cos(x) - x * Math.sin(x));
            const dy = 0.5 * (Math.cos(y) - y * Math.sin(y));
            return new THREE.Vector2(dx, dy);
        },
        range: [-6, 6],
        scale: 0.5
    }
};
