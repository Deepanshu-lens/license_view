<script>
    import WhatCard from './card/WhatCard.svelte';

    const cardData = [ 
        {
        title: 'Get selected insights',
        description: 'Experience the power of AI-driven video analysis solutions in our cutting-edge Video Management Software.',
        image: '/images/home/card1.png'
    },
        {
        title: 'Advanced face Detection & Tracking',
        description: 'Experience the power of AI-driven video analysis solutions in our cutting-edge Video Management Software.',
        image: '/images/home/card2.png'
    },
        {
        title: 'Performance Optimization',
        description: 'Experience the power of AI-driven video analysis solutions in our cutting-edge Video Management Software.',
        image: '/images/home/card3.png'
    },
    ]
</script>
<section>
    <h3 class="text-[#01181A] text-[60px] leading-[92px] tracking-[-3px] text-center py-6">
        What can you do with View?
    </h3>
    <div class="relative bg-gradient-to-r from-[#015a62] via-[#027680] to-[#06d2e5] w-[85%] h-[80vh] rounded-xl mx-auto mb-14 p-6">
    <span class="flex flex-col w-1/4 gap-1">
        <span class='text-white text-lg tracking-[-0.2px] leading-[26px]'>Take a Bird's eye view</span>
        <span class='text-white/[.6] text-sm font-medium'>Experience the power of AI-driven video analysis solutions in our cutting-edge Video Management Software. Explore the features of our advanced video management platform.</span>
    </span>
    <img src="/images/home/what.png" alt="what" class="absolute right-0 bottom-0 h-[70%] object-contain"/>
    </div>
<div class='flex items-center gap-4 justify-center mb-20'>
    {#each cardData as card}
    <WhatCard title={card.title} image={card.image} description={card.description}/>
    {/each}
</div>
</section>