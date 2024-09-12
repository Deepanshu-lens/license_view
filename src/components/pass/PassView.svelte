<script lang="ts">
  import { events, selectedNode } from "@/lib/stores";
  import {
    Bell,
    ChevronRight,
    DoorClosed,
    Expand,
    Filter,
    LayoutDashboard,
    Monitor,
    Plus,
    ScanEye,
    ScanFace,
    ScrollText,
    Search,
    Settings,
    Upload,
    Users,
    TrendingUp,
    Wallet,
    GaugeCircle,
    HandCoins,
    Ticket,
    MoreVertical,
    Building,
    QrCodeIcon,
  } from "lucide-svelte";
  import * as Select from "@/components/ui/select";
  import Button from "../ui/button/button.svelte";
  import VipTicketCard from "../cards/VipTicketCard.svelte";

  import { BarController, BarElement } from "chart.js";

  /**
   * VIEW NAMES
   * 1.Dashboard
   * 2.Gate Management
   * 3.Visitor Tracking
   * 4.Alerts
   * 5.Payment Details
   * 6.Users Pass
   * 7.Logs
   * 8.Manange Passes
   */

  let permissions = {
    admin: [1, 2, 3, 4, 5, 6, 7],
    superAdmin: [1, 6, 8, 2, 3, 4, 5, 7],
    operator: [8, 2, 3, 4, 5, 7],
  };
  let userRole: "admin" | "operator" | "superAdmin";
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];

  export let data;

  let showRightPanel = true;
  let isAllFullScreen = false;
  let view = 1;

  $: console.log(userRole);

  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
  } from "chart.js";
  import { onDestroy, onMount } from "svelte";
  import Doughnut from "./charts/Doughnut.svelte";
  import PaymentDetails from "./sections/PaymentDetails.svelte";
  import Alerts from "./sections/Alerts.svelte";
  import VisitorTracking from "./sections/VisitorTracking.svelte";
  import GateManagement from "./sections/GateManagement.svelte";
  import Logs from "./sections/Logs.svelte";
  import UsersPass from "./sections/UsersPass.svelte";
  import ManagePasses from "./sections/manage-passes.svelte";

  let barChartCanvas: HTMLCanvasElement;
  let barChart: Chart | null = null;
  let chartLoading: boolean = true;

  function createBarChart() {
    if (barChartCanvas && !barChart) {
      const ctx = barChartCanvas.getContext("2d");

      if (ctx) {
        Chart.register(BarController, BarElement, CategoryScale, LinearScale);

        barChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Gate 1", "Gate 2", "Gate 3", "Gate 4", "Gate 5"],
            datasets: [
              {
                label: "Entries",
                data: [51, 34, 28, 41, 52],
                backgroundColor: "#99A2FB",
                borderRadius: 5,
              },
              {
                label: "Exits",
                data: [19, 13, 12, 17, 19],
                backgroundColor: "#DBDEFB",
                borderRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                max: 75,
                ticks: {
                  stepSize: 25,
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  },
                },
              },
            },
            //   barPercentage: 0.6,  // Adjust this value to make bars thinner
            categoryPercentage: 0.3, // Adjust this value to control spacing between groups
          },
        });
      }
    }
  }

  onMount(() => {
    chartLoading = false;
    setTimeout(() => {
      createBarChart();
    }, 100);
    userRole = data.user.role; // Restrict userRole to specific keys
  });

  onDestroy(() => {
    if (barChart) {
      barChart.destroy();
    }
  });
</script>

<main class="flex h-[calc(100vh-75px)] text-black">
  <section
    class={"w-full h-[calc(100vh-76px)] hidden sm:flex items-start relative z-10"}
  >
    {#if view === 1 || view === 2 || view === 4}
      <button
        id="chevron"
        on:click={() => (showRightPanel = !showRightPanel)}
        class={`absolute right-0 py-1 rounded-l-md bg-[#f9f9f9] dark:bg-slate-800 top-1/2 -translate-y-1/2 shadow-md transition-position ease-in-out duration-500 z-[99999]`}
      >
        <ChevronRight
          class={`${showRightPanel ? "rotate-0" : "rotate-180"} transition-transform ease-in-out duration-700`}
        />
      </button>
    {/if}
    {#if view === 1}
      <div class="p-4 h-full w-full flex-col">
        <div class="flex items-center justify-between">
          <span class="flex flex-col gap-1">
            <p class="text-black font-semibold text-xl dark:text-white">
              Live Alerts
            </p>
            <p class="text-black/[.5] text-base">
              Live alerts are events that are currently happening in the system.
            </p>
          </span>
          <span class="flex items-center gap-3">
            <Select.Root portal={null}>
              <Select.Trigger
                class="w-[180px] border-solid border-[#015a62] border-[1px] text-[#015a62]"
              >
                <Select.Value placeholder="For last 7 days" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  {#each fruits as fruit}
                    <Select.Item value={fruit.value} label={fruit.label}
                      >{fruit.label}</Select.Item
                    >
                  {/each}
                </Select.Group>
              </Select.Content>
              <Select.Input name="favoriteFruit" />
            </Select.Root>
            <Button
              variant="outline"
              class="border-[#015a62] text-[#015a62] flex gap-1 items-center"
            >
              <Upload size={20} />
              Export Report
            </Button>
          </span>
        </div>
        <div
          class="grid grid-cols-8 grid-rows-8 gap-4 h-full w-full pb-14 pt-4"
        >
          <div
            class="rounded-lg col-span-4 row-span-4 grid grid-cols-2 grid-rows-2 gap-2"
          >
            <span
              class="rounded-lg col-span-1 row-span-1 relative cardShad p-4"
            >
              <span
                class="grid place-content-center size-[45px] rounded-lg text-[#605BFF] bg-[#8280FF]/20 absolute right-4 top-4"
              >
                <GaugeCircle size={26} />
              </span>
              <p class="text-[#202224] text-lg">Total Pass Sold</p>
              <p class="text-2xl font-semibold mt-2">300</p>
              <p
                class="text-[#00B69B] text-sm whitespace-nowrap mt-6 flex items-center gap-1"
              >
                <TrendingUp class="size-5" /> 2 new
                <span class="text-[#606060]"> ticlets sold!</span>
              </p>
            </span>
            <span
              class="rounded-lg col-span-1 row-span-1 relative cardShad p-4"
            >
              <span
                class="grid place-content-center size-[45px] rounded-lg text-[#FE768A] bg-[#FE768A]/20 absolute right-4 top-4"
              >
                <HandCoins size={26} />
              </span>
              <p class="text-[#202224] text-lg">Daily Revenue</p>
              <p class="text-2xl font-semibold mt-2">300</p>
              <p
                class="text-[#00B69B] text-sm whitespace-nowrap mt-6 flex items-center gap-1"
              >
                <TrendingUp class="size-5" /> 2 new
                <span class="text-[#606060]"> increase than yesterday!</span>
              </p>
            </span>
            <span
              class="rounded-lg col-span-1 row-span-1 relative cardShad p-4"
            >
              <span
                class="grid place-content-center size-[45px] rounded-lg text-[#FF8F6B] bg-[#FF8F6B]/20 absolute right-4 top-4"
              >
                <Ticket size={26} />
              </span>
              <p class="text-[#202224] text-lg">Average Ticket Price</p>
              <p class="text-2xl font-semibold mt-2">300</p>
              <p
                class="text-[#00B69B] text-sm whitespace-nowrap mt-6 flex items-center gap-1"
              >
                <TrendingUp class="size-5" /> 2 new
                <span class="text-[#606060]"> increase than yesterday!</span>
              </p>
            </span>
            <span
              class="rounded-lg col-span-1 row-span-1 relative cardShad p-4"
            >
              <span
                class="grid place-content-center size-[45px] rounded-lg text-[#CB60A0] bg-[#CB60A0]/20 absolute right-4 top-4"
              >
                <Users size={26} />
              </span>
              <p class="text-[#202224] text-lg">Active Visitors</p>
              <p class="text-2xl font-semibold mt-2">300</p>
              <p
                class="text-[#00B69B] text-sm whitespace-nowrap mt-6 flex items-center gap-1"
              >
                <TrendingUp class="size-5" /> 2 new
                <span class="text-[#606060]"> increase than yesterday!</span>
              </p>
            </span>
          </div>
          <div
            class="rounded-lg col-span-4 row-span-4 border p-4 flex flex-col"
          >
            <div class="flex items-center justify-between">
              <p class="text-black font-medium text-lg">Real-time Tracking</p>
              <span class="flex items-center gap-2">
                <Select.Root portal={null}>
                  <Select.Trigger
                    class="w-[180px] border-solid border-[#015a62] border-[1px] text-[#000000]"
                  >
                    <Select.Value placeholder="Sort By: Gate" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>Fruits</Select.Label>
                      {#each fruits as fruit}
                        <Select.Item value={fruit.value} label={fruit.label}
                          >{fruit.label}</Select.Item
                        >
                      {/each}
                    </Select.Group>
                  </Select.Content>
                  <Select.Input name="favoriteFruit" />
                </Select.Root>
                <MoreVertical size={20} class="text-black" />
              </span>
            </div>
            <span class="flex items-center justify-start gap-3">
              <span class="flex gap-1 items-center text-xs text-[#030229]"
                ><span class="bg-[#99A2FB] size-3 rounded-full flex shrink-0" />
                Entries</span
              >
              <span class="flex gap-1 items-center text-xs text-[#030229]"
                ><span class="bg-[#DBDEFB] size-3 rounded-full flex shrink-0" />
                Exits</span
              >
            </span>
            <span class="h-full w-full">
              {#if !chartLoading}
                <canvas bind:this={barChartCanvas} />
              {/if}
            </span>
          </div>
          <div
            class="rounded-lg col-span-4 row-span-4 border p-4 flex-col max-h-[300px] overflow-y-auto"
          >
            <span class="text-[#323232] font-medium text-lg"
              >Recent VIP Passes</span
            >
            <div class="flex flex-wrap gap-4 py-2">
              {#each Array(4) as _, i}
                <VipTicketCard />
              {/each}
            </div>
          </div>
          <div
            class="rounded-lg col-span-4 row-span-4 border flex justify-between p-4 flex-col"
          >
            <div>
              <span class="text-lg text-[#323232] font-medium"
                >Payment Methods</span
              >
            </div>
            <div class="flex items-center justify-between h-full">
              <div class="h-full w-1/2">
                <Doughnut />
              </div>
              <div class="h-full w-1/2 flex flex-col gap-4">
                <span class="flex items-center gap-3">
                  <span
                    class="size-[32px] rounded-md bg-[#8280FF]/20 grid place-items-center text-[#CB60A0]"
                  >
                    <Building size={20} />
                  </span>
                  <span class="flex flex-col">
                    <span class="text-black font-medium text-sm">Online</span>
                    <span
                      class="flex items-center text-semibold text-xs gap-1 text-[#00B69B]"
                      ><p class="flex items-center gap-1">
                        <TrendingUp size={18} /> 10 new
                      </p>
                      <p class="text-black">payments!</p></span
                    >
                  </span>
                </span>
                <span class="flex items-center gap-3">
                  <span
                    class="size-[32px] rounded-md bg-[#8280FF]/20 grid place-items-center text-[#CB60A0]"
                  >
                    <Building size={20} />
                  </span>
                  <span class="flex flex-col">
                    <span class="text-black font-medium text-sm">Online</span>
                    <span
                      class="flex items-center text-semibold text-xs gap-1 text-[#00B69B]"
                      ><p class="flex items-center gap-1">
                        <TrendingUp size={18} /> 10 new
                      </p>
                      <p class="text-black">payments!</p></span
                    >
                  </span>
                </span>
                <span class="flex items-center gap-3">
                  <span
                    class="size-[32px] rounded-md bg-[#8280FF]/20 grid place-items-center text-[#CB60A0]"
                  >
                    <Building size={20} />
                  </span>
                  <span class="flex flex-col">
                    <span class="text-black font-medium text-sm">Online</span>
                    <span
                      class="flex items-center text-semibold text-xs gap-1 text-[#00B69B]"
                      ><p class="flex items-center gap-1">
                        <TrendingUp size={18} /> 10 new
                      </p>
                      <p class="text-black">payments!</p></span
                    >
                  </span>
                </span>
                <span class="flex items-center gap-3">
                  <span
                    class="size-[32px] rounded-md bg-[#8280FF]/20 grid place-items-center text-[#CB60A0]"
                  >
                    <Building size={20} />
                  </span>
                  <span class="flex flex-col">
                    <span class="text-black font-medium text-sm">Online</span>
                    <span
                      class="flex items-center text-semibold text-xs gap-1 text-[#00B69B]"
                      ><p class="flex items-center gap-1">
                        <TrendingUp size={18} /> 10 new
                      </p>
                      <p class="text-black">payments!</p></span
                    >
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else if view === 2}
      <GateManagement />
    {:else if view === 3}
      <VisitorTracking />
    {:else if view === 4}
      <Alerts {data} />
    {:else if view === 5}
      <PaymentDetails />
    {:else if view === 6}
      <UsersPass />
    {:else if view === 8}
      <ManagePasses />
    {:else}
      <Logs />
    {/if}
  </section>

  {#if view === 1 || view === 2 || view === 4}
    <section
      id="infopanel"
      class={`h-full border-solid 
         border-x-[1px] flex-shrink-0
         transition-width ease-in-out duration-500 overflow-y-scroll z-[998] hide-scrollbar
        ${showRightPanel ? "w-1/4" : "w-0"} relative max-w-72`}
    >
      <span
        class="flex items-center justify-between p-4 border-b border-black/[.1]"
      >
        <p class="text-black font-semibold text-base dark:text-white">
          Live Alerts
        </p>
        <span class="flex items-center gap-2">
          <span
            class="rounded-full size-6 bg-[#f9f9f9] text-[#727272] grid place-items-center"
          >
            <Filter size={16} />
          </span>
          <span
            class="rounded-full size-6 bg-[#f9f9f9] text-[#727272] grid place-items-center"
          >
            <Settings size={16} />
          </span>
        </span>
      </span>
      <ul class="overflow-y-scroll h-[calc(100vh-135px)] no-scrollbar">
        {#if $events.length > 0}
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          {#each $events as event}
            {@const date = new Date(event.created)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li class="w-full fade-in-15 transition-all duration-200">
              <article
                class={`relative items-center gap-2 mx-2 my-4 p-2
          flex bg-[#f9f9f9] dark:bg-black
          rounded-xl shadow-md text-base border 
          ${isAllFullScreen ? "bg-black text-white " : "hover:scale-[1.01] dark:shadow-slate-800 hover:shadow-lg "}
        `}
              >
                <img
                  class="object-cover w-[75px] h-[75px] rounded-md flex-shrink-0"
                  src={"data:image/jpeg;base64," + event.frameImage}
                  alt="Team Member"
                />
                <div class="w-full">
                  <h3 class={"font-semibold text-sm"}>
                    {event.title}
                  </h3>
                  <p class={"text-xs text-black/.7"}>
                    Camera {$selectedNode?.camera.find(
                      (c) => c.id === event.camera,
                    )?.name}
                  </p>
                  <span
                    class="flex items-center justify-between border-b border-solid border-[#1c1c1c]/.1 gap-2 w-full"
                  >
                    <p class="text-[10px] text-[#D28E3D] font-medium">
                      {event.matchScore !== 0 &&
                      event.matchScore !== undefined &&
                      event.matchScore !== null
                        ? `Match Score : ${event?.matchScore.toFixed(3)}`
                        : "No matches found"}
                    </p>
                    <p class="text-[10px] font-semibold">
                      {event?.score.toFixed(3)}
                    </p>
                  </span>
                  <span class="flex items-center justify-between gap-2">
                    <p class={"text-[10px]"}>
                      {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p class={"text-[10px]"}>
                      {date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </span>
                </div>
              </article>
            </li>
          {/each}
        {/if}
      </ul>
    </section>
  {/if}

  <!-- sidePanel -->
  <section
    class="flex flex-col gap-5 items-center justify-center px-2 h-full my-auto"
  >
    <span class="group flex-col flex items-center justify-center gap-0.5">
      <button
        class={`disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Expand class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Fullscreen
      </p>
    </span>
    {#if permissions[userRole]?.includes(1)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 1)}
          class={view === 1
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
        >
          <LayoutDashboard class="h-[22px] w-[22px]" />
        </button>
        <p
          class={`text-xs ${view === 1 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          Dashboard
        </p>
      </span>
    {/if}
    {#if permissions[userRole]?.includes(8)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 8)}
          class={view === 8
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
        >
          <QrCodeIcon class="h-[22px] w-[22px]" />
        </button>
        <p
          class={`text-xs text-center ${view === 8 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          Manage Passes
        </p>
      </span>
    {/if}
    {#if permissions[userRole]?.includes(2)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 2)}
          class={view === 2
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
          ><DoorClosed class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs text-center ${view === 2 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          Gate <br /> Management
        </p>
      </span>
    {/if}
    {#if permissions[userRole]?.includes(3)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 3)}
          class={view === 3
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
          ><ScanEye class="h-[22px] w-[22px]" />
        </button>
        <p
          class={`text-xs text-center ${view === 3 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          Visitor <br /> Tracking
        </p>
      </span>
    {/if}
    {#if permissions[userRole]?.includes(4)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 4)}
          class={view === 4
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
          ><Bell class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs text-center ${view === 4 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          Alerts
        </p>
      </span>
    {/if}
    {#if permissions[userRole]?.includes(5)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 5)}
          class={view === 5
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
          ><Wallet class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs text-center ${view === 5 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          Payment <br /> Details
        </p>
      </span>
    {/if}
    {#if permissions[userRole]?.includes(6)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 6)}
          class={view === 6
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
          ><Users class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs text-center ${view === 6 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          Users
        </p>
      </span>
    {/if}
    {#if permissions[userRole]?.includes(7)}
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (view = 7)}
          class={view === 7
            ? `disabled:cursor-not-allowed relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`
            : ` disabled:cursor-not-allowed text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `}
          ><ScrollText class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs text-center ${view === 7 ? "dark:text-[#258d9d]  text-[#015a62]" : "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]"}`}
        >
          logs
        </p>
      </span>
    {/if}
  </section>
</main>

<style>
  .cardShad {
    box-shadow: 0px 4px 12.6px 0px #00000021;
  }
</style>
