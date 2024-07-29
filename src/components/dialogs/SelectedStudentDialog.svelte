<script lang="ts">

  let dialogOpen: boolean = false;
  import * as Dialog from "@/components/ui/dialog";

  export let images;
  export let name;
  export let email;
  export let department;


</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[80%] z-[70] scale-90 sm:scale-100">
    <Dialog.Header>
      <Dialog.Title> {name}</Dialog.Title>
      <Dialog.Description>
        Email: {email},  Department: {department}
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid grid-cols-4 gap-4 p-4">
      {#each images as image, index}
        <img
          src={"data:image/jpeg;base64," + image}
          alt={`Employee ${name} - Image ${index + 1}`}
          class="w-full h-auto rounded-md object-cover"
        />
      {/each}
    </div>

  </Dialog.Content>
</Dialog.Root>
