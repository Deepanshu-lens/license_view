import { redirect } from "@sveltejs/kit";

export const GET = async ({ locals, url, cookies }) => {
  console.log("Handling OAuth callback for login");

  const redirectURL = `${url.origin}/login/oauth`;
console.log(redirectURL)
  const expectedState = cookies.get('state');
  const expectedVerifier = cookies.get('verifier');

  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!expectedState || expectedState !== state) {
    throw redirect(303, '/login?message=State mismatch.');
  }

  const authMethods = await locals.pb.collection('users').listAuthMethods();
  const googleProvider = authMethods.authProviders.find(provider => provider.name === "google");

  if (!googleProvider) {
    throw redirect(303, `/login?message=Google Auth not available.`);
  }

  try {
  const auth =   await locals.pb.collection('users').authWithOAuth2Code(
      googleProvider.name,
      code,
      expectedVerifier || googleProvider.codeVerifier,
      redirectURL
    );
console.log(auth)
    if (locals.pb.authStore.isValid) {
      console.log('first')
      const isProd = process.env.NODE_ENV === "production";
      const cookieOptions = {
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        httpOnly: true,
        path: '/'
      };
      const authToken = locals.pb?.authStore.exportToCookie(cookieOptions);
      cookies.set("pb_auth", auth.token, cookieOptions);
    } else {
      console.log('Auth store is not valid after OAuth');
    }
    // Redirect to the session page after login
  } catch (err) {
    console.log('Error during OAuth login', err);
    throw redirect(303, '/login?message=OAuth login failed');
  }
  throw redirect(303, `/`)

};
