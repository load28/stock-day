import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@stock-day/core/providers/query/QueryProvider';
import { getQueryClient } from '@stock-day/core/providers/query/query-utils';
import { sessionQueryPrefetch } from '@stock-day/core/react-query/session-query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Stock Day',
  description: 'An app to collect stock information'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  await sessionQueryPrefetch(queryClient);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className={'flex flex-col min-h-screen'}>
          <QueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
