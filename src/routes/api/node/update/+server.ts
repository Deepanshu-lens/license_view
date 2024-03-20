import type { RequestEvent, RequestHandler } from "./$types";

export const PATCH: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Editing Node");
  const data = await request.json();
  console.log(data);

  const node = await locals.pb?.collection("node").update(data.id, {
    name: data.name,
  });

  return new Response(null, { status: 200 });
};
