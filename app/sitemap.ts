import type { GetSitemapPostsAndPagesQuery } from '@/graphql/generated/graphql';
import config from '@/lib/config';
import { getSitemapPostsAndPages } from '@/lib/queries/sitemap';
import { MetadataRoute } from 'next';

// Enable ISR with 1-hour revalidation
export const revalidate = 3600;

type PageNode = NonNullable<GetSitemapPostsAndPagesQuery['pages']>['nodes'][0];
type PostNode = NonNullable<GetSitemapPostsAndPagesQuery['posts']>['nodes'][0];

// Helper function to create sitemap entries
function createSitemapEntry(
  node: PageNode | PostNode,
  type: 'page' | 'post'
): MetadataRoute.Sitemap[0] | undefined {
  // Skip if node is undefined or null
  if (!node) return undefined;

  //   // Skip if robots meta contains noindex
  //   if (node.seo?.robots?.includes('noindex')) {
  //     return undefined;
  //   }

  // Use canonical URL from SEO or fallback to site URL + slug with different paths for pages and posts
  let url;
  if (node.seo?.canonicalUrl) {
    url = node.seo.canonicalUrl;
  } else {
    // Different URL structure for pages and posts
    if (type === 'page') {
      url = `${config.siteUrl}/${node.slug || ''}`;
    } else {
      // For posts/blogs
      url = `${config.siteUrl}/blog/${node.slug || ''}`;
    }
  }

  // Make sure we have a valid URL
  if (!url || url === '') return undefined;

  // Create a valid date object or use current date as fallback
  const lastModified = node.modified ? new Date(node.modified) : new Date();

  return {
    url,
    lastModified,
    changeFrequency: type === 'page' ? 'monthly' : 'weekly',
    priority: type === 'page' ? 0.8 : 0.6,
  };
}

/**
 * Generate sitemap for the website.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const data = await getSitemapPostsAndPages(200);

    const entries: MetadataRoute.Sitemap = [];

    // Add homepage
    entries.push({
      url: config.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Add pages
    const pages = data?.pages || [];
    pages.forEach(node => {
      const entry = createSitemapEntry(node, 'page');
      if (entry) entries.push(entry);
    });

    // Add posts
    const posts = data?.posts || [];
    posts.forEach(node => {
      const entry = createSitemapEntry(node, 'post');
      if (entry) entries.push(entry);
    });

    return entries;
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return basic sitemap in case of error
    return [
      {
        url: config.siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
