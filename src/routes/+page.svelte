<script lang="ts">
  const logout = () => fetch("/logout");
</script>

<h1 class="text-3xl font-bold">Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<a href="/" on:click={logout}>logout</a>
