<script lang="ts">
  import { toast } from "svelte-sonner";
  import { selectedNode } from "@/lib/stores";
  import * as Dialog from "@/components/ui/dialog";
  import { cn } from "@/lib";
  import { Columns2, RectangleVertical } from "lucide-svelte";

  let selectedValue;
  let layoutValue;
  let dialogOpen = false;

  export let orientation: string | null;

  import { onMount } from "svelte";

  onMount(() => {
    const layoutMob = localStorage.getItem("layoutSelectionMob");
    if (layoutMob) {
      layoutValue = layoutMob;
    }
  });

  function handleSubmit(event) {
    event.preventDefault();
    handleCheckboxChange({
      target: { value: selectedValue, checked: true },
    });
    dialogOpen = false;
    window.location.reload();
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      localStorage.setItem("layoutSelectionMob", value);
    }
  };
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content
    class={`max-w-[80%] ${orientation === "landscape" ? "rotate-90 scale-90" : ""}`}
  >
    <Dialog.Header
      ><Dialog.Title>Screen Layout</Dialog.Title>
      <Dialog.Description>Change Screen Layout</Dialog.Description
      ></Dialog.Header
    >
    <form on:submit={handleSubmit}>
      <div
        class="flex flex-wrap items-center justify-between w-full py-10 px-4"
      >
        <div
          class="flex flex-col items-center justify-evenly py-4 mt-2 text-black dark:text-white w-1/3"
        >
          <button
            on:click={(e) => {
              e.preventDefault();
              selectedValue = 2;
            }}
            class={layoutValue === "2" && !selectedValue
              ? "px-2 border border-solid border-[#015a62] rounded-md text-[#015a62]"
              : selectedValue === "2" || selectedValue === 2
                ? "px-2 border border-solid border-[#015a62] rounded-md text-[#015a62]"
                : ""}
          >
            <span class="flex flex-col items-center">
              <Columns2 class="h-[60px] w-[60px]" />
              <span class="text-sm">2 Columns</span>
            </span>
          </button>
        </div>

        <div
          class="flex flex-col items-center justify-evenly py-4 mt-2 text-black dark:text-white w-1/3"
        >
          <button
            on:click={(e) => {
              e.preventDefault();
              selectedValue = 1;
            }}
            class={layoutValue === "1" && !selectedValue
              ? "px-2 border border-solid border-[#015a62] rounded-md text-[#015a62]"
              : selectedValue === "1" || selectedValue === 1
                ? "px-2 border border-solid border-[#015a62] rounded-md text-[#015a62]"
                : ""}
          >
            <span class="flex flex-col items-center">
              <RectangleVertical class="h-[60px] w-[60px]" />
              <span class="text-sm">1 column</span>
            </span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="flex items-center justify-center mx-auto my-4 px-8 py-2 bg-[#015a62] text-white rounded-md"
      >
        Okay
      </button>
    </form>
  </Dialog.Content>
</Dialog.Root>
