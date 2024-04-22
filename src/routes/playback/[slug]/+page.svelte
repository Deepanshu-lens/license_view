<script lang="ts">
  import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
  import PlaybackView from "./../../../components/playback/mobile/PlaybackView.svelte";
  import PlaybackPanel from "@/components/playback/PlaybackPanel.svelte";
  import { convertedVideos, selectedNode } from "@/lib/stores";
  import type { Camera } from "@/types.d.ts";
  import PocketBase from "pocketbase";
  import type { PageServerData } from "./$types";
  import { onMount } from "svelte";
  import { ChevronLeft } from "lucide-svelte";

  const PB = new PocketBase(PUBLIC_POCKETBASE_URL);
  // const PB = new PocketBase("http://127.0.0.1:5555");

  export let data: PageServerData;
  const session = data.session;
  let nodes: Node[] = [];

  async function getNodes(): Promise<Node[]> {
    if (data?.session?.node?.length > 0) {
      const nodes = await PB.collection("node").getFullList(200, {
        sort: "-created",
        expand: "camera",
        filter: `session~"${session.id}"`,
      });
      return nodes.map(
        (node) =>
          ({
            ...node,
            camera:
              node.camera.length > 0
                ? (node.expand.camera.reverse().map((cam: Camera) => ({
                    name: cam.name,
                    id: cam.id,
                    url: cam.url,
                  })) as Camera[])
                : [],
          }) as unknown as Node,
      );
    }
    return [];
  }

  onMount(async () => {
    nodes = await getNodes();
    selectedNode.set(nodes[0]);
    if (data) {
      console.log(data.webmFiles);
      convertedVideos.set(data.webmFiles);
    }
  });
</script>

<main class="hidden sm:block w-full h-screen">
  <PlaybackPanel webmFiles={data.webmFiles} {data} />
</main>
<main class="block sm:hidden">
  <div class="flex flex-col w-full bg-[#f5f6f7] z-10 relative">
    <div class="top-config w-full">
      <button
        class="flex items-center justify-start text-black/[.7] pt-4"
        on:click={() => {
          window.location.href = `/session/${$selectedNode.session}`;
        }}
      >
        <ChevronLeft class="h-[30px] w-[30px]" />
        <p class="text-lg font-semibold">Playback</p>
      </button>
    </div>
    <PlaybackView webmFiles={data.webmFiles} />
  </div>
</main>
