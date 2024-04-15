<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "@/components/ui/sonner";
  import { fade } from "svelte/transition";
  import { setContext } from "svelte";
  import Navbar from "@/components/navbar/Navbar.svelte";
  import LeftPane from "@/components/panes/LeftPane.svelte";
  import type { User } from "@/types.d.ts";
  import { cn } from "@/lib";

  export let data;
  const user = data.user as User;
  const session = data.session;
  const nodes = data.nodes;

  setContext("user", user);
</script>

<ModeWatcher />
<Toaster richColors />

{#if !user}
  <slot />
{:else}
  {#if !data.url.includes("login")}
    <Navbar {user} sessionId={session?.id} />
  {/if}
  {#if session && user}
    {#key data.url}
      <main
        class={cn(
          "flex items-start justify-between bg-background w-full overflow-y-hidden",
          data.url?.includes("login") ? "h-screen" : "max-h-[calc(100vh-76px)]",
        )}
      >
        <!-- {#if !data.url.includes("gallery") && !data.url?.includes("events") && !data.url?.includes("login") && !data.url?.includes("reports") && !data.url?.includes("session") && !data.url?.includes("playback")}
          <LeftPane
            {nodes}
            url={data.url ?? "/"}
            sessionId={session?.id ?? ""}
          />
        {/if} -->
        <div
          class={`
                right
                h-screen
                transition-all ease-in-out duration-500 ${data.url?.includes("login") ? "h-screen" : "max-h-[calc(100vh-76px)]"}
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
