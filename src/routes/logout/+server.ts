import { redirect } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals,cookies }: RequestEvent) => {
  // console.log("Logging out");
  console.log("REDIRECTED FROM LOG OUT");
  locals.user = null
  cookies.delete('pb_auth')
  cookies.delete('state')
  cookies.delete('verifier')
  locals.pb?.authStore.clear();
  // return new Response(null, { status: 303 });
  throw redirect(302, "/login");
};
