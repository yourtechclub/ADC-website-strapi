#!/usr/bin/env node

/**
 * Simple script to add Hero section content to Landing Page via Strapi API
 * Usage: node add-hero-content.mjs
 * 
 * Make sure Strapi is running on http://localhost:1337
 */

const STRAPI_URL = 'http://localhost:1337';

async function addHeroContent() {
  console.log('🌱 Adding Hero section content to Landing Page...\n');

  try {
    // 1. Get the landing page
    console.log('📄 Fetching current landing page...');
    const landingPageResponse = await fetch(
      `${STRAPI_URL}/api/landing-page?populate=deep`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!landingPageResponse.ok) {
      console.error('❌ Failed to fetch landing page.');
      console.error('Make sure Strapi is running on http://localhost:1337');
      console.error('Response:', landingPageResponse.status, landingPageResponse.statusText);
      process.exit(1);
    }

    const landingPageData = await landingPageResponse.json();
    const landingPage = landingPageData.data;

    console.log('✅ Landing page found\n');

    // 2. Prepare hero block
    const heroBlock = {
      __component: 'blocks.hero',
      heading: 'Leading the most impactful AI transformation',
      subtitle: null,
      showMenuItemsInHero: true,
      ctaButtons: [
        {
          href: '/contact',
          label: 'Learn more',
          isExternal: false,
          isButtonLink: true,
          type: 'PRIMARY',
        },
      ],
      backgroundImage: null, // We'll add this separately if needed
    };

    // 3. Get existing blocks
    const existingBlocks = landingPage.blocks || [];
    
    // Check if hero already exists
    const heroIndex = existingBlocks.findIndex(
      (block) => block.__component === 'blocks.hero'
    );

    let updatedBlocks;
    if (heroIndex >= 0) {
      console.log('🔄 Updating existing hero block...');
      updatedBlocks = [...existingBlocks];
      updatedBlocks[heroIndex] = {
        ...existingBlocks[heroIndex],
        ...heroBlock,
      };
    } else {
      console.log('➕ Adding new hero block at the beginning...');
      updatedBlocks = [heroBlock, ...existingBlocks];
    }

    // 4. Update landing page
    console.log('💾 Saving to Strapi...');
    const updateResponse = await fetch(
      `${STRAPI_URL}/api/landing-page`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            blocks: updatedBlocks,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update landing page: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ Hero section added successfully!\n');
    console.log('📋 Hero block configuration:');
    console.log('  ✓ Heading: "Leading the most impactful AI transformation"');
    console.log('  ✓ Show menu items in hero: Yes (desktop navigation below title)');
    console.log('  ✓ CTA button: "Learn more" → /contact (mobile only)');
    console.log('');
    console.log('🌐 View at: http://localhost:5174');
    console.log('⚙️  Edit in Strapi: http://localhost:1337/admin/content-manager/single-types/api::landing-page.landing-page');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
addHeroContent();
