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
  const events = await locals.pb?.collection("events").getList(1, 20, {
    sort: "-created",
    fields:
      "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
  });

  // const galleryItems = await locals.pb?.collection("faceGallery").getFullList({
  //   sort: "-lastSeen",
  //   expand: "events",
  //   fields: "name,lastSeen,images,expand.events.frameImage",
  // });

  // const imposterItems = await locals.pb
  //   ?.collection("impostors")
  //   .getList(1, 10, {
  //     sort: "-lastSeen",
  //     expand: "events",
  //     fields: "name,lastSeen,expand.events.frameImage",
  //   });

  // console.log(events);

  const serializableEvents = events?.items.map(
    (event) =>
      ({
        ...event,
        created: new Date(event.created),
      }) as unknown as Event,
  );

  // const galleryItems = await locals.pb?.collection("faceGallery").getFullList({
  //   sort: "-lastSeen",
  //   expand: "events",
  //   fields: "name,lastSeen,images,expand.events.frameImage",
  // });

  // console.log(galleryItems);

  // const serializableGalleryItems = galleryItems.map((e) => ({
  //   name: e.name,
  //   lastSeen: e.lastSeen,
  //   savedData: e.images,
  //   images: e.expand.events
  //     ? e.expand.events
  //         .map((f) => f.frameImage)
  //         .slice(-8)
  //         .reverse()
  //     : [],
  //   created: new Date(),
  //   updated: new Date(),
  // }));

  // const serializableImposterItems = imposterItems.items.map((e) => ({
  //   name: "Unknown",
  //   lastSeen: e.lastSeen,
  //   images: e.expand.events
  //     .map((f) => f.frameImage)
  //     .slice(-8)
  //     .reverse(),
  //   created: new Date(),
  //   updated: new Date(),
  // }));

  return {
    props: {
      events: serializableEvents,
      galleryItems: [],
      imposterItems: [],
    },
  };
}
