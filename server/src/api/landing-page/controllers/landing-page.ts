/**
 * landing-page controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::landing-page.landing-page', ({ strapi }) => ({
  async find(ctx) {
    const response = await super.find(ctx);
    
    // Fetch all industries to inject into Industries blocks
    const industries = await strapi.documents('api::industry.industry').findMany({
      populate: ['image'],
      status: 'published',
    });

    // Fetch all cases to inject into Featured Cases blocks
    const cases = await strapi.documents('api::case.case').findMany({
      populate: ['image'],
      status: 'published',
    });

    // Inject data into blocks
    if (response.data?.blocks) {
      response.data.blocks = response.data.blocks.map((block: any) => {
        if (block.__component === 'blocks.industries') {
          return {
            ...block,
            industries: industries || [],
          };
        }
        if (block.__component === 'blocks.featured-cases') {
          return {
            ...block,
            cases: cases || [],
          };
        }
        return block;
      });
    }

    return response;
  },
}));
