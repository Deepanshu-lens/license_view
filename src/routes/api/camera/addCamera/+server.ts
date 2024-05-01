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
  const camera = await locals.pb?.collection("camera").create({
    name: data.name,
    url: data.url,
    node: data.nodeId,
    save: data.save,
    face: data.face,
    vehicle: data.vehicle,
    faceDetThresh: data.faceDetThresh,
    faceMatchThresh: data.faceMatchThresh,
    vehicleDetThresh: data.vehDetThresh,
    vehiclePlateThresh: data.vehPlateThresh,
    vehicleOCRThresho: data.vehOCRThresh,
    saveDuration: data.saveDuration,
    saveFolder: data.saveFolder,
    priority: data.priority,
    motionThresh: data.motionThresh,
  });

  console.log("CAMERA ADDED ", camera);

  await locals.pb?.collection("node").update(data.nodeId, {
    "camera+": [camera.id],
  });
  await fetch(VITE_POCKETBASE_URL + "/api/addStream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return new Response(null, { status: 200 });
};
