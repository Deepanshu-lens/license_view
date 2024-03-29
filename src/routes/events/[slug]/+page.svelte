<script lang="ts">
  import { selectedNode, events } from "@/lib/stores.js";
  import type { PageServerData } from "./$types";
  import type { Camera, Node, Event } from "@/types";
  import PocketBase from "pocketbase";
  import { onDestroy, onMount } from "svelte";
  import EventPanel from "@/components/events/EventPanel.svelte";

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
    setTimeout(updateEvents, 1000);
  });

  onDestroy(() => {
    PB.collection("events").unsubscribe("*");
  });
</script>

<EventPanel />
