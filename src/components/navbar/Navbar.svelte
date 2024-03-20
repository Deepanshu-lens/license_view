<script lang="ts">
  import type { User } from "@/types";
  import { User as UserIcon, LogOut } from "lucide-svelte";
  export let user: User;
  export let sessionId: string | undefined;
  import { page } from "$app/stores";
  import Separator from "../ui/separator/separator.svelte";
  import DarkModeSwitch from "../toggles/DarkModeSwitch.svelte";
  import { mode } from "mode-watcher";
  import { alertPanelHide, topPanelHide } from "@/lib/stores";

  const menuList = [
    {
      text: "Live",
      href: `/session/${sessionId}`,
    },
    {
      text: "Playback",
      href: `/playback/${sessionId}`,
    },
    {
      text: "Events",
      href: `/events/${sessionId}`,
    },
    {
      text: "Gallery",
      href: `/gallery/${sessionId}`,
    },
    {
      text: "Configuration",
      href: `/configuration/${sessionId}?section=Remote`,
    },
  ];
  let isOpen = false;
  function toggleOpen() {
    isOpen = !isOpen;
    fetch("/api/userLogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "user clicked on user icon",
      }),
    }).catch((error) => console.error("Error:", error));
  }
</script>

<header class="flex border sticky top-0 left-0 w-full z-20 h-[75px]">
  <nav class="bg-background w-full flex flex-row items-center justify-center">
    <div class="flex w-full justify-between">
      <div
        class="cursor-pointer f-dull flex items-center gap-2 justify-center px-2"
      >
        <img
          src={$mode === "light"
            ? "/images/coreIp.jpg"
            : "/images/navCoreWhite.png"}
          alt="logo"
          class="w-24"
        />
        <Separator orientation="vertical" class="h-12" />
        <img
          src={$mode === "light" ? "/images/green.svg" : "/images/white.svg"}
          alt="logo"
          class="w-24"
        />
      </div>
      <div
        class={`flex flex-row items-center justify-center py-6 px-4  gap-14 `}
      >
        {#each menuList as item}
          <a
            href={item.href}
            on:click={() => {
              // console.log(item);
              fetch("/api/userLogs", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  event: `user clicked on navbar link "${item.text}"`,
                }),
              }).catch((error) => console.error("Error:", error));
            }}
          >
            <span
              class={`${
                $page.url.pathname === item.href.split("?")[0]
                  ? `text-primary font-bold text-lg`
                  : ""
              }`}
            >
              {item.text}
            </span>
          </a>
        {/each}
      </div>

      <div
        class="flex gap-2 pr-4
            items-center"
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          class="flex items-center justify-center gap-1.5 cursor-pointer hover:text-primary"
          on:click={() => {
            fetch("/api/userLogs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                event: `user clicked on support on navbar`,
              }),
            }).catch((error) => console.error("Error:", error));
          }}
        >
          Support
        </span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          on:click={() => {
            fetch("/api/userLogs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                event: "user switched theme mode",
              }),
            }).catch((error) => console.error("Error:", error));
          }}
        >
          <DarkModeSwitch />
        </span>
        {#if user}
          <button
            on:click={toggleOpen}
            class="cursor-pointer rounded-[50%] w-10 h-10 p-2 bg-[#015a62] flex items-center justify-center text-white"
          >
            <UserIcon size={18} />
          </button>
        {/if}
        {#if isOpen}
          <div
            class="
                  absolute border right-6 top-14 -mr-0.5 mt-3 w-60 origin-top-right divide-y divide-gray-100 rounded-lg bg-background text-sm font-normal shadow-md ring-1 ring-slate-900/5 focus:outline-none sm:-mr-3.5 transform opacity-100 scale-100 z-[200]"
          >
            <p class="truncate px-3.5 py-3 relative">
              <span class="block text-sm">
                {user?.name}
              </span>
              <span class="mt-0.5 font-semibold">{user?.email}</span>
            </p>
            <div
              class="
                    px-6
                    py-3
                    hover:bg-neutral-100
                    dark:hover:bg-gray-600
                    hover:cursor-pointer
                    transition
                    font-semibold
                    relative
                    z-[200]
                  "
            >
              <a href="/logout" class="flex flex-row gap-2 items-center">
                <LogOut size={18} />
                Sign Out
              </a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </nav>
</header>
