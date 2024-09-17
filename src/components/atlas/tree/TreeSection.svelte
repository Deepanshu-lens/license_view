<script lang="ts">
  import { activePanel } from "@/lib/stores";
  import { Camera, LockKeyhole } from "lucide-svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import CameraDoorRelate from "@/components/dialogs/camera-door-relate.svelte";
  import { onMount } from "svelte";
  import PocketBase from "pocketbase";
  import { selectedNode } from "@/lib/stores";

  export let data;
  export let currSess = "";
  export let serverIp = "";
  export let serverPort = "";
  export let search: string;
  let showChildren = null;
  let selectChild = null;
  let cameraList = [];

  const API_URL = `${$page.url.protocol}://${$page.url.hostname}:5671/unlock/${$activePanel}`;
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  $: filteredDoors = data?.filter((door) =>
    door.name.toLowerCase().includes($search.toLowerCase()),
  );

  async function handleUnlock(doorId) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("unId", doorId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow" as RequestRedirect,
    };

    try {
      await fetch(API_URL, requestOptions);
      toast(`Door with unid:${doorId} unlocked successfully!`);
    } catch (error) {
      console.error("Error unlocking door:", error);
      toast.error("Error unlocking door!");
    }
  }

  onMount(async () => {
    const cameras = await PB.collection("camera").getFullList({
      sort: "-created",
      filter: `node~"${$selectedNode.id}"`,
    });
    cameraList = [...cameras]
  });
</script>

<div class="flex justify-around flex-wrap items-start px-6 gap-4">
  {#if data?.length > 0}
    {#if filteredDoors.length > 0}
      {#each filteredDoors as door, index}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="node flex flex-col justify-center items-center">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- on:click={() => {
          if (showChildren === index) {
              showChildren = null;
        } else {
            showChildren = index;
          }
        }} -->
          <div
            class={`pt-2 pb-8 px-4 rounded-lg flex flex-col gap-1 cursor-pointer drop-shadow-lg relative w-max ${showChildren === index ? "text-slate-100 bg-primary" : "bg-[#f9f9f9] border border-black border-opacity-5 text-primary"}`}
          >
            <span class="flex items-center gap-2">
              <p class="font-bold text-sm">{door.name}</p>
              <!-- <Info size={16} /> -->
            </span>
            <span class="flex items-center gap-2">
              <p class="text-xs font-medium">Version: {door.version}</p>
              <p class="text-xs font-medium">Address {door.address}</p>
            </span>
            <span class="flex items-center gap-2">
              <p class="text-xs font-medium">
                Sites: {door.logicalChildren?.length>0 ? door.logicalChildren.length :"N/A"}
              </p>
              <p class="text-xs font-medium">Unid: {door.unid}</p>
            </span>
            <!-- <p class="text-xs font-medium">Sites: {door.logicalChildren?.length}</p> -->
            <!-- <span
          class={`${showChildren === index ? 'bg-[#f9f9f9]' : 'bg-primary' } p-1 rounded-md absolute left-1/2 -bottom-3 shadow-sm -translate-x-1/2`}
          ><ChevronDown class={showChildren === index ? 'text-primary' : 'text-slate-100'} size={18} /></span
        >   -->
            <button
              class="absolute right-2 bottom-2"
              on:click={() => handleUnlock(door.unid)}
            >
              <LockKeyhole size={18} />
            </button>
            <CameraDoorRelate {cameraList} doorId={door.id} doorName={door.name}>
              <button class="absolute left-2 bottom-2">
                <Camera size={18} />
              </button>
            </CameraDoorRelate>
          </div>
          {#if showChildren === index}
            <span class="w-[1px] h-[75px] bg-primary block mx-auto" />
            {#if door.logicalChildren && door.logicalChildren.length > 0}
              <div class="grid grid-cols-3 drop-shadow-lg gap-4">
                {#each door.logicalChildren as child, idx}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    on:click={() => {
                      if (selectChild === idx) {
                        selectChild = null;
                      } else {
                        selectChild = idx;
                      }
                    }}
                    class={`node border-2 rounded-lg relative flex flex-col col-span-1 p-2 ${selectChild === idx ? " bg-primary text-white" : "text-primary bg-[#f9f9f9] border borde-black border-opacity-5"}`}
                  >
                    <div class="text-sm font-bold">Name: {child.name}</div>
                    <div class="text-xs font-medium">
                      Child ID: {child.unid}
                    </div>
                    <div class="text-xs font-medium">Type: {child.type}</div>
                  </div>
                {/each}
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    {:else}
      <p class="text-primary text-xl font-medium">
        No doors with this name found
      </p>
    {/if}
  {:else}
    <p class="text-primary text-xl font-medium dark:text-white">
      No doors found
    </p>
  {/if}
</div>
