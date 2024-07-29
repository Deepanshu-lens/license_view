export const ssr = false
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async ({ locals }) => {
    console.log(locals.user.record.session)
    locals.pb?.autoCancellation(false)
    const gelleryItems = async () => {
        const g = await locals.pb?.collection("faceGallery").getFullList({
            sort: "-lastSeen",
            expand: "events",
            filter: "employee=true",
            fields: "name,lastSeen,images,expand.events.frameImage,employee,department,aadhar,email,mobile",
        });

        // console.log(g)
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Map over gallery items and fetch their events for today
        const galleryItemsWithTodayEvents = await Promise.all(g.map(async (item) => {
            // console.log(today)
            const todayEvents = await locals.pb?.collection("events").getList(1, 2, {
                filter: `title = "${item.name}" && created >= "${today.toISOString()}"`,
                sort: "+created",
            });
            const firstEvent = todayEvents?.items[0];
            const lastEvent = todayEvents?.items[todayEvents.items.length - 1];

            return {
                ...item,
                todayEvents: [firstEvent, lastEvent].filter(Boolean).map(event => ({
                    ...event,
                    created: event.created ? new Date(event.created).toISOString() : null,
                    updated: event.updated ? new Date(event.updated).toISOString() : null,
                }))
            };
        }));
        // console.log(galleryItemsWithTodayEvents)

        // Replace the original gallery items with the new array that includes today's events
        return galleryItemsWithTodayEvents?.map((e) => ({
            name: e.name,
            lastSeen: e.lastSeen,
            savedData: e.images,
            images: e.expand.events
                ? e.expand.events
                    .map((f) => f.frameImage)
                    .slice(-8)
                    .reverse()
                : [],
            created: new Date().toISOString(), // Convert to ISO string
            updated: new Date().toISOString(), // Convert to ISO string
            aadhar: e.aadhar,
            email: e.email,
            mobile: e.mobile,
            department: e.department,
            employee: e.employee,
            todayEvents: e.todayEvents
        }));

    }



    return {
        galleryItems: gelleryItems(),
    };
}