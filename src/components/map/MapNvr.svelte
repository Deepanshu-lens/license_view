<script lang="ts">
  import { onMount } from "svelte";
  let leafletInstance: any;
  let map: any;

  export let NvrData;

  let data = NvrData.map((record) => ({
    as: record.expand.ip_address?.as,
    country: record.expand.ip_address?.country,
    ipaddress: record.expand.ip_address?.ipaddress,
    isp: record.expand.ip_address?.isp,
    latitude: parseFloat(record.expand.ip_address?.latitude),
    longitude: parseFloat(record.expand.ip_address?.longitude),
    location: record.expand.ip_address?.location,
    region: record.expand.ip_address?.region,
    zip: record.expand.ip_address?.zip,
    status: record?.status?.status,
    userid: record.user_id,
    password: record.password,
  }));


  onMount(() => {
    leafletInstance = window.L;

    const validLatitudes = data.filter(item => item.latitude !== undefined && !isNaN(item.latitude));
    const averageLatitude = validLatitudes.reduce((acc, item) => acc + item.latitude, 0) / validLatitudes.length;

    const validLongitudes = data.filter(item => item.longitude !== undefined && !isNaN(item.longitude));
    const averageLongitude = validLongitudes.reduce((acc, item) => acc + item.longitude, 0) / validLongitudes.length;

    map = leafletInstance.map("map", {
      center: [averageLatitude, averageLongitude],
      zoom: 3,
    });

    leafletInstance
      .tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
        {
          minZoom: 0,
          maxZoom: 20,
          attribution:
            '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          ext: "png",
        },
      )
      .addTo(map);

    data.forEach((item) => {
      if (item.latitude !== undefined && !isNaN(item.latitude) && item.longitude !== undefined && !isNaN(item.longitude) && item.country === 'India') {
        const customIcon = leafletInstance.icon({
          iconUrl:
            item.status ? "/svg/mapicon3.svg" : "/svg/mapicon1.svg",
          iconSize: [32, 32],
        });
        const marker = leafletInstance
          .marker([item.latitude, item.longitude], {
            title: item.location,
            icon: customIcon,
          })
          .addTo(map);

        marker.bindPopup(
          `<b>${item.location}</b><br>ISP: ${item.isp}<br>IP: ${item.ipaddress}`,
        );
      }
    });
  });
</script>

<div class="flex flex-col gap-2 py-4 h-full">
  <div id="map" class="h-full w-full z-50 rounded-lg text-black"></div>
</div>
