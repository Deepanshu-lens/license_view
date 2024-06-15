import { redirect, error } from "@sveltejs/kit";
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
    console.log('first')
    throw redirect(303, "/");
  },

oauth: async ({
  locals,
  cookies,
  url
}) => {
  console.log("Initiating Google OAuth for login");

  const authMethods = await locals.pb.collection('users').listAuthMethods();
  const googleAuthProvider = authMethods.authProviders.find(provider => provider.name === "google");

  if (!googleAuthProvider) {
    throw redirect(303, `/login?message=Google Auth not available.`);
  }

  const isProd = process.env.NODE_ENV === "production";
  const redirectURL = `${url.origin}/login/oauth`;

  cookies.set('state', googleAuthProvider.state, { path: '/', secure: isProd, sameSite: 'lax', httpOnly: true });
  cookies.set('verifier', googleAuthProvider.codeVerifier, { path: '/', secure: isProd, sameSite: 'lax', httpOnly: true });
console.log(redirectURL)
  throw redirect(302, `${googleAuthProvider.authUrl}${redirectURL}`);
}


};
