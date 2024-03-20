import { redirect } from "@sveltejs/kit";
import { VITE_POCKETBASE_URL } from "$env/static/private";
import type { RequestEvent, RequestHandler } from "./$types";
import type { Camera } from "@/types";

export const PUT: RequestHandler = async ({
  locals,
  request,
}: RequestEvent) => {
  console.log("Editing Camera");
  const data = await request.json();
  console.log(data);

  const oldUrl = await locals.pb
    ?.collection("camera")
    .getOne<Camera>(data.cameraId)
    .then((c) => c.url);

  const camera = await locals.pb?.collection("camera").update(data.cameraId, {
    name: data.name,
    url: data.url,
    face: data.face,
    vehicle: data.vehicle,
    save: data.save,
    faceDetThresh: data.faceDetectionThreshold,
    faceMatchThresh: data.faceSearchThreshold,
    vehDetThresh: data.vehicleDetectionThreshold,
    vehPlateThresh: data.vehiclePlateThreshold,
    vehOCRThresh: data.vehicleOCRThreshold,
    saveDuration: data.saveDuration,
    saveFolder: data.saveFolder,
  });

  if (oldUrl !== data.url) {
    await fetch(VITE_POCKETBASE_URL + "/api/editStream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: oldUrl,
        newUrl: data.url,
        newName: data.name,
      }),
    });
  }

  return new Response(null, { status: 200 });
};
