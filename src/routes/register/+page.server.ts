import { fail, redirect, type Cookies } from "@sveltejs/kit";
import { createId } from "@paralleldrive/cuid2";

const loginWithEmailPassword = async (
  locals: App.Locals,
  cookies: Cookies,
  email: string,
  password: string
) => {
  try {
    await locals.pb?.collection("users").authWithPassword(email, password);
    const isProd = process.env.NODE_ENV === "production" ? true : false;
    if (locals.pb?.authStore.isValid) {
      cookies.set(
        "pb_auth",
        locals.pb?.authStore.exportToCookie({
          secure: isProd,
          sameSite: "lax",
          httpOnly: true,
        })
      );
      return { success: true };
    }
  } catch (e: any) {
    if (e.status >= 400 && e.status <= 500) {
      return fail(e.status, {
        email,
        error: true,
        message: "failed to authenticate",
      });
    }
    if (e.status >= 500) {
      return fail(e.status, {
        email,
        error: true,
        message: "authentication server could not be reached",
      });
    }
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
      return fail(422, {
        email,
        error: true,
        message: "password and password confirm must match",
      });
    }
    try {
      // Create a session
      const session = await locals.pb
        ?.collection("session")
        .create({
          owned: true,
        })
        .catch((e) => {
          console.error("[Session Create Error]: ", e);
        });
      console.log(session);
      await locals.pb?.collection("users").create({
        name,
        email,
        password,
        passwordConfirm,
        session: session?.id,
      });
    } catch (e: any) {
      console.error("[Signup Error]: ", e.response.data);
      return fail(422, { error: true, message: e.response.data });
    }
    await loginWithEmailPassword(locals, cookies, email, password);
    throw redirect(303, "/login");
  },
};
