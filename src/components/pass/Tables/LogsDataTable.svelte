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
      logId: "U001",
      dateTime: "15 March, 2024; 13:40:25 IST",
      qrCode: "QR001",
      actions: "Entry scan successful"
    },
    {
      logId: "U001",
      dateTime: "15 March, 2024; 13:40:25 IST",
      qrCode: "QR001",
      actions: "Payment completed"
    },
    // ... add more entries to match the image ...
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
      accessor: "logId",
      header: "Log ID",
    }),
    table.column({
      accessor: "dateTime",
      header: "Date & Time",
    }),
    table.column({
      accessor: "qrCode",
      header: "QR Code",
    }),
    table.column({
      accessor: "actions",
      header: "Actions",
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
    class="border mx-auto w-[100%] flex flex-col rounded-md"
  >
    <Table.Header class="bg-white">
      {#each $headerRows as headerRow}
        <Table.Row
          class="flex flex-row border-b items-center justify-between"
        >
          {#each headerRow.cells as cell (cell.id)}
            <Table.Head
              class="text-[#727272] whitespace-nowrap h-full flex items-center justify-start flex-1 p-2"
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
          class="flex items-center justify-between border-b border-solid border-[#e4e4e4] p-0"
        >
          {#each row.cells as cell (cell.id)}
            <Table.Cell class="text-sm h-full w-full p-2 text-left flex-1">
              {#if cell.id === "select"}
                <Checkbox {...cell.props().select} />
              {:else if cell.id === "qrCode" && row.original.qrCode === "-"}
                <span class="text-gray-400">-</span>
              {:else if cell.id === "actions"}
                <span class="{
                  row.original.actions.includes('successful') ? 'text-green-600' :
                  row.original.actions.includes('failed') ? 'text-red-600' :
                  row.original.actions.includes('completed') ? 'text-blue-600' :
                  ''
                }">
                  {row.original.actions}
                </span>
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

