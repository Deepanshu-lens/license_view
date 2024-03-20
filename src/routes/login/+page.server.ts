import { redirect, error } from "@sveltejs/kit";

export const actions = {
  login: async ({ locals, request }) => {
    console.log("LOGING ATTEMPT");
    const data = await request.formData();
    const email = data.get("email")?.toString() || "";
    const password = data.get("password")?.toString() || "";

    try {
      const user = await locals.pb
        ?.collection("users")
        .authWithPassword(email, password);

      const eventData = { email: email };

      const event = await locals.pb
        ?.collection("loginEvents")
        .create(eventData);

      await locals.pb?.collection("users").update(user?.record?.id, {
        "loginEvents+": [event?.id],
      });
    } catch (err: any) {
      console.log("Error: ", err);

      throw error(err.status || 500, err.message || "An error occurred");
    }
    throw redirect(303, "/");
  },
};
