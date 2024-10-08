<script lang="ts">
  //imports
  import PocketBase from "pocketbase";
  import { page } from "$app/stores";
  import * as Dialog from "@/components/ui/dialog";
  import { toast } from "svelte-sonner";
  import { Button } from "@/components/ui/button";
    import { getContext } from "svelte";

  //props
  export let name: string;
  export let panelData: any;
  export let handleDelete: (panelId: string) => void;

  //states
  let dialogOpen: boolean = false;

  /**
   * Caution: Before making any changes to this function,
   * please make sure you understand the conditions below
   */

  const deletePanel = async () => {
    const PB: PocketBase = getContext("pb");

    if (panelData.expand.users && panelData.expand.users.length > 0) {
      await Promise.all(
        panelData.expand?.users?.map(async (item: any) => {
          // deleting user first associated to panel
          await PB.collection("atlas_users").delete(item.id);
        }),
      )
        .then(async () => {
          // deleting panel after users are deleted
          await PB.collection("atlas")
            .delete(panelData.id)
            .then(() => {})
            .catch((err) => {
              console.log(err, "error while deleting panel");
              toast.error("Failed to delete panel");
            });
        })
        .catch((err) => {
          console.log(err, "error while deleting users");
          toast.error("Failed to delete panel");
        })
        .finally(async () => {
          handleDelete(panelData.id);
          toast.success("Panel deleted successfully");
          dialogOpen = false;
        });
    } else {
      // If no users to delete, directly delete the panel
      await PB.collection("atlas")
        .delete(panelData.id)
        .then(() => {
          toast.success("Panel deleted successfully");
        })
        .catch((err) => {
          console.log(err, "error while deleting panel");
          toast.error("Failed to delete panel");
        })
        .finally(() => {
          handleDelete(panelData.id);
          dialogOpen = false;
        });
    }
  };
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[720px] z-[70] scale-90 sm:scale-100">
    <Dialog.Header>
      <Dialog.Title
        >Delete Panel : <span class="font-semibold text-primary capitalize"
          >{name}</span
        ></Dialog.Title
      >
    </Dialog.Header>
    <div class="grid grid-cols-2">
      <div class="col-span-2 dark:text-white text-black">
        Are you sure you would like to delete Panel : <span
          class="font-semibold text-primary capitalize">{name}</span
        >
      </div>
    </div>
    <Dialog.Footer>
      <span class="flex items-center gap-4">
        <Button
          on:click={() => {
            dialogOpen = false;
          }}
          variant="secondary">Cancel</Button
        >
        <Button on:click={deletePanel} variant="destructive">Delete</Button>
      </span>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
