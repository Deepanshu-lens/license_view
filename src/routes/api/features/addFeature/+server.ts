import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new nodes");

  try {
    const updates = await request.json();
    for (const update of updates) {
      const { id, features } = update;
      console.log(id,features)
      if (features.length === 0) {
        console.log(`Skipping update for id ${id} as features array is empty`);
        continue;
      }
      const data = {
        features: features,
      };
      await locals.pb?.collection('users').update(`${id}`, data);
    }

    return new Response(JSON.stringify({ message: "All records updated successfully" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};