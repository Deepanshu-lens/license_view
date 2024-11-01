export const ssr = false;

export async function load({ locals }) {
  const events = await locals.pb?.collection("events").getList(1, 25, {
    sort: "-created",
    fields:
      "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
  });

  const serializableEvents = events?.items.map((event) => ({
    title: event.title,
    description: event.description,
    created: event.created.toString(),
    updated: event.updated.toString(),
    frameImage: event.frameImage,
    score: event.score,
    matchScore: event.matchScore,
    session: event.session,
    node: event.node,
    camera: event.camera,
  }));

  return {
    props: {
      events: serializableEvents,
    },
  };
}
