/**
 * Seed script for Global header navigation
 * 
 * Updates the global single type with header navigation items:
 * - Industries
 * - Cases
 * - Insights
 * - Company
 * - Careers
 * - Contact
 */

async function seedGlobalHeader() {
  const headerData = {
    navItems: [
      { label: 'Industries', href: '/industries', isExternal: false },
      { label: 'Cases', href: '/cases', isExternal: false },
      { label: 'Insights', href: '/insights', isExternal: false },
      { label: 'Company', href: '/company', isExternal: false },
      { label: 'Careers', href: '/careers', isExternal: false },
      { label: 'Contact', href: '/contact', isExternal: false },
    ],
    logo: {
      logoText: 'ADC',
      href: '/',
    },
  };

  try {
    // Check if global already exists
    const existing = await strapi
      .documents('api::global.global')
      .findFirst();

    if (existing) {
      console.log('✅ Global exists, updating header...');
      
      await strapi
        .documents('api::global.global')
        .update({
          documentId: existing.documentId,
          data: {
            header: headerData,
          },
        });
      
      console.log('✅ Global header updated successfully');
    } else {
      console.log('Creating new global with header...');
      
      await strapi
        .documents('api::global.global')
        .create({
          data: {
            title: 'ADC Website',
            description: 'Amsterdam Data Collective',
            header: headerData,
          },
        });
      
      console.log('✅ Global created with header successfully');
    }

    // Publish the global
    const global = await strapi
      .documents('api::global.global')
      .findFirst();

    if (global && !global.publishedAt) {
      await strapi
        .documents('api::global.global')
        .publish({
          documentId: global.documentId,
        });
      
      console.log('✅ Global published');
    }

    console.log('\n📋 Header Navigation Items:');
    headerData.navItems.forEach((item) => {
      console.log(`  - ${item.label} (${item.href})`);
    });
    console.log('\n');
  } catch (error) {
    console.error('❌ Error seeding global header:', error);
    throw error;
  }
}

export default seedGlobalHeader;
