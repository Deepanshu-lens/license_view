// import type { RequestEvent, RequestHandler } from "./$types";

// export const POST: RequestHandler = async ({
//   locals,
//   request,
// }: RequestEvent) => {
//   try {
//     const { cameraId, date,startTime,endTime } = await request.json();
//     console.log(cameraId, date,startTime, endTime);
//     if (!cameraId) {
//       return new Response(JSON.stringify({ error: "camera is required" }), {
//         status: 400,
//       });
//     }

//     // Parse the date from "8 May 2024" to a Date object
//     const parsedDate = new Date(date);
//     if (isNaN(parsedDate.getTime())) {
//       return new Response(JSON.stringify({ error: "Invalid date format" }), {
//         status: 400,
//       });
//     }

//     const formattedDate = parsedDate.toISOString().split("T")[0];
//     console.log(`startTime>="${formattedDate}00:00:00"&&(endTime=="N/A"||endTime<"${formattedDate}23:59:59")`);

//     const playback_data = await locals.pb
//       ?.collection("playback")
//       .getFullList({
//         filter: `camera = "${cameraId}"`,
//       });
//       console.log(playback_data)

//     if (!playback_data) {
//       return new Response(
//         JSON.stringify({
//           error: "No data found for the provided camera and date",
//         }),
//         { status: 404 },
//       );
//     }

//     console.log(playback_data);
//     return new Response(JSON.stringify({ playback_data }), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error }), {
//       status: 500,
//     });
//   }
// };

import type { RequestEvent, RequestHandler } from "./$types";
import { parse, format, subHours } from "date-fns";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  try {
    const { cameraId, date, startTime, endTime } = await request.json();
    if (!cameraId) {
      return new Response(JSON.stringify({ error: "cameraId is required" }), {
        status: 400,
      });
    }

    function formatDate(dateString: string, timeString: string) {
      // Combine date and time into a single string
      const combinedDateTime = `${dateString} ${timeString}`;

      // Parse the combined date and time to a Date object
      const dateTime = parse(combinedDateTime, "d MMMM yyyy HH:mm", new Date());

      // Check if the date is valid
      if (isNaN(dateTime.getTime())) {
        throw new Error("Invalid date or time value");
      }

      // Subtract one hour from the date
      const adjustedDateTime = subHours(dateTime, 2);

      // Format the adjusted date and time to ISO 8601 format
      const isoString = adjustedDateTime.toISOString();

      // Return the ISO formatted string
      return isoString;
    }

    // Parse the date from "8 May 2024" to a Date object using date-fns
    const parsedDate = parse(date, "d MMMM yyyy", new Date());
    if (isNaN(parsedDate.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid date format" }), {
        status: 400,
      });
    }

    // Format the date and time to match the database format "YYYY-MM-DDTHH:mm:ss.sssZ"
    const formattedDate = formatDate(date, startTime);
    console.log(formattedDate);


    // Query the database for the camera data on the formatted date
    const playback_data = await locals.pb?.collection("playback").getFullList({
      filter: `startTime >= "${formattedDate}" && camera = "${cameraId}"`,
    });

    console.log(playback_data);

    if (!playback_data) {
      return new Response(
        JSON.stringify({
          error: "No data found for the provided camera and date",
        }),
        { status: 404 },
      );
    }

    console.log(playback_data);
    return new Response(JSON.stringify({ playback_data }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};