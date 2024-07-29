<script lang="ts">
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import * as Table from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { ArrowUpDown } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import {
    addPagination,
    addTableFilter,
    addSelectedRows,
  } from "svelte-headless-table/plugins";
  import { addSortBy } from "svelte-headless-table/plugins";
  import { readable, writable } from "svelte/store";

  export let selectedStudent;
  export let galleryItems;

  // console.log(galleryItems)

  const dispatch = createEventDispatcher();

  type AttendanceLog = {
    studentId: string;
    aadharId: string;
    department: string;
    date: string;
    status: "Late" | "On-time" | "Absent";
    checkIn: string;
    checkOut: string;
    totalHours: string;
    checkInImage: string;
    checkOutImage: string;
  };

  const initialData: AttendanceLog[] = galleryItems.map((item) => ({
    studentId: item.name,
    aadharId: item.aadhar || "-",
    department: item.department || "-",
    date: new Date(item.created).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: "On-time",
    checkIn: "-",
    checkOut: "-",
    totalHours: "-",
    checkInImage: item.savedData[0] || "",
    checkOutImage: item.images[1] || "",
  }));

  // const initialData: AttendanceLog[] = [
  //   {
  //     studentId: "Shreya Juneja",
  //     aadharId: "4400-2344-1001",
  //     department: "IT Department",
  //     date: "01 June 2024",
  //     status: "On-time",
  //     checkIn: "09:00",
  //     checkOut: "02:10",
  //     totalHours: "5h 10m",
  //     checkInImage: '/images/Attendance.png',
  //     checkOutImage: '/images/Attendance.png'
  //   },
  //   {
  //     studentId: "Ritwik Mohan",
  //     aadharId: "4400-2344-1001",
  //     department: "Accounts",
  //     date: "01 June 2024",
  //     status: "On-time",
  //     checkIn: "09:00",
  //     checkOut: "02:00",
  //     totalHours: "3h 30m",
  //      checkInImage: '/images/Attendance.png',
  //     checkOutImage: '/images/Attendance.png'
  //   },
  //   {
  //     studentId: "Kashish Kapur",
  //     aadharId: "4400-2344-1001",
  //     department: "Legal",
  //     date: "01 June 2024",
  //     status: "Late",
  //     checkIn: "10:30",
  //     checkOut: "02:00",
  //     totalHours: "3h 30m",
  //      checkInImage: '/images/Attendance.png',
  //     checkOutImage: '/images/Attendance.png'
  //   },
  //   {
  //     studentId: "Komal Jain",
  //     aadharId: "4400-2344-1001",
  //     department: "Finance",
  //     date: "01 June 2024",
  //     status: "Absent",
  //     checkIn: "-",
  //     checkOut: "-",
  //     totalHours: "3h 30m",
  //      checkInImage: '',
  //     checkOutImage: ''
  //   },
  // ];

  const data = writable(initialData);

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
      accessor: "studentId",
      header: "Student ID",
    }),
    table.column({
      accessor: "aadharId",
      header: "Aadhar ID",
    }),
    table.column({
      accessor: "department",
      header: "Department",
    }),
    table.column({
      accessor: "date",
      header: "Date",
    }),
    table.column({
      accessor: "status",
      header: "Status",
    }),
    table.column({
      accessor: "checkIn",
      header: "Check-in",
    }),
    table.column({
      accessor: "checkOut",
      header: "Check-out",
    }),
    table.column({
      accessor: "totalHours",
      header: "Total hours",
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates,
    rows,
  } = table.createViewModel(columns);

  const { filterValue } = pluginStates.filter;
  const { hasNextPage, hasPreviousPage, pageIndex, pageCount } =
    pluginStates.page;
  const { selectedDataIds } = pluginStates.select;

  function handleRowClick(rowData) {
    dispatch("rowClick", rowData);
  }
</script>

<div class="rounded-md mt-4">
  <Table.Root
    {...$tableAttrs}
    class="border mx-auto w-[100%] flex flex-col pb-10 rounded-md"
  >
    <Table.Header class=" rounded-lg bg-[#f9f9f9]">
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
                  class="text-[#727272] &:has([role=checkbox])]  whitespace-nowrap h-full flex items-center justify-center w-[12.8%]"
                >
                  <Button
                    variant="ghost"
                    on:click={props.sort.toggle}
                    class="hover:bg-transparent  text-[#727272] opacity-60 "
                  >
                    <Render of={cell.render()} />
                    <ArrowUpDown class={"ml-2 h-4 w-4"} />
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
            on:click={() => console.log(row)}
          >
            <!-- on:click={() => {handleRowClick(row); selectedStudent.set(row)}} -->
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell
                  {...attrs}
                  class="whitespace-nowrap w-[12.8%] flex items-center justify-center"
                >
                  {#if cell.id === "checkIn" || cell.id === "checkOut"}
                    <div class="flex items-center space-x-2">
                    {#if cell.value !== "-"}
                    <img
                        src={"data:image/jpeg;base64," + (cell.id === "checkIn"
                          ? row.original.checkInImage
                          : row.original.checkOutImage)}
                          alt="{cell.id} image"
                          class="size-6  object-contain"
                        />
                      {/if}
                      <span>{cell.value}</span>
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
    <span class="p-2 rounded-md aspect-square bg-[#015a62] bg-opacity-20"
      >{$pageIndex + 1 < 10 ? "0" + ($pageIndex + 1) : $pageIndex + 1}</span
    >
    of
    <span class="p-2 rounded-md aspect-square bg-[#015a62] bg-opacity-20"
      >{$pageCount < 10 ? "0" + $pageCount : $pageCount}</span
    > Page.
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
