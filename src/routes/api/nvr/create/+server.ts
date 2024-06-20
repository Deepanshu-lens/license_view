import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    const data = await request.json();
    let nodeName = data.nodeName

    const result = await locals.pb?.collection("nvr").create({
      name: data.name,
      node: data.node,
      ip: data.ip,
      user_id: data.user_id,
      password: data.password,
      http_port: data.http_port,
      ip_address: null
    });

    const nodes = await locals.pb?.collection('node').getFullList()

    if(nodeName) {
      while (nodeName) {
        const node = nodes.find((n) => n.name === nodeName)
        if(node) {
          await locals.pb?.collection('node').update(node.id, {
            "nvr+": [result?.id]
          })
          await locals.pb?.collection('nvr').update(result.id, {
            "node+": [node.id]
          })
        }
        const lastIndex = nodeName.lastIndexOf('_')
        if(lastIndex === -1) break;
        nodeName = nodeName.substring(0, lastIndex)
      }
    } else {
      console.log("No node found for the given node Id",data.nodeId)
    }


    return new Response(JSON.stringify({ node: result }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
