/**
 * Seed script for Navigation content type
 * 
 * Creates the navigation single type with initial menu items:
 * - Industries
 * - Cases
 * - Insights
 * - Company
 * - Careers
 * - Contact
 */

async function seedNavigation() {
  const navigationData = {
    menuItems: [
      { label: 'Industries', url: '/industries', order: 10, isExternal: false },
      { label: 'Cases', url: '/cases', order: 20, isExternal: false },
      { label: 'Insights', url: '/insights', order: 30, isExternal: false },
      { label: 'Company', url: '/company', order: 40, isExternal: false },
      { label: 'Careers', url: '/careers', order: 50, isExternal: false },
      { label: 'Contact', url: '/contact', order: 60, isExternal: false },
    ],
  };

  try {
    // Check if navigation already exists
    const existing = await strapi
      .documents('api::navigation.navigation')
      .findFirst();

    if (existing) {
      console.log('✅ Navigation already exists, updating...');
      
      await strapi
        .documents('api::navigation.navigation')
        .update({
          documentId: existing.documentId,
          data: navigationData,
        });
      
      console.log('✅ Navigation updated successfully');
    } else {
      console.log('Creating new navigation...');
      
      await strapi
        .documents('api::navigation.navigation')
        .create({
          data: navigationData,
        });
      
      console.log('✅ Navigation created successfully');
    }

    // Publish the navigation
    const nav = await strapi
      .documents('api::navigation.navigation')
      .findFirst();

    if (nav && !nav.publishedAt) {
      await strapi
        .documents('api::navigation.navigation')
        .publish({
          documentId: nav.documentId,
        });
      
      console.log('✅ Navigation published');
    }

    console.log('\n📋 Navigation Menu Items:');
    navigationData.menuItems.forEach((item) => {
      console.log(`  - ${item.label} (${item.url})`);
    });
    console.log('\n');
  } catch (error) {
    console.error('❌ Error seeding navigation:', error);
    throw error;
  }
}

export default seedNavigation;
