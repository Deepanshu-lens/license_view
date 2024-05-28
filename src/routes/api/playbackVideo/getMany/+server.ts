import type { RequestEvent, RequestHandler } from "./$types";
import { parse } from "date-fns";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  try {
    const { date, nodeId } = await request.json();

    function formatDate(dateString: string) {
      var date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    }

    const parsedDate = parse(date, "dd MMMM yyyy", new Date());
    if (isNaN(parsedDate.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid date format" }), {
        status: 400,
      });
    }

    const formattedStartDate = formatDate(date);
    const endOfDay = new Date(formattedStartDate);
    endOfDay.setHours(23, 59, 59, 999);
    const formattedEndDate = endOfDay.toISOString();

    const playback_data = await locals.pb?.collection("playback").getFullList({
      filter: `startTime >= "${formattedStartDate}" && startTime <= "${formattedEndDate}"`,
      expand: 'camera'
    });

    // Filter playback_data based on nodeId
    console.log(playback_data)
    // const filteredPlaybackData = playback_data.expand.camera.node?.filter(data => nodeId.includes(data.nodeId));
    const filteredPlaybackData = playback_data?.filter(data => 
      nodeId.includes(data.expand?.camera?.node));

      const simplifiedPlaybackData = filteredPlaybackData?.map(data => ({
        camera: data.camera,
        //@ts-ignore
        cameraName: data.expand?.camera?.name,
        //@ts-ignore
        cameraNode: data.expand?.camera?.node,
        id: data.id,
        label: data.label,
        startTime: data.startTime,
        url: data.url
      }));

    if (!simplifiedPlaybackData?.length) {
      return new Response(
        JSON.stringify({
          error: "No data found for the provided camera, date, or node ID",
        }),
        { status: 404 },
      );
    }
    return new Response(JSON.stringify({ playback_data: simplifiedPlaybackData }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};