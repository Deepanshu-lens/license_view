<script>
  import NewPlaybackCard from "./../cards/NewPlaybackCard.svelte";
  let selectedMode = 1;
  let showCalendar = false;
  let value = null;
  let searchDate;
  let selectedCamera;
  let startTime;
  let endTime;
  import { Calendar } from "@/components/ui/calendar";
  import { selectedNode, convertedVideos, allVideos } from "@/lib/stores";
  import { ChevronDown, CalendarDaysIcon, PlusCircle, X } from "lucide-svelte";
  import { toast } from "svelte-sonner";

  $: if (value) {
    const date = new Date(value.year, value.month - 1, value.day);

    let formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    console.log(formattedDate);
    searchDate = formattedDate;
    showCalendar = false;
    value = null;
  }

  $: if (selectedMode) {
    value = null;
    searchDate = null;
    if(selectedMode === 1) {
      allVideos.set(null)
    }
  }

  async function fetchPlaybackData(cameraId, date, startTime, endTime) {
    const url = "/api/playbackVideo/get";
    const payload = {
      cameraId,
      date,
      startTime,
      endTime,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error occurred");
      }

      const data = await response.json();
      console.log("Playback Data:", data);
      if (data?.playback_data?.length > 0) {

        // convertedVideos.set(data.playback_data);
        if ($convertedVideos.length <= 3) {
      convertedVideos.update(videos => [...videos, data.playback_data[0]]);
    } else {
      toast.error('Maximum limit of 4 videos reached');
    }
      } else {
        console.log("no videos with this time range");
        toast.error("No videos in this time range");
      }
      return data;
    } catch (error) {
      console.error("Error fetching playback data:", error);
    }
  }

  async function fetchFromDate(date) {
    const response = await fetch("/api/playbackVideo/getMany", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, nodeId: $selectedNode.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData)
      if(errorData?.error) {
        toast.error(errorData.error)
      }
      throw new Error(`Error: ${response.status} - ${errorData.error}`);
    }

    const data = await response.json();
    allVideos.set(data.playback_data);
    if(data.playback_data?.length === 0) {
      toast.error(`No Recordings on chosen Date: ${searchDate}`)
    }
    return data;
  }
</script>

<div
  class="flex items-center w-full justify-between px-6 pt-4 pb-2 border-b border-solid"
>
  <button
    on:click={() => (selectedMode = 1)}
    class={`${selectedMode === 1 ? "text-[#727272]" : "text-[#afafaf]"} font-medium text-sm relative`}
    >Manual {#if selectedMode === 1}<span
        class="absolute h-[2px] w-full bg-[#015a62] -bottom-2 left-0"
      />{/if}</button
  >
  <button
    on:click={() => (selectedMode = 2)}
    class={`${selectedMode === 2 ? "text-[#727272]" : "text-[#afafaf]"} font-medium text-sm relative`}
    >Search by Date {#if selectedMode === 2}<span
        class="absolute h-[2px] w-full bg-[#015a62] -bottom-2 left-0"
      />{/if}</button
  >
</div>
{#if selectedMode === 1}
  <div class="px-4 py-4 flex flex-col gap-1">
    <label for="camera" class="text-black/[.7] text-sm">Select Camera</label>
    <div class="relative w-full">
      <select
        bind:value={selectedCamera}
        class={`block text-primary capitalize font-semibold rounded-md appearance-none w-full bg-[#F6F6F6] border-2 py-2 text-sm px-2 leading-tight `}
      >
        <option value="" disabled selected>Select from list</option>
        {#each $selectedNode?.camera as cam}
          <option value={cam.id}>{cam.name}</option>
        {/each}
      </select>
      <ChevronDown
        size={22}
        class="text-[#727272] absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none cursor-pointer outline-none"
      />
    </div>
  </div>
  <div class="px-4 flex flex-col gap-1">
    <label for="camera" class="text-black/[.7] text-sm">Select Date</label>
    <div class="relative w-full">
      <input
        type="text"
        placeholder="DD MONTH YY"
        disabled
        bind:value={searchDate}
        on:change={(e) => (searchDate = e.target.value)}
        class=" rounded-md block capitalize border-2 text-sm px-2 py-2 leading-tight w-full bg-[#f6f6f6] text-[#979797]"
      />
      <button
        on:click={() => (showCalendar = !showCalendar)}
        class="absolute top-1/2 -translate-y-1/2 right-2 grid place-items-center"
      >
        <CalendarDaysIcon
          size={22}
          class="text-[#727272]  pointer-events-none cursor-pointer outline-none"
        />
      </button>
      {#if showCalendar}
        <Calendar
          bind:value
          class=" bg-white dark:bg-black absolute top-14 right-0 z-[99999999] px-4 py-2 flex flex-col items-center justify-center rounded-md border border-solid border-[#929292]"
        />
      {/if}
    </div>
  </div>
  <div class="px-4 w-full py-4 flex flex-row items-center gap-3">
    <span>
      <label for="start-time" class="text-black/[.7] text-sm">Start Time</label>
      <input
        type="time"
        id="start-time"
        bind:value={startTime}
        placeholder="00:00"
        class="block rounded-md capitalize border-2 text-sm px-2 py-2 leading-tight w-full bg-[#f6f6f6] text-[#979797]"
      />
    </span>
    <span>
      <label for="end-time" class="text-black/[.7] text-sm">End Time</label>
      <input
        type="time"
        id="end-time"
        bind:value={endTime}
        placeholder="00:00"
        class="block rounded-md capitalize border-2 text-sm px-2 py-2 leading-tight w-full bg-[#f6f6f6] text-[#979797]"
      />
    </span>
  </div>
  <div class="w-full px-4 mt-4">
    <button
      class="flex items-center gap-2 w-full text-[#015a62] border border-[#015a62] rounded-md text-sm py-2 text-center justify-center"
    >
      Add More <PlusCircle size={18} />
    </button>
  </div>
  <div class="px-4 w-full">
    <button
      class="text-white bg-[#015a62] w-full py-2 text-sm font-medium mt-4 rounded-md"
      on:click={() =>
        fetchPlaybackData(selectedCamera, searchDate, startTime, endTime)}
    >
      Submit
    </button>
  </div>
{:else}
  <div class="relative w-full p-4">
    <button
      on:click={() => (showCalendar = !showCalendar)}
      class="absolute top-1/2 -translate-y-1/2 left-5 grid place-items-center"
    >
      <CalendarDaysIcon
        size={20}
        class="text-[#727272]  pointer-events-none cursor-pointer outline-none"
      />
    </button>
    <input
      bind:value={searchDate}
      disabled
      on:change={(e) => (searchDate = e.target.value)}
      type="text"
      placeholder="DD MONTH, YY"
      class=" h-full block rounded-md capitalize border-2 text-sm pl-8 pr-4 py-2 leading-tight w-full bg-[#f6f6f6] text-[#979797]"
    />
    <button
      class="absolute top-1/2 -translate-y-1/2 right-5 grid place-items-center"
      on:click={() => {
        value = null;
        searchDate = null;
      }}
    >
      <X class="text-[#727272]" size={20} />
    </button>
    {#if showCalendar}
      <Calendar
        bind:value
        class=" bg-white dark:bg-black absolute top-14 right-0 z-[99999999] px-4 py-2 flex flex-col items-center justify-center rounded-md border border-solid border-[#929292]"
      />
    {/if}
  </div>
  {#if searchDate}
    <div class="px-4 w-full">
      <button
        on:click={() => fetchFromDate(searchDate)}
        class="text-white bg-[#015a62] w-full py-1 text-sm font-medium mt-4 rounded-md"
      >
        Submit
      </button>
    </div>
  {/if}

  {#if $allVideos?.length > 0}
    <div class="video-entry flex flex-col w-full h-full gap-4 mt-4 max-h-[calc(100vh-260px)] overflow-y-scroll">
      {#each $allVideos as video}
        <NewPlaybackCard {video} />
      {/each}
    </div>
  {/if}
{/if}
