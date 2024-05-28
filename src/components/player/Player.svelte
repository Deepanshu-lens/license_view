<script>
  import { onMount } from "svelte";
  import Hls from "hls.js";
  export let videos = [];
  export let idx;
  let loading = false;
  import { toast } from "svelte-sonner";
  import { Spinner } from 'flowbite-svelte';

  function handlePlayed(e) {
    if (typeof e.target.currentSrc !== "undefined") {
      console.log("video play", { video: e.target.currentSrc });
    }
  }

  function handleEnded(e) {
    if (typeof e !== "undefined") {
      console.log("video end", { video: e.target.currentSrc });
    }
  }
  let video;
  onMount(async () => {
    console.log("testing hls");
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferSize: 600,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      try {
        const response = await fetch("/api/playbackVideo/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoUrl: videos.srcs[0],
          }),
        });

        const body = await response.json();
        if (!response.ok) {
          if (body.error === "Path does not exist") {
            console.error("Error ", body);
            toast("Video Not Found");
          }
        } else {
          hls.loadSource(body.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
           
          });
          hls.on(Hls.Events.ERROR, (ev, data) => {
            console.error(ev, data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("Fatal media error encountered. Try to recover.");
                  hls.recoverMediaError();
                  break;
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log("Fatal network error encountered. Try to recover.");
                  hls.startLoad();
                  break;
                default:
                  console.log("An unrecoverable error occurred.");
                  hls.destroy();
                  break;
              }
            }
          });
        }
      } catch (err) {
        console.error("Error ", err);
      } finally {
        loading = false;
      }
    }
  });

  console.log("Videos: ", videos);
</script>

<div class={`video-container h-full w-full p-0  ${
  loading ? 'grid place-items-center' : ''
}`}>
  <!-- svelte-ignore a11y-media-has-caption -->
 <video muted id={idx} bind:this={video} controls={videos.controls}>
  </video>

</div>

<style>
  video {
    object-fit: fill;
    max-width: 100%;
    height: 100%;
  }
</style>