<script lang="ts">
  import { ChevronRight, MoreVertical } from "lucide-svelte";

  export let data;
</script>

<div
  class="relative flex items-start gap-6 pl-4 pr-2 py-3 border border-solid border-[#d9d9d9] dark:border-[#333] rounded-md w-[260px]"
>
  <div
    class={data.severity === "medium"
      ? "absolute w-1 h-full top-0 left-0 bg-[#F0C01A] rounded-l-md"
      : data.severity === "high" || data.severity === "critical"
        ? "absolute w-1 h-full top-0 left-0 bg-[#DE4B63] rounded-l-md"
        : data.severity === "information"
          ? "absolute w-1 h-full top-0 left-0 bg-[#3EC195] rounded-l-md"
          : "absolute w-1 h-full top-0 left-0  bg-[#02C7DF] rounded-l-md"}
  />
  <ChevronRight />
  <div class="flex flex-col items-start justify-center gap-2">
    <span class="text-sm font-semibold text-[rgba(0,0,0,.7)] dark:text-white">
      {data?.title}
    </span>
    <span class="text-xs font-semibold text-[#0b8995]">
      {data.formattedDate}
    </span>
    <span class="text-sm text-[#979797]">{data.formattedTime}</span>
  </div>
  <MoreVertical class="ml-auto" />
</div>

<!-- const alertColors = {
  blue: "#02C7DF",
  green: "#3EC195",
  red: "#DE4B63",
  yellow: "#F0C01A",
}; -->
