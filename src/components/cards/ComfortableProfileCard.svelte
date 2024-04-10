<script lang="ts">
  import * as Card from "@/components/ui/card";
  import { cn } from "@/lib";
  import type { Gallery } from "@/types";
  export let galleryItem: Gallery;
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  // console.log(galleryItem.lastSeen, galleryItem.name);
  export let isAllFullScreen: boolean;
</script>

<Card.Root class={isAllFullScreen ? "bg-[#333] text-white border-none" : ""}>
  <Card.Header>
    <Card.Title>
      <div class="flex items-center justify-between">
        {galleryItem.name}
        {#if galleryItem?.savedData?.length > 0}
          <img
            src={"data:image/jpeg;base64," + galleryItem.savedData?.[0]}
            alt="profile"
            class="h-12 w-12 aspect-square object-contain"
          />
        {/if}
      </div>
    </Card.Title>
    <Card.Description>
      Last Seen:
      {#if galleryItem.lastSeen.length === 0}
        Not yet
      {:else}
        {timeAgo?.format(new Date(galleryItem?.lastSeen))}
      {/if}
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="flex -space-x-2 overflow-hidden">
      {#each galleryItem.images as galleryImage}
        <img
          class={cn(
            `inline-block h-10 w-10 rounded-full ring-2 ${isAllFullScreen ? "ring-black" : "ring-white"}`,
            "lg:w-12",
            "3xl:w-16 3xl:h-16",
          )}
          src={"data:image/jpeg;base64," + galleryImage}
          alt=""
        />
      {/each}
    </div>
  </Card.Content>
</Card.Root>
