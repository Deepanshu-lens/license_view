import PocketBase from "pocketbase";
import { VITE_POCKETBASE_URL, VITE_BASE_URL } from "$env/static/private";

export const handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(VITE_POCKETBASE_URL);
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || "",
  );
  try {
    if (event.locals.pb.authStore.isValid) {
      event.locals.user = await event.locals.pb
        .collection("users")
        .authRefresh();
    } else {
      event.locals.pb.authStore.clear();
      event.locals.user = undefined;
    }
  } catch (_) {
    event.locals.pb.authStore.clear();
    event.locals.user = undefined;
  }

  const response = await resolve(event);
  const isProd = process.env.NODE_ENV === "production" ? true : false;
  response.headers.set(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie({
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: isProd ? ".yoursite.tld" : `${VITE_BASE_URL}`,
    }),
  );
  // response.headers.set(
  //   "set-cookie",
  //   event.locals.pb.authStore.exportToCookie({ secure: false }),
  // );
  return response;
};
