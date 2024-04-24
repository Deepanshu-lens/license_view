<script lang="ts">
  import { events } from "@/lib/stores";
  import EventHeading from "../cards/EventHeading.svelte";
  import EventCard from "../cards/EventCard.svelte";
</script>

<section class="grid w-full h-full grid-cols-4 gap-x-8 px-4 py-4">
  <div class="col-span-1 h-full w-full flex flex-col gap-4">
    <EventHeading
      heading={"Anomaly Detection"}
      start={"April 01"}
      end={"April 30"}
      color={"#FF4764"}
    />
    <div
      class="w-full flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-175px)] h-full"
    >
      {#each $events as event}
        <EventCard {event} />
      {/each}
    </div>
  </div>
  <div class="col-span-1 h-full w-full flex flex-col gap-4">
    <EventHeading
      heading={"Object Detection"}
      start={"April 01"}
      end={"April 30"}
      color={"#24DA8E"}
    />
    <div
      class="w-full flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-175px)] h-full"
    >
      {#each $events as event}
        <EventCard {event} />
      {/each}
    </div>
  </div>
  <div class="col-span-1 h-full w-full flex flex-col gap-4">
    <EventHeading
      heading={"Undefined Object"}
      start={"April 01"}
      end={"April 30"}
      color={"#FFD94F"}
    />
    <div
      class="w-full flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-175px)] h-full"
    >
      {#each $events as event}
        <EventCard {event} />
      {/each}
    </div>
  </div>
  <div class="col-span-1 h-full w-full flex flex-col gap-4">
    <EventHeading
      heading={"Others"}
      start={"April 01"}
      end={"April 30"}
      color={"#3EEBFF"}
    />
    <div
      class="w-full flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-175px)] h-full"
    >
      {#each $events as event}
        <EventCard {event} />
      {/each}
    </div>
  </div>
</section>
