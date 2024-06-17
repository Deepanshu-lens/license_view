<!-- <script lang="ts">
  import {
    Search,
    Filter,
    Expand,
    ChevronRight,
    Trash,
    X
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
const nodes = data.nodes

  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

$: {
console.log($convertedVideos)
}

</script>

<section
  class="right-playback flex-1 flex w-full h-screen justify-between pr-2 pl-[1px]"
>
<div class='h-full w-full'>
  {#if $convertedVideos.length === 0} 
  <div class="bg-[#333] text-white grid place-items-center w-full h-[calc(100vh-75px)]">
    <p>No recordings selected</p>
  </div>
  {:else}
  <div class={`bg-[#333] h-[calc(100vh-75px)] grid place-items-center gap-1 w-full  ${$convertedVideos.length=== 1 ? 'grid-cols-1 grid-rows-1': $convertedVideos.length === 2 ? 'grid-cols-2 grid-rows-1': 'grid-rows-2 grid-cols-2'}`}>
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
        <button class='absolute z-20 top-4 right-4 text-white' on:click={() => {
          $convertedVideos = $convertedVideos.filter((_, index) => index !== idx);
        }}>
        <X size={18} class='text-white'/>
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
      <button disabled
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
      <button disabled
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
      <button disabled
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
</style> -->



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
  import PlaybackList from "../lists/PlaybackList.svelte";
  import { page } from "$app/stores";
  import { convertedVideos, selectedNode, uniqueUrlList } from "@/lib/stores";
  import { onMount } from "svelte";
  import * as Select from "@/components/ui/select/index";
  import PlaybackStream from "./PlaybackStream.svelte";
  import { onDestroy } from "svelte";
    import NodeSelection from "../node/NodeSelection.svelte";
    import { get, writable } from "svelte/store";
  let showRightPanel: boolean = true;
  let playbackFullscreen = false;
  let showFilters = false;
  let nvrList = writable([]);
  let cameraList = [];
  let currentNvr;
  
  let videos: { [key: string]: HTMLElement } = {};

  export let data;
  const nodes = data.nodes;

  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  // onMount(async () => {
  //   if ($selectedNode) {
  //     const list = await PB.collection("nvr").getFullList({
  //       filter: `node~"${$selectedNode.id}"`,
  //     });
  //     nvrList.set(list)
  //   }

  // //   PB.collection('node').subscribe('*',async (e) => {
  // //     console.log('change detected in node playback page')
  // //     const list = await PB.collection('nvr').getFullList({
  // //       filter: `node~${$selectedNode.id}`
  // //     })
  // //     nvrList.set(list)
  // //   })

  // });


  onMount(async () => {
    if (get(selectedNode)) {
      const list = await PB.collection("nvr").getFullList({
        filter: `node~"${get(selectedNode).id}"`,
      });
      nvrList.set(list);
    }
  });

  $: if (selectedNode) {
    (async () => {
      const list = await PB.collection("nvr").getFullList({
        filter: `node~"${$selectedNode.id}"`,
      });
      nvrList.set(list);
    })();
  }

  // onDestroy(() => {
  //   PB.collection('node').unsubscribe('*')
  // })



  const initVideo = async (camera, index) => {
    console.log(index);

    if (videos[index]) {
      console.log("video c.id exists", index);
      return;
    }
    console.log(
      `ws://${$page.url.hostname}:8082/api/ws?src=${currentNvr?.ip + "/" + camera.url.split('channels/')[1]}&nodeID=${1}&cn=${camera?.expand?.camera?.name}`,
    );
    let video = document.createElement("video-stream") as VideoStreamType;
    video.id = `playback-stream-${index}`;
    video.mode = "mse";
    video.url = camera.url;
    video.src = new URL(
      `ws://${$page.url.hostname}:8082/api/ws?src=${currentNvr?.ip.replace(/\./g, '_') + "_" + camera.url.split('channels/')[1]}&nodeID=${1}&cn=${camera?.expand?.camera?.name}`,
    );
    video.style.position = "relative";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.zIndex = "10";
    video.background = true;
    video.visibilityCheck = false;
    videos[index] = video;
    // console.log(videos[camera.id]);

    // console.log(videos)
  };

  async function getList(item) {
    // await fetch("/api/playbackCameraList", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     nvr_ip: item.ip,
    //     http_port: item.http_port,
    //     username: item.user_id,
    //     password: item.password,
    //   }),
    // })
    //   .then(async (res) => {
    //     const data = await res.json();
    //     data.matchedChannels.forEach((channel, index) => {
    //       data.matchedChannels[index] = { ...channel, nvrData: item };
    //     });
    //     cameraList = data.matchedChannels;
    //   })
    //   .catch((err) => console.log(err));
      const list = await PB.collection('camera_ping_status').getList(1,100,{
        filter: `node~"${$selectedNode.id}"`,
        sort: "-created",
        expand: 'camera'
        
      });
      console.log('camera status list',list)
  list.items.forEach(item => {
    if (!$uniqueUrlList.some(uniqueItem => uniqueItem.url === item.url)) {
      uniqueUrlList.update(currentList => {
        currentList.push(item);
        return currentList;
      });
    }
  });
}
console.log($uniqueUrlList);

  $: if ($convertedVideos.length > 0) {
    // console.log("first");
    $convertedVideos.forEach((video, index) => {
      if (videos[index]) {
        console.log("video exists", index);
      } else {
        console.log("initing video", index);
        initVideo(video, index);
      }
    });
  }

  async function removePlayers () {
    $convertedVideos.forEach(async (video,index) => {
      console.log(video)
      await fetch(
        `http://${$page.url.hostname}:8085/api/endplayback?id=${video.nvrData.ip.replace(/\./g, "_") + "_" + video.channelId}&name=${video.channelId}&url=url&subUrl=subUrl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
        .then(async (res) => {
          const data = await res.json();
          console.log(data);
          if(videos[index]) {
            if(videos[index].src instanceof WebSocket && videoElement.src.readyState === WebSocket.OPEN) {
              videos[index].src.close()
            }
            videos[index].remove()
            delete videos[index]
            convertedVideos.set([])
            // setTimeout(() => {
            //   initVideo(video,index)
            // }, 100);

          }
        })
        .catch((err) => console.log(err));
    });
  }

  // $: console.log(videos)
  onDestroy(async() => {
    await removePlayers()
  });
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
        {#each $convertedVideos as video, index}
          <div class="grid place-items-center h-full w-full relative">
            <PlaybackStream videoElement={videos[index]} />
            <button
              class="absolute top-2 right-2 text-white cursor-pointer z-10"
              on:click={async () => {
                convertedVideos.update((videos) =>
                  videos.filter((_, i) => i !== index),
                );
                await fetch(
                  `http://${$page.url.hostname}:8085/api/endplayback?id=${video.nvrData.user_id + "/" + video.channelId}&name=${video.channelId}&url=url&subUrl=subUrl`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                )
                  .then(async (res) => {
                    const data = await res.json();
                    console.log(data);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              <X />
            </button>
            <!-- <button class="text-red-600 absolute top-6 right-2 z-20" on:click={() => singlerefresh(video,index)}>
              refresh
            </button> -->
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
        {data}
        {nodes}
        url={data.url ?? "/"}
        isAllFullScreen={playbackFullscreen}
      />
      <Select.Root on:change={getList}>
        <Select.Trigger class="w-full border-none focus:ring-0">
          <Select.Value placeholder="Select NVR" />
        </Select.Trigger>
        <Select.Content>
          {#each $nvrList as item}
            <Select.Item value={item} on:click={() => {currentNvr = item; getList(item)}}
              >{item.name}</Select.Item
            >
          {/each}
          <!-- <Select.Item value="density">Sort By: Density</Select.Item>
          <Select.Item value="growth">Sort By:Growth Rate</Select.Item> -->
        </Select.Content>
      </Select.Root>
      <PlaybackList {nodes} {cameraList} {uniqueUrlList} {currentNvr}/>
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

