import type { PageServerData } from "./$types";

export const ssr = false;

export const load: PageServerData = async ({ locals }) => {

    const panels = async () => {
        locals.pb.autoCancellation(false)
        const atlas = await locals.pb?.collection('atlas').getFullList({
            filter: `session~"${locals.user.record.session[0]}"`,
            expand: 'doors, users,'
        });
        
        locals.pb.autoCancellation(false)
        const atlasWithEvents = await Promise.all(atlas.map(async item => {
            const filteredEvents = await locals.pb.collection('atlas_events').getFullList({
                sort: '-created',
                filter: `pannels="${item.id}"`,
                expand: 'user'
            });
            return { ...item, events: filteredEvents };
        }));
        
        return { atlas: JSON.parse(JSON.stringify(atlasWithEvents)) };
    }

    return {
        panels: panels()
    }
}