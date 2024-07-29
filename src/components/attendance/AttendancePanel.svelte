<script lang="ts">
  import {
    Cctv,
    Plus,
    Search,
    SlidersHorizontal,
    TrendingUp,
    Upload,
  } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import { Input } from "../ui/input";
  import * as Select from "@/components/ui/select/index.js";
  import AttendanceDataTable from "./AttendanceDataTable.svelte";

  const fruits = [
    { value: "7", label: "Last 7 Days" },
    { value: "30", label: "Last 30 Days" },
    { value: "90", label: "Last 90 Days" },
    { value: "180", label: "Last 180 Days" },
  ];

   let attendanceOption = "option1";

  export let selectedStudent;
  export let galleryItems;
  // console.log(galleryItems)
</script>

<section
  class="flex flex-col gap-4 px-2 w-full h-[calc(100vh-75px)] overflow-y-auto hide-scrollbar pl-4 pt-6 pr-0"
>
  <div class="flex items-center w-full justify-between">
    <span class="flex flex-col gap-1">
      <p class="text-black font-medium text-xl">Attendance Management</p>
      <p class="text-black/[.7] text-sm flex items-center gap-2">
        Websocket module name <span
          class="px-2 py-1 rounded-sm bg-[#EEF5F0] text-[#589E67] flex items-center gap-2"
        >
          <span class="bg-[#589E67] size-2 rounded-full flex-shrink-0" /> Active</span
        >
      </p>
    </span>
    <span class="flex items-center gap-4">
      <span class="w-[400px] relative">
        <Search class="absolute left-2 top-1/2 -translate-y-1/2 size-5" />
        <Input
          class="w-full rounded-md border-black/[.6] pl-10"
          placeholder="search by name, Id, department"
        />
      </span>
      <Button class="flex items-center gap-1"><Plus /> Add User</Button>
      <Button class="flex items-center gap-1"><Upload /> Export</Button>
    </span>
  </div>

  <div class="h-[375px] grid grid-cols-8 grid-rows-4 gap-4 py-4 flex-shrink-0">
    <div
      class="col-span-2 row-span-2 rounded-lg card-shadow p-4 relative flex flex-col justify-around h-full"
    >
      <p class="text-[#202224] font-medium text-xl">Total Students</p>
      <p class="text-black text-4xl">{galleryItems.length}</p>
      <p class="text-[202224] text-base font-medium flex items-center gap-1">
        <TrendingUp class="size-4 text-[#00B69B]" />
        <span class="font-semibold text-[#00B69B]">2 new</span>
        students added!
      </p>
      <span
        class="absolute size-[50px] rounded-lg bg-[#605BFF]/[.2] text-[#605BFF] grid place-items-center top-8 right-4"
      >
        <Cctv class="size-8" />
      </span>
    </div>
    <div
      class="col-span-2 row-span-2 rounded-lg card-shadow p-4 relative flex flex-col justify-around h-full"
    >
      <p class="text-[#202224] font-medium text-xl">On Time</p>
      <p class="text-black text-4xl">362</p>
      <p class="text-[202224] text-base font-medium flex items-center gap-1">
        <TrendingUp class="size-4 text-[#00B69B]" />
        <span class="font-semibold text-[#00B69B]">-10% </span>
        less than yesterday
      </p>
      <span
        class="absolute size-[50px] rounded-lg bg-[#FEC53D]/[.2] text-[#FEC53D] grid place-items-center top-8 right-4"
      >
        <Cctv class="size-8" />
      </span>
    </div>
    <div class="col-span-4 row-span-4 rounded-md card-shadow p-4 flex-col flex">
      <span class="flex items-center justify-between">
        <p class="text-[#475569] font-semibold">Attendance Comparison Chart</p>
        <div class="flex items-center gap-3">
          <label class="flex items-center">
            <input
              type="radio"
              name="attendanceOption"
              value="option1"
              class="mr-2"
               bind:group={attendanceOption}
            />
            Daily
          </label>
          <label class="flex items-center">
            <input
              type="radio"
              name="attendanceOption"
              value="option2"
              class="mr-2"
               bind:group={attendanceOption}
            />
            Monthly
          </label>
          <label class="flex items-center">
            <input
              type="radio"
              name="attendanceOption"
              value="option3"
              class="mr-2" bind:group={attendanceOption}
            />
            Yearly
          </label>
          <SlidersHorizontal class="size-5" />
        </div>
      </span>
    </div>
    <div
      class="col-span-2 row-span-2 rounded-lg card-shadow p-4 relative flex flex-col justify-around h-full"
    >
      <p class="text-[#202224] font-medium text-xl">Late Arrival</p>
      <p class="text-black text-4xl">133</p>
      <p class="text-[202224] text-base font-medium flex items-center gap-1">
        <TrendingUp class="size-4 text-[#C20D02]" />
        <span class="font-semibold text-[#C20D02]">+2%</span>
        increase than yesterday
      </p>
      <span
        class="absolute size-[50px] rounded-lg bg-[#FE768A]/[.2] text-[#FE768A] grid place-items-center top-8 right-4"
      >
        <Cctv class="size-8" />
      </span>
    </div>
    <div
      class="col-span-2 row-span-2 rounded-lg card-shadow p-4 relative flex flex-col justify-around h-full"
    >
      <p class="text-[#202224] font-medium text-xl">Total Absent</p>
      <p class="text-black text-4xl">30</p>
      <p class="text-[202224] text-base font-medium flex items-center gap-1">
        <TrendingUp class="size-4 text-[#C20D02]" />
        <span class="font-semibold text-[#C20D02]">+2%</span>
        increase than yesterday
      </p>
      <span
        class="absolute size-[50px] rounded-lg bg-[#FF8F6B]/[.2] text-[#FF8F6B] grid place-items-center top-8 right-4"
      >
        <Cctv class="size-8" />
      </span>
    </div>
  </div>

  <div class="flex flex-col w-full">
    <span class="flex items-center gap-4 justify-between">
      <p class="text-[#475569] font-semibold">Attendance Overview</p>
      <div class="flex items-center gap-3">
        <Select.Root portal={null} >
          <Select.Trigger class="w-[180px]">
            <Select.Value placeholder={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each fruits as fruit}
                <Select.Item value={fruit.value} label={fruit.label}
                  >{fruit.label}</Select.Item
                >
              {/each}
            </Select.Group>
          </Select.Content>
          <Select.Input name="favoriteFruit" />
        </Select.Root>
        <Button class="flex items-center gap-2 "
          ><SlidersHorizontal class="size-5" /> Advance Filters</Button
        >
      </div>
    </span>
    <AttendanceDataTable {selectedStudent} {galleryItems}/>
  </div>
</section>

<style>
  .card-shadow {
    box-shadow: 0px 4px 12.6px 0px #00000021;
  }
</style>
