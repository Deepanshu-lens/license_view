<script lang="ts">
  import AddNode from "@/components/node/AddNode.svelte";
  import type { Node, Camera, Event } from "@/types.d.ts";
  import StreamView from "@/components/stream/StreamView.svelte";
  import PocketBase from "pocketbase";
  import { selectedNode, events } from "@/lib/stores";
  import { getContext, onDestroy, onMount } from "svelte";
  import AddNodeMob from "@/components/node/mobile/AddNodeMob.svelte";
  import type { PageServerData } from "./$types";
  import { page } from "$app/stores";
  import Spinner from "@/components/ui/spinner/Spinner.svelte";
  import { writable } from "svelte/store";
  import { toast } from "svelte-sonner";
  export let data: PageServerData;
  const { session } = data;
  let nodes: Node[] = writable([]);
  let batchedEvents: Event[] = [];
  let searching: boolean = true;

  console.log(data?.featuresArr, "feature arr");

  // const PB = new PocketBase(`http://${$page.url.hostname}:5555`);
  const PB: PocketBase = new PocketBase(`https://pocketbase.lenscorp.cloud`);

  console.log("page on session page", data);

  async function getNodes(): Promise<Node[]> {
    console.log("getNodes got called");
    if (session?.node.length > 0) {
      const [nodes, allCameras] = await Promise.all([
        PB.collection("node").getFullList(200, {
          sort: "-created",
          filter: `session~"${session.id}"`,
        }),
        PB.collection("camera").getFullList({
          filter: `node.session~"${session.id}"`,
          sort: "-created",
          expand: "personCounter,inference",
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
    nodes.set(await getNodes());
    // console.log(nodes)
    const s = $nodes.find((n) => n.id === session.activeNode);
    selectedNode.set(s || $nodes[0]);
    searching = false;
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
      console.log("change e camera", e.record);
      nodes.set(await getNodes());
      const selected = $nodes.find((n) => n.id === session.activeNode);
      if (selected) {
        selectedNode.set(selected);
      } else {
        selectedNode.set($nodes[0]);
      }
    });

    PB.collection("node").subscribe("*", async (e) => {
      console.log("change e nodes", e.record);
      nodes.set(await getNodes());

      if (e.action === "update") {
        const selected = $nodes.find((n) => n.id === session.activeNode);
        if (selected) {
          selectedNode.set(selected);
        } else {
          selectedNode.set($nodes[0]);
        }
      } else {
        selectedNode.set($nodes[0]);
      }
    });

    PB.collection("ai_inference").subscribe("*", async (e) => {
      nodes.set(await getNodes());
      const selected = $nodes.find((n) => n.id === session.activeNode);
      if (selected) {
        selectedNode.set(selected);
      } else {
        selectedNode.set($nodes[0]);
      }
    });

    PB.collection("session").subscribe("*", function (e) {
      console.log("session subscription", e.action, e.record);
      session.activeNode = e.record.activeNode;
    });

    if (!!data?.paymentStatus) {
      toast.success("Payment successfull");
    }

    setTimeout(updateEvents, 1000);
  });

  onDestroy(() => {
    PB.collection("node").unsubscribe("*");
    PB.collection("events").unsubscribe("*");
    PB.collection("camera").unsubscribe("*");
    PB.collection("ai_inference").unsubscribe("*");
    PB.collection("session").unsubscribe("*");
  });
</script>

{#if searching}
  <div class="flex items-center justify-center h-full">
    <Spinner size={40} />
  </div>
{:else if $selectedNode}
  <StreamView
    {data}
    url={data.url ?? "/"}
    features={data?.user?.features}
    calledNodes={$nodes}
  />
{:else}
  <div class="hidden sm:flex">
    <AddNode />
  </div>
  <div class="sm:hidden block">
    <AddNodeMob />
  </div>
{/if}
