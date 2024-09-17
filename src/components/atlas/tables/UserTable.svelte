<script lang="ts">
  import * as Popover from "@/components/ui/popover/index";
  import Input from "@/components/ui/input/input.svelte";
  import * as Table from "@/components/ui/table/index";
  import { toast } from "svelte-sonner";
  import {
    ChevronRight,
    Plus,
    Search,
    SmilePlusIcon,
    Trash2,
  } from "lucide-svelte";
  export let data;
  export let currSess = "";
  let searchName = "";
  let selectedUsers : any[] = [];

  function updateSelectedUsers(user, event) {
    const checked = event.target.checked;
    console.log(user.unid, checked);
    if (checked) {
      selectedUsers = [...selectedUsers, user];
    } else {
      selectedUsers = selectedUsers.filter((u) => u.unid !== user.unid);
    }
  }

  async function deleteUser(unid) {
    const res = await fetch("/api/atlas/deleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unid, token: currSess }),
    });
    if (!res.ok) {
      toast.error("Failed to delete user, please try again!");
    } else {
      toast("User deleted successfully!");
    }
  }

  const callDelete = () => {
    console.log(selectedUsers);
    if (selectedUsers.length !== 0) {
      selectedUsers.forEach((user) => deleteUser(user.unid));
    } else {
      toast.error("No user Selected");
    }
  };

    $: filteredData = data ? data.filter(user => 
    user.username.toLowerCase().includes(searchName.toLowerCase())
  ) : [];
</script>

<div class="top-bar py-4 flex justify-between items-center">
  <span class="flex items-center gap-4 py-4">
    <span class="flex flex-col gap-1">
      <span class="flex items-center gap-2">
        <p class="text-[#101828] text-xl font-medium dark:text-white">Users</p>
        <p
          class="text-[#0070FF] bg-[#0070FF]/[.2] text-sm rounded-full px-2 py-.5 font-medium"
        >
          Super Admin
        </p>
      </span>
    </span>
    <span class="relative">
      <Input
        placeholder="Search by username"
        class="w-[250px] pl-8"
        on:input={(e) => (searchName = e.target.value)}
      />
      <Search size={18} class="absolute top-1/2 -translate-y-1/2 left-2" />
    </span>
  </span>
  <span class="flex items-center gap-4">
    <button
      on:click={callDelete}
      class="flex items-center gap-1 p-2 text-[#344054]"
    >
      <Trash2 size={18} /> Delete</button
    >
    <button
      class="flex items-center gap-1 bg-primary p-2 rounded-md text-white"
    >
      <!-- <SmilePlusIcon size={18} /> -->
      <Plus size={16} />

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
        >Username</Table.Head
      >
      <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
        >Email</Table.Head
      >
      <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
        >Phone Number</Table.Head
      >
      <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
        >Role</Table.Head
      >
      <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
        >Version</Table.Head
      >
      <Table.Head class="text-[#727272] text-center pr-0 h-full w-[12.5%]"
        >Last Modified By</Table.Head
      >
      <Table.Head class="text-[#727272] text-center h-full w-[12.5%]"
        >last Modified</Table.Head
      >
    </Table.Row>
  </Table.Header>
  {#if filteredData.length > 0}
    <Table.Body
      class="overflow-y-scroll max-h-[calc(100vh-285px)] hide-scrollbar pb-10"
    >
      {#each filteredData as user}
        {@const date = new Date(user.lastModified)}
        <Table.Row
          class="bg-transparent cursor-pointer flex items-center justify-between gap-4 mt-4 px-3 rounded-lg  border-2 border-solid border-[#e4e4e4]"
        >
          <Table.Cell class="text-[#727272] h-full w-[12.5%] text-start">
            <input
              type="checkbox"
              on:change={(event) => updateSelectedUsers(user, event)}
            />
          </Table.Cell>

          <Table.Cell class="text-black h-full w-[12.5%] text-start"
            ><span class="flex items-center capitalize font-semibold dark:text-primary">
              {user.username === '' ? 'N/A' : user.username}
            </span>
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full text-sm w-[12.5%] text-start"
          >
         <Popover.Root>
              <Popover.Trigger
                class="bg-primary text-white px-2 py-1 rounded-md"
                >Emails</Popover.Trigger
              >
              <Popover.Content class="w-max">
                {#if user.email_ids.length > 0}
                {#each user.email_ids as email,index}
                <p>
                  {index + 1} : <span class="text-primary font-medium">
                    {email.emailAddress}
                  </span>
                </p>
                {/each}
                {:else}
                <p class="text-primary font-medium">No emails found</p>
                {/if}
                </Popover.Content
              >
            </Popover.Root>
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full text-sm w-[12.5%] text-start"
          >

         <Popover.Root>
              <Popover.Trigger
                class="bg-primary text-white px-2 py-1 rounded-md"
                >Numbers</Popover.Trigger
              >
              <Popover.Content class="w-max">
                {#if user.phone_number !== null && user.phone_number.length > 0 }
                {#each user.phone_number as phone,index}
                <p>
                  {index + 1} : <span class="text-primary font-medium">
                    {phone.phoneNumber}
                  </span>
                </p>
                {/each}
                {:else}
                <p class="text-primary font-medium">No phone numbers found</p>
                {/if}
                </Popover.Content
              >
            </Popover.Root>
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full text-sm w-[12.5%] text-start"
          >
{user.role}
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full text-sm w-[12.5%] text-start"
          >
{user.version}
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full flex items-start justify-center text-sm w-[12.5%]w-[12.5%] text-start"
          >
           {user.last_modified_by}
          </Table.Cell>
          <Table.Cell
            class="text-[#727272] h-full text-sm w-[12.5%] text-center"
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
  {:else}
  <p class="text-primary font-medium">No users found</p>
    {/if}
</Table.Root>
