<script lang="ts">
  import type { Camera, SelectedNode } from "@/types";
  import { Cctv, Search } from "lucide-svelte";
  import AddCameraDialog from "../dialogs/AddCameraDialog.svelte";
  import CameraInfoCard from "../cards/CameraInfoCard.svelte";
  import Sortable from "sortablejs";
  import { Input } from "../ui/input";
  import { mode } from "mode-watcher";
  import { onMount } from "svelte";
  import { leftPaneHide, selectedNode } from "@/lib/stores";
  import Button from "../ui/button/button.svelte";
  export let showItems: boolean;
  import { addUserLog } from "@/lib/addUserLog";

  /**
   * Sortable Camera Info Cards
   */

  let filteredCameras: Camera[] = [];
  let cameraItems: HTMLDivElement;
  let filterText: string = "";

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

  onMount(async function () {
    if (cameraItems)
      Sortable.create(cameraItems, {
        animation: 250,
        chosenClass: "chosen",
        dragClass: "dragged",
        handle: ".my-handle",
      });
  });

  $: {
    if (filterText) {
      filteredCameras = $selectedNode.camera.filter((camera: Camera) =>
        camera.name.toLowerCase().includes(filterText.toLowerCase()),
      );
    } else {
      filteredCameras = $selectedNode.camera;
    }
  }

  function filterItems(e: Event) {
    filterText = (e.target as HTMLInputElement).value;
  }
</script>

{#if !$leftPaneHide}
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
      class={`relative flex items-center px-4 py-4 gap-5 bg-background transition-all duration-100  
          ${!showItems ? "opacity-0" : "opacity-100"}`}
      on:click={() => {
        addUserLog("user clicked on search cameralist");
      }}
    >
      <span
        class={`absolute  top-1/2 -translate-y-1/2 left-6 transition-all duration-100 
          ${!showItems ? "opacity-0" : "opacity-100"}`}
      >
        <Search size={18} />
      </span>
      <Input
        type="text"
        name="search-input"
        placeholder="Search Cameras"
        autocomplete="off"
        autocapitalize="off"
        class={`
                bg-transparent transition-all duration-100
                ${!showItems ? "opacity-0" : "opacity-100"}
                border border-gray-300 
                dark:border-[#333] text-gray-900 dark:text-gray-300 capitalize
                text-sm sm:text-[10px] md:text-xs lg:text-sm xl:text-md rounded-lg
                block py-2.5 pl-10 box-border dark:focus:border-black
                dark:active:border-black
          `}
        on:input={filterItems}
      />

      <AddCameraDialog sNode={""}>
        <svg
          on:click={() => {
            addUserLog("user clicked on addCamera cameralist");
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          class="cursor-pointer"
        >
          <path
            d="M12 1.5C9.22562 1.53347 6.57431 2.65047 4.61239 4.61239C2.65047 6.57431 1.53347 9.22562 1.5 12C1.53347 14.7744 2.65047 17.4257 4.61239 19.3876C6.57431 21.3495 9.22562 22.4665 12 22.5C14.7744 22.4665 17.4257 21.3495 19.3876 19.3876C21.3495 17.4257 22.4665 14.7744 22.5 12C22.4665 9.22562 21.3495 6.57431 19.3876 4.61239C17.4257 2.65047 14.7744 1.53347 12 1.5ZM18 12.75H12.75V18H11.25V12.75H6V11.25H11.25V6H12.75V11.25H18V12.75Z"
            fill={$mode === "dark" ? "#FFF" : "#000"}
          />
        </svg>
      </AddCameraDialog>
    </div>
    <!-- END Camera Filtering -->

    <!-- START Camera Cards -->
    {#if filteredCameras.length > 0}<div
        id="camera-items"
        class={`flex flex-col gap-4 w-full max-w-screen-md mx-auto max-h-[calc(100vh-335px)] overflow-y-auto overflow-x-clip
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
            />
          {/key}
        {/each}
      </div>
    {:else}<div
        class="text-black/[.7] dark:text-slate-300 px-4 text-sm flex flex-row items-center gap-1 my-4"
      >
        No cameras found with that name or URL.
      </div>
    {/if}
    <!-- END Camera Cards -->
  {/if}
{/if}
