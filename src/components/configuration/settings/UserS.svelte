<script lang="ts">
  import { Check, Pencil, X } from "lucide-svelte";
  import type { LoginEvent, User } from "@/types";
  import { toast } from "svelte-sonner";
  export let user: User;
  export let records: LoginEvent[];
  export let selected = 1;
  let showUpdateUsernameModal = false;
  let showUpdateEmailModal = false;
  let showUpdatePasswordModal = false;
  let username = "";

  function handleUsernameUpdate() {
    if (username.length > 0) {
      fetch("/api/user/updateUsername", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newName: username,
          sessionId: user.session,
        }),
      })
        .then((response) => {
          showUpdateUsernameModal = false;
          toast(`Username updated from ${user.name} to ${username}`);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Username too small!");
    }
  }

  function formatDateTime(dateTimeString: string) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", options);
  }
</script>

<div
  class="flex flex-col items-start mt-12 h-[calc(100vh-75px)] w-full text-black dark:text-white"
>
  <div
    class="flex w-full justify-start items-center gap-20 font-bold mb-4 px-8"
  >
    {#if selected === 1}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          User details
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => (selected = 1)}
      >
        User details
      </button>
    {/if}
    {#if selected === 2}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Premissions
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => (selected = 2)}
      >
        Premissions
      </button>
    {/if}
    {#if selected === 3}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white"> Policies </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => (selected = 3)}
      >
        Policies
      </button>
    {/if}
    {#if selected === 4}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          Login Events
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => (selected = 4)}
      >
        Login Events
      </button>
    {/if}
    {#if selected === 5}
      <div class=" relative">
        <span class="font-bold text-[#015A62] dark:text-white">
          {" "}
          Device Authorisation
        </span>
        <span
          class=" h-[3px] rounded-full bg-[#0B8995] w-full absolute left-0 -bottom-4"
        />
      </div>
    {:else}
      <button
        class="cursor-pointer text-[#212427] dark:text-[rgba(255,255,255,.6)] font-medium"
        on:click={() => (selected = 5)}
      >
        Device Authorisation
      </button>
    {/if}
  </div>
  {#if selected === 1}
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <h2 class="font-medium px-6 mb-4">User Account Settings</h2>
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <div class="px-6 pb-4 flex flex-col items-start justify-center gap-4">
      <span>User name</span>
      <div class="flex flex-row items-center justify-start gap-4">
        <input
          id="usernameInput"
          autoComplete="off"
          placeholder={user?.name}
          bind:value={username}
          type="text"
          class="py-4 w-[330px] pl-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
          disabled={!showUpdateUsernameModal}
        />

        {#if !showUpdateUsernameModal}
          <button
            class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[80px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            on:click={() => (showUpdateUsernameModal = true)}
          >
            Edit
            <Pencil />
          </button>
        {:else}
          <button
            class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[85px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            on:click={handleUsernameUpdate}
          >
            Save
            <Check />
          </button>
          <button
            on:click={() => (showUpdateUsernameModal = false)}
            class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[105px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
          >
            Discard
            <X />
          </button>
        {/if}
      </div>
      <form action="?/updateEmail" method="POST" class="gap-4 flex flex-col">
        <span>Email Id</span>
        <div class="flex flex-row items-center justify-start gap-4">
          <input
            id="email"
            autoComplete="off"
            type="email"
            name="email"
            required
            placeholder={user?.email}
            class="py-4 w-[330px] pl-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
            disabled={!showUpdateEmailModal}
          />
          {#if !showUpdateEmailModal}
            <button
              on:click={() => (showUpdateEmailModal = true)}
              class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[80px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            >
              Edit
              <Pencil />
            </button>
          {:else}
            <button
              type="submit"
              class="btn btn-primary text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[85px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7] disabled:cursor-not-allowed"
            >
              Save
              <Check />
            </button>
            <button
              on:click={() => (showUpdateEmailModal = false)}
              class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[105px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7] disabled:cursor-not-allowed"
            >
              Discard
              <X />
            </button>
          {/if}
        </div>
      </form>

      <form action="?/updatePass" method="POST" class="gap-4 flex flex-col">
        <span>Password</span>
        {#if !showUpdatePasswordModal}
          <div class="flex flex-row items-center justify-start gap-4">
            <input
              autoComplete="off"
              type="password"
              placeholder="**************"
              class="py-4 w-[330px] pl-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
              disabled={!showUpdatePasswordModal}
            />
            <button
              on:click={() => (showUpdatePasswordModal = true)}
              class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[80px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            >
              Edit
              <Pencil />
            </button>
          </div>
        {:else}
          <div class="flex flex-row items-center justify-start gap-4">
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Verified Email"
              class="py-4 w-[330px] pl-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
              disabled={!showUpdatePasswordModal}
            />
            <button
              class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[85px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            >
              Save
              <Check />
            </button>
            <button
              on:click={() => (showUpdatePasswordModal = false)}
              class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[105px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            >
              Discard
              <X />
            </button>
          </div>
        {/if}
      </form>
    </div>
  {/if}
  {#if selected === 2}
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <h2 class="font-medium px-6 mb-4">Premission Settings</h2>
  {/if}
  {#if selected === 3}
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <h2 class="font-medium px-6 mb-4">Policies</h2>
  {/if}
  {#if selected === 4}
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <h2 class="font-medium px-6 mb-4">Login Events</h2>
    {#if records}
      {#each records as item, index}
        <li class="flex items-center gap-4 px-6 pb-6">
          <h2>{index + 1} :</h2>
          <p>Login Time: {formatDateTime(item?.created)}</p>
        </li>
      {/each}
    {:else}
      <span class="px-6 text-sm">Loading...</span>
    {/if}
  {/if}
  {#if selected === 5}
    <div class="h-[1px] dark:bg-[#292929] w-[96%] mb-8 bg-[#e0e0e0]" />
    <h2 class="font-medium px-6 mb-4">Device Authorisation Settings</h2>
  {/if}
</div>
