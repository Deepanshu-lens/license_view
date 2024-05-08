<script lang="ts">
  import * as Table from "@/components/ui/table";
  import {
    ChevronsUpDown,
    AlertTriangle,
    EditIcon,
    ScanFace,
    Expand,
    Filter,
    Search,
    CalendarDays,
  } from "lucide-svelte";
  import type { PageServerData } from "./$types";
  import type { Event } from "@/types";
  import PocketBase from "pocketbase";
  import { page } from "$app/stores";
  import { events, selectedNode } from "@/lib/stores.js";
  import { onDestroy, onMount } from "svelte";
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  import RegisterDialog from "@/components/dialogs/RegisterDialog.svelte";
  import FrsModal from "@/components/modal/FrsModal.svelte";
  import RegisterEventDialog from "@/components/dialogs/RegisterEventDialog.svelte";
  import FrsMatchModal from "@/components/modal/FrsMatchModal.svelte";
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  let selectedEvent = null;
  let selectedMatchEvent = null;

  function openEventDialog(eventData) {
    if (eventData.title.includes("Face")) {
      console.log("first");
      selectedEvent = eventData;
    } else {
      console.log("first");
      selectedMatchEvent = eventData;
    }
  }

  export let data: PageServerData;
  let batchedEvents: Event[] = [];
  const session = data.session;
  let nodes: Node[] = [];

  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

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

    setTimeout(updateEvents, 1000);
  });

  onDestroy(() => {
    PB.collection("events").unsubscribe("*");
  });
</script>

<section class="h-full w-full flex items-center justify-center">
  <div class="w-full h-full p-6">
    <h1 class="text-xl font-semibold pb-4 pl-4">FRS</h1>

    <Table.Root class="mx-auto w-[98%] flex flex-col pb-10">
      <Table.Header
        class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9]"
      >
        <Table.Row class="bg-transparent flex items-center justify-between p-3">
          <Table.Head class="text-[#727272] w-full h-full">
            <span class="flex items-center gap-1">
              Alert
              <!-- <ChevronsUpDown class="scale-75" /> -->
            </span>
          </Table.Head>
          <Table.Head class="text-[#727272] w-full h-full">
            <span class="flex items-center gap-1"> Image </span>
          </Table.Head>
          <Table.Head class="text-[#727272] w-full h-full">
            <span class="flex items-center gap-1">
              Camera <ChevronsUpDown class="scale-75" />
            </span>
          </Table.Head>
          <Table.Head class="text-[#727272] w-full h-full">
            <span class="flex items-center gap-1">
              Date <ChevronsUpDown class="scale-75" />
            </span></Table.Head
          >
          <Table.Head class="text-[#727272] w-full h-full">
            <span class="flex items-center gap-1">
              Time <ChevronsUpDown class="scale-75" />
            </span></Table.Head
          >
          <Table.Head class="text-[#727272] w-full h-full">
            <span class="flex items-center gap-1">
              Last Seen <ChevronsUpDown class="scale-75" />
            </span></Table.Head
          >
          <Table.Head class="text-[#727272] w-full h-full whitespace-nowrap">
            <span class="flex items-center gap-1 flex-shrink-0">
              Detection Score <ChevronsUpDown class="scale-75" />
            </span></Table.Head
          >
          <Table.Head class="text-[#727272] w-full h-full whitespace-nowrap">
            <span class="flex items-center gap-1">
              Similarity Score <ChevronsUpDown class="scale-75" />
            </span></Table.Head
          >
          <Table.Head class="text-[#727272] w-full h-full">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body class="overflow-y-scroll max-h-[calc(100vh-205px)]">
        {#each $events as event}
          {@const date = new Date(event.created)}
          <Table.Row
            on:click={() => {
              openEventDialog(event);
            }}
            class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-2 rounded-lg  border-2 border-solid border-[#e4e4e4]"
          >
            <Table.Cell class="text-black w-full h-full"
              ><span class="flex items-center gap-2 capitalize">
                {event.title}
              </span>
            </Table.Cell>
            <Table.Cell class="text-[#727272] w-full h-full text-sm ml-2">
              <img
                src={"data:image/jpeg;base64," + event.frameImage}
                alt="alert-img"
                class="aspect-square"
                width="40"
                height="40"
              /></Table.Cell
            >
            <Table.Cell
              class="text-[#727272] w-full h-full text-sm whitespace-nowrap"
              ><span>
                Camera {$selectedNode.camera.filter(
                  (c) => c.id === event.camera,
                )[0] &&
                  $selectedNode.camera.filter((c) => c.id === event.camera)[0]
                    .name}</span
              ></Table.Cell
            >
            <Table.Cell class="text-[#727272] w-full h-full text-sm"
              ><span>
                {date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}</span
              ></Table.Cell
            >
            <Table.Cell class="text-[#727272] w-full h-full text-sm"
              ><span
                >{date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}</span
              ></Table.Cell
            >
            <Table.Cell
              class="text-[#727272] w-full h-full text-sm whitespace-nowrap"
              ><span>
                {timeAgo?.format(new Date(event?.updated))}</span
              ></Table.Cell
            >
            <Table.Cell class="text-[#727272] w-full h-full text-sm"
              ><span class="ml-8">{event.score.toFixed(3)}</span></Table.Cell
            >
            <Table.Cell class="text-[#727272] w-full h-full text-sm"
              ><span class="ml-8">{event.matchScore.toFixed(3)}</span
              ></Table.Cell
            >

            <Table.Cell
              on:click={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              class="text-[#727272] w-full h-full text-sm flex gap-2 items-center whitespace-nowrap"
            >
              <button
                class="px-2 py-1 rounded-xl bg-[#E9EFFE] text-[#4976F4] text-sm font-medium flex items-center gap-1"
                ><EditIcon size={16} />
                Edit</button
              >
              <RegisterEventDialog
                data={event}
                registrationImages={event.frameImage}
              >
                <button
                  class="px-2 py-1 rounded-xl bg-[#FBF4EC] text-[#D28E3D] text-sm font-medium flex items-center gap-1"
                  ><ScanFace size={16} />Add face</button
                >
              </RegisterEventDialog>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div
    class="flex flex-col gap-4 items-center justify-center px-2 h-[calc(100vh-76px)]"
  >
    <span class="group flex flex-col gap-0.5 items-center justify-center">
      <RegisterDialog>
        <button
          class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
          ><ScanFace class="h-[22px] w-[22px]" /></button
        >
      </RegisterDialog>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Register
      </p>
    </span>
    <span
      class="group flex flex-col gap-0.5 items-center justify-center relative"
    >
      <button
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Search class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Search
      </p>
    </span>
    <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><CalendarDays class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Duration
      </p>
    </span>
  </div>
</section>

{#if selectedEvent}
  <FrsModal {selectedEvent} on:close={() => (selectedEvent = null)} />
{/if}
{#if selectedMatchEvent}
  <FrsMatchModal
    {selectedMatchEvent}
    on:close={() => (selectedMatchEvent = null)}
  />
{/if}
