<script lang="ts">
  import PlaybackCard from "@/components/cards/mobile/PlaybackCard.svelte";
  import { ChevronRight } from "lucide-svelte";
  export let cam;
  export let index;
</script>

<div class="h-[220px] flex flex-col mx-6 gap-2">
  <span class="flex items-center justify-between">
    <p class="text-[#505050] font-medium text-base tracking-[-0.14px]">
      {cam.name}
    </p>
    <ChevronRight />
  </span>
  <span class="flex items-center overflow-y-scroll gap-4 w-full">
    <PlaybackCard />
    <PlaybackCard />
    <PlaybackCard />
    <PlaybackCard />
    <PlaybackCard />
  </span>
</div>
