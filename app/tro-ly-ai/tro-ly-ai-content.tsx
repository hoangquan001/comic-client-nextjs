'use client';

import Image from 'next/image';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';

export default function TroLyAIPage() {
  function openChatBox() {
    const event = new CustomEvent('openChatBox');
    window.dispatchEvent(event);
  }

  return (
    <main>
      <div className="my-2 container mx-auto w-full">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Trợ lý ảo' }]} />
      </div>

      <div className="py-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <Image src="/option4.png" alt="AI Assistant" className="w-32 h-32 rounded-full border-4 border-blue-300 dark:border-primary-100 shadow-lg object-cover" width={128} height={128} />
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-lg max-w-sm">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Xin chào! Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì về truyện tranh nhé!</p>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-700 dark:text-light-text mb-6">Trợ lý AI thông minh</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Khám phá thế giới truyện tranh với sự hỗ trợ của AI. Tìm kiếm, gợi ý và trò chuyện về những bộ truyện yêu thích của bạn!
          </p>
          <button onClick={openChatBox} className="inline-flex items-center gap-3 px-8 py-4 bg-primary-100 hover:bg-primary-200 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border-none cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Bắt đầu trò chuyện
          </button>
        </div>
      </div>
    </main>
  );
}
