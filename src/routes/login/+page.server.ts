import { redirect, error } from "@sveltejs/kit";


function decryptPassword(encryptedPassword: string): string {
  const key = 'lensview';
  const decoded = atob(encryptedPassword); // Convert from base64
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

export const actions = {
  login: async ({ locals, request }) => {
    console.log("LOGING ATTEMPT");
    const data = await request.formData();
    const email = data.get("email")?.toString() || "";
    // const password = data.get("password")?.toString() || "";
    const encryptedPassword = data.get("password")?.toString() || "";
    const password = decryptPassword(encryptedPassword);
    // const operatingSystem = os.platform;
    // console.log(operatingSystem);  
    // console.log(password);
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
