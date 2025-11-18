// Function to generate preview pathname based on content type and document
const getPreviewPathname = (uid: string, { locale, document }: { locale?: string; document: any }): string | null => {
  const { slug } = document;
  
  // Handle different content types with their specific URL patterns
  switch (uid) {
    // Handle pages with predefined routes
    case "api::page.page":
      switch (slug) {
        case "homepage":
          return locale ? `/${locale}` : "/";
        default:
          return slug ? `/${slug}` : null;
      }
    
    // Handle landing pages
    case "api::landing-page.landing-page": {
      return "/home"; // Our landing page route
    }
    
    // Handle articles
    case "api::article.article": {
      if (!slug) {
        return "/articles";
      }
      return `/articles/${slug}`;
    }
    
    default: {
      return null; // No preview available for other content types
    }
  }
};

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL', 'http://localhost:5174'),
      async handler(uid, { documentId, locale, status }) {
        // Fetch the complete document from Strapi
        const document = await strapi.documents(uid).findOne({ documentId });
        
        // Generate the preview pathname based on content type and document
        const pathname = getPreviewPathname(uid, { locale, document });

        // Disable preview if the pathname is not found
        if (!pathname) {
          return null;
        }

        // For React Router, we can use query parameters for preview mode
        const urlSearchParams = new URLSearchParams({
          preview: 'true',
          status: status || 'draft',
        });
        
        return `${env('CLIENT_URL', 'http://localhost:5174')}${pathname}?${urlSearchParams}`;
      },
    },
  },
});
