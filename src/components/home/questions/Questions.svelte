<script>
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion/index";
  import { Minus, Plus } from "lucide-svelte";
  let openItem = null;
  const data = [
    {
      question: "In what types of organizations can View be utilized?",
      answer:
        "View can be deployed in a variety of organizations to enhance physical security and business efficiency. It provides intelligent, human error-free monitoring and detection of hazardous objects, guns, and suspicious behavior. Additionally, it can improve business operations through AI-powered video analytics and comprehensive reports.",
    },
    {
      question: "What equipment is required to install and run View?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    },
    {
      question: "Are there specific types or models of cameras required for View to function?",
      answer:
        "Proin sed nisi felis. Donec viverra dolor consequat, facilisis dolor ac, rhoncus nisi. Ut posuere consectetur eros, at malesuada nisi aliquam non. Phasellus ut commodo sapien. Sed posuere pharetra pretium. Donec lobortis, magna id imperdiet varius, diam libero gravida neque, et rutrum odio nulla egestas odio.",
    },
    {
      question: "How does View handle data privacy and storage?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent efficitur elementum felis in suscipit. Nam ultrices, mi nec varius pulvinar, felis ipsum iaculis massa, sit amet feugiat turpis ligula in magna. Etiam tristique vestibulum libero, a pretium purus accumsan et.",
    },
  ];

</script>

<section class="p-4 relative pb-20">
  <h3
    class="font-medium text-[60px] leading-[92px] tracking-[-3.6px] text-[#01181a] w-[70%] mx-auto text-center"
  >
    Got Questions? We’ve All The Answers!
  </h3>
  <p class="text-lg text-[#01181a] text-opacity-70 text-center">
    Find quick solutions to your common queries.
  </p>

  <div class=" max-w-[85%] mx-auto py-10 flex]">
    <div class="flex flex-col gap-6 h-full w-full">
      {#each data as item, index}
        <Accordion type="single" collapsible key={index} >
          <AccordionItem
            value="item-1"
            class="border border-solid bg-[#f8f8f8] border-[#a3a3a3] border-opacity-10 rounded-lg py-2 px-4"
          >
            <AccordionTrigger
              class="text-primary text-xl font-medium text-start h-[83px]"
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent class="text-lg">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      {/each}
    </div>
  </div>
</section>
