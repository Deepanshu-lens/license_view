<script lang="ts">
  import DataTable from "@/components/tables/GalleryTable.svelte";
  import { onMount } from "svelte";
  import type { Gallery } from "@/types";
  import PocketBase, { Record } from "pocketbase";
  import RegisterDialog from "@/components/dialogs/RegisterDialog.svelte";
  import { addUserLog } from "@/lib/addUserLog";
  import { ChevronLeft, ScanFace } from "lucide-svelte";
  import GalleryView from "@/components/gallery/mobile/GalleryView.svelte";
  import { selectedNode } from "@/lib/stores";
  import GalleryPanel from "@/components/gallery/GalleryPanel.svelte";
  import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

  let gallery: Gallery[] = [];

  // const PB = new PocketBase(PUBLIC_POCKETBASE_URL);
  const PB = new PocketBase("http://127.0.0.1:5555");

  async function getData(): Promise<Gallery[]> {
    const data = await PB.collection("faceGallery").getFullList();

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

<!-- <div class="p-2 mx-auto hidden sm:block"> -->
<!-- <div class="flex flex-row items-center justify-between px-4">
    <h1
      class="text-2xl font-bold dark:text-[#e0e0e0] text-[#212427] flex justify-center pt-2 pb-4"
    >
      Gallery
    </h1>
    <RegisterDialog>
      <button
        class="flex items-center justify-center gap-2 cursor-pointer relative hover:text-primary"
        on:click={() =>
          addUserLog("user clicked on Register button, gallery panel")}
      >
        <ScanFace size={18} />
        Register
      </button>
    </RegisterDialog>
  </div> -->
<div class="overflow-y-scroll max-h-[99vh] hidden sm:block w-full">
  {#if gallery && gallery.length > 0}
    <GalleryPanel {gallery} />
    <!-- <DataTable data={gallery} /> -->
  {/if}
</div>
<!-- </div> -->
<div class="block sm:hidden">
  <div class="flex flex-col w-full bg-[#f5f6f7] z-10 relative">
    <div class="top-config w-full">
      <button
        class="flex items-center justify-start text-black/[.7] pt-4"
        on:click={() => {
          window.location.href = `/session/${$selectedNode?.session}`;
        }}
      >
        <ChevronLeft class="h-[30px] w-[30px]" />
        <p class="text-lg font-semibold">Gallery</p>
      </button>
    </div>
    <GalleryView data={gallery} />
  </div>
</div>
