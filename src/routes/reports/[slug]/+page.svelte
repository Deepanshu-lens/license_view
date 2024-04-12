<script lang="ts">
  import { BarChartBig, KeyRound, CarFront, LineChart } from "lucide-svelte";
  import Topbar from "@/components/reports/Topbar.svelte";
  import { Select } from "bits-ui";
  import Analytics from "@/components/reports/Analytics.svelte";
  import Access from "@/components/reports/Access.svelte";
  import Parking from "@/components/reports/Parking.svelte";
  import Reports from "@/components/reports/Reports.svelte";

  let selectedScreen = 1;
</script>

<main class="flex items-start w-full h-[calc(100vh-75px)]">
  <section
    class="left flex flex-col justify-center items-center h-[calc(100vh-75px)]"
  >
    <div class="flex flex-col gap-6 items-center justify-center px-4">
      <button
        on:click={() => (selectedScreen = 1)}
        class={selectedScreen !== 1
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><LineChart class="h-[22px] w-[22px]" /></button
      >
      <button
        on:click={() => (selectedScreen = 2)}
        class={selectedScreen !== 2
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full  border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><BarChartBig class="h-[22px] w-[22px]" /></button
      >
      <button
        on:click={() => (selectedScreen = 3)}
        class={selectedScreen !== 3
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full  border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><KeyRound class="h-[22px] w-[22px]" /></button
      >
      <button
        on:click={() => (selectedScreen = 4)}
        class={selectedScreen !== 4
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full  border-2 border-solid border-black/[.23] bg-white grid place-items-center`
          : ` border-none rounded-full h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><CarFront class="h-[22px] w-[22px]" /></button
      >
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
  </section>
</main>
