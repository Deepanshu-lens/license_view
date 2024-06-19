
<script>
    export let title,image,description;
</script>

<article class='bg-[#f8f8f8] border p-6 border-[#a3a3a3] border-opacity-5 rounded-lg h-[480px] w-[410px] relative overflow-clip'>
 <p class='  text-[#015A62] font-bold text-[19px] leading-[26px] tracking-[-0.2px]'>{title}</p>
 <p class=' text-[#001A1CCC] font-normal text-[14px] leading-[20px] w-3/4'>{description}</p>
<img src={image} alt={title} class='object-contain absolute bottom-0 left-8'/>
</article>