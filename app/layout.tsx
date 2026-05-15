import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChatBubble } from '@/components/layout/chat-bubble';
import { LoadingBar } from '@/components/layout/loading-bar';
import { ToastContainer } from '@/components/layout/toast-container';
import { config } from '@/lib/config';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: `${config.APP_NAME} - Đọc Truyện Tranh Online`,
  description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}. Kho truyện manga, manhwa, manhua khổng lồ, cập nhật liên tục.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${roboto.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-roboto)]">
        <AppProviders>
          <div className="wrapper-container min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatBubble />
            <LoadingBar />
            <ToastContainer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
