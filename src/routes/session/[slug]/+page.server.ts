export const ssr = false;

export type OutputType = {
  [key: string]: {
    authProviderRedirect: string;
    authProviderState: string;
    authCodeVerifier: string;
  };
};

export const actions = {
  addNode: async ({ locals, request }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString() || "";
    const node = await locals.pb
      ?.collection("node")
      .create({ name, session: locals.user.record.session[0] });
    await locals.pb
      ?.collection("session")
      .update(locals.user.record.session[0], {
        "node+": [node?.id],
      });
  },
};

export async function load({ locals }) {
  const events = await locals.pb?.collection("events").getList(1, 40, {
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
