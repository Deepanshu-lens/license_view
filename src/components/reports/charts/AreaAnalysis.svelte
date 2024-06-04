<script>
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  export let NvrData;
  export let uniqueCams;

  // console.log(NvrData)
  // console.log(uniqueCams)

  NvrData = NvrData.map((nvr) => {
    const matchingCams = uniqueCams.filter((cam) => cam.url.includes(nvr.ip));
    return { ...nvr, cams: matchingCams };
  });

  console.log(NvrData);

  const nvrDataset = {
    labels: NvrData.map((nvr) => nvr.expand?.ip_address?.location).filter(
      (location) => location !== undefined,
    ),
    dataSet: [
      {
        label: "active cams",
        data: NvrData.filter(
          (nvr) => nvr.expand?.ip_address?.location !== undefined,
        ).map((nvr) =>
          nvr.cams ? nvr.cams.filter((cam) => cam.status).length : 0,
        ),
        backgroundColor: "rgba(153, 162, 251, 1)",
        stack: 'Stack 0',
        barThickness: 30,
    },
    {
        label: "inactive cams",
        data: NvrData.filter(
            (nvr) => nvr.expand?.ip_address?.location !== undefined,
            ).map((nvr) =>
            nvr.cams ? nvr.cams.filter((cam) => !cam.status).length : 0,
            ),
            backgroundColor: "rgba(219, 222, 251, 1)",
            stack: 'Stack 0',
            barThickness: 30,
      },
    ],
  };

  // let graphData = NvrData.map((record) => ({
  //     name: record.name,
  //     region: record?.expand.ip_address?.region,
  //     location: record?.expand.ip_address?.location,

//   console.log(nvrDataset);

  // }))

  Chart.register(...registerables);

  let canvas;
  let chart;

  const data = {
    labels: nvrDataset.labels,
    datasets: nvrDataset.dataSet
  };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: false,
//         text: "Stacked Bar Chart",
//       },
//     },
//     scales: {
//       x: {
//         stacked: false,
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         stacked: true,
//         beginAtZero: true,
//         grid: {
//           display: false,
//         },
//       },
//     },
//     elements: {
//       bar: {
//         borderRadius: 10,
//         borderWidth: 1,
//       },
//     },
//   };

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Stacked Bar Chart",
    },
  },
  scales: {
    x: {
      stacked: false,
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: 'Locations',
        color: '#111',
        font: {
          size: 14,
          weight: 500,
        },
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: 'Number of Cameras ->',
        color: '#111',
        font: {
          size: 14,
          weight: 500,
        },
      },
      ticks: {
        stepSize: 1, 
        precision: 0, 
      }
    },
  },
  elements: {
    bar: {
      borderRadius: 10,
      borderWidth: 1,
    },
  },
};

  onMount(() => {
    const ctx = canvas.getContext("2d");
    chart = new Chart(ctx, {
      type: "bar",
      data,
      options,
    });

    return () => {
      chart.destroy();
    };
  });
</script>

<div>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  div {
    width: 100%;
    height: 400px;
  }
</style>
