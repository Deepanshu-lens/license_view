<script lang="ts">
	import { events } from '@/lib/stores';
  import * as Select from '@/components/ui/select'
  import { Button } from '@/components/ui/button'
  import { Upload } from 'lucide-svelte'
    import EventGrid from '@/components/events/EventGrid.svelte';
    const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];

export let data;
console.log(data)
</script>

<div class="p-4 h-full w-full flex-col">
  <div class="flex items-center justify-between">
    <span class='flex flex-col gap-1'>
      <p class="text-black font-medium text-lg">Alerts</p>
      <p class="text-black/[.5] text-base">
Following cards show the alerts detected on a particular date
      </p>
    </span>
     <span class="flex items-center gap-3">
            <Select.Root portal={null}>
              <Select.Trigger
                class="w-[180px] border-solid border-[#015a62] border-[1px] text-[#015a62]"
              >
                <Select.Value placeholder="For last 7 days" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  {#each fruits as fruit}
                    <Select.Item value={fruit.value} label={fruit.label}
                      >{fruit.label}</Select.Item
                    >
                  {/each}
                </Select.Group>
              </Select.Content>
              <Select.Input name="favoriteFruit" />
            </Select.Root>
            <Button
              variant="outline"
              class="border-[#015a62] text-[#015a62] flex gap-1 items-center"
            >
              <Upload size={20} />
              Export Report
            </Button>
          </span>
  </div>
    <div class="w-full h-full px-4">
    <EventGrid data={data.events} />
  </div>
</div>
