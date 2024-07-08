import type { PageServerLoad } from './$types.js';

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
      .create({ name, session: locals.user.record.session[0], mobileLayout: 1 });
    await locals.pb
      ?.collection("session")
      .update(locals.user.record.session[0], {
        "node+": [node?.id],
      });
  },
};

export const load: PageServerLoad = async ({ locals }) => {

locals.pb?.autoCancellation(false)
  const events = async () => {
    const e = await locals.pb?.collection("events").getList(1, 25, {
      sort: "-created",
      fields:
        "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
      filter: 'title != "Running Detected" && matchScore = "0"'
    });
    return e?.items.map(
      (ee) =>
        ({
          ...ee,
          created: new Date(ee.created),
        }) as unknown as Event,
    );
  }

  const otherEvents = async () => {
    const e = await locals.pb?.collection("events").getList(1, 25, {
      sort: "-created",
      fields:
        "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
      filter: 'title != "Running Detected" && matchScore != "0"'
    });
    return e?.items.map(
      (ee) =>
        ({
          ...ee,
          created: new Date(ee.created),
        }) as unknown as Event,
    );
  }

  const runningEvents = async () => {
    const e = await locals.pb?.collection("events").getList(1, 25, {
      sort: "-created",
      fields:
        "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
      filter: 'title = "Running Detected"'
    });
    return e?.items.map(
      (ee) =>
        ({
          ...ee,
          created: new Date(ee.created),
        }) as unknown as Event,
    );
  }

  const gelleryItems = async () => {
    const g = await locals.pb?.collection("faceGallery").getFullList({
      sort: "-lastSeen",
      expand: "events",
      fields: "name,lastSeen,images,expand.events.frameImage",
    });
    return g?.map((e) => ({
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
    }));

  }

  const imposterItems = async () => {
    const i = await locals.pb
      ?.collection("impostors")
      .getList(1, 10, {
        sort: "-lastSeen",
        expand: "events",
        fields: "name,lastSeen,expand.events.frameImage",
      });

    return i?.items.map((e) => ({
      name: "Unknown",
      lastSeen: e.lastSeen,
      images: e.expand.events
        .map((f) => f.frameImage)
        .slice(-8)
        .reverse(),
      created: new Date(),
      updated: new Date(),
    }));

  }

  return {
    events: events(),
    otherEvents: otherEvents(),
    runningEvents: runningEvents(),
    galleryItems: gelleryItems(),
    imposterItems: imposterItems(),
  };
}
