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
    Monitor,
    X,
    Plus,
    ChevronRight,
  } from "lucide-svelte";

  import { Cctv, LayoutPanelLeft } from "lucide-svelte";

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
  import TopBar from "../mobile/TopBar.svelte";
  import StreamView from "../mobile/StreamView.svelte";
  import MenuMob from "../mobile/MenuMob.svelte";
  import NodeSelection from "../node/NodeSelection.svelte";
  import CameraList from "../lists/CameraList.svelte";
  import LayoutSelection from "../layouts/LayoutSelection.svelte";
  import LayoutDialog from "../dialogs/LayoutDialog.svelte";
  import AddCameraDialog from "../dialogs/AddCameraDialog.svelte";
  import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

  export let data;
  export let url;
  const session = data.session;
  const sessionId = session.id;
  const nodes = data.nodes;
  let animateHeader = false;
  let comfort = true;

  const search = new URLSearchParams(window.location.search);
  const screens = parseInt(search.get("s") ?? "1");
  const cameraCount = $selectedNode.camera.length;

  let recording = false;
  let slideRecording = false;
  let recordDropdownOpen = false;
  let snipDropDownOpen = false;
  let captureRef: HTMLElement;
  let isAllFullScreen = false;
  let displayLayouts = false;
  let nodeCameras = false;

  const PB = new PocketBase(PUBLIC_POCKETBASE_URL);

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

  function toggleDisplayLayouts() {
    displayLayouts = !displayLayouts;
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
  let selectedScreen = null;
  let showRightPanel = true;

  //////
  // mob
  /////

  let liveFullscreen = writable(false);
  let showAlerts = writable(false);
  let editMode = writable(false);
  let landscape = writable(false);
  let activeStreamIndex = writable(null);

  let currpanel = 2;
  let showItems = true;
</script>

<div class="sm:flex flex-row-reverse hidden">
  <div
    class=" flex flex-col gap-2.5 items-center justify-center px-2 h-full my-auto"
  >
    <AddCameraDialog sNode="">
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => {
            addUserLog(`user clicked on Add Camera button, top panel`);
          }}
          class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`}
          ><Plus class="h-[22px] w-[22px]" />
        </button>
        <p class="text-xs group-hover:text-[#015a62] text-black/.23">Add</p>
      </span>
    </AddCameraDialog>
    <SearchDialog>
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => {
            addUserLog(`user clicked on Search button, top panel`);
          }}
          class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`}
          ><Search class="h-[22px] w-[22px]" />
        </button>
        <p class="text-xs group-hover:text-[#015a62] text-black/.23">Search</p>
      </span>
    </SearchDialog>
    <RegisterDialog>
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() =>
            addUserLog("user clicked on Register button, top panel")}
          class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`}
        >
          <ScanFace class="h-[22px] w-[22px]" />
        </button>
        <p class="text-xs group-hover:text-[#015a62] text-black/.23">
          Register
        </p>
      </span>
    </RegisterDialog>
    <a
      href={fullURL}
      target="_blank"
      rel="noreferrer"
      class="flex items-center justify-center gap-2 cursor-pointer relative lg:scale-95 2xl:scale-100 hover:text-primary"
      on:click={() => addUserLog("user clicked on exted display, top panel")}
    >
      <span class="group flex-col flex items-center justify-center gap-0.5">
        <button
          on:click={() => (selectedScreen = 3)}
          class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`}
          ><Monitor class="h-[22px] w-[22px]" /></button
        >
        <p class="text-xs group-hover:text-[#015a62] text-black/.23">Extend</p>
      </span>
    </a>
    <span class="group flex-col flex items-center justify-center gap-0.5">
      <button
        on:click={() => {
          recordDropdownOpen = !recordDropdownOpen;
          snipDropDownOpen = false;
          addUserLog("user clicked on start recording, top panel ");
        }}
        class={!recordDropdownOpen
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`
          : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><Disc2 class="h-[22px] w-[22px]" />
        {#if recordDropdownOpen}
          <div
            id="dropdown"
            class="z-50 dark:text-white text-black flex items-center border justify-center bg-background divide-y divide-gray-100 shadow-dropdown rounded-lg shadow w-40 absolute right-12"
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
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">Record</p>
    </span>
    <span class="group flex-col flex items-center justify-center gap-0.5">
      <button
        on:click={() => {
          snipDropDownOpen = !snipDropDownOpen;
          recordDropdownOpen = false;
          addUserLog("user clicked on screen snip, top panel ");
        }}
        class={!snipDropDownOpen
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] bg-white  group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`
          : ` border-none relative rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><ImageDown class="h-[22px] w-[22px]" />
        {#if snipDropDownOpen}
          <div
            id="dropdown"
            class="z-50 dark:text-white text-black flex items-center border justify-center bg-background divide-y divide-gray-100 shadow-dropdown rounded-lg shadow w-40 absolute right-12"
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
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">Snip</p>
    </span>
    <span class="group flex-col flex items-center justify-center gap-0.5">
      <button
        on:click={() => {
          alertPanelHide.set(!$alertPanelHide);
          currpanel = 1;
          localStorage.setItem(
            "alertPanelHide",
            JSON.stringify($alertPanelHide),
          );
          addUserLog(`user set alert panel hide to ${$alertPanelHide} `);
        }}
        class={$alertPanelHide
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] bg-white grid place-items-center  group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none`
          : ` border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><Bell class="h-[22px] w-[22px]" /></button
      >
      <p
        class={`text-xs ${$alertPanelHide ? "group-hover:text-[#015a62] text-black/.23" : "text-[#015a62]"}`}
      >
        Alerts
      </p>
    </span>
    <span class="group flex-col flex items-center justify-center gap-0.5">
      <button
        disabled={cameraCount === 0}
        on:click={() => {
          toggleFullscreen();
          addUserLog(`user clicked on fulscreen, top panel`);
        }}
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`}
        ><Expand class="h-[22px] w-[22px]" /></button
      >
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">
        Fullscreen
      </p>
    </span>
    <span class="group flex-col flex items-center justify-center gap-0.5">
      <button
        on:click={() => {
          displayLayouts = !displayLayouts;
          nodeCameras = false;
          addUserLog("user clicked display and layouts, left pane");
        }}
        class={!displayLayouts
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`
          : ` border-none relative rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center`}
        ><LayoutPanelLeft class="h-[22px] w-[22px]" />
        {#if displayLayouts}
          <span
            class="z-40 w-[200px] border flex items-center justify-center bg-background dark:text-white text-black divide-y divide-gray-100 shadow-dropdown rounded-lg shadow absolute right-12"
          >
            <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li
                class="w-full"
                on:click={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <LayoutDialog {toggleDisplayLayouts}>
                  <button
                    class="block rounded-md px-4 py-2 text-center hover:bg-[rgba(92,75,221,.1)] dark:hover:bg-gray-600 dark:hover:text-white w-full disabled:cursor-not-allowed"
                  >
                    Manage Screen layouts
                  </button>
                </LayoutDialog>
              </li>
              <li class="w-full">
                <button
                  class="rounded-md cursor-not-allowed text-center block px-4 py-2 hover:bg-[rgba(92,75,221,.1)] dark:hover:bg-gray-600 dark:hover:text-white w-full disabled:cursor-not-allowed"
                >
                  Manage Displays
                </button>
              </li>
            </ul>
          </span>
        {/if}
      </button>
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">Layouts</p>
    </span>
    <span class="group flex-col flex items-center justify-center gap-0.5">
      <button
        on:click={() => {
          nodeCameras = !nodeCameras;
          displayLayouts = false;
          addUserLog("user clicked nodes and cameras, left pane");
        }}
        class={!nodeCameras
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] bg-white group-hover:text-white group-hover:bg-[#015a62] group-hover:border-none grid place-items-center`
          : ` border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center relative`}
        ><Cctv class="h-[22px] w-[22px]" />

        {#if nodeCameras}
          <span
            class="z-40 border w-[200px] flex items-center justify-center bg-background dark:text-white text-black divide-y divide-gray-100 shadow-dropdown rounded-lg shadow absolute right-12"
          >
            <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
              <li class="w-full">
                <button
                  on:click={() =>
                    (window.location.href = `/configuration/${sessionId}?section=Camera`)}
                  class="rounded-md block px-4 py-2 hover:bg-[rgba(92,75,221,.1)] dark:hover:bg-gray-600 dark:hover:text-white w-full disabled:cursor-not-allowed"
                >
                  Manage existing Nodes
                </button>
              </li>
              <li class="w-full">
                <button
                  on:click={() =>
                    (window.location.href = `/configuration/${sessionId}?section=Camera`)}
                  class="rounded-md block px-4 py-2 hover:bg-[rgba(92,75,221,.1)] dark:hover:bg-gray-600 dark:hover:text-white w-full disabled:cursor-not-allowed"
                >
                  Manage existing Cameras
                </button>
              </li>
            </ul>
          </span>
        {/if}
      </button>
      <p class="text-xs group-hover:text-[#015a62] text-black/.23">Manage</p>
    </span>
  </div>

  <div
    class={"w-full h-[calc(100vh-76px)] hidden sm:flex items-start justify-end relative z-10"}
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
        Exit Fullscreen
      </span>
    {/if}

    {#if !$alertPanelHide}
      <span
        class={`-rotate-90 absolute top-44 z-[999] transition-position ease-in-out duration-500 flex ${isAllFullScreen && showRightPanel ? "right-[12.7rem]" : showRightPanel && !isAllFullScreen ? "2xl:right-[12.7rem] right-[11.8rem]" : !showRightPanel ? "-right-20 opacity-0" : "-right-20"}`}
      >
        <button
          on:click={() => (currpanel = 1)}
          class={`cursor-pointer w-[100px] h-[32px] rounded-t-xl ${isAllFullScreen ? "text-white bg-slate-800" : "text-black dark:text-white bg-white dark:bg-slate-800"} z-[800] flex items-center justify-center gap-2 shad text-sm ${currpanel === 1 && "font-bold"}`}
          >Alerts <button
            on:click={() => {
              currpanel = 2;
              alertPanelHide.set(true);
            }}><X class="h-4 w-4" /></button
          >
        </button>
        <button
          on:click={() => (currpanel = 2)}
          class={` cursor-pointer w-[100px] h-[32px] rounded-t-xl ${isAllFullScreen ? "text-white bg-slate-800" : "text-black dark:text-white bg-white dark:bg-slate-800"} shad z-[800] flex items-center justify-center gap-2 text-sm ${currpanel === 2 && "font-bold"}`}
          >Cameras
        </button>
      </span>
    {/if}

    <button
      on:click={() => (showRightPanel = !showRightPanel)}
      class={`absolute ${showRightPanel ? "right-[17rem] 2xl:right-[18rem]" : "right-0"} py-1 rounded-l-md bg-[#f9f9f9] dark:bg-slate-800 top-1/2 -translate-y-1/2 shadow-md transition-position ease-in-out duration-500 z-[99999]`}
    >
      <ChevronRight
        class={`${showRightPanel ? "rotate-0" : "rotate-180"} transition-transform ease-in-out duration-700`}
      />
    </button>

    <div
      class={`h-full border-solid 
         border-x-[1px] 
         transition-width ease-in-out duration-500 overflow-y-scroll z-[998]
        ${showRightPanel ? "w-1/4" : "w-0"} relative max-w-72`}
    >
      <!-- <button
        on:click={() => (showRightPanel = false)}
        class="absolute top-1/2 -translate-y-1/2 bg-[#f9f9f9] grid place-items-center py-1 z-[99999] shadow-md"
      >
        <ChevronRight />
      </button> -->
      {#if !$alertPanelHide && currpanel === 1}
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
              <Settings size={18} />
              <Filter size={18} />
            </div>
          </div>
        </div>
        <div
          class={`flex flex-row items-center justify-center gap-4 ${isAllFullScreen ? "bg-[#333]" : "bg-[#f9f9f9] dark:bg-[#333]"} p-2`}
        >
          <button
            on:click={() => (comfort = true)}
            class={!comfort
              ? `bg-transparent font-medium ${isAllFullScreen ? "text-slate-50" : "text-[#afafaf]"} text-sm`
              : `font-medium text-sm px-4 py-2 rounded-md ${isAllFullScreen ? "bg-black text-slate-200" : "bg-white text-[#727272] dark:bg-black dark:text-slate-200"}`}
            >Comfortable</button
          >
          <button
            on:click={() => (comfort = false)}
            class={comfort
              ? `bg-transparent font-medium ${isAllFullScreen ? "text-slate-50" : "text-[#afafaf]"} text-sm`
              : `font-medium text-sm px-4 py-2 rounded-md ${isAllFullScreen ? "bg-black text-slate-200" : "bg-white text-[#727272] dark:bg-black dark:text-slate-200"}`}
            >Informative</button
          >
        </div>
        {#if comfort}
          <div class="m-4 flex flex-col gap-2">
            {#each galleryItems as galleryItem}
              <ComfortableProfileCard {galleryItem} {isAllFullScreen} />
            {/each}
          </div>
          <Accordion.Root class="m-4">
            <Accordion.Item value="item-1">
              <Accordion.Trigger>Unknowns</Accordion.Trigger>
              <Accordion.Content>
                {#each unknownItems as galleryItem}
                  <ComfortableProfileCard {galleryItem} {isAllFullScreen} />
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
                    class={`relative items-center gap-2 mx-2 my-4 p-2
                 flex bg-[#f9f9f9] dark:bg-black
             rounded-xl shadow-md text-base border 
             ${isAllFullScreen ? "bg-black text-white " : "hover:scale-[1.01] dark:shadow-slate-800 hover:shadow-lg "}
             `}
                  >
                    <img
                      class="object-cover w-16 h-16 rounded-md"
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
                    <div>
                      <h3 class={"font-semibold text-sm"}>
                        {#if event.title.includes("car") && event.description !== ""}
                          {event.description} {event.title}
                        {:else}
                          {event.title}
                        {/if}
                      </h3>
                      <p class={"text-xs text-black/.7"}>
                        Camera {$selectedNode.camera.filter(
                          (c) => c.id === event.camera,
                        )[0] &&
                          $selectedNode.camera.filter(
                            (c) => c.id === event.camera,
                          )[0].name}
                      </p>
                      <span
                        class="flex items-center justify-between border-b border-solid border-[#1c1c1c]/.1 gap-2"
                      >
                        <p class="text-[10px] text-[#D28E3D] font-medium">
                          {event.matchScore !== 0 &&
                          event.matchScore !== undefined &&
                          event.matchScore !== null
                            ? `Match Score : ${event?.matchScore}`
                            : "No matches found"}
                        </p>
                        <p class="text-[10px] font-semibold">{event?.score}</p>
                      </span>
                      <span class="flex items-center justify-between gap-2">
                        <p class={"text-[10px]"}>
                          {event.created.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p class={"text-[10px]"}>
                          {event.created.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </span>
                    </div>
                  </article>
                </li>
              {/each}
            {/if}
          </ul>
        {/if}
      {:else}
        <NodeSelection {isAllFullScreen} {nodes} {url} />
        <CameraList {isAllFullScreen} {showItems} />
      {/if}
    </div>
  </div>
</div>

{#if selectedEvent}
  <EventModal {selectedEvent} on:close={() => (selectedEvent = null)} />
{/if}

<div class="mob min-h-screen w-full text-black relative sm:hidden bg-[#f5f6f7]">
  {#if !$landscape}
    <TopBar
      displayIcons={true}
      bind:liveFullscreen={$liveFullscreen}
      bind:editMode={$editMode}
      bind:landscape={$landscape}
    />
  {/if}
  <StreamView
    {galleryItems}
    bind:landscape={$landscape}
    bind:activeStreamIndex={$activeStreamIndex}
    bind:liveFullscreen={$liveFullscreen}
    bind:showAlerts={$showAlerts}
    bind:editMode={$editMode}
    {data}
  />
  <MenuMob
    bind:landscape={$landscape}
    bind:showAlerts={$showAlerts}
    bind:activeStreamIndex={$activeStreamIndex}
  />
</div>

<style>
  .shad {
    box-shadow: -3px 3px 4px 0px #0000001f;
  }
</style>
