<script lang="ts">
  import {
    Search,
    Filter,
    Expand,
    ChevronRight,
    Trash,
    X,
  } from "lucide-svelte";
  import PocketBase from "pocketbase";
  import { addUserLog } from "@/lib/addUserLog";
  import NodeSelection from "../node/NodeSelection.svelte";
  import PlaybackList from "../lists/PlaybackList.svelte";
  import { page } from "$app/stores";
  import { convertedVideos } from "@/lib/stores";
  import Player from "../player/Player.svelte";

  let showRightPanel: boolean = true;
  let playbackFullscreen = false;
  let showFilters = false;

  export let data;
  const nodes = data.nodes;

  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  $: {
    console.log($convertedVideos);
  }
</script>

<section
  class="right-playback flex-1 flex w-full h-screen justify-between pr-2 pl-[1px]"
>
  <div class="h-full w-full">
    {#if $convertedVideos.length === 0}
      <div
        class="bg-[#333] text-white grid place-items-center w-full h-[calc(100vh-75px)]"
      >
        <p>No recordings selected</p>
      </div>
    {:else}
      <div
        class={`bg-[#333] h-[calc(100vh-75px)] grid place-items-center gap-1 w-full  ${$convertedVideos.length === 1 ? "grid-cols-1 grid-rows-1" : $convertedVideos.length === 2 ? "grid-cols-2 grid-rows-1" : "grid-rows-2 grid-cols-2"}`}
      >
        {#each $convertedVideos as video, idx (video.id)}
          {@const videos = {
            controls: true,
            srcs: [
              {
                src: video.url,
                type: "video/mp4",
              },
            ],
          }}
          <div class="grid place-items-center h-full w-full relative">
            <Player {videos} {idx} />
            <button
              class="absolute z-20 top-4 right-4 text-white"
              on:click={() => {
                $convertedVideos = $convertedVideos.filter(
                  (_, index) => index !== idx,
                );
              }}
            >
              <X size={18} class="text-white" />
            </button>
          </div>
        {/each}
      </div>
    {/if}
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
        disabled
        on:click={() => {
          addUserLog(`user clicked on Search button, top panel`);
        }}
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Search class="h-[22px] w-[22px]" /></button
      >
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Search
      </p>
    </span>
    <span
      class="group flex flex-col gap-0.5 items-center justify-center relative"
    >
      <button
        disabled
        on:click={() => (showFilters = !showFilters)}
        class={!showFilters
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `
          : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`}
        ><Filter class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Filter
      </p>
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
        disabled
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Expand class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Fullscreen
      </p>
    </span>
  </div>
</section>

<style>
  .grid-rows-1 {
    grid-template-rows: repeat(1, 100%);
  }
  .grid-rows-2 {
    grid-template-rows: repeat(2, 50%);
  }

  .grid-cols-1 {
    grid-template-columns: repeat(1, 99.9%);
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, 49.6%);
  }
</style>
