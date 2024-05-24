import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    const data = await request.json();
    const mobileLay = 1
    console.log(data);

    const result = await locals.pb?.collection("node").create({
      name: data.name,
      session: data.sessionId,
      mobileLayout: mobileLay
    });

    return new Response(JSON.stringify({ node: result }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
