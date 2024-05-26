<script>
	import RecursiveNode from './RecursiveNode.svelte';
  import { ChevronRight } from "lucide-svelte";
  import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-svelte";

  export let node;
  export let handleNodeSelect;

  const hasChildren = node?.nodes?.[0]?.nodes !== undefined;
</script>

<DropdownItem
  class="flex items-center justify-between z-40"
  on:click={() => {
    if (!hasChildren) {
      handleNodeSelect({ target: { value: node.name } });
    }
  }}
>
  {node.name.includes("_")
    ? node.name.substring(node.name.lastIndexOf("_") + 1)
    : node.name.length > 10
      ? node.name.substring(0, 10) + "..."
      : node.name}
  {#if hasChildren}
    <ChevronRight class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
  {/if}
</DropdownItem>
{#if hasChildren}
  <Dropdown placement="left-start" class="z-40">
    {#each node.nodes as subnode}
      <RecursiveNode node={subnode} {handleNodeSelect} />
    {/each}
  </Dropdown>
{/if}