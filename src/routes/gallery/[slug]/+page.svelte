<script lang="ts">
  import DataTable from "@/components/tables/GalleryTable.svelte";
  import { onMount } from "svelte";
  import type { Gallery } from "@/types";
  import PocketBase, { Record } from "pocketbase";
  import RegisterDialog from "@/components/dialogs/RegisterDialog.svelte";
  import { addUserLog } from "@/lib/addUserLog";
  import { ScanFace } from "lucide-svelte";

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

<div class="container p-2 mx-auto">
  <div class="flex flex-row items-center justify-between px-4">
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
  </div>
  {#if gallery && gallery.length > 0}<DataTable data={gallery} />{/if}
</div>
