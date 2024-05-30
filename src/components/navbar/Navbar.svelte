<script lang="ts">
  import type { User } from "@/types";
  import PocketBase from "pocketbase";
  import { page } from "$app/stores";
  import {
    User as UserIcon,
    LogOut,
    Radio,
    PlayCircle,
    Calendar,
    Image,
    SettingsIcon,
  } from "lucide-svelte";
  export let user: User;
  export let session;
  export let sessionId: string | undefined;
  import Separator from "../ui/separator/separator.svelte";
  import DarkModeSwitch from "../toggles/DarkModeSwitch.svelte";
  import { mode } from "mode-watcher";
  import { addUserLog } from "@/lib/addUserLog";
  import { onDestroy, onMount } from "svelte";

  const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

  const menuList = [
    {
      text: "Live",
      href: `/session/${sessionId}`,
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
    {
      text: "Reports",
      href: `/reports/${sessionId}`,
    },
    {
      text: "Atlas",
      href: `/atlas/${sessionId}`,
    },
  ];

  let frs = {
    text: "FRS",
    href: `/frs/${sessionId}`,
  };

  let anpr = {
    text: "ANPR",
    href: `/anpr/${sessionId}`,
  };

  let playback = { text: "Playback", href: `/playback/${sessionId}` };

  const menuListMob = [
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
      href: `/configuration/${sessionId}`,
    },
  ];

  let isOpen = false;

  function toggleOpen() {
    isOpen = !isOpen;
    addUserLog("user clicked on user icon");
  }

  const getSession = async () => {
    const updatedSession = await PB.collection("session").getFullList({
      filter: `id="${user.session}"`,
    });
    return updatedSession;
  };

  onMount(async () => {
    PB.collection("session").subscribe("*", async (e) => {
      const check = await getSession();
      session = check[0];
    });
  });

  onDestroy(() => {
    PB.collection("session").unsubscribe("*");
  });
</script>

<header class="sm:flex border sticky top-0 left-0 w-full z-20 h-[75px] hidden">
  <nav class="bg-background w-full flex flex-row items-center justify-center">
    <div class="flex w-full justify-between">
      <div
        class="cursor-pointer flex items-center gap-2 justify-center px-2"
      >
        <img
          src={$mode === "light" ? "/images/green.svg" : "/images/white.svg"}
          alt="logo"
          class="w-24"
        />
      </div>
      <div
        class={`flex flex-row items-center justify-center py-6 px-4 gap-14 `}
      >
        {#each menuList as item}
          {#key item}
            {#if item.text === "Live" || item.text === "Configuration"}
              <a
                href={item.href}
                on:click={() => {
                  addUserLog(`user clicked on navbar link "${item.text}"`);
                }}
              >
                <span
                  class={`${
                    $page.url.pathname === item.href.split("?")[0]
                      ? `text-primary font-bold text-lg cursor-pointer`
                      : " cursor-pointer"
                  }`}
                >
                  {item.text}
                </span>
              </a>
            {:else}
              <button disabled class="disabled:cursor-not-allowed">
                <span
                  class={`${
                    $page.url.pathname === item.href.split("?")[0]
                      ? `text-primary font-bold text-lg`
                      : ""
                  }`}
                >
                  {item.text}
                </span>
              </button>
            {/if}
          {/key}
        {/each}
        {#if session.frs}
          <!-- <a
            href={frs.href}
            on:click={() => {
              addUserLog(`user clicked on navbar link "${frs.text}"`);
            }}
          > -->
          <button disabled class="disabled:cursor-not-allowed">
            <span
              class={`${
                $page.url.pathname === frs.href.split("?")[0]
                  ? `text-primary font-bold text-lg`
                  : ""
              }`}
            >
              {frs.text}
            </span>
          </button>
        {/if}
        {#if session.playback}
          <a
            href={playback.href}
            on:click={() => {
              addUserLog(`user clicked on navbar link "${playback.text}"`);
            }}
          >
          <!-- <button class="disabled:cursor-not-allowed"> -->
            <span
              class={`${
                $page.url.pathname === playback.href.split("?")[0]
                  ? `text-primary font-bold text-lg`
                  : ""
              }`}
            >
              {playback.text}
            </span>
          <!-- </button> -->
          </a>
        {/if}
        {#if session.anpr}
          <a
            href={anpr.href}
            on:click={() => {
              addUserLog(`user clicked on navbar link "${anpr.text}"`);
            }}
          >
            <span
              class={`${
                $page.url.pathname === anpr.href.split("?")[0]
                  ? `text-primary font-bold text-lg`
                  : ""
              }`}
            >
              {anpr.text}
            </span>
          </a>
        {/if}
      </div>

      <div
        class="flex gap-2 pr-4
            items-center"
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- <span
          class="flex items-center justify-center gap-1.5 cursor-pointer hover:text-primary"
          on:click={() => {
            addUserLog(`user clicked on support on navbar`);
          }}
        >
          Support
        </span> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          on:click={() => {
            addUserLog("user switched theme mode");
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
                Name: {user?.name}
              </span>
              <span class="block text-sm font-medium capitalize">
                Role: {user?.role}
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

<header
  class="flex sm:hidden fixed bottom-0 left-0 w-full z-40 backdrop-blur-lg"
  id="navMobile"
>
  <nav
    class="bg-[white] dark:bg-[#1e1f25] flex flex-row items-center justify-between px-4 w-full pb-2 rounded-t-xl"
  >
    {#each menuListMob as menu}
      <div
        class={$page.url.pathname === menu.href.split("?")[0]
          ? "-mt-6"
          : "-mt-2"}
      >
        <a href={menu.href}>
          <div class={`flex flex-col justify-center items-center pt-[8px] `}>
            <span
              class={`${
                $page.url.pathname === menu.href.split("?")[0]
                  ? "bg-white p-2 rounded-full"
                  : "bg-transparent"
              } `}
            >
              {#if menu.text === "Live"}
                <Radio
                  class={` h-[40px] w-[40px] p-2 ${
                    $page.url.pathname === menu.href.split("?")[0]
                      ? "text-white  bg-gradient-to-tr from-[#015a62] to-[#01b4c5] rounded-full "
                      : "text-[#505050]"
                  }`}
                />
              {:else if menu.text === "Playback"}
                <PlayCircle
                  class={` h-[40px] w-[40px] p-2 ${
                    $page.url.pathname === menu.href.split("?")[0]
                      ? "text-white  bg-gradient-to-tr from-[#015a62] to-[#01b4c5] rounded-full "
                      : "text-[#505050]"
                  }`}
                />
              {:else if menu.text === "Events"}
                <Calendar
                  class={` h-[40px] w-[40px] p-2 ${
                    $page.url.pathname === menu.href.split("?")[0]
                      ? "text-white  bg-gradient-to-tr from-[#015a62] to-[#01b4c5] rounded-full "
                      : "text-[#505050]"
                  }`}
                />
              {:else if menu.text === "Gallery"}
                <Image
                  class={` h-[40px] w-[40px] p-2 ${
                    $page.url.pathname === menu.href.split("?")[0]
                      ? "text-white  bg-gradient-to-tr from-[#015a62] to-[#01b4c5] rounded-full "
                      : "text-[#505050]"
                  }`}
                />
              {:else}
                <SettingsIcon
                  class={` h-[40px] w-[40px] p-2 ${
                    $page.url.pathname === menu.href.split("?")[0]
                      ? "text-white  bg-gradient-to-tr from-[#015a62] to-[#01b4c5] rounded-full "
                      : "text-[#505050]"
                  }`}
                />
              {/if}
            </span>
            <span
              class={`text-[12px] font-medium ${
                $page.url.pathname === menu.href.split("?")[0]
                  ? "text-[#015a62]"
                  : "text-[#505050] dark:text-[rgba(255,255,255,.6)"
              }`}
            >
              {menu.text}
            </span>
          </div>
        </a>
      </div>
    {/each}
  </nav>
</header>
