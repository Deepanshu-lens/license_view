<script lang="ts">
  import AddNode from "@/components/node/AddNode.svelte";
  import type { SelectedNode, Node, Camera, User, Event } from "@/types.d.ts";
  import StreamView from "@/components/stream/StreamView.svelte";
  import PocketBase from "pocketbase";
  import { leftPaneHide, selectedNode, events } from "@/lib/stores";
  import { onDestroy, onMount } from "svelte";

  export let data;
  const session = data.session;
  let nodes: Node[] = [];
  let batchedEvents: Event[] = [];

  const PB = new PocketBase("http://127.0.0.1:5555");

  async function getNodes(): Promise<Node[]> {
    // console.log("session", session.node);
    if (session?.node.length > 0) {
      // console.log("first");
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
                    save: cam.save,
                    face: cam.face,
                    vehicle: cam.vehicle,
                    faceDetThresh: cam.faceDetThresh,
                    faceMatchThresh: cam.faceMatchThresh,
                    vehicleDetThresh: cam.vehicleDetThresh,
                    vehiclePlateThresh: cam.vehiclePlateThresh,
                    vehicleOCRThresho: cam.vehicleOCRThresh,
                    saveFolder: cam.saveFolder,
                    saveDuration: cam.saveDuration,
                  })) as Camera[])
                : [],
          }) as unknown as Node,
      );
    }
    return [];
  }

  async function getEvents(): Promise<Event[]> {
    const events = await PB.collection("events").getList(1, 40, {
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

  PB.collection("camera").subscribe("*", async (e) => {
    console.log("CHANGE ", e.action, " ", e.record);
    nodes = await getNodes();
    selectedNode.set(nodes[0]);
  });

  PB.collection("node").subscribe("*", async (e) => {
    console.log("CHANGE ", e.action, " ", e.record);
    nodes = await getNodes();
    selectedNode.set(nodes[0]);
  });

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
    PB.collection("node").unsubscribe("*");
    PB.collection("events").unsubscribe("*");
    PB.collection("camera").unsubscribe("*");
  });

  $: leftPaneHide.set(!$selectedNode ? true : false);
</script>

{#if $selectedNode}
  <StreamView />
{:else}
  <div class="hidden sm:flex">
    <AddNode />
  </div>
{/if}
