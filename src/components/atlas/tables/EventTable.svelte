<script lang="ts">
  import * as Table from "@/components/ui/table/index";
  import { atlasEvents } from "@/lib/stores";
  import { onDestroy, onMount } from "svelte";
  import PocketBase from "pocketbase";
  import { getContext } from "svelte";

  const PB: PocketBase = getContext("pb");

  export let search: string;
  export let activePanel: string;

  onMount(() => {
    PB.collection("atlas_events").subscribe("*", (event) => {
      if (event.record.pannels === activePanel) {
        //don't update till we get cameras
        atlasEvents.update((events) => [event.record, ...events]);
      }
    });
  });

  onDestroy(() => {
    PB.collection("atlas_events").unsubscribe("*");
  });

</script>

<Table.Root class="mx-auto w-full flex flex-col pb-10">
  <Table.Header
    class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9]"
  >
    <Table.Row class="bg-transparent flex items-center justify-between p-3">
      <Table.Head class="text-[#727272] h-full text-sm text-medium w-full dark:text-black"
        ><input type="checkbox" /></Table.Head
      >
      <Table.Head class="text-[#727272] h-full text-sm text-medium w-full dark:text-black"
        >Event Category</Table.Head
      >
      <Table.Head class="text-[#727272] h-full text-sm text-medium w-full dark:text-black"
        >Description</Table.Head
      >
      <Table.Head class="text-[#727272] h-full text-sm text-medium w-full dark:text-black"
        >Device Name</Table.Head
      >
      <Table.Head class="text-[#727272] h-full text-sm text-medium w-full dark:text-black"
        >User</Table.Head
      >
      <Table.Head class="text-[#727272] h-full text-sm text-medium w-full dark:text-black"
        >Priority</Table.Head
      >
    </Table.Row>
  </Table.Header>
  {#if $atlasEvents.length !== 0}
    <Table.Body
      class="overflow-y-scroll max-h-[calc(100vh-285px)] hide-scrollbar pb-10"
    >
      {#each $atlasEvents as event}
        {@const color = event.bgColor}
        <Table.Row
          class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4]"
          style="background-color: rgb({color?.red}, {color?.green}, {color?.blue});"
        >
          <Table.Cell class="text-[#727272] h-full w-full">
            <input type="checkbox" />
          </Table.Cell>
          <Table.Cell class="text-black h-full w-full"
            ><span class="flex items-center capitalize font-semibold dark:text-primary">
              {event?.event_category}
            </span>
          </Table.Cell>
          <Table.Cell class="text-[#727272] h-full w-full text-sm ">
            {event?.description ? event?.description : "N/A"}
          </Table.Cell>
          <Table.Cell class="text-[#727272] h-full w-full text-sm">
            {event.deviceName}
          </Table.Cell>
          <Table.Cell class="text-[#727272] h-full w-full text-sm ">
            {event?.expand?.user?.username
              ? event?.expand.user.username
              : "N/A"}
          </Table.Cell>
          <Table.Cell class="text-[#727272] h-full w-full text-sm">
            {event?.priority}
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  {/if}
</Table.Root>
