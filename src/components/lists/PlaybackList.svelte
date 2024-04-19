<script lang="ts">
  import { convertedVideos, playbackVideos } from "@/lib/stores";
  import { VideoOff } from "lucide-svelte";
  import { addUserLog } from "@/lib/addUserLog";

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let uniqueDates: string[];
  let selectedDate: string;
  $: uniqueDates = [
    ...new Set(
      $playbackVideos &&
        $playbackVideos?.map(
          (item) => item.startTime.toISOString().split("T")[0],
        ),
    ),
  ];

  $: uniqueConvertedVideos = $convertedVideos.reduce((acc, video) => {
    const slice = video.split("_").slice(4, 7).join("_");
    if (!acc.find((v) => v.slice === slice)) {
      acc.push({ video, slice });
    }
    return acc;
  }, []);
</script>

{#if $playbackVideos.length === 0 && $convertedVideos.length === 0}
  <div
    class="w-full flex justify-center items-center h-[calc(100vh-75px-57px)]"
  >
    <div class="flex flex-col gap-4 mx-auto items-center">
      <VideoOff size={64} /> <span class="text-lg w-full">No Recordings</span>
    </div>
  </div>
{:else}
  <div class="flex flex-col items-start justify-center mt-4">
    {#if $convertedVideos.length > 0}
      <span class="px-6">Files that got converted</span>
      <span
        class="text-base flex flex-col items-center justify-center gap-2 font-medium rounded-lg px-2 py-4 w-full cursor-pointer max-w-[300px]"
      >
        <!-- {#each $convertedVideos as video, index}
            <span
              class="text-[#333] dark:text-white font-medium rounded-lg px-4 py-4 w-full cursor-pointer text-sm flex items-center gap-1 hover:bg-[rgba(1,90,98,0.1)] dark:hover:bg-[rgba(1,90,98,0.2)]"
            >
              recordings on date
              <span class="font-bold text-primary text-sm">
                {video.split("_").slice(4, 7).join("_")}
              </span>
            </span>
          {/each} -->
        {#each uniqueConvertedVideos as { video, slice }}
          <span
            class="text-[#333] dark:text-white font-medium rounded-lg px-4 py-4 w-full cursor-pointer text-sm flex items-center gap-1 hover:bg-[rgba(1,90,98,0.1)] dark:hover:bg-[rgba(1,90,98,0.2)]"
          >
            recordings on date
            <span class="font-bold text-primary text-sm">
              {slice}
            </span>
          </span>
        {/each}
      </span>
    {:else}
      <span class="px-6">Files that got converted</span>
      <span class="text-sm text-black/[.7] px-6 py-4">No items found</span>
    {/if}
  </div>
  <div class="flex flex-col items-start justify-center mt-4">
    {#if $playbackVideos.length > 0}
      <span>Files that match db</span>
      <span
        class="text-base flex flex-col items-center justify-center gap-2 font-medium rounded-lg px-2 py-4 w-full cursor-pointer max-w-[300px]"
      >
        {#each uniqueDates as date}
          <button
            on:click={() =>
              addUserLog(
                `user clicked on playback list item ${new Date(date).toLocaleDateString("en-US", dateOptions)}`,
              )}
            class={selectedDate !== date
              ? "text-[#333] dark:text-white font-medium rounded-lg px-4 py-4 w-full cursor-pointer text-sm flex items-center gap-1 hover:bg-[rgba(1,90,98,0.1)] dark:hover:bg-[rgba(1,90,98,0.2)]"
              : "text-[#333] dark:text-white font-medium rounded-lg px-4 py-4 w-full cursor-pointer text-sm flex items-center gap-1 bg-[rgba(1,90,98,0.1)] dark:bg-[rgba(1,90,98,0.4)]"}
          >
            Recordings on{" "}
            <span class="font-bold text-primary text-sm">
              {new Date(date).toLocaleDateString("en-US", dateOptions)}
            </span>
          </button>
        {/each}
      </span>
    {:else}
      <span class="px-6">Files that match db</span>
      <span class="text-sm text-black/[.7] px-6 py-4">No items found</span>
    {/if}
  </div>
{/if}
