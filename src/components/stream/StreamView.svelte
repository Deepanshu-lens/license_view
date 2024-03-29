<script lang="ts">
  import { writable } from "svelte/store";
  import Stream from "./Stream.svelte";
  import { onDestroy, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import {
    activeCamera,
    leftPaneHide,
    fullscreen,
    selectedNode,
    topPanelHide,
    alertPanelHide,
    events,
  } from "@/lib/stores";
  import {
    Search,
    ScanFace,
    TabletSmartphone,
    Airplay,
    Disc2,
    ImageDown,
    Bell,
    Expand,
    Menu,
    Filter,
    Minimize,
  } from "lucide-svelte";

  import { cn } from "@/lib/utils";
  import PocketBase from "pocketbase";
  import html2canvas from "html2canvas";
  import { Settings } from "lucide-svelte";
  import AlertSettings from "../dialogs/AlertSettings.svelte";
  import RegisterDialog from "../dialogs/RegisterDialog.svelte";
  import StreamLayout from "../layouts/StreamLayout.svelte";
  import Separator from "../ui/separator/separator.svelte";
  import JSZip from "jszip";
  import SearchDialog from "../dialogs/SearchDialog.svelte";
  import CarDetailsDialog from "../dialogs/CarDetailsDialog.svelte";
  import EventModal from "../modal/EventModal.svelte";
  import type { Gallery } from "@/types";
  import { Label } from "../ui/label";
  import { Input } from "../ui/input";
  import { Button } from "../ui/button";
  import ComfortableProfileCard from "../cards/ComfortableProfileCard.svelte";
  import * as Accordion from "@/components/ui/accordion";
  import { addUserLog } from "@/lib/addUserLog";

  let animateHeader = false;
  let comfort = true;

  const search = new URLSearchParams(window.location.search);
  const screens = parseInt(search.get("s") ?? "1");
  const cameraCount = $selectedNode.camera.length;

  let recording = false;
  let slideRecording = false;
  let recordDropdownOpen = false;
  let snipDropDownOpen = false;
  let showSearchModal = false;
  let activeStreamIndex;
  let captureRef: HTMLElement;
  let isAllFullScreen = false;

  const PB = new PocketBase("http://127.0.0.1:5555");

  const searchParams = new URLSearchParams(window.location.search);

  let pages = parseInt(searchParams.get("p") ?? "0");

  // let slideIndex = writable(0);
  let activePage = pages === null ? 0 : Number(pages) + 1;

  // let queryString = `?p=${Number(pages) === 0 ? 1 : activePage}&g=${layout}&s=${activeSlideIndex}`;
  let queryString = `?p=${Number(pages) === 0 ? 1 : activePage}&g=${$selectedNode.maxStreamsPerPage}`;
  let basePath = `/session/${$selectedNode.session}`;

  let fullURL = basePath + queryString;

  const handleSingleSS = async () => {
    if ($activeCamera) {
      const element = document.getElementById(`stream-${$activeCamera}`);
      if (element) {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/webp");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "screenshot.webp";
        link.click();
        toast.success("Downloaded screen snip.");
        link.remove();
      }
    }
  };

  const captureSlideScreenshot = async (index: number) => {
    const num = index === null || index === undefined ? "0" : index;
    const element = document.getElementById(`slide-${num}`);
    if (captureRef) {
      const canvas = await html2canvas(captureRef);
      const imgData = canvas.toDataURL("image/webp");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "screenshot.webp";
      link.click();
      toast.success("Downloaded screen snip.");
      link.remove();
    } else {
      console.log("ref unavailable");
    }
  };

  const captureAllScreenshot = async () => {
    const zip = new JSZip();
    for (let i = 0; i < $selectedNode.camera.length; i++) {
      const element = document.getElementById(
        `stream-${$selectedNode.camera[i].id}`,
      );
      if (element) {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/webp");
        zip.file(
          `screenshot_${$selectedNode.camera[i].name}_${$selectedNode.camera[i].id}.webp`,
          imgData.split(";base64,").pop(),
          { base64: true },
        );
      }
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      // Create a download link for the zip file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "screenshots.zip";
      link.click();

      // Cleanup
      URL.revokeObjectURL(link.href);
      toast.success("Downloaded all screen snips.");
    });
  };

  function toggleFullscreen() {
    fullscreen.update((value) => !value);
  }

  function handleFullscreenChange() {
    isAllFullScreen = !!document.fullscreenElement;
    fullscreen.set(!!document.fullscreenElement);
  }

  document.addEventListener("fullscreenchange", handleFullscreenChange);

  onDestroy(() => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  });

  $: {
    if ($fullscreen && captureRef) {
      captureRef.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
  let selectedEvent = null;

  function openEventDialog(eventData) {
    selectedEvent = eventData;
  }

  async function getGallery(): Promise<Gallery[]> {
    const galleryItem = await PB.collection("faceGallery").getFullList({
      sort: "-lastSeen",
      expand: "events",
      fields: "name,lastSeen,expand.events.frameImage,images",
    });

    // console.log(galleryItem);

    return galleryItem.map((e) => ({
      name: e.name,
      lastSeen: e.lastSeen,
      savedData: e.images,
      images: e.expand.events
        ? e.expand.events
            .map((f) => f.frameImage)
            .slice(-8)
            .reverse()
        : [],
      created: new Date(),
      updated: new Date(),
    }));
  }

  async function getUnknowns(): Promise<Gallery[]> {
    const galleryItem = await PB.collection("impostors").getList(1, 10, {
      sort: "-lastSeen",
      expand: "events",
      fields: "name,lastSeen,expand.events.frameImage",
    });

    return galleryItem.items.map((e) => ({
      name: "Unknown",
      lastSeen: e.lastSeen,
      images: e.expand.events
        .map((f) => f.frameImage)
        .slice(-8)
        .reverse(),
      created: new Date(),
      updated: new Date(),
    }));
  }

  let galleryItems = [];
  let unknownItems = [];
  let batchedGallery = [];
  let batchedUnknownGallery = [];

  async function updateGallery() {
    if (batchedGallery.length > 0) {
      galleryItems = await getGallery();
      batchedGallery = [];
    }
    setTimeout(updateGallery, 1000);
  }

  async function updateUnknowns() {
    if (batchedUnknownGallery.length > 0) {
      unknownItems = await getUnknowns();
      batchedUnknownGallery = [];
    }
    setTimeout(updateUnknowns, 1000);
  }

  onMount(async () => {
    galleryItems = await getGallery();
    unknownItems = await getUnknowns();
    PB.collection("faceGallery").subscribe("*", async (e) => {
      console.log("New change ", e.action, e.record);
      batchedGallery.push(e.record.id);
    });
    PB.collection("impostors").subscribe("*", async (e) => {
      batchedUnknownGallery.push(e.record.id);
    });
    setTimeout(updateGallery, 1000);
    setTimeout(updateUnknowns, 1000);
  });
</script>

{#if !$topPanelHide}
  <div
    class="bg-background w-full flex flex-row items-center justify-end py-4 px-6 border-b z-10 relative"
  >
    <div class="flex items-center justify-center gap-6 lg:gap-[14px] 2xl:gap-6">
      <SearchDialog>
        <button
          class="flex items-center justify-center gap-2 cursor-pointer lg:scale-95 2xl:scale-100 hover:text-primary"
          on:click={() => {
            showSearchModal = true;
            addUserLog(`user clicked on Search button, top panel`);
          }}
        >
          <Search size={18} />
          Search
        </button>
      </SearchDialog>

      <Separator orientation="vertical" class="h-6" />

      <RegisterDialog>
        <button
          class="flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
          on:click={() =>
            addUserLog("user clicked on Register button, top panel")}
        >
          <ScanFace size={18} />
          Register
        </button>
      </RegisterDialog>

      <Separator orientation="vertical" class="h-6" />

      <a
        href={fullURL}
        target="_blank"
        rel="noreferrer"
        class="flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
        on:click={() => addUserLog("user clicked on exted display, top panel")}
      >
        <Airplay size={18} />
        Extend Display
      </a>

      <Separator orientation="vertical" class="h-6" />

      {#if recording && !slideRecording}
        <button
          class="flex items-center justify-center gap-1 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
          on:click={() => {
            recording = false;
            addUserLog("user clicked on stop recording, top panel ");
          }}
        >
          <Disc2 size={18} />
          Stop rec
        </button>
      {:else if slideRecording && !recording}
        <button
          class="flex items-center justify-center gap-1 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
          on:click={() => {
            slideRecording = false;
            addUserLog("user clicked on stop recording, top panel ");
          }}
        >
          <Disc2 size={18} />
          Stop rec
        </button>
      {:else}
        <button
          class={`flex  items-center justify-center gap-1 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary
              ${recordDropdownOpen && "text-primary"}
            `}
          on:click={() => {
            recordDropdownOpen = !recordDropdownOpen;
            snipDropDownOpen = false;
            addUserLog("user clicked on start recording, top panel ");
          }}
        >
          <Disc2 size={18} />
          Screen record
          {#if recordDropdownOpen}
            <div
              id="dropdown"
              class="z-50 dark:text-white text-black flex items-center border justify-center bg-background divide-y divide-gray-100 shadow-dropdown rounded-lg shadow w-40 absolute top-8"
            >
              <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
                <li class="w-full">
                  <button
                    on:click={() => {
                      slideRecording = true;
                    }}
                    class="block px-4 py-2 hover:bg-[rgba(92,75,221,.1)] rounded-md dark:hover:bg-gray-600 dark:hover:text-white w-full disabled:cursor-not-allowed"
                  >
                    Current View
                  </button>
                </li>
                <li class="w-full">
                  <button
                    on:click={() => {
                      if (activeStreamIndex !== null) {
                        // recordSingle(activeStreamIndex);
                        recording = true;
                      } else {
                        //   toast("No selected stream");
                      }
                    }}
                    class="block px-4 py-2 hover:bg-[rgba(92,75,221,.1)] rounded-md dark:hover:bg-gray-600 dark:hover:text-white w-full disabled:cursor-not-allowed"
                  >
                    Selected Screen
                  </button>
                </li>
                <li class="w-full">
                  <button
                    on:click={() => {
                      slideRecording = true;
                    }}
                    class="block px-4 py-2 hover:bg-[rgba(92,75,221,.1)] rounded-md dark:hover:bg-gray-600 dark:hover:text-white w-full disabled:cursor-not-allowed"
                  >
                    All Screens
                  </button>
                </li>
              </ul>
            </div>
          {/if}
        </button>
      {/if}
      <Separator orientation="vertical" class="h-6" />

      <button
        class={`flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary
             ${snipDropDownOpen && "text-primary"}
          `}
        on:click={() => {
          snipDropDownOpen = !snipDropDownOpen;
          recordDropdownOpen = false;
          addUserLog("user clicked on screen snip, top panel ");
        }}
      >
        <ImageDown size={18} />
        <span>Screen snip</span>
        {#if snipDropDownOpen}
          <div
            id="dropdown"
            class="z-50 dark:text-white text-black flex items-center border justify-center bg-background divide-y divide-gray-100 shadow-dropdown rounded-lg shadow w-40 absolute top-8"
          >
            <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
              <li class="w-full">
                <button
                  class=" px-4 py-2 hover:bg-[rgba(92,75,221,.1)] rounded-md dark:hover:bg-gray-600 dark:hover:text-white w-full"
                  on:click={() => {
                    captureSlideScreenshot(screens);
                    addUserLog(
                      "user selected option currentView for screen snip",
                    );
                  }}
                >
                  Current View
                </button>
              </li>
              <li class="w-full">
                <button
                  class=" px-4 py-2 hover:bg-[rgba(92,75,221,.1)] rounded-md dark:hover:bg-gray-600 dark:hover:text-white w-full"
                  on:click={() => {
                    if ($activeCamera === "") {
                      toast.warning("Please select a stream to screen snip.");
                    } else {
                      handleSingleSS();
                      addUserLog(
                        "user selected option Selected Screen for screen snip",
                      );
                    }
                  }}
                >
                  Selected Screen
                </button>
              </li>
              <li class="w-full">
                <button
                  on:click={() => {
                    captureAllScreenshot();
                    addUserLog(
                      "user selected option all Screen for screen snip",
                    );
                  }}
                  class=" px-4 py-2 hover:bg-[rgba(92,75,221,.1)] rounded-md dark:hover:bg-gray-600 dark:hover:text-white w-full"
                >
                  All Screens
                </button>
              </li>
            </ul>
          </div>
        {/if}
      </button>

      <Separator orientation="vertical" class="h-6" />

      <button
        class={cn(
          "flex items-center justify-center gap-2 cursor-pointer lg:scale-95 2xl:scale-100 hover:text-primary ",
          !$alertPanelHide && "text-primary",
        )}
        on:click={() => {
          alertPanelHide.set(!$alertPanelHide);
          localStorage.setItem(
            "alertPanelHide",
            JSON.stringify($alertPanelHide),
          );
          // console.log(`${$alertPanelHide}`);
          addUserLog(`user set alert panel hide to ${$alertPanelHide} `);
        }}
      >
        <Bell size={18} />
        Alerts
      </button>

      <Separator orientation="vertical" class="h-6" />

      <button
        disabled={cameraCount === 0}
        class="flex items-center justify-center gap-2 cursor-pointer lg:scale-95 2xl:scale-100 hover:text-primary disabled:cursor-not-allowed"
        on:click={() => {
          if (cameraCount > 0) {
            toggleFullscreen();
            addUserLog(`user clicked on fulscreen, top panel`);
          }
        }}
      >
        <Expand size={18} />
        Fullscreen
      </button>
    </div>
  </div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={`relative w-full cursor-pointer`}
  style={`${!$alertPanelHide && "width: 80%"}`}
  on:click={() => {
    !snipDropDownOpen &&
      !recordDropdownOpen &&
      topPanelHide.set(!$topPanelHide);
    localStorage.setItem("topPanelHide", JSON.stringify($topPanelHide));
    addUserLog(`user set top panel hide to ${$topPanelHide} `);
  }}
>
  <div
    class={`absolute  w-full rounded-tl-lg rounded-tr-xl pulse-blur
                z-10  transition-all ease-in-out duration-500 
                ${!snipDropDownOpen && !recordDropdownOpen ? "hover:backdrop-blur-lg cursor-pointer z-10" : "-z-10"}
          `}
  >
    <Menu
      size={24}
      class="dark:text-white text-black mx-auto z-20 cursor-pointer"
    />
  </div>
</div>
<div
  class={$topPanelHide
    ? "w-full h-[calc(100vh-76px)] flex items-start justify-between relative"
    : "w-full flex items-start justify-between h-[calc(100vh-134px)] z-0 relative"}
  bind:this={captureRef}
>
  <div
    class={isAllFullScreen
      ? "w-full h-screen flex items-center justify-center"
      : "w-full h-full flex items-center justify-center"}
  >
    <StreamLayout {handleSingleSS} {isAllFullScreen} />
  </div>
  {#if isAllFullScreen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span
      class="absolute top-2 left-2 flex items-center gap-2 cursor-pointer bg-[rgba(0,0,0,.5)] text-white z-20"
      on:click={() => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          isAllFullScreen = false;
          addUserLog(`user clicked on minimize fullscreen `);
        }
      }}
    >
      <Minimize />
      Minimize all Fullscreen
    </span>
  {/if}
  <!-- {#if !$alertPanelHide} -->
  <div
    class={`h-full border-solid 
           border-l-[1px] 
           transition-width ease-in-out duration-500 overflow-y-scroll
           ${!$alertPanelHide ? "w-1/4" : "w-0"}
           ${isAllFullScreen && "border-none"}`}
  >
    <div
      class={`backdrop-filter  
            z-10 trasition ease-in-out w-full max-w-md 
           duration-200 ${
             animateHeader
               ? "shadow-xl rounded-b-md backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40 bg-background/95 "
               : "rounded-none border-b"
           }
           ${isAllFullScreen && "border-none"}`}
    >
      <div
        class={`flex items-center w-full
     justify-between  px-4  ${
       animateHeader ? "my-3  text-sm " : "my-3 font-medium"
     } trasition ease-in-out duration-200`}
      >
        <div
          class={`flex justify-center items-center gap-2 ${isAllFullScreen && "text-white text-xl"}`}
        >
          <Bell size={18} />
          <h3>Alerts</h3>
        </div>
        <div
          class=" dark:text-white flex gap-2 items-center cursor-pointer text-sm relative"
        >
          <!-- <AlertSettings> -->
          <Settings size={18} />
          <!-- </AlertSettings> -->
          <Filter size={18} />
        </div>
      </div>
    </div>
    <div
      class="flex flex-row items-center justify-center 2xl:gap-4 gap-2 mt-4 px-2"
    >
      <button
        class={!comfort
          ? "text-xs dark:text-white text-[#015A62] 2xl:px-8 xl:px-4 py-2 rounded-md w-full bg-[white] dark:bg-[#333] dark:border-none mb-2 border border-solid border-[#015A62]"
          : "bg-[#015A62] text-xs 2xl:px-8 xl:px-3 py-2 rounded-md mb-2 text-white w-full"}
        on:click={() => (comfort = true)}
      >
        Comfortable
      </button>
      <button
        class={comfort
          ? "text-xs dark:text-white text-[#015A62] 2xl:px-8 xl:px-4 py-2 rounded-md w-full bg-[white] dark:bg-[#333] dark:border-none mb-2 border border-solid border-[#015A62]"
          : "bg-[#015A62] text-xs 2xl:px-8 xl:px-3 py-2 rounded-md mb-2 text-white w-full"}
        on:click={() => (comfort = false)}
      >
        Informative
      </button>
    </div>
    {#if comfort}
      <div class="m-4 flex flex-col gap-2">
        {#each galleryItems as galleryItem}
          <ComfortableProfileCard {galleryItem} />
        {/each}
      </div>
      <Accordion.Root class="m-4">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Unknowns</Accordion.Trigger>
          <Accordion.Content>
            {#each unknownItems as galleryItem}
              <ComfortableProfileCard {galleryItem} />
            {/each}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    {:else}
      <ul class="overflow-y-scroll h-[calc(100vh-75px]">
        {#if $events.length > 0}
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          {#each $events as event}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li
              class="w-full fade-in-15 transition-all duration-200"
              on:click={() => {
                openEventDialog(event);
                addUserLog(`user clicked on aler panel event`);
              }}
            >
              <article
                class={`relative items-center gap-4 m-4 p-4 bg-background
                   flex flex-col 
               rounded-xl shadow-md text-base border 
               ${isAllFullScreen ? "bg-black text-white " : "hover:scale-[1.01] dark:shadow-slate-800 hover:shadow-lg "}
               `}
              >
                <img
                  class="object-cover w-24 h-24 rounded-md col-span-1"
                  src={"data:image/jpeg;base64," + event.frameImage}
                  alt="Team Member"
                />
                {#if event.title.includes("car") && event.description !== ""}
                  <CarDetailsDialog
                    plateImage={event.videoUrl}
                    plateNumber={event.description}
                    carColor={event.title.replace(" car", "")}
                    fullImage={event.frameImage}
                    ><img
                      class="object-cover w-64 h-16 rounded-md col-span-1"
                      src={"data:image/jpeg;base64," + event.videoUrl}
                      alt="Team Member"
                    />
                  </CarDetailsDialog>
                {/if}
                <div class="col-span-1 tex-center flex flex-col items-center">
                  <h3 class={`${isAllFullScreen ? "text-2xl" : "text-base"}`}>
                    {#if event.title.includes("car") && event.description !== ""}
                      {event.description} {event.title}
                    {:else}
                      {event.title}
                    {/if}
                  </h3>
                  <p class={`${isAllFullScreen ? "text-xl" : "text-xs"}`}>
                    Camera {$selectedNode.camera.filter(
                      (c) => c.id === event.camera,
                    )[0] &&
                      $selectedNode.camera.filter(
                        (c) => c.id === event.camera,
                      )[0].name}
                  </p>
                  <p class={`${isAllFullScreen ? "text-xl" : "text-xs"}`}>
                    {event.score}
                  </p>
                </div>
                <div class="col-span-2 mx-auto">
                  <p class={`${isAllFullScreen ? "text-2xl" : "text-sm"}`}>
                    {event.created.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                  <p class={`${isAllFullScreen ? "text-2xl" : "text-sm"}`}>
                    {event.created.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </article>
            </li>
          {/each}
        {/if}
      </ul>
    {/if}
  </div>
  <!-- {/if} -->
</div>

{#if selectedEvent}
  <EventModal {selectedEvent} on:close={() => (selectedEvent = null)} />
{/if}
