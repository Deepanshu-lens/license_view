<script lang="ts">
  import {
    SlidersHorizontal,
    MoreVertical,
    ArrowUpDown,
    ListFilter,
    ChevronLeft,
    ChevronRight,
    XCircle,
    X,
    CheckCircle2,
    InfoIcon,
    AlertTriangle,
    BarChartBig,
    KeyRound,
    CarFront,
    LineChart,
    CalendarDays,
    Filter,
    TrendingUp,
    Cctv,
    Users,
    Heart,
    Briefcase,
    Gamepad,
    ShoppingBasket,
  } from "lucide-svelte";
  import Topbar from "@/components/reports/Topbar.svelte";
  import { Select } from "bits-ui";

  let selectedScreen = 1;
</script>

<main class="flex items-start w-full h-[calc(100vh-75px)]">
  <section
    class="left flex flex-col justify-center items-center h-[calc(100vh-75px)] max-w-[150px]"
  >
    <div class="flex flex-col gap-6 items-center justify-center px-4">
      <button
        on:click={() => (selectedScreen = 1)}
        class={selectedScreen !== 1
          ? `text-black/[.23] h-[50px] w-[50px] rounded-full border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[50px] w-[50px] text-white bg-[#015a62] grid place-items-center`}
        ><LineChart class="h-[28px] w-[28px]" /></button
      >
      <button
        on:click={() => (selectedScreen = 2)}
        class={selectedScreen !== 2
          ? `text-black/[.23] h-[50px] w-[50px] rounded-full  border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[50px] w-[50px] text-white bg-[#015a62] grid place-items-center`}
        ><BarChartBig class="h-[28px] w-[28px]" /></button
      >
      <button
        on:click={() => (selectedScreen = 3)}
        class={selectedScreen !== 3
          ? `text-black/[.23] h-[50px] w-[50px] rounded-full  border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[50px] w-[50px] text-white bg-[#015a62] grid place-items-center`}
        ><KeyRound class="h-[28px] w-[28px]" /></button
      >
      <button
        on:click={() => (selectedScreen = 4)}
        class={selectedScreen !== 4
          ? `text-black/[.23] h-[50px] w-[50px] rounded-full  border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[50px] w-[50px] text-white bg-[#015a62] grid place-items-center`}
        ><CarFront class="h-[28px] w-[28px]" /></button
      >
    </div>
  </section>
  <section class="right w-full h-full">
    <Topbar {selectedScreen} />
    {#if selectedScreen === 1}
      <div
        class="max-h-[calc(100vh-75px-80px)] h-full w-full grid grid-cols-6 grid-rows-2 gap-4 px-2 py-2"
      >
        <div
          class="col-span-3 rounded-lg p-2 border-2 border-black/.23 border-solid flex flex-col"
        >
          <span class="font-medium text-lg text-[#323232]"
            >Reports & Analytics</span
          >
          <span class="text-sm font-medium">Average Anomaly Detection</span>
          <span class="w-full flex items-center justify-between"
            ><span class="flex items-center gap-2 tex-lg font-medium">
              -64.23% <span
                class="text-xs text-[#589e67] bg-[#EEF5F0] rounded-xl p-1 w-[50px] h-[25px] flex items-center gap-1"
                ><TrendingUp class="h-[14px] w-[14px]" /> 12%</span
              >
            </span>
            <span class="flex items-center gap-1">
              <button
                class="flex items-center gap-2 px-2 py-1 w-[150px] rounded-md border-[1px] border-solid border-[#e0e0e0] text-medium text-base text-[#4f4f4f]"
                ><CalendarDays class="text-[#4f4f4f]" /> Date</button
              >
              <button
                class="flex items-center gap-2 px-2 py-1 w-[100px] rounded-md border-[1px] border-solid border-[#e0e0e0] text-medium text-base text-[#4f4f4f]"
                ><Filter class="text-[#4f4f4f]" /> Filter</button
              >
            </span></span
          >
          <span>Average Anomaly detection rate</span>
          <span class="bg-[red] h-full w-full">graph</span>
        </div>
        <div
          class="col-span-2 p-2 rounded-lg border-2 border-black/.23 border-solid gap-2 grid grid-cols-3 grid-rows-2"
        >
          <span
            class="col-span-2 rounded-md h-full w-full bg-[#FFDEE3] relative p-2"
          >
            <span class="flex items-center gap-4">
              <XCircle class="text-[#DE4B63]" />
              <p class="text-[#333] font-medium text-lg">Default message</p>
              <X class="ml-auto" />
            </span>
            <p class="text-xs font-semibold text-black/[.6] pt-2">
              High priority alerts:
            </p>
            <p class="text-[#1e293b] font-semibold text-xl">4351+</p>
            <img
              src="/images/line.svg"
              alt="redline"
              class="absolute bottom-0 right-0"
            />
          </span>
          <span
            class="col-span-1 rounded-md h-full w-full bg-[#DBFFF3] relative p-2"
          >
            <span class="flex items-center w-full gap-1">
              <CheckCircle2 class="text-[#3EC195] h-4 w-4" />
              <p class="text-[#333] font-medium text-xs">Default message</p>
            </span>
            <p class="text-xs font-semibold text-black/[.6] pt-2">
              Low priority alerts:
            </p>
            <p class="text-[#1e293b] font-semibold text-xl">4351+</p>
            <img
              src="/images/line1.svg"
              alt="greenline"
              class="absolute bottom-0 right-0"
            />
          </span>
          <span
            class="col-span-1 rounded-md h-full w-full bg-[#D2F2FA] relative p-2"
          >
            <span class="flex items-center w-full gap-1">
              <InfoIcon class="text-[#02C7DF] h-4 w-4" />
              <p class="text-[#333] font-medium text-xs">Default message</p>
            </span>
            <p class="text-xs font-semibold text-black/[.6] pt-2">
              Recognition alerts:
            </p>
            <p class="text-[#1e293b] font-semibold text-xl">4351+</p>
            <img
              src="/images/line2.svg"
              alt="blueline"
              class="absolute bottom-0 right-0"
            />
          </span>
          <span
            class="col-span-2 rounded-md h-full w-full bg-[#F7F6B9] p-2 relative"
          >
            <span class="flex items-center gap-4">
              <AlertTriangle class="text-[#F0C01A]" />
              <p class="text-[#333] font-medium text-lg">Default message</p>
              <X class="ml-auto" />
            </span>
            <p class="text-xs font-semibold text-black/[.6] pt-2">
              Cautious alerts:
            </p>
            <p class="text-[#1e293b] font-semibold text-xl">4351+</p>
            <img
              src="/images/line3.svg"
              alt="yellline"
              class="absolute bottom-0 right-0"
            />
          </span>
        </div>
        <div class="col-span-1 flex flex-col gap-4">
          <div
            class="border-2 border-black/.23 border-solid h-full w-full rounded-lg p-2 relative flex flex-col justify-between py-4"
          >
            <p class="text-[#202224] font-medium text-sm">Total Camera</p>
            <p class="text-xl text-[#202224] font-bold">2,314</p>
            <p class="flex items-center text-sm gap-1">
              <span class="flex items-center text-[#00B69B]"
                ><TrendingUp class="h-3 w-3" /> 1.3%</span
              > Up from past week
            </p>
            <span
              class="bg-[#FEC53D] bg-opacity-50 rounded-xl h-[51px] w-[51px] grid place-items-center absolute top-4 right-2"
            >
              <Cctv class="text-[#FEC53D]" />
            </span>
          </div>
          <div
            class="border-2 border-black/.23 border-solid h-full w-full rounded-lg p-2 relative flex flex-col justify-between py-4"
          >
            <p class="text-[#202224] font-medium text-sm">Total Camera</p>
            <p class="text-xl text-[#202224] font-bold">2,314</p>
            <p class="flex items-center text-sm gap-1">
              <span class="flex items-center text-[#00B69B]"
                ><TrendingUp class="h-3 w-3" /> 1.3%</span
              > Up from past week
            </p>
            <span
              class="bg-[#8280FF] bg-opacity-30 rounded-2xl h-[51px] w-[51px] grid place-items-center absolute top-4 right-2"
            >
              <Users class="text-[#8280FF]" />
            </span>
          </div>
        </div>
        <div
          class="col-span-3 rounded-lg border-2 border-black/.23 border-solid p-2"
        >
          <div class="flex">
            <span class="w-2/5">
              <p class="text-xl font-semibold text-[#323232]">
                Reports & Analytics
              </p>
              <span class="flex items-center gap-2 tex-lg font-medium">
                -64.23% <span
                  class="text-xs text-[#589e67] bg-[#EEF5F0] rounded-xl p-1 w-[50px] h-[25px] flex items-center gap-1"
                  ><TrendingUp class="h-[14px] w-[14px]" /> 12%</span
                >
              </span>
              <p class="tex-xs text-[#727272]">
                Average Anomaly detection rate
              </p>
            </span>
            <span class="bg-[red] w-3/5">Graph</span>
          </div>
          <div class="flex items-center justify-end h-full">
            <span class="flex items-center w-full gap-1">
              <span class="h-full flex gap-2">
                <span
                  class="bg-[#8280FF] bg-opacity-30 rounded-2xl h-[35px] w-[35px] grid place-items-center"
                >
                  <Users class="text-[#8280FF] h-4 w-4" />
                </span>
                <span class="max-w-[110px]">
                  <p class="font-medium text-xs">Average Anomaly Detection</p>
                  <p class="text-lg font-bold">2.34%</p>
                </span>
              </span>
              <span class="h-[75px] w-[1px] bg-black bg-opacity-[.18]" />
              <span class="h-full flex gap-2">
                <span
                  class="bg-[#8280FF] bg-opacity-30 rounded-2xl h-[35px] w-[35px] grid place-items-center"
                >
                  <Users class="text-[#8280FF] h-4 w-4" />
                </span>
                <span class="max-w-[110px]">
                  <p class="font-medium text-xs">Average Anomaly Detection</p>
                  <p class="text-lg font-bold">2.34%</p>
                </span>
              </span>
              <span class="h-[75px] w-[1px] bg-black bg-opacity-[.18]" />
              <span class="h-full flex gap-2">
                <span
                  class="bg-[#8280FF] bg-opacity-30 rounded-2xl h-[35px] w-[35px] grid place-items-center"
                >
                  <Users class="text-[#8280FF] h-4 w-4" />
                </span>
                <span class="max-w-[110px]">
                  <p class="font-medium text-xs">Average Anomaly Detection</p>
                  <p class="text-lg font-bold">2.34%</p>
                </span>
              </span>
              <span class="h-[75px] w-[1px] bg-black bg-opacity-[.18]" />
              <span class="h-full flex gap-2">
                <span
                  class="bg-[#8280FF] bg-opacity-30 rounded-2xl h-[35px] w-[35px] grid place-items-center"
                >
                  <Users class="text-[#8280FF] h-4 w-4" />
                </span>
                <span class="max-w-[110px]">
                  <p class="font-medium text-xs">Average Anomaly Detection</p>
                  <p class="text-lg font-bold">2.34%</p>
                </span>
              </span>
            </span>
          </div>
        </div>
        <div
          class="col-span-3 rounded-lg border-2 border-black/.23 border-solid p-2 flex flex-col"
        >
          <span class="flex items-center justify-between px-2">
            <span>Event Occurrence Report</span>
            <span class="flex justify-end items-center gap-2"
              ><Select.Root portal={null}>
                <Select.Trigger class="text-sm ">
                  <Select.Value placeholder="Sort by" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Sort by</Select.Label>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
              <SlidersHorizontal class="scale-75" />
            </span>
          </span>
          <div class="flex items-center h-full w-full gap-2">
            <span class="w-1/2 flex flex-col gap-2 py-4">
              <span
                class="flex items-center justify-start py-1 px-2 bg-[#fafafa] rounded-lg"
              >
                <img
                  src="/images/01.svg"
                  alt="cardthubmnail"
                  class="h-[40px] w-[40px] aspect-square"
                />
                <span class="flex flex-col ml-2"
                  ><p class="font-medium text-sm">Fire Detection</p>
                  <p class="text-xs text-[#727272]">
                    Camera undefined 0.9957114
                  </p></span
                >
                <span class="flex flex-col ml-auto"
                  ><p class="text-xs text-[#727272]">04:54:19 PM</p>
                  <p class="text-xs text-[#727272]">mar 29, 2024</p></span
                >
              </span>
              <span
                class="flex items-center justify-start py-1 px-2 bg-[#fafafa] rounded-lg"
              >
                <img
                  src="/images/01.svg"
                  alt="cardthubmnail"
                  class="h-[40px] w-[40px] aspect-square"
                />
                <span class="flex flex-col ml-2"
                  ><p class="font-medium text-sm">Fire Detection</p>
                  <p class="text-xs text-[#727272]">
                    Camera undefined 0.9957114
                  </p></span
                >
                <span class="flex flex-col ml-auto"
                  ><p class="text-xs text-[#727272]">04:54:19 PM</p>
                  <p class="text-xs text-[#727272]">mar 29, 2024</p></span
                >
              </span>
              <span
                class="flex items-center justify-start py-1 px-2 bg-[#fafafa] rounded-lg"
              >
                <img
                  src="/images/01.svg"
                  alt="cardthubmnail"
                  class="h-[40px] w-[40px] aspect-square"
                />
                <span class="flex flex-col ml-2"
                  ><p class="font-medium text-sm">Fire Detection</p>
                  <p class="text-xs text-[#727272]">
                    Camera undefined 0.9957114
                  </p></span
                >
                <span class="flex flex-col ml-auto"
                  ><p class="text-xs text-[#727272]">04:54:19 PM</p>
                  <p class="text-xs text-[#727272]">mar 29, 2024</p></span
                >
              </span>
              <span
                class="flex items-center justify-start py-1 px-2 bg-[#fafafa] rounded-lg"
              >
                <img
                  src="/images/01.svg"
                  alt="cardthubmnail"
                  class="h-[40px] w-[40px] aspect-square"
                />
                <span class="flex flex-col ml-2"
                  ><p class="font-medium text-sm">Fire Detection</p>
                  <p class="text-xs text-[#727272]">
                    Camera undefined 0.9957114
                  </p></span
                >
                <span class="flex flex-col ml-auto"
                  ><p class="text-xs text-[#727272]">04:54:19 PM</p>
                  <p class="text-xs text-[#727272]">mar 29, 2024</p></span
                >
              </span>
            </span>
            <span class="w-1/2 bg-[red] flex h-full">graph</span>
          </div>
        </div>
      </div>
    {/if}
    {#if selectedScreen === 3}
      <div
        class="max-h-[calc(100vh-75px-80px)] h-full w-full grid grid-cols-7 grid-rows-2 gap-4 p-2"
      >
        <div class="col-span-7 h-full w-full grid grid-cols-7 gap-4">
          <div
            class="col-span-2 border-2 border-black/.23 border-solid p-2 flex flex-col h-full w-full rounded-lg"
          >
            <span class="flex items-center justify-between"
              ><span class="text-lg font-bold">Performance</span><span
                ><MoreVertical class="h-5 w-5" /></span
              ></span
            >
            <span class="bg-[red] h-full w-full flex">graph 1</span>
          </div>
          <div
            class="col-span-3 border-2 border-black/.23 border-solid p-2 rounded-lg flex flex-col items-start justify-normal"
          >
            <span class="flex items-center justify-between w-full">
              <span class="text-lg font-bold">Average Face Recognition</span>
              <span class="flex items-center gap-3">
                <span class="flex items-center gap-1"
                  ><span
                    class="h-1.5 w-1.5 rounded-full bg-[#dd2025] text-sm"
                  /> Unrecogonised</span
                >
                <span class="flex items-center gap-1"
                  ><span
                    class="h-1.5 w-1.5 rounded-full bg-[#14ba6d] text-sm"
                  /> Recogonised</span
                >
                <span>
                  <Select.Root portal={null}>
                    <Select.Trigger class="text-sm">
                      <Select.Value placeholder="Monthly" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        <Select.Label>Time</Select.Label>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </span>
              </span>
            </span>
            <span>Average active cameras</span>
            <span class="bg-[red] h-full w-full">Graph 2</span>
          </div>
          <div class="col-span-2 grid grid-cols-1 grid-rows-2 gap-4">
            <div
              class="col-span-1 border border-black/.23 border-solid rounded-lg p-2 flex items-center gap-1"
            >
              <span class="flex flex-col h-full flex-shrink-0 gap-1">
                <span class="text-lg font-semibold">total registered faces</span
                >
                <span class="text-4xl font-bold">10293</span>
                <span class="flex items-center gap-1 text-black/.7 text-sm">
                  <span class="text-[#00B69B] flex items-center gap-1">
                    <TrendingUp class="text-[#00B69B] h-3 w-3" /> 1.3%
                  </span>
                  Up from past week
                </span>
              </span>
              <span class="bg-[red] h-full w-full"> graph </span>
            </div>
            <div
              class="col-span-1 border border-black/.23 border-solid rounded-lg p-2 flex items-center gap-1"
            >
              <span class="flex flex-col h-full flex-shrink-0 gap-1">
                <span class="text-lg font-semibold">Total registered faces</span
                >
                <span class="text-4xl font-bold">10293</span>
                <span class="flex items-center gap-1 text-black/.7 text-sm">
                  <span class="text-[#00B69B] flex items-center gap-1">
                    <TrendingUp class="text-[#00B69B] h-3 w-3" /> 1.3%
                  </span>
                  Up from past week
                </span>
              </span>
              <span class="bg-[red] h-full w-full"> graph </span>
            </div>
          </div>
        </div>
        <div class="col-span-7 px-4">
          <div class="flex items-center justify-between">
            <span class="text-xl font-medium text-[#323232]">Overview</span>
            <span class="flex items-center gap-4">
              <span class="text-sm text-black/.7 flex items-center gap-1"
                ><ArrowUpDown class="h-4 w-4" /> Sort</span
              >
              <span class="text-sm text-black/.7 flex items-center gap-1"
                ><ListFilter class="h-4 w-4" /> Filter</span
              >
              <span class="text-sm text-black/.7">Rows per page: select</span>
              <span class="text-sm text-black/.7">1-10 of 54</span>
              <span class="flex items-center gap-2">
                <ChevronLeft class="h-4 w-4" />
                <ChevronRight class="h-4 w-4" />
              </span>
            </span>
          </div>
          <div>Table</div>
        </div>
      </div>
    {/if}
    {#if selectedScreen === 4}
      <div class="grid grid-cols-8 gap-6 grid-rows-3 h-2/5 px-4">
        <span class="col-span-2 rounded-lg bg-white shadow-lg p-2">
          <span class="flex items-center justify-center gap-6 h-full w-full">
            <span
              class="h-[60px] w-[60px] rounded-full bg-[#5B93FF] bg-opacity-30 grid place-items-center"
            >
              <Heart class="text-[#5B93FF]" />
            </span>
            <span class="flex flex-col">
              <span class="flex items-center">
                <p class="text-[#030229] font-bold text-xl">64.31%</p>
                <span
                  class="text-[#00B69B] bg-[#00b69b] bg-opacity-20 flex items-center gap-1 p-2 rounded-3xl scale-75 text-sm"
                >
                  <TrendingUp class="text-[#00B69B] h-3 w-3" /> 1.3%
                </span>
              </span>
              <p class="font-medium text-[#030229]">ANPR</p>
            </span>
          </span>
        </span>
        <span class="col-span-2 rounded-lg bg-white shadow-lg p-2">
          <span class="flex items-center justify-center gap-6 h-full w-full">
            <span
              class="h-[60px] w-[60px] rounded-full bg-[#FFD66B] bg-opacity-30 grid place-items-center"
            >
              <Gamepad class="text-[#FFD66B]" />
            </span>
            <span class="flex flex-col">
              <span class="flex items-center">
                <p class="text-[#030229] font-bold text-xl">64.31%</p>
                <span
                  class="text-[#00B69B] bg-[#00b69b] bg-opacity-20 flex items-center gap-1 p-2 rounded-3xl scale-75 text-sm"
                >
                  <TrendingUp class="text-[#00B69B] h-3 w-3" /> 1.3%
                </span>
              </span>
              <p class="font-medium text-[#030229]">Entry/Exit of vehicles</p>
            </span>
          </span>
        </span>
        <span class="col-span-2 rounded-lg bg-white shadow-lg p-2">
          <span class="flex items-center justify-center gap-6 h-full w-full">
            <span
              class="h-[60px] w-[60px] rounded-full bg-[#FF8F6B] bg-opacity-30 grid place-items-center"
            >
              <ShoppingBasket class="text-[#FF8F6B]" />
            </span>
            <span class="flex flex-col">
              <span class="flex items-center">
                <p class="text-[#030229] font-bold text-xl">64.31%</p>
                <span
                  class="text-[#00B69B] bg-[#00b69b] bg-opacity-20 flex items-center gap-1 p-2 rounded-3xl scale-75 text-sm"
                >
                  <TrendingUp class="text-[#00B69B] h-3 w-3" /> 1.3%
                </span>
              </span>
              <p class="font-medium text-[#030229]">Unrecogonised vehicles</p>
            </span>
          </span>
        </span>
        <span class="col-span-2 rounded-lg bg-white shadow-lg p-2">
          <span class="flex items-center justify-center gap-6 h-full w-full">
            <span
              class="h-[60px] w-[60px] rounded-full bg-[#605BFF] bg-opacity-30 grid place-items-center"
            >
              <Briefcase class="text-[#605BFF]" />
            </span>
            <span class="flex flex-col">
              <span class="flex items-center">
                <p class="text-[#030229] font-bold text-xl">64.31%</p>
                <span
                  class="text-[#00B69B] bg-[#00b69b] bg-opacity-20 flex items-center gap-1 p-2 rounded-3xl scale-75 text-sm"
                >
                  <TrendingUp class="text-[#00B69B] h-3 w-3" /> 1.3%
                </span>
              </span>
              <p class="font-medium text-[#030229]">Empty Slots</p>
            </span>
          </span>
        </span>
        <span
          class="col-span-4 bg-white shadow-lg rounded-lg h-64 p-2 flex flex-col gap-2"
        >
          <span class="flex items-center justify-between px-6">
            <p class="text-[#475569] font-semibold">Reports</p>
            <span class="flex items-center gap-1">
              <button
                class="flex items-center gap-2 px-2 py-1 w-[150px] rounded-md border-[1px] border-solid border-[#e0e0e0] text-medium text-base text-[#4f4f4f]"
                ><CalendarDays class="text-[#4f4f4f]" /> Date</button
              >
              <button
                class="flex items-center gap-2 px-2 py-1 w-[100px] rounded-md border-[1px] border-solid border-[#e0e0e0] text-medium text-base text-[#4f4f4f]"
                ><Filter class="text-[#4f4f4f]" /> Filter</button
              >
            </span>
          </span>
          <span class="bg-[red] h-full w-full"> graph </span>
        </span>
        <span
          class="col-span-4 bg-white shadow-lg rounded-lg h-64 p-2 flex flex-col gap-2"
        >
          <span class="flex items-center justify-between px-6">
            <p class="text-[#475569] font-semibold">Vehicle Overview</p>
            <span class="flex items-center gap-1">
              <span>Sort By: Yearly</span>
              <span><MoreVertical /></span>
            </span>
          </span>
          <span class="bg-[red] h-full w-full"> graph </span>
        </span>
      </div>
      <div class="flex items-center justify-between mt-24 px-4">
        <span class="text-xl font-medium text-[#323232]">Overview</span>
        <span class="flex items-center gap-4">
          <span class="text-sm text-black/.7 flex items-center gap-1"
            ><ArrowUpDown class="h-4 w-4" /> Sort</span
          >
          <span class="text-sm text-black/.7 flex items-center gap-1"
            ><ListFilter class="h-4 w-4" /> Filter</span
          >
          <span class="text-sm text-black/.7">Rows per page: select</span>
          <span class="text-sm text-black/.7">1-10 of 54</span>
          <span class="flex items-center gap-2">
            <ChevronLeft class="h-4 w-4" />
            <ChevronRight class="h-4 w-4" />
          </span>
        </span>
      </div>
    {/if}
  </section>
</main>
