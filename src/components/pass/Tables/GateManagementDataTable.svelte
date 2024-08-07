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
    gateName: "East Gate",
    location: "North Wing",
    status: "Open",
    entryCount: 1200,
    exitCount: 1200,
    capturedMedia: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
      "https://example.com/image4.jpg",
      "https://example.com/image5.jpg",
    ],
  },
  {
    gateName: "North Gate",
    location: "West Wing",
    status: "Open",
    entryCount: 900,
    exitCount: 900,
    capturedMedia: [
      "https://example.com/image6.jpg",
      "https://example.com/image7.jpg",
      "https://example.com/image8.jpg",
      "https://example.com/image9.jpg",
      "https://example.com/image10.jpg",
    ],
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
    accessor: "gateName",
    header: "Gate Name",
  }),
  table.column({
    accessor: "location",
    header: "Location",
  }),
  table.column({
    accessor: "status",
    header: "Status",
  }),
  table.column({
    accessor: "entryCount",
    header: "Entry Count",
  }),
  table.column({
    accessor: "exitCount",
    header: "Exit Count",
  }),
  table.column({
    accessor: "capturedMedia",
    header: "Captured Media",
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
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row
            class="bg-transparent flex flex-row border-b items-center justify-between"
          >
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe
                attrs={cell.attrs()}
                let:attrs
                props={cell.props()}
                let:props
              >
                <Table.Head
                  {...attrs}
                  class="text-[#727272] whitespace-nowrap h-full flex items-center justify-center flex-1"
                >
                  <Button
                    variant="ghost"
                    on:click={props.sort.toggle}
                    class="hover:bg-transparent text-[#727272] opacity-60"
                  >
                    <Render of={cell.render()} />
                    <ArrowUpDown class="ml-2 h-4 w-4" />
                  </Button>
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs} class="overflow-x-auto">
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row
            {...rowAttrs}
            data-state={$selectedDataIds[row.id] && "selected"}
            class="bg-transparent flex items-center justify-between border-b border-solid border-[#e4e4e4]"
            on:click={() => handleRowClick(row.original)}
          >
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
               <Table.Cell
  {...attrs}
  class="whitespace-nowrap flex-1 flex items-center justify-center"
>
  {#if cell.id === "status"}
    <span class="px-2 py-1 rounded-md text-xs {row.original.status === 'Open' ? 'bg-[#4976F4]/[.20] text-[#4976F4]' : 'bg-[#AA0000]/[.20] text-[#AA0000]'}">
      {row.original.status}
    </span>
  {:else if cell.id === "capturedMedia"}
    <div class="flex items-center">
      {#each row.original.capturedMedia.slice(0, 4) as media, index}
        <img src={media} alt="Captured media" class="w-8 h-8 object-cover rounded-md -ml-2 first:ml-0" />
      {/each}
      {#if row.original.capturedMedia.length > 4}
        <span class="ml-1 text-xs text-gray-500">+{row.original.capturedMedia.length - 4}</span>
      {/if}
    </div>
  {:else}
    <Render of={cell.render()} />
  {/if}
</Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
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
