import type { Metadata } from 'next';

import { Footer, Header } from '@/components/layout';
import config from '@/lib/config';
import ApolloProvider from '@/providers/ApolloProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import './globals.css';

/**
 * Setup metadata.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: config.siteName,
  description: config.siteDescription,
};

/**
 * Root layout component.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ApolloProvider>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            scriptProps={{ 'data-cfasync': false }}
          >
            <Header />
            <main className="mx-auto max-w-3xl px-4 pt-32 pb-16">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
