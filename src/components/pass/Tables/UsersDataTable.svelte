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
      userId: "U001",
      name: "Shreya Kapoor",
      role: "Admin",
      emailId: "shreya.kapoor@gmail.com",
      phoneNumber: "+91 9810668793",
      status: "Active",
      lastLogin: "15 March, 2024; 13:40:25 IST"
    },
    {
      userId: "U001",
      name: "Shuchi Sirpal",
      role: "Guest",
      emailId: "shuchi.sirpal@gmail.com",
      phoneNumber: "+91 9810668793",
      status: "Active",
      lastLogin: "15 March, 2024; 13:40:25 IST"
    },
    {
      userId: "U001",
      name: "Chhavi Rathore",
      role: "Super Admin",
      emailId: "chhavi.rathore@gmail.com",
      phoneNumber: "+91 9810668793",
      status: "Active",
      lastLogin: "15 March, 2024; 13:40:25 IST"
    },
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
      accessor: "userId",
      header: "User ID",
    }),
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "role",
      header: "Role",
    }),
    table.column({
      accessor: "emailId",
      header: "Email Id",
    }),
    table.column({
      accessor: "phoneNumber",
      header: "Phone Number",
    }),
    table.column({
      accessor: "status",
      header: "Status",
    }),
    table.column({
      accessor: "lastLogin",
      header: "Last Login",
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
          class="bg-transparent flex items-center justify-between border-b border-solid border-[#e4e4e4] p-0"
        >
          {#each row.cells as cell (cell.id)}
            <Table.Cell class="text-sm h-full w-full p-0 py-2 text-left flex-1">
              {#if cell.id === "role"}
                <span class="px-2 py-1 rounded-full text-xs {
                  row.original.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                  row.original.role === 'Guest' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }">
                  {row.original.role}
                </span>
              {:else if cell.id === "status"}
                <span class="text-green-600">{row.original.status}</span>
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

