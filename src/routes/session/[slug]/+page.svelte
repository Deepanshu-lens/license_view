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
  const session = data.session;
  let nodes: Node[] = [];
  let batchedEvents: Event[] = [];

  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  console.log("page on session page", $page);

  async function getNodes(): Promise<Node[]> {
    if (session?.node.length > 0) {
      PB.autoCancellation(false)
      const nodes = await PB.collection("node").getFullList(200, {
        sort: "-created",
        expand: "camera",
        filter: `session~"${session.id}"`,
      });
      console.log("getnodes", nodes);
      return nodes.map(
        (node) =>
          ({
            ...node,
            session: session.id,
            camera:
              node.camera.length > 0
                ? (node.expand.camera.reverse().map((cam: Camera) => ({
                    name: cam.name,
                    id: cam.id,
                    url: cam.url,
                    subUrl: cam.subUrl,
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
                    motionThresh: cam.motionThresh,
                    priority: cam.priority,
                  })) as Camera[])
                : [],
          }) as unknown as Node,
      );
    }
    return [];
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
    let x = data.props.events;
    events.set(x);

    PB.collection("events").subscribe("*", async (e) => {
      batchedEvents.push({
        ...e.record,
        created: new Date(e.record.created),
      } as unknown as Event);
    });

    PB.collection("camera").subscribe("*", async (e) => {
      nodes = await getNodes();
      // selectedNode.set(nodes[0]);
    });

    PB.collection("node").subscribe("*", async (e) => {
      nodes = await getNodes();
      console.log("change e nodes", e.record)
      nodes.forEach((node) => {
        if (e.record.id === node.id) {
          selectedNode.set(node);
        }
      });
    });

    setTimeout(updateEvents, 1000);
  });

  onDestroy(() => {
    PB.collection("node").unsubscribe("*");
    PB.collection("events").unsubscribe("*");
    PB.collection("camera").unsubscribe("*");
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
