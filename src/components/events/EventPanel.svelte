<script lang="ts">
  import NodeSelection from "./../node/NodeSelection.svelte";
  import EventList from "./../lists/EventList.svelte";
  import {
    X,
    ListFilter,
    CalendarDays,
    Expand,
    Shrink,
    Filter,
    Search,
    ChevronRight,
    LucideCalendarDays,
    FilterIcon,
    Settings,
  } from "lucide-svelte";
  import { Calendar } from "@/components/ui/calendar";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { events } from "@/lib/stores";
  import InformativeEventCard from "../cards/InformativeEventCard.svelte";
  import { toast } from "svelte-sonner";
  import { addUserLog } from "@/lib/addUserLog";
  import EventGrid from "./EventGrid.svelte";

  export let data;
  const nodes = data.nodes;

  let eventFullscreen: boolean = false;
  let showCalendar: boolean = false;
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
    // console.log(value);
    const date = new Date(value.year, value.month - 1, value.day);

    // Convert to desired format
    let formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    searchDate = formattedDate;
    queryDate = formattedDate;
    formattedDate = null;
    handleDateInput();
    showCalendar = false;
    value = null;
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
      // console.log(inputDate);
      if (inputDate.length > 0 && data) {
        const matchingEvents = [];
        for (const item of data) {
          const eventDate = item.created.toString().slice(0, 15);
          //   console.log(eventDate);
          if (inputDate === eventDate) {
            queryDate = eventDate;
            matchingEvents.push(item);
          }
          matchingData = matchingEvents;
        }
      }
    }
  }

  const handleEventFullscreen = () => {
    console.log("clicked");
    let cell =
      queryDate?.length > 0
        ? document.getElementById(`zoomEle`)
        : document.getElementById(`scrollEle`);
    cell?.requestFullscreen();
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

  let showRightPanel: boolean = true;
  let showFilters: boolean = false;
</script>

<section class="right flex-1 flex h-screen w-full justify-between">
  <div class="w-full h-full px-4">
    <!-- <EventGrid /> -->
    <div class="bot w-full">
      {#if queryDate.length === 0}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          id="scrollEle"
          class={eventFullscreen
            ? "min-h-screen h-full flex items-start justify-start overflow-x-scroll overflow-y-clip relative"
            : `min-h-[calc(100vh-75px)] h-[calc(100vh-75px)] flex items-start ${!showRightPanel ? "w-full" : "max-w-[calc(100vw-300px)]"} justify-start overflow-x-scroll overflow-y-clip  relative`}
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

              {@const filterAndMapItems = (
                items,
                startHour,
                endHour,
                period,
              ) => {
                return items
                  ?.filter((item) => {
                    const date = item.created;
                    let hours = date.getHours();
                    const amPm = hours >= 12 ? "PM" : "AM";
                    if (period !== amPm) return false;
                    hours = hours % 12;
                    const start = parseInt(startHour, 10);
                    const end = parseInt(endHour, 10);
                    return hours >= start && hours <= end;
                  })
                  .map((filteredItem, index) => {
                    console.log(filteredItem, index);

                    const rawDate = filteredItem.created;
                    const formattedTime = rawDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                    const formattedDate = rawDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    const divContent = `<div key={${index}} class="flex scale-[.95] items-start gap-4 rounded-lg py-4 px-4 w-[255px] border-l-4 border-solid border-[#DE4B63] informative-shadow bg-white dark:bg-[#1b1b1b]">
                <img alt='team member' src='data:image/png;base64,${filteredItem.frameImage}' class='object-contain rounded-md h-12 w-12 aspect-square mt-1.5'/>
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
                "00",
                "03",
                "AM",
              )}
              {@const midAMItems = filterAndMapItems(
                matchingDataItems,
                "04",
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
                "00",
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
                  <div
                    class="text-[#2c2c2c] dark:text-white flex items-start justify-evenly w-full h-full"
                  >
                    <div
                      class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                    >
                      <span
                        class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                      >
                        00
                      </span>
                      <div
                        class={!eventFullscreen
                          ? "bg-[rgba(1,90,98)]/[.08] dark:bg-[#0f1118] w-full min-h-[calc(100vh-75px-55px)] relative h-full"
                          : "bg-[rgba(1,90,98)]/[.08] dark:bg-[#0f1118] w-full h-screen relative"}
                      >
                        <span
                          class="flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll max-h-[calc(100vh-75px)] hover:z-50 hover:backdrop-blur-xl"
                        >
                          {@html morningAMItems}
                        </span>
                      </div>
                    </div>
                    <div
                      class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                    >
                      <span
                        class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                      >
                        04
                      </span>
                      <div
                        class={!eventFullscreen
                          ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px)] relative h-full"
                          : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                      >
                        <span
                          class="flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll max-h-[calc(100vh-75px)] hover:z-50 hover:backdrop-blur-xl"
                        >
                          {@html midAMItems}
                        </span>
                      </div>
                    </div>
                    <div
                      class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                    >
                      <span
                        class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                      >
                        08
                      </span>
                      <div
                        class={!eventFullscreen
                          ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px)] relative h-full"
                          : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                      >
                        <span
                          class="flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll max-h-[calc(100vh-75px)] hover:z-50 hover:backdrop-blur-xl"
                        >
                          {@html lateAMItems}
                        </span>
                      </div>
                    </div>
                    <div
                      class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                    >
                      <span
                        class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                      >
                        12
                      </span>
                      <div
                        class={!eventFullscreen
                          ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px)] relative h-full"
                          : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                      >
                        <span
                          class="flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll max-h-[calc(100vh-75px)] hover:z-50 hover:backdrop-blur-xl"
                        >
                          {@html morningPMItems}
                        </span>
                      </div>
                    </div>
                    <div
                      class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                    >
                      <span
                        class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                      >
                        16
                      </span>
                      <div
                        class={!eventFullscreen
                          ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px)] relative h-full"
                          : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                      >
                        <span
                          class="flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll max-h-[calc(100vh-75px)] hover:z-50 hover:backdrop-blur-xl"
                        >
                          {@html midPMItems}
                        </span>
                      </div>
                    </div>
                    <div
                      class="flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full"
                    >
                      <span
                        class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                      >
                        20
                      </span>
                      <div
                        class={!eventFullscreen
                          ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px)] relative h-full"
                          : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-screen relative"}
                      >
                        <span
                          class="flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll max-h-[calc(100vh-75px)] hover:z-50 hover:backdrop-blur-xl"
                        >
                          {@html latePMItems}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/if}

          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <span
            on:click={() => {
              showMore = showMore ? showMore + 2 : 7;
            }}
            class={`text-black dark:text-white fixed ${showRightPanel ? ` ${eventFullscreen ? "-right-5" : "right-[20rem] 2xl:right-[20.75rem]"}` : ` ${eventFullscreen ? "-right-5" : "right-[2.8rem]"}'`} transition-position duration-700 ease-in-out -rotate-90 top-1/3 translate-y-1/3 cursor-pointer z-50 backdrop-blur-sm`}
          >
            Show more
          </span>
          {#if eventFullscreen}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span on:click={handleExitFullscreen}>
              <Shrink
                class="fixed right-4 top-4 cursor-pointer text-black dark:text-white z-20  backdrop-blur-md bg-white dark:bg-black"
              />
            </span>
          {/if}
        </div>
      {:else}
        <div
          id="zoomEle"
          class={eventFullscreen
            ? "h-screen flex items-start justify-start overflow-hidden relative bg-white dark:bg-black"
            : "min-h-[calc(100vh-75px-55px)] h-full flex items-start justify-start relative min-w-full bg-white dark:bg-black"}
        >
          {#if eventFullscreen}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span on:click={handleExitFullscreen}>
              <Shrink
                class="fixed right-4 top-4 cursor-pointer text-black dark:text-white z-20  backdrop-blur-md bg-white dark:bg-black"
              />
            </span>
          {/if}
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
                class="text-[#2c2c2c] dark:text-white flex items-start justify-evenly w-full h-full max-h-[calc(100vh-156px)]"
              >
                <span
                  class={`flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full ${eventFullscreen ? "min-h-[calc(100vh-25px)]" : "min-h-[calc(100vh-75px-55px)]"}`}
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
                    <div
                      class={`flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll ${eventFullscreen ? "max-h-[calc(100vh-25px)]" : "max-h-[calc(100vh-75px)]"} hover:z-50 hover:backdrop-blur-xl`}
                    >
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
                  class={`flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full ${eventFullscreen ? "min-h-[calc(100vh-25px)]" : "min-h-[calc(100vh-75px-55px)]"}`}
                >
                  <span
                    class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                  >
                    04
                  </span>
                  <span
                    class={!eventFullscreen
                      ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                      : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-full min-h-screen relative"}
                  >
                    <div
                      class={`flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll ${eventFullscreen ? "max-h-[calc(100vh-25px)]" : "max-h-[calc(100vh-75px)]"} hover:z-50 hover:backdrop-blur-xl`}
                    >
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
                  class={`flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full ${eventFullscreen ? "min-h-[calc(100vh-25px)]" : "min-h-[calc(100vh-75px-55px)]"}`}
                >
                  <span
                    class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                  >
                    08
                  </span>
                  <span
                    class={!eventFullscreen
                      ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                      : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-full min-h-screen relative"}
                  >
                    <div
                      class={`flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll ${eventFullscreen ? "max-h-[calc(100vh-25px)]" : "max-h-[calc(100vh-75px)]"} hover:z-50 hover:backdrop-blur-xl`}
                    >
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
                  class={`flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full ${eventFullscreen ? "min-h-[calc(100vh-25px)]" : "min-h-[calc(100vh-75px-55px)]"}`}
                >
                  <span
                    class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                  >
                    12
                  </span>
                  <span
                    class={!eventFullscreen
                      ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                      : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-full min-h-screen relative"}
                  >
                    <div
                      class={`flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll ${eventFullscreen ? "max-h-[calc(100vh-25px)]" : "max-h-[calc(100vh-75px)]"} hover:z-50 hover:backdrop-blur-xl`}
                    >
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
                  class={`flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full ${eventFullscreen ? "min-h-[calc(100vh-25px)]" : "min-h-[calc(100vh-75px-55px]"}`}
                >
                  <span
                    class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                  >
                    16
                  </span>
                  <span
                    class={!eventFullscreen
                      ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                      : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-full min-h-screen relative"}
                  >
                    <div
                      class={`flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll ${eventFullscreen ? "max-h-[calc(100vh-25px)]" : "max-h-[calc(100vh-75px)]"} hover:z-50 hover:backdrop-blur-xl`}
                    >
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
                  class={`flex flex-col items-start justify-start w-full border border-solid border-[#f3f2fb] dark:border-[#242424] h-full ${eventFullscreen ? "min-h-[calc(100vh-25px)]" : "min-h-[calc(100vh-75px-55px)]"}`}
                >
                  <span
                    class="flex w-full items-center justify-center border-b border-solid border-[#f3f2fb] dark:border-[#242424]"
                  >
                    20
                  </span>
                  <span
                    class={!eventFullscreen
                      ? "bg-[#fff] dark:bg-[#1b1b1b] w-full min-h-[calc(100vh-75px-55px-50px)] relative h-full"
                      : "bg-[#fff] dark:bg-[#1b1b1b] w-full h-full min-h-screen relative"}
                  >
                    <div
                      class={`flex flex-col absolute -my-20 scale-90 top-[5rem] z-20 overflow-scroll ${eventFullscreen ? "max-h-[calc(100vh-25px)]" : "max-h-[calc(100vh-75px)]"}  hover:z-50 hover:backdrop-blur-xl md:hover:-translate-x-40 2xl:hover:translate-x-0 ease-in duration-200`}
                    >
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
  </div>

  <div
    class={`relative h-[calc(100vh-75px)] ${showRightPanel ? "w-1/4 max-w-72 " : " w-0"} transition-width ease-in-out duration-500 dark:border-[#292929] border-x-[1px]`}
  >
    <button
      on:click={() => (showRightPanel = !showRightPanel)}
      class={`absolute -left-6 py-1 rounded-l-md bg-[#f9f9f9] dark:bg-slate-800  top-1/2 -translate-y-1/2 shadow-md transition-position ease-in-out duration-500 z-[99999]`}
    >
      <ChevronRight
        class={`${showRightPanel ? "rotate-0" : "rotate-180"} transition-transform ease-in-out duration-700`}
      />
    </button>
    <div
      class={`${showRightPanel ? "opacity-100" : "opacity-0"} transtion-opacity ease-in-out duration-500 `}
    >
      <NodeSelection
        {nodes}
        url={data.url ?? "/"}
        isAllFullScreen={eventFullscreen}
      />
      <div class="relative w-full p-1 bg-[#f9f9f9] dark:bg-[#333333]">
        <input
          id="search-input"
          type="text"
          class="bg-transparent text-[#020202] font-medium dark:text-white capitalize text-sm sm:text-[8px] md:text-[10px] lg:text-sm xl:text-md rounded-lg block px-10 py-2 box-border dark:focus:border-black dark:active:border-black w-full"
          placeholder="Enter Date  DD MONTH YY"
          bind:value={searchDate}
          on:input={handleDateInput}
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          class="absolute top-1/2 -translate-y-1/2 left-[10px] cursor-pointer z-20"
        >
          <LucideCalendarDays class="text-[#727272] h-4 w-4 dark:text-white" />
        </span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          class="absolute top-1/2 -translate-y-1/2 right-[10px] cursor-pointer scale-90"
        >
          <X class="text-[#727272] h-4 w-4 dark:text-white" />
        </span>
        {#if showCalendar}
          <Calendar
            bind:value
            class=" bg-white dark:bg-black absolute top-14 z-40 px-4 py-2 flex flex-col items-center justify-center rounded-md border border-solid border-[#929292]"
          />
        {/if}
      </div>
      <span
        class="text-black dark:text-white font-semibold text-base leading-tight w-[90%] mx-auto flex items-center justify-between py-4"
        >Live Events
        <span class="flex items-center gap-4"
          ><FilterIcon
            class="h-6 w-6 p-1 bg-[#f9f9f9] rounded-full text-[#727272] dark:bg-[#333] dark:text-white"
          />
          <Settings
            class="h-6 w-6 p-1 bg-[#f9f9f9] rounded-full text-[#727272] dark:bg-[#333] dark:text-white"
          /></span
        >
      </span>
      <EventList />
    </div>
  </div>
  <div
    class="flex flex-col gap-4 items-center justify-center px-2 h-[calc(100vh-76px)]"
  >
    <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        on:click={() => {
          addUserLog(`user clicked on Search button, top panel`);
        }}
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Search class="h-[22px] w-[22px]" /></button
      >
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Search
      </p>
    </span>
    <span
      class="group flex flex-col gap-0.5 items-center justify-center relative"
    >
      <button
        on:click={() => (showFilters = !showFilters)}
        class={!showFilters
          ? `text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md  border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center `
          : `relative border-none rounded-full shadow-md h-[40px] w-[40px] text-white bg-[#015a62] grid place-items-center dark:bg-[#258d9d]`}
        ><Filter class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Filter
      </p>
      {#if showFilters}
        <div
          id="dropdownDefaultCheckbox"
          class="z-20 flex w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-[#242424] dark:divide-gray-600 absolute right-14"
        >
          <ul
            class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownCheckboxButton"
          >
            <li>
              <label
                for="checkbox-item-1"
                class=" text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                <input
                  id="checkbox-item-1"
                  type="checkbox"
                  class="w-4 h-4 mr-2"
                />
                Object Detection
              </label>
            </li>
            <li>
              <label
                for="checkbox-item-2"
                class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                <input
                  id="checkbox-item-2"
                  type="checkbox"
                  class="w-4 h-4 mr-2"
                />
                Fire Detection
              </label>
            </li>
            <li>
              <label
                for="checkbox-item-3"
                class=" text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center"
              >
                <input
                  id="checkbox-item-3"
                  type="checkbox"
                  class="w-4 h-4 mr-2"
                />
                24 hour feed
              </label>
            </li>
            <li>
              <label
                class=" flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                <input
                  id="checkbox-item-4"
                  type="checkbox"
                  class="w-4 h-4 mr-2"
                />
                Action Detection
              </label>
            </li>
            <li>
              <label
                for="checkbox-item-5"
                class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                <input
                  id="checkbox-item-5"
                  type="checkbox"
                  class="w-4 h-4 mr-2"
                />
                All
              </label>
            </li>
          </ul>
        </div>
      {/if}
    </span>
    <span class="group flex flex-col gap-0.5 items-center justify-center">
      <button
        on:click={() => handleEventFullscreen()}
        class={`text-black/[.23] h-[40px] w-[40px] rounded-full shadow-md group border-2 border-solid border-black/[.23] dark:border-white/[.23] bg-white dark:bg-black dark:text-white group-hover:text-white group-hover:bg-[#015a62] dark:group-hover:bg-[#258d9d] group-hover:border-none grid place-items-center`}
        ><Expand class="h-[22px] w-[22px]" />
      </button>
      <p
        class="text-xs group-hover:text-[#015a62] dark:group-hover:text-[#258d9d] text-black/[.23] dark:text-white"
      >
        Fullscreen
      </p>
    </span>
  </div>
</section>

<!--  -->
