// import { redirect } from "@sveltejs/kit";
// import { VITE_POCKETBASE_URL } from "$env/static/private";
// import type { RequestEvent, RequestHandler } from "./$types";

// export const POST: RequestHandler = async ({
//   locals,
//   request,
// }: RequestEvent) => {
//   console.log("Adding Camera");
//   const data = await request.json();
//   console.log(data);
//   const camera = await locals.pb?.collection("camera").create({
//     name: data.name,
//     url: data.url,
//     subUrl: data.subUrl,
//     node: data.nodeId,
//     save: data.save,
//     face: data.face,
//     vehicle: data.vehicle,
//     faceDetThresh: data.faceDetThresh,
//     faceMatchThresh: data.faceMatchThresh,
//     vehicleDetThresh: data.vehDetThresh,
//     vehiclePlateThresh: data.vehPlateThresh,
//     vehicleOCRThresho: data.vehOCRThresh,
//     saveDuration: data.saveDuration,
//     saveFolder: data.saveFolder,
//     priority: data.priority,
//     motionThresh: data.motionThresh,
//   });

//   console.log("CAMERA ADDED ", camera);

//   await locals.pb?.collection("node").update(data.nodeId, {
//     "camera+": [camera.id],
//   });

//   await fetch(VITE_POCKETBASE_URL + "/api/addStream", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return new Response(null, { status: 200 });
// };

import { redirect } from "@sveltejs/kit";
import { VITE_POCKETBASE_URL } from "$env/static/private";
import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Adding Camera");
  const data = await request.json();
  console.log(data);
    locals.pb?.autoCancellation(false)
 

const inference = await locals.pb.collection('ai_inference').create({
// camera: camera.id,
node: data.nodeId,
session: data.sessionId,
face: data.face,
vehicle: data.vehicle,
faceDetThresh: data.faceDetThresh,
faceMatchThresh: data.faceMatchThresh,
vehicleDetThresh: data.vehDetThresh,
vehiclePlateThresh: data.vehPlateThresh,
vehicleOCRThresho: data.vehOCRThresh,
motionThresh: data.motionThresh,
running: data.running,
runningThresh: data.runningThresh
})

  const camera = await locals.pb?.collection("camera").create({
    name: data.name,
    url: data.url,
    subUrl: data.subUrl,
    node: data.nodeId,
    save: data.save,
    // face: data.face,
    // vehicle: data.vehicle,
    // faceDetThresh: data.faceDetThresh,
    // faceMatchThresh: data.faceMatchThresh,
    // vehicleDetThresh: data.vehDetThresh,
    // vehiclePlateThresh: data.vehPlateThresh,
    // vehicleOCRThresho: data.vehOCRThresh,
    saveDuration: data.saveDuration,
    saveFolder: data.saveFolder,
    // priority: data.priority,
    // motionThresh: data.motionThresh,
    sparshID: data.sparshID,
    personCount: data.personCount,
    inference: inference.id
  });

// console.log('inference',inference)

await locals.pb?.collection('ai_inference').update(inference.id,{
  "camera+": [camera.id]
 })


  const nodes = await locals.pb?.collection("node").getFullList();
  // console.log("NODES", nodes);
  // const nodeMap = new Map(nodes?.map((node) => [node.name, node.id]));
  const initialNode = nodes?.find((node) => node.id === data.nodeId);
  let nodeName = initialNode ? initialNode.name : null;

  console.log(nodeName);


  if (nodeName) {
    while (nodeName) {
      const node = nodes?.find((n) => n.name === nodeName);
      if (node) {
        console.log(node.name)
        await locals.pb?.collection("node").update(node.id, {
          "camera+": [camera?.id],
        });
        await locals.pb?.collection("camera").update(camera.id, {
          "node+": [node?.id],
        });
      }
      const lastIndex = nodeName.lastIndexOf("_");
      if (lastIndex === -1) break;
      nodeName = nodeName.substring(0, lastIndex);
    }
  } else {
    console.error("Node not found for the given nodeId:", data.nodeId);
  }

  await fetch(VITE_POCKETBASE_URL + "/api/addStream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return new Response(null, { status: 200 });
};