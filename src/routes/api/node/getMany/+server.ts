import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Getting node data");
  const { session } = await request.json();
  const nodeData = await locals.pb?.collection("node").getFullList({
    filter: `session="${session}"`,
    // expand: "camera",
  });
  if (nodeData) {
    for (let node of nodeData) {
      if (node.camera && Array.isArray(node.camera)) {
        let cameraData = [];
        for (let cameraId of node.camera) {
          let cameraDetails = await locals.pb
            ?.collection("camera")
            .getFullList({ filter: `id="${cameraId}"` });
          if (cameraDetails) {
            cameraData.push(cameraDetails);
          }
        }
        // Add the camera data to the node object. Adjust this according to how you want the data structured.
        // node.expand = cameraData;
        node.cameraData = cameraData;
      }
    }
  }

  return new Response(JSON.stringify({ nodeData }), { status: 200 });
};
