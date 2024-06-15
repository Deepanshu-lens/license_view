// import PocketBase from "pocketbase";
// import { VITE_POCKETBASE_URL, VITE_BASE_URL } from "$env/static/private";

// export const handle = async ({ event, resolve }) => {
//   // console.log(event)
//   // console.log(event.request.headers.get("cookie"))
//   const host = event.request.url.split("/")[2].split(":")[0];
//   event.locals.pb = new PocketBase(VITE_POCKETBASE_URL);
//   event.locals.pb.autoCancellation(false)
//   event.locals.pb.authStore.loadFromCookie(
//     event.request.headers.get("cookie") || ''
//   );
//   console.log(event.locals.pb.authStore.token)
//   console.log(event.locals.pb.authStore.isValid )
//   try {
//     if (event.locals.pb.authStore.isValid) {
//       event.locals.user = await event.locals.pb
//         .collection("users")
//         .authRefresh();
//     } else {
//       event.locals.pb.authStore.clear();
//       event.locals.user = undefined;
//     }
//   } catch (_) {
//     event.locals.pb.authStore.clear();
//     event.locals.user = undefined;
//   }

//   const response = await resolve(event);
//   const isProd = process.env.NODE_ENV === "production" ? true : false;
//   // response.headers.set(
//   //   "set-cookie",
//   //   event.locals.pb.authStore.exportToCookie({
//   //     httpOnly: true,
//   //     secure: isProd,
//   //     sameSite: isProd ? "none" : "lax",
//   //     domain: isProd ? ".yoursite.tld" : host,
//   //   }),
//   // );
//   const cookieOptions = {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     domain: isProd ? ".yoursite.tld" : host,
//   };

//   const newCookie = event.locals.pb.authStore.exportToCookie(cookieOptions);
//   const existingCookies = response.headers.get('set-cookie') || '';
//   response.headers.set('set-cookie', `${existingCookies}${existingCookies ? '; ' : ''}${newCookie}`);
//   // response.headers.set(
//   //   "set-cookie",
//   //   event.locals.pb.authStore.exportToCookie({ secure: false }),
//   // );
//   return response;
// };
import PocketBase from 'pocketbase';
import { VITE_POCKETBASE_URL } from '$env/static/private';

export const handle = async ({ event, resolve }) => {
  const host = event.request.url.split('/')[2].split(':')[0];
  event.locals.pb = new PocketBase(VITE_POCKETBASE_URL);

  // Load auth store from cookies
  const cookie = event.request.headers.get('cookie') || '';
  event.locals.pb.authStore.loadFromCookie(cookie);

  // console.log("Loaded token from cookies: ", event.locals.pb.authStore.token); // Debugging
  // console.log("Is auth store valid: ", event.locals.pb.authStore.isValid); // Debugging

  // Refresh the user session if the auth store is valid
  try {
    if (event.locals.pb.authStore.isValid) {
      event.locals.user = await event.locals.pb.collection('users').authRefresh();
      // console.log("User session refreshed"); // Debugging
    } else {
      event.locals.pb.authStore.clear();
      event.locals.user = undefined;
    }
  } catch (error) {
    console.error("Error refreshing user session: ", error); // Debugging
    event.locals.pb.authStore.clear();
    event.locals.user = undefined;
  }

  // Resolve the request
  const response = await resolve(event);

  // Set the auth store cookie if it's valid
  if (event.locals.pb.authStore.isValid) {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/'
    };

    const newCookie = event.locals.pb.authStore.exportToCookie(cookieOptions);
    response.headers.append('set-cookie', newCookie); // Use 'append' to avoid overwriting
    // console.log("New auth store cookie set: ", newCookie); // Debugging
  }

  return response;
};
