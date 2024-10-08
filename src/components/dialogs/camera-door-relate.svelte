<script lang="ts">
// Imports
import PocketBase from "pocketbase";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { writable } from "svelte/store";
import * as Dialog from "@/components/ui/dialog";
import { Check, Plus } from "lucide-svelte";
import { page } from "$app/stores";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "svelte-sonner";
    import { getContext } from "svelte";

// Props
export let cameraList;
export let doorId;
export let doorName;

// Stores
let dialogOpen = writable(false);
let selectedCamerasIds = writable<string[]>([]);

const PB: PocketBase = getContext("pb");

const addCameras = async () => {
  let label = $selectedCamerasIds.length <= 1 ? "Camera" : "Cameras";

  await PB.collection("atlas_door")
    .update(doorId, { cameraId: $selectedCamerasIds })
    .then((res) => {
      console.log(res);
      toast.success(
        `${$selectedCamerasIds.length} ${label} added to ${doorName}`,
      );
    })
    .catch((err) => {
      console.log("Failed to add cameras", err);
      toast.error(`Failed to add ${label}`);
    });
  dialogOpen.set(false);
};

const handleCheckboxChange = (cameraId: string, ischecked: boolean) => {
  if (ischecked) {
    selectedCamerasIds.update((ids) => [...ids, cameraId]);
  } else {
    selectedCamerasIds.update((ids) => ids.filter((id) => id !== cameraId));
  }
  console.log($selectedCamerasIds);
};
</script>

<Dialog.Root bind:open={$dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[600px] scale-90 sm:scale-100">
    <Dialog.Header>
      <Dialog.Title>Add Cameras to Door</Dialog.Title>
    </Dialog.Header>
    {#if cameraList.length <= 0}
      <p class="text-primary p-5">No Cameras to add</p>
    {:else}
      <form
        on:submit={addCameras}
        class="flex gap-8 flex-row w-full flex-wrap items-center justify-start p-5"
      >
        {#each cameraList as camera, index}
          <div class="flex flex-row gap-2 items-center">
            <!-- Checkbox from shadcn -->
            <Checkbox
              id={`camera-checkbox-${index}`}
              checked={$selectedCamerasIds.includes(camera.id)}
              onCheckedChange={(e) => handleCheckboxChange(camera.id, e)}
            />
            <Label for={`camera-checkbox-${index}`} class="capitalize"
              >{camera.name}</Label
            >
          </div>
        {/each}
      </form>

      <Dialog.Footer>
        <span class="flex items-center gap-4">
          <Button on:click={() => dialogOpen.set(false)} variant="secondary"
            >Cancel</Button
          >
          <Button
            type="submit"
            class="mt-auto flex items-center gap-1 w-full"
            on:click={(e) => {
              e.preventDefault();
              addCameras();
            }}
          >
            <Plus size={16} />
            Add Cameras
          </Button>
        </span>
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>
