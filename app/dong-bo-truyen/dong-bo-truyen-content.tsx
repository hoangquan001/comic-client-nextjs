'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';

const SOURCES = [
  { value: 'nettruyen', label: 'NetTruyen' },
  { value: 'truyenqq', label: 'TruyenQQ' },
];

export default function DongBoTruyenPage() {
  const [source, setSource] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'form' | 'progress' | 'results'>('form');
  const [syncResult, setSyncResult] = useState<any>(null);

  function handleSync(e: React.FormEvent) {
    e.preventDefault();
    setStep('progress');
    // Simulate sync - in production this would call an API
    setTimeout(() => {
      setSyncResult({ success: true, synced: 0, total: 0 });
      setStep('results');
    }, 3000);
  }

  return (
    <main>
      <div className="my-2 container mx-auto w-full">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đồng bộ theo dõi truyện' }]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {step === 'form' && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-light-text mb-2">Đồng bộ theo dõi truyện</h1>
            <p className="text-neutral-500 mb-8">Đồng bộ danh sách theo dõi từ các trang khác</p>

            <form onSubmit={handleSync} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Nguồn đồng bộ</label>
                <div className="grid grid-cols-2 gap-3">
                  {SOURCES.map((s) => (
                    <button key={s.value} type="button" onClick={() => setSource(s.value)} className={`p-4 rounded-xl border-2 text-center font-medium transition-all cursor-pointer ${source === s.value ? 'border-primary-100 bg-primary-100/5 text-primary-100' : 'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {source && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tài khoản</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tên đăng nhập" className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-light-text focus:outline-none focus:ring-2 focus:ring-primary-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Mật khẩu</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-light-text focus:outline-none focus:ring-2 focus:ring-primary-100" />
                  </div>
                  <button type="submit" disabled={!username || !password} className="w-full py-3 bg-primary-100 text-white font-semibold rounded-xl hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer">Bắt đầu đồng bộ</button>
                </>
              )}
            </form>
          </div>
        )}

        {step === 'progress' && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-neutral-200 border-t-primary-100 rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-light-text mb-2">Đang đồng bộ...</h2>
            <p className="text-neutral-500">Vui lòng đợi trong khi hệ thống đồng bộ dữ liệu</p>
          </div>
        )}

        {step === 'results' && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <div className="text-6xl mb-4">{syncResult?.success ? '✅' : '❌'}</div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-light-text mb-2">{syncResult?.success ? 'Đồng bộ hoàn tất' : 'Đồng bộ thất bại'}</h2>
            <p className="text-neutral-500 mb-6">{syncResult?.success ? `Đã đồng bộ ${syncResult.synced}/${syncResult.total} truyện` : 'Đã có lỗi xảy ra'}</p>
            <button onClick={() => { setStep('form'); setSource(''); setUsername(''); setPassword(''); }} className="px-6 py-3 bg-primary-100 text-white font-semibold rounded-xl hover:bg-primary-200 border-none cursor-pointer">Đồng bộ mới</button>
          </div>
        )}

        {/* Footer info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <h2 className="font-semibold text-neutral-900 dark:text-light-text mb-2">Lưu ý bảo mật</h2>
            <ul className="text-sm text-neutral-500 space-y-1">
              <li>Thông tin đăng nhập được mã hóa</li>
              <li>Không lưu trữ thông tin đăng nhập</li>
              <li>Không chia sẻ với bên thứ ba</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <h2 className="font-semibold text-neutral-900 dark:text-light-text mb-2">Tính năng</h2>
            <ul className="text-sm text-neutral-500 space-y-1">
              <li>Đồng bộ giữa 2 website</li>
              <li>Tự động phát hiện xung đột</li>
              <li>Báo cáo chi tiết</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <h2 className="font-semibold text-neutral-900 dark:text-light-text mb-2">Hỗ trợ</h2>
            <ul className="text-sm text-neutral-500 space-y-1">
              <li>Hỗ trợ NetTruyen và TruyenQQ</li>
              <li>Đồng bộ chương đã đọc</li>
              <li>Sao lưu trước đồng bộ</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
