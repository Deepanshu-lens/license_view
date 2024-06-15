// import { fail, redirect, type Cookies } from "@sveltejs/kit";

// const loginWithEmailPassword = async (
//   locals: App.Locals,
//   cookies: Cookies,
//   email: string,
//   password: string,
// ) => {
//   try {
//     await locals.pb?.collection("users").authWithPassword(email, password);
//     const isProd = process.env.NODE_ENV === "production" ? true : false;
//     if (locals.pb?.authStore.isValid) {
//       cookies.set(
//         "pb_auth",
//         locals.pb?.authStore.exportToCookie({
//           secure: isProd,
//           sameSite: "lax",
//           httpOnly: true,
//         }),
//       );
//       return { success: true };
//     }
//   } catch (e: any) {
//     if (e.status >= 400 && e.status <= 500) {
//       const message = "Failed to Authenticate.";
//       // return fail(e.status, {
//       //   email,
//       //   error: true,
//       //   message: "failed to authenticate",
//       // });
//       throw redirect(303, `/register?message=${message}`);
//     }
//     if (e.status >= 500) {
//       const message = "Auth Server not Reachable.";

//       // return fail(e.status, {
//       //   email,
//       //   error: true,
//       //   message: "authentication server could not be reached",
//       // });
//       throw redirect(303, `/register?message=${message}`);
//     }
//   }
// };

// export const actions = {
//   signup: async ({ locals, request, cookies }) => {
//     const data = await request.formData();
//     const name = data.get("name")?.toString() || "";
//     const email = data.get("email")?.toString() || "";
//     const password = data.get("password")?.toString() || "";
//     const passwordConfirm = data.get("confirm-password")?.toString() || "";

//     if (password !== passwordConfirm) {
//       // return fail(422, {
//       //   email,
//       //   error: true,
//       //   message: "password and password confirm must match",
//       // });
//       const message = "Passwords dont Match.";

//       throw redirect(303, `/register?message=${message}`);
//     }
//     try {
//       // Create a session
//       const session = await locals.pb
//         ?.collection("session")
//         .create({
//           owned: true,
//         })
//         .catch((e) => {
//           console.error("[Session Create Error]: ", e);
//         });
//       console.log(session);
//       await locals.pb?.collection("users").create({
//         name,
//         email,
//         password,
//         passwordConfirm,
//         session: session?.id,
//       });
//     } catch (e: any) {
//       const message = e.message;
//       console.log(message);
//       // return fail(422, { error: true, message: e.response.data });
//       // const message = "Passwords dont Match";

//       throw redirect(303, `/register?message=${message}`);
//     }
//     await loginWithEmailPassword(locals, cookies, email, password);
//     throw redirect(303, "/login");
//   },

//   oauth: async ({ cookies, url, locals }) => {
//     const isProd = process.env.NODE_ENV === "production" ? true : false;

//     const authMethods = await locals.pb?.collection('users').listAuthMethods();
//     if (!authMethods) {
//       throw redirect(303, `/register?message=OAuth not configured.`);
//     }
//     const redirectURL = `${url.origin}/oauth`;

//     const googleAuthProvider = authMethods.authProviders.find(provider => provider.name === "google");
//     if (!googleAuthProvider) {
//       throw redirect(303, `/register?message=Google Auth not available.`);
//     }

//     console.log(locals.pb?.authStore.isValid)

//     cookies.set('state', googleAuthProvider.state, { path: '/', secure: isProd, sameSite: 'lax', httpOnly: true });
//     cookies.set('verifier', googleAuthProvider.codeVerifier, { path: '/', secure: isProd, sameSite: 'lax', httpOnly: true });

//     throw redirect(302, `${googleAuthProvider.authUrl}${redirectURL}`);
//   }
// };



import { fail, redirect } from "@sveltejs/kit";
import PocketBase from 'pocketbase';

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
    const passwordConfirm = data.get("confirm-password")?.toString() || "";

    if (password !== passwordConfirm) {
      throw redirect(303, `/register?message=Passwords don't match.`);
    }

    try {
      const session = await locals.pb.collection("session").create({ owned: true });
      await locals.pb.collection("users").create({
        name,
        email,
        password,
        passwordConfirm,
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
