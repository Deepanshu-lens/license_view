<script lang="ts">
  import { User2Icon, ChevronUp, Edit3, Check, X } from "lucide-svelte";

  export let selected;
  export let text;
  export let userData;

  let showUpdateUsernameModal = false;
  let showUpdateEmailModal = false;
  let showUpdatePasswordModal = false;
  let data;
  let username;
  let oldPass;
  let password;
  let confirmPass;
  let email;
  let isEmailvalid;
  let loginEvents;
  let userEvents;

  console.log(userData);
</script>

<div
  class="flex flex-col justify-center w-[348px] px-[19px] py-[13px] border-b-[1px] border-solid border-[#e0e0e0] rounded-[8px] bg-white mb-20"
>
  <button class="flex flex-row items-center" on:click={() => (selected = "")}>
    <User2Icon class="text-[#015a62] mr-4 h-[30px] w-[30px]" />
    <span class="text-[#015a62]">{text}</span>
    <ChevronUp class="h-[30px] w-[30px] ml-auto text-[#015a62]" />
  </button>
  <p class="text-black font-medium text-sm py-2 my-2">User details</p>
  <div class="pb-4 flex flex-col items-start justify-start gap-4">
    <span class="text-[#505050] text-xs font-medium">User name</span>
    <div class="flex flex-col items-start justify-start gap-4">
      <input
        id="usernameInput"
        autoComplete="off"
        placeholder={userData.user?.name}
        type="text"
        class="py-4 w-[300px] px-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
        disabled={!showUpdateUsernameModal}
      />
      {#if !showUpdateUsernameModal}
        <button
          class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[80px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
        >
          Edit
          <Edit3 class="h-[20px] w-[20px]" />
        </button>
      {:else}
        <div class="flex items-center gap-4">
          <button
            class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[85px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
          >
            Save
            <Check class="scale-90" />
          </button>
          <button
            class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[105px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
          >
            Discard
            <X class="scale-90" />
          </button>
        </div>
      {/if}
    </div>

    <span class="text-[#505050] text-xs font-medium">Email Id</span>
    <div class="flex flex-col items-start justify-start gap-4">
      <input
        id="emailInput"
        autoComplete="off"
        type="email"
        placeholder={userData.user?.email}
        class="py-4 w-[300px] px-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
        disabled={!showUpdateEmailModal}
      />

      {#if !showUpdateEmailModal}
        <button
          class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[80px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
        >
          Edit
          <Edit3 class="h-[20px] w-[20px]" />
        </button>
      {:else}
        <div class="flex items-center gap-4">
          <button
            disabled={!isEmailValid}
            class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[85px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7] disabled:cursor-not-allowed"
          >
            Save
            <Check class="scale-90" />
          </button>
          <button
            class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[105px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7] disabled:cursor-not-allowed"
          >
            Discard
            <X class="scale-90" />
          </button>
        </div>
      {/if}
    </div>

    <span class="text-[#505050] text-xs font-medium">Password</span>

    {#if !showUpdatePasswordModal}
      <div class="flex flex-col items-start justify-start gap-4">
        <input
          autoComplete="off"
          type="password"
          placeholder="**************"
          class="py-4 w-[300px] pl-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
          disabled={!showUpdatePasswordModal}
        />
        <button
          class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[80px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
        >
          Edit
          <Edit3 class="h-[20px] w-[20px]" />
        </button>
      </div>
    {:else}
      <div class="flex flex-col justify-start gap-4">
        <input
          id="oldPassInput"
          autoComplete="off"
          type="password"
          placeholder="Old password"
          class="py-4 w-[300px] px-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
          disabled={!showUpdatePasswordModal}
        />
        <div class="flex flex-col items-start justify-start gap-4">
          <input
            autoComplete="off"
            type="password"
            placeholder="New password"
            class="py-4 w-[300px] px-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
            disabled={!showUpdatePasswordModal}
          />
          <input
            autoComplete="off"
            type="password"
            placeholder="Confirm password"
            class="py-4 w-[300px] px-3 rounded-md border-2 border-solid border-[#979797] focus:border-[#015a62] dark:focus:border-[#015a62] text-xs text-[#979797] dark:bg-[#2d2d2d] dark:border-[#333] dark:text-[#929292] disabled:cursor-not-allowed"
            disabled={!showUpdatePasswordModal}
          />
          <div class="flex items-center gap-4">
            <button
              class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[85px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            >
              Save
              <Check class="scale-90" />
            </button>
            <button
              class="text-sm font-medium dark:text-white/[.7] flex gap-2 items-center w-[105px] h-[35px] px-3 py-2 bg-black/[.08] hover:bg-black/[0.18] dark:bg-white/[0.08] dark:hover:bg-white/[0.18] border-[1px] border-solid border-[rgb(145,158,171)]/[.24] rounded-md text-black/[.7]"
            >
              Discard
              <X class="scale-90" />
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
  <p class="text-black font-medium text-sm py-2 mt-2">Roles</p>
  <p class="text-black font-medium text-sm py-2 mt-2">Permissions</p>
  <p class="text-black font-medium text-sm py-2 mt-2">Policies</p>
  <p class="text-black font-medium text-sm py-2 mt-2">General</p>
  <p class="text-black font-medium text-sm py-2 mt-2">Login events</p>
  <!-- {loginEvents ? (
  <EventList events={loginEvents} />
) : (
  <span class="px-2 text-sm">Fetching Login Events...</span>
)} -->
  <p class="text-black font-medium text-sm py-2 mt-2">Device autorization</p>
</div>
