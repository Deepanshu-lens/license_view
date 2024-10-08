<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "@/components/ui/sonner";
  import { fade } from "svelte/transition";
  import { setContext } from "svelte";
  import Navbar from "@/components/navbar/Navbar.svelte";
  import type { User } from "@/types.d.ts";
  import { cn } from "@/lib";
  import { pb } from "@/lib/pocketbase";

  export let data;
  const user = data.user as User;
  const session = data.session;
  const nodes = data.nodes;

  setContext("user", user);
  setContext("pb", pb);

  // console.log(data.url)

</script>

<ModeWatcher defaultMode='light' />
<Toaster richColors />
{#if !user}
  <slot />
{:else}
  {#if !data.url.includes("login") && !data.url?.includes("register") && !data.url?.includes('fullscreen')}
    <Navbar {user} sessionId={session?.id} {session} />
  {/if}
  {#if session && user}
    {#key data.url}
      <main
        class={cn(
          "flex items-start justify-between bg-background w-full overflow-y-hidden hide-scrollbar",
          data.url?.includes("login") || data.url?.includes("register") || data.url?.includes('fullscreen')
            ? "h-screen"
            : "max-h-[calc(100vh-76px)]",
        )}
      >
        <div
          class={`
                right
                h-screen
                transition-all ease-in-out duration-500 ${data.url?.includes("login") || data.url?.includes('fullscreen') ? "h-screen" : "max-h-[calc(100vh-76px)]"}
                flex-1
                overflow-x-clip
                `}
          in:fade={{ delay: 600, duration: 300 }}
          out:fade={{ delay: 0, duration: 300 }}
        >
          <slot />
        </div>
      </main>
    {/key}
  {/if}
  <!-- </main> -->
{/if}
