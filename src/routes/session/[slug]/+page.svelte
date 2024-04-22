<script lang="ts">
  import AddNode from "@/components/node/AddNode.svelte";
  import type { Node, Camera, Event } from "@/types.d.ts";
  import StreamView from "@/components/stream/StreamView.svelte";
  import PocketBase from "pocketbase";
  import { selectedNode, events } from "@/lib/stores";
  import { onDestroy, onMount } from "svelte";
  import AddNodeMob from "@/components/node/mobile/AddNodeMob.svelte";
  import type { PageServerData } from "./$types";
  import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

  export let data: PageServerData;
  const session = data.session;
  let nodes: Node[] = [];
  let batchedEvents: Event[] = [];

  const PB = new PocketBase(PUBLIC_POCKETBASE_URL);
  // const PB = new PocketBase("http://127.0.0.1:5555");

  async function getNodes(): Promise<Node[]> {
    // console.log("session", session.node);
    if (session?.node.length > 0) {
      // console.log("first");
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
    // console.log("getting events");
    // const events = await PB.collection("events").getList(1, 40, {
    //   sort: "-created",
    //   fields:
    //     "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
    // });
    console.log(data.props.events);
    const events = data.props.events;
    return events.map(
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
      console.log("updating events");
      events.set([...batchedEvents, ...$events].slice(0, 200));
      batchedEvents = [];
      setTimeout(updateEvents, 1000);
    }
  }

  // let voices = [];
  // let selectedVoice;

  // function play(text: string) {
  //   speechSynthesis.cancel();
  //   const utterance = new SpeechSynthesisUtterance(text);

  //   utterance.rate = 1;
  //   utterance.pitch = 1;
  //   utterance.voice = selectedVoice;
  //   utterance.volume = 1;
  //   speechSynthesis.speak(utterance);
  // }

  onMount(async () => {
    nodes = await getNodes();
    selectedNode.set(nodes[0]);
    let x = await getEvents();
    console.log(x);
    events.set(x);
    console.log("events session page", x.length);
    // speechSynthesis.onvoiceschanged = () => {
    //   voices = speechSynthesis.getVoices();
    //   console.log(voices);
    //   selectedVoice = voices[0];
    // };
    PB.collection("events").subscribe("*", async (e) => {
      // if (e.record.title === "Pranit") {
      //   const title = e.record.title;
      //   console.log(`event detect with title: ${title}`);
      //   // play(`Event detected with title: ${title}`);
      // }
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
</script>

{#if $selectedNode}
  <StreamView {data} url={data.url ?? "/"} />
{:else}
  <div class="hidden sm:flex">
    <AddNode />
  </div>
  <div class="sm:hidden block">
    <AddNodeMob />
  </div>
{/if}
