<script>
  import { Label } from "@/components/ui/label";
  import { ChevronRight, Search, SmilePlusIcon, Trash2 } from "lucide-svelte";
  import Input from "@/components/ui/input/input.svelte";
  import * as Table from "@/components/ui/table/index";
  import * as Popover from "@/components/ui/popover/index";
  import Button from "../ui/button/button.svelte";
  import TreeSection from "./tree/TreeSection.svelte";
  import UserTable from "./tables/UserTable.svelte";
  import EventTable from "./tables/EventTable.svelte";
  import PocketBase from "pocketbase";
  import Spinner from "../ui/spinner/Spinner.svelte";
  import { page } from "$app/stores";
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  export let data;
  let view = 1;
  let showRightPanel = true;
  let currSess = null;
  let loading = false;

  let serverIp = "";
  let serverPort = "";
  let searchUnid = "";
  let searchName = "";
  let doorList = [];
  let eventList = [];
  let userList = [];

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
      .then(async (data) => {
        console.log(data);
        if (data.message.sessionToken) {
          currSess = data.message.sessionToken;
          loading = true;
          await fetch("/api/atlas/doorList", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: data.message.sessionToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              doorList = data.doorList;
            })
            .catch((err) => console.log(err));
          await fetch("/api/atlas/userList", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: data.message.sessionToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              userList = data.userList;
            })
            .catch((err) => console.log(err));
          await fetch("/api/atlas/eventList", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: data.message.sessionToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              eventList = data.eventList;
              loading = false;
              showRightPanel = false;
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  //   $: filteredEventData = searchUnid
  //     ? data.eventData.filter(event =>{
  // console.log(event)
  //     return    event.unid.includes(searchUnid)
  //     }
  //     )
  //     : data.eventData;

  //     $:console.log(filteredEventData)
  //     $:console.log(searchUnid)
</script>

<section
  class="h-full w-full flex justify-between relative items-center max-h-[calc(100vh-75px)]"
>
  {#if currSess !== null && loading === false}
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
        <div class="px-4">
          <UserTable data={userList} {currSess}/>
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
        
        <div class="h-[calc(100vh-250px)]">
          <TreeSection data={doorList} />
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
            </span>
            <span class="relative">
              <Input
                placeholder="Search by Unid"
                on:input={(e) => (searchUnid = e.target.value)}
                class="w-[250px] pl-8"
              />
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
          <EventTable data={eventList} />
        </div>
      {/if}
    </div>
  {/if}
  {#if currSess === null && loading === false}
    <div class="w-full h-[calc(100vh-75px)] p-4">
      <p>Authenticate</p>
    </div>
  {/if}
  {#if currSess !== null && loading === true}
    <div class="w-full h-[calc(100vh-75px)] grid place-items-center">
      <Spinner />
    </div>
  {/if}
  <button
    on:click={() => (showRightPanel = !showRightPanel)}
    class={`absolute ${showRightPanel ? `right-[20%] xl:right-[18rem]` : "right-0"} py-1 rounded-l-md bg-[#f9f9f9] dark:bg-slate-800 top-1/2 -translate-y-1/2 shadow-md transition-position ease-in-out duration-500`}
  >
    <ChevronRight
      class={`${showRightPanel ? "rotate-0 " : "rotate-180"} transition-transform ease-in-out duration-700`}
    />
  </button>
  <div
    id="infopanel"
    class={`h-[calc(100vh-75px)] border-solid 
     border-x-[1px] 
     transition-width ease-in-out duration-500 overflow-y-scroll flex flex-col gap-6
    ${showRightPanel ? "w-1/4 p-4" : " p-0 w-0"} relative max-w-72`}
  >
    {#if showRightPanel}
      <Label class="flex flex-col gap-2">
        Server IP
        <Input
          id="serverIp"
          name="serverIp"
          placeholder="serverIP"
          bind:value={serverIp}
        />
      </Label>
      <Label class="flex flex-col gap-2">
        Server Port
        <Input
          id="serverPort"
          name="serverPort"
          placeholder="Server Port"
          bind:value={serverPort}
        />
      </Label>
      <Button on:click={handleSubmit} type="button">Submit</Button>
    {/if}
  </div>
</section>
