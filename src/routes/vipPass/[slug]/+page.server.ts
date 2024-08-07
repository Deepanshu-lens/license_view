import type { PageServerLoad } from './$types.js'
export const ssr = false



export const load: PageServerLoad = async ({ locals }) => {

    locals.pb?.autoCancellation(false)
    const events = async () => {
        const e = await locals.pb?.collection("events").getList(1, 100, {
            sort: "-created",
            fields:
                "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
        });
        return e?.items.map(
            (ee) =>
                ({
                    ...ee,
                    created: new Date(ee.created),
                }) as unknown as Event,
        );
    }

    return {
        events: events(),
        // galleryItems: gelleryItems(),
        // imposterItems: imposterItems(),
    };
}
