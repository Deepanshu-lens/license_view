<script lang="ts">
  import { Calendar } from "@/components/ui/calendar";
  import { CalendarDays, X, Shrink, Expand, ListFilter } from "lucide-svelte";
  import PlaybackVideoCard from "../cards/PlaybackVideoCard.svelte";
  import { playbackVideos } from "@/lib/stores";
  import { cn } from "@/lib";
  import PocketBase, { Record } from "pocketbase";
  import { onDestroy, onMount } from "svelte";
  import type { Playback } from "@/types";
  import { addUserLog } from "@/lib/addUserLog";

  let showCalendar: boolean = false;
  let value = null;
  let searchDate: string = "";
  let queryDate = "";
  let playbackFullscreen = false;
  let showFilters = false;
  let manual: boolean = false;
  export let webmFiles;

  function handleDateInput() {
    const formattedInput = new Date(searchDate);
    if (searchDate.length === 0) queryDate = "";
    // console.log(searchDate);
    // console.log(queryDate);
    if (!isNaN(formattedInput)) {
      const inputDate = formattedInput.toString().slice(0, 15);
      queryDate = inputDate;
    }
  }

  $: if (value) {
    const date = new Date(value.year, value.month - 1, value.day);

    // Convert to desired format
    let formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    console.log(formattedDate);
    searchDate = formattedDate;
    queryDate = formattedDate;
    formattedDate = null;
    showCalendar = false;
    value = null;
  }

  const PB = new PocketBase("http://127.0.0.1:5555");

  PB.collection("playback").subscribe("*", async (e) => {
    playbackVideos.set(await getPlaybackData());
    console.log($playbackVideos);
  });

  async function getPlaybackData(): Promise<Playback[]> {
    console.log("Getting playback data");
    const data = await PB.collection("playback").getFullList({
      sort: "-startTime",
    });
    return data.map(
      (event) =>
        ({
          ...event,
          startTime: new Date(event.startTime),
        }) as unknown as Playback,
    );
  }

  onMount(async () => {
    playbackVideos.set(await getPlaybackData());
    // console.log($playbackVideos);
  });

  onDestroy(() => {
    PB.collection("playback").unsubscribe("*");
  });
  // console.log(webmFiles);

  let processedVideos;
  $: {
    processedVideos = $playbackVideos.map((video) => {
      // console.log(video);
      return webmFiles
        .filter((file) => {
          return video.url.split("/")[2].includes(file.split(".")[0]);
        })
        .map((file) => {
          // console.log(file, video);
          return { ...video, webmFile: file };
        });
    });
    processedVideos = processedVideos.filter(
      (videoArray) => videoArray.length > 0,
    );
  }

  const singleFullscreen = () => {
    let cell = document.getElementById(`scrollableEle`);
    cell?.requestFullscreen({ navigationUI: "show" });
    playbackFullscreen = true;
  };

  const exitSingleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      playbackFullscreen = false;
    }
  };

  const onFullscreenChange = () => {
    if (!document.fullscreenElement) {
      console.log("Exited fullscreen mode");
      playbackFullscreen = false;
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    }
  };

  $: {
    if (playbackFullscreen) {
      document.addEventListener("fullscreenchange", onFullscreenChange);
    } else {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    }
  }
</script>

<section class="right-playback flex-1">
  <div
    class="top w-full flex flex-row items-center justify-between px-6 border-b-[1px] border-solid h-[57px]"
  >
    <div class="flex gap-6 items-center">
      <span class="flex items-center justify-center gap-5">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          class="relative"
          on:click={() => addUserLog("user clicked on date input playback")}
        >
          <input
            id="search-input"
            type="text"
            class="bg-transparent border border-gray-300 text-gray-900 dark:text-white capitalize text-sm sm:text-[8px] md:text-[10px] lg:text-sm xl:text-md rounded-lg block px-10 py-2 box-border dark:focus:border-black dark:active:border-black w-[260px]"
            placeholder="Enter Date  DD/MM/YYYY"
            bind:value={searchDate}
            on:input={handleDateInput}
          />
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <span
            class="absolute top-1/2 -translate-y-1/2 left-[10px] text-[#4f4f4f] dark:text-white cursor-pointer scale-90 z-20"
            on:click={() => {
              showCalendar = !showCalendar;
            }}
          >
            <CalendarDays />
          </span>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <span
            on:click={() => ((searchDate = ""), (queryDate = ""))}
            class="absolute top-1/2 -translate-y-1/2 right-[10px] text-[#4f4f4f] dark:text-white cursor-pointer scale-75"
          >
            <X />
          </span>
          {#if showCalendar}
            <Calendar
              bind:value
              class=" bg-white dark:bg-black absolute top-14 z-40 px-4 py-2 flex flex-col items-center justify-center rounded-md border border-solid border-[#929292]"
            />
          {/if}
        </span>
      </span>
      <span class="relative">
        <button
          class="flex item-center gap-2"
          on:click={() => {
            showFilters = !showFilters;
            addUserLog("user clicked on filter button playback");
          }}
        >
          <ListFilter /> Filter
        </button>
        {#if showFilters}
          <div
            id="dropdownDefaultCheckbox"
            class="z-20 flex w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-[#242424] dark:divide-gray-600 absolute top-8 left-0"
          >
            <ul
              class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownCheckboxButton"
            >
              <li>
                <label
                  for="checkbox-item-1"
                  class=" text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  <input
                    id="checkbox-item-1"
                    type="checkbox"
                    class="w-4 h-4 mr-2"
                  />
                  Object Detection
                </label>
              </li>
              <li>
                <label
                  for="checkbox-item-2"
                  class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  <input
                    id="checkbox-item-2"
                    type="checkbox"
                    class="w-4 h-4 mr-2"
                  />
                  Fire Detection
                </label>
              </li>
              <li>
                <label
                  for="checkbox-item-3"
                  class=" text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center"
                >
                  <input
                    id="checkbox-item-3"
                    type="checkbox"
                    class="w-4 h-4 mr-2"
                  />
                  24 hour feed
                </label>
              </li>
              <li>
                <label
                  class=" flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  <input
                    id="checkbox-item-4"
                    type="checkbox"
                    class="w-4 h-4 mr-2"
                  />
                  Action Detection
                </label>
              </li>
              <li>
                <label
                  for="checkbox-item-5"
                  class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  <input
                    id="checkbox-item-5"
                    type="checkbox"
                    class="w-4 h-4 mr-2"
                  />
                  All
                </label>
              </li>
            </ul>
          </div>
        {/if}
      </span>
    </div>
    <div class="flex flex-row items-center gap-4">
      <!-- <button
        class="flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
        ><Disc2 size={18} /> Record all feed</button
      >
      <Separator orientation="vertical" class="h-6 text-[#e0e0e0]" />
      <button
        class="flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
        ><ImageDown size={18} />Screen snip</button
      >
      <Separator orientation="vertical" class="h-6 text-[#e0e0e0]" />
      <button
        class="flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
        ><Bell size={18} />Alerts</button
      >
      <Separator orientation="vertical" class="h-6 text-[#e0e0e0]" /> -->
      <button
        on:click={() => {
          singleFullscreen();
          addUserLog("user clicked on fulscreen button playback");
        }}
        class="flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
        ><Expand size={18} /> Fullscreen</button
      >
    </div>
  </div>
  <div class="top2 flex items-center justify-between px-6 py-4">
    <div class="flex items-center justify-center gap-4">
      <button
        class={!manual
          ? "font-semibold text-sm text-white px-4 py-1.5 rounded-md bg-[#015A62] border-solid border border-[#015A62] w-[135px]"
          : "font-semibold text-sm bg-white px-4 py-1.5 rounded-md text-[#015A62] dark:border-none dark:bg-[#333] dark:text-[white] border-solid border border-[#015A62] w-[135px]"}
        on:click={() => {
          manual = false;
          addUserLog("user clicked on automated button playback");
        }}
      >
        Automated
      </button>
      <button
        class={!manual
          ? "font-semibold text-sm bg-white px-4 py-1.5 rounded-md text-[#015A62] dark:border-none dark:bg-[#333] dark:text-[white] border-solid border border-[#015A62] w-[135px]"
          : "font-semibold text-sm text-white px-4 py-1.5 rounded-md bg-[#015A62] border-solid border border-[#015A62] w-[135px]"}
        on:click={() => {
          manual = true;
          addUserLog("user clicked on manual button playback");
        }}
      >
        Manual
      </button>
    </div>
    <div class="text-[#015A62]">
      {queryDate.length === 0 ? "Date" : queryDate}
    </div>
  </div>
  <div
    id="scrollableEle"
    class={cn(
      "flex flex-col overflow-y-scroll px-6 bg-white dark:bg-black relative ml-2",
      playbackFullscreen ? "max-h-screen py-8" : "max-h-[calc(100vh-200px)]",
    )}
  >
    {#if playbackFullscreen}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        on:click={() => {
          exitSingleFullscreen();
          addUserLog("user clicked on Minimize button playback");
        }}
        class=" cursor-pointer absolute top-4 right-4 backdrop-blur-sm bg-[rgba(0,0,0,0.6)] p-1.5 rounded-sm text-white flex items-center gap-2"
      >
        <Shrink size={18} /> Minimize
      </span>
    {/if}
    <span
      class="text-base font-medium dark:text-[#e0e0e0] text-[#212427] px-6 mb-2"
    >
      Files that got converted
    </span>
    <div
      class={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6")}
    >
      <!-- {#each $playbackVideos.filter((item) => {
      if ($selectedPlaybackDate === "") return true;
      const [day, month, year] = new Date(item.startTime)
        .toISOString()
        .split("/")
        .map(Number);
      const rawDate = new Date(year, month - 1, day);
      const formattedDate = rawDate.toLocaleDateString( "en-US", { year: "numeric", month: "long", day: "numeric" }, );
      return formattedDate === $selectedPlaybackDate;
    }) as video}
      <PlaybackVideoCard {video} />
    {/each} -->
      {#if webmFiles.length > 0}
        {#each webmFiles as video}
          <PlaybackVideoCard {video} />
        {/each}
      {:else}
        <span
          class="text-sm font-medium dark:text-[#e0e0e0] text-[#212427] px-6 py-4"
        >
          No items found
        </span>
      {/if}
    </div>
    <span
      class="text-base font-medium dark:text-[#e0e0e0] text-[#212427] px-6 mb-2"
    >
      Files that match db
    </span>
    <div class={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
      {#if processedVideos.length > 0}
        {#each processedVideos as video}
          <PlaybackVideoCard {video} />
        {/each}
      {:else}
        <span
          class="text-sm font-medium dark:text-[#e0e0e0] text-[#212427] px-6 py-4"
        >
          No items found
        </span>
      {/if}
    </div>
  </div>
</section>
