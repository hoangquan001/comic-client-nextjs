'use client';

import Link from 'next/link';

export function ChatBubble() {
  return (
    <Link
      href="/tro-ly-ai"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Trợ lý AI"
    >
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </Link>
  );
}
