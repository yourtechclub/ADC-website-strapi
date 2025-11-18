import { useSearchParams } from 'react-router';

/**
 * Preview Banner Component
 * 
 * Shows a banner when viewing content in preview mode from Strapi
 */
export function PreviewBanner() {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const status = searchParams.get('status');

  if (!isPreview) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-semibold">
      Preview Mode
      {status && ` - Viewing ${status} version`}
    </div>
  );
}
