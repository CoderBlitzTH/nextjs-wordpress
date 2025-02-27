const config = {
  siteName: 'Next.js WordPress',
  siteDescription: 'Headless WordPress!',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  revalidate: 3600, // 1 hour
  limitPosts: 10,
};

export default config;
