import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import http from 'http';
import Agent, { HttpsAgent } from 'agentkeepalive';

export const GET: RequestHandler = async ({ request, locals, cookies }: RequestEvent) => {
    const sessionToken = cookies.get('sessionToken'); // Retrieve sessionToken from cookies
    const sessionTokenLocal = '1548620127'; // Retrieve sessionToken from cookies
    const url = `https://atlas.zktecousa.xyz:8086/evt/list`;

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

      const users = data?.instanceList?.map((event:any) => ({
        "unid": event.unid,
        "dbTime": event.dbTime,
        "hwTime": event.hwTime,
        "evtCode": event.evtCode ? event.evtCode : null,
        "evtCodeAndSubCode": event.evtCodeAndSubCode ? event.evtCodeAndSubCode : null,
        "evtControllerRef": event.evtControllerRef ? event.evtControllerRef : null,
        "evtCredHolderRef": event.evtCredHolderRef ? event.evtCredHolderRef : null,
        "evtCredRef" : event.evtCredRef ? event.evtCredRef : null,
        "evtDevRef" : event.evtDevRef ? event.evtDevRef : null,
        "bgColor" : event.bgColor ? event.bgColor : null
      }));

    const dataTest = {
        "unid": 123,
        "dbTime": "2022-01-01 10:00:00.123Z",
        "hwTime": "2022-01-01 10:00:00.123Z",
        "evtCode": 123,
        "evtCodeAndSubCode": 123,
        "evtControllerRef": {
            "address": "",
            "devMod": 179,
            "devPlatform": 31,
            "devType": 1,
            "devUse": 43,
            "name": "Public Demo",
            "unid": 1,
            "uuid": "3e138b1a-5b91-11ed-bcba-001761ce0976"
        },
        "evtCredHolderRef":  {
            "credTemplateRef": {
                "allowedPrivTypes": {
                    "app": true,
                    "door": false,
                    "role": false
                },
                "name": "App Login",
                "tag": "APP",
                "unid": 1
            },
            "lifecycle": 0,
            "name": "admin",
            "tag": "ADMIN",
            "unid": 1,
            "username": "admin"
        },
        "evtCredRef":  {
            "first": "Admin",
            "idNum": "admin",
            "last": "Admin",
            "name": "Admin Admin",
            "tag": "ADMIN",
            "unid": 1
        },
        "evtDevRef": {
            "address": "",
            "devMod": 179,
            "devPlatform": 31,
            "devType": 1,
            "devUse": 43,
            "name": "Public Demo",
            "unid": 1,
            "uuid": "3e138b1a-5b91-11ed-bcba-001761ce0976"
        },
        "bgColor" : {
            "blue": 88,
            "green": 238,
            "red": 255
        },
    };
    
    //   console.log(users)
    //   // Save the transformed data to the database
      const results = [];
      for (const user of users) {
        const result = await locals.pb?.collection('atlas_events').create(user, {
            $autoCancel: false
        });
        results.push(result);
      }
      console.log(results);


      return new Response(JSON.stringify({ message: `Successfully saved user data`, results }), {
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