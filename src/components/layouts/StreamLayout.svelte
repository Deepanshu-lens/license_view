<script lang="ts">
  import { mode } from "mode-watcher";
  import { activeCamera, topPanelHide } from "@/lib/stores";
  import { cn } from "@/lib";
  import { selectedNode } from "@/lib/stores";
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
    Replace,
    VolumeX,
  } from "lucide-svelte";
  import { Shrink } from "lucide-svelte";
  import { addUserLog } from "@/lib/addUserLog";
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import { page } from "$app/stores";
  import Sortable from "sortablejs";
  import { onMount } from "svelte";

  export let handleSingleSS: () => void;
  export let isAllFullScreen: boolean;
  // export let slideIndex: number | undefined | null;

  let streamCount = $selectedNode.camera.length; // Number of video streams
  let layoutRows = 1; // Default layout rows
  let layoutColumns = 1; // Default layout columns
  let totalPages = 1;
  let isSingleFullscreen: boolean = false;
  let videos: { [key: string]: HTMLElement } = {};
  let cells: HTMLDivElement;
  let ele;
  // const location = window?.location?.href;
  // const neededUrl =
  //   location?.split("/")[2] === "localhost:5173"
  //     ? PUBLIC_BASE_URL
  //     : location?.split("/")[2]?.split(":")[0];

  const neededUrl = $page.url.hostname;

  const initVideo = (camera: Camera) => {
    if (videos[camera.id]) {
      console.log("first");
      return;
    }
    console.log("camera init", camera);
    let video = document.createElement("video-stream") as VideoStreamType;
    video.id = `stream-${camera.id}`;
    video.mode = $page.url.hostname.includes("116") ? "mse" : "webrtc";
    video.url = camera.url;
    camera.subUrl.length === 0
      ? (video.src = new URL(
          `ws://${neededUrl}:8082/api/ws?src=${camera.id}&nodeID=${1}`,
        ))
      : (video.src = new URL(
          isSingleFullscreen
            ? `ws://${neededUrl}:8082/api/ws?src=${camera.id}_FULL&camID=${camera.id}_FULL&nodeID=${1}`
            : `ws://${neededUrl}:8082/api/ws?src=${camera.id}&nodeID=${1}`,
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
      // Remove the video element from the DOM and from the videos object
      console.log(videoElement);
      videoElement.remove();
      delete videos[cameraId];

      // Re-initialize the video for the camera
      const camera = $selectedNode.camera.find((c) => c.id === cameraId);
      console.log(camera.name);
      if (camera) {
        initVideo(camera);
      }
    }
  };

  const updateLayout = (maxStreamsPerPage: number) => {
    $selectedNode.camera.map((c) => {
      if (!videos[c.id]) {
        initVideo(c);
      } else {
        if (videos[c.id].url !== c.url) {
          videos[c.id].url = c.url;
          videos[c.id].src = new URL(
            `ws://${neededUrl}:8082/api/ws?src=${c.id}&camID=${c.id}&nodeID=${1}`,
          );
        }
      }
    });

    streamCount = $selectedNode.camera.length;

    if (maxStreamsPerPage === 0) {
      // Automatic Layout
      const squareRoot = Math.ceil(Math.sqrt(streamCount));
      if (Number.isInteger(Math.sqrt(streamCount))) {
        layoutColumns = squareRoot;
      } else {
        layoutColumns = squareRoot <= 4 ? squareRoot : 5;
      }
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
  };

  $: updateLayout($selectedNode.maxStreamsPerPage);
  $: {
    if (isSingleFullscreen) {
      document.addEventListener("fullscreenchange", onFullscreenChange);
    } else {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    }
  }

  onMount(function () {
    if (cells) {
      Sortable.create(cells, {
        animation: 250,
        chosenClass: "chosen",
        dragClass: "dragged",
        handle: ".grab-handle",
      });
    } else {
      console.log("first");
    }
  });

  $: bigCellIndex = [10, 13, 5, 7].includes($selectedNode.maxStreamsPerPage)
    ? 0
    : null;
  function setBigCell(index) {
    bigCellIndex = index;
  }
</script>

{#if streamCount > 0 && Object.keys(videos).length > 0}
  <!-- svelte-ignore a11y-no-static-element-interactions -->

  <Carousel.Root
    class="w-full h-full flex justify-center items-center"
    opts={{ watchDrag: false }}
  >
    <Carousel.Content class="w-full h-full mx-0 px-0">
      {#each Array(totalPages) as _, pageIndex}
        <Carousel.Item class="h-full w-full px-0 mx-0">
          <div
            class={cn(
              `grid gap-1 w-full h-full ${$topPanelHide && !isAllFullScreen ? "max-h-[calc(100vh-76px)]" : !$topPanelHide && !isAllFullScreen ? "max-h-[calc(100vh-76px)]" : isAllFullScreen ? "max-h-screen" : "max-h-screen"} grid-cols-${layoutColumns} grid-rows-${layoutRows}`,
              $selectedNode.maxStreamsPerPage === 13 && "grid-area-13",
              $selectedNode.maxStreamsPerPage === 10 && "grid-area-10",
              $selectedNode.maxStreamsPerPage === 5 && "grid-area-5",
              $selectedNode.maxStreamsPerPage === 7 && "grid-area-7",
            )}
            bind:this={cells}
          >
            {#each Array($selectedNode.maxStreamsPerPage !== 0 && $selectedNode.maxStreamsPerPage !== 5 && $selectedNode.maxStreamsPerPage !== 7 ? $selectedNode.maxStreamsPerPage : $selectedNode.maxStreamsPerPage === 5 ? $selectedNode.maxStreamsPerPage + 1 : $selectedNode.maxStreamsPerPage === 7 ? $selectedNode.maxStreamsPerPage + 1 : layoutRows * layoutColumns) as _, slotIndex}
              {#if pageIndex * $selectedNode.maxStreamsPerPage + slotIndex < streamCount}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                {#key pageIndex * $selectedNode.maxStreamsPerPage + slotIndex}
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
                        on:click={() => setBigCell(slotIndex)}
                        class={`cursor-pointer absolute rounded top-4 ${isAllFullScreen ? "right-12" : "right-20"} flex-shrink-0 p-1 bg-[rgba(0,0,0,.5)] text-white z-20`}
                      >
                        <AArrowUp size={18} />
                      </button>
                    {/if}
                    <Stream
                      videoElement={videos[
                        $selectedNode.camera[
                          pageIndex * $selectedNode.maxStreamsPerPage +
                            slotIndex
                        ].id
                      ]}
                      camera={$selectedNode.camera[
                        pageIndex * $selectedNode.maxStreamsPerPage + slotIndex
                      ]}
                    />
                    <span
                      class="flex gap-2 text-[#C20D02] bg-[rgba(255,255,255,.68)] py-1 px-3 absolute bottom-4 left-4 items-center rounded-xl scale-75 z-20"
                    >
                      <Disc2 size={18} />
                      <span class="text-xs font-extrabold">
                        {$selectedNode.camera[
                          pageIndex * $selectedNode.maxStreamsPerPage +
                            slotIndex
                        ].name}
                      </span>
                    </span>

                    {#if $activeCamera === $selectedNode.camera[pageIndex * $selectedNode.maxStreamsPerPage + slotIndex].id}
                      <div
                        id={`${$activeCamera}-menu`}
                        class="z-20 flex justify-center items-center gap-4 self-end mt-auto absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl bg-gradient-to-bl from-[rgba(217,217,217,.2)] to-[rgba(217,217,217,.1)] border border-solid border-[#d3d3d3]"
                      >
                        <button
                          on:click={() => {
                            if (isSingleFullscreen === true) {
                              exitSingleFullscreen();
                              const streamElement =
                                videos[
                                  $selectedNode.camera[
                                    pageIndex *
                                      $selectedNode.maxStreamsPerPage +
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
                                      $selectedNode.maxStreamsPerPage +
                                      slotIndex
                                  ].id
                                ];
                              }
                              initVideo(
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ],
                              );
                            } else {
                              singleFullscreen(slotIndex);
                              const streamElement =
                                videos[
                                  $selectedNode.camera[
                                    pageIndex *
                                      $selectedNode.maxStreamsPerPage +
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
                                      $selectedNode.maxStreamsPerPage +
                                      slotIndex
                                  ].id
                                ];
                              }
                              initVideo(
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ],
                              );
                            }

                            addUserLog(
                              `user clicked single camera fulscreen for camera ${
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].name
                              } having url "${
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].url
                              }" `,
                            );
                          }}
                          class="rounded bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
                        >
                          {#if !isSingleFullscreen}
                            <Expand size={18} />{:else}
                            <Shrink size={18} />{/if}
                        </button>
                        <span
                          class="rounded bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
                          ><Disc2 size={18} />
                        </span>
                        <button
                          on:click={(e) => {
                            e.preventDefault();
                            handleSingleSS();

                            addUserLog(
                              `user clicked capture single screenshot for camera ${
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].name
                              } having url "${
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].url
                              }"`,
                            );
                          }}
                          class="rounded bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
                          ><ImageDown size={18} />
                        </button>
                        <button
                          on:click={() => {
                            const cameraId =
                              $selectedNode.camera[
                                pageIndex * $selectedNode.maxStreamsPerPage +
                                  slotIndex
                              ].id;
                            // console.log(cameraId);
                            refreshVideoStream(cameraId);
                            // addUserLog(`user refreshed video stream for camera ${cameraId}`);
                          }}
                          class="rounded bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-1.5 min-h-[36px] min-w-[36px] grid place-items-center text-white cursor-pointer"
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
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].id
                              ];
                            console.log(streamElement);
                            if (streamElement) {
                              console.log("first");
                              streamElement.remove();
                              delete videos[
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].id
                              ];
                            }
                            initVideo(
                              $selectedNode.camera[
                                pageIndex * $selectedNode.maxStreamsPerPage +
                                  slotIndex
                              ],
                            );
                          } else {
                            singleFullscreen(slotIndex);
                            const streamElement =
                              videos[
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].id
                              ];
                            console.log(streamElement);
                            if (streamElement) {
                              console.log("first");
                              streamElement.remove();
                              delete videos[
                                $selectedNode.camera[
                                  pageIndex * $selectedNode.maxStreamsPerPage +
                                    slotIndex
                                ].id
                              ];
                            }
                            initVideo(
                              $selectedNode.camera[
                                pageIndex * $selectedNode.maxStreamsPerPage +
                                  slotIndex
                              ],
                            );
                          }

                          addUserLog(
                            `user clicked single camera fulscreen for camera ${
                              $selectedNode.camera[
                                pageIndex * $selectedNode.maxStreamsPerPage +
                                  slotIndex
                              ].name
                            } having url "${
                              $selectedNode.camera[
                                pageIndex * $selectedNode.maxStreamsPerPage +
                                  slotIndex
                              ].url
                            }" `,
                          );
                        }}
                        class="absolute p-1 top-4 right-4 cursor-pointer bg-[rgba(0,0,0,.5)] text-white rounded z-20"
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
                  </div>
                {/key}
              {:else}
                <div
                  class="h-full w-full relative"
                  style={$selectedNode.maxStreamsPerPage === 13 &&
                  slotIndex === 0
                    ? "grid-area: bigCell1"
                    : $selectedNode.maxStreamsPerPage === 10 && slotIndex === 0
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
                  <AddCameraDialog sNode={""}>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
                      class="h-full w-full object-contain scale-50 2xl:scale-[.35] absolute cursor-pointer top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                    />
                  </AddCameraDialog>
                  <!-- <span
                    class="cursor-grab grab-handle absolute rounded top-4 right-12 flex-shrink-0 p-1 bg-[rgba(0,0,0,.5)] text-white z-20"
                  >
                    <Menu size={18} />
                  </span> -->
                </div>
              {/if}
            {/each}
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Previous
      class="left-8 disabled:invisible text-bold text-[#015a62] dark:text-white"
    />
    <Carousel.Next
      class="right-8 disabled:invisible text-bold text-[#015a62] dark:text-white"
    />
  </Carousel.Root>
  <!-- </div> -->
{:else}
  <div
    class={`h-full w-full ${streamCount === 0 ? "flex justify-center items-center" : "relative"}`}
  >
    <AddCameraDialog sNode={""}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img
        on:click={() => {
          addUserLog(`user added first camera through streampanel`);
        }}
        alt="add camera"
        src={$mode === "light"
          ? "/images/plusLight.png"
          : "/images/plusDark.png"}
        class={`h-full w-full object-contain dark:scale-[.40] scale-[.20] cursor-pointer ${streamCount === 0 ? "" : "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"}`}
      />
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
    grid-template-rows: repeat(2, 50%);
  }
  .grid-rows-3 {
    grid-template-rows: repeat(3, 33.33%);
  }
  .grid-rows-4 {
    grid-template-rows: repeat(4, 25%);
  }
  .grid-rows-5 {
    grid-template-rows: repeat(5, 20%);
  }
  .grid-rows-6 {
    grid-template-rows: repeat(6, 16.66%);
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
    grid-template-columns: repeat(2, 50%);
  }
  .grid-cols-3 {
    grid-template-columns: repeat(3, 33.33%);
  }
  .grid-cols-4 {
    grid-template-columns: repeat(4, 25%);
  }
  .grid-cols-5 {
    grid-template-columns: repeat(5, 20%);
  }
  .grid-cols-6 {
    grid-template-columns: repeat(6, 16.66%);
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
