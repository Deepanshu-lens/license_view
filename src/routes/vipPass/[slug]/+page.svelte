<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Node, Camera, Event } from "@/types.d.ts";
  import type { PageServerData } from "./$types";
  import { page } from "$app/stores";
  import { selectedNode, events } from "@/lib/stores";
  import PocketBase from "pocketbase";
  import PassView from "@/components/pass/PassView.svelte";
  export let data: PageServerData;
  const { session } = data;
  let batchedEvents: Event[] = [];
  let nodes: Node[] = [];
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  async function getNodes(): Promise<Node[]> {
    console.log('getNodes got called')
    if (session?.node.length > 0) {
        PB.autoCancellation(false)
    const [nodes, allCameras] = await Promise.all([
      PB.collection("node").getFullList(200, {
        sort: "-created",
        filter: `session~"${session.id}"`,
      }),
      PB.collection("camera").getFullList({
        filter: `node.session~"${session.id}"`,
        sort: "-created",
        expand: 'personCounter,inference',
      }),
    ]);

    // Create a map of node IDs to their cameras
    const camerasByNode = allCameras.reduce((acc, cam) => {
      if (!acc[cam.node]) acc[cam.node] = [];
      acc[cam.node].push({
        ...cam,
        personCounter: cam?.expand?.personCounter?.count,
      });
      return acc;
    }, {});

    // Assign cameras to nodes
    return nodes.map((node) => ({
      ...node,
      session: session.id,
      camera: camerasByNode[node.id] || [],
    }));
  }
  return [];
}

  function updateEvents() {
    events.update((currentEvents) => {
      if (batchedEvents.length !== currentEvents.length) {
        const updatedEvents = [...batchedEvents, ...currentEvents].slice(
          0,
          200,
        );
        batchedEvents = [];
        return updatedEvents;
      }
      return currentEvents;
    });
    setTimeout(updateEvents, 1000);
  }

  onMount(async () => {
    events.set([]);
    batchedEvents = [];
    PB.autoCancellation(false);
    nodes = await getNodes();
    // console.log(nodes)
    const s = nodes.find((n) => n.id === session.activeNode);
    selectedNode.set(s || nodes[0]);
    events.set(data.events);

    PB.collection("events").subscribe("*", function (e) {
      console.log("event subscription", e.action, e.record);
      // console.log('detetc event created', e.record)
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

<PassView {data} />
