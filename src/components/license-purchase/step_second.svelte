<script>
  // @ts-nocheck

  import {
    ArrowDown,
    MoveRight,
    TicketPercent,
    ChevronsRight,
  } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import { step } from "@/lib/stores";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  export let userId;
  import licenseFeatures from "@/lib/licenseFeatures_V1.json";
  let licenseArray = writable([]);

  // handling cart checkout
  const handleCartCheckout = async () => {
    const url = `https://payment.lenscorp.cloud/lens-view`; // Replace with your API endpoint

    const data = {
      amount: subtotal,
      currency: "usd",
      userId: userId,
    };

    try {
      const response = await fetch(url, {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify(data), // Convert the data to a JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Parse the JSON response
      window.open(result?.url); // Open the link in a new tab
    } catch (error) {
      console.error("Error:", error);
    }
  };

  onMount(() => {
    getCartItems();
  });

  // getting cart items
  const getCartItems = async () => {
    const url = `https://license.lenscorp.cloud/getCart`;
    try {
      const response = await fetch(url, {
        method: "POST", // Specify the request method
        body: JSON.stringify({ user: userId }), // Convert the data to a JSON string
      });

      const result = await response.json(); // Parse the JSON response
      let addedFeatures = result?.features;

      // Extracting all feature IDs
      const allFeatureIds =
        result?.cartItems?.flatMap((item) => item.features) || [];

      // getting all those from json file which are added in cart
      const filteredFeatures = licenseFeatures.filter((license) =>
        allFeatureIds?.includes(license?.licenseId),
      );

      licenseArray.set(filteredFeatures); // setting this to license state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let subtotal;
  let discount = 0;
  let todayCharge;

  $: {
    subtotal = $licenseArray?.reduce((total, license) => {
      return total + license?.licensePrice;
    }, 0);
    todayCharge = subtotal - discount;
  }
</script>

<section>
  <!-- header -->
  <div class="header">
    <h5 class="text-primary text-sm">STEP {$step} of 4</h5>
    <h3 class="text-2xl font-semibold mt-3">
      Review your cart

      <!-- main section for cart-->
      <div class="main-review-cart-container mt-8 w-[70%] mx-auto mb-20">
        <div class="grid grid-cols-2 rounded-lg border">
          <!-- how your free trail container -->
          <div class="bg-neutral-100 px-5 py-3">
            <div>
              <img
                src="/images/license-purchase/sparkles.png"
                class="h-6 w-6"
                alt=""
              />
              <p
                class="text-neutral-500 text-left mt-2 text-sm max-w-80 font-normal ml-2"
              >
                You can try all the items in your cart for free! Just pick the
                best bundle and unlock access to all features today.
              </p>
            </div>

            <div class="mt-6 text-left">
              <h5 class="font-medium text-base">How your free trail works:</h5>
            </div>

            <div class="flex flex-col gap-y-2 mt-4">
              <div class="flex gap-x-2 items-start">
                <div>
                  <img
                    src="/images/license-purchase/bxs_lock-open.png"
                    alt=""
                    class="mr-2 mt-2 h-6 w-6"
                  />
                  <!-- dotted border div -->
                  <div
                    class="border-l-2 border-dotted border-l-gray-400 h-10 w-0 mt-2 ml-2"
                  ></div>
                </div>
                <div class="text-left">
                  <h5 class="text-lg font-medium">Today</h5>
                  <p class="text-primary text-xs font-normal max-w-72 mt-2">
                    Select the best suited bundle & unlock limited access to all
                    VIEW features.
                  </p>
                </div>
              </div>
              <div class="flex gap-x-2 items-start">
                <div>
                  <img
                    src="/images/license-purchase/bitcoin-icons_bell-filled.png"
                    alt=""
                    class="mr-2 mt-1 h-6 w-6"
                  />
                  <!-- dotted border div -->
                  <div
                    class="border-l-2 border-dotted border-l-gray-400 h-10 w-0 mt-2 ml-2"
                  ></div>
                </div>
                <div class="text-left">
                  <h5 class="text-lg font-medium">Day 12</h5>
                  <p class="text-primary text-xs font-normal max-w-72 mt-2">
                    Select the best suited bundle & unlock limited access to all
                    VIEW features.
                  </p>
                </div>
              </div>
              <div class="flex gap-x-2 items-start">
                <img
                  src="/images/license-purchase/typcn_tick.png"
                  alt=""
                  class="mr-2 mt-1 h-6 w-6"
                />
                <div class="text-left">
                  <h5 class="text-lg font-medium">Day 14</h5>
                  <p class="text-primary text-xs font-normal max-w-72 mt-2">
                    Select the best suited bundle & unlock limited access to all
                    VIEW features.
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-10">
              <Button
                size="lg"
                class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-teal-800 w-[20rem]"
              >
                <TicketPercent size={20} class="mr-2" />
                Request Free Trial</Button
              >
            </div>
          </div>
          <!-- order summary container -->
          <div class=" p-4">
            <h5 class="text-sm text-left text-neutral-500">Order Summary</h5>
            <ul class="mt-3 flex-col flex gap-y-3 border-b py-5">
              {#each $licenseArray as license}
                <li class="flex-cb">
                  <span class="flex items-center gap-x-2 text-sm font-medium">
                    {license?.licenseName}
                    <ArrowDown size={14} />
                  </span>
                  <span class="text-sm font-normal"
                    >${license?.licensePrice}</span
                  >
                </li>
              {/each}
            </ul>

            <!-- discount container -->
            <div class="pt-2 border-b pb-4">
              <div class="flex-cb items-start">
                <div class="text-sm font-medium">Add discount</div>
                <div>
                  <input
                    type="text"
                    placeholder="VIEW007"
                    class="border bg-neutral-100 placeholder:text-sm placeholder:font-normal w-32 h-8 p-3 text-sm"
                  />
                  <div
                    class="text-primary underline text-sm text-right mt-2 font-medium"
                  >
                    Apply now
                  </div>
                </div>
              </div>
            </div>

            <!-- subtotal container -->
            <div>
              <ul class="p-2 mt-6 flex-col flex gap-y-3 py-3">
                <li class="flex-cb">
                  <span class="flex items-center gap-x-2 text-sm font-medium"
                    >Subtotal</span
                  >
                  <span class="text-sm font-normal">${subtotal}</span>
                </li>
                <li class="flex-cb">
                  <span class="flex items-center gap-x-2 text-sm font-medium"
                    >discount</span
                  >
                  <span class="text-xs text-[#0B7D23]">-${discount}.00</span>
                </li>
                <li class="flex-cb">
                  <span class="flex items-center gap-x-2 text-sm font-medium"
                    >Today's charge</span
                  >
                  <span class="text-sm text-[#11A8B6] font-semibold"
                    >${todayCharge}</span
                  >
                </li>
              </ul>
            </div>

            <!-- checkout button container-->
            <div class="mt-[3.5rem]">
              <Button
                size="lg"
                variant="ghost"
                class="bg-transparent border-teal-800 border w-[20rem] text-primary"
                on:click={handleCartCheckout}
              >
                Start checkout
                <ChevronsRight size={20} class="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </h3>
  </div>
</section>
