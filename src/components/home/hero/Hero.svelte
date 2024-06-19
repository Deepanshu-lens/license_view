<script>
    import { Play } from "lucide-svelte";
    import Navbar from "../nav/Navbar.svelte";

</script>
<section class="h-screen w-full bg-home-hero2 bg-cover bg-no-repeat relative" id='homehero'>
    <Navbar/>
<div class="flex flex-col items-center justify-center pt-20 2xl:pt-40 gap-4 2xl:gap-9">
    <h1 class="font-medium text-[#01181a] text-[92px] 2xl:text-9xl 2xl:leading-[128px] leading-[92px] text-center tracking-[-3.5px] w-3/4 2xl:w-3/5">The Next-gen Video Management Software</h1>
    <p class="text-[#01181a] text-[18px] 2xl:text-[35px] 2xl:leading-[35px] leading-[35px] text-center w-3/5">Experience the power of AI-driven video analysis solutions in our cutting-edge Video Management Software. Explore the features of our advanced video management platform.</p>
    <span class="flex items-center gap-2 justify-center">

        <button class=' bg-primary text-white rounded-3xl px-5 py-2'>Take a Tour</button>
        <button class="flex items-center gap-2 border-2 border-primary px-5 py-2 rounded-3xl"><Play size={16} /> How it works</button>
    </span>
</div>
<img src="/images/home/heroimg.png" alt="" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] object-contain">
</section>