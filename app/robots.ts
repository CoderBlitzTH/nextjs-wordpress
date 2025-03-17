import type { MetadataRoute } from 'next';

import config from '@/lib/config';

/**
 * Generate robots.txt.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${config.siteUrl}/sitemap.xml`,
  };
}
