<script>
  import * as Popover from "@/components/ui/popover/index";
  import Input from "@/components/ui/input/input.svelte";
  import * as Table from "@/components/ui/table/index";
  import { toast } from "svelte-sonner";
  import { ChevronRight, Search, SmilePlusIcon, Trash2 } from "lucide-svelte";
export let data;
export let currSess;
  let searchName = "";
let selectedUsers= [];
function updateSelectedUsers(user, event) {
    const checked = event.target.checked;
    console.log(user.unid, checked)
    if (checked) {
      selectedUsers = [...selectedUsers, user];
    } else {
      selectedUsers = selectedUsers.filter(u => u.unid !== user.unid);
    }
  }

async function deleteUser(unid) {
const res = await fetch('/api/atlas/deleteUser', {
  method: 'POST', headers: {
    'Content-Type': 'application/json'
  }, body: JSON.stringify({unid, token:currSess})
})
if(!res.ok) {
  toast.error('Failed to delete user, please try again!')
} else {
  toast('User deleted successfully!')
}
}

const callDelete = () => {
  console.log(selectedUsers)
  if(selectedUsers.length !== 0) {
    selectedUsers.forEach(user => deleteUser(user.unid));
  } else {
toast.error('No user Selected')
  }
}
</script>

<div class="top-bar py-4 flex justify-between items-center">
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
    </span>
    <span class="relative">
      <Input
        placeholder="Search by Unid"
        class="w-[250px] pl-8"
        on:input={(e) => (searchName = e.target.value)}
      />
      <Search
        size={18}
        class="absolute top-1/2 -translate-y-1/2 left-2"
      />
    </span>
  </span>
  <span class="flex items-center gap-4">
    <button on:click={callDelete} class="flex items-center gap-1 p-2 text-[#344054]">
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
      </Table.Row>
    </Table.Header>
{#if data}    
    <Table.Body
      class="overflow-y-scroll max-h-[calc(100vh-285px)] hide-scrollbar pb-10"
    >
      {#each data as user}
        {@const date = new Date(user.lastModified)}
        <Table.Row
          class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4]"
        >
          <Table.Cell class="text-[#727272] h-full w-[12.5%] text-start">
            <input type="checkbox" on:change="{(event) => updateSelectedUsers(user, event)}" />
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
            {user.LastName}
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full text-sm w-[12.5%] text-start"
          >
            {user.email ? user.email : "N/A"}
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full text-sm w-[12.5%] text-start"
          >
            {user.phoneNumber}
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
    {/if}
  </Table.Root>