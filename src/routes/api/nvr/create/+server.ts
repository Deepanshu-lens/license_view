import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Creating new node");
  try {
    const data = await request.json();

    const result = await locals.pb?.collection("nvr").create({
      name: data.name,
      node: data.node,
      ip: data.ip,
      user_id: data.user_id,
      password: data.password,
      http_port: data.http_port,
      ip_address: null
    });


    return new Response(JSON.stringify({ node: result }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
