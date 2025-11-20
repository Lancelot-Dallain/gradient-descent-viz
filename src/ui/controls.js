import GUI from 'lil-gui';
import { functions } from '../math/functions.js';

export class Controls {
    constructor(optimizer, surface, onReset) {
        this.optimizer = optimizer;
        this.surface = surface;
        this.onReset = onReset;

        this.gui = new GUI();
        this.params = {
            function: 'parabola', // Default matches main.js
            learningRate: 0.01,
            decayType: 'None',
            decayRate: 0.001,
            algorithm: 'GD',
            speed: 60, // Steps per second
            batchNoise: 0.0, // Magnitude of function shift
            startX: 1.5,
            startY: 1.5,
            running: false,
            reset: () => this.handleReset()
        };

        this.setupModal();
        this.setupGUI();
    }

    setupModal() {
        this.modal = document.getElementById('info-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');
        this.closeBtn = document.querySelector('.close-button');

        if (this.closeBtn) {
            this.closeBtn.onclick = () => {
                this.modal.classList.add('hidden');
            };
        }

        window.onclick = (event) => {
            if (event.target == this.modal) {
                this.modal.classList.add('hidden');
            }
        };

        this.infoContent = {
            learningRate: {
                title: "Learning Rate (α)",
                html: `
                    <p>The <strong>Learning Rate</strong> determines the size of the steps the optimizer takes.</p>
                    <p>Formula: <code>w_new = w_old - α * gradient</code></p>
                    <ul>
                        <li><strong>Too High:</strong> The optimizer might overshoot the minimum and diverge.</li>
                        <li><strong>Too Low:</strong> Convergence will be very slow.</li>
                    </ul>
                `
            },
            decayType: {
                title: "Learning Rate Decay",
                html: `
                    <p><strong>Decay</strong> reduces the learning rate over time to help the optimizer settle into the minimum without oscillating.</p>
                    <ul>
                        <li><strong>None:</strong> Constant learning rate.</li>
                        <li><strong>Inverse:</strong> <code>α_t = α_0 / (1 + decay * t)</code></li>
                        <li><strong>Exponential:</strong> <code>α_t = α_0 * exp(-decay * t)</code></li>
                    </ul>
                `
            },
            decayRate: {
                title: "Decay Rate",
                html: `
                    <p>Controls how quickly the learning rate decreases over time.</p>
                    <p>A higher decay rate means the step size shrinks faster.</p>
                `
            },
            speed: {
                title: "Simulation Speed",
                html: `
                    <p>Controls how many optimization steps are performed per second.</p>
                    <p>Adjust this to slow down the animation and observe the path more clearly.</p>
                `
            },
            batchNoise: {
                title: "Batch Noise (SGD Simulation)",
                html: `
                    <p>Simulates <strong>Stochastic Gradient Descent (SGD)</strong> by adding random noise to the function evaluation.</p>
                    <p>In real Deep Learning, we calculate gradients on small "mini-batches" of data, which creates a noisy estimate of the true gradient.</p>
                    <p>This noise can help escape local minima (like in the Rastrigin function).</p>
                `
            },
            startX: {
                title: "Start Position",
                html: `
                    <p>The starting coordinates <code>(x, y)</code> of the optimizer.</p>
                    <p>Different starting points can lead to different local minima in complex functions.</p>
                `
            }
        };
    }

    addInfoIcon(controller, key) {
        if (!this.infoContent[key]) return;

        const domElement = controller.domElement;
        const icon = document.createElement('span');
        icon.className = 'info-icon';
        icon.innerText = 'i';
        icon.title = 'More Info';

        icon.onclick = (e) => {
            e.stopPropagation();
            this.showInfo(key);
        };

        // Append to the name/label container if possible, or just the row
        // lil-gui structure: .name, .widget
        const nameEl = domElement.parentElement.querySelector('.name');
        if (nameEl) {
            nameEl.appendChild(icon);
        }
    }

    showInfo(key) {
        const content = this.infoContent[key];
        if (content) {
            this.modalTitle.innerText = content.title;
            this.modalBody.innerHTML = content.html;
            this.modal.classList.remove('hidden');
        }
    }

    setupGUI() {
        this.gui.add(this.params, 'function', Object.keys(functions)).onChange(val => {
            const func = functions[val];
            this.surface.updateFunction(func);

            // Update slider ranges
            const range = func.range;
            this.startXCtrl.min(range[0]).max(range[1]);
            this.startYCtrl.min(range[0]).max(range[1]);

            // Clamp current values to new range
            this.params.startX = Math.max(range[0], Math.min(range[1], this.params.startX));
            this.params.startY = Math.max(range[0], Math.min(range[1], this.params.startY));

            this.startXCtrl.updateDisplay();
            this.startYCtrl.updateDisplay();

            // Update optimizer with clamped values
            this.optimizer.setStartPos(this.params.startX, this.params.startY);

            this.handleReset();
        });

        const lrCtrl = this.gui.add(this.params, 'learningRate', 0.001, 5).onChange(val => {
            this.optimizer.learningRate = val;
        });
        this.addInfoIcon(lrCtrl, 'learningRate');

        const folderDecay = this.gui.addFolder('Learning Rate Decay');
        const decayTypeCtrl = folderDecay.add(this.params, 'decayType', ['None', 'Inverse', 'Exponential']).onChange(val => {
            this.optimizer.decayType = val;
        });
        this.addInfoIcon(decayTypeCtrl, 'decayType');

        const decayRateCtrl = folderDecay.add(this.params, 'decayRate', 0.0001, 0.1).onChange(val => {
            this.optimizer.decayRate = val;
        });
        this.addInfoIcon(decayRateCtrl, 'decayRate');

        const folderSim = this.gui.addFolder('Simulation Settings');
        const speedCtrl = folderSim.add(this.params, 'speed', 1, 60).name('Speed (Steps/s)');
        this.addInfoIcon(speedCtrl, 'speed');

        const noiseCtrl = folderSim.add(this.params, 'batchNoise', 0, 2.0).name('Batch Noise (Wobble)');
        this.addInfoIcon(noiseCtrl, 'batchNoise');

        const folderStart = this.gui.addFolder('Start Position');
        this.startXCtrl = folderStart.add(this.params, 'startX', -2, 2).name('X (a)').onChange(() => this.updateStartPos());
        this.addInfoIcon(this.startXCtrl, 'startX');

        this.startYCtrl = folderStart.add(this.params, 'startY', -2, 2).name('Y (b)').onChange(() => this.updateStartPos());
        // Share info for Start Y

        this.gui.add(this.params, 'running').name('Auto Run');
        this.gui.add(this.params, 'reset').name('Reset Position');
    }

    updateStartPos() {
        this.optimizer.setStartPos(this.params.startX, this.params.startY);
        this.handleReset();
    }

    handleReset() {
        this.onReset();
    }
}
