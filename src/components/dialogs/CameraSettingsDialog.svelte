<script lang="ts">
  import { toast } from "svelte-sonner";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { selectedNode } from "@/lib/stores";
  import { Switch } from "@/components/ui/switch";
  import * as Select from "@/components/ui/select";

  import { Slider } from "@/components/ui/slider";

  import {
    Car,
    FileVideo2,
    Merge,
    FolderSearch,
    Pipette,
    ScanFace,
    Activity,
    Siren,
  } from "lucide-svelte";

  export let cameraName = "";
  export let cameraURL = "";
  export let cameraId = "";
  export let save: boolean;
  export let face: boolean;
  export let vehicle: boolean;
  export let faceDetectionThreshold: number = 0.6;
  export let faceSearchThreshold: number = 0.3;
  export let vehicleDetectionThreshold: number = 0.6;
  export let vehiclePlateThreshold: number = 0.3;
  export let vehicleOCRThreshold: number = 0.6;
  export let saveDuration: number;
  export let saveFolder: string;
  export let motion: number;
  export let priority: boolean;
  let dialogOpen = false;

  const items = [
    {
      value: 30 * 24 * 60,
      label: "Every month",
    },
    {
      value: 7 * 24 * 60,
      label: "Every week",
    },
    {
      value: 24 * 60,
      label: "Every day",
    },
    {
      value: 60,
      label: "Every hour",
    },
    {
      value: 1,
      label: "Every minute",
    },
  ];

  const editCamera = () => {
    fetch("/api/camera/editCamera", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cameraId,
        nodeId: $selectedNode.id,
        name: cameraName,
        url: cameraURL,
        face,
        save,
        vehicle,
        faceDetectionThreshold,
        faceSearchThreshold,
        vehicleDetectionThreshold,
        vehiclePlateThreshold,
        vehicleOCRThreshold,
        saveDuration,
        saveFolder,
        motionThresh: motion === 0 ? 1000 : motion === 0.5 ? 2500 : 5000,
      }),
    }).then(() => {
      toast("Camera settings updated.");
      dialogOpen = false;
    });
  };

  console.log(motion);
</script>

<!-- markup (zero or more items) goes here -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[720px] scale-90 2xl:scale-100">
    <Dialog.Header>
      <Dialog.Title>Camera Settings</Dialog.Title>
      <Dialog.Description>
        Change settings for <span class="font-semibold">{cameraName}</span>
        camera
      </Dialog.Description>
    </Dialog.Header>

    <div class="rounded-md border p-4 my-2">
      <div class="flex items-center space-x-4">
        <FileVideo2 />
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium leading-none">Video Saving</p>
          <p class="text-sm text-muted-foreground">
            Save camera feed directly to your device
          </p>
        </div>
        <Switch bind:checked={save} />
      </div>
      <div>
        {#if save}
          <div class="flex items-center space-x-4 pt-3">
            <FolderSearch />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">Save Here</p>
              <p class="text-sm text-muted-foreground">
                Point your video to its future home.
              </p>
            </div>
            <Input
              id="picture"
              type="text"
              class="w-[180px]"
              disabled
              placeholder="./PlayBack"
            />
          </div>
          <div class="flex items-center space-x-4 pt-3">
            <Merge />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">Overwrite Interval</p>
              <p class="text-sm text-muted-foreground">
                Duration until the saved video is overwritten.
              </p>
            </div>
            <Select.Root onSelectedChange={(e) => (saveDuration = e.value)}>
              <Select.Trigger class="w-[180px]">
                <Select.Value
                  placeholder={items.filter((m) => m.value === saveDuration)[0]
                    .label}
                />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <!-- <Select.Label>Fruits</Select.Label> -->
                  {#each items as fruit}
                    <Select.Item value={fruit.value} label={fruit.label}
                      >{fruit.label}</Select.Item
                    >
                  {/each}
                </Select.Group>
              </Select.Content>
              <Select.Input name="favoriteFruit" />
            </Select.Root>
          </div>
        {/if}
      </div>
    </div>

    <div class="rounded-md border p-4 my-2">
      <div class="flex items-center space-x-4">
        <ScanFace />
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium leading-none">Face Scanning</p>
          <p class="text-sm text-muted-foreground">
            Parameters for adjusting facial recognition
          </p>
        </div>
        <Switch bind:checked={face} />
      </div>
      <div>
        {#if face}
          <div class="flex items-center space-x-4 pt-3">
            <Pipette />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Face Detection Threshold
              </p>
              <p class="text-sm text-muted-foreground">
                Adjust the threshold to accomodate smaller or larger faces
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Slider
                min={10}
                value={[faceDetectionThreshold * 100]}
                max={95}
                step={10}
                class="w-32"
                onValueChange={(e) => {
                  faceDetectionThreshold = e[0] / 100;
                }}
              />
              {faceDetectionThreshold}
            </div>
          </div>
          <div class="flex items-center space-x-4 pt-3">
            <Pipette />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Face Search Threshold
              </p>
              <p class="text-sm text-muted-foreground">
                Adjust the threshold to accomodate smaller or larger faces
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Slider
                min={10}
                value={[faceSearchThreshold * 100]}
                max={95}
                step={10}
                class="w-32"
                onValueChange={(e) => {
                  faceSearchThreshold = e[0] / 100;
                }}
              />
              {faceSearchThreshold}
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="rounded-md border p-4 my-2">
      <div class="flex items-center space-x-4">
        <Car />
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium leading-none">Vehicle Scanning</p>
          <p class="text-sm text-muted-foreground">
            Parameters for adjusting vehicle recognition
          </p>
        </div>
        <Switch bind:checked={vehicle} />
      </div>
      <div>
        {#if vehicle}
          <div class="flex items-center space-x-4 pt-3">
            <Pipette />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Vehicle Detection Threshold
              </p>
              <p class="text-sm text-muted-foreground">
                Adjust the threshold to accomodate smaller or larger vehicles
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Slider
                min={10}
                value={[vehicleDetectionThreshold * 100]}
                max={95}
                step={10}
                class="w-32"
                onValueChange={(e) => {
                  vehicleDetectionThreshold = e[0] / 100;
                }}
              />
              {vehicleDetectionThreshold}
            </div>
          </div>
          <div class="flex items-center space-x-4 pt-3">
            <Pipette />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Vehicle Plate Threshold
              </p>
              <p class="text-sm text-muted-foreground">
                Adjust the threshold to accomodate smaller or larger number
                plates
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Slider
                min={10}
                value={[vehiclePlateThreshold * 100]}
                max={95}
                step={10}
                class="w-32"
                onValueChange={(e) => {
                  vehiclePlateThreshold = e[0] / 100;
                }}
              />
              {vehiclePlateThreshold}
            </div>
          </div>
          <div class="flex items-center space-x-4 pt-3">
            <Pipette />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">
                Plate Lettering Threshold
              </p>
              <p class="text-sm text-muted-foreground">
                Adjust the threshold to accomodate letterings
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Slider
                min={10}
                value={[vehicleOCRThreshold * 100]}
                max={95}
                step={10}
                class="w-32"
                onValueChange={(e) => {
                  vehicleOCRThreshold = e[0] / 100;
                }}
              />
              {vehicleOCRThreshold}
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="rounded-md flex items-center justify-between border p-4 my-2">
      <div class="flex items-center space-x-4">
        <Siren />
        <p class="text-sm font-medium leading-none">Priority</p>
      </div>
      <div class="flex items-center gap-4">
        <Switch bind:checked={priority} />
      </div>
    </div>

    <div class="rounded-md border p-4 my-2 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Activity />
        <p class="text-sm font-medium leading-none">Motion Sensitivity</p>
      </div>
      <div class="flex items-center gap-4">
        <Slider
          min={0}
          value={[motion === 1000 ? 0 : motion]}
          max={5000}
          step={2500}
          class="w-32"
          onValueChange={(e) => {
            motion = e[0];
          }}
        />
        <!-- {motion} -->
        {motion === 1000 ? "Low" : motion === 2500 ? "Mid" : "High"}
      </div>
    </div>

    <Dialog.Footer>
      <Button type="submit" on:click={editCamera}>Change Camera Settings</Button
      >
    </Dialog.Footer></Dialog.Content
  >
</Dialog.Root>
