<script>
  import { ChevronRight } from "lucide-svelte";
  import { step } from "@/lib/stores";

  // handling step increase
  const handleStepInc = () => {
    if ($step < 4) {
      step.set($step + 1);
    }
  };
</script>

<section>
  <div class="header mx-auto">
    <h5 class="text-primary text-sm">STEP {$step} of 4</h5>
    <h3 class="text-2xl font-semibold mt-3">Choose how to pay</h3>

    <p
      class="text-[#00000099] w-80 mx-auto mt-2 text-center text-[14px] font-medium"
    >
      Your payment is encrypted and you can change your payment method at
      anytime.
    </p>
  </div>

  <div class="main mt-10 w-full">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="flex-col flex gap-y-4 mx-auto w-[28rem]">
      <!-- svelte-ignore a11y-click-events-have-key-events -->

      <div
        on:click={handleStepInc}
        class="credit-debit border flex-cb h-12 rounded-lg p-3 cursor-pointer"
      >
        <div class="flex-cb gap-x-3">
          <h4 class="text-sm font-medium">Credit or Debit Card</h4>
          <img
            src="/images/license-purchase/visa.png"
            alt="card"
            class="h-4 w-6"
          />
          <img
            src="/images/license-purchase/visa_1.png"
            alt="card"
            class="h-4 w-6"
          />
        </div>
        <ChevronRight size={12} />
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="credit-debit border flex-cb h-12 rounded-lg p-3 cursor-pointer"
        on:click={handleStepInc}
      >
        <div class="flex-cb gap-x-3">
          <h4 class="text-sm font-medium">UPI</h4>
          <img
            src="/images/license-purchase/bhim.png"
            alt="card"
            class="h-5 w-6"
          />
          <img
            src="/images/license-purchase/paytm.png"
            alt="card"
            class="h-5 w-6"
          />
          <img
            src="/images/license-purchase/phonepay.png"
            alt="card"
            class="h-4 w-6"
          />
          <img
            src="/images/license-purchase/amazon_pay.png"
            alt="card"
            class="h-7 w-6"
          />
        </div>
        <ChevronRight size={12} />
      </div>
    </div>
  </div>
</section>
