<script lang="ts">
  import PocketBase from "pocketbase";
  import AddCameraDialog from "@/components/dialogs/AddCameraDialog.svelte";
  import AddNodeDialog from "@/components/dialogs/AddNodeDialog.svelte";
  import AlertDeleteNode from "@/components/dialogs/alerts/AlertDeleteNode.svelte";
  import { selectedNode } from "@/lib/stores";
  import type { User } from "@/types";
  import { Search, X } from "lucide-svelte";
  export let user: User;
  import { onMount, onDestroy } from "svelte";
  import { toast } from "svelte-sonner";
  import { addUserLog } from "@/lib/addUserLog";
  import { writable } from "svelte/store";
  import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

  let selected = 1;
  let detailIndex: number | null = null;
  let nodeIndex: number | null = null;
  let modify: boolean = false;
  let nodeModify: boolean = false;
  let newName = "";
  let searchNode = "";
  let newNodeName = "";
  let searchValue = "";
  let filteredCameraNames = [];
  let filteredNodeNames = [];
  let enable = false;
  let newData = [];
  let change = "";

  const PB = new PocketBase(PUBLIC_POCKETBASE_URL);

  const nodeData = writable([]);

  async function getNodeData() {
    if (user?.session) {
      const data = await fetch("/api/node/getMany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: user?.session,
        }),
      });
      if (!data.ok) {
        toast.error("Something went wrong. Please try again");
        return;
      }
      const result = await data.json();
      nodeData.set([...result?.nodeData]);
    } else {
      console.log("no selected node");
    }
  }

  onMount(() => {
    getNodeData();

    PB.collection("camera").subscribe("*", async (e) => {
      console.log("change", e.action, e.record);
      getNodeData();
    });
  });

  onDestroy(() => {
    PB.collection("camera").unsubscribe("*");
  });

  const onDeleteNode = () => {
    const localCameraList =
      $selectedNode.camera.length === 0 ? [] : $selectedNode.camera;
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
    });
  };

  $: {
    newData =
      $nodeData.length > 0
        ? $nodeData.filter((item: any) => {
            return item.session === user.session;
          })
        : [];
  }

  $: {
    if (searchNode.length === 0) {
      filteredNodeNames = [];
    }
    if (searchValue.length === 0) {
      filteredCameraNames = [];
    }
  }
</script>

<div
  class="flex flex-col overflow-y-scroll overflow-x-clip items-start pt-12 h-[calc(100vh-75px)] w-full text-black dark:text-white"
  id="camera"
>
  <div
    class="flex w-full justify-start items-center gap-20 font-bold mb-4 px-8"
  >
    {#if selected === 1}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Camera details
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => {
          selected = 1;
          addUserLog("user clicked on camera details button Camera panel");
        }}
      >
        Camera details
      </button>
    {/if}
    {#if selected === 2}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Camera status
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => {
          selected = 2;
          addUserLog("user clicked on camera status button Camera panel");
        }}
      >
        Camera status
      </button>
    {/if}
    {#if selected === 3}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Camera failures
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => {
          selected = 3;
          addUserLog("user clicked on camera failures button Camera panel");
        }}
      >
        Camera failures
      </button>
    {/if}
  </div>
  <div
    class="h-[1px] w-[96%] dark:border-[#333] mb-8 border-[#e0e0e0] border-t border-solid"
  />

  {#if selected === 1}
    <h2 class="px-6 font-medium mb-4" id="details">Camera & Node Details</h2>
    <div
      class="h-[1px] w-[96%] dark:border-[#333] mb-8 border-[#e0e0e0] border-t border-solid"
    />
    <div class="flex flex-col items-start gap-2 px-6 mb-8">
      <span class="dark:text-[#e0e0e0] text-sm"> Node name or Id </span>
      <div class="flex items-center justify-center gap-5">
        <input
          autoComplete="off"
          placeholder="Search for node name or id "
          class="py-4 w-[330px] pl-3 rounded-md border border-solid border-[#979797] active:border-[#015a62] text-xs text-[#979797] dark:bg-[#242424] dark:border-[#333] dark:text-[#929292]"
          bind:value={searchNode}
          on:input={(e) => {
            searchNode = e.target.value;
            let filteredNodes = newData.filter((node) => {
              return node.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase());
            });
            filteredNodeNames = [...filteredNodes];
            let exact = newData.filter((node) => {
              return node.name.toLowerCase() === e.target.value.toLowerCase();
            });
            if (exact.length > 0) {
              enable = true;
            } else {
              enable = false;
            }
          }}
        />

        <button
          disabled={!enable}
          class="disabled:cursor-not-allowed py-2.5 px-5 text-sm hover:bg-[#015A62] dark:hover:bg-[#015a62] dark:bg-[#828282] dark:text-white rounded-md text-[#4f4f4f] hover:text-white text-[4f4f4f] bg-[#d9d9d9]"
          on:click={() => (nodeIndex = 0)}
        >
          Modify
        </button>
      </div>
    </div>
    <div
      class="flex flex-col items-center max-w-[60%] ml-6 justify-center w-full dark:border-[#939393] border-solid border mb-10"
    >
      <div
        class=" dark:bg-[#1b1b1b] bg-white px-6 w-full flex items-center justify-between py-2"
      >
        <span class="font-semibold">Node</span>
        <div class="flex gap-4">
          <AddNodeDialog {user} {getNodeData}>
            <button
              on:click={() =>
                addUserLog("user clicked on add node button camera panel")}
              class="dark:text-[#CAC4D0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
            >
              Add
            </button>
          </AddNodeDialog>
          {#if !nodeModify}
            <button
              class="dark:text-[#CAC4D0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
              on:click={() => {
                if (nodeIndex !== undefined && nodeIndex !== null) {
                  nodeModify = true;
                  addUserLog("user clicked on modify node button camera panel");
                } else {
                  alert("please select a node");
                  addUserLog(
                    "user clicked on modify node button, without selecting a node,  camera panel",
                  );
                }
              }}
            >
              Modify
            </button>
          {:else}
            <button
              class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
              on:click={() => {
                const data = fetch("/api/node/update", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: newNodeName,
                    id: newData[nodeIndex].id,
                  }),
                }).catch((err) => {
                  toast.error("failed to update node name");
                  return;
                });
                toast(`${newData[nodeIndex].name} updated to ${newNodeName}!`);
                nodeModify = false;
              }}
            >
              Save Changes
            </button>
          {/if}
          {#if nodeModify}
            <button
              class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
              on:click={() => (nodeModify = false)}
            >
              Discard Changes
            </button>
          {/if}
          <AlertDeleteNode onDelete={onDeleteNode}>
            <button
              class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid disabled:cursor-not-allowed"
              disabled={nodeIndex === null}
            >
              Delete
            </button>
          </AlertDeleteNode>
        </div>
      </div>

      <table class="w-full bg-white shadow-md rounded">
        <tbody>
          {#if filteredNodeNames.length > 0}
            {#each filteredNodeNames as item, index}
              <tr
                class={`dark:bg-[#1b1b1b] bg-[white] cursor-pointer border-b-[1px] border-solid dark:border-[#929292] ${
                  index === 0 ? "border-t-[1px]" : ""
                } `}
                on:click={() => {
                  if (nodeIndex === index) {
                    if (!nodeModify) {
                      nodeIndex = null;
                    }
                  } else {
                    nodeIndex = index;
                    addUserLog(
                      `user clicked on table row with node name ${item.name}`,
                    );
                  }
                }}
              >
                <td
                  class=" text-center py-2 px-4 border-r-[1px] border-solid dark:border-[#929292] w-1/2"
                >
                  {#if nodeModify && index === nodeIndex}
                    <input
                      type="text"
                      autoComplete="off"
                      name="node-name"
                      placeholder={item.name}
                      bind:value={newNodeName}
                      on:input={(e) => {
                        console.log(e.target.value);
                        newNodeName = e.target.value;
                      }}
                      class="block border-0 px-1 py-1 text-gray-900
                      placeholder:text-gray-400
                        bg-transparent w-full
                        focus:border-b-2
                      focus:border-indigo-600
                      dark:text-[#979797] sm:text-sm sm:leading-6"
                    />
                  {:else}
                    {item.name}
                  {/if}
                </td>
                <td class="text-center py-3 px-4 h-full w-1/2">
                  <div class="flex justify-center items-center h-full">
                    <input
                      class="w-auto cursor-pointer"
                      type="checkbox"
                      checked={nodeIndex === index}
                    />
                  </div>
                </td>
              </tr>
            {/each}
          {:else}
            {#each $nodeData as data, index}
              <tr
                class={`dark:bg-[#1b1b1b] bg-[white] cursor-pointer border-b-[1px] border-solid dark:border-[#929292] ${
                  index === 0 ? "border-t-[1px]" : ""
                } `}
                on:click={() => {
                  if (nodeIndex === index) {
                    if (!nodeModify) {
                      nodeIndex = null;
                    }
                  } else {
                    nodeIndex = index;
                    addUserLog(
                      `user clicked on table row with node name ${data.name}`,
                    );
                  }
                }}
              >
                <td
                  class=" text-center py-2 px-4 border-r-[1px] border-solid dark:border-[#929292] w-1/2"
                >
                  {#if nodeModify && index === nodeIndex}
                    <input
                      type="text"
                      autoComplete="off"
                      name="node-name"
                      placeholder={data.name}
                      bind:value={newNodeName}
                      on:input={(e) => {
                        console.log(e.target.value);
                        newNodeName = e.target.value;
                      }}
                      class="block border-0 px-1 py-1 text-gray-900
                          placeholder:text-gray-400
                            bg-transparent w-full
                            focus:border-b-2
                          focus:border-indigo-600
                          dark:text-[#979797] sm:text-sm sm:leading-6"
                    />
                  {:else}
                    {data.name}
                  {/if}
                </td>
                <td class="text-center py-3 px-4 h-full w-1/2">
                  <div class="flex justify-center items-center h-full">
                    <input
                      class="w-auto cursor-pointer"
                      type="checkbox"
                      checked={nodeIndex === index}
                    />
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    {#if nodeIndex !== undefined && nodeIndex !== null}
      <span class="px-6 text-sm dark:text-[#e0e0e0] mb-4">
        Camera Details
      </span>
      <div
        class="flex flex-col items-center max-w-[96%] mx-auto justify-center w-full dark:border-[#939393] border-solid border mb-20"
      >
        <div
          class="dark:bg-[#1b1b1b] py-2 flex w-full items-center justify-between px-6"
        >
          <div class="relative">
            <input
              placeholder="Search camera by name"
              class="pr-2 pl-10 py-1 my-1 rounded-md border border-solid dark:border-[#333] dark:bg-[#242424] w-[300px] placeholder-opacity-70"
              bind:value={searchValue}
              on:input={(e) => {
                searchValue = e.target.value;
                let filteredNames = newData[nodeIndex].cameraData.filter(
                  (camera) => {
                    return camera[0].name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase());
                  },
                );
                filteredCameraNames = [...filteredNames];
              }}
            />
            <Search class="absolute top-1/2 -translate-y-1/2 left-2" />
            <X class="absolute top-1/2 -translate-y-1/2 right-2" />
          </div>
          <div class="flex gap-4">
            <AddCameraDialog sNode={newData[nodeIndex]}>
              <button
                on:click={() =>
                  addUserLog(`user clicked on add camera button camera table`)}
                class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
              >
                Add
              </button>
            </AddCameraDialog>
            {#if !modify}
              <button
                class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
                on:click={() => {
                  if (detailIndex !== undefined && detailIndex !== null) {
                    modify = true;
                    addUserLog(
                      `user clicked on add modify button camera table`,
                    );
                  } else {
                    alert("please select a camera");
                    addUserLog(
                      `user clicked on add modify button, without selecting a camera, camera table`,
                    );
                  }
                }}
              >
                Modify
              </button>
            {:else}
              <button
                class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
                on:click={() => {
                  fetch("/api/camera/editCamera", {
                    method: "put",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      cameraId: newData[nodeIndex].cameraData[0][0].id,
                      nodeId: newData[nodeIndex].id,
                      name: newName,
                      url: newData[nodeIndex].cameraData[0][0].url,
                    }),
                  }).then((res) => {
                    toast("Camera edited");
                    modify = false;
                    addUserLog(
                      `user clicked on save changes button after modification, camera table`,
                    );
                  });
                }}
              >
                Save Changes
              </button>
            {/if}
            {#if modify}
              <button
                class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
                on:click={() => {
                  modify = false;
                  addUserLog(
                    `user clicked on discard button after modification, camera table`,
                  );
                }}
              >
                Discard
              </button>
            {/if}
            <button
              disabled={detailIndex === null}
              class="dark:text-[#cac4d0] text-[#4f4f4f] font-xs bg-[#d9d9d9] border-none dark:bg-[#242424] rounded-md px-3 py-1.5 border-[#333] border dark:border-solid"
              on:click={() => {
                fetch("/api/camera/deleteCamera", {
                  method: "delete",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    cameraId: newData[nodeIndex].cameraData[detailIndex][0].id,
                    nodeId: newData[nodeIndex].id,
                    url: newData[nodeIndex].cameraData[detailIndex][0].url,
                  }),
                }).then(() => {
                  detailIndex = null;
                  toast("Selected camera Deleted!");
                  addUserLog(
                    `user deleted camera with name ${newData[nodeIndex].cameradata[detailIndex][0].name} & url ${newData[nodeIndex].cameraData[detailIndex][0].url}`,
                  );
                });
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <table class="w-full bg-white shadow-md rounded">
          <thead>
            <tr
              class="dark:bg-[#1b1b1b] bg-[#f2f2f2] border-t-[1px] border-solid dark:border-[#929292]"
            >
              <th class="text-left py-3 px-4 flex items-center justify-center">
                Select
              </th>
              <th
                class="text-left py-3 px-4 border-x-[1px] border-solid dark:border-[#929292]"
              >
                Node
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Camera name
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Camera Id
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                IP Address
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Status
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Protocol
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Resolution
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Frame rate
              </th>
              <th class="text-left py-3 px-4">Bitrate</th>
            </tr>
          </thead>
          <tbody>
            {#if filteredCameraNames.length > 0}
              {#each filteredCameraNames as item, index}
                <tr
                  class={`${
                    index % 2 === 0
                      ? "dark:bg-[#333] bg-white cursor-pointer"
                      : "dark:bg-[#242424] bg-[#f2f2f2] cursor-pointer"
                  } ${
                    index === filteredCameraNames.length - 1
                      ? "border-b-[1px] border-solid dark:border-[#929292]"
                      : ""
                  } `}
                  on:click={() => {
                    if (detailIndex === index) {
                      detailIndex = null;
                    } else {
                      detailIndex = index;
                      addUserLog(
                        `user clicked on camera table row with camera name ${item[0].name}`,
                      );
                    }
                  }}
                >
                  <td
                    class="text-left py-3 px-4 h-full flex items-center justify-center cursor-pointer"
                  >
                    <input
                      checked={detailIndex === index}
                      class=" cursor-pointer"
                      type="checkbox"
                    />
                  </td>
                  <td
                    class="py-2 px-4 border-x-[1px] border-solid dark:border-[#929292]"
                  >
                    {newData[nodeIndex].name}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {#if modify && index === detailIndex}
                      <input
                        type="text"
                        name="node-name"
                        autoComplete="off"
                        placeholder={item?.name}
                        class="block border-0 px-1 py-1 text-gray-900
                    placeholder:text-gray-400
                      bg-transparent w-full
                      focus:border-b-2
                    focus:border-indigo-600
                    dark:text-[#979797] sm:text-sm sm:leading-6"
                        bind:value={newName}
                        on:input={(e) => {
                          newName = e.target.value;
                        }}
                      />
                    {:else}
                      {item[0].name}
                    {/if}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {item[0].id}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {item?.[0].url.split("@")[1].split(":")[0]}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    status
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {item?.[0].url.slice(0, 4)}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    Resolution
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    Frame rate
                  </td>
                  <td class="py-2 px-4">Bitrate</td>
                </tr>
              {/each}
            {:else if newData && newData?.[nodeIndex]?.camera?.length > 0}
              {#each newData?.[nodeIndex].cameraData as item, index}
                <tr
                  key={index}
                  class={`${
                    index % 2 === 0
                      ? "dark:bg-[#333] bg-white cursor-pointer"
                      : "dark:bg-[#242424] bg-[#f2f2f2] cursor-pointer"
                  } ${
                    index === newData?.[nodeIndex].camera.length - 1
                      ? "border-b-[1px] border-solid dark:border-[#929292]"
                      : ""
                  } 
              `}
                  on:click={() => {
                    if (detailIndex === index && !modify) {
                      detailIndex = null;
                    } else {
                      detailIndex = index;
                      addUserLog(
                        `user clicked on camera table row with camera name ${item[0].name}`,
                      );
                    }
                  }}
                >
                  <td
                    class="text-left py-3 px-4 h-full flex items-center justify-center"
                  >
                    <input
                      type="checkbox"
                      class="cursor-pointer"
                      checked={detailIndex === index}
                    />
                  </td>
                  <td
                    class="py-2 px-4 border-x-[1px] border-solid dark:border-[#929292]"
                  >
                    {newData[nodeIndex].name}
                  </td>

                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {#if modify && index === detailIndex}
                      <input
                        type="text"
                        name="node-name"
                        autoComplete="off"
                        placeholder={item[0]?.name}
                        class="block border-0 px-1 py-1 text-gray-900
                    placeholder:text-gray-400
                      bg-transparent w-full
                      focus:border-b-2
                    focus:border-indigo-600
                    dark:text-[#979797] sm:text-sm sm:leading-6"
                        bind:value={newName}
                        on:input={(e) => {
                          newName = e.target.value;
                        }}
                      />
                    {:else}
                      {item[0].name}
                    {/if}
                  </td>

                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                    >{item[0].id}</td
                  >
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                    >{item[0].url.split("@")[1]?.split(":")[0]}</td
                  >
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                    >Status</td
                  >
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {item?.[0].url.slice(0, 4)}</td
                  >
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                    >Resolution</td
                  >
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                    >Frame rate</td
                  >
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                    >Bitrate</td
                  >
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    {:else}
      <span class="px-6 text-sm dark:text-[#e0e0e0] mb-4">
        Select a node to get its camera details.
      </span>
    {/if}
  {/if}

  {#if selected === 2}
    <h2 class="px-6 font-medium mb-4" id="status">
      Camera Status{" "}
    </h2>
    <div
      class="h-[1px] w-[96%] dark:border-[#333] mb-8 border-[#e0e0e0] border-t border-solid"
    />
    {#if nodeIndex !== undefined && nodeIndex !== null}
      <div
        class="flex flex-col items-center max-w-[96%] mx-auto justify-center w-full dark:border-[#939393] border-solid border mb-20"
      >
        <div class="dark:bg-[#1e1f25] py-2 w-full px-6" />
        <table class="w-full bg-white] shadow-md rounded">
          <thead>
            <tr
              class="dark:bg-[#1a1a1a] bg-[#f2f2f2] border-t-[1px] border-solid dark:border-[#929292]"
            >
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Camera name
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Node
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Ip Address
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Connection Status
              </th>
              <th
                class="text-left py-3 px-4 border-r-[1px] border-solid dark:border-[#929292]"
              >
                Signal Strength
              </th>
              <th class="text-left py-3 px-4">Failures</th>
            </tr>
          </thead>
          <tbody>
            {#if newData}
              {#each newData?.[nodeIndex].cameraData as item, index}
                <tr
                  class={`${
                    index % 2 === 0
                      ? "dark:bg-[#333] bg-white cursor-pointer"
                      : "dark:bg-[#242424] bg-[#f2f2f2] cursor-pointer"
                  } ${
                    index === newData?.[nodeIndex].camera.length - 1
                      ? "border-b-[1px] border-solid dark:border-[#929292]"
                      : ""
                  }`}
                >
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {item[0]?.name}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {newData[nodeIndex].name}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    {item[0].url?.split("@")[1]?.split(":")[0]}
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    Status
                  </td>
                  <td
                    class="py-2 px-4 border-r-[1px] border-solid dark:border-[#929292]"
                  >
                    Strength
                  </td>
                  <td class="py-2 px-4">failures</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
        <div
          class=" dark:bg-[#1e1f25] bg-white px-6 w-full flex items-center justify-end py-4"
        />
      </div>
    {:else}
      <span class="px-6 text-sm dark:text-[#e0e0e0] mb-4">
        Select a node to get its camera details.
      </span>
    {/if}
  {/if}

  {#if selected === 3}
    <h2 class="px-6 font-medium mb-4" id="fail">
      Camera Failures{" "}
    </h2>
    <div
      class="h-[1px] w-[96%] dark:border-[#333] mb-8 border-[#e0e0e0] border-t border-solid"
    />
    <p class="px-6 text-sm dark:text-[#929292]">
      All details when camera was not working properly will be shown here.
    </p>
  {/if}

  <!-- {#if showNrvModal}
    <AddNvrModal {setShowNvrModal} sessionId={params.sessionId} />
  {/if} -->
</div>
