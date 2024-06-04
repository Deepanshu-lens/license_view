

import type { RequestEvent, RequestHandler } from "../convert/$types";
import fetch from 'node-fetch'; // Ensure node-fetch is installed and imported correctly
import { parseStringPromise } from 'xml2js'; // Ensure xml2js is installed and imported correctly

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    const body = await request.json();
    
    // Construct the URL for the first API to get initial channel data
    const url1 = `http://${body.nvr_ip}:${body.http_port}/ISAPI/ContentMgmt/record/tracks/`;

    // Make a GET request to the first API
    const apiResponse1 = await fetch(url1, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${body.username}:${body.password}`).toString('base64')}`
      }
    });

    if (!apiResponse1.ok) {
      throw new Error('Failed to fetch data from first API');
    }

    const xmlData1 = await apiResponse1.text();
    const result1 = await parseStringPromise(xmlData1, { explicitArray: false, ignoreAttrs: true });
    const tracks = result1.TrackList.Track;

    // Construct the URL for the second API to get detailed channel info
    const url2 = `http://${body.nvr_ip}:${body.http_port}/ISAPI/ContentMgmt/InputProxy/channels`;

    // Make a GET request to the second API
    const apiResponse2 = await fetch(url2, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${body.username}:${body.password}`).toString('base64')}`
      }
    });
    

    if (!apiResponse2.ok) {
      throw new Error('Failed to fetch data from second API');
    }

    const xmlData2 = await apiResponse2.text();
    const result2 = await parseStringPromise(xmlData2, { explicitArray: false, ignoreAttrs: true });
    const channels = result2.InputProxyChannelList.InputProxyChannel;

    // Process and match channels
    //@ts-ignore
    const matchedChannels = tracks.map(track => {
      const modifiedChannelId = parseInt(track.Channel.slice(0, -2));
      //@ts-ignore
      const matchedChannel = channels.find(channel => parseInt(channel.id) === modifiedChannelId);
      const rtspLink = `rtsp://${body.username}:${body.password}@${body.nvr_ip}:554/Streaming/tracks/${track.Channel}`;
      return {
        trackId: track.id,
        channelId: track.Channel,
        matchedChannelName: matchedChannel ? matchedChannel.name : "Not Found",
        rtsp: rtspLink
      };
    });

    // Return the matched channel names as JSON
    return new Response(JSON.stringify({ matchedChannels }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};