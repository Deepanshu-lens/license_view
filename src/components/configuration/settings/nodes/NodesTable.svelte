<script>
  import * as Table from "@/components/ui/table";
export let allUsers;
export let data;
</script>

<Table.Root class="mx-auto w-full flex flex-col">
    <Table.Header
      class="border-2 border-[#e4e4e4] border-solid rounded-lg bg-[#f9f9f9] "
    >
      <Table.Row
        class="bg-transparent flex items-center justify-between p-3"
      >
        <Table.Head class="text-[#727272] h-full ">User/Nodes</Table.Head>
        {#each data.nodes as node}
          <Table.Head class="text-[#727272] h-full">
            {node.name}
          </Table.Head>
        {/each}
      </Table.Row>
    </Table.Header>
    <Table.Body
      class="pb-10"
    >
      {#if allUsers}
        {#each allUsers as user}
          <Table.Row
            class="bg-transparent cursor-pointer flex items-center justify-between mt-4 px-3 rounded-lg border-2 border-solid border-[#e4e4e4]"
          >
            <Table.Cell class="text-black h-full">
              <span
                class="flex flex-col font-semibold"
              >
                <span>
                  {user?.name.length > 0 ? user.name : "-"}
                </span>
                <span class="text-xs">
                  {user.email}
                </span>
              </span>
            </Table.Cell>
            {#each data.nodes as node}
              <Table.Cell class="text-[#727272] h-full text-sm">
                <input type="checkbox" />
              </Table.Cell>
            {/each}
          </Table.Row>
        {/each}
      {/if}
    </Table.Body>
  </Table.Root>