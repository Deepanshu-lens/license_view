import { redirect, error } from "@sveltejs/kit";
import os from "os";
export const actions = {
  login: async ({ locals, request }) => {
    console.log("LOGING ATTEMPT");
    const data = await request.formData();
    const email = data.get("email")?.toString() || "";
    const password = data.get("password")?.toString() || "";
    // const operatingSystem = os.platform;
    // console.log(operatingSystem);
    try {
      const user = await locals.pb
        ?.collection("users")
        .authWithPassword(email, password);
      // console.log(user);
      const eventData = { email: email };

      const event = await locals.pb
        ?.collection("loginEvents")
        .create(eventData);

      await locals.pb?.collection("users").update(user?.record?.id, {
        "loginEvents+": [event?.id],
      });
    } catch (err: any) {
      console.log("login error", err.message);
      // throw error(err.status || 500, err.message || "An error occurred");
      throw redirect(303, `/login?message=${err.message}`);
    }
    throw redirect(303, "/");
  },
};
