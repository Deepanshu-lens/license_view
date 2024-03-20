<script lang="ts">
  import { page } from "$app/stores";
  import Stream from "./settings/Stream.svelte";
  import Camera from "./settings/Camera.svelte";
  import Recording from "./settings/Recording.svelte";
  import Remote from "./settings/Remote.svelte";
  import System from "./settings/System.svelte";
  import UserS from "./settings/UserS.svelte";
  let search: string | null = null;
  import type { LoginEvent, User } from "@/types";
  export let user: User;
  export let records: LoginEvent;

  $: {
    const searchParams = new URLSearchParams($page.url.search);
    search = searchParams.get("section");
    if (search === null) {
      searchParams.set("section", "Remote");
      history.replaceState(null, "", `${location.pathname}?${searchParams}`);
      search = "Remote";
    }
  }
</script>

<section class="right h-[calc(100vh-75px)] w-full flex-1 bg-background">
  {#if search === "Remote"}
    <Remote />
  {:else if search === "Stream"}
    <Stream />
  {:else if search === "Recording"}
    <Recording />
  {:else if search === "System"}
    <System />
  {:else if search === "Camera"}
    <Camera {user} />
  {:else}
    <UserS {user} {records} />
  {/if}
</section>
