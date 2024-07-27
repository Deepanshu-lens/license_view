<script lang="ts">
  import * as Card from "@/components/ui/card";
</script>

<Card.Root
  class="bg-[#f9f9f9]  dark:bg-[#333] w-[335px] h-[175px] attendance-cardshad "
>
  <Card.Content class=" h-full w-full flex flex-col p-3 relative">
    <span class='w-[3px] h-full rounded-l-lg absolute left-0 top-0 bg-[#4976F4]'/>
    <span class="flex items-center justify-between">
        <p class='text-[#4F4F4F] font-medium'>
            Wed, Jun 01, 2024
        </p>
        <span class='text-[#4976F4] bg-[#4976F4]/[.15] px-2 rounded-sm text-sm font-medium py-.5'>
On-time
        </span>
    </span>

    <span class="flex items-center gap-2.5 mt-8">
<img src="/images/Attendance.png" alt="photu" class='size-[50px] rounded-md'>
<span>
    <p class='text-[#00000099] font-medium text-sm'>
        Check In
    </p>
    <p class='text-black font-medium '>9:00 AM</p>
</span>
<img src="/images/Attendance.png" alt="photu" class='size-[50px] rounded-md'>
<span>
    <p class='text-[#00000099] font-medium text-sm'>
        Check Out
    </p>
    <p class='text-black font-medium '>9:00 AM</p></span>
<span>
    <p class='text-[#00000099] font-medium text-sm'>
        Total
    </p>
    <p class='text-black font-medium '>8hr</p></span>
    </span>

    <span class='w-full border-t mt-3 border-[#00000052]'>
        <p class='text-sm pt-2 text-[#00000099]'>
            Notes:
        </p>
    </span>
  </Card.Content>
</Card.Root>



<style>
    .shad{
        box-shadow: 0px 3.28px 5.33px 0px #00000017;
    }

</style>