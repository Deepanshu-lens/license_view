<script lang="ts">
  import { toast } from "svelte-sonner";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { selectedNode } from "@/lib/stores";
  import type { User } from "@/types";

  export let user: User;
  export let getNodeData;
  let nodeName = "";
  let dialogOpen = false;
  const onSubmit = () =>
    fetch("/api/node/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nodeName,
        sessionId: $selectedNode?.session
          ? $selectedNode.session
          : user.session,
      }),
    }).then((response) => {
      if (response.ok) {
        dialogOpen = false;
      }
      toast("Node added");
      getNodeData();
    });
</script>

<!-- markup (zero or more items) goes here -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[720px]">
    <Dialog.Header>
      <Dialog.Title>Add Node</Dialog.Title>
      <Dialog.Description>
        Add a new node to session: <span class="font-semibold"
          >{$selectedNode?.session ? $selectedNode.session : user.session}</span
        >
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="node-name">Name</Label>
        <Input
          id="node-name"
          placeholder={"Office"}
          class="col-span-3"
          required
          bind:nodeName
          on:change={(e) => (nodeName = e.target.value)}
        />
      </div>
    </div>

    <Dialog.Footer>
      <Button type="submit" on:click={onSubmit}>Add Node</Button>
    </Dialog.Footer></Dialog.Content
  >
</Dialog.Root>
