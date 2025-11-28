export default {
  routes: [
    {
      method: 'GET',
      path: '/industries',
      handler: 'industry.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/industries/:slug',
      handler: 'industry.findOne',
      config: {
        auth: false,
      },
    },
  ],
};
