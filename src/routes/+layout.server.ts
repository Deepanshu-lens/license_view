// import { redirect } from "@sveltejs/kit";
// import type { LayoutServerLoad } from "./$types";
// import type { User } from "@/types";
// import { decodeJwt } from "@/lib/jwt";

// export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
//   const protectedRoutes = ["session", "playback", "events", "gallery"];
//   if (
//     !locals.pb?.authStore.isValid &&
//     protectedRoutes.includes(url.pathname.split("/").filter(Boolean)[0])
//   ) {
//     console.log("REDIRECTED FROM PROTECTED ROUTE");
//     throw redirect(302, "/login");
//   }
//   const currentUserToken = decodeJwt(
//     locals.pb?.authStore.token || cookies.get("pb_auth") || "",
//   );
//   if (currentUserToken) {
//     let currentUser = await locals.pb
//       ?.collection("users")
//       .getOne(currentUserToken.id);
//     if (currentUser) {
//       if (currentUser.nonce) {
//         const nonce = url.searchParams.get("nonce");
//         const userToken = decodeJwt(currentUser.nonce);
//         if (userToken.nonce === nonce) {
//           await locals.pb?.collection("users").update(currentUserToken.id, {
//             nonce: "",
//             credits: currentUser.credits + userToken.credits,
//           });
//           currentUser = await locals.pb
//             ?.collection("users")
//             .getOne(currentUserToken.id);
//         }
//       }

//       const session = await locals.pb
//         ?.collection("session")
//         .getOne(locals.user.record.session[0]);

//       const nodes = await locals.pb?.collection("node").getFullList<Node[]>({
//         filter: `session~"${locals.user.record.session[0]}"`,
//       });

//       return {
//         loggedIn: locals.pb?.authStore.isValid,
//         user: {
//           name: locals.user.record.name,
//           email: locals.user.record.email,
//           session: locals.user.record.session[0],
//         } as User,
//         session: { ...session },
//         nodes: structuredClone(nodes),
//         url: url.pathname,
//       };
//     }
//   }
//   return {
//     loggedIn: false,
//     nodes: [],
//     session: {},
//   };
// };

import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import type { User } from "@/types";
import { decodeJwt } from "@/lib/jwt";

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
  const protectedRoutes = ["session", "playback", "events", "gallery"];

  // console.log('locals',locals)
  // console.log("authvalid", locals.pb?.authStore.isValid);
  if (
    !locals.pb?.authStore.isValid &&
    protectedRoutes.includes(url.pathname.split("/").filter(Boolean)[0])
  ) {
    console.log("REDIRECTED FROM PROTECTED ROUTE");
    throw redirect(302, "/login");
  }
  const currentUserToken = decodeJwt(
    locals.pb?.authStore.token || cookies.get("pb_auth") || "",
  );
  if (currentUserToken) {
    let currentUser = await locals.pb
      ?.collection("users")
      .getOne(currentUserToken.id);
    if (currentUser) {
      if (currentUser.nonce) {
        const nonce = url.searchParams.get("nonce");
        const userToken = decodeJwt(currentUser.nonce);
        if (userToken.nonce === nonce) {
          await locals.pb?.collection("users").update(currentUserToken.id, {
            nonce: "",
            credits: currentUser.credits + userToken.credits,
          });
          currentUser = await locals.pb
            ?.collection("users")
            .getOne(currentUserToken.id);
        }
      }

      if (locals.user.record.session?.length > 0) {
        const session = await locals.pb
          ?.collection("session")
          .getOne(locals.user.record.session[0]);

        const nodes = await locals.pb?.collection("node").getFullList<Node[]>({
          filter: `session~"${locals.user.record.session[0]}"`,
        });

        return {
          loggedIn: locals.pb?.authStore.isValid,
          user: {
            name: locals.user.record.name,
            email: locals.user.record.email,
            session: locals.user.record.session[0],
          } as User,
          session: { ...session },
          nodes: structuredClone(nodes),
          url: url.pathname,
        };
      } else {
        return {
          loggedIn: locals.pb?.authStore.isValid,
          user: {
            name: locals.user.record.name,
            email: locals.user.record.email,
          } as User,
          session: { node: [] },
          nodes: [],
          url: url.pathname,
        };
      }
    }
  }
  return {
    loggedIn: false,
    nodes: [],
    session: {},
  };
};
