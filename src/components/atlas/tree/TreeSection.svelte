<script>
import { ChevronDown, Info,LockKeyhole } from "lucide-svelte";
    import { toast } from "svelte-sonner";
  export let data;
  export let currSess;
  let showChildren = null;
  let selectChild = null

  async function handleUnlock(doorId) {
    console.log(doorId)
    try {
      const response = await fetch(`/api/atlas/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ unid:doorId, token:currSess })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Door unlocked successfully:', data);
        toast(`Door with unid:${doorId} unlocked successfully!`)
      } else {
        throw new Error(data.message || 'Failed to unlock the door');
      }
    } catch (error) {
      console.error('Error unlocking door:', error);
      toast.error('error unlocking door!')
    }
  }
</script>

<div class="flex justify-between items-start px-6 gap-4">
  {#each data as door, index}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="node flex flex-col justify-center items-center">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          if (showChildren === index) {
              showChildren = null;
        } else {
            showChildren = index;
          }
        }}
        class={`pt-2 pb-5 px-4 rounded-lg flex flex-col gap-1 cursor-pointer drop-shadow-lg relative w-max ${showChildren === index ? 'text-slate-100 bg-primary' : 'bg-[#f9f9f9] border border-black border-opacity-5 text-primary'}`}
      >
        <span class="flex items-center gap-2">
          <p class="font-bold text-sm">{door.name}</p>
          <Info size={16} />
        </span>
        <span class="flex items-center gap-2">
          <p class="text-xs font-medium">Version: {door.version}</p>
          <p class="text-xs font-medium">Address {door.address}</p>
        </span>
        <span class="flex items-center gap-2">
          <p class="text-xs font-medium">Sites: {door.logicalChildren?.length}</p>
          <p class="text-xs font-medium">Unid: {door.unid}</p>
        </span>
        <!-- <p class="text-xs font-medium">Sites: {door.logicalChildren?.length}</p> -->
        <span
          class={`${showChildren === index ? 'bg-[#f9f9f9]' : 'bg-primary' } p-1 rounded-md absolute left-1/2 -bottom-3 shadow-sm -translate-x-1/2`}
          ><ChevronDown class={showChildren === index ? 'text-primary' : 'text-slate-100'} size={18} /></span
        >  <button class="absolute right-2 bottom-2" on:click={() => handleUnlock(door.unid)}>
          <LockKeyhole size={18}/>
        </button>
      </div>
      {#if showChildren === index}
        <span class="w-[1px] h-[75px] bg-primary block mx-auto" />
        {#if door.logicalChildren && door.logicalChildren.length > 0}
          <div class="grid grid-rows-2 grid-cols-3 drop-shadow-lg gap-4">
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
               class={`node border-2 rounded-lg relative flex flex-col col-span-1 p-2 ${selectChild === idx ? ' bg-primary text-white' : 'text-primary bg-[#f9f9f9] border borde-black border-opacity-5'}`}>
                <div class="text-sm font-bold">Name: {child.name}</div>
                <div class='text-xs font-medium'>Child ID: {child.unid}</div>
                <div class='text-xs font-medium'>Type: {child.type}</div>
              
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  {/each}
</div>
