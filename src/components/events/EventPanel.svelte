<script lang="ts">
  import { X, ListFilter, CalendarDays, Expand, Shrink } from "lucide-svelte";
  import { Calendar } from "@/components/ui/calendar";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { events, leftPaneHide } from "@/lib/stores";
  import InformativeEventCard from "../cards/InformativeEventCard.svelte";

  let eventFullscreen: boolean = false;
  let isDropDownOpen: boolean = false;
  let showCalendar: boolean = false;
  let count = writable(5);
  let value = null;
  let dates = [];
  let showMore = null;
  let searchDate = "";
  let queryDate = "";
  let matchingData = [];
  let MapData: any;

  onMount(() => {
    const today = new Date();
    for (let i = 0; i < 100; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const month = date.toLocaleString("en-US", { month: "long" });
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${month} ${day}, ${year}`;
      dates.push(formattedDate);
    }
    updateMapData();
  });

  $: showMore, updateMapData();
  $: data = $events;
  $: if (value) {
    searchDate = `${value.day}-${value.month}-${value.year}`;
    queryDate = `${value.month}-${value.day}-${value.year}`;
  }

  function updateMapData() {
    if (showMore) {
      MapData = [
        { title: dates?.[0], key: "t" },
        { title: dates?.[1], key: "t1" },
        { title: dates?.[2], key: "t2" },
        { title: dates?.[3], key: "t3" },
        { title: dates?.[4], key: "t4" },
        { title: dates?.[5], key: "t5" },
        { title: dates?.[6], key: "t6" },
        ...Array.from({ length: showMore - 7 }, (_, index) => ({
          title: dates[index + 7],
          key: `t${index + 7}`,
        })),
      ];
    } else {
      MapData = [
        { title: dates?.[0], key: "t" },
        { title: dates?.[1], key: "t1" },
        { title: dates?.[2], key: "t2" },
        { title: dates?.[3], key: "t3" },
        { title: dates?.[4], key: "t4" },
      ];
    }
  }

  function handleDateInput() {
    const formattedInput = new Date(searchDate);
    if (searchDate.length === 0) queryDate = "";
    if (!isNaN(formattedInput)) {
      const inputDate = formattedInput.toString().slice(0, 15);
      //   console.log(inputDate);
      if (inputDate.length > 0 && data) {
        const matchingEvents = [];
        for (const item of data) {
          const eventDate = item.created.toString().slice(0, 15);
          //   console.log(eventDate);
          if (inputDate === eventDate) {
            console.log("matching");
            queryDate = eventDate;
            matchingEvents.push(item);
          }
          matchingData = matchingEvents;
        }
      }
    }
  }

  // function handleEventFullscreen() {
  //   let screen = document.getElementById("scrollEle");
  //   screen?.requestFullscreen();
  //   eventFullscreen = true;
  // }

  // function handleExitFullscreen() {
  //   if (document.fullscreenElement) {
  //     document.exitFullscreen();
  //     eventFullscreen = false;
  //   }
  // }

  const handleEventFullscreen = () => {
    let cell = document.getElementById(`scrollEle`);
    cell?.requestFullscreen({ navigationUI: "show" });
    eventFullscreen = true;
  };

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      eventFullscreen = false;
    }
  };

  const onFullscreenChange = () => {
    if (!document.fullscreenElement) {
      console.log("Exited fullscreen mode");
      eventFullscreen = false;
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    }
  };

  $: {
    if (eventFullscreen) {
      document.addEventListener("fullscreenchange", onFullscreenChange);
    } else {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    }
  }
</script>

<section class="right flex-1">
  <div
    class="top w-full flex flex-row items-center justify-start gap-6 py-2 px-6 border-b-[1px] border-solid"
  >
    <div class="flex items-center justify-center gap-5">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="relative">
        <input
          id="search-input"
          type="text"
          class="bg-transparent border border-gray-300 text-gray-900 dark:text-white capitalize text-sm sm:text-[8px] md:text-[10px] lg:text-sm xl:text-md rounded-lg block px-10 py-2 box-border dark:focus:border-black dark:active:border-black w-[260px]"
          placeholder="Enter Date  DD MONTH YY"
          bind:value={searchDate}
          on:input={handleDateInput}
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          class="absolute top-1/2 -translate-y-1/2 left-[10px] text-[#4f4f4f] dark:text-white cursor-pointer scale-90 z-20"
          on:click={() => {
            // showCalendar = !showCalendar;
          }}
        >
          <CalendarDays />
        </span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          on:click={() => (searchDate = "")}
          class="absolute top-1/2 -translate-y-1/2 right-[10px] text-[#4f4f4f] dark:text-white cursor-pointer scale-75"
        >
          <X />
        </span>
        {#if showCalendar}
          <Calendar
            bind:value
            class=" bg-white dark:bg-black absolute top-14 z-40 px-4 py-2 flex flex-col items-center justify-center rounded-md border border-solid border-[#929292]"
          />
        {/if}
      </div>
    </div>
    <div class="relative">
      <button
        class="text-black dark:text-white flex gap-2 items-center cursor-pointer relative"
        on:click={() => {
          isDropDownOpen = !isDropDownOpen;
        }}
      >
        <ListFilter class="scale-90" />
        Filter
      </button>
      {#if isDropDownOpen}
        <div
          id="dropdownDefaultCheckbox"
          class="z-50 flex w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-[#242424] dark:divide-gray-600 absolute top-8 left-0"
        >
          <ul
            class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownCheckboxButton"
          >
            <li>
              <label
                for="checkbox-item-1"
                class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
              >
                <input id="checkbox-item-1" type="checkbox" class="w-4 h-4" />
                Object Detection
              </label>
            </li>
            <li>
              <label
                for="checkbox-item-2"
                class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
              >
                <input id="checkbox-item-2" type="checkbox" class="w-4 h-4" />
                Fire Detection
              </label>
            </li>
            <li>
              <label
                for="checkbox-item-3"
                class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
              >
                <input id="checkbox-item-3" type="checkbox" class="w-4 h-4" />
                24 hour feed
              </label>
            </li>
            <li>
              <label
                class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
              >
                <input id="checkbox-item-4" type="checkbox" class="w-4 h-4" />
                Action Detection
              </label>
            </li>
            <li>
              <label
                for="checkbox-item-5"
                class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
              >
                <input id="checkbox-item-5" type="checkbox" class="w-4 h-4" />
                All
              </label>
            </li>
          </ul>
        </div>
      {/if}
    </div>
    <div
      class="flex items-center justify-center text-[#4f4f4f] dark:text-white gap-6 ml-auto"
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        class="flex items-center justify-center gap-2 cursor-pointer"
        on:click={handleEventFullscreen}
      >
        <Expand class="scale-90" /> Fullscreen
      </span>
    </div>
  </div>
  <div class="bot w-full">
    {#if queryDate.length === 0}
      <div
        id="scrollEle"
        class={eventFullscreen
          ? "min-h-screen h-full flex items-start justify-start overflow-x-scroll overflow-y-scroll  relative"
          : `min-h-[calc(100vh-75px-62px)] h-[calc(100vh-75px-85px)] flex items-start ${$leftPaneHide ? "w-full" : "max-w-[calc(100vw-300px)]"} justify-start overflow-x-scroll overflow-y-clip  relative`}
      >
        {#if data?.message?.search("No") !== 0}
          {#each MapData as item}
            {@const itemDate = new Date(item.title)}

            {@const matchingDataItems = data?.filter((dateItem) => {
              const dataItemDate = dateItem.created;
              return (
                itemDate.getDate() === dataItemDate.getDate() &&
                itemDate.getMonth() === dataItemDate.getMonth() &&
                itemDate.getFullYear() === dataItemDate.getFullYear()
              );
            })}

            {@const filterAndMapItems = (items, startHour, endHour, period) => {
              return items
                ?.filter((item) => {
                  const date = item.created;
                  let hours = date.getHours();
                  const amPm = hours >= 12 ? "PM" : "AM";
                  if (period !== amPm) return false;
                  hours = hours % 12 || 12;
                  const start = parseInt(startHour, 10);
                  const end = parseInt(endHour, 10);
                  return hours >= start && hours <= end;
                })
                .map((filteredItem, index) => {
                  const rawDate = filteredItem.created;
                  const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  };
                  const timeOptions = {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  };
                  const formattedTime = rawDate.toLocaleTimeString(
                    "en-US",
                    timeOptions,
                  );
                  const formattedDate = rawDate.toLocaleDateString(
                    "en-US",
                    options,
                  );
                  const divContent = `<div key={${index}} class="flex scale-90 items-start gap-4 rounded-lg py-4 px-4 w-[375px] border-l-4 border-solid border-[#DE4B63] informative-shadow bg-white dark:bg-[#1b1b1b]">
                    <img alt='team member' src='data:image/png;base64,${filteredItem.frameImage}' class='object-contain rounded-md h-10 w-10 aspect-square'/>
                                        <div class="flex flex-col">
                                            <span class="font-bold text-[#222] dark:text-white">
                                                ${filteredItem.title}
                                            </span>
                                            <span class="font-bold text-[#0B8995]">${formattedDate}</span>
                                            <span class="font-medium text-[rgb(151,151,151)]">
                                            ${formattedTime}
                                            </span>
                                        </div>
                                        </div>`;
                  return divContent;
                })
                .join("");
            }}

            {@const morningAMItems = filterAndMapItems(
              matchingDataItems,
              "01",
              "03",
              "AM",
            )}
            {@const midAMItems = filterAndMapItems(
              matchingDataItems,
              "03",
              "07",
              "AM",
            )}
            {@const lateAMItems = filterAndMapItems(
              matchingDataItems,
              "08",
              "11",
              "AM",
            )}
            {@const morningPMItems = filterAndMapItems(
              matchingDataItems,
              "01",
              "03",
              "PM",
            )}

            {@const midPMItems = filterAndMapItems(
              matchingDataItems,
              "04",
              "07",
              "PM",
            )}
            {@const latePMItems = filterAndMapItems(
              matchingDataItems,
              "08",
              "11",
              "PM",
            )}

            <div
              class="min-w-[33%] h-full border border-solid border-[#f3f2fb] dark:border-[#242424] bg-white dark:bg-black"
            >
              <div
                class="flex-col flex items-start justify-start w-full relative h-full"
              >
                <span class="text-[#2c2c2c] dark:text-white font-bold pl-4">
                  {item.title}
                </span>
                <span
                  class="text-[#2c2c2c] dark:text-white flex items-start justify-evenly w-full h-full"
                >
                  <span
                    class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                  >
                    <span
                      class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                    >
                      00
                    </span>
                    <span
                      class={!eventFullscreen
                        ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#0f1118] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                        : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#0f1118] w-full h-screen relative"}
                    >
                      <div
                        class="flex flex-col absolute -my-20 scale-90 -top-[5rem] z-20"
                      >
                        {@html morningAMItems}
                      </div>
                    </span>
                  </span>
                  <span
                    class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                  >
                    <span
                      class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                    >
                      04
                    </span>
                    <span
                      class={!eventFullscreen
                        ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                        : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                    >
                      <div
                        class="flex col absolute -my-20 scale-90 -top-[5rem] z-20"
                      >
                        {@html midAMItems}
                      </div>
                    </span>
                  </span>
                  <span
                    class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                  >
                    <span
                      class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                    >
                      08
                    </span>
                    <span
                      class={!eventFullscreen
                        ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                        : "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-screen relative h-full"}
                    >
                      <div
                        class="flex flex-col absolute -my-20 scale-90 -top-[5rem] z-20"
                      >
                        {@html lateAMItems}
                      </div>
                    </span>
                  </span>
                  <span
                    class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                  >
                    <span
                      class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                    >
                      12
                    </span>
                    <span
                      class={!eventFullscreen
                        ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                        : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                    >
                      <div
                        class="flex flex-col absolute -my-20 scale-90 -top-[5rem] z-20"
                      >
                        {@html morningPMItems}
                      </div>
                    </span>
                  </span>
                  <span
                    class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                  >
                    <span
                      class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                    >
                      16
                    </span>
                    <span
                      class={!eventFullscreen
                        ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                        : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                    >
                      <div
                        class="flex flex-col absolute -my-20 scale-90 -top-[5rem] z-20"
                      >
                        {@html midPMItems}
                      </div>
                    </span>
                  </span>
                  <span
                    class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                  >
                    <span
                      class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                    >
                      20
                    </span>
                    <span
                      class={!eventFullscreen
                        ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                        : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                    >
                      <div
                        class="flex flex-col absolute -my-20 scale-90 -top-[5rem] z-20"
                      >
                        {@html latePMItems}
                      </div>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          {/each}
        {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          on:click={() => {
            showMore = showMore ? showMore + 2 : 7;
            count = count + 2;
          }}
          class="text-black dark:text-white fixed -right-5 -rotate-90 top-1/2 translate-y-1/2 cursor-pointer z-50"
        >
          Show more
        </span>
        {#if eventFullscreen}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <span on:click={handleExitFullscreen}>
            <Shrink
              class="fixed right-4 top-4 cursor-pointer text-black dark:text-white z-20  backdrop-blur-md bg-white dark:bg-black"
            />
          </span>
        {/if}
      </div>
    {:else}
      <div
        class={eventFullscreen
          ? "h-screen flex items-start justify-start overflow-x-scroll overflow-y-scroll  relative"
          : "min-h-[calc(100vh-75px-55px)] h-full flex items-start justify-start overflow-x-scroll overflow-y-clip  relative min-w-full"}
      >
        <div
          class="w-full h-full border border-solid border-[#f3f2fb] dark:border-[#242424]"
        >
          <div
            class="flex-col flex items-start justify-start w-full relative h-full"
          >
            <span class="text-[#2c2c2c] dark:text-white font-bold pl-4">
              {new Date(queryDate).toString().slice(0, 15)}
            </span>
            <span
              class="text-[#2c2c2c] dark:text-white flex items-start justify-evenly w-full h-full max-h-[calc(100vh-156px)] overflow-y-scroll"
            >
              <span
                class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
              >
                <span
                  class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                >
                  00
                </span>
                <span
                  class={!eventFullscreen
                    ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#0f1118] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                    : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#0f1118] w-full min-h-screen h-full relative"}
                >
                  <div class=" absolute top-[5rem] z-20 scale-90 -my-10">
                    {#if matchingData}
                      {#each matchingData as e, i}
                        {@const originalDate = e.created}
                        {@const hours = originalDate.getHours()}
                        {@const ampm = hours >= 12 ? "PM" : "AM"}
                        {@const formattedHours = hours % 12 || 12}
                        {#if ampm === "AM" && (formattedHours === 12 || formattedHours === 1 || formattedHours === 2 || formattedHours === 3)}
                          <InformativeEventCard data={e} />
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </span>
              </span>
              <span
                class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
              >
                <span
                  class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                >
                  04
                </span>
                <span
                  class={!eventFullscreen
                    ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                    : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-screen h-full relative"}
                >
                  <div class=" absolute -top-[5rem] z-20 scale-90 -my-10">
                    {#if matchingData}
                      {#each matchingData as e, i}
                        {@const originalDate = e.created}
                        {@const hours = originalDate.getHours()}
                        {@const ampm = hours >= 12 ? "PM" : "AM"}
                        {@const formattedHours = hours % 12 || 12}
                        {#if ampm === "AM" && (formattedHours === 4 || formattedHours === 5 || formattedHours === 6 || formattedHours === 7)}
                          <InformativeEventCard data={e} />
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </span>
              </span>
              <span
                class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
              >
                <span
                  class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                >
                  08
                </span>
                <span
                  class={!eventFullscreen
                    ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                    : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-screen h-full relative"}
                >
                  <div class=" absolute -top-[5rem] z-20 scale-90 -my-10">
                    {#if matchingData}
                      {#each matchingData as e, i}
                        {@const originalDate = e.created}
                        {@const hours = originalDate.getHours()}
                        {@const ampm = hours >= 12 ? "PM" : "AM"}
                        {@const formattedHours = hours % 12 || 12}
                        {#if ampm === "AM" && (formattedHours === 8 || formattedHours === 9 || formattedHours === 10 || formattedHours === 11)}
                          <InformativeEventCard data={e} />
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </span>
              </span>
              <span
                class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
              >
                <span
                  class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                >
                  12
                </span>
                <span
                  class={!eventFullscreen
                    ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                    : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-screen h-full relative"}
                >
                  <div class=" absolute -top-[5rem] z-20 scale-90 -my-10">
                    {#if matchingData}
                      {#each matchingData as e, i}
                        {@const originalDate = e.created}
                        {@const hours = originalDate.getHours()}
                        {@const ampm = hours >= 12 ? "PM" : "AM"}
                        {@const formattedHours = hours % 12 || 12}
                        {#if ampm === "PM" && (formattedHours === 12 || formattedHours === 1 || formattedHours === 2 || formattedHours === 3)}
                          <InformativeEventCard data={e} />
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </span>
              </span>
              <span
                class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
              >
                <span
                  class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                >
                  16
                </span>
                <span
                  class={!eventFullscreen
                    ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                    : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-screen h-full relative"}
                >
                  <div class=" absolute -top-[5rem] z-20 scale-90 -my-10">
                    {#if matchingData}
                      {#each matchingData as e, i}
                        {@const originalDate = e.created}
                        {@const hours = originalDate.getHours()}
                        {@const ampm = hours >= 12 ? "PM" : "AM"}
                        {@const formattedHours = hours % 12 || 12}
                        {#if ampm === "PM" && (formattedHours === 4 || formattedHours === 5 || formattedHours === 6 || formattedHours === 7)}
                          <InformativeEventCard data={e} />
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </span>
              </span>
              <span
                class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
              >
                <span
                  class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                >
                  20
                </span>
                <span
                  class={!eventFullscreen
                    ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                    : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#1b1b1b] w-full min-h-screen h-full relative"}
                >
                  <div class=" absolute -top-[5rem] z-20 scale-90 -my-10">
                    {#if matchingData}
                      {#each matchingData as e, i}
                        {@const originalDate = e.created}
                        {@const hours = originalDate.getHours()}
                        {@const ampm = hours >= 12 ? "PM" : "AM"}
                        {@const formattedHours = hours % 12 || 12}
                        {#if ampm === "PM" && (formattedHours === 8 || formattedHours === 9 || formattedHours === 10 || formattedHours === 11)}
                          <InformativeEventCard data={e} />
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>
