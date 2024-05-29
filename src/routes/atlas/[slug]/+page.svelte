<script>
    import AtlasPanel from '@/components/atlas/AtlasPanel.svelte';
    export let data;
</script>

<main
  class="flex items-start w-full overflow-y-hidden min-h-[calc(100vh-75px)]"
>
  <AtlasPanel
    {data}
  />
</main>
