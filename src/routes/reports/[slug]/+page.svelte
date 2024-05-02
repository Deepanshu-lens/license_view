<script lang="ts">
  import {
    BarChartBig,
    KeyRound,
    CarFront,
    LineChart,
    HeartPulse,
  } from "lucide-svelte";
  import Topbar from "@/components/reports/Topbar.svelte";
  import { Select } from "bits-ui";
  import Analytics from "@/components/reports/Analytics.svelte";
  import Access from "@/components/reports/Access.svelte";
  import Parking from "@/components/reports/Parking.svelte";
  import Reports from "@/components/reports/Reports.svelte";
  import Health from "@/components/reports/Health.svelte";
  import type { PageServerData } from "./$types";

  let selectedScreen = 1;
  export let data: PageServerData;
</script>

<main
  class="flex items-start flex-row-reverse px-4 w-full h-[calc(100vh-75px)]"
>
  <section
    class="left flex flex-col justify-center items-center h-[calc(100vh-75px)]"
  >
    <div class="flex flex-col gap-6 items-center justify-center pl-2">
      <span class="group flex items-center justify-center gap-0.5 flex-col">
        <button
          on:click={() => (selectedScreen = 1)}
          class={selectedScreen !== 1
            ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `
            : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`}
          ><LineChart class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs ${selectedScreen !== 1 ? "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]" : "dark:text-[#258d9d]  text-[#015a62]"}`}
        >
          Analytics
        </p>
      </span>
      <span class="group flex items-center justify-center gap-0.5 flex-col">
        <button
          on:click={() => (selectedScreen = 2)}
          class={selectedScreen !== 2
            ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `
            : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`}
          ><BarChartBig class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs ${selectedScreen !== 2 ? "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]" : "dark:text-[#258d9d]  text-[#015a62]"}`}
        >
          Reports
        </p>
      </span>
      <span class="group flex items-center justify-center gap-0.5 flex-col">
        <button
          on:click={() => (selectedScreen = 3)}
          class={selectedScreen !== 3
            ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `
            : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`}
          ><KeyRound class="h-[22px] w-[22px]" /></button
        >
        <p
          class={`text-xs ${selectedScreen !== 3 ? "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]" : "dark:text-[#258d9d]  text-[#015a62]"}`}
        >
          Access
        </p>
      </span>
      <span class="group flex items-center justify-center gap-0.5 flex-col">
        <button
          on:click={() => (selectedScreen = 4)}
          class={selectedScreen !== 4
            ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `
            : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`}
          ><CarFront class="h-[22px] w-[22px]" />
        </button>
        <p
          class={`text-xs ${selectedScreen !== 4 ? "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]" : "dark:text-[#258d9d]  text-[#015a62]"}`}
        >
          Parking
        </p>
      </span>
      <span class="group flex items-center justify-center gap-0.5 flex-col">
        <button
          on:click={() => (selectedScreen = 5)}
          class={selectedScreen !== 5
            ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `
            : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`}
          ><HeartPulse class="h-[22px] w-[22px]" />
        </button>
        <p
          class={`text-xs ${selectedScreen !== 5 ? "group-hover:text-[#015a62] text-black/[.23] dark:text-white dark:group-hover:text-[#258d9d]" : "dark:text-[#258d9d]  text-[#015a62]"}`}
        >
          Health
        </p>
      </span>
    </div>
  </section>
  <section class="right w-full h-full">
    <Topbar {selectedScreen} />
    {#if selectedScreen === 1}
      <Analytics />
    {/if}
    {#if selectedScreen === 2}
      <Reports />
    {/if}
    {#if selectedScreen === 3}
      <div class="overflow-y-scroll max-h-[calc(100vh-160px)]">
        <Access />
      </div>
    {/if}
    {#if selectedScreen === 4}
      <div class="overflow-y-scroll max-h-[calc(100vh-160px)]">
        <Parking />
      </div>
    {/if}
    {#if selectedScreen === 5}
      <Health os={data.os} />
    {/if}
  </section>
</main>
