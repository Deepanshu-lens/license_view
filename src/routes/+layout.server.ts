import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import type { User } from "@/types";
import { decodeJwt } from "@/lib/jwt";
import os from "os";

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {

// console.log(locals.user)
  const protectedRoutes = [
    "playback",
    "events",
    "gallery",
    "reports",
    'session'
  ];

  const operatingSystem = os.platform();
  // console.log("os", operatingSystem);
// console.log(locals.pb?.authStore.token)
  // console.log("Cookies received:", cookies.get('pb_auth')); // Log the specific auth cookie

  if (
    !locals.pb?.authStore.isValid &&
    protectedRoutes.includes(url.pathname.split("/").filter(Boolean)[0])
  ) {
    console.log("REDIRECTED FROM PROTECTED ROUTE");
    throw redirect(302, "/login");
  }
  const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
  if (currentUserToken) {
    // console.log(currentUserToken.id)
    let currentUser = await locals.pb
      ?.collection("users")
      .getOne(currentUserToken.id);
    if (currentUser) {
      if (currentUser.nonce) {
        console.log('first')
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
// console.log('userin sess',locals.user)
      // 'pb_auth=%7B%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3MTk2NjEwOTMsImlkIjoicDN0bGR0OWoyb21oa3huIiwidHlwZSI6ImF1dGhSZWNvcmQifQ.Ze-spGCcahb7GSM0MYDcgm1QnBY9jurcLU-niqa-vUE%22%2C%22model%22%3A%7B%22avatar%22%3A%22%22%2C%22collectionId%22%3A%22_pb_users_auth_%22%2C%22collectionName%22%3A%22users%22%2C%22created%22%3A%222024-06-15%2011%3A21%3A55.168Z%22%2C%22email%22%3A%22prathamrohatgi%40gmail.com%22%2C%22emailVisibility%22%3Afalse%2C%22features%22%3A%5B%5D%2C%22id%22%3A%22p3tldt9j2omhkxn%22%2C%22loginEvents%22%3A%5B%5D%2C%22name%22%3A%22user%22%2C%22role%22%3A%22%22%2C%22session%22%3A%5B%22d32i114670xxlns%22%5D%2C%22updated%22%3A%222024-06-15%2011%3A21%3A55.168Z%22%2C%22username%22%3A%22users17724%22%2C%22verified%22%3Atrue%2C%22expand%22%3A%7B%7D%7D%7D; Path=/; Expires=Sat, 29 Jun 2024 11:38:13 GMT; HttpOnly; SameSite=Lax'
      if (locals.user?.record?.session?.length > 0) {
        const session = await locals.pb
          ?.collection("session")
          .getOne(locals.user.record.session[0]);
        // console.log(session)
        // console.log(locals.user.record.session[0])
        const nodes = await locals.pb?.collection("node").getFullList<Node[]>({
          filter: `session~"${locals.user.record.session[0]}"`,
        });
        // console.log(nodes)

        const role = await locals.pb?.collection("roles").getFullList({
          filter: `id~"${currentUser?.role}"`,
        });

        // console.log(role);

        const featureList = await locals.pb
          ?.collection("feature")
          .getFullList();

        // console.log(featureList);

        // const matchedFeatures = featureList
        //   ?.filter((feature) => role?.[0]?.features?.includes(feature.id))
        //   ?.map((feature) => feature.feature);
        const matchedFeatures = featureList
        ?.filter((feature) => currentUser?.features?.includes(feature.id))
        ?.map((feature) => feature.feature);

        // console.log(matchedFeatures);

        return {
          loggedIn: locals.pb?.authStore.isValid,
          user: {
            name: locals.user.record.name,
            email: locals.user.record.email,
            session: locals.user.record.session[0],
            role: role?.[0]?.roleName,
            features: matchedFeatures,
            avatar: locals.user.record.avatar
          } as User,
          session: { ...session },
          nodes: structuredClone(nodes),
          url: url.pathname,
          os: operatingSystem,
        };
      } else {
        return {
          loggedIn: locals.pb?.authStore.isValid,
          user: {
            name: locals.user?.record?.name,
            email: locals.user?.record?.email,
          } as User,
          session: { node: [] },
          nodes: [],
          url: url.pathname,
          os: operatingSystem,
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
