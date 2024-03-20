<script lang="ts">
  import { toast } from "svelte-sonner";
  import { selectedNode } from "@/lib/stores";
  import * as Dialog from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib";
  export let toggleDisplayLayouts: () => void;
  let dialogOpen = false;
  let selected =
    $selectedNode.maxStreamsPerPage === 13
      ? 7
      : $selectedNode.maxStreamsPerPage === 10
        ? 8
        : Math.sqrt($selectedNode.maxStreamsPerPage);

  const onSubmit = async () => {
    selectedNode.set({
      ...$selectedNode,
      maxStreamsPerPage:
        selected === 7 ? 13 : selected === 8 ? 10 : selected * selected,
    });
    dialogOpen = false;
    toggleDisplayLayouts();
    const update = await fetch("/api/node/layoutUpdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nodeId: $selectedNode.id,
        newValue:
          selected === 7 ? 13 : selected === 8 ? 10 : selected * selected,
      }),
    });
    if (!update.ok) {
      toast.error("Something went wrong. Please try again");
      return;
    } else {
      toast("layout Updated Successfully!");
    }
  };
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[720px]">
    <Dialog.Header>
      <Dialog.Title>Screen Layout</Dialog.Title>
      <Dialog.Description>Change Screen Layout</Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-wrap items-center justify-start w-full py-10 px-4">
      {#each Array.from({ length: 6 }, (_, i) => i - 1).toReversed() as layout}
        <div
          class={cn(
            "flex flex-col items-center justify-evenly py-4 mt-2 w-1/3",
            selected === layout + 1 &&
              "px-2 border border-solid border-[#015a62] rounded-md text-primary",
          )}
        >
          <button
            on:click={(e) => {
              e.preventDefault();
              selected = layout + 1;
            }}
          >
            {#if layout != -1}
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class={cn(
                  selected === layout + 1
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {#each Array.from({ length: (layout + 1) * (layout + 1) }, (_, i) => i) as index}
                  <rect
                    x={(index % (layout + 1)) *
                      ((100 - 2 * (Math.max(layout + 1, layout + 1) - 1)) /
                        Math.max(layout + 1, layout + 1) +
                        2)}
                    y={Math.floor(index / (layout + 1)) *
                      ((100 - 2 * (Math.max(layout + 1, layout + 1) - 1)) /
                        Math.max(layout + 1, layout + 1) +
                        2)}
                    width={(100 - 2 * (Math.max(layout + 1, layout + 1) - 1)) /
                      Math.max(layout + 1, layout + 1)}
                    height={(100 - 2 * (Math.max(layout + 1, layout + 1) - 1)) /
                      Math.max(layout + 1, layout + 1)}
                    rx={((100 - 2 * (Math.max(layout + 1, layout + 1) - 1)) /
                      Math.max(layout + 1, layout + 1)) *
                      0.2}
                    fill="currentColor"
                  />
                {/each}
              </svg>
              <span>{layout + 1}:{layout + 1}</span>
            {:else}
              <svg
                width="100"
                height="100"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class={cn(
                  selected === layout + 1
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <path
                  fill="currentColor"
                  d="M2 7.25A3.25 3.25 0 0 1 5.25 4h13.5A3.25 3.25 0 0 1 22 7.25v5.56a6.518 6.518 0 0 0-1.5-1.078V7.25a1.75 1.75 0 0 0-1.75-1.75H5.25A1.75 1.75 0 0 0 3.5 7.25v9.5c0 .966.784 1.75 1.75 1.75h5.826c.081.523.224 1.026.422 1.5H5.25A3.25 3.25 0 0 1 2 16.75zm12.278 6.726a2 2 0 0 1-1.441 2.496l-.584.144a5.728 5.728 0 0 0 .006 1.808l.54.13a2 2 0 0 1 1.45 2.51l-.187.631c.44.386.94.699 1.484.922l.494-.519a2 2 0 0 1 2.899 0l.498.525a5.276 5.276 0 0 0 1.483-.913l-.198-.686a2 2 0 0 1 1.441-2.496l.584-.144a5.716 5.716 0 0 0-.006-1.808l-.54-.13a2 2 0 0 1-1.45-2.51l.187-.63a5.282 5.282 0 0 0-1.484-.922l-.493.518a2 2 0 0 1-2.9 0l-.498-.525a5.28 5.28 0 0 0-1.483.912zM17.5 19c-.8 0-1.45-.672-1.45-1.5S16.7 16 17.5 16c.8 0 1.45.672 1.45 1.5S18.3 19 17.5 19"
                /></svg
              >
              <span>Automatic</span>
            {/if}
          </button>
        </div>
      {/each}
      <button
        class={cn(
          "flex flex-col items-center justify-evenly py-4 mt-2 w-1/3",
          selected === 7 &&
            "px-2 border border-solid border-[#015a62] rounded-md text-primary",
        )}
        on:click={(e) => {
          e.preventDefault();
          selected = 7;
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 2048 2048"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class={cn(selected === 7 ? "text-primary" : "text-muted-foreground")}
        >
          <path
            fill="currentColor"
            d="M896 1024H384V512h512zM512 640v256h256V640zm1152-128v512h-512V512zm-128 384V640h-256v256zM0 256h2048v768h-128V384H128v768h896v128H0zm1989 1113l49 119l-124 51q6 30 6 61t-6 61l124 51l-49 119l-124-52q-35 51-86 86l52 124l-119 49l-51-124q-30 6-61 6t-61-6l-51 124l-119-49l52-124q-51-35-86-86l-124 52l-49-119l124-51q-6-30-6-61t6-61l-124-51l49-119l124 52q35-51 86-86l-52-124l119-49l51 124q30-6 61-6t61 6l51-124l119 49l-52 124q51 35 86 86zm-197 231q0-40-15-75t-41-61t-61-41t-75-15q-40 0-75 15t-61 41t-41 61t-15 75q0 40 15 75t41 61t61 41t75 15q40 0 75-15t61-41t41-61t15-75"
          />
        </svg>
        <span>Custom 1</span>
      </button>
      <button
        class={cn(
          "flex flex-col items-center justify-evenly py-4 mt-2 w-1/3",
          selected === 8 &&
            "px-2 border border-solid border-[#015a62] rounded-md text-primary",
        )}
        on:click={(e) => {
          e.preventDefault();
          selected = 8;
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 2048 2048"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class={cn(selected === 8 ? "text-primary" : "text-muted-foreground")}
        >
          <path
            fill="currentColor"
            d="M896 1024H384V512h512zM512 640v256h256V640zm1152-128v512h-512V512zm-128 384V640h-256v256zM0 256h2048v768h-128V384H128v768h896v128H0zm1989 1113l49 119l-124 51q6 30 6 61t-6 61l124 51l-49 119l-124-52q-35 51-86 86l52 124l-119 49l-51-124q-30 6-61 6t-61-6l-51 124l-119-49l52-124q-51-35-86-86l-124 52l-49-119l124-51q-6-30-6-61t6-61l-124-51l49-119l124 52q35-51 86-86l-52-124l119-49l51 124q30-6 61-6t61 6l51-124l119 49l-52 124q51 35 86 86zm-197 231q0-40-15-75t-41-61t-61-41t-75-15q-40 0-75 15t-61 41t-41 61t-15 75q0 40 15 75t41 61t61 41t75 15q40 0 75-15t61-41t41-61t15-75"
          />
        </svg>
        <span>Custom 2</span>
      </button>
    </div>
    <Dialog.Footer>
      <Button
        variant="secondary"
        on:click={() => {
          dialogOpen = false;
        }}>Cancel</Button
      >
      <Button type="submit" on:click={onSubmit}>Save Changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
