<script lang="ts">
  import type { Node } from "@/types";
  import { Trash } from "lucide-svelte";
  import { leftPaneHide, selectedNode } from "@/lib/stores";
  import Button from "../ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import AlertDeleteNode from "../dialogs/alerts/AlertDeleteNode.svelte";
  import { cn } from "@/lib";
  import AddNodeModal from "../modal/AddNodeModal.svelte";
  import { addUserLog } from "@/lib/addUserLog";
  // import * as Select from "../ui/select";
  export let url: string;
  export let nodes: Node[];
  let showAddNode = false;

  const onDeleteNode = () => {
    // console.log($selectedNode);
    const localCameraList = $selectedNode.camera;
    fetch("/api/node/delete", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cameras: $selectedNode.camera,
        nodeId: $selectedNode.id,
      }),
    }).then(() => {
      localCameraList.map((c) =>
        document.getElementById(`stream-${c.id}`)?.remove(),
      );
      toast("Node deleted");
      addUserLog(
        `user deleted node ${$selectedNode.name} having id ${$selectedNode.id}`,
      );
    });
  };

  const handleNodeSelect = async (event: string) => {
    const selectedOption = event.target.value;
    if (selectedOption === "Add Node +") {
      console.log("adding node");
      showAddNode = true;
    } else {
      // console.log("nodeselect");
      const data = await fetch("/api/node/getMany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: $selectedNode.session,
        }),
      });

      if (!data.ok) {
        toast.error("Something went wrong. Please try again");
        return;
      }

      const result = await data.json();
      const nodeData = result.nodeData;

      const selected = nodeData.find((node) => node.name === selectedOption);
      // console.log("selected", selected);
      selectedNode.set(selected);
    }
  };
</script>

<div
  class={`flex justify-between items-center py-0.5 px-4 border-b-[1px] 
  ${!$leftPaneHide ? "w-full" : "w-0 hidden"}`}
>
  <div class={`relative inline-block w-full ${$leftPaneHide && "hidden"}`}>
    <select
      class={`block text-primary outline-none capitalize border-none font-semibold appearance-none w-full bg-background border py-4 pr-8 rounded leading-tight `}
      value={$selectedNode && $selectedNode.name}
      on:change={handleNodeSelect}
    >
      <option>Add Node +</option>
      {#each nodes as node}
        <option id={node.id}>{node.name}</option>
      {/each}
    </select>
    <div
      class={cn(
        `pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 py-4 text-primary`,
        $leftPaneHide && "hidden",
      )}
    >
      <svg
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
  {#if url.includes(`/session/`)}
    <AlertDeleteNode onDelete={onDeleteNode}
      ><Button
        variant="ghost"
        size="icon"
        class={`${$leftPaneHide && "hidden"}`}><Trash size={18} /></Button
      ></AlertDeleteNode
    >{/if}
  <AddNodeModal {showAddNode} />
</div>
