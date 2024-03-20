<script lang="ts">
  import PlaybackPanel from "@/components/playback/PlaybackPanel.svelte";
  import { selectedNode } from "@/lib/stores";
  import type { Camera } from "@/types.d.ts";
  import PocketBase from "pocketbase";
  import type { PageServerData } from "./$types";
  import { onMount } from "svelte";

  const PB = new PocketBase("http://127.0.0.1:5555");

  export let data: PageServerData;
  let nodes: Node[] = [];

  console.log(data);

  async function getNodes(): Promise<Node[]> {
    if (data?.session?.node?.length > 0) {
      const nodes = await PB.collection("node").getFullList(200, {
        sort: "-created",
        expand: "camera",
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
  });
</script>

<PlaybackPanel webmFiles={data.webmFiles} />
