<script lang="ts">
  import { toast } from "svelte-sonner";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { onMount } from "svelte";
  import { cn } from "@/lib";
  import { writable } from "svelte/store";
  let dialogOpen = false;
  let captureMode = 1;
  let username: string = "";
  const registrationImages = writable<string[]>([]);

  let webcamSource: HTMLVideoElement;
  let webcamCanvas: HTMLCanvasElement;
  let stream: MediaStream;
  const openWebcam = async () => {
    try {
      // loading = true;
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      webcamSource.srcObject = stream;
      webcamSource.play();

      // loading = false;
    } catch (error) {
      console.log(error);
    }
  };

  const closeWebcam = async () => {
    stream.getTracks().forEach((track) => {
      console.log(track);
      if (track.readyState == "live" && track.kind === "video") {
        track.stop();
        track.enabled = false;
      }
      webcamSource.srcObject = null;
    });
  };

  let loading = false;
  async function capturePhoto() {
    const context = webcamCanvas.getContext("2d");
    if (context) {
      webcamCanvas.width = webcamSource.videoWidth;
      webcamCanvas.height = webcamSource.videoHeight;
      context.drawImage(
        webcamSource,
        0,
        0,
        webcamSource.videoWidth,
        webcamSource.videoHeight,
      );
      loading = true;
      let frame = webcamCanvas.toDataURL("image/jpeg");
      const result = await fetch("http://localhost:8083" + "/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frame: frame.replace(/^data:[^,]+,/, "") }),
      });
      if (!result.ok) {
        const error = (await result.json()).error;
        console.error(error);
        toast.error("Something went wrong. Please try another");
        loading = false;
        return;
      }
      const croppedImage = await result.json();
      loading = false;

      registrationImages.update((images) => [...images, croppedImage]);
    }
  }

  async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  const onFileUpload = async (e) => {
    const file = e?.target.files[0];
    if (file) {
      try {
        let base64String = await convertImageToBase64(file);
        const result = await fetch("http://localhost:8083" + "/api/enroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            frame: base64String.replace(/^data:[^,]+,/, ""),
          }),
        });
        console.log("first on file upload register", result.status);
        if (!result.ok) {
          const error = (await result.json()).error;
          console.error("!@!!! ", error);
          toast.error("Something went wrong. Please try another");
          loading = false;
          return;
        }
        const croppedImage = await result.json();
        loading = false;

        registrationImages.update((images) => [...images, croppedImage]);
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong. Please try another file.");
      }
    }
  };

  $: {
    if (dialogOpen && captureMode == 1) {
      console.log("!");
      openWebcam();
    }
  }

  $: {
    if (!dialogOpen && stream) {
      console.log("Closing");
      closeWebcam();
    }
  }

  const onSubmit = () => {
    fetch(`/api/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, data: [...$registrationImages] }),
    }).then(() => {
      toast.success(`${username} successfully added to gallery`);
      registrationImages.set([]);
      username = "";
      dialogOpen = false;
    });
  };
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[720px]">
    <Dialog.Header>
      <Dialog.Title>Register Face</Dialog.Title>
      <Dialog.Description
        >Register a new person to the Gallery</Dialog.Description
      >
    </Dialog.Header>
    <div class="w-full flex flex-col items-start justify-center py-4 gap-4">
      <p class="text-[#00132B] dark:text-slate-100">
        Choose from the options below to register your images
      </p>
      <span class="flex items-center justify-between w-full gap-4">
        <button
          class={captureMode !== 1
            ? "text-[#00132B] dark:text-slate-300 flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[rgb(145,158,171)]/[.24] font-semibold "
            : " text-[#00132B] flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[#136ad5] bg-[#ecf3fc] font-semibold "}
          on:click={() => (captureMode = 1)}
        >
          <input type="radio" checked={captureMode === 1} />
          Capture image live
        </button>
        <button
          class={captureMode !== 2
            ? "text-[#00132B] dark:text-slate-300 flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[rgb(145,158,171)]/[.24] font-semibold"
            : "text-[#00132B] flex flex-row items-center h-[67px] w-[320px] px-4 py-2 justify-start gap-4 rounded-lg border-[1px] border-solid border-[#136ad5] bg-[#ecf3fc] font-semibold"}
          on:click={() => (captureMode = 2)}
        >
          <input type="radio" checked={captureMode === 2} />
          Upload Image
        </button>
      </span>
      <label for="username" class=" text-[#00132B] dark:text-slate-100">
        Username
      </label>
      <span class="relative">
        <input
          name="Person Name"
          type="text"
          class="w-[655px] h-[48px] relative rounded-lg pl-4 border-[2px] border-solid border-[rgb(145,158,171)]/[.24] focus:border-[#136ad5] placeholder-[#939393] bg-background"
          placeholder="Type or select name"
          bind:value={username}
        />

        <!-- <SvgComponent
          name="ChevD"
          height={20}
          width={20}
          viewBox="0 0 24 24"
          className="absolute top-1/2 -translate-y-1/2 right-4 text-[#939393]"
        /> -->
      </span>
    </div>
    {#if captureMode === 1}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        bind:this={webcamSource}
        class="h-[420px] w-[650px] lg:w-[500px] lg:h-[290px] self-center mx-auto"
      />
      <div class="flex flex-wrap justify-center">
        {#each $registrationImages as image, index}
          <div
            class={cn("border-4 relative flex flex-row")}
            style="margin: 5px;"
          >
            <img
              src={"data:image/jpeg;base64," + image.bboxes[0].Image}
              alt="captured"
              width="100px"
            />
          </div>
          {#if (index + 1) % 4 === 0}
            <!-- Start a new row after every 4 images -->
            <div class="w-full"></div>
          {/if}
        {/each}
      </div>

      <canvas bind:this={webcamCanvas} style="display: none;"></canvas>
      <Button
        class="w-[650px] lg:w-[500px] mx-auto"
        on:click={capturePhoto}
        disabled={loading || $registrationImages.length >= 8}
        >Capture photo</Button
      >
    {:else}
      <!-- <Input
        id="picture"
        type="file"
        accept="image/*"
        on:input={onFileUpload}
      /> -->
      <p class="text-bold">Upload a folder</p>
      <input
        class="cursor-pointer"
        type="file"
        multiple
        id="flder"
        webkitdirectory
        on:input={onFileUpload}
      />
      <p class="text-bold">Upload single images</p>
      <Input
        id="picture"
        type="file"
        accept="image/*"
        class="cursor-pointer"
        on:input={onFileUpload}
      />
      <div class="flex flex-wrap justify-center">
        {#each $registrationImages as image, index}
          <div
            class={cn("border-4 relative flex flex-row")}
            style="margin: 5px;"
          >
            <img
              src={"data:image/jpeg;base64," + image.bboxes[0].Image}
              alt="captured"
              width="100px"
            />
          </div>
          {#if (index + 1) % 4 === 0}
            <!-- Start a new row after every 4 images -->
            <div class="w-full"></div>
          {/if}
        {/each}
      </div>
    {/if}

    <Dialog.Footer>
      <Button
        type="submit"
        on:click={onSubmit}
        disabled={$registrationImages.length === 0 || username === ""}
        >Add Person</Button
      >
    </Dialog.Footer></Dialog.Content
  >
</Dialog.Root>
