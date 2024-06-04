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
  import { toast } from "svelte-sonner";
  import { selectedNode, convertedVideos, allVideos } from "@/lib/stores";
  import { ChevronDown, CalendarDaysIcon, PlusCircle, X } from "lucide-svelte";
  import * as Select from "@/components/ui/select/index";
  export let nodes;
  export let cameraList;
  let chosenNode;
  let markedDates = [];

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
    if (selectedMode === 1) {
      allVideos.set(null);
    }
  }

  $: if (selectedCamera) {
    handleCameraChange(selectedCamera);
  }

  async function handleCameraChange(cam) {
    await fetch("/api/playbackCalendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nvr_ip: cam.nvrData.ip,
        http_port: cam.nvrData.http_port,
        username: cam.nvrData.user_id,
        password: cam.nvrData.password,
        camera_id: cam.channelId,
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString(),
      }),
    })
      .then(async (res) => {
        // const data = await res.json();
        markedDates = await res.json();
      })
      .catch((err) => console.log(err));
  }

  async function fetchPlaybackData(cameraId, date, startTime, endTime) {
    // rtsp://10.10.102.10/Streaming/tracks/101/?starttime=20240602T000026Z&endtime=20240602T000102Z&name=00010007178004201&size=10228800
    console.log(cameraId, date, startTime, endTime)

    const startTimeFormatted = startTime.replace(':', '');
    const endTimeFormatted = endTime.replace(':', '');
    // const formattedDate = new Date(date).toISOString().split('T')[0]; // Extract only the date part in YYYY-MM-DD format
    // console.log(startTimeFormatted)
    // console.log(endTimeFormatted)
    // console.log(formattedDate)

// Step 3: Create datetime objects for start and end times
const startDateTime = new Date(date);
startDateTime.setHours(parseInt(startTimeFormatted.slice(0, 2)), parseInt(startTimeFormatted.slice(2, 4)));

const endDateTime = new Date(date);
endDateTime.setHours(parseInt(endTimeFormatted.slice(0, 2)), parseInt(endTimeFormatted.slice(2, 4)));

// Step 4: Convert to UTC format
const startTimeUTC = startDateTime.toISOString();
const endTimeUTC = endDateTime.toISOString();
    // const startTimeUTC = new Date(`${formattedDate}T${startTimeFormatted}:00Z`).toISOString(); // Added ':00' to ensure proper time format
    // const endTimeUTC = new Date(`${formattedDate}T${endTimeFormatted}:00Z`).toISOString(); // Added ':00' to ensure proper time format
 const s = startTimeUTC.replace(/[-_:.]/g, '')
const e = endTimeUTC.replace(/[-_:.]/g, '')

    const genratedLink =  `rtsp://${cameraId.nvrData.user_id}:${cameraId.nvrData.password}@${cameraId.nvrData.ip}:554/Streaming/tracks/${cameraId.channelId}/?startTime=${s}&endtime=${e}&size=290328`

    console.log(genratedLink)
    // http://localhost:8085/api/startplayback?id=1234&name=Pranit&url=rtsp://admin:Admin7890@10.20.30.14&subUrl=rtsp://admin:Admin7890@10.20.30.15&node=123
    await fetch(`http://localhost:8085/api/startplayback?id=${cameraId.nvrData.ip+'/'+cameraId.channelId}&name=${cameraId.channelId}&url=${genratedLink}&subUrl=${genratedLink}`,{
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }
    }).then(async(res) => {console.log(res);
const data= await res.json()
console.log(data)
if(data === 'Success') {
  console.log('success')
  convertedVideos.set([cameraId])
}
    
    }).catch((err) => console.log(err))

    // const url = "/api/playbackVideo/get";
    // const payload = {
    //   cameraId,
    //   date,
    //   startTime,
    //   endTime,
    // };

    // try {
    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || "Unknown error occurred");
    //   }

    //   const data = await response.json();
    //   console.log("Playback Data:", data);
    //   if (data?.playback_data?.length > 0) {
    //     // convertedVideos.set(data.playback_data);
    //     if ($convertedVideos.length <= 3) {
    //       convertedVideos.update((videos) => [
    //         ...videos,
    //         data.playback_data[0],
    //       ]);
    //     } else {
    //       toast.error("Maximum limit of 4 videos reached");
    //     }
    //   } else {
    //     console.log("no videos with this time range");
    //     toast.error("No videos in this time range");
    //   }
    //   return data;
    // } catch (error) {
    //   console.error("Error fetching playback data:", error);
    // }
  }

  async function fetchFromDate(date) {
    const nodeIds = nodes.map((node) => node.id);
    const response = await fetch("/api/playbackVideo/getMany", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, nodeId: nodeIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.error}`);
    }

    const data = await response.json();
    console.log("data from data", data);
    allVideos.set(data.playback_data);
    if (data.playback_data?.length === 0) {
      toast.error(`No Recordings on chosen Date: ${searchDate}`);
    }
    return data;
  }

  // $: console.log(chosenNode)

  $: filteredVideos = $allVideos?.filter(
    (video) =>
      !chosenNode?.value ||
      chosenNode.value === "all" ||
      chosenNode.value === video.cameraNode,
  );
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
    <label for="camera" class="text-black/[.7] dark:text-slate-200 text-sm"
      >Select Camera</label
    >
    <div class="relative w-full">
      <select
        bind:value={selectedCamera}
        class={`block text-primary capitalize font-semibold rounded-md appearance-none w-full bg-[#F6F6F6] dark:bg-black border-2 py-2 text-sm px-2 leading-tight `}
      >
        <option value="" disabled selected>Select from list</option>
        <!-- {#each $selectedNode?.camera as cam}
          <option value={cam.id}>{cam.name}</option>
        {/each} -->
        {#if cameraList?.length !== 0}
          {#each cameraList as cam}
            <option value={cam}>{cam.matchedChannelName}</option>
          {/each}
        {/if}
      </select>
      <ChevronDown
        size={22}
        class="text-[#727272] absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none cursor-pointer outline-none"
      />
    </div>
  </div>
  <div class="px-4 flex flex-col gap-1">
    <label for="camera" class="text-black/[.7] dark:text-slate-200 text-sm"
      >Select Date</label
    >
    <div class="relative w-full">
      <input
        type="text"
        placeholder="DD MONTH YY"
        disabled
        bind:value={searchDate}
        on:change={(e) => (searchDate = e.target.value)}
        class=" rounded-md block capitalize border-2 text-sm px-2 py-2 leading-tight w-full bg-[#f6f6f6] dark:bg-black text-[#979797]"
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
          {markedDates}
          {selectedCamera}
          bind:value
          class=" bg-white dark:bg-black absolute top-14 right-0 z-[99999999] px-4 py-2 flex flex-col items-center justify-center rounded-md border border-solid border-[#929292]"
        />
      {/if}
    </div>
  </div>
  <div class="px-4 w-full py-4 flex flex-row items-center gap-3">
    <span>
      <label
        for="start-time"
        class="text-black/[.7] dark:text-slate-200 text-sm">Start Time</label
      >
      <input
        type="time"
        id="start-time"
        bind:value={startTime}
        placeholder="00:00"
        class="block rounded-md capitalize border-2 text-sm px-2 py-2 leading-tight w-full bg-[#f6f6f6] text-[#979797] dark:bg-black"
      />
    </span>
    <span>
      <label for="end-time" class="text-black/[.7] text-sm">End Time</label>
      <input
        type="time"
        id="end-time"
        bind:value={endTime}
        placeholder="00:00"
        class="block rounded-md capitalize border-2 text-sm px-2 py-2 leading-tight w-full bg-[#f6f6f6] text-[#979797] dark:bg-black"
      />
    </span>
  </div>
  <div class="w-full px-4 mt-4">
    <button
      class="flex items-center gap-2 w-full text-primary border border-primary rounded-md text-sm py-2 text-center justify-center"
    >
      Add More <PlusCircle size={18} />
    </button>
  </div>
  <div class="px-4 w-full">
    <button
      class="text-white bg-primary w-full py-2 text-sm font-medium mt-4 rounded-md"
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
      class="absolute top-1/2 -translate-y-1/2 left-[1.5rem] grid place-items-center"
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
      class=" h-full block rounded-md capitalize border-2 text-sm pl-8 pr-4 py-2 leading-tight w-full bg-[#f6f6f6] text-[#979797] dark:bg-black"
    />

    <button
      class="absolute top-1/2 -translate-y-1/2 right-[1.5rem] grid place-items-center"
      on:click={() => {
        value = null;
        searchDate = null;
      }}
    >
      <X class="text-[#727272]" size={20} />
    </button>
    {#if showCalendar}
      <Calendar
        {markedDates}
        {selectedCamera}
        bind:value
        class=" bg-white dark:bg-black absolute top-14 right-0 z-[99999999] px-4 py-2 flex flex-col items-center justify-center rounded-md border border-solid border-[#929292]"
      />
    {/if}
  </div>

  {#if searchDate}
    <div class="px-4 w-full">
      <button
        on:click={() => fetchFromDate(searchDate)}
        class="text-white bg-primary w-full py-1 text-sm font-medium mt-4 rounded-md"
      >
        Submit
      </button>
    </div>
  {/if}

  {#if $allVideos?.length > 0}
    <div
      class="video-entry flex flex-col w-full h-full gap-4 mt-4 max-h-[calc(100vh-260px)] pb-20 overflow-y-scroll"
    >
      <p class="text-sm mx-auto">Filter Videos according to Node:</p>
      <Select.Root bind:selected={chosenNode}>
        <Select.Trigger
          class="px-3 py-2 text-start w-[90%] mx-auto bg-[#f6f6f6] dark:bg-black text-[#979797] border-2 font-semibold outline-none"
        >
          <Select.Value placeholder="Node Filter" />
        </Select.Trigger>
        <Select.Content class="max-h-[400px] overflow-y-scroll overflow-x-none">
          <Select.Item value="all">All</Select.Item>
          {#each nodes as node}
            <Select.Item value={node.id}>{node.name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <!-- {#each $allVideos as video}
        <NewPlaybackCard {video} />
      {/each} -->
      {#if filteredVideos.length !== 0}
        {#each filteredVideos as video}
          <NewPlaybackCard {video} />
        {/each}
      {:else}
        <p class="text-[#979797[ text-sm mx-auto">
          No recordings on this filter Node
        </p>
      {/if}
    </div>
  {/if}
{/if}
