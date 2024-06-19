<section class="bg overflow-clip">
  <h3
    class="font-medium text-[60px] leading-[92px] tracking-[-3.6px] text-[#01181a] w-[70%] mx-auto text-center"
  >
    Loved & Trusted
  </h3>
  <p class="text-lg text-[#01181a] text-opacity-70 text-center">
    Here's what pople are saying about us
  </p>

  <div class="relative py-10 w-full h-[600px]">
    <div
      class="flex items-center gap-10 pb-10 justify-center top-10"
    >
      {#each Array(3) as _, index}
        <img
          src="/images/home/Trust1.png"
          alt="trust"
          class="w-[520px] object-contain"
        />
      {/each}
    </div>
    <div class="flex items-center gap-10 pb-10 absolute bottom-4 -left-1/2 translate-x-1/2">

    {#each Array(3) as _, index}
    <img src="/images/home/Trust1.png" alt="trust" class="w-[510px] object-contain">
    {/each}


    </div>
  </div>
</section>

<style>
.bg {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.53) 7.5%, rgba(119, 212, 220, 0.1696) 57.83%, rgba(255, 255, 255, 0.53) 79%);
}
</style>
