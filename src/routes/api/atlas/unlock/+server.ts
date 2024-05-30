
import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import http from 'http';
import Agent, { HttpsAgent } from 'agentkeepalive';

export const POST: RequestHandler = async ({ request, locals, cookies }: RequestEvent) => {
    const {unid , serverIP , serverPort} = await request.json()
    const sessionToken = cookies.get('sessionToken'); // Retrieve sessionToken from cookies
    const sessionTokenLocal = '1506197728'; // Retrieve sessionToken from cookies
    const url = `https://atlas.zktecousa.xyz:8086/json/doorMomentaryUnlock?unid=${unid} `;

    console.log(url)

    const agent = new HttpsAgent({
      rejectUnauthorized: false // This disables certificate validation
    });

    const headers = {
      'sessionToken': `${sessionTokenLocal}` // Include the sessionToken in the Authorization header
    };

    try {
      const response = await new Promise((resolve, reject) => {
        http.get(url, { agent: agent, headers: headers }, (res:any) => { // Pass headers here
          let data = '';

          res.on('data', (chunk:any) => {
            data += chunk;
          });

          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } else {
              reject(new Error('Failed to authenticate'));
            }
          });
        }).on('error', (e:any) => {
          reject(e);
        });
      });

      const { data } = response as { status: number; data: any };

      console.log(data)

      return new Response(JSON.stringify({ message: `Successfully saved unlock the door `, data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
}