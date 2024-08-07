<script lang="ts">
	import { Checkbox } from '@/components/ui/checkbox';
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import * as Table from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { ArrowUpDown, Edit, StoreIcon, Trash2 } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import {
    addPagination,
    addTableFilter,
    addSelectedRows,
    addSortBy,
  } from "svelte-headless-table/plugins";
  import { readable, writable } from "svelte/store";
    import { toast } from 'svelte-sonner';

  const dispatch = createEventDispatcher();

  // Static data
  const staticData = [
    {
      qrCode: "QR001",
      entryGate: "East Gate",
      entryTime: "March 29, 2024; 12:00 PM",
      entryFaceDetection: "https://example.com/face1.jpg",
      exitGate: "East Gate",
      exitTime: "-",
      exitFaceDetection: "-",
      lastSeenLocation: "Central Corridor",
      status: "In Premise"
    },
    {
      qrCode: "QR001",
      entryGate: "North Gate",
      entryTime: "March 29, 2024; 12:00 PM",
      entryFaceDetection: "https://example.com/face2.jpg",
      exitGate: "North Gate",
      exitTime: "-",
      exitFaceDetection: "-",
      lastSeenLocation: "Central Corridor",
      status: "In Premise"
    },
    // ... add more entries as needed
  ];


  const data = writable(staticData);

  const readableData = readable([], (set) => {
    const unsubscribe = data.subscribe(set);
    return unsubscribe;
  });

  const table = createTable(readableData, {
    page: addPagination({ initialPageSize: 5 }),
    sort: addSortBy(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
    select: addSelectedRows(),
  });

const columns = table.createColumns([
     table.column({
    id: 'select',
    header: ({ pluginStates }) => pluginStates.select.getToggleAllHandler(),
    cell: ({ row }) => row.getToggleSelectedHandler(),
    accessor: 'select'
  }),
    table.column({
      accessor: "qrCode",
      header: "QR Code",
    }),
    table.column({
      accessor: "entryGate",
      header: "Entry Gate",
    }),
    table.column({
      accessor: "entryTime",
      header: "Entry Time",
    }),
    table.column({
      accessor: "entryFaceDetection",
      header: "Entry Face Detection",
    }),
    table.column({
      accessor: "exitGate",
      header: "Exit Gate",
    }),
    table.column({
      accessor: "exitTime",
      header: "Exit Time",
    }),
    table.column({
      accessor: "exitFaceDetection",
      header: "Exit Face Detection",
    }),
    table.column({
      accessor: "lastSeenLocation",
      header: "Last Seen Location",
    }),
    table.column({
      accessor: "status",
      header: "Status",
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex, pageCount } =
    pluginStates.page;
  const { selectedDataIds } = pluginStates.select;

  function handleRowClick(rowData) {
    toast.error('asdasd')
    dispatch("rowClick", rowData);
  }
</script>

<div class="rounded-md mt-0">
  <Table.Root
    {...$tableAttrs}
    class="border-b border-x mx-auto w-[100%] flex flex-col pb-10 rounded-md"
  >
    <Table.Header class="rounded-lg bg-[#f9f9f9]">
      {#each $headerRows as headerRow}
   <Table.Row
            class="bg-transparent flex flex-row border-b items-center justify-between"
          >
          {#each headerRow.cells as cell (cell.id)}
            <Table.Head
                  class="text-[#727272] whitespace-nowrap h-full flex items-center justify-center flex-1 p-2 max-w-[10%]"
             >
                {#if cell.id === 'select'}
              <Checkbox {...cell.props().select} />
            {:else}
              <div class="flex items-center">
                <Render of={cell.render()} />
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </div>
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each $pageRows as row (row.id)}
        <Table.Row 
            class="bg-transparent flex items-center justify-between border-b border-solid border-[#e4e4e4] p-0"
        >
          {#each row.cells as cell (cell.id)}
            <Table.Cell class="text-sm h-full w-full p-0 py-2 text-center flex-shrink-0 max-w-[10%]">
              {#if cell.id === "entryFaceDetection" || cell.id === "exitFaceDetection"}
                {#if row.original[cell.id] !== "-"}
                  <img src={row.original[cell.id]} alt="Face Detection" class="w-8 h-8 object-cover rounded-full" />
                {:else}
                  -
                {/if}
              {:else if cell.id === "status"}
                <span class="px-2 py-1 rounded-full text-xs {row.original.status === 'In Premise' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}">
                  {row.original.status}
                </span>
              {:else if cell.id === "select"}
                <Checkbox {...cell.props().select} />
              {:else}
                <Render of={cell.render()} />
              {/if}
            </Table.Cell>
          {/each}
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>

