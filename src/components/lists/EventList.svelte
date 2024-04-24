<script lang="ts">
  import { events } from "@/lib/stores";
  import EventsPaneAlertCard from "../cards/EventsPaneAlertCard.svelte";

  $: data = $events;
  $: formattedEvents = data?.map((item) => ({
    ...item,
    formattedDate: item.created.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    formattedTime: item.created.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));
</script>

<div class="flex flex-col parent bg-background w-full h-full">
  {#if formattedEvents.length > 0}
    <div
      class="flex flex-col items-start justify-start gap-2 overflow-y-scroll px-2 max-h-[calc(100vh-131px)]"
    >
      {#each formattedEvents as data}
        <EventsPaneAlertCard {data} />
      {/each}
    </div>
  {:else}
    <div
      class="text-black py-4 px-4 text-sm flex flex-row items-center dark:text-white"
    >
      No Event records found.
    </div>
  {/if}
</div>
