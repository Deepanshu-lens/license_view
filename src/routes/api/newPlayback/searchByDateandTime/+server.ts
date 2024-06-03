import type { RequestEvent, RequestHandler } from "../convert/$types";
import { parseStringPromise } from 'xml2js'; // Ensure xml2js is installed and imported

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    const body = await request.json();
    const response = await fetch('http://127.0.0.1:5000/post_recording_date_with_time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nvr_ip: body.nvr_ip,
        http_port: body.http_port,
        username: body.username,
        password: body.password,
        camera_id: body.camera_id,
        year: body.year,
        month: body.month,
      }),
    });

    const xmlData = await response.text(); // Get XML data directly from the response
    const jsonData = await parseStringPromise(xmlData, { explicitArray: false });
    const days = jsonData.trackDailyDistribution.dayList.day;
    //@ts-ignore
    const dayRecord = days.find(day => day.dayOfMonth === body.date.toString());

    if (!dayRecord || dayRecord.record === 'false') {
      return new Response(JSON.stringify({ error: "No recording found" }), { status: 404 });
    } else {
      // Convert startTime and endTime to UTC format
      const startTimeUTC = `${body.year}${body.month}${body.date}T${body.time}Z`;
      const endTimeUTC = `${body.year}${body.month}${body.date}T${body.endTime}Z`;

      const modifiedLink = `rtsp://${body.username}:${body.password}@${body.nvr_ip}:${body.http_port}/Streaming/tracks/${body.camera_id}/?starttime=${startTimeUTC}&endtime=${endTimeUTC}&name=00010006733007001&size=290328`;
      return new Response(JSON.stringify({ link: modifiedLink }), { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};