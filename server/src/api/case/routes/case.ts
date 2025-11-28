export default {
  routes: [
    {
      method: "GET",
      path: "/cases",
      handler: "case.find",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/cases/:slug",
      handler: "case.findOne",
      config: {
        auth: false,
      },
    },
  ],
};
