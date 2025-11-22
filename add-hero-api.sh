#!/bin/bash

# Script to add Hero section content to Landing Page
# Run: chmod +x add-hero-api.sh && ./add-hero-api.sh

STRAPI_URL="http://localhost:1337"

echo "🌱 Adding Hero section content to Landing Page..."
echo ""

# Wait for Strapi to be ready
echo "⏳ Waiting for Strapi to be ready..."
for i in {1..30}; do
  if curl -sf "$STRAPI_URL/api/landing-page" > /dev/null 2>&1; then
    echo "✅ Strapi is ready"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Strapi is not responding. Please start it with: cd server && npm run develop"
    exit 1
  fi
  sleep 1
done

echo ""
echo "📄 Fetching current landing page..."

# Get current landing page
LANDING_PAGE=$(curl -s "$STRAPI_URL/api/landing-page?populate=deep")

# Create hero block payload
HERO_PAYLOAD='{
  "data": {
    "blocks": [
      {
        "__component": "blocks.hero",
        "heading": "Leading the most impactful AI transformation",
        "subtitle": null,
        "showMenuItemsInHero": true,
        "ctaButtons": [
          {
            "href": "/contact",
            "label": "Learn more",
            "isExternal": false,
            "isButtonLink": true,
            "type": "PRIMARY"
          }
        ],
        "backgroundImage": null
      }
    ]
  }
}'

echo "💾 Updating landing page with hero content..."

# Update landing page
RESULT=$(curl -s -X PUT "$STRAPI_URL/api/landing-page" \
  -H "Content-Type: application/json" \
  -d "$HERO_PAYLOAD")

# Check if update was successful
if echo "$RESULT" | grep -q "blocks"; then
  echo "✅ Hero section added successfully!"
  echo ""
  echo "📋 Hero block configuration:"
  echo "  ✓ Heading: \"Leading the most impactful AI transformation\""
  echo "  ✓ Show menu items in hero: Yes (desktop)"
  echo "  ✓ CTA button: \"Learn more\" → /contact (mobile)"
  echo ""
  echo "🌐 View at: http://localhost:5174"
  echo "⚙️  Edit in Strapi: http://localhost:1337/admin/content-manager/single-types/api::landing-page.landing-page"
else
  echo "❌ Failed to update landing page"
  echo "Response: $RESULT"
  exit 1
fi
