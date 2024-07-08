export const ssr = false;

export async function load({ locals }) {

  // console.log(locals.user.record.session)
  const events = await locals.pb?.collection("events").getList(1, 25, {
    sort: "-created",
    filter: 'matchScore="0"'
  });
  const oEvents = await locals.pb?.collection("events").getList(1, 25, {
    sort: "-created",
    filter: 'matchScore!="0"'
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
    feature: event.feature,
    id: event.id,
  }));
  const serializableOtherEvents = oEvents?.items.map((event) => ({
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
    feature: event.feature,
    id: event.id,
  }));

  return {
    props: {
      events: serializableEvents,
      oEvents: serializableOtherEvents,
    },
  };
}
