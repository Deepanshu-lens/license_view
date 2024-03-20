<script lang="ts">
  import { leftPaneHide, playbackVideos } from "@/lib/stores";
  import { VideoOff } from "lucide-svelte";

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  console.log($playbackVideos);

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
</script>

{#if !$leftPaneHide}
  {#if $playbackVideos.length === 0}
    <div
      class="w-full flex justify-center items-center h-[calc(100vh-75px-57px)]"
    >
      <div class="flex flex-col gap-4 mx-auto items-center">
        <VideoOff size={64} /> <span class="text-lg w-full">No Recordings</span>
      </div>
    </div>
  {:else}
    <div class="flex flex-col items-start justify-center mt-4">
      <span
        class="text-base flex flex-col items-center justify-center gap-2 font-medium rounded-lg px-2 py-4 w-full cursor-pointer max-w-[300px]"
      >
        {#each uniqueDates as date}
          <span
            class={selectedDate !== date
              ? "text-[#333] dark:text-white font-medium rounded-lg px-4 py-4 w-full cursor-pointer text-sm flex items-center gap-1 hover:bg-[rgba(1,90,98,0.1)] dark:hover:bg-[rgba(1,90,98,0.2)]"
              : "text-[#333] dark:text-white font-medium rounded-lg px-4 py-4 w-full cursor-pointer text-sm flex items-center gap-1 bg-[rgba(1,90,98,0.1)] dark:bg-[rgba(1,90,98,0.4)]"}
          >
            Recordings on{" "}
            <span class="font-bold text-primary text-sm">
              {new Date(date).toLocaleDateString("en-US", dateOptions)}
            </span>
          </span>
        {/each}
      </span>
    </div>
  {/if}
{/if}
