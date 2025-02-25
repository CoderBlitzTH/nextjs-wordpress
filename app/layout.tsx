import type { Metadata } from 'next';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ApolloProvider from '@/components/providers/ApolloProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import config from '@/lib/config';
import './globals.css';

/**
 * Setup metadata.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: `${config.siteName} - ${config.siteDescription}`,
  description: config.siteDescription,
};

/**
 * Root layout component.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ApolloProvider>
      <html lang="th" suppressHydrationWarning>
        <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            scriptProps={{ 'data-cfasync': false }}
          >
            <Header />
            <main className="mx-auto max-w-3xl px-4 pt-24 pb-16">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ApolloProvider>
  );
}
