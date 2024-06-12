<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Edit, Settings, Trash, Menu } from "lucide-svelte";
  import { hoveredCamera, selectedNode } from "@/lib/stores";
  import { activeCamera } from "@/lib/stores";
  import CameraSettingsDialog from "../dialogs/CameraSettingsDialog.svelte";
  import { addUserLog } from "@/lib/addUserLog";
  import CameraEditDialog from "../dialogs/CameraEditDialog.svelte";
  import { writable } from "svelte/store";

  export let isAllFullScreen: boolean;

  export let cameraId: string;
  export let name: string;
  export let url: string;
  export let save: boolean;
  export let face: boolean;
  export let vehicle: boolean;
  export let faceDetectionThreshold: number;
  export let faceSearchThreshold: number;
  export let vehicleDetectionThreshold: number;
  export let vehiclePlateThreshold: number;
  export let vehicleOCRThreshold: number;
  export let saveDuration: number;
  export let saveFolder: string;
  export let motion: number;
  export let priority: boolean;
  // CODE

  // console.log(features);

  const deleteCamera = () => {
    // const cell = document.getElementById(`stream-${cameraId}`);
    // if (cell) {
    //   document.getElementById(`stream-${cameraId}`)?.remove();
    // }
    fetch("/api/camera/deleteCamera", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cameraId,
        nodeId: $selectedNode.id,
        name,
        url,
      }),
    }).then(() => {
      document.getElementById(`stream-${cameraId}`)?.remove();
      toast("Camera deleted");
    });
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- markup (zero or more items) goes here -->

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<article
  class={`flex  items-center gap-4 p-4 dark:border
              hover:border hover:border-primary ${isAllFullScreen && "text-slate-100"}
              rounded-xl shadow-md text-base z-10 w-full px-4
          ${cameraId === $activeCamera ? ` border animate-gradient-border  ${isAllFullScreen ? "bg-black" : "bg-[#f9f9f9] dark:bg-black"}` : `${isAllFullScreen ? "bg-black" : "bg-[#f9f9f9] dark:bg-black"}`}
        `}
  on:mouseover={() => {
    hoveredCamera.set(cameraId);
  }}
  on:click={() => {
    addUserLog(
      `user clicked on camera ${name} having url "${url}" from cameralist`,
    );
    activeCamera.update((previous) => (previous === cameraId ? "" : cameraId));
  }}
  on:mouseleave={() => {
    hoveredCamera.set("");
  }}
>
  <Menu class=" h-4 w-4 my-handle cursor-grab flex-shrink-0" />
  <div class="grid gap-1">
    <h3 class="text-base">
      {!isNaN(parseInt(name)) && String(parseInt(name)) === name
        ? "Camera"
        : ``}{" "}
      {name?.length > 11 ? name?.substring(0, 10) + "..." : name}
    </h3>
    <p class="text-xs">
      {url?.split("@")?.[1]?.split("/")?.[0]?.split(":")?.[0]}
    </p>
  </div>

  <ul class="flex flex-row gap-2 ml-auto p-0 list-none cursor-pointer">
    <li class="cursor-pointer hover:scale-125">
      <!-- {#if features && features.includes("camera settings")} -->
      <button disabled class="disabled:cursor-not-allowed">
      <!-- <CameraEditDialog {name} {url} {cameraId}> -->
          <Edit class="h-4 w-4" />
        <!-- </CameraEditDialog> -->
      </button>
      <!-- {/if} -->
    </li>
    <li
      class="cursor-pointer hover:scale-125"
     
    >
    <button disabled class="disabled:cursor-not-allowed"  on:click={() => {
      addUserLog(
        `user clicked on camera settings for camera with name  ${name}`,
      );
    }}>
      <CameraSettingsDialog
        cameraName={name}
        {save}
        {face}
        {vehicle}
        {cameraId}
        {faceDetectionThreshold}
        {faceSearchThreshold}
        {vehicleDetectionThreshold}
        {vehiclePlateThreshold}
        {vehicleOCRThreshold}
        {saveFolder}
        {saveDuration}
        {motion}
        {priority}
        cameraURL={url}><Settings class="h-4 w-4" /></CameraSettingsDialog
      >
      <!-- <Settings size={16}/> -->
    </button>

    </li>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <li class="cursor-pointer hover:scale-125" >
      <button class=" disabled:cursor-not-allowed" on:click={deleteCamera}>
        <Trash class="h-4 w-4" />
      </button>
    </li>
  </ul>
</article>
