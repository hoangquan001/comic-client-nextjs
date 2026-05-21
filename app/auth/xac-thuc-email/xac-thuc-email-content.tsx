'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSendEmailConfirm } from '@/lib/hooks/use-account-queries';
import { toast } from 'sonner';

interface ConfirmEmailContentProps {
  mssg: string;
}

export default function ConfirmEmailContent({ mssg }: ConfirmEmailContentProps) {
  const sendEmailMutation = useSendEmailConfirm();

  const [countdown, setCountdown] = useState(0);
  const message = mssg || 'Hệ thống đã gửi email bạn đăng kí để xác thực tài khoản, xin vui lòng xác thực tài khoản';

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  function handleSendEmail() {
    if (countdown > 0) return;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('unconfirmedUser') : null;
    if (!stored) {
      toast.error('Không tìm thấy thông tin tài khoản');
      return;
    }
    const { email, id } = JSON.parse(stored);
    sendEmailMutation.mutate(
      { email, userId: id },
      {
        onSuccess: (res: any) => {
          setCountdown(60);
          if (res.status === 1) {
            toast.success(res.message || 'Email đã được gửi');
          } else {
            toast.error(res.message || 'Gửi email thất bại');
          }
        },
        onError: () => {
          toast.error('Đã có lỗi xảy ra');
        },
      }
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
      <div className="text-center">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Kiểm tra email của bạn</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-8">{message}</p>

        <div className="text-left space-y-3 mb-8 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary-100 text-white flex items-center justify-center text-sm font-bold shrink-0">1</span>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Mở ứng dụng email trên thiết bị của bạn</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary-100 text-white flex items-center justify-center text-sm font-bold shrink-0">2</span>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Tìm email từ ComicHub trong hộp thư đến</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary-100 text-white flex items-center justify-center text-sm font-bold shrink-0">3</span>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Nhấp vào liên kết xác thực trong email</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">Không nhận được email?</p>
          <button onClick={handleSendEmail} disabled={countdown > 0 || sendEmailMutation.isPending} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-100 to-primary-200 text-white font-semibold rounded-xl hover:from-primary-200 hover:to-primary-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            <span>📤</span>
            <span className="font-semibold">{countdown > 0 ? `${countdown} giây` : 'Gửi lại email'}</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Đã xác thực email? <Link href="/auth/dang-nhap" className="text-primary-100 hover:text-primary-200 font-semibold transition-colors duration-200">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
