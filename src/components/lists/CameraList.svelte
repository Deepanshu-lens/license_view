<script lang="ts">
  import type { Camera, SelectedNode } from "@/types";
  import { Cctv, Command, Search } from "lucide-svelte";
  import AddCameraDialog from "../dialogs/AddCameraDialog.svelte";
  import CameraInfoCard from "../cards/CameraInfoCard.svelte";
  import Sortable from "sortablejs";
  import { Input } from "../ui/input";
  import { mode } from "mode-watcher";
  import { onMount } from "svelte";
  import { selectedNode } from "@/lib/stores";
  import Button from "../ui/button/button.svelte";
  export let showItems: boolean;
  import { addUserLog } from "@/lib/addUserLog";
  import { writable } from "svelte/store";

  /**
   * Sortable Camera Info Cards
   */
  export let isAllFullScreen: boolean;
  export let user;
  let filteredCameras: Camera[] = [];
  let cameraItems: HTMLDivElement;
  let filterText: string = "";

  let cameraOrder = writable<number[]>([]);

  // console.log(user);

  // function swap(array, i, j) {
  //   // Check if indices are valid
  //   if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
  //     console.error("Invalid indices provided for swapping.");
  //     return;
  //   }

  //   // Swap elements
  //   let temp = array[i];
  //   array[i] = array[j];
  //   array[j] = temp;
  //   return array;
  // }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape") {
      const input = document.getElementById("searchInput") as HTMLInputElement;
      input.blur(); // Remove focus from the input
    }
  }
  onMount(function () {
    if (cameraItems) {
      Sortable.create(cameraItems, {
        animation: 250,
        chosenClass: "chosen",
        dragClass: "dragged",
        handle: ".my-handle",
      });
    }

    // if (cameraItems) {
    //   const sortable = Sortable.create(cameraItems, {
    //     animation: 250,
    //     chosenClass: "chosen",
    //     dragClass: "dragged",
    //     handle: ".my-handle",
    //     onEnd: (event) => {
    //       console.log(event);
    //       cameraOrder.set(sortable.toArray().map(Number)); // Update the order in the writable store
    //     },
    //   });
    // }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Command + / or Ctrl + / is pressed
      if ((event.metaKey || event.ctrlKey) && event.key === "/") {
        event.preventDefault(); // Prevent the default action to avoid any conflicts
        const input = document.getElementById("searchInput");
        input?.focus();
      }
    };

    // Add the event listener to the window object
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Cleanup the event listener when the component is destroyed
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  $: {
    if (filterText) {
      filteredCameras = $selectedNode?.camera.filter((camera: Camera) =>
        camera.name.toLowerCase().includes(filterText.toLowerCase()),
      );
    } else {
      filteredCameras = $selectedNode?.camera;
    }
  }

  function filterItems(e: Event) {
    filterText = (e.target as HTMLInputElement).value;
  }
</script>

{#if $selectedNode?.camera?.length === 0}
  <div class="w-full py-24 flex justify-center items-center">
    <div class="flex flex-col space-y-6 mx-auto items-center">
      <Cctv size={64} />
      <AddCameraDialog sNode={""}>
        <Button class="mx-auto text-center">Add Camera</Button>
      </AddCameraDialog>
    </div>
  </div>
{:else}
  <!-- START Camera Filtering -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->

  <div
    id="camera-list"
    class={`relative flex items-center px-4 py-4 gap-5 bg-background transition-all duration-100 ${isAllFullScreen ? "bg-black" : ""}
          ${!showItems ? "opacity-0" : "opacity-100"}`}
    on:click={() => {
      addUserLog("user clicked on search cameralist");
    }}
  >
    <span
      class={`absolute  top-1/2 -translate-y-1/2 left-6 transition-all duration-100 
          ${!showItems ? "opacity-0" : "opacity-100"}`}
    >
      <Search
        size={18}
        class={isAllFullScreen ? "text-white" : "text-black dark:text-white"}
      />
    </span>
    <span class="relative w-full">
      <Input
        id="searchInput"
        type="text"
        name="search-input"
        placeholder="Search"
        autocomplete="off"
        autocapitalize="off"
        class={`
                bg-transparent transition-all duration-100
                ${!showItems ? "opacity-0" : "opacity-100"}
                border border-gray-300 
                dark:border-[#333] ${isAllFullScreen ? "text-gray-300" : "text-gray-900 dark:text-gray-300 "} capitalize
                text-sm sm:text-[10px] md:text-xs lg:text-sm xl:text-md rounded-lg
                block py-2.5 pl-10 box-border dark:focus:border-black
                dark:active:border-black
                `}
        on:input={filterItems}
        on:keydown={handleEscape}
      />
      <span
        class={`flex absolute items-center gap-1 text-sm top-1/2 -translate-y-1/2 right-2 ${
          isAllFullScreen ? "text-gray-300" : "text-gray-900 dark:text-gray-300"
        }`}
      >
        <Command
          class={`h-4 w-4 ${isAllFullScreen ? "text-gray-300" : "text-gray-900 dark:text-gray-300"}`}
        /> /
      </span>
    </span>
  </div>
  <!-- END Camera Filtering -->

  <!-- START Camera Cards -->
  {#if filteredCameras.length > 0}<div
      id="camera-items"
      class={`flex flex-col gap-4 w-full max-w-screen-md mx-auto max-h-[calc(100vh-205px)] overflow-y-auto overflow-x-clip
                  transition-all duration-100 fade-in-0
                  p-4 
                  rounded-lg 
                  ${showItems ? "opacity-100 " : "opacity-0"}`}
      bind:this={cameraItems}
    >
      {#each filteredCameras as camera}
        {#key $selectedNode}
          <CameraInfoCard
            cameraId={camera.id}
            name={camera.name}
            url={camera.url}
            save={camera.save}
            face={camera.face}
            vehicle={camera.vehicle}
            faceDetectionThreshold={camera.faceDetThresh}
            faceSearchThreshold={camera.faceMatchThresh}
            vehicleDetectionThreshold={camera.vehicleDetThresh}
            vehiclePlateThreshold={camera.vehiclePlateThresh}
            vehicleOCRThreshold={camera.vehicleOCRThresh}
            saveFolder={camera.saveFolder}
            saveDuration={camera.saveDuration}
            motion={camera.motionThresh}
            priority={camera.priority}
            features={user.features}
            {isAllFullScreen}
          />
        {/key}
      {/each}
    </div>
  {:else}<div
      class={`${isAllFullScreen ? "text-slate-300" : "text-black/[.7] dark:text-slate-300"} px-4 text-sm flex flex-row items-center gap-1 my-4`}
    >
      No cameras found with that name or URL.
    </div>
  {/if}
  <!-- END Camera Cards -->
{/if}
