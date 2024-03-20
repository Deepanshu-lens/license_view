<script lang="ts">
  import DataTable from "@/components/tables/GalleryTable.svelte";
  import { onMount } from "svelte";
  import type { Gallery } from "@/types";
  import PocketBase, { Record } from "pocketbase";

  let gallery: Gallery[] = [];
  const PB = new PocketBase("http://127.0.0.1:5555");
  async function getData(): Promise<Gallery[]> {
    const data = await PB.collection("faceGallery").getFullList();
    console.log(data[0]?.name);

    return data.map(
      (v) =>
        ({
          name: v.name,
          images: v.images,
          created: new Date(v.created),
          updated: new Date(v.updated),
          lastSeen: new Date(v.lastSeen),
        }) as Gallery,
    );
  }
  onMount(async () => {
    gallery = await getData();
  });
</script>

<div class="container mx-auto py-4">
  <span class="text-base font-medium dark:text-[#e0e0e0] text-[#212427] px-6">
    Gallery
  </span>
  {#if gallery && gallery.length > 0}<DataTable data={gallery} />{/if}
</div>
