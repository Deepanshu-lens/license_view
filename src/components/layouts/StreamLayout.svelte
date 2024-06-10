<script lang="ts">
  import PocketBase from "pocketbase";
  import { mode } from "mode-watcher";
  import { activeCamera } from "@/lib/stores";
  import { cn } from "@/lib";
  import { selectedNode, filteredNodeCameras } from "@/lib/stores";
  import Stream from "@/components/stream/Stream.svelte";
  import type { Camera } from "@/types.d.ts";
  import * as Carousel from "@/components/ui/carousel/index.js";
  import AddCameraDialog from "../dialogs/AddCameraDialog.svelte";
  import {
    AArrowUp,
    Disc2,
    Expand,
    ImageDown,
    Menu,
    RefreshCcw,
  } from "lucide-svelte";
  import { Shrink } from "lucide-svelte";
  import { addUserLog } from "@/lib/addUserLog";
  import { page } from "$app/stores";
  import Sortable from "sortablejs";
  import { onDestroy, onMount } from "svelte";

  export let handleSingleSS: () => void;
  export let isAllFullScreen: boolean;
  export let data;

  let streamCount =
    $selectedNode.camera.length === $filteredNodeCameras.length
      ? $selectedNode.camera.length
      : $filteredNodeCameras.length === 0
        ? $selectedNode.camera.length
        : $filteredNodeCameras.length; // Number of video streams
  let layoutRows = 1; // Default layout rows
  let layoutColumns = 1; // Default layout columns
  let totalPages = 1;
  let isSingleFullscreen: boolean = false;
  let videos: { [key: string]: HTMLElement } = {};
  let cells: HTMLDivElement;
  let ele;
  let slideIndex: number = 0;

  const neededUrl = $page.url.hostname;

  const initVideo = async (camera: Camera) => {
    const index = $selectedNode.camera.findIndex((cam) => cam.id === camera.id);
    if (videos[camera.id]) {
      console.log("video c.id exists", camera.name);
      return;
    }

    let video = document.createElement("video-stream") as VideoStreamType;
    video.id = `stream-${camera.id}`;
    video.mode = "webrtc";
    video.url = camera.url;
    camera?.subUrl?.length === 0
      ? (video.src = new URL(
          `ws://${neededUrl}:8082/api/ws?src=${camera.id}&nodeID=${1}&cn=${camera.name}`,
        ))
      : ($selectedNode.maxStreamsPerPage === 13 ||
            $selectedNode.maxStreamsPerPage === 5 ||
            $selectedNode.maxStreamsPerPage === 7) &&
          index === 0
        ? (video.src = new URL(
            `ws://${neededUrl}:8082/api/ws?src=${camera.id}_FULL&nodeID=${1}&cn=${camera.name}`,
          ))
        : $selectedNode.maxStreamsPerPage === 10 && (index === 0 || index === 1)
          ? (video.src = new URL(
              `ws://${neededUrl}:8082/api/ws?src=${camera.id}_FULL&nodeID=${1}&cn=${camera.name}`,
            ))
          : (video.src = new URL(
              isSingleFullscreen
                ? `ws://${neededUrl}:8082/api/ws?src=${camera.id}_FULL&nodeID=${1}&cn=${camera.name}`
                : `ws://${neededUrl}:8082/api/ws?src=${camera.id}&nodeID=${1}&cn=${camera.name}`,
            ));
    video.style.position = "relative";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.zIndex = "10";
    video.background = true;
    video.visibilityCheck = false;
    videos[camera.id] = video;
  };

  const singleFullscreen = (slotIndex: number) => {
    let cell = document.getElementById(`grid-cell-${slotIndex}`);
    cell?.requestFullscreen({ navigationUI: "show" });
    isSingleFullscreen = true;
  };

  const exitSingleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isSingleFullscreen = false;
    }
  };

  const onFullscreenChange = (event) => {
    if (isSingleFullscreen) {
      if (document.fullscreenElement) {
        const fullscreenElementId = document.fullscreenElement?.id;
        ele = fullscreenElementId;
      }
    }
    if (!document.fullscreenElement) {
      console.log("Exited fullscreen mode");
      const parent = document.getElementById(ele);
      const videoStreamElement = parent.querySelector("video-stream");
      if (videoStreamElement) {
        const matchingCamera = $selectedNode.camera.find(
          (c) => c.url === videoStreamElement.url,
        );
        const matchingCameraId = matchingCamera ? matchingCamera.id : null;
        if (matchingCameraId !== null) {
          isSingleFullscreen = false;
          videos[matchingCameraId].remove();
          delete videos[matchingCameraId];
          initVideo(matchingCamera);
        }
      } else {
        console.log("No video-stream element found in the parent.");
      }
      isSingleFullscreen = false;
      updateLayout($selectedNode.maxStreamsPerPage);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    }
  };

  const refreshVideoStream = (cameraId: string) => {
    const videoElement = videos[cameraId];
    if (videoElement) {
      if (
        videoElement.src instanceof WebSocket &&
        videoElement.src.readyState === WebSocket.OPEN
      ) {
        console.log("first");
        videoElement.src.close();
      }
      console.log(videoElement);
      videoElement.remove();
      delete videos[cameraId];
      const camera = $selectedNode.camera.find((c) => c.id === cameraId);
      console.log(camera.name);
      if (camera) {
        initVideo(camera);
      }
    }
  };

  function handleSlideChange() {
    const startIndex = slideIndex * $selectedNode.maxStreamsPerPage;
    const endIndex = startIndex + $selectedNode.maxStreamsPerPage;
    const camerasOnSlide = $selectedNode.camera.slice(startIndex, endIndex);
    const cameraIds = camerasOnSlide.map((camera) => camera.id);
    cameraIds.forEach((cameraId) => {
      refreshVideoStream(cameraId);
    });
  }

  function handlePrevious() {
    if (slideIndex > 0) {
      slideIndex -= 1;
    }
    handleSlideChange();
  }

  function handleNext() {
    if (slideIndex < totalPages - 1) {
      slideIndex += 1;
    }
    handleSlideChange();
  }

  let prevName = $selectedNode.name;

  const updateLayout = (maxStreamsPerPage: number) => {
    if ($selectedNode.name !== prevName) {
      Object.keys(videos).forEach((videoId) => {
        const videoElement = videos[videoId];
        if (videoElement) {
          videoElement.remove();
        }
      });
      videos = {};
      prevName = $selectedNode.name;
    }
    slideIndex = 0;
    $selectedNode.camera.map((c) => {
      if (!videos[c.id]) {
        console.log("c", c);
        initVideo(c);
      } else {
        if (videos[c.id].url !== c.url) {
          videos[c.id].url = c.url;
          videos[c.id].src = new URL(
            `ws://${neededUrl}:8082/api/ws?src=${c.id}&nodeID=${1}`,
          );
        }
      }
    });

    streamCount =
      $selectedNode.camera.length === $filteredNodeCameras.length
        ? $selectedNode.camera.length
        : $filteredNodeCameras.length === 0
          ? $selectedNode.camera.length
          : $filteredNodeCameras.length;

    if (maxStreamsPerPage === 0) {
      // Automatic Layout
      // const squareRoot = Math.ceil(Math.sqrt(streamCount !== $filteredNodeCameras?.length ? $filteredNodeCameras?.length :streamCount));
      // console.log(streamCount)
      const squareRoot = Math.ceil(Math.sqrt(streamCount));
      if (Number.isInteger(Math.sqrt(streamCount))) {
        layoutColumns = squareRoot;
      } else {
        layoutColumns = squareRoot <= 4 ? squareRoot : 5;
      }
      // layoutRows = Math.ceil(streamCount !== $filteredNodeCameras?.length ? $filteredNodeCameras?.length :streamCount / layoutColumns);
      layoutRows = Math.ceil(streamCount / layoutColumns);
    } else if (
      streamCount !== 0 &&
      maxStreamsPerPage !== 10 &&
      maxStreamsPerPage !== 13 &&
      maxStreamsPerPage !== 5 &&
      maxStreamsPerPage !== 7
    ) {
      const squareRoot = Math.ceil(Math.sqrt(maxStreamsPerPage));
      layoutColumns = squareRoot;
      layoutRows = squareRoot;
    } else if (
      streamCount !== 0 &&
      maxStreamsPerPage !== 5 &&
      (maxStreamsPerPage === 10 ||
        maxStreamsPerPage === 13 ||
        maxStreamsPerPage === 7)
    ) {
      layoutColumns = 4;
      layoutRows = 4;
    } else if (streamCount !== 0 && maxStreamsPerPage === 5) {
      layoutColumns = 3;
      layoutRows = 3;
    }

    totalPages =
      maxStreamsPerPage === 10
        ? Math.ceil(streamCount / 10)
        : maxStreamsPerPage === 13
          ? Math.ceil(streamCount / 13)
          : maxStreamsPerPage === 5
            ? Math.ceil(streamCount / 6)
            : maxStreamsPerPage === 7
              ? Math.ceil(streamCount / 8)
              : Math.ceil(streamCount / (layoutRows * layoutColumns));

    setTimeout(() => {
      initSortable();
    }, 500);
  };

  $: {
    if ($filteredNodeCameras.length === $selectedNode.camera.length) {
      updateLayout($selectedNode.maxStreamsPerPage);
    } else {
      updateLayout(0);
    }
  }
  $: {
    if (isSingleFullscreen) {
      document.addEventListener("fullscreenchange", onFullscreenChange);
    } else {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    }
  }

  onMount(() => {
    setTimeout(() => {
      initSortable();
    }, 100);
  });

  function initSortable() {
    if (cells) {
      Sortable.create(cells, {
        animation: 250,
        chosenClass: "chosen",
        dragClass: "dragged",
        handle: ".grab-handle",
        onEnd: function (evt) {
          const newOrder = Array.from(cells.children).map((child) => child.id);
          const draggedElement = evt.item;
          updateListWithNewOrder(newOrder, draggedElement);
        },
      });
    } else {
      console.log("sortable cells not found");
    }
  }
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  onMount(async () => {
    PB.collection("configuration").subscribe("*", (e) => {
      console.log("new update in gallery", e.action, e.record);
      if (e.action === "create") {
        const cameraIdsAndUrls = $selectedNode.camera.map((camera) => ({
          id: camera.id,
          url: camera.url,
        }));
        const cameraUrl = e.record.ipAddr;
        const cameraUrlExists = cameraIdsAndUrls.some((camera) =>
          camera.url.includes(cameraUrl),
        );
        if (cameraUrlExists) {
          const cam = cameraIdsAndUrls.find((camera) =>
            camera.url.includes(cameraUrl),
          );
          console.log("refreshing cam from subscription", cam);
          setTimeout(() => {
            refreshVideoStream(cam?.id);
          }, 2000);
        }
      }
    });
  });

  onDestroy(() => {
    PB.collection("configuration").unsubscribe("*");
  });
  let currentIndex = 0;

  // $: {
  //   if(currentIndex === streamCount) {

  //   }
  // }
  //   const refreshCameras = () => {
  //     const refreshInterval = 2 * 60 * 1000; // 2 minutes
  //     const camera = $selectedNode.camera[currentIndex];
  //     if (camera) {
  //       refreshVideoStream(camera.id);
  //       console.log("refreshing camera with index & name:", currentIndex, camera.name);
  //     }
  //     currentIndex = (currentIndex + 1) % $selectedNode.camera.length;
  //     setTimeout(refreshCameras, refreshInterval);
  //   };

  $: bigCellIndex = [10, 13, 5, 7].includes($selectedNode.maxStreamsPerPage)
    ? 0
    : null;

  function setBigCell(index) {
    bigCellIndex = index;
  }

  function updateListWithNewOrder(newOrder, draggedItem) {
    const cell = document.getElementById("grid-cell-0");
    const stream = cell?.querySelector("video-stream");
    if (stream) {
      const matchingCamera = $selectedNode.camera.find(
        (c) => c.url === stream.url,
      );
      const matchingCameraId = matchingCamera ? matchingCamera.id : null;
    } else {
      console.log("here");
    }
  }
</script>

{#if streamCount > 0 && Object.keys(videos).length > 0}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  {#if $selectedNode.camera.length !== $filteredNodeCameras.length && $filteredNodeCameras.length !== 0}
    <div
      class={cn(
        `grid  gap-1 w-full h-full ${!isAllFullScreen ? "max-h-[calc(100vh-76px)]": "max-h-screen"} grid-cols-${layoutColumns} grid-rows-${layoutRows}`,
      )}
      bind:this={cells}
    >
      {#each Array($filteredNodeCameras.length) as _, newIndex}
        {#key newIndex}
          <div id={`grid-cell-${newIndex}`} class='relative'>
            <Stream
              videoElement={videos[$filteredNodeCameras[newIndex].id]}
              camera={$filteredNodeCameras[newIndex]}
            />
            <span
              class="flex gap-2 bg-[rgba(0,0,0,.5)] text-white py-1 px-3 absolute bottom-4 left-4 items-center rounded-xl scale-90 z-20"
            >
              <span
                class={`h-2 w-2 ${
                  $filteredNodeCameras[newIndex].save === true
                    ? "bg-[#C12828]"
                    : "bg-[#589e67]"
                } rounded-full`}
              />
              <span class="text-xs font-extrabold">
                {$filteredNodeCameras[newIndex].name}
              </span>
            </span>
            <button
              on:click={() => {
                if (isSingleFullscreen === true) {
                  exitSingleFullscreen();
                  const streamElement =
                    videos[$filteredNodeCameras[newIndex].id];
                  console.log(streamElement);
                  if (streamElement) {
                    console.log("first");
                    streamElement.remove();
                    delete videos[$filteredNodeCameras[newIndex].id];
                  }
                  initVideo($filteredNodeCameras[newIndex]);
                } else {
                  singleFullscreen(newIndex);
                  const streamElement =
                    videos[$filteredNodeCameras[newIndex].id];
                  if (streamElement) {
                    console.log("first");
                    streamElement.remove();
                    delete videos[$filteredNodeCameras[newIndex].id];
                  }
                  initVideo($filteredNodeCameras[newIndex]);
                }

                addUserLog(
                  `user clicked single camera fulscreen for camera ${$filteredNodeCameras[newIndex].name} having url "${$filteredNodeCameras[newIndex].url}" `,
                );
              }}
              class="absolute p-1 top-4 right-4 cursor-pointer bg-[rgba(0,0,0,.5)] text-white rounded z-20 disabled:cursor-not-allowed"
              >{#if !isSingleFullscreen}
                <Expand size={18} />{:else}
                <Shrink size={18} />{/if}
            </button>
          </div>
        {/key}
      {/each}
    </div>
  {:else}
    <Carousel.Root
      class="w-full h-full flex justify-center items-center"
      opts={{ watchDrag: false }}
    >
      <Carousel.Content class="w-full h-full mx-0 px-0">
        {#each Array(totalPages) as _, pageIndex}
          <Carousel.Item class="h-full w-full px-0 mx-0">
            <div
              class={cn(
                `grid gap-1 w-full h-full ${!isAllFullScreen ? "max-h-[calc(100vh-76px)]" : "max-h-screen"} grid-cols-${layoutColumns} grid-rows-${layoutRows}`,
                $selectedNode.maxStreamsPerPage === 13 && "grid-area-13",
                $selectedNode.maxStreamsPerPage === 10 && "grid-area-10",
                $selectedNode.maxStreamsPerPage === 5 && "grid-area-5",
                $selectedNode.maxStreamsPerPage === 7 && "grid-area-7",
              )}
              bind:this={cells}
            >
              {#each Array($selectedNode.maxStreamsPerPage !== 0 && $selectedNode.maxStreamsPerPage !== 5 && $selectedNode.maxStreamsPerPage !== 7 ? $selectedNode.maxStreamsPerPage : $selectedNode.maxStreamsPerPage === 5 ? $selectedNode.maxStreamsPerPage + 1 : $selectedNode.maxStreamsPerPage === 7 ? $selectedNode.maxStreamsPerPage + 1 : layoutRows * layoutColumns) as _, slotIndex}
                {#if pageIndex * ($selectedNode.maxStreamsPerPage === 5 || $selectedNode.maxStreamsPerPage === 7 ? $selectedNode.maxStreamsPerPage + 1 : $selectedNode.maxStreamsPerPage) + slotIndex < streamCount}
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  {#key pageIndex * ($selectedNode.maxStreamsPerPage === 5 || $selectedNode.maxStreamsPerPage === 7 ? $selectedNode.maxStreamsPerPage + 1 : $selectedNode.maxStreamsPerPage) + slotIndex}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                      id={`grid-cell-${slotIndex}`}
                      class="relative h-full"
                      style={$selectedNode.maxStreamsPerPage === 10 &&
                      slotIndex === 0
                        ? "grid-area: bigCell1"
                        : $selectedNode.maxStreamsPerPage === 10 &&
                            slotIndex === 1
                          ? "grid-area: bigCell2"
                          : bigCellIndex === slotIndex
                            ? "grid-area: bigCell1"
                            : ""}
                    >
                      {#if [5, 7, 13].includes($selectedNode.maxStreamsPerPage) && bigCellIndex !== slotIndex}
                        <button
                          disabled
                          on:click={() => setBigCell(slotIndex)}
                          class={`cursor-pointer disabled:cursor-not-allowed absolute rounded top-4 ${isAllFullScreen ? "right-12" : "right-20"} flex-shrink-0 p-1 bg-[rgba(0,0,0,.5)] text-white z-20`}
                        >
                          <AArrowUp size={18} />
                        </button>
                      {/if}
                      <Stream
                        videoElement={videos[
                          $selectedNode.camera[
                            pageIndex *
                              ($selectedNode.maxStreamsPerPage === 5 ||
                              $selectedNode.maxStreamsPerPage === 7
                                ? $selectedNode.maxStreamsPerPage + 1
                                : $selectedNode.maxStreamsPerPage) +
                              slotIndex
                          ].id
                        ]}
                        camera={$selectedNode.camera[
                          pageIndex *
                            ($selectedNode.maxStreamsPerPage === 5 ||
                            $selectedNode.maxStreamsPerPage === 7
                              ? $selectedNode.maxStreamsPerPage + 1
                              : $selectedNode.maxStreamsPerPage) +
                            slotIndex
                        ]}
                      />
                      <span
                        class="flex gap-2 bg-[rgba(0,0,0,.5)] text-white py-1 px-3 absolute bottom-4 left-4 items-center rounded-xl scale-90 z-20"
                      >
                        <span
                          class={`h-2 w-2 ${
                            $selectedNode.camera[
                              pageIndex *
                                ($selectedNode.maxStreamsPerPage === 5 ||
                                $selectedNode.maxStreamsPerPage === 7
                                  ? $selectedNode.maxStreamsPerPage + 1
                                  : $selectedNode.maxStreamsPerPage) +
                                slotIndex
                            ].save === true
                              ? "bg-[#C12828]"
                              : "bg-[#589e67]"
                          } rounded-full`}
                        />
                        <span class="text-xs font-extrabold">
                          {$selectedNode.camera[
                            pageIndex *
                              ($selectedNode.maxStreamsPerPage === 5 ||
                              $selectedNode.maxStreamsPerPage === 7
                                ? $selectedNode.maxStreamsPerPage + 1
                                : $selectedNode.maxStreamsPerPage) +
                              slotIndex
                          ].name}
                        </span>
                      </span>

                      {#if $activeCamera === $selectedNode.camera[pageIndex * ($selectedNode.maxStreamsPerPage === 5 || $selectedNode.maxStreamsPerPage === 7 ? $selectedNode.maxStreamsPerPage + 1 : $selectedNode.maxStreamsPerPage) + slotIndex].id}
                        <div
                          id={`${$activeCamera}-menu`}
                          class="z-20 flex justify-center items-center gap-4 self-end mt-auto absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl bg-gradient-to-bl from-[rgba(217,217,217,.2)] to-[rgba(217,217,217,.1)] border border-solid border-[#d3d3d3]"
                        >
                          <button
                            disabled
                            on:click={() => {
                              if (isSingleFullscreen === true) {
                                exitSingleFullscreen();
                                const streamElement =
                                  videos[
                                    $selectedNode.camera[
                                      pageIndex *
                                        ($selectedNode.maxStreamsPerPage ===
                                          5 ||
                                        $selectedNode.maxStreamsPerPage === 7
                                          ? $selectedNode.maxStreamsPerPage + 1
                                          : $selectedNode.maxStreamsPerPage) +
                                        slotIndex
                                    ].id
                                  ];
                                console.log(streamElement);
                                if (streamElement) {
                                  console.log("first");
                                  streamElement.remove();
                                  delete videos[
                                    $selectedNode.camera[
                                      pageIndex *
                                        ($selectedNode.maxStreamsPerPage ===
                                          5 ||
                                        $selectedNode.maxStreamsPerPage === 7
                                          ? $selectedNode.maxStreamsPerPage + 1
                                          : $selectedNode.maxStreamsPerPage) +
                                        slotIndex
                                    ].id
                                  ];
                                }
                                initVideo(
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ],
                                );
                              } else {
                                singleFullscreen(slotIndex);
                                const streamElement =
                                  videos[
                                    $selectedNode.camera[
                                      pageIndex *
                                        ($selectedNode.maxStreamsPerPage ===
                                          5 ||
                                        $selectedNode.maxStreamsPerPage === 7
                                          ? $selectedNode.maxStreamsPerPage + 1
                                          : $selectedNode.maxStreamsPerPage) +
                                        slotIndex
                                    ].id
                                  ];
                                console.log(streamElement);
                                if (streamElement) {
                                  console.log("first");
                                  streamElement.remove();
                                  delete videos[
                                    $selectedNode.camera[
                                      pageIndex *
                                        ($selectedNode.maxStreamsPerPage ===
                                          5 ||
                                        $selectedNode.maxStreamsPerPage === 7
                                          ? $selectedNode.maxStreamsPerPage + 1
                                          : $selectedNode.maxStreamsPerPage) +
                                        slotIndex
                                    ].id
                                  ];
                                }
                                initVideo(
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ],
                                );
                              }

                              addUserLog(
                                `user clicked single camera fulscreen for camera ${
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].name
                                } having url "${
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].url
                                }" `,
                              );
                            }}
                            class=" disabled:cursor-not-allowed rounded bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
                          >
                            {#if !isSingleFullscreen}
                              <Expand size={18} />{:else}
                              <Shrink size={18} />{/if}
                          </button>
                          <!-- <span
                          class="rounded bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
                          ><Disc2 size={18} />
                        </span> -->
                          <button
                            disabled
                            on:click={(e) => {
                              e.preventDefault();
                              handleSingleSS();

                              addUserLog(
                                `user clicked capture single screenshot for camera ${
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].name
                                } having url "${
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].url
                                }"`,
                              );
                            }}
                            class="rounded disabled:cursor-not-allowed bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
                            ><ImageDown size={18} />
                          </button>
                          <button
                            disabled
                            on:click={() => {
                              const cameraId =
                                $selectedNode.camera[
                                  pageIndex *
                                    ($selectedNode.maxStreamsPerPage === 5 ||
                                    $selectedNode.maxStreamsPerPage === 7
                                      ? $selectedNode.maxStreamsPerPage + 1
                                      : $selectedNode.maxStreamsPerPage) +
                                    slotIndex
                                ].id;
                              // console.log(cameraId);
                              refreshVideoStream(cameraId);
                              // addUserLog(`user refreshed video stream for camera ${cameraId}`);
                            }}
                            class="rounded disabled:cursor-not-allowed bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
                          >
                            <RefreshCcw size={18} />
                          </button>
                        </div>
                      {:else}
                        <button
                          on:click={() => {
                            if (isSingleFullscreen === true) {
                              exitSingleFullscreen();
                              const streamElement =
                                videos[
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].id
                                ];
                              console.log(streamElement);
                              if (streamElement) {
                                console.log("first");
                                streamElement.remove();
                                delete videos[
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].id
                                ];
                              }
                              initVideo(
                                $selectedNode.camera[
                                  pageIndex *
                                    ($selectedNode.maxStreamsPerPage === 5 ||
                                    $selectedNode.maxStreamsPerPage === 7
                                      ? $selectedNode.maxStreamsPerPage + 1
                                      : $selectedNode.maxStreamsPerPage) +
                                    slotIndex
                                ],
                              );
                            } else {
                              singleFullscreen(slotIndex);
                              const streamElement =
                                videos[
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].id
                                ];
                              console.log(streamElement);
                              if (streamElement) {
                                console.log("first");
                                streamElement.remove();
                                delete videos[
                                  $selectedNode.camera[
                                    pageIndex *
                                      ($selectedNode.maxStreamsPerPage === 5 ||
                                      $selectedNode.maxStreamsPerPage === 7
                                        ? $selectedNode.maxStreamsPerPage + 1
                                        : $selectedNode.maxStreamsPerPage) +
                                      slotIndex
                                  ].id
                                ];
                              }
                              initVideo(
                                $selectedNode.camera[
                                  pageIndex *
                                    ($selectedNode.maxStreamsPerPage === 5 ||
                                    $selectedNode.maxStreamsPerPage === 7
                                      ? $selectedNode.maxStreamsPerPage + 1
                                      : $selectedNode.maxStreamsPerPage) +
                                    slotIndex
                                ],
                              );
                            }

                            addUserLog(
                              `user clicked single camera fulscreen for camera ${
                                $selectedNode.camera[
                                  pageIndex *
                                    ($selectedNode.maxStreamsPerPage === 5 ||
                                    $selectedNode.maxStreamsPerPage === 7
                                      ? $selectedNode.maxStreamsPerPage + 1
                                      : $selectedNode.maxStreamsPerPage) +
                                    slotIndex
                                ].name
                              } having url "${
                                $selectedNode.camera[
                                  pageIndex *
                                    ($selectedNode.maxStreamsPerPage === 5 ||
                                    $selectedNode.maxStreamsPerPage === 7
                                      ? $selectedNode.maxStreamsPerPage + 1
                                      : $selectedNode.maxStreamsPerPage) +
                                    slotIndex
                                ].url
                              }" `,
                            );
                          }}
                          class="absolute p-1 top-4 right-4 cursor-pointer bg-[rgba(0,0,0,.5)] text-white rounded z-20 disabled:cursor-not-allowed"
                          disabled
                          >{#if !isSingleFullscreen}
                            <Expand size={18} />{:else}
                            <Shrink size={18} />{/if}
                        </button>
                      {/if}

                      {#if !isAllFullScreen}
                        <span
                          class="cursor-grab grab-handle absolute rounded top-4 right-12 flex-shrink-0 p-1 bg-[rgba(0,0,0,.5)] text-white z-20"
                        >
                          <Menu size={18} />
                        </span>
                      {/if}

                      <!-- <img
                        src="/images/logo-black.png"
                        alt="logo"
                        class="object-contain w-[15%] absolute right-4 bottom-4 z-20"
                      /> -->
                       <img
                    src="/images/navCoreWhite.png"
                    alt="logo"
                    class="object-contain w-[15%] absolute right-4 bottom-4 z-20"
                  />
                    </div>
                  {/key}
                {:else}
                  <div
                    class="h-full w-full relative"
                    style={$selectedNode.maxStreamsPerPage === 13 &&
                    slotIndex === 0
                      ? "grid-area: bigCell1"
                      : $selectedNode.maxStreamsPerPage === 10 &&
                          slotIndex === 0
                        ? "grid-area: bigCell1"
                        : $selectedNode.maxStreamsPerPage === 10 &&
                            slotIndex === 1
                          ? "grid-area: bigCell2"
                          : $selectedNode.maxStreamsPerPage === 5 &&
                              slotIndex === 0
                            ? "grid-area: bigCell1"
                            : $selectedNode.maxStreamsPerPage === 7 &&
                                slotIndex === 0
                              ? "grid-area: bigCell1"
                              : ""}
                  >
                    <AddCameraDialog nodes={data.nodes} sNode={""}>
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                      <button class=" disabled:cursor-not-allowed" disabled>
                        <img
                          on:click={() => {
                            addUserLog(
                              `user clicked on add camera on stream panel`,
                            );
                          }}
                          alt="add camera"
                          src={$mode === "light" && !isAllFullScreen
                            ? "/images/plusLight.png"
                            : "/images/plusDark.png"}
                          class="h-full w-full object-contain scale-50 2xl:scale-[.35] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                        />
                      </button>
                    </AddCameraDialog>
                  </div>
                {/if}
              {/each}
            </div>
          </Carousel.Item>
        {/each}
      </Carousel.Content>
      <Carousel.Previous
        onClick={handlePrevious}
        class="left-8 disabled:invisible text-bold text-[#015a62] dark:text-white"
      />
      <Carousel.Next
        onClick={handleNext}
        class="right-8 disabled:invisible text-bold text-[#015a62] dark:text-white"
      />
    </Carousel.Root>
  {/if}
  <!-- </div> -->
{:else}
  <div
    class={`h-full w-full ${streamCount === 0 ? "flex justify-center items-center" : "relative"}`}
  >
    <AddCameraDialog nodes={data.nodes} sNode={""}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <button class="disabled:cursor-not-allowed" disabled>
        <img
          on:click={() => {
            addUserLog(`user added first camera through streampanel`);
          }}
          alt="add camera"
          src={$mode === "light"
            ? "/images/plusLight.png"
            : "/images/plusDark.png"}
          class={`h-full w-full object-contain dark:scale-[.40] scale-[.20] ${streamCount === 0 ? "" : "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"}`}
        />
      </button>
    </AddCameraDialog>
  </div>
{/if}

<style>
  .grid {
    display: grid !important;
  }
  .grid-rows-1 {
    grid-template-rows: repeat(1, 100%);
  }
  .grid-rows-2 {
    grid-template-rows: repeat(2, 1fr);
  }
  .grid-rows-3 {
    grid-template-rows: repeat(3, 1fr);
  }
  .grid-rows-4 {
    grid-template-rows: repeat(4, 1fr);
  }
  .grid-rows-5 {
    grid-template-rows: repeat(5, 1fr);
  }
  .grid-rows-6 {
    grid-template-rows: repeat(6, 16.2%);
  }
  .grid-rows-7 {
    grid-template-rows: repeat(7, 14.285%);
  }
  .grid-rows-8 {
    grid-template-rows: repeat(8, 12.5%);
  }
  .grid-rows-9 {
    grid-template-rows: repeat(9, 11.11);
  }
  .grid-rows-10 {
    grid-template-rows: repeat(10, 10%);
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, 100%);
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  .grid-cols-5 {
    grid-template-columns: repeat(5, 1fr);
  }
  .grid-cols-6 {
    grid-template-columns: repeat(6, 16.35%);
  }
  .grid-cols-7 {
    grid-template-columns: repeat(7, 14.285%);
  }
  .grid-cols-8 {
    grid-template-columns: repeat(8, 12.5%);
  }
  .grid-cols-9 {
    grid-template-columns: repeat(9, 11.11);
  }
  .grid-cols-10 {
    grid-template-columns: repeat(10, 10%);
  }
  .grid-area-13 {
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);
    grid-template-areas:
      "bigCell1 bigCell1 . ."
      "bigCell1 bigCell1 . ."
      ". . . ."
      ". . . .";
  }
  .grid-area-10 {
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);
    grid-template-areas:
      "bigCell1 bigCell1 bigCell2 bigCell2"
      "bigCell1 bigCell1 bigCell2 bigCell2"
      ". . . ."
      ". . . .";
  }

  .grid-area-5 {
    grid-template-columns: repeat(3, 33.3%);
    grid-template-rows: repeat(3, 33.3%);
    grid-template-areas:
      "bigCell1 bigCell1 ."
      "bigCell1 bigCell1 ."
      ". . . ";
  }
  .grid-area-7 {
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);
    grid-template-areas:
      "bigCell1 bigCell1 bigCell1  ."
      "bigCell1 bigCell1 bigCell1  ."
      "bigCell1 bigCell1 bigCell1  ."
      ". . . .";
  }
</style>
