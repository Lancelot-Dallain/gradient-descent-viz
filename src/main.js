import '../style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { functions } from './math/functions.js'
import { Surface } from './vis/surface.js'
import { Optimizer } from './logic/optimizer.js'
import { GradientVis } from './vis/gradient.js'
import { Controls } from './ui/controls.js'
import { LossChart } from './vis/chart.js'

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 4, 4);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// App State
let currentFunc = functions.parabola;
const optimizer = new Optimizer(currentFunc);
const surface = new Surface(scene, currentFunc);
const gradientVis = new GradientVis(scene);
const lossChart = new LossChart();

// UI
const uiControls = new Controls(optimizer, surface, () => {
  currentFunc = functions[uiControls.params.function];
  optimizer.reset(currentFunc);
  lossChart.reset();
  iteration = 0;

  // Initial update
  const startState = {
    pos: optimizer.currentPos,
    grad: currentFunc.grad(optimizer.currentPos.x, optimizer.currentPos.y),
    val: currentFunc.f(optimizer.currentPos.x, optimizer.currentPos.y)
  };
  gradientVis.update(startState.pos, startState.grad, startState.val);
  gradientVis.updatePath(optimizer.history, currentFunc);
  updateInfo(0, startState.val);
  lossChart.update(0, startState.val);
});

// HTML Overlay
const iterEl = document.getElementById('iter-count');
const valEl = document.getElementById('current-val');

function updateInfo(iter, val) {
  iterEl.innerText = iter;
  valEl.innerText = val.toFixed(5);
}

// Animation Loop
let iteration = 0;
let lastStepTime = 0;
let wasRunning = false;

function animate(time) {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);

  if (uiControls.params.running) {
    const stepInterval = 1000 / uiControls.params.speed;

    if (time - lastStepTime > stepInterval) {
      lastStepTime = time;

      // 1. Generate Batch Noise (Wobble)
      let noiseX = 0;
      let noiseY = 0;
      if (uiControls.params.batchNoise > 0) {
        noiseX = (Math.random() - 0.5) * uiControls.params.batchNoise * 2;
        noiseY = (Math.random() - 0.5) * uiControls.params.batchNoise * 2;

        // Update Surface to show the "noisy batch"
        surface.updateVertices(optimizer.funcDef, noiseX, noiseY);
      } else {
        // Reset surface if no noise
        surface.updateVertices(optimizer.funcDef, 0, 0);
      }

      // 2. Step Optimizer with the noisy function
      const result = optimizer.step(noiseX, noiseY);

      // 3. Update Visualization
      gradientVis.update(result.pos, result.grad, result.val);
      gradientVis.updatePath(optimizer.history, optimizer.funcDef);

      iteration++;
      updateInfo(iteration, result.val);
      lossChart.update(iteration, result.val);
    }
  } else if (wasRunning) {
    // Reset surface to noiseless state when stopped
    surface.updateVertices(optimizer.funcDef, 0, 0);
  }

  wasRunning = uiControls.params.running;
}

// Initial Draw
const startState = {
  pos: optimizer.currentPos,
  grad: currentFunc.grad(optimizer.currentPos.x, optimizer.currentPos.y),
  val: currentFunc.f(optimizer.currentPos.x, optimizer.currentPos.y)
};
gradientVis.update(startState.pos, startState.grad, startState.val);

animate(0);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
