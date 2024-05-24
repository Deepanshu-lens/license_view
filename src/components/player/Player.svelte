<script>
    export let videos = [];
    export let idx

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
    // console.log(videos)
</script>

<div class="video-container h-full w-full p-0">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video
        muted
        id={idx}
        autoplay
            preload="auto"
            controls={videos.controls}
            on:play={handlePlayed}
            on:ended={handleEnded}
        >
                <!-- <source src={`${videos.srcs[0].src.split('static/')[1]}`} type="video/mp4" /> -->
                {#each videos.srcs as src}
                <source src={src.src.split('static')[1]} type={src.type} />
            {/each}
           
        </video>
</div>

<style>
    video {
        object-fit: fill;
        max-width:100% ;
        height: 100%;
    }
</style>
