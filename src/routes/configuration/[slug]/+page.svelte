<script lang="ts">
  import PocketBase from "pocketbase";
  import type { PageServerData } from "./$types";
  import { getContext, onDestroy, onMount } from "svelte";
  import ConfigPanel from "./../../../components/configuration/ConfigPanel.svelte";
  import type { Node, User, Camera } from "@/types";
  import { selectedNode } from "@/lib/stores";
  const user: User = getContext("user");
  export let data: PageServerData;
  const session = data?.session;
  let nodes: Node[] = [];

  const PB = new PocketBase("http://127.0.0.1:5555");

  async function getNodes(): Promise<Node[]> {
    if (session?.node.length > 0) {
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

<main
  class="sm:flex items-start justify-between w-full overflow-y-hidden hidden min-h-[calc(100vh-75px)]"
>
  <ConfigPanel {user} records={data.records} logs={data.logs} />
</main>
