<script lang="ts">
  import TopBar from "@/components/mobile/TopBar.svelte";
  import { PlusCircle } from "lucide-svelte";
</script>

<form method="POST" action="?/addNode" class="w-full h-screen bg-[#F5F6F7]">
  <TopBar displayIcons={false} />
  <img
    alt="add-vector"
    src="/images/addMobileVector.png"
    class="h-[200px] w-[220px] mx-auto"
  />
  <p
    class="text-[#0f1010] text-center font-semibold text-xl tracking-[.381px] mt-[20px]"
  >
    Add Node to get started!
  </p>
  <div class="flex flex-col items-center mt-[30px]">
    <p
      class="text-black font-medium tracking-[.234px] text-sm leading-[16.41px]"
    >
      Node name
    </p>
    <input
      type="text"
      name="name"
      required
      class="w-[255px] h-[38px] border-2 border-solid border-[#015a62] mt-[10px] rounded-[8px] text-black px-2"
    />
  </div>
  <button
    type="submit"
    class="flex gap-2 px-[120px] py-[15px] bg-[#015a62] text-white mt-[80px] rounded-[8px] justify-center items-center mx-auto"
  >
    <PlusCircle />
    Add Node
  </button>
</form>
