<script lang="ts">
  import AddNode from "@/components/node/AddNode.svelte";
  import type { Node, Camera, Event } from "@/types.d.ts";
  import StreamView from "@/components/stream/StreamView.svelte";
  import PocketBase from "pocketbase";
  import { selectedNode, events } from "@/lib/stores";
  import { onDestroy, onMount } from "svelte";
  import AddNodeMob from "@/components/node/mobile/AddNodeMob.svelte";
  import type { PageServerData } from "./$types";
  import { page } from "$app/stores";

  export let data: PageServerData;
  const { session } = data;
  let nodes: Node[] = [];
  let batchedEvents: Event[] = [];

  $: console.log("data", data);

  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  // console.log("page on session page", $page);

async function getNodes(): Promise<Node[]> {
  if (session?.node.length > 0) {
    const nodes = await PB.collection("node").getFullList(200, {
      sort: "-created",
      filter: `session~"${session.id}"`,
    });

    for (const node of nodes) {
      const cameras = await PB.collection("camera").getFullList({
        filter: `node~"${node.id}"`,
        sort: "-created",
        expand: 'personCounter,inference'
      });
      node.camera = cameras.map((cam: Camera) => ({
        ...cam,
        personCounter: cam?.expand?.personCounter?.count,
        // face: cam?.expand?.inference?.face,
        // vehicle: cam?.expand?.inference?.vehicle,
        // faceDetThresh: cam?.expand?.inference?.faceDetThresh,
        // faceMatchThresh: cam?.expand?.inference?.faceMatchThresh,
        // vehicleDetThresh: cam?.expand?.inference?.vehDetThresh,
        // vehiclePlateThresh: cam?.expand?.inference?.vehPlateThresh,
        // vehicleOCRThresh: cam?.expand?.inference?.vehOCRThresh,
        // running: cam?.expand?.inference?.running,
        // runningThresh: cam?.expand?.inference?.runningThresh,
        // motionThresh: cam?.expand?.inference?.motionThresh,
        // lineCrossing: cam?.expand?.inference?.lineCrossing,
        // linePerson: cam?.expand?.inference?.linePerson,
        // linePersonThresh: cam?.expand?.inference?.linePersonThresh,
        // lineVehicle: cam?.expand?.inference?.lineVehicle,
        // lineVehicleThresh: cam?.expand?.inference?.lineVehicleThresh,
        // lineData: cam?.expand?.inference?.lineData,
        // priority: cam?.expand?.inference?.priority,
      }));
    }
    return nodes.map((node) => ({
      ...node,
      session: session.id,
    }) as Node);
  }
  return [];
}

  // function updateEvents() {
  //   if (batchedEvents.length !== $events.length) {
  //     events.set([...batchedEvents, ...$events].slice(0, 200));
  //     batchedEvents = [];
  //   }
  //   setTimeout(updateEvents, 1000);
  // }

    function updateEvents() {
    events.update(currentEvents => {
      if (batchedEvents.length !== currentEvents.length) {
        const updatedEvents = [...batchedEvents, ...currentEvents].slice(0, 200);
        batchedEvents = [];
        return updatedEvents;
      }
      return currentEvents;
    });
    setTimeout(updateEvents, 1000);
  }

  onMount(async () => {
    events.set([])
    batchedEvents=[]
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

    PB.collection("camera").subscribe("*", async (e) => {
      nodes = await getNodes();
      const selected = nodes.find((n) => n.id === session.activeNode);

      selectedNode.set(selected || nodes[0]);
    });

    PB.collection("node").subscribe("*", async (e) => {
      nodes = await getNodes();
      // console.log("change e nodes", e.record)
      const selected = nodes.find((n) => n.id === session.activeNode);
      selectedNode.set(selected || nodes[0]);
    });

    PB.collection("ai_inference").subscribe("*", async (e) => {
      nodes = await getNodes();
      // console.log("change e nodes", e.record)
      const selected = nodes.find((n) => n.id === session.activeNode);
      selectedNode.set(selected || nodes[0]);
    });

    setTimeout(updateEvents, 1000);
  });

  onDestroy(() => {
    PB.collection("node").unsubscribe("*");
    PB.collection("events").unsubscribe("*");
    PB.collection("camera").unsubscribe("*");
    PB.collection("ai_inference").unsubscribe("*");
  });



</script>

{#if $selectedNode}
  <StreamView {data} url={data.url ?? "/"} features={data?.user?.features} />
{:else}
  <div class="hidden sm:flex">
    <AddNode />
  </div>
  <div class="sm:hidden block">
    <AddNodeMob />
  </div>
{/if}
