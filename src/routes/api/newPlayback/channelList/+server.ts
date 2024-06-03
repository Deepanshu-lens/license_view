import type { RequestEvent, RequestHandler } from "../convert/$types";
import  fetch  from 'node-fetch'; // Ensure node-fetch is installed and imported correctly
import { parseStringPromise } from 'xml2js'; // Ensure xml2js is installed and imported correctly

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    // Assuming the body contains necessary fields like nvr_ip, http_port, username, password
    const body = await request.json();
    
    // Construct the URL for the Python API
    const url = `http://127.0.0.1:5000/get_recording_date`;
    
    // Make a POST request to the Python API
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nvr_ip: body.nvr_ip,
        http_port: body.http_port,
        username: body.username,
        password: body.password
      })
    });

    if (!apiResponse.ok) {
      throw new Error('Failed to fetch data from Python API');
    }

    const xmlData = await apiResponse.text();

    // Parse the XML response
    const result = await parseStringPromise(xmlData, { explicitArray: false, ignoreAttrs: true });

    // Extract channels from the parsed XML
    const tracks = result.TrackList.Track;
    //@ts-ignore
    const channels = tracks.map(track => ({
      id: track.id,
      channel: track.Channel,
      enable: track.Enable,
      description: track.Description
    }));

    // Return the channels as JSON
    return new Response(JSON.stringify({ channels }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};