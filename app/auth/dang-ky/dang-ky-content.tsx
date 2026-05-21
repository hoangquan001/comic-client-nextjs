'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useRegister } from '@/lib/hooks/use-account-queries';
import EyeIcon from '@/components/common/eye-icon/eye-icon';
import type { IServiceResponse } from '@/types';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accept, setAccept] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Vui lòng nhập họ và tên';
    if (!email.trim()) e.email = 'Vui lòng nhập địa chỉ email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Định dạng email không hợp lệ';
    if (!password) e.password = 'Vui lòng nhập mật khẩu';
    if (!confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (password !== confirmPassword) e.confirmPassword = 'Mật khẩu xác nhận không đúng';
    if (!accept) e.accept = 'Vui lòng đồng ý với điều khoản sử dụng';
    if (!turnstileSiteKey) e.turnstile = 'Chưa cấu hình Cloudflare Turnstile site key';
    else if (!turnstileToken) e.turnstile = 'Vui lòng hoàn tất xác minh bảo mật';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function resetTurnstile() {
    setTurnstileToken('');
    turnstileRef.current?.reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    registerMutation.mutate(
      { name, email, password, turnstileToken },
      {
        onSuccess: (res: IServiceResponse<unknown>) => {
          resetTurnstile();
          if (res.status === 1) {
            setSubmitted(false);
            toast.success(res.message || 'Đăng ký thành công');
            setTimeout(() => router.push('/auth/dang-nhap'), 1000);
          } else {
            toast.error(res.message || 'Đăng ký thất bại');
          }
        },
        onError: () => {
          resetTurnstile();
          toast.error('Đăng ký thất bại, đã có lỗi xảy ra');
        },
      }
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Tạo tài khoản mới</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">Chỉ cần vài bước đơn giản để bắt đầu đọc truyện</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <svg className="size-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>
            Họ và tên
          </label>
          <div className="relative">
            <input id="name" type="text" placeholder="Nhập họ và tên của bạn" className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-neutral-700 focus:shadow-lg focus:-translate-y-px" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); if (submitted) validate(); }} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Email
          </label>
          <div className="relative">
            <input id="email" type="email" placeholder="Nhập địa chỉ email của bạn" className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-neutral-700 focus:shadow-lg focus:-translate-y-px" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); if (submitted) validate(); }} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">⚠️ {errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <svg className="size-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><circle cx="12" cy="16" r="1" /><path d="M8 11v-4a4 4 0 0 1 8 0v4" /></svg>
            Mật khẩu
          </label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Tạo mật khẩu mạnh" className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-neutral-700 focus:shadow-lg focus:-translate-y-px" autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); if (submitted) validate(); }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors duration-200 border-none bg-transparent cursor-pointer">
              <EyeIcon show={showPassword} />
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input id="confirm-password" type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-neutral-700 focus:shadow-lg focus:-translate-y-px" autoComplete="new-password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (submitted) validate(); }} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors duration-200 border-none bg-transparent cursor-pointer">
              <EyeIcon show={showConfirm} />
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠️ {errors.confirmPassword}</p>}
        </div>

        {/* Terms */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <input id="accept" type="checkbox" checked={accept} onChange={(e) => { setAccept(e.target.checked); if (submitted) validate(); }} className="w-4 h-4 mt-1 text-primary-100 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-100 dark:focus:ring-primary-100 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600" />
            <label htmlFor="accept" className="text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
              Tôi đồng ý với <a href="/dieu-khoan" className="text-primary-100 hover:underline">Điều khoản sử dụng</a> và <a href="/chinh-sach-bao-mat" className="text-primary-100 hover:underline">Chính sách bảo mật</a>
            </label>
          </div>
          {errors.accept && <p className="text-red-500 text-xs mt-1">⚠️ {errors.accept}</p>}
        </div>

        <div className="space-y-2">
          {turnstileSiteKey ? (
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              options={{ action: 'register', theme: 'auto', size: 'flexible' }}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setErrors((prev) => ({ ...prev, turnstile: '' }));
              }}
              onExpire={() => {
                setTurnstileToken('');
                setErrors((prev) => ({ ...prev, turnstile: 'Phiên xác minh đã hết hạn, vui lòng thử lại' }));
              }}
              onError={() => {
                setTurnstileToken('');
                setErrors((prev) => ({ ...prev, turnstile: 'Không thể xác minh bảo mật, vui lòng thử lại' }));
              }}
            />
          ) : (
            <p className="text-red-500 text-xs">Chưa cấu hình Cloudflare Turnstile site key</p>
          )}
          {errors.turnstile && <p className="text-red-500 text-xs mt-1">⚠️ {errors.turnstile}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={registerMutation.isPending || !turnstileSiteKey} className="w-full bg-gradient-to-r from-primary-100 to-primary-200 text-white font-semibold py-3 px-6 rounded-xl hover:from-primary-200 hover:to-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          <span className="flex items-center justify-center gap-2">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            <span className="font-semibold">{registerMutation.isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</span>
          </span>
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Hoặc</span>
        <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600" />
      </div>

      {/* Login link */}
      <div className="text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Đã có tài khoản? <Link href="/auth/dang-nhap" className="text-primary-100 hover:text-primary-200 font-semibold transition-colors duration-200">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}
