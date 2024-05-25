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
  import * as DropdownMenu from "@/components/ui/dropdown-menu/index.js";
  import * as HoverCard from "@/components/ui/hover-card";
  import * as ContextMenu from "@/components/ui/context-menu";

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
  console.log(resultGroupNodes);

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

    console.log("selectedOPtion for nodeSelect", selectedOption);

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
      console.log(nodeData);
      const selected = nodeData.find((node) => node.name === selectedOption);

      if (!selected) {
        throw new Error("Selected node not found");
      }

      const nodes = await PB.collection("node").getFullList(200, {
        expand: "camera",
        filter: `id="${selected.id}"`,
      });

      // console.log('nodes,nodeselect',nodes)
      const formattedNodes = nodes.map((node) => ({
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
      console.log("updated selectedNode", $selectedNode.name);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    }
  };
  let showFirstLevel = false;
  let showSecondLevel = false;
  
</script>

<div
  class={`flex justify-between items-center py-0.5 px-4 border-b-[1px] w-full`}
>
  <div
    class={`relative inline-block min-w-[140px] ${$page.route.id.includes("/session") ? "w-max" : "w-full"} ${isAllFullScreen && "bg-black"}`}
  >
    <!-- <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class={`block text-start text-primary text-xs outline-none capitalize border-none font-semibold appearance-none w-full ${isAllFullScreen ? "bg-black" : "bg-background"} border py-4 leading-tight`}
      >
        {$selectedNode && $selectedNode.name.includes("_")
          ? $selectedNode.name.substring(
              $selectedNode.name.lastIndexOf("_") + 1,
            )
          : $selectedNode.name.length > 10
            ? $selectedNode.name.substring(0, 10) + "..."
            : $selectedNode.name}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            id={"add"}
            on:click={() =>
              handleNodeSelect({ target: { value: "Add Node +" } })}
          >
            Add Node +
          </DropdownMenu.Item>
          {#each resultGroupNodes as node}
            {@const name = node.name}
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <span>Invite users</span>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>
                  <span>Email</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <span>Message</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <HoverCard.Root>
                    <HoverCard.Trigger>Hover</HoverCard.Trigger>
                    <HoverCard.Content>
                      SvelteKit - Web development, streamlined
                    </HoverCard.Content>
                  </HoverCard.Root>
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          {/each}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>  -->  
   
   
   
  <select
  class={`block text-primary text-xs outline-none capitalize border-none font-semibold appearance-none w-full ${isAllFullScreen ? "bg-black" : "bg-background"} border py-4 leading-tight  `}
  value={$selectedNode && $selectedNode.name}
      on:change={handleNodeSelect}
    >
      <option>Add Node +</option>
      {#each nodes as node}
      {@const name = node.name}
        <option id={node.id}>{name}</option>
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
      <AddCameraDialog sNode={""} {nodes}>
        <button
          class={`w-[26px] h-[26px] bg-[#F9F9F9] dark:bg-black rounded-full ${isAllFullScreen && "text-primary"} grid place-items-center disabled:cursor-not-allowed`}
        >
          <PlusCircle size={18} class="text-[#727272] dark:text-[#f9f9f9]" />
        </button>
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


   <!-- <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  >{name.includes("_")
                    ? name.substring(name.lastIndexOf("_") + 1)
                    : name.length > 10
                      ? name.substring(0, 10) + "..."
                      : name}
                  , subNodes:({node?.nodes?.length - 1})</DropdownMenu.Trigger
                >
                <DropdownMenu.Content>
                  <DropdownMenu.Group>
                    {#each node.nodes as subnode, index}
                      {@const subName = subnode.name}
                      {#if index !== 0}
                        <DropdownMenu.Item
                          id={subnode.id}
                          on:click={() =>
                            handleNodeSelect({ target: { value: subName } })}
                        >
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger
                              >{subName.includes("_")
                                ? subName.substring(
                                    subName.lastIndexOf("_") + 1,
                                  )
                                : subName.length > 10
                                  ? subName.substring(0, 10) + "..."
                                  : subName}
                              , subNodes:({subnode?.nodes?.length -
                                1})</DropdownMenu.Trigger
                            >
                            <DropdownMenu.Content>
                              <DropdownMenu.Group>
                                {#each subnode.nodes as subsubnode, id}
                                  {@const subsubname = subsubnode.name}
                                  {#if id !== 0}
                                    <DropdownMenu.Item on:click={() =>
                                      handleNodeSelect({ target: { value: subsubname } })}
                                      >{id}- {subsubname.includes("_")
                                        ? subsubname.substring(
                                            subsubname.lastIndexOf("_") + 1,
                                          )
                                        : subsubname.length > 10
                                          ? subsubname.substring(0, 10) + "..."
                                          : subsubname}
                                      , subNodes:({subnode?.nodes?.length -
                                        1})</DropdownMenu.Item
                                    >
                                  {:else}
                                    <DropdownMenu.Label
                                      >{subsubname.includes("_")
                                        ? subsubname.substring(
                                            subsubname.lastIndexOf("_") + 1,
                                          )
                                        : subsubname.length > 10
                                          ? subsubname.substring(0, 10) + "..."
                                          : subsubname}</DropdownMenu.Label
                                    >
                                    <DropdownMenu.Separator />
                                  {/if}
                                {/each}
                              </DropdownMenu.Group>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </DropdownMenu.Item>
                      {:else}
                        <DropdownMenu.Label
                          >{subName.includes("_")
                            ? subName.substring(subName.lastIndexOf("_") + 1)
                            : subName.length > 10
                              ? subName.substring(0, 10) + "..."
                              : subName}</DropdownMenu.Label
                        >
                        <DropdownMenu.Separator />
                      {/if}
                    {/each}
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root> -->
            