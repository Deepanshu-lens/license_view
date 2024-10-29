<script>
  // @ts-nocheck

  import CompareLicense from "@/components/license-purchase/compare-license.svelte";
  import StepFirst from "@/components/license-purchase/step_first.svelte";
  import StepFour from "@/components/license-purchase/step_four.svelte";
  import StepSecond from "@/components/license-purchase/step_second.svelte";
  import StepThree from "@/components/license-purchase/step_three.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import Checkbox from "@/components/ui/checkbox/checkbox.svelte";
  import { selectedLicenseArr, licenseCartArr, step } from "@/lib/stores";
  import licenseFeatures from "@/lib/licenseFeatures_V1.json";
  import {
    ArrowBigDown,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Bell,
    Check,
    Lock,
    MessageSquareWarning,
    MoveRight,
    Play,
    ShoppingCart,
    GitCompare,
  } from "lucide-svelte";
  import { writable } from "svelte/store";
  let isOffline = false;
  let isComparing = writable(false);

  // handling step increase
  const handleStepInc = () => {
    if ($step < 4) {
      step.set($step + 1);
    }
  };

  // handle step decrease
  const handleStepDec = () => {
    if ($step === 1) return;
    step.set($step - 1);
  };

  const handleCompare = () => {
    isComparing.set(true);
  };

  const handleAddToCart = () => {
    step.set($step + 1);
  };
</script>

{#if !$isComparing}
  <!-- main license card container -->
  <main class="text-center mt-10 relative max-h-full h-full overflow-y-auto">
    <!-- step 1 -->
    {#if $step === 1}
      <StepFirst {licenseFeatures} />

      <!-- step 2 -->
    {:else if $step === 2}
      <StepSecond />

      <!-- step 3 -->
    {:else if $step === 3}
      <StepThree />

      <!-- step 4 -->
    {:else}
      <StepFour {step} />
    {/if}

    <!-- view cart Button Container -->
    {#if $licenseCartArr?.length > 0 && $step === 1}
      <div class="view-cart-container fixed bottom-24 left-1/2">
        <Button
          class="bg-black hover:bg-gray-800 text-white rounded-3xl text-base flex justify-evenly gap-x-3 px-3 h-[3.2rem]"
          size="lg"
          on:click={handleAddToCart}
        >
          <ShoppingCart size={22} class="" />
          <div>
            <div>View Cart</div>
            <div class="text-xs text-neutral-300">
              {$licenseCartArr?.length} Bundle
            </div>
          </div>
          <div class="bg-white rounded-full p-1 ml-1">
            <MoveRight size={13} color="black" />
          </div>
        </Button>
      </div>
    {/if}

    <!-- footer section -->
    <footer class="fixed w-full bottom-0 border-none h-20 px-10">
      <!-- compare button container -->
      {#if $selectedLicenseArr?.length > 1}
        <div class="flex justify-end mt-2 pt-4">
          <Button
            size="sm"
            class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-800"
            on:click={handleCompare}
          >
            <GitCompare size={16} class="mr-2" />
            Compare Licenses</Button
          >
        </div>
      {:else}
        <!-- know more and add to cart footer -->
        {#if $step !== 1}
          <div class="footer flex-cb mt-2 pt-4">
            <Button
              variant="ghost"
              class="bg-neutral-100 text-primary"
              size="sm"
              on:click={handleStepDec}
            >
              <ArrowLeft size={14} class="mr-2" />
              Prev
            </Button>
          </div>
        {/if}
      {/if}
    </footer>
  </main>
{:else}
  <!-- comparing licenses -->
  <CompareLicense {handleStepDec} {handleStepInc} />
{/if}
