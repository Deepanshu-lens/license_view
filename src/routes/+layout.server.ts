import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import type { User } from "@/types";
import { decodeJwt } from "@/lib/jwt";


export const load: LayoutServerLoad = async ({ locals, url }) => {
  const protectedRoutes = [
    "playback",
    "events",
    "gallery",
    "reports",
    'session'
  ];

  if (
    !locals.pb?.authStore.isValid &&
    protectedRoutes.includes(url.pathname.split("/").filter(Boolean)[0])
  ) {
    console.log("REDIRECTED FROM PROTECTED ROUTE");
    throw redirect(302, "/login");
  }
  const currentUserToken = decodeJwt(locals.pb?.authStore.token || '');
  if (currentUserToken) {

    let currentUser = await locals.pb
      ?.collection("users")
      ?.getOne(currentUserToken.id);

    if (currentUser) {
      if (currentUser.nonce) {
        console.log('first')
        const nonce = url.searchParams.get("nonce");
        const userToken = decodeJwt(currentUser.nonce);
        if (userToken.nonce === nonce) {
          await locals.pb?.collection("users")?.update(currentUserToken.id, {
            nonce: "",
            credits: currentUser.credits + userToken.credits,
          });
          currentUser = await locals.pb
            ?.collection("users")
            ?.getOne(currentUserToken.id);
        }
      }
      const session = await locals.pb?.collection("session")?.getOne(locals.user.record.session[0], {
      })
      // console.log(session.activeNode)
      if (locals.user?.record?.session?.length > 0) {
        const [nodes, role, featureList] = await Promise.all([
          locals.pb?.collection("node")?.getOne(session?.activeNode),
          locals.pb?.collection("roles")?.getFullList({
            filter: `id~"${currentUser?.role}"`,
          }),
          locals.pb?.collection("feature")?.getFullList()
        ]);

        const matchedFeatures = featureList
          ?.filter((feature) => currentUser?.features?.includes(feature.id))
          ?.map((feature) => feature.feature);

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
