<script>
  import { onDestroy, onMount } from "svelte";
  import PocketBase from "pocketbase";
  export let item;
  export let index;
  import * as Table from "@/components/ui/table/index";
  import { Trash, User } from "lucide-svelte";
  import { page } from "$app/stores";

   let downtimeStart = null;
   let downtime = "-";
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);


  onMount( async () => {
    PB.autoCancellation(false);
     PB.collection("camera_ping_status").subscribe("*", async (event) => {
      console.log(event);
      if (event.record.id === item.id) {
        if (event.record.status === false) {
     downtimeStart = Date.now(); // Store start time as a timestamp
   } else if (event.record.status === true && downtimeStart !== null) {
     let now = Date.now();
     downtime = `${(now - downtimeStart) / 1000} seconds`;
     downtimeStart = null; // Reset start time
   }
      }
    });
  });

  onDestroy(() => {
    PB.collection("camera_ping_status").unsubscribe("*");
  });
</script>

<Table.Row
  class="bg-transparent flex items-center justify-between mt-4 rounded-lg  border-2 border-solid border-[#e4e4e4] px-3"
>
  <Table.Cell class="text-black dark:text-slate-50 w-[10%] h-full"
    >#{index + 1}</Table.Cell
  >
  <Table.Cell class="text-[#727272] w-[12%]  h-full text-sm ml-2"
    >{item?.expand?.camera?.name}</Table.Cell
  >
  <Table.Cell class="text-[#727272] w-[12%]  h-full text-sm"
    >severity</Table.Cell
  >
  <Table.Cell class="text-[#727272] w-[12%] h-full text-sm"
    >{downtime}</Table.Cell
  >
  <Table.Cell class="text-[#727272] w-[12%] h-full text-sm"
    >{#if item.status}
      <span
        class="bg-[#EDF2FE] dark:bg-transparent dark:border-[#EDF2FE] text-[#4976F4] px-2 py-1 rounded-md font-medium text-sm"
        >Active</span
      >
    {:else}
      <span
        class="bg-[#F7F7E8] dark:bg-transparent dark:border-[#F7F7e8] text-[#D28E3D] px-2 py-1 rounded-md font-medium text-sm"
        >Inactive</span
      >
    {/if}</Table.Cell
  >
  <Table.Cell class="text-[#727272] w-[12%] h-full text-sm"
    >exiting alert</Table.Cell
  >
  <Table.Cell
    class="text-[#727272] w-[20%] h-full text-sm flex items-center gap-2"
  >
    <button
      class="text-[#4976F4] bg-[#4976F4] flex items-center gap-1 rounded-xl py-1 px-2 text-xs bg-opacity-15 whitespace-nowrap"
      ><User size={16} /> Assign Technician</button
    >
    <button
      class="text-[#D53228CC] bg-[#D53228] flex items-center gap-1 rounded-xl py-1 px-2 text-xs bg-opacity-15 whitespace-nowrap"
    >
      <Trash size={16} /> Delete</button
    >
  </Table.Cell>
</Table.Row>
