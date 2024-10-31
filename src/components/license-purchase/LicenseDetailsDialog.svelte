<script>
  // @ts-nocheck

  import * as Dialog from "@/components/ui/dialog/index";
  import * as Accordion from "@/components/ui/accordion/index";
  import { ChevronUp } from "lucide-svelte";
  import Checkbox from "../ui/checkbox/checkbox.svelte";
  import { isLicenseDialogOpen, selectedLicense } from "@/lib/stores";
  import Button from "../ui/button/button.svelte";
  import licenseFeatures from "@/lib/licenseFeatures_V1.json";
  $: console.log($selectedLicense, "selectedLicense");
</script>

<Dialog.Root bind:open={$isLicenseDialogOpen}>
  <Dialog.Content class="max-h-[70vh] overflow-y-auto max-w-[37vw]">
    <!-- Dialog Header -->
    <Dialog.Header class="border-b border-b-gray-300">
      <Dialog.Title class="text-2xl font-medium">
        <div class="card-header">
          <div class="upper flex-cb flex items-center">
            <div
              class="bg-[#11A8B6] text-white w-28 h-7 rounded-3xl flex items-center text-center px-1 text-[11px]"
            >
              <img
                src="/images/license-purchase/sparkles_light.png"
                alt="star"
                class="h-3.5 w-3.5 ml-1 mr-2"
              />
              Most Popular
            </div>
          </div>

          <div class="lower flex-cb my-2">
            <h4 class="text-xl font-semibold">
              {$selectedLicense?.licenseName || ""}
            </h4>
            <div class="text-primary text-lg font-semibold">
              ${$selectedLicense?.licensePrice || ""}
            </div>
          </div>
        </div></Dialog.Title
      >
    </Dialog.Header>

    <!-- Dialog body main -->
    {#each $selectedLicense?.features as feature}
      <!-- Accordion-1 Primary Bundle -->
      <Accordion.Root class="w-full bg-[#F4F4F49E] rounded-lg p-2">
        <!-- Accordion Item -->
        <Accordion.Item value="core-vms-feature" class="border-none">
          <!-- Accordion Trigger -->
          <Accordion.Trigger class="px-0.5 py-0 flex-none hover:no-underline">
            <div>
              <div>
                <div class="flex-cb w-[27rem]">
                  <div class="flex items-center gap-x-2">
                    <span class="text-base">{feature?.type || ""}</span>
                    <!-- <ChevronUp
                    class="h-4 w-4 transition-transform duration-200"
                  /> -->
                  </div>

                  <Checkbox
                    class="form-checkbox h-4 w-4 text-green-600 rounded border-gray-300 mt-5 mr-2"
                  />
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <div class="text-primary text-sm">
                    ${feature?.featurePrice || ""}/
                    <span class="text-xs">month</span>
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Trigger>

          <!-- Accordion Content -->
          <Accordion.Content class="border-t border-t-gray-200 m-2">
            <ul class="mt-4 space-y-2 text-gray-800">
              {#each feature?.subFeatures as subFeature, index}
                <li class="">
                  <div class="flex items-center space-x-2">
                    <img
                      src="/images/licenses/tick.png"
                      alt=""
                      class="h-5 w-5"
                    />
                    <div>
                      <p>Feature {index + 1}</p>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    {/each}
  </Dialog.Content>
</Dialog.Root>
