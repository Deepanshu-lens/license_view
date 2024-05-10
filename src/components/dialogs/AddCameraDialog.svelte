<script lang="ts">
  import { toast } from "svelte-sonner";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { selectedNode } from "@/lib/stores";
  import { Slider } from "@/components/ui/slider";
  import Switch from "../ui/switch/switch.svelte";

  let cameraName = "";
  let cameraURL = "";
  let subURL = "";
  let cameraUsername = "";
  let cameraPass = "";
  let cameraIp = "";
  let saving: boolean = false;
  let vehicle: boolean = false;
  let face: boolean = false;
  let dialogOpen: boolean = false;
  let company: number = 0;
  let disabled: string | null = null;
  let priority: boolean = true;
  let motionThresh: number = 0;

  let mode = 2;

  export let sNode;

  const onSubmit = () => {
    if (cameraURL && cameraURL.length > 0) {
      let modifiedCameraURL = cameraURL;
      const urlParts = cameraURL.split("@");
      console.log(urlParts);
      const atIndex = cameraURL.indexOf("@");
      if (urlParts.length > 2) {
        console.log(atIndex);
        modifiedCameraURL = urlParts[0] + "%40" + urlParts.slice(1).join("@");
      }
      console.log(modifiedCameraURL);
      fetch("/api/camera/addCamera", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cameraName,
          url: modifiedCameraURL,
          subUrl: subURL,
          nodeId: sNode ? sNode.id : $selectedNode.id,
          face: face,
          save: saving,
          saveFolder: "./PlayBack/",
          saveDuration: 30 * 60 * 24,
          vehicle: vehicle,
          faceDetThresh: 0.93,
          faceMatchThresh: 0.3,
          vehicleDetThresh: 0.4,
          vehiclePlateThresh: 0.5,
          vehicleOCRThresh: 0.6,
          priority: priority === true ? 1 : 0,
          motionThresh:
            motionThresh === 0 ? 1000 : motionThresh === 50 ? 2500 : 5000,
        }),
      }).then((response) => {
        if (response.ok) {
          dialogOpen = false;
        }
        toast("Camera added");
      });
    } else {
      if (company === 2 || company === 3) {
        let newUrl =
          "rtsp://" +
          cameraUsername +
          ":" +
          (cameraPass.includes("@")
            ? cameraPass.replace("@", "%40")
            : cameraPass) +
          "@" +
          cameraIp;
        console.log(newUrl);
        fetch("/api/camera/addCamera", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cameraName,
            url: newUrl,
            subUrl: subURL,
            nodeId: sNode ? sNode.id : $selectedNode.id,
            face: face,
            save: saving,
            vehicle: vehicle,
            faceDetThresh: 0.93,
            faceMatchThresh: 0.3,
            vehicleDetThresh: 0.4,
            vehiclePlateThresh: 0.5,
            vehicleOCRThresh: 0.6,
            saveFolder: "./PlayBack/",
            saveDuration: 30 * 60 * 24,
            priority: priority === true ? 1 : 0,
            motionThresh:
              motionThresh === 0 ? 1000 : motionThresh === 50 ? 2500 : 5000,
          }),
        }).then((response) => {
          if (response.ok) {
            dialogOpen = false;
          }
          toast("Camera added");
        });
      } else if (company === 1) {
        let newUrl =
          "rtsp://" +
          cameraUsername +
          ":" +
          (cameraPass.includes("@")
            ? cameraPass.replace("@", "%40")
            : cameraPass) +
          "@" +
          cameraIp +
          ":554/cam/realmonitor?channel=1\u0026subtype=0";
        console.log(newUrl);
        fetch("/api/camera/addCamera", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cameraName,
            url: newUrl,
            subUrl: subURL,
            nodeId: sNode ? sNode.id : $selectedNode.id,
            face: face,
            save: saving,
            vehicle: vehicle,
            faceDetThresh: 0.93,
            faceMatchThresh: 0.3,
            vehicleDetThresh: 0.4,
            vehiclePlateThresh: 0.5,
            vehicleOCRThresh: 0.6,
            saveFolder: "./PlayBack/",
            saveDuration: 30 * 60 * 24,
            priority: priority === true ? 1 : 0,
            motionThresh:
              motionThresh === 0 ? 1000 : motionThresh === 50 ? 2500 : 5000,
          }),
        }).then((response) => {
          if (response.ok) {
            dialogOpen = false;
          }
          toast("Camera added");
        });
      }
    }
  };

  function updateCompany(value: number) {
    company = value;
  }

  $: {
    if (
      cameraUsername?.length > 0 ||
      cameraPass?.length > 0 ||
      cameraIp?.length > 0
    ) {
      disabled = "url";
    } else if (cameraURL?.length > 0) {
      disabled = "other";
    } else {
      disabled = null;
    }
  }
</script>

<!-- markup (zero or more items) goes here -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content
    class="sm:max-w-[720px] scale-90 sm:scale-100 z-[70] max-h-[90%] sm:max-h-auto overflow-y-scroll"
  >
    <Dialog.Header>
      <Dialog.Title>Add Camera</Dialog.Title>
      <Dialog.Description>
        Insert a new camera in <span class="font-semibold"
          >{sNode ? sNode.name : $selectedNode.name}</span
        >
        node
      </Dialog.Description>
    </Dialog.Header>
    <div class="w-full flex flex-col items-start justify-center py-4 gap-4">
      <p class="text-[#00132B] dark:text-slate-100">
        Choose from the options below to register your images
      </p>
      <span class="flex items-center justify-between w-full gap-4">
        <button disabled
          class={mode !== 1
            ? "text-[#00132B] dark:text-slate-300 flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[rgb(145,158,171)]/[.24] font-semibold "
            : " text-[#00132B] flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[#136ad5] bg-[#ecf3fc] font-semibold "}
          on:click={() => (mode = 1)}
        >
          <input type="radio" checked={mode === 1} />
          Automatically
        </button>
        <button
          class={mode !== 2
            ? "text-[#00132B] dark:text-slate-300 flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[rgb(145,158,171)]/[.24] font-semibold"
            : "text-[#00132B] flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[#136ad5] bg-[#ecf3fc] font-semibold"}
          on:click={() => (mode = 2)}
        >
          <input type="radio" checked={mode === 2} />
          Manually
        </button>
      </span>
    </div>
    {#if mode === 2}
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="camera-name">Name</Label>
          <Input
            id="camera-name"
            placeholder={"Home-Porch"}
            class="col-span-3"
            bind:cameraName
            on:change={(e) => (cameraName = e.target.value)}
          />
        </div>
      </div>
      <span class="text-xl font-semibold mx-auto">Using url</span>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="camera-url">Main URL</Label>
          <Input
            id="camera-url"
            class="col-span-3"
            disabled={disabled === "url"}
            placeholder={"rtsp://admin:password@123.123.123.123/stream/1"}
            bind:cameraURL
            on:change={(e) => (cameraURL = e.target.value)}
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="camera-url">Sub URL</Label>
          <Input
            id="camera-url"
            class="col-span-3"
            disabled={disabled === "url"}
            placeholder={"rtsp://admin:password@123.123.123.123/sub-stream/1"}
            bind:subURL
            on:change={(e) => (subURL = e.target.value)}
          />
        </div>
        <span class="text-xl font-semibold mx-auto">Or using details</span>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="camera-username">Username</Label>
            <Input
              id="camera-username"
              class="col-span-3"
              placeholder={"Camera portal username"}
              disabled={disabled === "other"}
              bind:cameraUsername
              on:change={(e) => (cameraUsername = e.target.value)}
            />
            <Label for="camera-pass">Password</Label>
            <Input
              autocomplete="new-password"
              id="camera-pass"
              class="col-span-3"
              placeholder={"Camera portal password"}
              type="password"
              disabled={disabled === "other"}
              bind:cameraPass
              on:change={(e) => (cameraPass = e.target.value)}
            />
            <Label for="camera-ip">IP Address</Label>
            <Input
              id="camera-ip"
              class="col-span-3"
              placeholder={"address associated with camera"}
              disabled={disabled === "other"}
              bind:cameraIp
              on:change={(e) => (cameraIp = e.target.value)}
            />
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <span
            class="block text-sm font-medium leading-6 dark:text-white text-[#2c2c2c]"
          >
            Camera Brand
          </span>
          <div class="flex flex-row items-center gap-6 my-auto col-span-3">
            <label
              class="flex items-center gap-1 text-xs sm:text-sm font-medium leading-6 dark:text-white text-[#2c2c2c]"
            >
              <input
                type="checkbox"
                name="cameraBrand"
                class="disabled:cursor-not-allowed"
                on:change={() => {
                  if (company !== 1) {
                    updateCompany(1);
                  } else {
                    updateCompany(0);
                  }
                }}
                disabled={disabled === "other"}
                checked={company === 1}
              />{" "}
              CP Plus
            </label>
            <label
              class="flex items-center gap-1 text-xs sm:text-sm font-medium leading-6 dark:text-white text-[#2c2c2c]"
            >
              <input
                type="checkbox"
                name="cameraBrand"
                class="disabled:cursor-not-allowed"
                on:change={() => {
                  if (company !== 2) {
                    updateCompany(2);
                  } else {
                    updateCompany(0);
                  }
                }}
                disabled={disabled === "other"}
                checked={company === 2}
              />{" "}
              Hikvision
            </label>
            <label
              class="flex items-center gap-1 text-xs sm:text-sm font-medium leading-6 dark:text-white text-[#2c2c2c]"
            >
              <input
                type="checkbox"
                name="cameraBrand"
                class="disabled:cursor-not-allowed"
                on:change={() => {
                  if (company !== 3) {
                    updateCompany(3);
                  } else {
                    updateCompany(0);
                  }
                }}
                disabled={disabled === "other"}
                checked={company === 3}
              />
              Other
            </label>
          </div>
        </div>
        <span class="text-xl font-semibold mx-auto pt-2">Features</span>
        <div class="grid grid-cols-4 items-center gap-4 py-2">
          <span
            class="block text-sm font-medium leading-6 dark:text-white text-[#2c2c2c]"
          >
            Camera Features
          </span>
          <div
            class="flex flex-row items-center gap-3 my-auto col-span-3 flex-wrap sm:flex-nowrap"
          >
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label
              class=" text-xs 2xl:text-sm font-medium leading-6 dark:text-white text-[#2c2c2c] flex items-center gap-1"
            >
              <Switch bind:checked={saving} class="scale-90" />
              Feed Saving
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label
              class=" text-xs 2xl:text-sm font-medium leading-6 dark:text-white text-[#2c2c2c] flex items-center gap-1"
            >
              <Switch bind:checked={vehicle} class="scale-90" />
              Vehicle Scan
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label
              class=" text-xs 2xl:text-sm font-medium leading-6 dark:text-white text-[#2c2c2c] flex items-center gap-1"
            >
              <Switch bind:checked={face} class="scale-90" />
              Face Scan
            </label>

            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label
              class=" text-xs 2xl:text-sm font-medium leading-6 dark:text-white text-[#2c2c2c] flex items-center gap-1"
            >
              <Switch bind:checked={priority} class="scale-90" />
              Priority
            </label>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4 py-2">
          <span
            class="block text-sm font-medium leading-6 dark:text-white text-[#2c2c2c]"
          >
            Motion Sensitivity
          </span>
          <div class="flex items-center gap-4 grid-cols-3">
            <Slider
              min={0}
              value={[motionThresh]}
              max={100}
              step={50}
              class="w-32"
              onValueChange={(e) => {
                motionThresh = e[0];
              }}
            />
            {motionThresh === 0 ? "Low" : motionThresh === 50 ? "Mid" : "High"}
          </div>
        </div>

        <Dialog.Footer>
          <Button type="submit" on:click={onSubmit}>Add Camera</Button>
        </Dialog.Footer>
      </div>
    {:else}
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="camera-name">Name</Label>
          <Input
            id="camera-name"
            placeholder={"Home-Porch"}
            class="col-span-3"
            bind:cameraName
            on:change={(e) => (cameraName = e.target.value)}
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="camera-url">URL</Label>
          <Input
            id="camera-url"
            class="col-span-3"
            disabled={disabled === "url"}
            placeholder={"rtsp://admin:password@123.123.123.123/sub-stream/1"}
            bind:cameraURL
            on:change={(e) => (cameraURL = e.target.value)}
          />
        </div>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
