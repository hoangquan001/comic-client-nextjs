import type { Metadata } from 'next';
import Image from 'next/image';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Tài khoản', '/auth');

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-200/70 to-red-500/20 dark:from-neutral-900 dark:to-neutral-800">
      {/* Background bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 text-4xl opacity-20 animate-bounce">📚</div>
          <div className="absolute top-40 right-32 text-4xl opacity-20 animate-bounce [animation-delay:1s]">🎨</div>
          <div className="absolute bottom-40 left-32 text-4xl opacity-20 animate-bounce [animation-delay:2s]">⭐</div>
          <div className="absolute bottom-20 right-20 text-4xl opacity-20 animate-bounce [animation-delay:0.5s]">💫</div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-7xl lg:mx-auto">
        {/* Left branding - hidden on mobile */}
        <div className="hidden lg:flex lg:items-center lg:justify-center">
          <div className="text-white text-center max-w-md">
            <div className="mb-8">
              <div className="text-6xl mb-2 size-28">
                <Image src="/30-4-favicon.png" alt="MeTruyenMoi Logo" className="w-28 h-28 rounded-2xl" width={112} height={112} unoptimized  />
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white">
                MeTruyen<span className="text-primary-100">Moi</span>
              </h1>
            </div>
            <p className="text-xl opacity-90 mb-8">Luôn cập nhật truyện mới mỗi ngày</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-lg">
                <span className="text-2xl"><svg className="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg></span>
                <span className="opacity-90">Hàng nghìn bộ truyện hot</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="text-2xl"><svg className="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg></span>
                <span className="opacity-90">Cập nhật liên tục</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="text-2xl"><svg className="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg></span>
                <span className="opacity-90">Gợi ý cá nhân hóa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - page content */}
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
