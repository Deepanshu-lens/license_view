import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url, cookies }) => {
    // console.log("pb", locals.pb?.authStore);
    const authToken = cookies.get("pb_auth");
    if (!authToken) throw new Error("Authentication token is missing");
    return {
        token: JSON.parse(authToken).model.session[0]
    };
};
