'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MessageCircle } from 'lucide-react';

const ChatBox = dynamic(() => import('@/components/common/chat-box/chat-box'), { ssr: false });

export function ChatBubble() {
  const [showChat, setShowChat] = useState(false);
  const pathname = usePathname();
  const isChapterPage = /^\/truyen-tranh\/[^/]+\/[^/]+/.test(pathname);

  if (isChapterPage) return null;

  return (
    <>
      {!showChat && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
          <button
            onClick={() => setShowChat(true)}
            className="relative flex size-12 cursor-pointer items-center justify-center rounded-full border-none bg-primary-100 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-100/50"
            aria-label="Mở chat"
            title="Mở chat"
          >
            <span className="relative">
              <MessageCircle className="h-7 w-7" strokeWidth={2} />
            </span>
          </button>
          <div className="pointer-events-none absolute bottom-full right-0 mb-3 opacity-0 transition-opacity duration-200">
            <span className="whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white">Tin nhắn mới</span>
            <div className="absolute right-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900" />
          </div>
        </div>
      )}
      {showChat && <ChatBox isVisible onClose={() => setShowChat(false)} />}
    </>
  );
}
