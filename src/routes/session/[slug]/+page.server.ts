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
