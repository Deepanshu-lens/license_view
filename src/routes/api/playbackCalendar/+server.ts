// import type { RequestEvent, RequestHandler } from "../convert/$types";
// import fetch from 'node-fetch'; // Ensure node-fetch is installed and imported correctly
// import { parseStringPromise } from 'xml2js'; // Ensure xml2js is installed and imported correctly

// export const POST: RequestHandler = async ({
//   locals,
//   request,
// }: RequestEvent) => {
//   try {
//     const body = await request.json();
//     const { nvr_ip, http_port, username, password, camera_id, year, month } = body;

//     // Construct the URL for the NVR device
//     const url = `http://${nvr_ip}:${http_port}/ISAPI/ContentMgmt/record/tracks/${camera_id}/dailyDistribution`;

//     // Construct the payload for the POST request
//     const payload = `<?xml version="1.0" encoding="utf-8"?><trackDailyParam><year>${year}</year><monthOfYear>${month}</monthOfYear></trackDailyParam>`;

//     // Fetch the XML data from the NVR device
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
//         'Content-Type': 'application/xml'
//       },
//       body: payload
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch data from NVR device');
//     }

//     const xmlData = await response.text();

//     // Parse the XML data
//     const result = await parseStringPromise(xmlData, { explicitArray: false, ignoreAttrs: true });

//     // Extract days information
//     //@ts-ignore
//     const days = result.trackDailyDistribution.dayList.day.map((day) => ({
//       camera_id,
//       dayOfMonth: day.dayOfMonth,
//       record: day.record,
//       month: month,
//       year: year
//     }));

//     // Return the days as JSON
//     return new Response(JSON.stringify(days), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//     });
//   }
// };

import type { RequestEvent, RequestHandler } from "../convert/$types";
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  try {
    const body = await request.json();
    const { nvr_ip, http_port, username, password, camera_id, year, month } = body;

    // Helper function to fetch and parse data for a given month and year
    async function fetchDataForMonth(month: number, year: number) {
      const url = `http://${nvr_ip}:${http_port}/ISAPI/ContentMgmt/record/tracks/${camera_id}/dailyDistribution`;
      const payload = `<?xml version="1.0" encoding="utf-8"?><trackDailyParam><year>${year}</year><monthOfYear>${month}</monthOfYear></trackDailyParam>`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
          'Content-Type': 'application/xml'
        },
        body: payload
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data from NVR device for month ${month} and year ${year}`);
      }

      const xmlData = await response.text();
      return parseStringPromise(xmlData, { explicitArray: false, ignoreAttrs: true });
    }

    // Calculate previous month and year
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    // Fetch data for current and previous months
    const currentMonthData = await fetchDataForMonth(month, year);
    const previousMonthData = await fetchDataForMonth(previousMonth, previousYear);

    // Extract days information and combine data
    //@ts-ignore
    const extractDays = (data, month, year) => data.trackDailyDistribution.dayList.day.map(day => ({
      camera_id,
      dayOfMonth: day.dayOfMonth,
      record: day.record,
      month: month,
      year: year
    }));

    const currentDays = extractDays(currentMonthData, month, year);
    const previousDays = extractDays(previousMonthData, previousMonth, previousYear);

    // Combine and return the days as JSON
    const allDays = [...currentDays, ...previousDays];
    return new Response(JSON.stringify(allDays), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};