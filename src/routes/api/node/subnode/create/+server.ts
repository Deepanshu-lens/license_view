import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    const { sessionId, node, subNode } = await request.json();

    // Check if the main node exists
    const nodeExists = await locals.pb?.collection("node").getList(1, 50, {
      filter: `name="${node}"`,
    });
    console.log(nodeExists);
    if (nodeExists?.items.length === 0) {
      console.log(`Node ${node} does not exist.`);
      return new Response(JSON.stringify({ error: "Node does not exist" }), {
        status: 404,
      });
    }

    // Combine node and subNode names with an underscore
    const combinedName = `${node}_${subNode}`;
    console.log(sessionId, combinedName);

    const result = await locals.pb?.collection("node").create({
      name: combinedName,
      session: sessionId,
    });

    console.log(result);

    return new Response(JSON.stringify({ node: result }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};