<script>
  import { page } from "$app/stores";
    import { selectedNode } from "@/lib/stores";
  import PocketBase from "pocketbase";
    import { onMount } from "svelte";

    export let NvrData;
    const PB = new PocketBase(`http://${$page.url.hostname}:5555`);

    console.log(NvrData)
    let enrichedNvrData = [];

    async function enrichNvrData() {
        
    }


    // onMount(async () => {
    //     await enrichNvrData();
    // });
</script>