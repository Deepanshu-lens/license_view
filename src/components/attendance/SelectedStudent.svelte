<script lang="ts">
  import {
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    Filter,
    MessageCircleMore,
    PhoneCall,
    Search,
  } from "lucide-svelte";
  import { Button } from "../ui/button";
  import AttendanceCard from "../cards/AttendanceCard.svelte";
    import { Input } from "../ui/input";

  export let selectedStudent: any;
</script>

<section class="flex-col flex p-4 relative w-full">
  <div class="flex gap-8 pb-5">
    <Button on:click={() => selectedStudent.set(null)}
      variant="outline"
      class="rounded-full px-2 bg-[#F7F8F8] border border-[#DADADA] scale-90 mt-4"
    >
      <ChevronLeft size={20} />
    </Button>
    <div class="w-full flex justify-between relative">
        <div class="flex items-center gap-8 border-[#00000052] border-b pb-5 pr-4 flex-shrink-0">
            <div class="flex flex-col -space-y-[116.5px]">
        <img
          class="size-[130px] scale-[.80] rounded-md"
          src="/images/att2.png"
          alt="Student 1"
        />
        <img
          class="size-[130px] z-10 scale-[.90] rounded-md"
          src="/images/att1.png"
          alt="Student 2"
        />
        <img
          class=" size-[130px] z-20 rounded-md"
          src="/images/Attendance.png"
          alt="Student 3"
        />
        <!-- <a class="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 rounded-full border-2 border-white hover:bg-gray-600" href="#">+3</a> -->
      </div>
      <div class="flex flex-col mt-4 gap-2">
        <span class="flex items-center gap-3">
          <p class="font-semibold text-xl">Shreya Juneja</p>
          <Button class="text-[#015a62] bg-[#ECFDF3] scale-90">
            <PhoneCall size={20} />
          </Button>
          <Button class="text-[#015a62] bg-[#ECFDF3] scale-90">
            <MessageCircleMore size={20} />
          </Button>
        </span>
        <span class="flex items-center gap-5 mt-1">
          <span class="flex items-center gap-3">
            <p class="text-[#000000DE] font-medium text-sm">Adhaar Id</p>
            <p class="text-[#00000099]">234141</p>
          </span>
          <span class="flex items-center gap-3">
            <p class="text-[#000000DE] font-medium text-sm">Mobile Number</p>
            <p class="text-[#00000099]">9999999999</p>
          </span>
        </span>
        <span class="flex items-center gap-5">
          <span class="flex items-center gap-3">
            <p class="text-[#000000DE] font-medium text-sm">Floor</p>
            <p class="text-[#00000099]">1st Floor</p>
          </span>
          <span class="flex items-center gap-3">
            <p class="text-[#000000DE] font-medium text-sm">Shift Timings</p>
            <p class="text-[#00000099]">9 to 6</p>
          </span>
        </span>
        <span class="flex items-center gap-5">
          <p class="text-[#000000DE] font-medium text-sm">Email Address</p>
          <p class="text-[#00000099]">email@email.com</p>
        </span>
      </div>
    </div>

    <div class=" flex flex-col items-center gap-6 pr-5 absolute right-0 py-5">
<span class="flex items-center gap-4">
<span class="relative ">
    <CalendarDays size={20} class='absolute top-1/2 -translate-y-1/2 left-4'/>
    <Input class='w-[240px]'/>
    <ChevronDown size={20} class='absolute top-1/2 -translate-y-1/2 right-4'/>
</span>
    <Button class='flex items-center gap-1 text-sm'>
        <Filter size={20}/>
        Filter
    </Button>
</span>
<div class="grid grid-cols-2 grid-rows-4 gap-4 gap-x-10 isolate">
    <p class="text-[#00000099] font-medium ">Total Attendance</p>
<p class="text-[#00000099] font-medium ">Total Hours</p>
<p class="text-[#000000DE] text-lg font-semibold ">11 days</p>
<p class="text-[#000000DE] text-lg font-semibold ">87 Hours</p>
<p class="text-[#00000099] font-medium ">Avg. Check in</p>
<p class="text-[#00000099] font-medium ">Avg. Check out</p>
<p class="text-[#000000DE] text-lg font-semibold ">9:30 AM</p>
<p class="text-[#000000DE] text-lg font-semibold ">9:00 PM</p>
</div>
    </div>

    </div>

  </div>
  <span
    class="flex items-center h-[40px] px-1 border-black border-opacity-[18%] border-[1px] rounded-md w-max ml-16"
  >
    <span
      class="2xl:py-2 2xl:px-3 py-1 px-2 border-r border-black border-opacity-[18%] text-black text-sm flex items-center gap-2"
    >
      <span class="size-2 bg-[#4976F4] rounded-full flex-shrink-0" /> On Time
      <p>80%</p></span
    >
    <span
      class="2xl:py-2 2xl:px-3 py-1 px-2 border-r border-black border-opacity-[18%] text-black text-sm flex items-center gap-2"
    >
      <span class="size-2 bg-[#D28E3D] rounded-full flex-shrink-0" /> Late
      <p>10%</p></span
    >
    <span
      class="2xl:py-2 2xl:px-3 py-1 px-2 text-black text-sm flex items-center gap-2"
    >
      <span class="size-2 bg-[#C20D02] rounded-full flex-shrink-0" />Absent
      <p>10%</p></span
    >
  </span>

  <div class="mb-4 w-full pt-6 mx-16">
    <span class="flex items-center w-full gap-3">
      <p class="flex flex-shrink-0font-medium text-black">June 01-26, 2024</p>
      <span class="bg-[#00000052] w-[83%] h-[1px]" />
    </span>
  </div>
<div class="max-h-[calc(100vh-400px)] overflow-y-auto hide-scrollbar w-[95%] overflow-x-hidden">
    <div class="flex flex-wrap w-full mx-16 gap-x-20 gap-y-6 pb-2">
        {#each Array(15) as _, i}
        <AttendanceCard />
        {/each}
    </div>
</div>
</section>
