<script>
    export let card;
</script>

<article class='bg-[#f8f8f8] border p-3 border-[#a3a3a3] border-opacity-5 rounded-lg h-[300px] w-[410px] relative overflow-clip flex flex-col gap-3'>

<h4 class='  text-[#015A62] font-bold text-[19px] leading-[20px] tracking-[-0.2px]'>
    {card.title}
</h4>
<p class=' text-[#001A1CCC] font-normal text-[14px] leading-[20px]' >{card.description}</p>
<img src={card.image} alt={card.title} class="object-contain h-[200px]">
</article>