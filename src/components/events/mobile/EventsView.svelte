<script lang="ts">
  import { events, selectedNode } from "@/lib/stores";
  import Calendar from "./../../ui/calendar/calendar.svelte";
  import {
    X,
    ChevronDown,
    Info,
    ListFilterIcon,
    CalendarRange,
    ChevronRight,
  } from "lucide-svelte";
  import MobEventsAlerts from "@/components/cards/mobile/MobEventsAlerts.svelte";
  import { onMount } from "svelte";
  import InfoDialog from "@/components/dialogs/mobile/InfoDialog.svelte";

  let showNvrModal: boolean = false;
  let value = null;
  let dates = [];
  let showMore = null;
  let showCalendar: boolean = false;
  let searchDate = "";
  let queryData = "";
  let matchingData = [];
  let newData;
  let MapData;
  let isFullscreen = false;
  export let data;

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
  $: showMore, updateMapData();
  $: newData = $events;
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
</script>

<section class="flex flex-col relative items-start w-full min-h-screen h-auto">
  <video
    autoPlay
    playsInline
    muted
    loop
    controls
    controlsList="nodownload"
    class={`aspect-video h-full w-full max-h-[200px] my-4 ${
      !isFullscreen ? "object-fill" : "object-contain"
    } `}
    id="playbackVid"
  >
    <source src="/video/welcome.mp4" type="video/mp4" />
  </video>

  <div class="top flex items-center justify-between px-4 w-full">
    <Info
      class="text-[#015a62] bg-[#e8e9ea] rounded-full h-[32px] w-[32px] p-1"
    />

    <InfoDialog {data}>
      <span
        class="flex items-center justify-center text-center ml-12 gap-1 relative text-[#505050]"
      >
        <p class="font-semibold text-sm">
          {`Node: ${$selectedNode?.name}`}
        </p>
        <ChevronDown class="h-[18px] w-[18px]" />
      </span>
    </InfoDialog>
    <span class="flex items-center gap-2 relative">
      {#if queryData}
        <button
          class="text-[#015a62] bg-[#e8e9ea] rounded-full h-[32px] w-[32px] p-1"
          on:click={() => {
            queryData = "";
            searchDate = "";
          }}
        >
          <X />
        </button>
      {/if}
      <button
        class="text-[#015a62] bg-[#e8e9ea] rounded-full h-[32px] w-[32px] p-1"
        on:click={() => (showCalendar = !showCalendar)}
      >
        <CalendarRange class="h-[24px] w-[24px]" />
      </button>
      {#if showCalendar}
        <Calendar
          bind:value
          class="absolute scale-[.85]  right-0 w-[300px] bg-white top-0 z-[999] px-4 py-2 flex flex-col items-center justify-center rounded-md dark:bg-[#333333] border border-solid border-[#929292] text-black dark:text-white"
        />
      {/if}
      <button
        on:click={() => {
          showMore = showMore ? showMore + 2 : 7;
        }}
      >
        <ChevronRight
          class="text-[#015a62] bg-[#e8e9ea] rounded-full h-[32px] w-[32px] p-1"
        />
      </button>
    </span>
  </div>

  <div class="w-full h-[calc(100vh-350px)] overflow-y-scroll">
    {#if queryData.length === 0}
      <div
        class="h-[100px] flex items-start justify-start overflow-x-scroll overflow-y-clip relative w-full my-4"
      >
        {#if newData?.message?.search("No") !== "0"}
          {#each MapData as item}
            {@const itemDate = new Date(item.title)}
            {@const matchingDataItems = newData.filter((dateItem) => {
              const dataItemDate = dateItem.created;
              return (
                itemDate.getDate() === dataItemDate.getDate() &&
                itemDate.getMonth() === dataItemDate.getMonth() &&
                itemDate.getFullYear() === dataItemDate.getFullYear()
              );
            })}
            {@const filterAndMapItems = (items, startHour, endHour, period) => {
              return items?.filter((item) => {
                const date = item.created;
                let hours = date.getHours();
                const amPm = hours >= 12 ? "PM" : "AM";
                if (period !== amPm) return false;
                hours = hours % 12;
                const start = parseInt(startHour, 10);
                const end = parseInt(endHour, 10);
                return hours >= start && hours <= end;
              }).length;
              // .map((filteredItem, index) => {
              //   const rawDate = filteredItem.created;
              //   const formattedTime = rawDate.toLocaleTimeString("en-US", {
              //     hour: "2-digit",
              //     minute: "2-digit",
              //     second: "2-digit",
              //   });
              //   const formattedDate = rawDate.toLocaleDateString("en-US", {
              //     year: "numeric",
              //     month: "long",
              //     day: "numeric",
              //   });
              //   const divContent = `<div key={${index}} class="flex scale-[.95] items-start gap-4 rounded-lg py-4 px-4 w-[50px] border-l-4 border-solid border-[#DE4B63] informative-shadow bg-white dark:bg-[#1b1b1b]">
              //       <img alt='team member' src='data:image/png;base64,${filteredItem.frameImage}' class='object-contain rounded-md h-12 w-12 aspect-square mt-1.5'/>
              //                           <div class="flex flex-col">
              //                               <span class="font-bold text-[#222] dark:text-white">
              //                                   ${filteredItem.title}
              //                               </span>
              //                               <span class="font-bold text-[#0B8995]">${formattedDate}</span>
              //                               <span class="font-medium text-[rgb(151,151,151)]">
              //                               ${formattedTime}
              //                               </span>
              //                           </div>
              //                           </div>`;
              //   return divContent;
              // })
              // .join("");
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
              class="min-w-[75%] h-full border border-solid border-[#f3f2fb] dark:border-[#242424]"
            >
              <div
                class="flex-col flex items-start justify-start w-full h-full"
              >
                <span
                  class="text-[#2c2c2c] dark:text-white font-bold mx-auto text-center text-sm"
                >
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
                      class={"bg-[rgba(1,90,98)]/[.08] dark:bg-[#0f1118] w-full relative h-full flex items-center justify-center"}
                    >
                      {@html morningAMItems
                        ? `<span class="rounded-full p-1 text-sm bg-[#20BF86] h-[30px] w-[30px] flex items-center justify-center text-white font-bold">${morningAMItems}</span>`
                        : ""}
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
                      class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full flex items-center justify-center"}
                    >
                      {@html midAMItems
                        ? `<span class="rounded-full p-1 text-sm bg-[#20BF86] h-[30px] w-[30px] flex items-center justify-center text-white font-bold">${midAMItems}</span>`
                        : ""}
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
                      class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full flex items-center justify-center"}
                    >
                      {@html lateAMItems
                        ? `<span class="rounded-full p-1 text-sm bg-[#20BF86] h-[30px] w-[30px] flex items-center justify-center text-white font-bold">${lateAMItems}</span>`
                        : ""}
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
                      class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full flex items-center justify-center"}
                    >
                      {@html morningPMItems
                        ? `<span class="rounded-full p-1 text-sm bg-[#20BF86] h-[30px] w-[30px] flex items-center justify-center text-white font-bold">${morningPMItems}</span>`
                        : ""}
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
                      class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full flex items-center justify-center"}
                    >
                      {@html midPMItems
                        ? `<span class="rounded-full p-1 text-sm bg-[#20BF86] h-[30px] w-[30px] flex items-center justify-center text-white font-bold">${midPMItems}</span>`
                        : ""}
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
                      class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full flex items-center justify-center"}
                    >
                      {@html latePMItems
                        ? `<span class="rounded-full p-1 text-sm bg-[#20BF86] h-[30px] w-[30px] flex items-center justify-center text-white font-bold">${latePMItems}</span>`
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {:else}
      <div
        class="h-[100px] w-full flex items-start justify-start relative my-4"
      >
        <div
          class="w-full h-full border border-solid border-[#f3f2fb] dark:border-[#242424]"
        >
          <div
            class="flex-col flex items-start justify-start w-full relative h-full"
          >
            <span
              class="text-[#2c2c2c] dark:text-white font-bold mx-auto text-center"
            >
              {queryData}
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
                  class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full"}
                ></span>
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
                  class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full"}
                ></span>
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
                  class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full"}
                ></span>
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
                  class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full"}
                ></span>
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
                  class={"bg-[#fff] dark:bg-[#1b1b1b] w-full relative h-full"}
                >
                  <div class=" absolute top-[5rem] z-20 scale-90 -my-10"></div>
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    {/if}

    <div class="flex items-center justify-between px-6 w-full">
      <span class="flex items-center gap-1.5 text-[#505050]">
        <span class="text-base font-semibold">Selected Camera</span>
        <ChevronRight />
      </span>
      <span class="flex items-center gap-1.5 text-sm font-semibold text-black">
        Time
        <ListFilterIcon class="h-[22px] w-[22px]" />
      </span>
    </div>
    <div class="px-6 flex-col flex items-start gap-4 my-4 pb-20 w-full">
      {#if newData}
        {#each newData as item}
          <MobEventsAlerts {item} />
        {/each}
      {/if}
    </div>
  </div>
</section>
