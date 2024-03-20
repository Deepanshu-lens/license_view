<script lang="ts">
  import * as Card from "@/components/ui/card";
  import { cn } from "@/lib";
  import type { Gallery } from "@/types";
  export let galleryItem: Gallery;
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo("en-US");
  console.log(galleryItem.name);
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{galleryItem.name}</Card.Title>
    <Card.Description
      >Last Seen: {timeAgo.format(
        new Date(galleryItem.lastSeen),
      )}</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <div class="flex -space-x-2 overflow-hidden">
      {#each galleryItem.images as galleryImage}
        <img
          class={cn(
            "inline-block h-10 w-10 rounded-full ring-2 ring-white",
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
