import * as THREE from 'three';

export class Optimizer {
    constructor(funcDef) {
        this.funcDef = funcDef;
        this.startPos = new THREE.Vector2(1.5, 1.5);
        this.currentPos = this.startPos.clone();
        this.learningRate = 0.01;
        this.decayType = 'None'; // 'None', 'Inverse', 'Exponential'
        this.decayRate = 0.001;
        this.algorithm = 'GD'; // 'GD' or 'SGD'
        this.history = [];
        this.history.push(this.currentPos.clone());
    }

    setStartPos(x, y) {
        this.startPos.set(x, y);
    }

    reset(funcDef) {
        this.funcDef = funcDef;
        this.currentPos.copy(this.startPos);
        this.clamp(this.currentPos); // Ensure start is valid
        this.history = [this.currentPos.clone()];
    }

    clamp(pos) {
        const min = this.funcDef.range[0];
        const max = this.funcDef.range[1];
        pos.x = Math.max(min, Math.min(max, pos.x));
        pos.y = Math.max(min, Math.min(max, pos.y));
    }

    getEffectiveLearningRate(step) {
        if (this.decayType === 'None') return this.learningRate;
        if (this.decayType === 'Inverse') {
            return this.learningRate / (1 + this.decayRate * step);
        }
        if (this.decayType === 'Exponential') {
            return this.learningRate * Math.exp(-this.decayRate * step);
        }
        return this.learningRate;
    }

    step(noiseX = 0, noiseY = 0) {
        // Calculate gradient at the shifted position
        // We are optimizing f(x + noiseX, y + noiseY)
        const effectiveX = this.currentPos.x + noiseX;
        const effectiveY = this.currentPos.y + noiseY;

        const grad = this.funcDef.grad(effectiveX, effectiveY);

        if (this.algorithm === 'SGD') {
            grad.x += (Math.random() - 0.5) * 2.0;
            grad.y += (Math.random() - 0.5) * 2.0;
        }

        const stepIndex = this.history.length;
        const lr = this.getEffectiveLearningRate(stepIndex);

        // Update position: x = x - lr * grad
        this.currentPos.x -= lr * grad.x;
        this.currentPos.y -= lr * grad.y;

        // Clamp to range
        this.clamp(this.currentPos);

        this.history.push(this.currentPos.clone());

        // Value at current pos on the NOISY surface
        const val = this.funcDef.f(this.currentPos.x + noiseX, this.currentPos.y + noiseY);

        return {
            pos: this.currentPos.clone(),
            grad: grad.clone(),
            val: val,
            lr: lr
        };
    }
}
