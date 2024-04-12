<script lang="ts">
  import { cn } from "@/lib";
  import { addUserLog } from "@/lib/addUserLog";
  import type { Gallery } from "@/types";
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  import { ScanFace } from "lucide-svelte";
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  export let gallery: Gallery;
</script>

<section class="w-full h-full flex">
  <div class="flex h-full">
    <div
      class="flex flex-col gap-4 items-center justify-center px-4 h-[calc(100vh-75px)] my-auto"
    >
      <button
        on:click={() => {
          addUserLog(`user clicked on Search button, top panel`);
        }}
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full border-2 border-solid border-black/[.23] bg-white hover:text-white hover:bg-[#015a62] hover:border-none grid place-items-center`}
        ><ScanFace class="h-[22px] w-[22px]" /></button
      >
    </div>
    <div class="flex flex-wrap gap-6 p-10 h-full">
      {#each gallery as person}
        <div class="w-[285px] h-[170px] bg-white shad rounded-lg p-2">
          <span class="flex items-center justify-between">
            <p class="tex-tsm font-semibold">{person.name}</p>
            <span
              class="text-[#559C36] bg-[#559C36] bg-opacity-15 px-2 py-1 rounded-md text-sm"
              >Active</span
            >
          </span>
          <span class="text-xs">
            Created at: {person.created}
          </span>
          <div class="flex -space-x-2 overflow-hidden my-2">
            {#each person.images as galleryImage}
              <img
                class={cn(
                  `inline-block h-10 w-10 rounded-full ring-2 ring-white`,
                  "3xl:w-16 3xl:h-16",
                )}
                src={"data:image/jpeg;base64," + galleryImage}
                alt=""
              />
            {/each}
          </div>
          <span class="text-sm">
            Updated {timeAgo?.format(new Date(person.updated))}
          </span>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .shad {
    box-shadow: 0px 3.24px 6.47px 0px #d3dae2;
  }
</style>
