import config from '@/lib/config';
import type { Metadata } from 'next';
import ApolloProvider from './ApolloProvider';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
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
    <html lang="th">
      <body>
        <ApolloProvider>
          <Header />
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
          <Footer />
        </ApolloProvider>
      </body>
    </html>
  );
}
