<script lang="ts">
  import AddCameraDialog from "@/components/dialogs/AddCameraDialog.svelte";
  import EditNodeDialog from "./../dialogs/EditNodeDialog.svelte";
  import type { Camera, Node } from "@/types";
  import { Edit, PlusCircle, Trash } from "lucide-svelte";
  import { selectedNode } from "@/lib/stores";
  import Button from "../ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import AlertDeleteNode from "../dialogs/alerts/AlertDeleteNode.svelte";
  import { cn } from "@/lib";
  import AddNodeModal from "../modal/AddNodeModal.svelte";
  import { page } from "$app/stores";
  import { addUserLog } from "@/lib/addUserLog";
  import PocketBase from "pocketbase";

  export let url: string;
  export let nodes: Node[];
  export let isAllFullScreen: boolean;
  let showAddNode = false;
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

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

  const handleNodeSelect = async (event: Event) => {
    const selectedOption = (event.target as HTMLSelectElement).value;

    if (selectedOption === "Add Node +") {
      console.log("adding node");
      showAddNode = true;
      return;
    }

    try {
      const response = await fetch("/api/node/getMany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: $selectedNode.session,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch node data");
      }

      const { nodeData } = await response.json();
      const selected = nodeData.find((node) => node.name === selectedOption);

      if (!selected) {
        throw new Error("Selected node not found");
      }

      const nodes = await PB.collection("node").getFullList(200, {
        expand: "camera",
        filter: `id="${selected.id}"`,
      });

      const formattedNodes = nodes.map((node) => ({
        ...node,
        camera:
          node.camera.length > 0
            ? node.expand.camera.reverse().map((cam: Camera) => ({
                name: cam.name,
                id: cam.id,
                url: cam.url,
                subUrl: cam.subUrl,
                save: cam.save,
                face: cam.face,
                vehicle: cam.vehicle,
                faceDetThresh: cam.faceDetThresh,
                faceMatchThresh: cam.faceMatchThresh,
                vehicleDetThresh: cam.vehicleDetThresh,
                vehiclePlateThresh: cam.vehiclePlateThresh,
                vehicleOCRThresh: cam.vehicleOCRThresh,
                saveFolder: cam.saveFolder,
                saveDuration: cam.saveDuration,
                motionThresh: cam.motionThresh,
                priority: cam.priority,
              }))
            : [],
      }));

      selectedNode.set(formattedNodes[0]);
      console.log("updated selectedNode", $selectedNode.name);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    }
  };
</script>

<div
  class={`flex justify-between items-center py-0.5 px-4 border-b-[1px] w-full`}
>
  <div
    class={`relative inline-block min-w-[140px] ${$page.route.id.includes("/session") ? "w-max" : "w-full"} ${isAllFullScreen && "bg-black"}`}
  >
    <select
      class={`block text-primary outline-none capitalize border-none font-semibold appearance-none w-full ${isAllFullScreen ? "bg-black" : "bg-background"} border py-4 leading-tight  `}
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
    <span class="flex items-center gap-2 justify-between">
      <AddCameraDialog sNode={""}>
        <span
          class={`w-[26px] h-[26px] bg-[#F9F9F9] dark:bg-black rounded-full ${isAllFullScreen && "text-primary"} grid place-items-center`}
        >
          <PlusCircle size={18} class="text-[#727272] dark:text-[#f9f9f9]" />
        </span>
      </AddCameraDialog>
      <EditNodeDialog>
        <span
          class={`w-[26px] h-[26px] bg-[#F9F9F9] dark:bg-black rounded-full ${isAllFullScreen && "text-primary"} grid place-items-center`}
        >
          <Edit size={18} class="text-[#727272] dark:text-[#f9f9f9]" />
        </span>
      </EditNodeDialog>
      <AlertDeleteNode onDelete={onDeleteNode}
        ><Button
          variant="ghost"
          size="icon"
          class={`w-[26px] h-[26px] bg-[#F9F9F9] dark:bg-black rounded-full ${isAllFullScreen && "text-primary"}`}
          ><Trash
            size={18}
            class="text-[#727272] dark:text-[#f9f9f9]"
          /></Button
        ></AlertDeleteNode
      >
    </span>
  {/if}
  <AddNodeModal {showAddNode} />
</div>
