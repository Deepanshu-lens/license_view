<script>
  import { Label } from "@/components/ui/label";
  import { ChevronRight, Search, SmilePlusIcon, Trash2 } from "lucide-svelte";
  import Input from "@/components/ui/input/input.svelte";
  import * as Table from "@/components/ui/table/index";
  import * as Popover from "@/components/ui/popover/index";
  import Button from "../ui/button/button.svelte";
  import { writable } from "svelte/store";
  import { SvelteFlow } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import CustomNode from "./tree/CustomNode.svelte";

  export let data;
  let view = 1;
  let showRightPanel = true;
  const nodeTypes = {
    custom: CustomNode,
  };

  let serverIp = "";
  let serverPort = "";

  const initialNodes = [
    {
      id: "1",
      type: "custom",
      data: { name: "Jane Doe", role: "CEO", location: "😎", sites: "" },
      position: { x: 0, y: 50 },
    },
    {
      id: "2",
      type: "custom",
      data: { name: "Jane Doe", role: "CEO", location: "😎", sites: "" },

      position: { x: -200, y: 200 },
    },
    {
      id: "3",
      type: "custom",
      data: { name: "Jane Doe", role: "CEO", location: "😎", sites: "" },
      position: { x: 200, y: 200 },
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
    },
    {
      id: "e1-3",
      source: "1",
      target: "3",
    },
  ];

  const nodes = writable(initialNodes);
  const edges = writable(initialEdges);

  console.log(data);

  function handleSubmit() {
    const payload = { serverIP: serverIp, serverPort };
    fetch("/api/atlas/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }
</script>

<section
  class="h-full w-full flex justify-between relative items-center max-h-[calc(100vh-75px)]"
>
  <div class="w-full h-[calc(100vh-75px)]">
    <div
      class="flex items-center justify-center rounded-lg border-black/[.13] border-solid border-[1px] p-1 w-[500px] h-[40px] mx-auto mt-4"
    >
      <button
        on:click={() => (view = 1)}
        class={`rounded-lg text-xs leading-[18px] px-[10px] py-[3px] font-medium w-1/3 h-full ${view === 1 ? "text-white bg-[#015a62]" : "bg-transparent"}`}
        >Users</button
      >
      <button
        on:click={() => (view = 2)}
        class={`rounded-lg text-xs leading-[18px] px-[10px] py-[3px] font-medium w-1/3 h-full ${view === 2 ? "text-white bg-[#015a62]" : "bg-transparent"}`}
        >Doors</button
      >
      <button
        on:click={() => (view = 3)}
        class={`rounded-lg text-xs leading-[18px] px-[10px] py-[3px] font-medium w-1/3 h-full ${view === 3 ? "text-white bg-[#015a62]" : "bg-transparent"}`}
        >Events</button
      >
    </div>
    {#if view === 1}
      <div class="top-bar p-4 flex justify-between items-center">
        <span class="flex items-center gap-4 py-4">
          <span class="flex flex-col gap-1">
            <span class="flex items-center gap-2">
              <p class="text-[#101828] text-xl font-medium">Users</p>
              <p
                class="text-[#0070FF] bg-[#0070FF]/[.2] text-sm rounded-full px-2 py-.5 font-medium"
              >
                Super Admin
              </p>
            </span>
            <p class="text-[#667085] text-sm">
              Lorem Ipsum doler sit amer text to be added
            </p>
          </span>
          <span class="relative">
            <Input placeholder="Search" class="w-[250px] pl-8" />
            <Search
              size={18}
              class="absolute top-1/2 -translate-y-1/2 left-2"
            />
          </span>
        </span>
        <span class="flex items-center gap-4">
          <button class="flex items-center gap-1 p-2 text-[#344054]">
            <Trash2 size={18} /> Delete</button
          >
          <button
            class="flex items-center gap-1 bg-primary p-2 rounded-md text-white"
          >
            <SmilePlusIcon size={18} />
            Add User
          </button>
        </span>
      </div>
      <div class="px-4">
        <Table.Root class="mx-auto w-full flex flex-col pb-10">
          <Table.Header
            class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9]"
          >
            <Table.Row
              class="bg-transparent flex items-center justify-between p-3 w-full"
            >
              <Table.Head class="text-[#727272] h-full w-[12.5%] text-start"
                ><input type="checkbox" name="" id="" /></Table.Head
              >
              <Table.Head class="text-[#727272] text-start h-full w-[12.5%]"
                >Unid</Table.Head
              >
              <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
                >FirstName</Table.Head
              >
              <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
                >LastName</Table.Head
              >
              <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
                >Email</Table.Head
              >
              <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
                >PhoneNumber</Table.Head
              >
              <Table.Head
                class="text-[#727272] text-center pr-0 h-full w-[12.5%]"
                >Cred</Table.Head
              >
              <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
                >lastModified</Table.Head
              >
              <!-- <Table.Head class="text-[#727272] h-full"
                >Session token</Table.Head
              > -->
            </Table.Row>
          </Table.Header>
          <Table.Body
            class="overflow-y-scroll max-h-[calc(100vh-285px)] hide-scrollbar pb-10"
          >
            {#each data.userData as user}
              {@const date = new Date(user.lastModified)}
              <Table.Row
                class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4]"
              >
                <Table.Cell class="text-[#727272] h-full w-[12.5%] text-start">
                  <input type="checkbox" />
                </Table.Cell>

                <Table.Cell class="text-black h-full w-[12.5%] text-start"
                  ><span class="flex items-center capitalize font-semibold">
                    {user.unid}
                  </span>
                </Table.Cell>
                <Table.Cell
                  class="text-[#727272] h-full text-sm w-[12.5%] text-start"
                >
                  {user.firstName?.split(" ")?.[0]}
                </Table.Cell>
                <Table.Cell
                  class="text-[#727272] h-full text-sm w-[12.5%] text-start"
                >
                  {user.lastName}
                </Table.Cell>
                <Table.Cell
                  class="text-[#727272] h-full text-sm w-[12.5%] text-start"
                >
                  {user.email ? user.email : "N/A"}
                </Table.Cell>
                <Table.Cell
                  class="text-[#727272] h-full text-sm w-[12.5%] text-start"
                >
                  {user.phone}
                </Table.Cell>
                <Table.Cell
                  class="text-[#727272] h-full flex items-start justify-start text-sm w-[12.5%]w-[12.5%] text-start"
                >
                  <!-- <Button>Cred</Button> -->
                  <Popover.Root>
                    <Popover.Trigger
                      class="bg-primary text-white px-2 py-1 rounded-md"
                      >Cred</Popover.Trigger
                    >
                    <Popover.Content class='w-max'>
                      <p>Name : <span class="text-primary font-medium">

                          {user.cred?.[0]?.name}
                      </span>
                    </p>
                    <p>Type : <span class="text-primary font-medium"> {user.cred?.[0]?.type}</span></p>
                    <p>Unid : <span class="text-primary font-medium"> {user.cred?.[0]?.unid}</span></p></Popover.Content
                    >
                  </Popover.Root>
                </Table.Cell>
                <Table.Cell
                  class="text-[#727272] h-full text-sm w-[12.5%] text-start"
                >
                  {date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    {/if}
    {#if view === 2}
      <div class="top-bar p-4 flex justify-between items-center on:cl">
        <span class="flex items-center justify-between gap-4 py-4 w-full">
          <span class="flex flex-col gap-1">
            <span class="flex items-center gap-2">
              <p class="text-[#101828] text-xl font-medium">Doors</p>
              <p
                class="text-[#0070FF] bg-[#0070FF]/[.2] text-sm rounded-full px-2 py-.5 font-medium"
              >
                Super Admin
              </p>
            </span>
            <p class="text-[#667085] text-sm">
              Lorem Ipsum doler sit amer text to be added
            </p>
          </span>
          <span class="relative">
            <Input placeholder="Search" class="w-[250px] pl-8" />
            <Search
              size={18}
              class="absolute top-1/2 -translate-y-1/2 left-2"
            />
          </span>
        </span>
      </div>

      <div class="bg-[red] h-[calc(100vh-250px)]">
        <SvelteFlow
          {nodes}
          {nodeTypes}
          {edges}
          fitView
          class="bg-teal-50"
          minZoom={0.75}
          maxZoom={0.75}
        >
          <!-- <MiniMap /> -->
          <!-- <Controls /> -->
        </SvelteFlow>
      </div>
    {/if}
    {#if view === 3}
      <div class="top-bar p-4 flex justify-between items-center">
        <span class="flex items-center gap-4 py-4">
          <span class="flex flex-col gap-1">
            <span class="flex items-center gap-2">
              <p class="text-[#101828] text-xl font-medium">Events</p>
              <p
                class="text-[#0070FF] bg-[#0070FF]/[.2] text-sm rounded-full px-2 py-.5 font-medium"
              >
                Super Admin
              </p>
            </span>
            <p class="text-[#667085] text-sm">
              Lorem Ipsum doler sit amer text to be added
            </p>
          </span>
          <span class="relative">
            <Input placeholder="Search" class="w-[250px] pl-8" />
            <Search
              size={18}
              class="absolute top-1/2 -translate-y-1/2 left-2"
            />
          </span>
        </span>
        <span class="flex items-center gap-4">
          <button class="flex items-center gap-1 p-2 text-[#344054]">
            <Trash2 size={18} /> Delete</button
          >
          <button
            class="flex items-center gap-1 bg-primary p-2 rounded-md text-white"
          >
            <SmilePlusIcon size={18} />
            Add User
          </button>
        </span>
      </div>
      <div class="px-4">
        <Table.Root class="mx-auto w-full flex flex-col pb-10">
          <Table.Header
            class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9]"
          >
            <Table.Row
              class="bg-transparent flex items-center justify-between p-3"
            >
              <Table.Head class="text-[#727272] h-full"
                ><input type="checkbox" name="" id="" /></Table.Head
              >
              <Table.Head class="text-[#727272] h-full">Unid</Table.Head>
              <Table.Head class="text-[#727272] h-full">evtCode</Table.Head>
              <Table.Head class="text-[#727272] h-full"
                >evtCodeAndSubCode</Table.Head
              >
              <Table.Head class="text-[#727272] h-full"
                >evtControllerRef</Table.Head
              >
              <Table.Head class="text-[#727272] h-full"
                >evtCredHolderRef</Table.Head
              >
              <!-- <Table.Head class="text-[#727272] h-full">evtCredRef</Table.Head> -->
              <Table.Head class="text-[#727272] h-full">evtDevRef</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body
            class="overflow-y-scroll max-h-[calc(100vh-285px)] hide-scrollbar pb-10"
          >
            {#each data.eventData as event}
              <Table.Row
                class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4]"
              >
                <Table.Cell class="text-[#727272] h-full">
                  <input type="checkbox" />
                </Table.Cell>
                <Table.Cell class="text-black h-full"
                  ><span class="flex items-center capitalize font-semibold">
                    {event.unid}
                  </span>
                </Table.Cell>
                <Table.Cell class="text-[#727272] h-full text-sm ">
                  {event.evtCode}
                </Table.Cell>
                <Table.Cell class="text-[#727272] h-full text-sm">
                  {event.evtCodeAndSubCode}
                </Table.Cell>
                <Table.Cell class="text-[#727272] h-full text-sm ">
                  <!-- {event.evtControllerRef} -->

                  <Popover.Root>
                    <Popover.Trigger
                    class="bg-primary text-white px-2 py-1 rounded-md"
                    >evtControllerRef</Popover.Trigger>
                    <Popover.Content class='w-max'>
                        <p>Address : <span class="text-primary font-medium">
  
                            {event.evtControllerRef?.[0]?.address}
                        </span>
                      </p>
                      <p>devMod : <span class="text-primary font-medium"> {event.evtControllerRef?.devMod}</span></p>
                      <p>devPlatform : <span class="text-primary font-medium"> {event.evtControllerRef?.devPlatform}</span></p>
                      <p>devType : <span class="text-primary font-medium"> {event.evtControllerRef?.devType}</span></p>
                      <p>devUse : <span class="text-primary font-medium"> {event.evtControllerRef?.devuse}</span></p>
                      <p>Name : <span class="text-primary font-medium"> {event.evtControllerRef?.name}</span></p>
                      <p>unid : <span class="text-primary font-medium"> {event.evtControllerRef?.unid}</span></p>
                      <p>uuid : <span class="text-primary font-medium"> {event.evtControllerRef?.uuid}</span></p>
                      </Popover.Content
                      >
                  </Popover.Root>
                </Table.Cell>
                <Table.Cell class="text-[#727272] h-full text-sm">
                  <Popover.Root>
                    <Popover.Trigger
                    class="bg-primary text-white px-2 py-1 rounded-md"
                    
                    >evtCredHolderRef</Popover.Trigger>
                    <Popover.Content class='w-max'>
                        <p>First : <span class="text-primary font-medium">
                            {event.evtCredHolderRef?.first}
                        </span>
                      </p>
                      <p>Last : <span class="text-primary font-medium"> {event.evtCredHolderRef?.last}</span></p>
                      <p>Name : <span class="text-primary font-medium"> {event.evtCredHolderRef?.name}</span></p>
                      <p>unid : <span class="text-primary font-medium"> {event.evtCredHolderRef?.unid}</span></p>
                      </Popover.Content
                      >
                  </Popover.Root>
                </Table.Cell>
                <Table.Cell class="text-[#727272] h-full text-sm">
                  <Popover.Root>
                    <Popover.Trigger
                    class="bg-primary text-white px-2 py-1 rounded-md"
                    >evtDevRef</Popover.Trigger>
                    <Popover.Content class='w-max'>
                     
                      <p>Address : <span class="text-primary font-medium">
                        {event.evtDevRef?.address}
                    </span>
                  </p>
                  <p>devPlatform : <span class="text-primary font-medium"> {event.evtDevRef?.devPlatform}</span></p>
                  <p>devType : <span class="text-primary font-medium"> {event.evtDevRef?.devType}</span></p>
                  <p>logicalAddress : <span class="text-primary font-medium"> {event.evtDevRef?.logicalAddress}</span></p>
                  <p>Name : <span class="text-primary font-medium"> {event.evtDevRef?.name}</span></p>
                  <p>unid : <span class="text-primary font-medium"> {event.evtDevRef?.unid}</span></p>
                  </Popover.Content
                  >
                      </Popover.Root>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    {/if}
  </div>
  <button
    on:click={() => (showRightPanel = !showRightPanel)}
    class={`absolute ${showRightPanel ? `right-[20%] xl:right-[18rem]` : "right-0"} py-1 rounded-l-md bg-[#f9f9f9] dark:bg-slate-800 top-1/2 -translate-y-1/2 shadow-md transition-position ease-in-out duration-500 z-[99999]`}
  >
    <ChevronRight
      class={`${showRightPanel ? "rotate-0 " : "rotate-180"} transition-transform ease-in-out duration-700`}
    />
  </button>
  <div
    id="infopanel"
    class={`h-[calc(100vh-75px)] border-solid 
     border-x-[1px] 
     transition-width ease-in-out duration-500 overflow-y-scroll z-[998] flex flex-col gap-6
    ${showRightPanel ? "w-1/4 p-4" : " p-0 w-0"} relative max-w-72`}
  >
    {#if showRightPanel}
      <Label>
        Server Ip
        <Input bind:value={serverIp} />
      </Label>
      <Label>
        Server Port
        <Input bind:value={serverPort} />
      </Label>
      <Button type="button" on:click={handleSubmit}>Submit</Button>
    {/if}
  </div>
</section>
