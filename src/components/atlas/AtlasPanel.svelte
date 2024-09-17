<script lang="ts">
  // imports
  
	import AtlasPanelAddDialog from '@/components/dialogs/AtlasPanelAddDialog.svelte';
  import { Label } from "@/components/ui/label";
  import { ChevronRight, Plus, Search, Trash2 } from "lucide-svelte";
  import Input from "@/components/ui/input/input.svelte";
  import Button from "../ui/button/button.svelte";
  import TreeSection from "./tree/TreeSection.svelte";
  import UserTable from "./tables/UserTable.svelte";
  import EventTable from "./tables/EventTable.svelte";
  import PocketBase from "pocketbase";
  import Spinner from "../ui/spinner/Spinner.svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import AtlasPanelCards from "@/components/cards/AtlasPanelCards.svelte";
  import { activePanel, atlasEvents } from "@/lib/stores";
  import { Switch } from "../ui/switch";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { selectedNode } from "@/lib/stores";

  // props
  export let data;
  const { session } = data;

  //stores
  let searchDoor = writable("");
  let searchEvent = writable("");
  let panelData = writable({
    panels: {
      atlas: [],
    },
  });
  let nodes: Node[] = [];

  // states
  let view = 1;
  let showRightPanel = true;
  let currSess = $page.url.pathname.split("atlas/")[1];
  let loading = false;
  let serverIp = "";
  let serverPort = "";
  let username = "";
  let password = "";
  let searchUnid = "";
  let doorList = [];
  let eventList = [];
  let userList = [];
  let name = "";
  let ssl = false;
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  async function handleSubmit(addPanelData = null) {
    try {
      loading = true;

      // Use form data if addPanelData is not provided
      const panelDataToSubmit = addPanelData || {
        name,
        username,
        password,
        ip_addr: serverIp,
        httpPort: serverPort,
        ssl,
        session: $page.url.pathname.split("atlas/")[1],
      };

      const panel = await PB.collection("atlas").create(panelDataToSubmit);

      showRightPanel = false;
      toast.success("Panel added successfully");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const atlas = await PB.collection("atlas").getFullList({
        filter: `session~"${$page.url.pathname.split("atlas/")[1]}"`,
        expand: "doors,users",
      });

      PB.autoCancellation(false);
      const atlasWithEvents = await Promise.all(
        atlas.map(async (item) => {
          const filteredEvents = await PB.collection(
            "atlas_events",
          ).getFullList({
            sort: "-created",
            filter: `pannels="${item.id}"`,
          });
          return { ...item, events: filteredEvents };
        }),
      );

      // Update your data store or state with atlasWithEvents here
      panelData.update((pd) => {
        pd.panels.atlas = atlasWithEvents;
        return pd;
      });

      activePanel.set(panel.id);
    } catch (error) {
      console.error("Error adding panel:", error);
      toast.error("Failed to add panel");
    } finally {
      loading = false;
    }
  }

  function handleDelete(panelId: string) {
    panelData.update((pd) => {
      pd.panels.atlas = pd.panels.atlas.filter((panel) => panel.id !== panelId);
      return pd;
    });
  }
 
  onMount(async () => {
    panelData.set(data);
  })

  $: {
    if ($activePanel) {
      const activePanelData = $panelData.panels.atlas.find(
        (panel) => panel.id === $activePanel,
      );
      if (activePanelData) {
        doorList = activePanelData.expand.doors;
        userList = activePanelData.expand.users;
        atlasEvents.set(activePanelData.events);
      }
    }
  }
</script>

<section
  class="h-full w-full flex justify-between relative items-center max-h-[calc(100vh-75px)]"
>
  {#if loading}
    <div class="w-full h-[calc(100vh-75px)] grid place-items-center">
      <Spinner />
    </div>
  {:else if $panelData.panels.atlas.length > 0 && $activePanel}
    <div class="w-full h-[calc(100vh-75px)] relative">
      <div
        class="flex items-center justify-center rounded-lg border-black/[.13] border-solid border-[1px] p-1 w-[500px] h-[40px] mx-auto mt-4"
      >
        <button
          on:click={() => (view = 1)}
          class={`rounded-lg text-xs leading-[18px] px-[10px] py-[3px] font-medium w-1/3 h-full  ${view === 1 ? "text-white bg-[#015a62]" : "bg-transparent"}`}
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
          <UserTable data={userList} />
        </div>
      {/if}
      {#if view === 2}
        <div class="top-bar p-4 flex justify-between items-center on:cl">
          <span class="flex items-center justify-between gap-4 py-4 w-full">
            <span class="flex flex-col gap-1">
              <span class="flex items-center gap-2">
                <p class="text-[#101828] text-xl font-medium dark:text-white">
                  Doors
                </p>
                <p
                  class="text-[#0070FF] bg-[#0070FF]/[.2] text-sm rounded-full px-2 py-.5 font-medium"
                >
                  Super Admin
                </p>
              </span>
            </span>
            <span class="relative">
              <Input
                placeholder="Search"
                class="w-[250px] pl-8"
                on:input={(e) => searchDoor.set(e.target.value)}
              />
              <Search
                size={18}
                class="absolute top-1/2 -translate-y-1/2 left-2"
              />
            </span>
          </span>
        </div>

        <div class="h-[calc(100vh-250px)]">
          <TreeSection data={doorList} search={searchDoor} />
        </div>
      {/if}
      {#if view === 3}
        <div class="top-bar p-4 flex justify-between items-center">
          <span class="flex items-center gap-4 py-4">
            <span class="flex flex-col gap-1">
              <span class="flex items-center gap-2">
                <p class="text-[#101828] text-xl font-medium dark:text-white">
                  Events
                </p>
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
                on:input={(e) => searchEvent.set(e.target.value)}
              />
            </span>
          </span>
          <span class="flex items-center gap-4">
            <button class="flex items-center gap-1 p-2 text-[#344054]">
              <Trash2 size={18} /> Delete</button
            >
            <button
              disabled
              class="flex items-center gap-1 bg-primary p-2 rounded-md text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <!-- <SmilePlusIcon size={18} /> -->
              <Plus size={16} />
              Add User
            </button>
          </span>
        </div>
        <div class="px-4">
          <EventTable search={searchEvent} activePanel={$activePanel} />
        </div>
      {/if}
    </div>
  {:else if $panelData.panels.atlas.length > 0 && !$activePanel}
    <div
      class="w-full h-[calc(100vh-75px)] flex flex-col justify-center items-center p-4 bg-gray-100 dark:bg-black"
    >
      <div class="text-center">
        <h1 class="text-2xl font-bold text-primary mb-4">
          Welcome to Atlas Panel
        </h1>
        <p class="text-lg text-gray-60 mb-8 dark:text-slate-200">
          Please select a panel to access the system features.
        </p>
      </div>
    </div>
  {:else}
    <div
      class="w-full h-[calc(100vh-75px)] flex flex-col justify-center items-center p-4 bg-gray-100 dark:bg-black"
    >
      <div class="text-center">
        <h1 class="text-2xl font-bold text-primary mb-4">
          Welcome to Atlas Panel
        </h1>
        <p class="text-lg text-gray-600 mb-8 dark:text-slate-200">
          Please add a panel to access the features.
        </p>
      </div>
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
      {#if $panelData.panels.atlas.length === 0}
        <p class="text-center text-xl font-bold text-primary">Connect Panel</p>
        <Label class="flex flex-col gap-2">
          Name
          <Input
            id="name"
            name="name"
            placeholder="Panel name"
            bind:value={name}
            autocapitalize="off"
            autocomplete="off"
          />
        </Label>
        <Label class="flex flex-col gap-2">
          Username
          <Input
            id="username"
            name="username"
            placeholder="Username"
            bind:value={username}
            autocapitalize="off"
            autocomplete="off"
          />
        </Label>
        <Label class="flex flex-col gap-2">
          Password
          <Input
            id="password"
            name="password"
            placeholder="password"
            type="password"
            bind:value={password}
            autocapitalize="off"
            autocomplete="off"
          />
        </Label>
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
        <Label class="flex flex-row items-center gap-4">
          SSL
          <Switch bind:checked={ssl} />
        </Label>
        <Button
          type="button"
          on:click={() => handleSubmit()}
          disabled={!serverIp || !serverPort || !username || !password}
          class="disabled:cursor-not-allowed flex items-center gap-2 text-white"
        >
          <Plus class="size-4" />
          Add
        </Button>
      {:else}
        <div class="flex flex-col h-[calc(100vh-75px)]">
          <p class="text-center text-xl font-bold mb-4 text-primary">
            Atlas Panels
          </p>
          <div
            class="flex flex-col gap-4 h-full pb-10 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            {#each $panelData.panels.atlas as panel}
              <AtlasPanelCards panelData={panel} {handleDelete} />
            {/each}
          </div>
          <AtlasPanelAddDialog {data} {handleSubmit}>
            <Button class="mt-auto flex items-center gap-1 w-full">
              <Plus size={16} />
              Add Panel
            </Button>
          </AtlasPanelAddDialog>
        </div>
      {/if}
    {/if}
  </div>
</section>
