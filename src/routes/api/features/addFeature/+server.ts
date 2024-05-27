import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    const {id , features} = await request.json();

    console.log(id);
    console.log(features);

    const data = {
        "features": features,
    }

    console.log(data);

    const record = await locals.pb?.collection('users').update(`${id}`, data);
    console.log(record);
   

    return new Response(JSON.stringify({ node: record }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};