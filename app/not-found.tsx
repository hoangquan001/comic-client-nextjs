'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-extrabold text-primary-100/20 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="120" r="60" className="fill-primary-100/10" />
              <circle cx="100" cy="80" r="35" className="fill-primary-100/80" />
              <circle cx="90" cy="75" r="3" fill="#fff" />
              <circle cx="110" cy="75" r="3" fill="#fff" />
              <path d="M85 90 Q100 85 115 90" stroke="#fff" strokeWidth="2" fill="none" />
              <ellipse cx="150" cy="50" rx="30" ry="20" className="fill-white stroke-primary-100" strokeWidth="2" />
              <path d="M130 60 L125 70 L140 65 Z" className="fill-white" />
              <text x="150" y="55" textAnchor="middle" fontSize="12" className="fill-primary-100">Oops!</text>
            </svg>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3">Trang Không Tồn Tại</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-100 text-white hover:bg-primary-100/90 transition-colors font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
