export default {
  async find(ctx) {
    const industries = await strapi.documents('api::industry.industry').findMany({
      ...ctx.query,
      populate: ['image'],
    });
    return industries;
  },

  async findOne(ctx) {
    const { slug } = ctx.params;
    
    const industries = await strapi.documents('api::industry.industry').findMany({
      filters: { slug },
      populate: ['image']
    });

    if (!industries || industries.length === 0) {
      return ctx.notFound('Industry not found');
    }

    return industries[0];
  },
};
