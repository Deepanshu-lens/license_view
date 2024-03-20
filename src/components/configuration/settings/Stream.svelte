<script type="ts">
  import { selectedNode } from "@/lib/stores";
  import { onMount } from "svelte";
  import { addUserLog } from "@/lib/addUserLog";

  let selected = 1;
  let delayOptions = [
    { id: 1, label: "No delay" },
    { id: 2, label: "Shortest delay" },
    { id: 3, label: "Best quality" },
  ];
  let delaytype = 1;
  let resoOptions = [
    { id: 1, label: "240p" },
    { id: 2, label: "360p" },
    { id: 3, label: "480p" },
    { id: 4, label: "720p" },
    { id: 5, label: "1080p" },
    { id: 6, label: "default" },
  ];
  let resoType = 6;
  let dimensions = {};

  function handleConfirm() {
    console.log(resoType);
    console.log(delaytype);
    if (selected === 1) {
    }
  }

  onMount(() => {
    if ($selectedNode !== undefined) {
      delaytype = $selectedNode.live_mode === 0 ? 1 : $selectedNode.live_mode;
      resoType =
        $selectedNode.live_resolution === 0 ? 6 : $selectedNode.live_resolution;
    }
  });
</script>

<div
  class="flex flex-col items-start mt-12 h-[calc(100vh-75px)] w-full text-black dark:text-white"
>
  <div
    class="flex w-full justify-start items-center gap-20 font-bold mb-4 px-8"
  >
    {#if selected === 1}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Live mode
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        on:click={() => {
          selected = 1;
          addUserLog("user clicked on Live mode button stream panel");
        }}
        class="cursor-pointer text-[#212427] font-medium dark:text-[rgba(255,255,255,.6)]"
      >
        Live mode
      </button>
    {/if}
    {#if selected === 2}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Resolution
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        on:click={() => {
          selected = 2;
          addUserLog("user clicked on resolution button stream panel");
        }}
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
      >
        Resolution
      </button>
    {/if}
  </div>
  <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />

  {#if selected === 1}
    <h2 class="px-6 font-medium mb-4">Stream delay duration</h2>
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <form class=" flex items-center justify-center w-[60%] mb-8 px-6">
      {#each delayOptions as { id, label }}
        <div class="flex gap-4 w-full">
          <label>
            <input
              type="radio"
              name="delayOption"
              class="cursor-pointer"
              bind:group={delaytype}
              value={id}
            />
            {label}</label
          >
        </div>
      {/each}
    </form>
    <p
      class={`px-6 mt-4 mb-8 text-sm opacity-90 animate-fade   ${
        delaytype === 1
          ? "text-[#3B7C26] "
          : delaytype === 2
            ? "text-[#FB8A2E] "
            : "text-[#EF4444] "
      } `}
    >
      <span class="dark:text-[#929292] text-black/[.8] text-sm mr-1">
        Note:
      </span>
      {delaytype === 1
        ? "Frame lag possible"
        : delaytype === 2
          ? "Frame consistent but quality issues can appear at times"
          : "Will run few seconds behind live but ensures consistent high quality stream"}
    </p>
  {/if}
  {#if selected === 2}
    <h2 class="px-6 font-medium mb-4">Live stream resolution</h2>
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <form class=" flex items-center justify-center w-[70%] mb-8 px-6">
      {#each resoOptions as { id, label }}
        <div class="flex gap-4 w-full">
          <label>
            <input
              type="radio"
              class="cursor-pointer"
              bind:group={resoType}
              value={id}
            />
            {label}</label
          >
        </div>
      {/each}
    </form>
    <p
      id="fadeElement"
      class={`px-6 mt-4 mb-8 text-sm opacity-90 ${
        resoType === 1
          ? "text-[#3B7C26]"
          : resoType === 2
            ? "text-[#FB8A2E]"
            : resoType === 3
              ? "text-[#FB8A2E]"
              : resoType === 4
                ? "text-[#EF4444]"
                : resoType === 5
                  ? "text-[#EF4444]"
                  : "text-[#3B7C26]"
      } `}
    >
      <span class="dark:text-[#929292] text-black/[.8] text-sm mr-1">
        Note:
      </span>
      {resoType === 1
        ? "For smooth lag, free streams"
        : resoType === 2
          ? "Frame consistent but quality issues"
          : resoType === 3
            ? "Minor lag could be there"
            : resoType === 4
              ? "Intermittent frames lag could be observed"
              : resoType === 5
                ? "Frame lag is expected frequently"
                : "Decided based on the number of cameras"}
    </p>
  {/if}

  <button
    class="text-white bg-[#015a62] px-10 py-2 rounded-lg mx-6 my-4"
    on:click={handleConfirm}
  >
    Confirm
  </button>
</div>
