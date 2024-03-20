<script lang="ts">
  import Switch from "@/components/ui/switch/switch.svelte";
  import { selectedNode } from "@/lib/stores";
  import { onMount } from "svelte";
  import { addUserLog } from "@/lib/addUserLog";

  let selected = 1;
  let recAudio = false;

  let recordingType = 1;
  let recordingOptions = [
    { id: 1, label: "No delay" },
    { id: 2, label: "Shortest delay" },
    { id: 3, label: "Best quality" },
    { id: 4, label: "Custom delay" },
  ];

  let bufferType = 1;
  let bufferOptions = [
    { id: 1, label: "5 sec" },
    { id: 2, label: "15 sec" },
    { id: 3, label: "30 sec" },
    { id: 4, label: "60 sec" },
  ];

  let recordingQuality = 4;
  let qualityOptions = [
    { id: 1, label: "5 fps" },
    { id: 2, label: "10 fps" },
    { id: 3, label: "15 fps" },
    { id: 4, label: "25 fps" },
    { id: 5, label: "30 fps" },
  ];

  function handleConfirm() {
    console.log(recordingType);
    console.log(bufferType);
    console.log(recordingQuality);

    if (selected === 1) {
    } else if (selected === 2) {
    } else {
    }
  }

  onMount(() => {
    if ($selectedNode !== undefined) {
      recordingType =
        $selectedNode.recording_mode === 0 ? 1 : $selectedNode.recording_mode;
      recordingQuality =
        $selectedNode.recording_quality === 0
          ? 4
          : $selectedNode.recording_quality;
      recAudio = $selectedNode.recording_sound;

      if (recordingType === 4) {
        bufferType =
          $selectedNode.recording_buffer === 0
            ? 1
            : $selectedNode.recording_buffer;
      }
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
          Recording mode
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => {
          selected = 1;
          addUserLog("user clicked on recording mode button recording panel");
        }}
      >
        Recording mode
      </button>
    {/if}

    {#if selected === 2}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Video quality
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => {
          selected = 2;
          addUserLog("user clicked on video quality button recording panel");
        }}
      >
        Video quality
      </button>
    {/if}
    {#if selected === 3}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-witee">
          Audio settings
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        on:click={() => {
          selected = 3;
          addUserLog("user clicked on audio settings button recording panel");
        }}
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
      >
        Audio settings
      </button>
    {/if}
  </div>
  <div class="h-[1px] w-[96%] dark:bg-[#242424] mb-8 bg-[#e0e0e0]" />
  {#if selected === 1}
    <h2 class="px-6 font-medium mb-4">Recording mode</h2>
    <div class="h-[1px] w-[96%] dark:bg-[#242424] mb-8" />
    <form class=" flex items-center justify-center gap-4 w-[75%] mb-8 px-6">
      {#each recordingOptions as { id, label }}
        <div class="flex gap-4 w-full">
          <label>
            <input
              type="radio"
              name="delayOption"
              class="cursor-pointer"
              bind:group={recordingType}
              value={id}
            />
            {label}</label
          >
        </div>
      {/each}
    </form>
    {#if recordingType === 1}
      <p class="text-[#3B7C26] opacity-90 text-sm px-6 mt-4 mb-8">
        <span class="dark:text-[#929292] text-black/[.8] text-sm mr-1">
          Note:
        </span>
        Frame lag possible
      </p>
    {:else if recordingType === 2}
      <p class="text-[#FB8A2E] opacity-90 text-sm px-6 mt-4 mb-8">
        <span class="dark:text-[#929292] text-black/[.8] text-sm mr-1">
          Note:
        </span>
        Frame consistent but quality issues can appear at times
      </p>
    {:else if recordingType === 3}
      <p class="text-[#EF4444] opacity-90 text-sm px-6 mt-4 mb-8">
        <span class="dark:text-[#929292] text-black/[.8] text-sm mr-1">
          Note:
        </span>
        Will run few seconds behind live but ensures consistent high quality stream
      </p>
    {:else}
      <div
        class="flex text-black dark:text-white opacity-90 text-sm gap-4 items-center px-6 mt-4 mb-8"
      >
        <span class="text-[#333] dark:text-[#929292] text-sm"> Select: </span>
        {#each bufferOptions as { id, label }}
          <label>
            <input
              type="radio"
              name="custom delay"
              class="cursor-pointer"
              bind:group={bufferType}
              value={id}
            />
            {label}</label
          >
        {/each}
      </div>
    {/if}
  {/if}
  {#if selected === 2}
    <h2 class="px-6 mb-4 font-medium">Recording Video Quality</h2>
    <div class="h-[1px] w-[96%] dark:bg-[#242424] mb-8 bg-[#e0e0e0]" />
    <form class=" flex items-start justify-center gap-4 w-[65%] mb-8 px-6">
      {#each qualityOptions as { id, label }}
        <div class="flex gap-4 w-full">
          <label>
            <input
              type="radio"
              name="delayOption"
              class="cursor-pointer"
              bind:group={recordingQuality}
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
        recordingQuality === 1
          ? "text-[#3B7C26]"
          : recordingQuality === 2
            ? "text-[#FB8A2E]"
            : recordingQuality === 3
              ? "text-[#FB8A2E]"
              : recordingQuality === 4
                ? "text-[#EF4444]"
                : "text-[#EF4444]"
      } `}
    >
      <span class="dark:text-[#929292] text-black/[.8] text-sm mr-1">
        Note:
      </span>
      {recordingQuality === 1
        ? "Min space required to store, lowest stream quality"
        : recordingQuality === 2
          ? "Less space required to store"
          : recordingQuality === 3
            ? "Medium quality recording and decent space required"
            : recordingQuality === 4
              ? "Good quality stream and more space required"
              : "Best quality stream but also requires most storage space"}
    </p>
  {/if}
  {#if selected === 3}
    <h2 class="px-6 font-medium mb-4">Audio settings</h2>
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <div class="px-6 flex items-center justify-center gap-4">
      <span>Record sound in live mode</span>
      <Switch bind:checked={recAudio} />
    </div>
  {/if}

  <button
    class="text-white bg-[#015a62] px-10 py-2 rounded-lg mx-6 my-4"
    on:click={handleConfirm}
  >
    Confirm
  </button>
</div>
