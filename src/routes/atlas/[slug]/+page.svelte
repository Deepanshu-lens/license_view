<script lang='ts'>
    import AtlasPanel from '@/components/atlas/AtlasPanel.svelte';
    import PocketBase from "pocketbase";
    import { onMount } from 'svelte';
    export let data;
    const {session} = data
    import { selectedNode } from "@/lib/stores";
    let nodes: Node[] = [];
    import { page } from "$app/stores";
    const PB = new PocketBase(`http://${$page.url.hostname}:5555`);



    async function getNodes(): Promise<Node[]> {
    if (session?.node.length > 0) {
      const nodes = await PB.collection("node").getFullList(200, {
        sort: "-created",
        filter: `session~"${session.id}"`,
      });

      for (const node of nodes) {
        const cameras = await PB.collection("camera").getFullList({
          filter: `node~"${node.id}"`,
          sort: "-created",
          expand: "personCounter,inference",
        });
        node.camera = cameras.map((cam: Camera) => ({
          ...cam,
          personCounter: cam?.expand?.personCounter?.count,
        }));
      }
      return nodes.map(
        (node) =>
          ({
            ...node,
            session: session.id,
          }) as Node,
      );
    }
    return [];
  }

  onMount(async () => {
    nodes = await getNodes();
    // console.log(nodes)
    const s = nodes.find((n) => n.id === session.activeNode);
    selectedNode.set(s || nodes[0]);
  });
</script>

<main
  class="flex items-start w-full overflow-y-hidden min-h-[calc(100vh-75px)]"
>
  <AtlasPanel
    {data}
  />
</main>
