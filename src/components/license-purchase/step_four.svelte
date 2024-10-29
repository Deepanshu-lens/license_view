<script>
  import { CreditCard, MessageCircleQuestion } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import { step } from "@/lib/stores";
</script>

<section>
  <div class="header">
    <h5 class="text-primary text-sm">STEP {$step} of 4</h5>
    <h3 class="text-2xl font-semibold mt-3">Setup your credit or debit Card</h3>
  </div>

  <div class="main w-96 mx-auto mt-4">
    <div class="core flex-cb bg-neutral-100 rounded-md p-4">
      <div class="text-left">
        <h6>Core VMS Features</h6>
        <span class="text-[#11A8B6] text-left">$15.99</span>
      </div>
      <div>
        <span class="text-primary underline">change</span>
      </div>
    </div>

    <div class="form-container">
      <form action="">
        <div class="relative">
          <!-- card number -->
          <input
            placeholder="Card number"
            class="my-4 flex-1 p-1.5 border rounded w-full"
          />
          <span class="absolute top-6 right-2">
            <CreditCard class="text-neutral-400 h-5 w-5" />
          </span>
        </div>
        <div class="flex gap-x-2">
          <input
            placeholder="Expiration Date"
            class="flex-1 p-1.5 border rounded w-full"
          />
          <div class="relative">
            <input
              placeholder="CVV"
              class="flex-1 p-1.5 border rounded w-full"
            />
            <span class="absolute top-2 right-2">
              <MessageCircleQuestion class="text-neutral-400 h-5 w-5" />
            </span>
          </div>
        </div>
        <input
          placeholder="Name on the card"
          class="my-4 flex-1 p-1.5 border rounded w-full"
        />

        <Button class="w-full px-12 py-2 bg-primary text-white">
          Start Membership
        </Button>
      </form>
    </div>
  </div>
</section>
