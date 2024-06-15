<script>
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  onMount(() => {
    if (browser) {
      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams.get("message");
      if (message) {
        toast.error(`${message} Please try again.`);
        setTimeout(() => {
          const newUrl = window.location.pathname;
          window.history.pushState({ path: newUrl }, "", newUrl);
        }, 2000);
      }
    }
  });
</script>

<div
  class="flex justify-center items-center w-full h-screen relative flex-col sm:flex-row overflow-hidden"
>
  <div
    class="left sm:w-1/2 w-full bg-forms-background dark:bg-dark-forms-background sm:h-screen h-2/3 bg-cover z-10"
  />
  <div class="right flex flex-col items-center justify-center w-full h-full sm:w-1/2 h-3/4 sm:h-screen bg-background rounded-tl-[100px] sm:rounded-none z-20 pt-[1rem] pb-[5rem] sm:pb-0 sm:pt-0 absolute bottom-5 sm:static">

  <form
    method="post"
    action="?/login"
  >
    <div
      class="form-cont flex flex-col h-full items-center justify-center gap-4 w-[350px] mx-auto scale-[.85] sm:scale-100 xl:scale-100 2xl:scale-125 lg:scale-90 md:scale-75"
    >
       <div
        class="flex items-center sm:justify-start sm:self-start gap-4 sm:-ml-4 pt-[2rem] sm:pt-0"
      >
        <img
          src={"/images/white.svg"}
          alt="logo"
          height={80}
          width={140}
          class="hidden dark:block"
        />
        <img
          src={"/images/green.svg"}
          alt="logo"
          height={80}
          width={140}
          class="block dark:hidden"
        />
      </div>

      <h2 class="font-semibold text-2xl sm:self-start text-[#212B36] font-mono">
        Login
      </h2>
      <p class="text-[#919EAB] text-sm sm:self-start">
        Login with registered email ID
      </p>

      <div class="mb-4 relative w-[350px] max-h-[40px]">
        <img
          alt="mail-line"
          src={"/assets/vms/mail-line.svg"}
          height={30}
          width={30}
          class="h-[20px] w-[20px] aspect-square absolute top-1/2 left-2 -translate-y-1/2 block dark:hidden"
        />
        <img
          alt="mail-line"
          src={"/assets/vms/mail-line2.svg"}
          height={30}
          width={30}
          class="h-[20px] w-[20px] aspect-square absolute top-1/2 left-2 -translate-y-1/2 dark:block hidden"
        />

        <input
          class={`appearance-none bg-transparent border-b border-b-[#919EAB] dark:border-b-[#919eab]/[.3] rounded w-full h-full py-4 pl-10 pr-3 font-semibold text-[#637381]  leading-tight focus:outline-none focus:shadow-outline`}
          autoComplete="off"
          id="email"
          type="email"
          placeholder="Email"
          name="email"
          required
        />
      </div>
      <div class="mb-4 relative w-[350px] max-h-[40px]">
        <img
          alt="mail-line"
          src={"/assets/vms/password-outline1.svg"}
          height={30}
          width={30}
          class="h-[20px] w-[20px] aspect-square absolute top-1/2 left-2 -translate-y-1/2 dark:block hidden"
        />
        <img
          alt="mail-line"
          src={"/assets/vms/password-outline2.svg"}
          height={30}
          width={30}
          class="h-[20px] w-[20px] aspect-square absolute top-1/2 left-2 -translate-y-1/2 block dark:hidden"
        />

        <input
          class={`appearance-none bg-transparent border-b border-b-[#919EAB] dark:border-b-[#919eab]/[.3] rounded w-full h-full py-4 pl-10 pr-3 font-semibold text-[#637381]  leading-tight focus:outline-none focus:shadow-outline`}
          autoComplete="off"
          id="password"
          type="password"
          placeholder="******************"
          name="password"
        />
      </div>
      <div
        class="flex flex-col items-center justify-between mt-2 mb-10 sm:mb-0"
      >
        <button
          class="bg-[#015A62] hover:bg-[#015A62]/[.4] text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
        <a
          href="/register"
          class="inline-block cursor-pointer align-baseline font-bold text-sm text-[#797c80] /[.7] mt-4"
        >
          Don't have an account yet?
          <span class="ml-1 text-primary font-semibold"> Sign up </span>
        </a>
      </div>
    </div>
  </form>

    <form action="?/oauth" method="POST">
    <p class="text-[#797c80]/[.7] mx-auto text-center my-4">or</p>
    <button type="submit" class="gsi-material-button">
  <div class="gsi-material-button-state"></div>
  <div class="gsi-material-button-content-wrapper">
    <div class="gsi-material-button-icon">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    </div>
    <span class="gsi-material-button-contents">Continue with Google</span>
    <span style="display: none;">Continue with Google</span>
  </div>
</button>
  </form>
  </div>

</div>

<!-- {#each Object.keys(providers) as provider}
  {#if providers[provider].authProviderState}
    <button on:click={() => gotoAuthProvider(provider)}
      >Login with {provider}</button
    >
  {/if}
{/each} -->
