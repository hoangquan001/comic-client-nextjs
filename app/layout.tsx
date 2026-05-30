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

export const metadata: Metadata = {
  title: `${config.APP_NAME} - Đọc Truyện Tranh Online`,
  description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}. Kho truyện manga, manhwa, manhua khổng lồ, cập nhật liên tục.`,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log("RootLayout");
  return (
    <html lang="vi" className={cn("h-full", "antialiased", "font-sans")} suppressHydrationWarning>
      <body>

        <AppProviders>
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
        </AppProviders>
      </body>
    </html>
  );
}
