# Gradient Descent Visualization

An interactive 3D web application for visualizing Gradient Descent and Stochastic Gradient Descent algorithms in real-time. Watch optimization algorithms navigate complex mathematical landscapes with dynamic visualizations, real-time loss graphs, and educational parameter controls.

![Gradient Descent Visualization](https://img.shields.io/badge/built%20with-Three.js-blue) ![Vite](https://img.shields.io/badge/bundled%20with-Vite-646CFF) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Interactive 3D Visualization**: Real-time 3D rendering of mathematical functions with orbit controls
- **Multiple Test Functions**: Explore various optimization landscapes:
  - Parabola (x² + y²)
  - Rosenbrock Valley
  - Valley X/Y
  - Saddle Point
  - Rastrigin (Local Minima)
  - Himmelblau (Multi-modal)
  - Cosine Wave
- **Gradient Descent Algorithms**: Standard GD with SGD simulation via batch noise
- **Rainbow Path Visualization**: Gradient-colored optimization path with fade effect
- **Zoomable Loss Graph**: Interactive 2D chart showing loss progression over steps
- **Learning Rate Decay**: Inverse and exponential decay options
- **Batch Noise Simulation**: Visualize stochastic behavior with surface "wobbling"
- **Educational Info Modals**: Click 'i' icons for parameter explanations with formulas

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gradient-descent-viz.git
   cd gradient-descent-viz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 🎮 Usage

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Controls

- **Mouse**: Click and drag to rotate the 3D view
- **Scroll**: Zoom in/out on the 3D surface
- **Auto Run**: Toggle to start/stop the optimization animation
- **Reset Position**: Restart from the current start position

## 📊 Parameters Explained

### Function
Select which mathematical function to optimize. Each has different characteristics:
- **Parabola**: Simple convex function (easy convergence)
- **Rosenbrock**: Narrow valley (tests optimizer resilience)
- **Saddle Point**: Non-convex with saddle shape
- **Rastrigin**: Many local minima (challenging)

### Learning Rate (α)
**Formula**: `w_new = w_old - α * gradient`

Controls the step size of the optimizer:
- **Too High** (>1.0): Overshooting, divergence
- **Optimal** (0.01-0.1): Steady convergence
- **Too Low** (<0.001): Very slow progress

### Learning Rate Decay
Reduces learning rate over time for better convergence:
- **None**: Constant learning rate
- **Inverse**: `α_t = α_0 / (1 + decay * t)`
- **Exponential**: `α_t = α_0 * exp(-decay * t)`

### Decay Rate
Controls how quickly the learning rate decreases (0.0001 to 0.1).

### Speed (Steps/s)
Animation speed from 1 to 60 steps per second. Lower values let you observe the path more clearly.

### Batch Noise (Wobble)
**Simulates Stochastic Gradient Descent (SGD)**

Adds random noise to the function evaluation, making the surface "wobble":
- **0.0**: Pure Gradient Descent (smooth)
- **0.5-1.0**: Moderate SGD noise
- **>1.5**: High noise (can escape local minima)

In real Deep Learning, this represents mini-batch sampling noise.

### Start Position
The (x, y) coordinates where optimization begins. Different starting points may lead to different local minima in complex functions.

## 📈 Loss Graph Features

The bottom-left 2D graph shows optimization progress:
- **X-axis**: Iteration/Step number
- **Y-axis**: Loss value (function output)
- **Color**: Rainbow gradient matching the 3D path
- **Zoom**: 
  - Mouse wheel to zoom
  - Hold **Shift** + drag to zoom a specific area
  - Drag to pan

## 🏗️ Project Structure

```
gradient-descent-viz/
├── index.html          # Main HTML entry point
├── style.css           # Global styles
├── package.json        # Dependencies and scripts
├── src/
│   ├── main.js         # Application entry, Three.js setup
│   ├── math/
│   │   └── functions.js    # Mathematical functions and gradients
│   ├── logic/
│   │   └── optimizer.js    # GD/SGD algorithm implementation
│   ├── vis/
│   │   ├── surface.js      # 3D surface mesh generation
│   │   ├── gradient.js     # Path and arrow visualization
│   │   └── chart.js        # Loss graph (Chart.js)
│   └── ui/
│       └── controls.js     # GUI controls (lil-gui)
```

## 🛠️ Technologies Used

- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[lil-gui](https://lil-gui.georgealways.com/)** - Lightweight GUI controls
- **[Chart.js](https://www.chartjs.org/)** - Interactive charts
- **[chartjs-plugin-zoom](https://github.com/chartjs/chartjs-plugin-zoom)** - Chart zoom functionality

## 🎓 Educational Use

This visualization is designed to help understand:
- How gradient descent navigates optimization landscapes
- The impact of learning rate on convergence
- The difference between GD and SGD
- How learning rate decay improves optimization
- Why some functions are harder to optimize than others

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

