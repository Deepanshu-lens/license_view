<script>
  import * as Dialog from "@/components/ui/dialog";
  import Button from "../ui/button/button.svelte";
  import { Star } from "lucide-svelte";

  let featureArr = [
    {
      title: "LIVE Feature",
      subtitle: "Screenshots & Preset Layouts",
      img: "/images/free-trial/video.png",
    },
    {
      title: "Recordings",
      subtitle: "Only up to 24 hours",
      img: "/images/free-trial/video.png",
    },
    {
      title: "Role Based Access",
      subtitle: "Add 2 people on the same level",
      img: "/images/free-trial/person.png",
    },
    {
      title: "Facial Recognition",
      subtitle: "10 faces per minute/10,000 per day",
      img: "/images/free-trial/face.png",
    },
    {
      title: "Preset Alerts",
      subtitle: "10 objects per day",
      img: "/images/free-trial/alarm.png",
    },
    {
      title: "Recordings",
      subtitle: "Up to 7/14/21/28 days",
      img: "/images/free-trial/video.png",
    },
    {
      title: "ALPR",
      subtitle: "10 faces per minute/10,000 per day",
      img: "/images/free-trial/cc.png",
    },
    {
      title: "Scene Change Detection",
      subtitle: "100 changes per day",
      img: "/images/free-trial/person.png",
    },
  ];
</script>

<Dialog.Root>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content
    class="sm:max-w-[520px] scale-90 sm:scale-100 z-[70] max-h-[95%] sm:max-h-auto overflow-y-scroll"
  >
    <Dialog.Header>
      <Dialog.Title>Free Trial Expires in 15 days</Dialog.Title>
      <p class="text-base text-neutral-500">
        Here is a list of features that you can use during your free trial.
      </p>
    </Dialog.Header>

    <!-- main container -->
    <div class="feature-list-container border-b pb-3">
      <ul>
        {#each featureArr as feature, index}
          <li class="flex items-start gap-x-2 my-2">
            <img src={feature?.img} alt="" class="h-7 w-7 mt-1" />
            <div>
              <h6 class="text-base font-medium">{feature?.title}</h6>
              <span class="text-sm text-neutral-500">{feature?.subtitle}</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <!-- footer -->
    <div class="upgrade-now flex justify-end">
      <Button
        size="sm"
        class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-teal-800"
      >
        <img src="/images/license-purchase/sparkles_light.png" alt="" class="mr-2" />
        Upgrade now</Button
      >
    </div>
  </Dialog.Content>
</Dialog.Root>
