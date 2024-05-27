<script>
  export let allUsers;
  export let liveFeatures;
  import * as Table from "@/components/ui/table/index";

</script>

<div class="w-full max-w-[calc(100vw-8.3rem)] max-h-[calc(100vh-310px)] hide-scrollbar overflow-x-auto overflow-y-auto h-full">
  <Table.Root class="mx-auto h-full w-full flex flex-col pb-10">
    <Table.Header
      class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9] w-max"
    >
      <Table.Row class="bg-transparent flex items-center justify-between p-3">
        <Table.Head class="text-[#727272] h-full w-[50px]"
          ><input type="checkbox" name="" id=""></Table.Head
        >
        <Table.Head class="text-[#727272] h-full w-[200px]"
          >User Name</Table.Head
        >
        {#if liveFeatures}
          {#each liveFeatures as feature}
            <Table.Head class="text-[#727272] h-full w-[200px]"
              >{feature.feature}</Table.Head
            >
          {/each}
        {/if}
      </Table.Row>
    </Table.Header>
    <Table.Body
      class="pb-10"
    >
      {#each allUsers as user}
        <Table.Row
          class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4] w-max"
        >
        
          <Table.Cell class="text-black h-full w-[50px]">
            <input type="checkbox" name="" id="">
            </Table.Cell>
          <Table.Cell class="text-black h-full w-[200px]">
            <span class="flex flex-col font-semibold text-primary">
              <span>
                
               Name: {user?.name.length > 0 ? user.name : "-"}
              </span>
              <!-- <span class="text-xs">
                {user?.email}
              </span> -->
              <span class="text-xs">
                Id: {user.id}
              </span>
            </span>
          </Table.Cell>
          {#each liveFeatures as feature}
          <Table.Cell class="text-[#727272] h-full text-sm w-[183.3px]">
            <input type="checkbox" />
          </Table.Cell>
          {/each}
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
