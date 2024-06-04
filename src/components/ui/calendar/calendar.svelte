<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import * as Calendar from ".";
  import { cn } from "@/lib";

  type $$Props = CalendarPrimitive.Props;

  type $$Events = CalendarPrimitive.Events;

  export let value: $$Props["value"] = undefined;
  export let placeholder: $$Props["placeholder"] = undefined;
  export let weekdayFormat: $$Props["weekdayFormat"] = "short";
  export let markedDates = [];
  export let selectedCamera;

  let className: $$Props["class"] = undefined;
  export { className as class };


  function isMarked(date) {
    const currentDate = new Date(date);
    const dayOfMonth = currentDate.getDate().toString();
    const month = (currentDate.getMonth() + 1).toString(); // JavaScript months are 0-indexed
    const year = currentDate.getFullYear().toString();

    return markedDates.some((d) => {
      return (
        d.dayOfMonth === dayOfMonth &&
        d.record === "true" &&
        d.month === month &&
        d.year === year
      );
    });
  }

//   async function handlePrevMonth(month: number, year: number) {
//     try {
//       const response = await fetch("/api/playbackCalendar", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           nvr_ip: selectedCamera.nvrData.ip,
//           http_port: selectedCamera.nvrData.http_port,
//           username: selectedCamera.nvrData.user_id,
//           password: selectedCamera.nvrData.password,
//           camera_id: selectedCamera.channelId,
//           month: month,
//           year: year,
//         }),
//       });

//       const data = await response.json();
//       data.forEach((day: { camera_id: string; dayOfMonth: string; record: string; month: string; year: string }) => {
//         markedDates.push({
//           camera_id: day.camera_id,
//           dayOfMonth: day.dayOfMonth,
//           record: day.record,
//           month: day.month,
//           year: day.year
//         });
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   function handleNextMonth() {}


</script>

<CalendarPrimitive.Root
  bind:value
  bind:placeholder
  {weekdayFormat}
  class={cn("p-2", className)}
  {...$$restProps}
  on:keydown
  let:months
  let:weekdays
>
  <Calendar.Header>
    <!-- <Calendar.PrevButton on:click={() => handlePrevMonth(months[0].value.month === 1 ? 12 :months[0].value.month-1, months[0].value.month === 1 ?  months[0].value.year-1 : months[0].value.year )}/> -->
    <Calendar.PrevButton />
		<Calendar.Heading />
		<Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Months>
    {#each months as month}
      <Calendar.Grid>
        <Calendar.GridHead>
          <Calendar.GridRow class="flex">
            {#each weekdays as weekday}
              <Calendar.HeadCell>
                {weekday.slice(0, 2)}
              </Calendar.HeadCell>
            {/each}
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody>
          {#each month.weeks as weekDates}
            <Calendar.GridRow class="mt-2 w-full">
              {#each weekDates as date}
                <Calendar.Cell {date} class='flex flex-col justify-center items-center'>
					{#if isMarked(date)}
					  <span class="red-dot"></span>
					  {/if}
					  <Calendar.Day {date} month={month.value} />
                </Calendar.Cell>
              {/each}
            </Calendar.GridRow>
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/each}
  </Calendar.Months>
</CalendarPrimitive.Root>

<style>
  .red-dot {
    width: 5px;
    height: 5px;
    background-color: red;
    border-radius: 50%;
    display: inline-block;
  }
</style>
