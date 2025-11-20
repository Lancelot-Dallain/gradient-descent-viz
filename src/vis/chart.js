// Loss Chart Visualization
export class LossChart {
    constructor() {
        const ctx = document.getElementById('loss-chart').getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Loss (Z)',
                    data: [],
                    borderColor: function (context) {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) {
                            return null;
                        }

                        // Create gradient matching the 3D path (Rainbow + Fade)
                        const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);

                        // Add stops to approximate the HSL transition
                        // t goes from 0 to 1
                        // Hue: t * 0.8 (0 to 288 degrees)
                        // Lightness: 0.1 + 0.4 * t (10% to 50%)
                        const steps = 10;
                        for (let i = 0; i <= steps; i++) {
                            const t = i / steps;
                            const hue = (t * 0.8) * 360; // Convert 0-1 to degrees
                            const lightness = (0.1 + 0.4 * t) * 100;
                            gradient.addColorStop(t, `hsl(${hue}, 100%, ${lightness}%)`);
                        }

                        return gradient;
                    },
                    tension: 0.1,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        type: 'linear', // Ensure numerical scaling for zoom
                        title: {
                            display: true,
                            text: 'Step',
                            color: '#aaa'
                        },
                        ticks: { color: '#aaa' },
                        grid: { color: '#333' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Loss',
                            color: '#aaa'
                        },
                        ticks: { color: '#aaa' },
                        grid: { color: '#333' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    },
                    zoom: {
                        zoom: {
                            wheel: {
                                enabled: true,
                                speed: 0.1,
                            },
                            pinch: {
                                enabled: true
                            },
                            drag: {
                                enabled: true,
                                modifierKey: 'shift', // Hold Shift and drag to zoom a box
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgb(75, 192, 192)',
                                borderWidth: 1
                            },
                            mode: 'xy',
                        },
                        pan: {
                            enabled: true,
                            mode: 'xy',
                        },
                        limits: {
                            x: { min: 0 },
                        }
                    }
                }
            }
        });
        this.minLoss = Infinity;
        this.maxLoss = -Infinity;
    }

    update(iteration, loss) {
        this.chart.data.labels.push(iteration);
        this.chart.data.datasets[0].data.push(loss);

        // Update min/max trackers
        if (loss < this.minLoss) this.minLoss = loss;
        if (loss > this.maxLoss) this.maxLoss = loss;

        // Update zoom limits to constrain dezoom to data range
        this.chart.options.plugins.zoom.limits.y = {
            min: this.minLoss,
            max: this.maxLoss
        };

        // Limit data points to keep performance up
        if (this.chart.data.labels.length > 1000) {
            this.chart.data.labels.shift();
            this.chart.data.datasets[0].data.shift();
        }

        this.chart.update('none'); // 'none' mode for performance
    }

    reset() {
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.minLoss = Infinity;
        this.maxLoss = -Infinity;
        // Reset limits
        this.chart.options.plugins.zoom.limits.y = { min: null, max: null };
        this.chart.update();
        this.chart.resetZoom();
    }
}
