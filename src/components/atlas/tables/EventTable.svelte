<script>
  import * as Popover from "@/components/ui/popover/index";
  import * as Table from "@/components/ui/table/index";
  export let data;
  console.log(data)
</script>

<Table.Root class="mx-auto w-full flex flex-col pb-10">
    <Table.Header
      class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9]"
    >
      <Table.Row
        class="bg-transparent flex items-center justify-between p-3"
      >
        <Table.Head class="text-[#727272] h-full"
          ><input type="checkbox" /></Table.Head
        >
        <Table.Head class="text-[#727272] h-full">Unid</Table.Head>
        <Table.Head class="text-[#727272] h-full">Event Code</Table.Head>
        <Table.Head class="text-[#727272] h-full"
          >Event Code & SubCode</Table.Head
        >
        <Table.Head class="text-[#727272] h-full"
          >Event ControllerRef</Table.Head
        >
        <Table.Head class="text-[#727272] h-full"
          >Event Cred HolderRef</Table.Head
        >
        <!-- <Table.Head class="text-[#727272] h-full">evtCredRef</Table.Head> -->
        <Table.Head class="text-[#727272] h-full">Event DevRef</Table.Head>
      </Table.Row>
    </Table.Header>
    {#if data}
    <Table.Body
      class="overflow-y-scroll max-h-[calc(100vh-285px)] hide-scrollbar pb-10"
    >
      {#each data as event}
      {@const color = event.bgColor }
        <Table.Row
          class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4]"
        style="background-color: rgb({color?.red}, {color?.green}, {color?.blue});"
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
              >Event ControllerRef</Popover.Trigger>
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
              
              >Event CredHolderRef</Popover.Trigger>
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
              >Event DevRef</Popover.Trigger>
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
    {/if}

  </Table.Root>