import { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
    console.log(locals.user, 'user here')

    return {};
};
