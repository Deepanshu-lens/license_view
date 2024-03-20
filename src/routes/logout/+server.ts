import { redirect } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }: RequestEvent) => {
  // console.log("Logging out");
  console.log("REDIRECTED FROM LOG OUT");
  locals.pb?.authStore.clear();
  // return new Response(null, { status: 303 });
  throw redirect(302, "/login");
};
