<script lan="ts">
  import { selectedNode } from "@/lib/stores";
  import { createEventDispatcher } from "svelte";

  export let selectedEvent;

  let event = selectedEvent;
  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch("close");
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-backdrop" on:click={closeModal}>
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <article
    class={`modal-content relative items-center gap-4 m-4 p-4 bg-background
            flex flex-col rounded-xl shadow-md text-base border hover:scale-[1.01] dark:shadow-slate-800 hover:shadow-lg
        `}
    on:click|stopPropagation
  >
    <button class="close-button" on:click={closeModal}>✖</button>
    <img
      class="object-cover w-24 h-24 rounded-md col-span-1"
      src={"data:image/jpeg;base64," + event.frameImage}
      alt="Team Member"
    />
    <div class="col-span-1 text-center flex flex-col items-center">
      <h3 class="text-base">
        {event.title}
      </h3>
      <p class="text-xs">
        Camera {$selectedNode.camera.filter((c) => c.id === event.camera)[0] &&
          $selectedNode.camera.filter((c) => c.id === event.camera)[0].name}
      </p>
      <p class="text-xs">
        {event.score}
      </p>
    </div>
    <div class="col-span-2 mx-auto">
      <p class="text-sm">
        {event.created.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
      <p class="text-sm">
        {event.created.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  </article>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    min-width: 200px;
    min-height: auto;
    position: relative;
    max-width: 500px;
    margin: auto;
    z-index: 1001;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: #333;
  }
</style>
