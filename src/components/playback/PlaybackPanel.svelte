<script lang="ts">
  import { Calendar } from "@/components/ui/calendar";
  import {
    CalendarDays,
    X,
    Shrink,
    ListFilter,
    Search,
    Filter,
    Expand,
    ChevronRight,
  } from "lucide-svelte";
  import PlaybackVideoCard from "../cards/PlaybackVideoCard.svelte";
  import { activeCamera, alertPanelHide, playbackVideos } from "@/lib/stores";
  import { cn } from "@/lib";
  import PocketBase, { Record } from "pocketbase";
  import { onDestroy, onMount } from "svelte";
  import type { Playback } from "@/types";
  import { addUserLog } from "@/lib/addUserLog";
  import NodeSelection from "../node/NodeSelection.svelte";
  import PlaybackList from "../lists/PlaybackList.svelte";
  import { toast } from "svelte-sonner";
  import LayoutDialog from "../dialogs/LayoutDialog.svelte";
  import RegisterDialog from "../dialogs/RegisterDialog.svelte";
  import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

  let showCalendar: boolean = false;
  let showRightPanel: boolean = true;
  let value = null;
  let searchDate: string = "";
  let queryDate = "";
  let playbackFullscreen = false;
  let showFilters = false;
  let manual: boolean = false;
  export let webmFiles;
  export let data;
  const nodes = data.nodes;

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

  // const PB = new PocketBase(PUBLIC_POCKETBASE_URL);
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

<section
  class="right-playback flex-1 flex w-full h-screen justify-between px-2"
>
  <div class="w-full h-full">
    <div class="top2 flex items-center justify-between pr-6 py-2.5">
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
        "flex flex-col overflow-y-scroll pr-6 bg-white dark:bg-black relative ml-2",
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
        class="text-base font-medium dark:text-[#e0e0e0] text-[#212427] pr-6 mb-2"
      >
        Files that got converted
      </span>
      <div
        class={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 mb-6",
        )}
      >
        {#if webmFiles.length > 0}
          {#each webmFiles as video}
            <PlaybackVideoCard {video} />
          {/each}
        {:else}
          <span
            class="text-sm font-medium dark:text-[#e0e0e0] text-[#212427] pr-6 py-4"
          >
            No items found
          </span>
        {/if}
      </div>
      <span
        class="text-base font-medium dark:text-[#e0e0e0] text-[#212427] pr-6 mb-2"
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
            class="text-sm font-medium dark:text-[#e0e0e0] text-[#212427] px-r py-4"
          >
            No items found
          </span>
        {/if}
      </div>
    </div>
  </div>

  <div
    class={`h-[calc(100vh-75px)] ${showRightPanel ? "w-1/4 max-w-72 " : "w-0"} transition-width ease-in-out duration-500 dark:border-[#292929] border-x-[1px] relative`}
  >
    <button
      on:click={() => (showRightPanel = !showRightPanel)}
      class={`absolute ${showRightPanel ? "-left-6" : "-left-6"} py-1 rounded-l-md bg-[#f9f9f9] dark:bg-slate-800  top-1/2 -translate-y-1/2 shadow-md transition-position ease-in-out duration-500 z-[99999]`}
    >
      <ChevronRight
        class={`${showRightPanel ? "rotate-0" : "rotate-180"} transition-transform ease-in-out duration-700`}
      />
    </button>
    <div
      class={`${showRightPanel ? "opacity-100" : "opacity-0"} transtion-opacity ease-in-out duration-500 `}
    >
      <NodeSelection
        {nodes}
        url={data.url ?? "/"}
        isAllFullScreen={playbackFullscreen}
      />
      <PlaybackList />
    </div>
  </div>
  <div
    class="flex flex-col gap-4 items-center justify-center pl-2 h-[calc(100vh-76px)]"
  >
    <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        on:click={() => {
          addUserLog(`user clicked on Search button, top panel`);
        }}
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`}
        ><Search class="h-[22px] w-[22px]" /></button
      >
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">Search</p>
    </span>
    <span
      class="group flex flex-col gap-0.5 items-center justify-center relative"
    >
      <button
        on:click={() => (showFilters = !showFilters)}
        class={!showFilters
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`
          : ` border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><Filter class="h-[22px] w-[22px]" />
      </button>
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">Filter</p>
      {#if showFilters}
        <div
          id="dropdownDefaultCheckbox"
          class="z-20 flex w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-[#242424] dark:divide-gray-600 absolute right-14"
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
    <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`}
        ><Expand class="h-[22px] w-[22px]" />
      </button>
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">
        Fullscreen
      </p>
    </span>
  </div>
</section>
