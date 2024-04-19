<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Edit, Settings, Trash, Menu } from "lucide-svelte";
  import type { SelectedNode } from "@/types";
  import { hoveredCamera, , selectedNode } from "@/lib/stores";
  import { activeCamera } from "@/lib/stores";
  import { cubicOut } from "svelte/easing";
  import Input from "../ui/input/input.svelte";
  import Button from "../ui/button/button.svelte";
  import CameraSettingsDialog from "../dialogs/CameraSettingsDialog.svelte";
  import { addUserLog } from "@/lib/addUserLog";

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
  let editing = false;
  // CODE

  const editCamera = () => {
    fetch("/api/camera/editCamera", {
      method: "put",
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
      toast("Camera edited");
      stopEditing();
    });
  };

  const deleteCamera = () => {
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

  // Animation parameters
  const animDuration = 300;
  const animDelay = 100;
  const transition = { duration: animDuration, easing: cubicOut };

  // Animation properties
  let nameAnimProps = {
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
  };

  let urlAnimProps = {
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
  };

  // Function to start editing
  function startEditing() {
    editing = true;
    // Reset animation properties
    nameAnimProps = { scaleX: 0, scaleY: 0, opacity: 0 };
    urlAnimProps = { scaleX: 0, scaleY: 0, opacity: 0 };
  }

  // Function to stop editing
  function stopEditing() {
    editing = false;
    // Reset animation properties
    nameAnimProps = { scaleX: 1, scaleY: 1, opacity: 1 };
    urlAnimProps = { scaleX: 1, scaleY: 1, opacity: 1 };
  }
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
    // (selectedNode.camera.filter((c) => c.id === cameraId)[0].hovered = false),
  }}
>
  {#if !editing}
    <Menu size={18} class="my-handle cursor-grab" />
  {/if}
  <div class="grid gap-1">
    {#if editing}
      <Input type="text" bind:value={name} class="text-base" />
      <Input type="text" bind:value={url} class="text-xs" />
    {:else}
      <h3 class="text-base">
        {!isNaN(parseInt(name)) && String(parseInt(name)) === name
          ? "Camera"
          : ``}{" "}
        {name.length > 11 ? name.substring(0, 10) + "..." : name}
      </h3>
      <p class="text-xs">{url?.split("@")?.[1]?.split("/")?.[0]}</p>
    {/if}
  </div>
  {#if !editing}
    <ul class="flex flex-row gap-2 ml-auto p-0 list-none cursor-pointer">
      <li class="cursor-pointer hover:scale-125">
        <button on:click={() => (editing = !editing)}
          ><Edit class="h-4 w-4" /></button
        >
      </li>
      <li
        class="cursor-pointer hover:scale-125"
        on:click={() => {
          addUserLog(
            `user clicked on camera settings for camera with name  ${name}`,
          );
        }}
      >
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
          cameraURL={url}><Settings class="h-4 w-4" /></CameraSettingsDialog
        >
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <li class="cursor-pointer hover:scale-125" on:click={deleteCamera}>
        <Trash class="h-4 w-4" />
      </li>
    </ul>
  {:else}
    <Button on:click={() => (editing = false)} variant="secondary"
      >Cancel</Button
    >
    <Button on:click={editCamera}>Save Changes</Button>
  {/if}
</article>
