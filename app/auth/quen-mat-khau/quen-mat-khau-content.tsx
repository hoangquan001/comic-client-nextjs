'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForgetPassword } from '@/lib/hooks/use-account-queries';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const forgetMutation = useForgetPassword();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError('Vui lòng nhập địa chỉ email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Định dạng email không hợp lệ'); return; }
    setError('');
    setSubmitted(true);

    forgetMutation.mutate(email, {
      onSuccess: (res: any) => {
        if (res.status === 1) {
          setIsSuccess(true);
          setSubmitted(false);
        } else {
          setSubmitted(true);
          setIsSuccess(false);
          toast.error(res.message || 'Gửi yêu cầu thất bại');
        }
      },
      onError: () => {
        toast.error('Đã có lỗi xảy ra');
      },
    });
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
      {isSuccess ? (
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-light-text mb-3">Email đã được gửi!</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
            Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
          </p>
          <Link href="/auth/dang-nhap" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-100 text-white font-semibold rounded-xl hover:bg-primary-200 transition-colors duration-200">
            <span>🔙</span>
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Quên mật khẩu?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                <span>📧</span>
                Email đã đăng ký
              </label>
              <div className="relative">
                <input id="email" type="email" placeholder="Nhập địa chỉ email của bạn" className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-neutral-700 focus:shadow-lg focus:-translate-y-px" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>}
            </div>

            <button type="submit" disabled={forgetMutation.isPending} className="w-full bg-gradient-to-r from-primary-100 to-primary-200 text-white font-semibold py-3 px-6 rounded-xl hover:from-primary-200 hover:to-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <span className="flex items-center justify-center gap-2">
                <span>📤</span>
                <span className="font-semibold">{forgetMutation.isPending ? 'Đang gửi...' : 'Gửi hướng dẫn khôi phục'}</span>
              </span>
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Nhớ lại mật khẩu? <Link href="/auth/dang-nhap" className="text-primary-100 hover:text-primary-200 font-semibold transition-colors duration-200">Đăng nhập ngay</Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
