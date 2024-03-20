<script lang="ts">
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import Autoplay from "embla-carousel-autoplay";
  import * as Table from "@/components/ui/table";
  import * as Carousel from "@/components/ui/carousel/index.js";
  import type { Gallery } from "@/types";

  export let data: Gallery[];
  console.log(data);
  const table = createTable(readable(data));
  const columns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "images",
      header: "Images",
    }),
    table.column({
      accessor: "created",
      header: "Created",
    }),
    table.column({
      accessor: "updated",
      header: "Updated",
    }),
    // table.column({
    //   accessor: "lastSeen",
    //   header: "Last Seen",
    // }),
    // table.column({
    //   accessor: ({ id }) => id,
    //   header: "",
    // }),
  ]);
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<div class="rounded-md border max-h-[600px] overflow-y-scroll">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                <Table.Head {...attrs}>
                  <Render of={cell.render()} />
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  {#if cell.id === "images"}
                    <Carousel.Root
                      opts={{
                        align: "start",
                      }}
                      class="w-1/2 mx-auto"
                      plugins={[
                        Autoplay({
                          delay: 2000,
                        }),
                      ]}
                    >
                      <Carousel.Content class="-ml-1">
                        {#each cell.value as img}
                          <Carousel.Item class="pl-1 md:basis-1/2 lg:basis-1/3"
                            ><img
                              src={"data:image/jpeg;base64," + img}
                              alt="image"
                              width="100%"
                              height="100%"
                            />
                          </Carousel.Item>
                          <!-- <Render of={cell.render()} /> -->
                        {/each}
                      </Carousel.Content>
                      <Carousel.Previous />
                      <Carousel.Next />
                    </Carousel.Root>
                  {:else}
                    <Render of={cell.render()} />
                  {/if}
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
