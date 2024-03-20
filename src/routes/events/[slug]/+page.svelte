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
    const events = await PB.collection("events").getList(1, 40, {
      sort: "-created",
    });
    // console.log(events)
    return events.items.map(
      (event) =>
        ({
          ...event,
          created: new Date(event.created),
        }) as unknown as Event,
    );
  }

  function updateEvents() {
    events.set([...batchedEvents, ...$events].slice(0, 200));
    batchedEvents = [];
    setTimeout(updateEvents, 10000);
  }

  onMount(async () => {
    nodes = await getNodes();
    selectedNode.set(nodes[0]);
    let x = await getEvents();
    events.set(x);
    // PB.collection("events").subscribe("*", async (e) => {
    // batchedEvents.push({
    // ...e.record,
    // created: new Date(e.record.created),
    // } as unknown as Event);
    // events.set([...batchedEvents, ...$events].slice(0, 200));
    // batchedEvents = []
    // });
    // setTimeout(updateEvents, 1000);
    // });

    // onDestroy(() => {
    // PB.collection("events").unsubscribe("*");
  });
</script>

<EventPanel />

<!-- {"camera":"1qxhwo3099x1oq4","collectionId":"9wqokxmbwt4506y","collectionName":"events","created":"2024-02-07 09:03:00.058Z","description":"Face Recognition","feature":null,"frameId":2401,"frameImage":"/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAHAAcAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOuL4qNpsd6ZI2BVOWUivPPRLbXOO9MN3jvWXJcEVWe6IoA1ZbrPeqck2TVE3JNJ5uaYFovmkB5qAPmpFNAFlDUofFV1NDvigCz5+O9VZrrHeq0kxFZ9xcEZ60AWprvrzVGW696oTXTZ71Ue5PvQI9OlbiqEz9auSg4rPnU80DKcslUpZKsSo1UZY3oAesmakD1VVGFSqCKYFlWqVWqqGxT1egReRqV+agRxU2c0AQuuapTQ5rT2ZqNoc9qAMKS2yelRGzz2rdNrk9KeLT2/SgR0brmqkkWa0CmaYYc0FmPJBntVV7bPat42+e1RtaZ7UAc80GO1QsuK3JrXGeKz5oMGgkzmOKasnNTSQVAITupiLCSVbibOKpJEauwJjFAF2NM1MIM9qIFq4mBQIri1z2qRbT2q6rDHSpA6+goAeEzTxFmnIKnRaDQiFvntTvsue1W0Splj4oAwri1xnisme356V091H1rHuI/moJZhS2/tVbyOelbbw57VAbfnpTJM5YfarEUeKteR7UeXtoAfEMVMDiq+7bUbz470gL+/FHm1lG8wetNN570COtQjNWYyvrWeHwaeJsd6Rqa8ZX1qwhT1rGS496mW696BFi52nNZE6jdVqWfd3qnI2TTQmRmNaaYloZsVG0mKqxI4xr61XmCikefHeqc9x15osAk0gGeazZ58Z5pZ7jrzWVcT9eaLCJJLshutR/az61myz/MeaiNx70WA9ZZTTDkVceOq7rioNSIMR3pwkI70w8VGz4oAlafHeomuQKpTz471ny3mD1q0Sa7XK1BJcCsk3fvTGus96ZJfkn96ozSk55qJp896heTNMCKZyc81mzlj3q85zVWRc0CMqQNuqFg/rWi0XNRmH2oA9eefjrVWSf3qq9xx1qvJP71kalp5/eq73HvVR56ryTmgB9xLnNZspy1TPITVdsk1aJG0YpcU5RVEjdlHl5qdUqVY80AU/Iz2qNrbPatZYM077NmgDCNp7UhtPat37KPSj7IPSgR//9k=","id":"nivxputseyu4r0p","node":"29fkjkzpl36whrn","score":0,"session":"wxzuuu0o0yli97f","severity":"","title":"Face Recognition","type":"","updated":"2024-02-07 09:03:00.058Z","videoUrl":"","expand":{}} -->
