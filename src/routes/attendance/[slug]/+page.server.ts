export const ssr = false
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async ({ locals }) => {
    console.log(locals.user.record.session)
    locals.pb?.autoCancellation(false)
    const gelleryItems = async () => {
        const g = await locals.pb?.collection("faceGallery").getFullList({
            sort: "-lastSeen",
            expand: "events",
            filter: "employee=false",
            fields: "name,lastSeen,images,expand.events.frameImage,employee,department,aadhar",
        });
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Map over gallery items and fetch their events for today
        const galleryItemsWithTodayEvents = await Promise.all(g.map(async (item) => {
            console.log(today)
            const todayEvents = await locals.pb?.collection("events").getFullList({
                filter: `title = "${item.name}" && created >= "${today.toISOString()}"`,
                sort: "+created",
            });
            console.log(todayEvents)
            return {
                ...item,
                todayEvents: todayEvents
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
            created: new Date(),
            updated: new Date(),
            aadhar: e.aadhar,
            department: e.department,
            employee: e.employee,
            todayEvents: e.todayEvents
        }));

    }



    return {
        galleryItems: gelleryItems(),
    };
}