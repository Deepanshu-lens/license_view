
   <script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
  
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend, ChartDataLabels);
  
    export let activeCameras = 0;
    export let inactiveCameras = 0;
  
    let canvas;
    let chart;
  
    const createChart = () => {
      if (chart) {
        chart.destroy();
      }
      chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            // labels: ['Active Cameras', 'Inactive Cameras'],
          datasets: [{
            // hoverOffset: 4,
            data: [activeCameras, inactiveCameras],
            backgroundColor: ['#5B93FF', '#FFD66B'],
            // borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%', 
          plugins: {
            tooltip: {
                enabled :false
            },
            datalabels: {
                color: '#000',
                backgroundColor: '#fff', 
                borderRadius: 999, 
                padding: 6,
                borderColor: 'black',
                borderWidth: 1.5,
                height: '20px',
                width: '20px',
                font: {
                  weight: 'bold',
                  size: 10
                },
                formatter: (value, context) => {
                  return value;
                }
            }
          }
        }
      });
    };
  
    onMount(() => {
      createChart();
    });
  
    $: if (canvas) {
      createChart();
    }
  
    onDestroy(() => {
      if (chart) {
        chart.destroy();
      }
    });
  </script>
  
  <style>
    canvas {
      width: 100%;
      height: 100%;
    }
  </style>
  
  <canvas bind:this={canvas}></canvas>