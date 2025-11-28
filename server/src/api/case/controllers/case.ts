export default {
  async find(ctx) {
    const cases = await strapi.documents("api::case.case").findMany({
      populate: ["image"],
      status: "published",
    });

    return { data: cases };
  },

  async findOne(ctx) {
    const { slug } = ctx.params;

    const cases = await strapi.documents("api::case.case").findMany({
      filters: { slug },
      populate: ["image", "content"],
      status: "published",
    });

    if (!cases || cases.length === 0) {
      return ctx.notFound("Case not found");
    }

    return { data: cases[0] };
  },
};
