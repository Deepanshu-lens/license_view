<script lang='ts'>
	import { writable } from 'svelte/store';

  import {
    Expand,
    UsersRound,
    BellDot,
    School,
    Newspaper,
  } from "lucide-svelte";
  import { addUserLog } from "@/lib/addUserLog";
    import AttendancePanel from "@/components/attendance/AttendancePanel.svelte";
    import SelectedStudent from "@/components/attendance/SelectedStudent.svelte";
  let showFilters = false;
  let selectedStudent:any = writable(null);
  export let data;

  $:console.log(data.galleryItems)
</script>


<main class="flex w-full h-screen">
  {#if $selectedStudent === null}
<AttendancePanel {selectedStudent} galleryItems={data.galleryItems}/>{:else}
<SelectedStudent {selectedStudent}/>
{/if}
      <div
    class="flex flex-col gap-6 items-center justify-center px-2 h-[calc(100vh-76px)] ml-auto"
  >
   <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        disabled
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Expand class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Fullscreen
      </p>
    </span>
   <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        disabled
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><UsersRound class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Attendance
      </p>
    </span>
   <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        disabled
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><BellDot class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Alerts
      </p>
    </span>
   <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        disabled
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><School class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Students
      </p>
    </span>
   <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        disabled
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Newspaper class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Logs
      </p>
    </span>
   
  </div>
</main>