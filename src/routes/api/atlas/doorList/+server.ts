import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import http from 'http';
import Agent, { HttpsAgent } from 'agentkeepalive';

export const GET: RequestHandler = async ({ request, locals, cookies }: RequestEvent) => {
    const sessionToken = cookies.get('sessionToken'); // Retrieve sessionToken from cookies
    const sessionTokenLocal = '1548620127'; // Retrieve sessionToken from cookies
    const url = `https://atlas.zktecousa.xyz:8086/door/list`;

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
        "name": event.name,
        "version": event.version,
        "address": event.address ? event.address : null,
        "physicalParent": event.physicalParent ? event.physicalParent : null,
        "lastModified": event.lastModified ? event.lastModified : null,
        "doorConfig": event.doorConfig ? event.doorConfig : null,
        "logicalChildren": event.logicalChildren ? event.logicalChildren : null,
      }));

    const dataTest = {
        "unid": 10,
        "name": "Front Door",
        "version": 14,
        "address": '1',
        "physicalParent": {
            "name": "Public Demo",
            "type": "Controller",
            "unid": 1
        },
        "lastModified": "2024-03-04T17:00:02.532Z",
        "doorConfig":   {
            "accessGrantedDoorUseTracking": 0,
            "activateStrikeOnRex": true,
            "apbConfig": {
                "apbMethod": 0
            },
            "dataLayouts": [],
            "defaultDoorMode": {
                "allowBio": false,
                "allowCard": true,
                "allowUniquePin": true,
                "bioTechnologies": [],
                "blocked": false,
                "checkCardFacilityCodeOnly": false,
                "disableRex": false,
                "emergency": false,
                "firstCredUnlock": false,
                "requireCardWithBio": false,
                "requireConfirmingPinWithBio": false,
                "requireConfirmingPinWithCard": false,
                "staticState": 2
            },
            "doorOpenClosedEvts": true,
            "extendedHeldTime": 60000,
            "extendedStrikeTime": 20000,
            "followerStrikeDelay": 0,
            "followerStrikeTime": 0,
            "heldPreAlarmWarnTime": 10000,
            "heldTime": 30000,
            "keyValuePairs": [],
            "minStrikeTime": 0,
            "offlineDoorMode": {
                "bioTechnologies": []
            },
            "strikeReleaseMode": 0,
            "strikeTime": 5000
        },
        "logicalChildren": [
            {
                "name": "Front Door - Lock",
                "type": "Actuator",
                "unid": 3
            },
            {
                "name": "Front Door - Reader LED (Green)",
                "type": "Actuator",
                "unid": 4
            },
            {
                "name": "Front Door - Reader Beeper",
                "type": "Actuator",
                "unid": 5
            },
            {
                "name": "Front Door - Door Sensor",
                "type": "Sensor",
                "unid": 6
            },
            {
                "name": "Front Door - Exit Button",
                "type": "Sensor",
                "unid": 7
            },
            {
                "name": "Front Door - Reader",
                "type": "CredReader",
                "unid": 8
            }
        ],
        
    };
    
    const results = [];
    for (const user of users) {
      const result = await locals.pb?.collection('atlas_doors').create(user, {
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