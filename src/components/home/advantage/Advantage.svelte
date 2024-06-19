<script>
    import AdvantageCard from './card/AdvantageCard.svelte';

    const advantageCardData = [ 
        {
        title: 'Anomaly/Fire Detection',
        description: 'Sets a new standard in fire detection, ensuring unmatched precision and reliability for enhanced safety and security.',
        image: '/images/home/advantage1.png'
    },
        {
        title: 'Abondoned Object Detection',
        description: 'Provides a proactive and vigilant surveillance solution.',
        image: '/images/home/advantage2.png'
    },
        {
        title: 'Violation Detection',
        description: 'Sets a new standard in fire detection, ensuring unmatched precision and reliability for enhanced safety and security.',
        image: '/images/home/advantage3.png'
    },
        {
        title: 'Weapon Detection',
        description: 'Sets a new standard in fire detection, ensuring unmatched precision and reliability for enhanced safety and security.',
        image: '/images/home/advantage4.png'
    },
        {
        title: 'Perimeter Intrusion',
        description: 'Sets a new standard in fire detection, ensuring unmatched precision and reliability for enhanced safety and security.',
        image: '/images/home/advantage5.png'
    },
        {
        title: 'PTZ based Object Tracking',
        description: 'Enhance your security with AI-powered features that help you make informed decisions.',
        image: '/images/home/advantage6.png'
    },
    ]
</script>
<section class="p-4">
    <h3 class="font-medium text-[60px] leading-[92px] z-50 tracking-[-3.6px] text-[#01181a] w-[70%] mx-auto text-center">
The AI Advantage in View
    </h3>
    <p class="text-lg text-[#01181a] text-opacity-70 text-center"> The various AI powered features for precise decisions</p>

    <div class="flex items-center flex-wrap gap-6 mx-auto justify-center py-10">
        {#each advantageCardData as card}
        <AdvantageCard {card}/>
        {/each
        }
    </div>
</section>