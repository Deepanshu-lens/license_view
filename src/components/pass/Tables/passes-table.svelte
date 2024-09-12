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
    transactionId: "T001",
    qrCode: "QR001",
    date: "March 29, 2024",
    time: "12:00 PM",
    paymentMethod: "UPI",
    amount: "₹400"
  },
  {
    transactionId: "T001",
    qrCode: "QR001",
    date: "March 29, 2024",
    time: "12:00 PM",
    paymentMethod: "UPI",
    amount: "₹1200"
  },
  {
    transactionId: "T001",
    qrCode: "QR001",
    date: "March 29, 2024",
    time: "12:00 PM",
    paymentMethod: "UPI",
    amount: "₹400"
  },
  // Add more entries as needed
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
      accessor: "qrCode",
      header: "QR Code",
    }),
  table.column({
    accessor: "transactionId",
    header: "Transaction ID",
  }),
  table.column({
    accessor: "noOfPasses",
    header: "No. of Passes",
  }),
  table.column({
    accessor: "paymentMethod",
    header: "Payment Method",
  }),
  table.column({
    accessor: "status",
    header: "Status",
  }),
  table.column({
    accessor: "amount",
    header: "Amount",
  }),
  table.column({
    accessor: "name",
    header: "Name",
  }),
  table.column({
    accessor: "phoneNumber",
    header: "Phone Number",
  }),
  table.column({
    accessor: "dateAndTime",
    header: "Date & Time",
  })
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
<Table.Root {...$tableAttrs} class="w-full border-collapse">
  <Table.Header class="bg-[#f9f9f9]">
    {#each $headerRows as headerRow}
      <Table.Row>
        {#each headerRow.cells as cell (cell.id)}
          <Table.Head class="p-2 text-left text-[#727272] font-normal text-nowrap">

              <div class="flex items-center px-3">
                <Render of={cell.render()} />
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </div>

          </Table.Head>
        {/each}
      </Table.Row>
    {/each}
  </Table.Header>
  <Table.Body>
    {#each $pageRows as row (row.id)}
      <Table.Row class="border-b border-gray-200">
        {#each row.cells as cell (cell.id)}
          <Table.Cell class="p-2 px-5 text-nowrap">
            { #if cell.id === 'paymentMethod'}
              <span class="px-3 py-1 rounded-md text-xs bg-[#4976F4]/[.20] text-[#4976F4]">
                {row.original.paymentMethod}
              </span>
            {:else}
              <Render of={cell.render()}/>
            {/if}
          </Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
</div>
<div class="flex flex-row items-center justify-center space-x-4 py-4">
  <Button
    size="sm"
    variant="outline"
    class="bg-transparent hover:bg-transparent text-[#727272] gap-2"
    on:click={() => ($pageIndex = $pageIndex - 1)}
    disabled={!$hasPreviousPage}
  >
    Previous
  </Button>
  <div class="flex flex-row gap-2 items-center text-sm text-muted-foreground">
    <span class="p-2 rounded-md aspect-square bg-[#015a62] bg-opacity-10">
      {$pageIndex + 1 < 10 ? "0" + ($pageIndex + 1) : $pageIndex + 1}
    </span>
    of
    <span class="p-2 rounded-md aspect-square bg-[#015a62] bg-opacity-20">
      {$pageCount < 10 ? "0" + $pageCount : $pageCount}
    </span> Page.
  </div>
  <Button
    size="sm"
    variant="outline"
    disabled={!$hasNextPage}
    class="bg-transparent hover:bg-transparent text-[#727272] gap-2"
    on:click={() => ($pageIndex = $pageIndex + 1)}
  >
    Next
  </Button>
</div>
