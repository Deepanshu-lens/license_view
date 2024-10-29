<script>
  import * as Tabs from "@/components/ui/tabs";
  import Button from "../ui/button/button.svelte";
  const licenseArray = Array.from({ length: 2 });
  const featureList = Array.from({ length: 12 });
  import { ShoppingCart, Plus } from "lucide-svelte";
</script>

<!-- main license card container -->
<main class="text-center mt-20 relative mb-10">
  <section>
    <!-- header page -->
    <div class="header">
      <h5 class="text-primary text-sm">STEP 1 of 4</h5>
      <h3 class="text-2xl font-semibold mt-3">Comparing License Page</h3>
    </div>

    <!-- compare container  -->
    <Tabs.Root value="monthly" class="mx-auto mt-3">
      <Tabs.List
        class="bg-white border border-gray-300 mt-5 p-1 sticky top-2 z-10  gap-x-3"
      >
        <Tabs.Trigger
          value="monthly"
          class="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
          >Monthly</Tabs.Trigger
        >
        <Tabs.Trigger
          value="annually"
          class="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
          >Annually</Tabs.Trigger
        >
        <Tabs.Trigger
          value="quarterly"
          class="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
          >Quarterly</Tabs.Trigger
        >
        <Tabs.Trigger
          value="perpetual"
          class="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
          >Perpetual</Tabs.Trigger
        >
      </Tabs.List>
      <Tabs.Content value="monthly">
        <!-- license comparing container -->

        <div
          class="license-compare-cards-container grid grid-cols-3 gap-x-3 w-[80%] mx-auto mt-10"
        >
          {#each licenseArray as _, index}
            <!-- license card -->
            <div
              class="card-shadow license-card p-3 px-5 rounded-md border border-gray-100"
            >
              <h3 class="font-medium text-lg text-left">Core VMS Features</h3>

              <!-- feature list -->
              <div
                class="feature-list-container mt-4 border-b border-b-gray-200 pb-5"
              >
                <ul class="text-gray-500">
                  {#each featureList as _, index}
                    <li class="flex-cb mt-2">
                      <div class="flex items-center gap-x-2">
                        <img
                          src="/images/licenses/tick.png"
                          alt=""
                          class="h-5 w-5"
                        />
                        <span> Feature {index + 1} </span>
                      </div>
                    </li>
                  {/each}
                </ul>
              </div>

              <!-- bottom container -->
              <div class="bottom-container">
                <div class="mt-4 text-primary text-xl font-semibold text-left">
                  $15.99/ <span class="text-xs text-teal-600 font-normal"
                    >month</span
                  >
                </div>

                <!-- know more and Add to Cart footer -->
                <div class="footer flex-cb mt-2 pt-2 gap-x-3">
                  <Button
                    variant="ghost"
                    class="bg-neutral-100 text-primary flex-1"
                    size="sm"
                  >
                    <Plus size={14} class="mr-2" />
                    Request Trial
                  </Button>

                  <Button
                    size="sm"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-teal-800 flex-1"
                  >
                    <ShoppingCart size={14} class="mx-2" />
                    Add to Cart</Button
                  >
                </div>
              </div>
            </div>
          {/each}

          <!-- Add License Package card -->
          <div
            class="add-license-package-card bg-neutral-100 flex items-center justify-center"
          >
            <h3 class="text-neutral-500 text-lg font-medium">
              + License Package
            </h3>
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content value="annually">annually.</Tabs.Content>
      <Tabs.Content value="quarterly">quarterly.</Tabs.Content>
      <Tabs.Content value="perpetual">perpetual.</Tabs.Content>
    </Tabs.Root>
  </section>
</main>

<style>
  .card-shadow {
    box-shadow: 0px 4px 15px 0px #0000000f;
  }
</style>
