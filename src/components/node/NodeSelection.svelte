<script lang="ts">
  import RecursiveNode from "./RecursiveNode.svelte";
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
  import { Dropdown, DropdownItem } from "flowbite-svelte";
  export let url: string;
  export let nodes: Node[];
  export let isAllFullScreen: boolean;
  let showAddNode = false;
  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  function groupNodesRecursively(nodes) {
    const groupNodes = (nodes, level = 0) => {
      const grouped = nodes.reduce((acc, node) => {
        const parts = node.name.split("_");
        const baseName = parts.slice(0, level + 1).join("_");
        if (!acc[baseName]) {
          acc[baseName] = [];
        }
        acc[baseName].push(node);
        return acc;
      }, {});

      return Object.keys(grouped).map((baseName) => {
        const subNodes = grouped[baseName];
        if (
          subNodes.length > 1 &&
          subNodes.some((node) => node.name.split("_").length > level + 1)
        ) {
          return {
            name: baseName,
            nodes: groupNodes(subNodes, level + 1),
          };
        }
        return {
          name: baseName,
          nodes: subNodes,
        };
      });
    };

    return groupNodes(nodes);
  }

  const resultGroupNodes = groupNodesRecursively(nodes);

  const onDeleteNode = () => {
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
      PB.autoCancellation(false)
      console.log($selectedNode.session,selectedOption)
      const test = await PB.collection("node").getFullList({
        expand: "camera",
        filter: `name="${selectedOption}"&&session~"${$selectedNode.session}"`,
      });
      const formattedNodes = test.map((node) => ({
        ...node,
        session: $selectedNode.session,
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
    class={`relative inline-block min-w-[145px] ${$page.route.id.includes("/session") ? "w-max" : "w-full"} ${isAllFullScreen && "bg-black"}`}
  >
    <button
      class={`text-start disabled:cursor-not-allowed block text-primary text-xs outline-none capitalize border-none font-semibold appearance-none w-full ${isAllFullScreen ? "bg-black" : "bg-background"} border py-4 leading-tight  `}
      >{$selectedNode && $selectedNode.name.includes("_")
        ? $selectedNode.name.substring($selectedNode.name.lastIndexOf("_") + 1)
        : $selectedNode.name.length > 20
          ? $selectedNode.name.substring(0, 20) + "..."
          : $selectedNode.name}</button
    >

    <Dropdown placement='bottom' id='nodeSelect' class="z-[99999999] dark:text-slate-200 dark:bg-black border dark:border-slate-300 dark:border-opacity-35 min-w-[10rem] rounded-sm "
    >
      {#if $page?.url?.pathname?.includes('session')}
      <DropdownItem
        class="flex w-full justify-between items-center text-primary pl-3 pr-5 cursor-not-allowed"
      >
        Add Node <PlusCircle class="text-primary" size={18} />
      </DropdownItem>
      {/if}
      {#if resultGroupNodes?.length !== 0}
        {#each resultGroupNodes as node}
          <RecursiveNode {node} {handleNodeSelect} />
        {/each}
      {/if}
    </Dropdown>
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
      <AddCameraDialog sNode={""} {nodes}>
        <button
          class={`w-[26px] h-[26px] bg-[#F9F9F9] dark:bg-black rounded-full ${isAllFullScreen && "text-primary"} grid place-items-center disabled:cursor-not-allowed`}
        >
          <PlusCircle size={18} class="text-[#727272] dark:text-[#f9f9f9]" />
        </button>
      </AddCameraDialog>
      <EditNodeDialog>
        <button
          class={`w-[26px] disabled:cursor-not-allowed h-[26px] bg-[#F9F9F9] dark:bg-black rounded-full ${isAllFullScreen && "text-primary"} grid place-items-center`}
        >
          <Edit size={18} class="text-[#727272] dark:text-[#f9f9f9]" />
        </button>
      </EditNodeDialog>
      <AlertDeleteNode onDelete={onDeleteNode}
        ><button
        disabled
          class={`w-[26px] h-[26px] disabled:cursor-not-allowed bg-[#F9F9F9] dark:bg-black rounded-full grid place-items-center ${isAllFullScreen && "text-primary"}`}
          ><Trash
            size={18}
            class="text-[#727272] dark:text-[#f9f9f9]"
          /></button
        ></AlertDeleteNode
      >
    </span>
  {/if}
  <AddNodeModal {showAddNode} />
</div>
