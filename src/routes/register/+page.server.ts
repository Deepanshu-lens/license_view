

import { fail, redirect } from "@sveltejs/kit";

function decryptPassword(encryptedPassword: string): string {
  const key = 'lensview';
  const decoded = atob(encryptedPassword); // Convert from base64
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

const loginWithEmailPassword = async (locals, cookies, email, password) => {
  try {
    await locals.pb.collection("users").authWithPassword(email, password);
    const isProd = process.env.NODE_ENV === "production";

    if (locals.pb.authStore.isValid) {
      cookies.set("pb_auth", locals.pb.authStore.exportToCookie({
        secure: isProd,
        sameSite: "lax",
        httpOnly: true,
      }));
      return { success: true };
    }
  } catch (e) {
    const message = e.status >= 500 ? "Auth Server not Reachable." : "Failed to Authenticate.";
    throw redirect(303, `/register?message=${message}`);
  }
};

export const actions = {
  signup: async ({ locals, request, cookies }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const password = data.get("password")?.toString() || "";
    const decryptedPassword = decryptPassword(password);
    const passwordConfirm = data.get("confirm-password")?.toString() || "";
    const decryptedPasswordConfirm = decryptPassword(passwordConfirm);

    if (decryptedPassword !== decryptedPasswordConfirm) {
      throw redirect(303, `/register?message=Passwords don't match.`);
    }

    try {
      const session = await locals.pb.collection("session").create({ owned: true });
      await locals.pb.collection("users").create({
        name,
        email,
        password: decryptedPassword,
        passwordConfirm: decryptedPasswordConfirm,
        session: session.id,
      });
    } catch (e) {
      throw redirect(303, `/register?message=${e.message}`);
    }

    await loginWithEmailPassword(locals, cookies, email, password);
    throw redirect(303, "/login");
  },

  oauth: async ({ cookies, url, locals }) => {
    const isProd = process.env.NODE_ENV === "production";

    const authMethods = await locals.pb.collection('users').listAuthMethods();
    if (!authMethods) {
      throw redirect(303, `/register?message=OAuth not configured.`);
    }

    const googleAuthProvider = authMethods.authProviders.find(provider => provider.name === "google");
    if (!googleAuthProvider) {
      throw redirect(303, `/register?message=Google Auth not available.`);
    }

    cookies.set('state', googleAuthProvider.state, { path: '/', secure: isProd, sameSite: 'lax', httpOnly: true });
    cookies.set('verifier', googleAuthProvider.codeVerifier, { path: '/', secure: isProd, sameSite: 'lax', httpOnly: true });

    throw redirect(302, `${googleAuthProvider.authUrl}${url.origin}/oauth`);
  }
};
