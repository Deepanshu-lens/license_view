<script lang="ts">
  import * as DropdownMenu from "@/components/ui/dropdown-menu/index.js";
    import * as HoverCard from "@/components/ui/hover-card";
    import type { Node } from "@/types";
    import { onMount } from 'svelte';
  
    export let node: Node;
    export let handleNodeSelect: (event: Event) => void;
  
    let RecursiveNode;
    onMount(async () => {
      if (node.nodes && node.nodes.length > 0) {
        RecursiveNode = (await import('./RecursiveNode.svelte')).default;
      }
    });
  </script>
  
  <DropdownMenu.Item id={node.id} on:click={() => handleNodeSelect({ target: { value: node.name } })}>
    <HoverCard.Root>
      <HoverCard.Trigger>
        {node.name.includes('_') ? node.name.substring(node.name.lastIndexOf('_') + 1) : (node.name.length > 10 ? node.name.substring(0, 10) + "..." : node.name)}
        {#if node.nodes?.length > 0}
          , subNodes:({node.nodes.length - 1})
        {/if}
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div class="flex flex-col gap-2">
          {#if node.nodes?.length > 0}
            {#each node.nodes as subnode, index}
              {#if index !== 0 && RecursiveNode}
                <svelte:component this={RecursiveNode} {node} {handleNodeSelect} />
              {/if}
            {/each}
          {/if}
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  </DropdownMenu.Item>