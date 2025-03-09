const config = {
  siteName: 'Next.js WordPress',
  siteDescription: 'Headless WordPress!',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL as string,
  revalidate: 3600, // 1 hour
  limitPosts: 10,

  // Setting Page Slug
  slugHomePage: 'home-page',
};

export default config;
