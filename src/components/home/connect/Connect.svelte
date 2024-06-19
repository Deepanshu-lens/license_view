<script>
    import { Input } from "@/components/ui/input";
    import Footer from "../footer/Footer.svelte";

</script>
<section class="h-[60vh] bg-home-foot bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center gap-6">
    <h3 class="text-[52px] leading-[60px] font-bold text-white tracking-[-6%] text-center">
        Let's Connect and ExpandYour View
    </h3>
    <p class='text-[#bbbbbb] tracking-[-1%] texxt-base text-center'>
Celebrate the joy of accomplishment with an app designed to track your progress and motivate your efforts.
    </p>
    <span class="flex items-center gap-3">
        <Input placeholder='name@email.com' class="w-[300px] bg-white bg-opacity-20 px-4 py-2 text-sm rounded-lg border-none backdrop-blur-lg placeholder:text-white/[.5] text-white"/>
        <button class="bg-white text-primary rounded-lg px-4 py-2">
            Get access
        </button>
    </span>
</section>
<Footer/>
