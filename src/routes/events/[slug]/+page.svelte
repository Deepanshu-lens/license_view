<script lang="ts">
  import { selectedNode, events } from "@/lib/stores.js";
  import type { PageServerData } from "./$types";
  import type { Camera, Node, Event } from "@/types";
  import PocketBase from "pocketbase";
  import { onDestroy, onMount } from "svelte";
  import EventPanel from "@/components/events/EventPanel.svelte";
  import EventsView from "@/components/events/mobile/EventsView.svelte";
  import { ChevronLeft } from "lucide-svelte";

  export let data: PageServerData;
  const session = data.session;
  let nodes: Node[] = [];
  let batchedEvents: Event[] = [];

  const PB = new PocketBase("http://127.0.0.1:5555");

  async function getNodes(): Promise<Node[]> {
    if (session.node.length > 0) {
      const nodes = await PB.collection("node").getFullList(200, {
        sort: "-created",
        expand: "camera",
        filter: `session~"${session.id}"`,
      });
      return nodes.map(
        (node) =>
          ({
            ...node,
            camera:
              node.camera.length > 0
                ? (node.expand.camera.reverse().map((cam: Camera) => ({
                    name: cam.name,
                    id: cam.id,
                    url: cam.url,
                  })) as Camera[])
                : [],
          }) as unknown as Node,
      );
    }
    return [];
  }

  async function getEvents(): Promise<Event[]> {
    const events = await PB.collection("events").getList(1, 250, {
      sort: "-created",
    });
    return events.items.map(
      (event) =>
        ({
          ...event,
          created: new Date(event.created),
        }) as unknown as Event,
    );
  }

  function updateEvents() {
    if (batchedEvents.length !== $events.length) {
      events.set([...batchedEvents, ...$events].slice(0, 200));
      batchedEvents = [];
      setTimeout(updateEvents, 1000);
    }
  }

  onMount(async () => {
    nodes = await getNodes();
    selectedNode.set(nodes[0]);
    let x = await getEvents();
    events.set(x);

    PB.collection("events").subscribe("*", async (e) => {
      batchedEvents.push({
        ...e.record,
        created: new Date(e.record.created),
      } as unknown as Event);
    });
    PB.collection("camera").subscribe("*", async (e) => {
      console.log("CHANGE ", e.action, " ", e.record);
      nodes = await getNodes();
    });

    PB.collection("node").subscribe("*", async (e) => {
      console.log("CHANGE ", e.action, " ", e.record);
      nodes = await getNodes();
    });
    setTimeout(updateEvents, 1000);
  });

  onDestroy(() => {
    PB.collection("node").unsubscribe("*");
    PB.collection("events").unsubscribe("*");
    PB.collection("camera").unsubscribe("*");
  });
</script>

<main class="hidden sm:block">
  <EventPanel {data} />
</main>
<main class="block sm:hidden">
  <div class="flex flex-col w-full bg-[#f5f6f7] z-10 relative">
    <div class="top-config w-full">
      <button
        class="flex items-center justify-start text-black/[.7] pt-4"
        on:click={() => {
          window.location.href = `/session/${$selectedNode.session}`;
        }}
      >
        <ChevronLeft class="h-[30px] w-[30px]" />
        <p class="text-lg font-semibold">Events</p>
      </button>
    </div>
    <EventsView {data} />
  </div>
</main>
