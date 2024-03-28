<script lang="ts">
  export let video: string;
  // onMount(() => {
  //   let videoElement = document.createElement("video") as HTMLMediaElement;
  //   videoElement.width = "512";
  //   videoElement.height = "512";
  //   videoElement.controls = true;
  //   videoElement.id = `playback-${video.id}`;
  //   let parentDiv = document.getElementById(`container-${video.id}`);
  //   if (parentDiv) {
  //     parentDiv.appendChild(videoElement);
  //     console.log(videoElement);
  //     console.log(video.url);
  //     if (mpegts.getFeatureList().mseLivePlayback) {
  //       var player = mpegts.createPlayer({
  //         type: "mpegts", // could also be mpegts, m2ts, flv
  //         isLive: true,
  //         url: `${video.url.replace("../static", "")}`,
  //       });
  //       player.attachMediaElement(videoElement);
  //       player.load();
  //       player.play();
  //     }

  //     // if (Hls.isSupported()) {
  //     //   var hls = new Hls();
  //     //   hls.loadSource(`${video.url.replace("../static", "")}`);
  //     //   hls.attachMedia(videoElement);
  //     //   hls.on(Hls.Events.MANIFEST_PARSED, function () {
  //     //     videoElement.play();
  //     //   });
  //     // }
  //   }
  // });
</script>

<div
  class="flex flex-col gap-5 w-[320px] playback-card-shadow p-4 dark:bg-[#242424] items-center justify-center rounded-lg"
>
  {#if typeof video === "string"}
    <div
      class="relative flex w-full items-center justify-center"
      id={`container-${video}`}
    >
      <!-- <video width="100%" height="100%" controls id={`playback-${video.id}`}>
      <source src={`${video.url.replace("../static", "")}`} />
      Your browser does not support the video tag.
    </video> -->
      <video
        id="my-video"
        class="video-js"
        controls
        preload="auto"
        width="640"
        height="264"
      >
        <source src={`/PlayBack/${video}`} type="video/webm" />
      </video>
    </div>
    <div class="flex flex-col items-center justify-center w-full px-1 gap-2">
      <span class="text-sm text-[#828282]">
        {" "}
        Recording from camera:{" "}
        <span class="text-[#fb9a2e] font-semibold"
          >{video.split("_").slice(0, 4).join("_")}</span
        >
      </span>
      <span class="text-xs text-[#828282]">
        Date: {video.split("_").slice(4, 7).join("_")}, Time: {video
          .split("_")
          .slice(7, 10)
          .join("_")
          .split(".webm")[0]}
      </span>
    </div>
  {:else}
    <div
      class="relative flex w-full items-center justify-center"
      id={`container-${video[0].id}`}
    >
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        id="my-video"
        class="video-js"
        controls
        preload="auto"
        width="640"
        height="264"
      >
        <source src={`/PlayBack/${video[0].webmFile}`} type="video/webm" />
      </video>
    </div>
    <div class="flex flex-col items-center justify-center w-full px-1 gap-2">
      <span class="text-sm text-[#828282]">
        {" "}
        Recording from camera:{" "}
        <span class="text-[#fb9a2e] font-semibold">{video[0].id}</span>
      </span>
      <span class="text-xs text-[#828282]">
        Date: {video[0].startTime}, Time: {video[0].startTime}
      </span>
    </div>
  {/if}
</div>

<!-- {"camera":"udw0iqjyn0nv5ti","collectionId":"54r3sw9pwb1oicf","collectionName":"playback","created":"2024-03-15 12:48:16.369Z","endTime":"","id":"85o1h5zb059s959","startTime":"2024-03-15T12:48:16.000Z","updated":"2024-03-16 16:34:22.035Z","url":"./PlayBack/10_20_30_11_2024_03_15_13_40_25.ts","expand":{},"webmFile":"10_20_30_11_2024_03_15_13_40_25.webm"} -->
