import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { toast } from 'svelte-sonner';

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

    await locals.pb?.collection('session').update(locals.user.record.session[0], {
      activeNode: node?.id
    })
  },
};

export const load: PageServerLoad = async ({ locals, url }) => {
  let featureArr;
  // Get the query parameters from the URL
  const queryParams = url.searchParams;

  // Access specific query parameters
  const paymentStatus = queryParams.get('payment'); // Replace 'param1' with your actual query parameter name
  locals.pb?.autoCancellation(false);

  const linkUrl = `https://license.lenscorp.cloud/getLicense`;
  console.log(locals?.user, 'id here')
  try {
    const res = await fetch(linkUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: locals?.user?.record?.id })
    });

    const data = await res?.json();
    featureArr = data;
  } catch (error) {
    console.log(error);
    toast.error("Somthing went wrong while getting license");
  }

  let licensePurchase = !!paymentStatus;
  if (!licensePurchase) {
    throw redirect(302, "/purchase");
  }

  // const events = async () => {
  //   const abortController = new AbortController();
  //   const timeoutPromise = new Promise((_, reject) =>
  //     setTimeout(() => reject(new Error('Timeout')), 10000)
  //   );

  //   try {
  //     const fetchPromise = locals.pb?.collection("events").getList(1, 100, {
  //       sort: "-created",
  //       fields: "title,description,created,updated,frameImage,score,matchScore,session,node,camera",
  //     }, { signal: abortController.signal });

  //     const e = await Promise.race([fetchPromise, timeoutPromise]);

  //     return e?.items.map(ee => ({
  //       ...ee,
  //       created: new Date(ee.created),
  //     }) as unknown as Event) || [];
  //   } catch (error) {
  //     console.error('Events fetch error:', error instanceof Error ? error.message : String(error));
  //     return [];
  //   } finally {
  //     abortController.abort();
  //   }
  // }

  const events = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const e = await locals.pb?.collection("events").getList(1, 100, {
        sort: "-created",
        expand: 'camera',
        fields: 'title,description,created,updated,frameImage,score,matchScore,session,node,camera,expand.camera.name',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return e?.items.map(
        (ee) =>
          ({
            node: ee.node,
            camera: ee.camera,
            frameImage: ee.frameImage,
            cameraName: ee.expand.camera.name,
            created: new Date(ee.created),
            title: ee.title,
            description: ee.description,
            score: ee.score,
            matchScore: ee.matchScore,
            updated: ee.updated,
          }) as unknown as Event,
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Events request timed out');
        return [];
      }
      return []

    }
  }

  const gelleryItems = async () => {
    const g = await locals.pb?.collection("faceGallery").getFullList({
      sort: "-lastSeen",
      expand: "events",
      fields: "name,lastSeen,images,expand.events.frameImage",
      filter: `blackList != true`
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
    const g = await locals.pb?.collection("faceGallery").getFullList({
      sort: "-lastSeen",
      expand: "events",
      fields: "name,lastSeen,images,expand.events.frameImage",
      filter: `blackList = true`
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

  return {
    events: events(),
    galleryItems: gelleryItems(),
    imposterItems: imposterItems(),
    paymentStatus: paymentStatus,
    featuresArr: featureArr
  };
}
