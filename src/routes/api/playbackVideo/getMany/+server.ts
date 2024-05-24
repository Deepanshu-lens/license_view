import type { RequestEvent, RequestHandler } from "./$types";
import { parse } from "date-fns";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  try {
    const { date } = await request.json();

    function formatDate(dateString: string) {
      // Create a new Date object
      var date = new Date(dateString);

      // Set the time to the start of the day
      date.setHours(0, 0, 0, 0);

      // Format the date to ISO 8601 format
      var isoString = date.toISOString();

      // Return the ISO formatted string
      return isoString;
    }

    // Parse the date from "8 May 2024" to a Date object using date-fns
    const parsedDate = parse(date, "dd MMMM yyyy", new Date());
    if (isNaN(parsedDate.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid date format" }), {
        status: 400,
      });
    }

    const formattedStartDate = formatDate(date);
    const endOfDay = new Date(formattedStartDate);
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day
    const formattedEndDate = endOfDay.toISOString();

    // Format the date and time to match the database format "YYYY-MM-DDTHH:mm:ss.sssZ"
    const formattedDate = formatDate(date);
    console.log(formattedDate);

    // Query the database for the camera data on the formatted date
    const playback_data = await locals.pb?.collection("playback").getFullList({
      filter: `startTime >= "${formattedStartDate}" && startTime <= "${formattedEndDate}"`,
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