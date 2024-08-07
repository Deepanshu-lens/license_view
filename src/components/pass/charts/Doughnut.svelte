
  <script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
  
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend, ChartDataLabels);

  
    let canvas;
    let chart;
  
    const createChart = () => {
      if (chart) {
        chart.destroy();
      }
      chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [25, 15, 10, 50],
            backgroundColor: ['#FE768A', '#FF8F6B', '#CB60A0', '#605BFF'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            tooltip: {
              enabled: false
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
  
    // $: if (chart) {
    //   chart.data.datasets[0].data = [activeCameras, inactiveCameras];
    //   chart.update();
    // }
  
    onMount(() => {
        setTimeout(() => {
            createChart();
        }, 1000);
    });
  
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
    display: grid;
    place-items: center;
    padding: 10px;
  }
</style>
  
  <canvas class="xl:max-h-[180px]" bind:this={canvas}></canvas>