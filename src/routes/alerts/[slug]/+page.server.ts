import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const ssr = false;

export async function load({ locals }) {

  // console.log(locals.user.record.session)
  const events = async () => {
    const e = await locals.pb?.collection("events").getList(1, 200, {
      sort: "-created",
      fields:
        "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
    });
    return e?.items.map(
      (ee) =>
        ({
          ...ee,
          created: new Date(ee.created),
        }) as unknown as Event,
    );
  }

  return {
    events: events()
  };
}


export const actions: Actions = {
  getFilteredEvents: async ({ locals, request }) => {
    console.log('getFilteredEvents action started');
    const data = await request.formData();
    const timeFrame = data.get('timeFrame') as 'hour' | 'day' | 'week' | 'month' | 'year';
    const sessionId = data.get('sessionId') as string;

    console.log('Received timeFrame:', timeFrame);
    console.log('Received sessionId:', sessionId);

    if (!timeFrame || !sessionId) {
      console.error('Missing timeFrame or sessionId');
      throw error(400, 'Missing timeFrame or sessionId');
    }

    const now = new Date();
    let startDate: Date;

    switch (timeFrame) {
      case 'hour':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        console.error('Invalid timeFrame:', timeFrame);
        throw error(400, 'Invalid timeFrame');
    }

    console.log('Calculated startDate:', startDate.toISOString());

    try {
      console.log('Fetching filtered events from PocketBase');
      const filteredEvents = await locals.pb?.collection("events").getList(1, 200, {
        sort: "-created",
        filter: `session = "${sessionId}" && created >= "${startDate.toISOString()}"`,
        fields: "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
      });

      console.log('Number of filtered events:', filteredEvents?.items.length);

      const csvContent = generateCSV(filteredEvents?.items);

      const headers = {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="events_${timeFrame}.csv"`
      };

      return new Response(csvContent, { headers });
    } catch (err) {
      console.error('Error fetching filtered events:', err);
      throw error(500, 'Error fetching filtered events');
    }
  }
};


function generateCSV(events: any[]): string {
  const headers = ['Title','Node','Session','Camera', 'Description', 'Created', 'Updated', 'Frame Image', 'Score', 'Match Score', 'Session', 'Node', 'Camera'];
  const rows = events.map(event => [
    event.title,
    event.description,
    event.camera,
    event.session,
    event.node,
    event.created,
    event.updated,
    event.frameImage,
    event.score,
    event.matchScore,
    event.session,
    event.node,
    event.camera
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}