import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { Header ,Footer, Nav} from '@/components/layout';
import { ChatBubble } from '@/components/layout/chat-bubble';
import { PopupManager } from '@/components/layout/popup-manager';
import { config } from '@/lib/config';
import { cn } from "@/lib/utils";
import { Toaster } from '@/components/ui/sonner';
import { Suspense } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { getServerSettings } from '@/lib/utils/cookie';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  metadataBase: new URL(config.BASE_URL),
  title: {
    default: `${config.APP_NAME} - Đọc Truyện Tranh Online Miễn Phí`,
    template: `%s | ${config.APP_NAME}`,
  },
  description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}. Kho truyện manga, manhwa, manhua khổng lồ, cập nhật liên tục.`,
  applicationName: config.APP_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: config.APP_NAME,
  publisher: config.APP_NAME,
  category: 'entertainment',
  classification: 'Manga, Manhwa, Manhua, Truyện tranh',
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: config.BASE_URL,
    siteName: config.APP_NAME,
    title: `${config.APP_NAME} - Đọc Truyện Tranh Online Miễn Phí`,
    description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}. Cập nhật manga, manhwa, manhua nhanh nhất.`,
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: config.APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.APP_NAME} - Đọc Truyện Tranh Online Miễn Phí`,
    description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}.`,
    images: ['/logo.png'],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSettings = await getServerSettings();
  const theme = initialSettings.theme;
  const isDark = theme === 'dark';

  return (
    <html
      lang="vi"
      className={cn("h-full", "antialiased", "font-sans", isDark && "dark")}
      style={{ colorScheme: isDark ? 'dark' : 'light' }}
      suppressHydrationWarning
    >
      <body>
        <JsonLdScript data={[generateWebsiteSchema(), generateOrganizationSchema()]} />

        <AppProviders initialSettings={initialSettings}>
          <ThemeProvider>
            <NextTopLoader
              zIndex={1000}
              easing="ease-in-out"
              speed={400}
              height={4}
              showSpinner={false}
              color="#F86E4C"
            />
            <div className="bg-white dark:bg-dark-bg dark:text-light-text flex flex-col">
              <Header />
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
              <Suspense>
                <Toaster />
                <ChatBubble />
                <PopupManager />
              </Suspense>

            </div>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}
