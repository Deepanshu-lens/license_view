<script>
    import * as Table from "@/components/ui/table/index";
    export let allFeatures

import { onMount } from "svelte";

// onMount(async () => {
//   try {

//     const response = await fetch("https://atlas.zktecousa.xyz:8086/authenticate?username=admin&password=ZKTeco123!&apiClientType=2",{
//       method: 'GET',
//       headers: {
//         // 'sessionToken' : '1021804814',
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       }
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log("Fetched data:", data);
//     // You can now use the fetched data as needed
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// });


</script>


<div class="w-full h-full flex flex-col">
<Table.Root class="mx-auto w-full flex flex-col pb-10">
    <Table.Header
      class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9]"
    >
      <Table.Row
        class="bg-transparent flex items-center justify-between p-3"
      >
        <Table.Head class="text-[#727272] h-full">User role</Table.Head>
        <Table.Head class="text-[#727272] h-full">Feature 1</Table.Head>
        <Table.Head class="text-[#727272] h-full">Feature 2</Table.Head>
        <Table.Head class="text-[#727272] h-full">Feature 3</Table.Head>
        <Table.Head class="text-[#727272] h-full">Feature 4</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body
      class="overflow-y-scroll max-h-[calc(100vh-285px)] hide-scrollbar pb-10"
    >
      <Table.Row
        class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4]"
      >
        <Table.Cell class="text-black h-full"
          ><span
            class="flex items-center gap-2 capitalize font-semibold"
          >
            user 1
          </span>
        </Table.Cell>
        <Table.Cell class="text-[#727272] h-full text-sm ">
          <input type="checkbox" />
        </Table.Cell>
        <Table.Cell class="text-[#727272] h-full text-sm">
          <input type="checkbox" />
        </Table.Cell>
        <Table.Cell class="text-[#727272] h-full text-sm ">
          <input type="checkbox" />
        </Table.Cell>
        <Table.Cell class="text-[#727272] h-full  ">
          <input type="checkbox" />
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</div>
