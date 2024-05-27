<script>
  import { onMount } from "svelte";
  import Hls from "hls.js";
  export let videos = [];
  export let idx;
  import { toast } from "svelte-sonner";

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
        // debug: true,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        // backBufferLength: 90
      });

      // Get m3u8 (create if doesn't exist)
      await fetch("/api/playbackVideo/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: videos.srcs[0],
        }),
      })
        .catch((err) => {
          console.error("Error ", err);
        })
        .then(async (data) => {
          const body = await data.json();
          if (!data.ok) {
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
                    console.log(
                      "Fatal media error encountered. Try to recover.",
                    );
                    hls.recoverMediaError();
                    break;
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.log(
                      "Fatal network error encountered. Try to recover.",
                    );
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
        });

      //   hls.loadSource("/PlayBack/test/output.m3u8");
      //   //   hls.loadSource("/PlayBack/test/output0.ts");
      //   hls.attachMedia(video);
      //   hls.on(Hls.Events.MANIFEST_PARSED, function () {
      //     video.play();
      //   });
      //   hls.on(Hls.Events.ERROR, (ev, data) => {
      //     console.error(ev, data);
      //     if (data.fatal) {
      //       switch (data.type) {
      //         case Hls.ErrorTypes.MEDIA_ERROR:
      //           console.log("Fatal media error encountered. Try to recover.");
      //           hls.recoverMediaError();
      //           break;
      //         case Hls.ErrorTypes.NETWORK_ERROR:
      //           console.log("Fatal network error encountered. Try to recover.");
      //           hls.startLoad();
      //           break;
      //         default:
      //           console.log("An unrecoverable error occurred.");
      //           hls.destroy();
      //           break;
      //       }
      //     }
      //   });
      //   console.log("can play hls");
    }
  });

  console.log("Videos: ", videos);
</script>

<div class="video-container h-full w-full p-0 bg-red-500">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video muted id={idx} bind:this={video} controls={videos.controls}>
    <!-- <source src={`${videos.srcs[0].src.split('static/')[1]}`} type="video/mp4" /> -->
    <!-- {#each videos.srcs as src}
      <source src={src.src.split("static")[1]} type={src.type} />
    {/each} -->
  </video>
</div>

<style>
  video {
    object-fit: fill;
    max-width: 100%;
    height: 100%;
  }
</style>
