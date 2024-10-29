<script>
  // @ts-nocheck

  import { MessageSquareWarning, ShoppingCart, Star } from "lucide-svelte";
  import Checkbox from "@/components/ui/checkbox/checkbox.svelte";
  import Button from "../ui/button/button.svelte";
  import LicenseDetailsDialog from "./LicenseDetailsDialog.svelte";
  import {
    isLicenseDialogOpen,
    licenseCartArr,
    selectedLicense,
    selectedLicenseArr,
    step,
  } from "@/lib/stores";
  import { writable } from "svelte/store";
  import { cn } from "@/lib";
  import FreeTrialDialog from "./free-trial-dialog.svelte";
  const licenseArray = Array.from({ length: 6 });
  export let licenseFeatures;
  // handle license select
  const handleSelectLicense = (idx) => {
    // if license is already selected then removing it from arr
    if ($selectedLicenseArr.includes(idx)) {
      let arr = [...$selectedLicenseArr];
      arr = arr.filter((e) => e !== idx);
      selectedLicenseArr.set(arr);
    } else {
      selectedLicenseArr.set([...$selectedLicenseArr, idx]);
    }
  };

  // Add to Cart handler
  const handleAddTocart = (idx) => {
    if (!$licenseCartArr.includes(idx))
      licenseCartArr.set([...$licenseCartArr, idx]);
  };
</script>

<section>
  <div class="header">
    <h5 class="text-primary text-sm">STEP {$step} of 4</h5>
    <h3 class="text-2xl font-semibold mt-3">
      Let's help you select the licenses
    </h3>
  </div>
  <div
    class="main-licenses-container mt-8 grid grid-cols-3 gap-4 w-[80vw] mx-auto mb-20"
  >
    <!-- license array mapping -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#each licenseFeatures as license, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          isLicenseDialogOpen.set(true);
          selectedLicense.set(license);
        }}
        class={cn(
          "license-card h-80 w-96 p-3 card-shadow rounded-lg border border-gray-200 cursor-pointer",
          $selectedLicenseArr.includes(index)
            ? "bg-[#72727214]/10 border border-[#015A62]"
            : "",
        )}
      >
        <div class="card-header border-b">
          <div class="upper flex-cb">
            <div
              class="bg-[#11A8B6] text-white w-32 h-7 rounded-3xl flex items-center text-center px-1 text-sm"
            >
              <img
                src="/images/license-purchase/sparkles_light.png"
                alt="star"
                class="h-4 w-4 ml-1 mr-2"
              />
              Most Popular
            </div>
            <div class="flex-cb gap-x-2">
              Compare
              <input
                class="rounded-md"
                type="checkbox"
                on:click|stopPropagation
                on:change|stopPropagation={() => handleSelectLicense(index)}
                checked={$selectedLicenseArr.includes(index)}
              />
            </div>
          </div>

          <div class="lower flex-cb my-2">
            <h4
              class="text-xl font-semibold max-w-72 truncate"
              title={license?.licenseName || ""}
            >
              {license?.licenseName || ""}
            </h4>
            <div class="text-primary text-[14px] font-semibold">
              ${license?.licensePrice || ""}
            </div>
          </div>
        </div>

        <div class="main-container mt-4">
          <!-- feature list -->
          <div class="h-full">
            <ul
              class="text-gray-500 h-[9.5rem] overflow-y-auto overflow-x-hidden p-1"
            >
              {#each license?.features as feature}
                <li class="flex-cb mt-2">
                  <div class="flex items-center gap-x-2">
                    <img
                      src="/images/licenses/tick.png"
                      alt=""
                      class="h-5 w-5"
                    />
                    <span> {feature?.type} </span>
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      on:click|stopPropagation
                      checked={feature?.isSelected}
                    />
                  </div>
                </li>
              {/each}
            </ul>
          </div>

          <!-- know more and Add to Cart footer -->
          <div class="footer border-t flex-cb mt-2 pt-2 gap-x-2">
            <FreeTrialDialog>
              <Button
                variant="ghost"
                class="bg-neutral-100 text-primary flex-1"
                size="sm"
              >
                <img
                  src="/images/license-purchase/info.png"
                  alt=""
                  class="mr-2"
                />
                know more
              </Button>
            </FreeTrialDialog>

            <Button
              size="sm"
              class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-teal-800 flex-1"
              on:click={(e) => {
                e.stopPropagation();
                handleAddTocart(index);
              }}
            >
              <ShoppingCart size={14} class="mx-2" />
              Add to Cart</Button
            >
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
<LicenseDetailsDialog />

<style>
  .card-shadow {
    box-shadow: 0px 4px 15px 0px #0000000f;
  }
  /* For Firefox */
  ul {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }
</style>
