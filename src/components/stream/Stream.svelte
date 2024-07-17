<script lang="ts">
  import type { Camera, SelectedNode } from "@/types";
  import { VideoStream } from "@/lib/video-stream";
  import { activeCamera, hoveredCamera, fullscreen } from "@/lib/stores";
  import { cn } from "@/lib";
  import { toast } from "svelte-sonner";
  export let camera: Camera;
  export let videoElement: HTMLElement;
  import { createEventDispatcher } from "svelte";
    import { AlertCircle } from "lucide-svelte";
    import { page } from "$app/stores";
  const dispatch = createEventDispatcher();
  // console.log($page)
  let parentDiv: HTMLDivElement;

  let videoStarted = false;
  let startErrorWatching= false
  let er = null

  const attachVideo = (videoElement) => {
     const existingVideo = parentDiv.querySelector("video");
    if (existingVideo) {
      console.log("Video already attached.");
      return;
    }
    parentDiv.appendChild(videoElement);
    const realVideo = videoElement.querySelector("video");
    if (!realVideo) {
      console.error("could not find real video");
    } else {
      setTimeout(() => {
        startErrorWatching = true
      }, 100);
      realVideo.controls = false;
      realVideo.muted = true
      realVideo.style.maxWidth = "100%";
      realVideo.style.objectFit = "fill";
      $page.url.pathname.includes('fullscreen') ? realVideo.className = "video-element" : realVideo.className = "rounded-lg video-element";
      realVideo.background = true;
      realVideo.visibilityCheck = false;
      realVideo.addEventListener("play", () => {
        videoStarted = true;
      });
      realVideo.addEventListener("pause", () => {
        videoStarted = false;
      });
    }
  };

  $: document && parentDiv && videoElement && attachVideo(videoElement);

   $: if (startErrorWatching && videoElement?.divError) {
    console.log('first')
    console.log("Error message:", videoElement.divError);
    er = videoElement?.divError
    if (videoElement?.divError?.includes("codecs not matched: H265")) {
      toast.error(`H265 codec error detected for: ${camera.name}`);
      dispatch("h265Error", { cameraId: camera.id });
    } else {
      // toast.error(`Error in ${camera?.name}: ${videoElement?.divError}`);
      console.log(`Error in ${camera?.name}: ${videoElement?.divError}`)
       const intervalId = setInterval(() => {
      if (videoElement?.divError) {
        console.log('first')
        dispatch('refErr', { cameraId: camera.id });
      } else {
        clearInterval(intervalId);
      }
    }, 20000);
    }
  }



  //  if (videoElement && videoElement.divError && videoElement.divError.includes("codecs not matched: H265")) {
  //   console.log('first');
  //   toast.error(`H265 codec error detected for: ${camera.name}`);
  //   dispatch("h265Error", { cameraId: camera.id });
  // }
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- 
<script lang="ts">
  import type { Camera } from "@/types";
  import { activeCamera, hoveredCamera, fullscreen } from "@/lib/stores";
  import { cn } from "@/lib";
  import { toast } from "svelte-sonner";
  import { createEventDispatcher } from "svelte";

  export let camera: Camera;
  export let videoElement: HTMLElement;
  const dispatch = createEventDispatcher();
  let parentDiv: HTMLDivElement;
  let videoStarted = false;

  const attachVideo = (videoElement) => {
    parentDiv.appendChild(videoElement);
    const realVideo = videoElement.querySelector("video");
    if (!realVideo) {
      console.error("could not find real video");
    } else {
      realVideo.controls = false;
      realVideo.style.maxWidth = "100%";
      realVideo.style.objectFit = "fill";
      realVideo.className = "rounded-lg video-element";
      realVideo.background = true;
      realVideo.visibilityCheck = false;
      realVideo.addEventListener("play", () => videoStarted = true);
      realVideo.addEventListener("pause", () => videoStarted = false);
    }
  };

  function checkForErrors(videoElement) {
    console.log('runnin')
    if (videoElement?.divError) {
      console.log("Error message:", videoElement.divError);
      if (videoElement.divError.includes("codecs not matched: H265")) {
        toast.error(`H265 codec error detected for: ${camera.name}`);
        dispatch("h265Error", { cameraId: camera.id });
      }
    }
  }

  $: if (document && parentDiv && videoElement) {
    attachVideo(videoElement);
    checkForErrors(videoElement);
  }
</script> -->


<!-- svelte-ignore a11y-click-events-have-key-events -->
 <!-- startErrorWatching && er ? 'from-pink-200 via-red-400 to-rose-600' : -->
<div
  class={cn(
    `mx-auto w-full h-full relative 
     rounded-lg  flex items-center justify-center`,
    // !videoStarted &&
     "min-w-full  h-full flex-shrink-0 bg-gradient-to-r from-slate-300 via-slate-500 to-slate-700",
    !$fullscreen && !$page.url.pathname.includes('fullscreen') &&
    // End of  Selection
      ($activeCamera === camera.id
        ? `animate-gradient-border border-4`
        : $hoveredCamera === camera.id
          ? `w-full h-full relative border-primary rounded-lg border-4 border-solid`
          : `hover:border-primary hover:border-4`),
  )}
  id={camera.id}
  bind:this={parentDiv}
  on:click={() => {
    // console.log("CLICKED");
    activeCamera.update((previous) =>
      previous === camera.id ? "" : camera.id,
    );
  }}
>
<!-- {#if startErrorWatching && er}
<span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm flex-col text-center justify-center items-center w-[80%] "><span class="gap-2 flex flex-col items-center justify-center ">
<img src='/images/456.png' class='w-12 h-12' alt="error"/>
    Camera:
   {camera.name} <br/>
</span>
error: {er}
</span>
{/if} -->
</div>

<style>
  .video-element {
    position: relative; /* Ensure position is not 'static' */
    z-index: 10; /* Increase z-index to ensure it's above the span */
  }

  .span-animation {
    position: relative; /* Ensure position is not 'static' */
    z-index: 1; /* Ensure this is lower than the video's z-index */
  }

  .new-animate {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      z-index: 1;
    }
    50% {
      opacity: 0.75;
      z-index: 1;
    }
  }
</style>
