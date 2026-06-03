'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useLogin, useLoginWithSocial } from '@/lib/hooks/use-account-queries';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import EyeIcon from '@/components/common/eye-icon/eye-icon';
import type { IServiceResponse, IUser } from '@/types';
import { toast } from 'sonner';

const GoogleSignInButton = dynamic(
  () => import('@/components/common/google-signin-button/google-signin-button'),
  { ssr: false }
);

type LoginUser = IUser & { status?: number };

export default function LoginPage() {
  const router = useRouter();
  const saveUser = useAuthStore((s) => s.saveUser);
  const loginMutation = useLogin();
  const socialLoginMutation = useLoginWithSocial();
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shouldLoadTurnstile, setShouldLoadTurnstile] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; turnstile?: string }>({});

  function validate(): boolean {
    const e: { email?: string; password?: string; turnstile?: string } = {};
    if (!email.trim()) e.email = 'Vui lòng nhập địa chỉ email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Định dạng email không hợp lệ';
    if (!password) e.password = 'Vui lòng nhập mật khẩu';
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

    loginMutation.mutate(
      { email, password, turnstileToken },
      {
        onSuccess: (res: IServiceResponse<LoginUser>) => {
          resetTurnstile();
          if (res.status === 1 && res.data) {
            setSubmitted(false);
            if (remember) {
              localStorage.setItem('rememberMe', JSON.stringify({ remember: true, email, password }));
            } else {
              localStorage.removeItem('rememberMe');
            }
            if (res.data.status === 1) {
              saveUser(res.data);
              router.push('/');
            } else {
              router.refresh();
            }
          } else {
            setSubmitted(true);
            toast.error(res.message || 'Đăng nhập thất bại');
          }
        },
        onError: () => {
          resetTurnstile();
          toast.error('Đăng nhập thất bại, đã có lỗi xảy ra');
        },
      }
    );
  }

  function handleGoogleSuccess(data: { email: string; firstName: string; lastName: string; photoUrl?: string }) {
    socialLoginMutation.mutate(data, {
      onSuccess: (res: IServiceResponse<IUser>) => {
        if (res.status === 1 && res.data) {
          if (res.status === 1) {
            saveUser(res.data);
            router.push('/');
          } else {
            router.refresh();
          }
        } else {
          toast.error(res.message || 'Đăng nhập Google thất bại');
        }
      },
      onError: () => {
        toast.error('Đăng nhập Google thất bại, đã có lỗi xảy ra');
      },
    });
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Chào mừng trở lại!</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">Đăng nhập để tiếp tục hành trình đọc truyện của bạn</p>
      </div>

      <form className="space-y-6" onFocusCapture={() => setShouldLoadTurnstile(true)} onSubmit={handleSubmit}>
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
            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu của bạn" className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-neutral-700 focus:shadow-lg focus:-translate-y-px" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); if (submitted) validate(); }} />
            <button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent text-neutral-400 transition-colors duration-200 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300">
              <EyeIcon show={showPassword} />
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>}
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input id="remember_me" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 text-primary-100 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-100 dark:focus:ring-primary-100 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600" />
            <label htmlFor="remember_me" className="text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">Ghi nhớ đăng nhập</label>
          </div>
          <Link href="/auth/quen-mat-khau" className="text-sm text-primary-100 hover:text-primary-200 font-medium transition-colors duration-200">Quên mật khẩu?</Link>
        </div>

        <div className="space-y-2">
          {turnstileSiteKey && shouldLoadTurnstile ? (
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              options={{ action: 'login', theme: 'auto', size: 'flexible' }}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setErrors((prev) => ({ ...prev, turnstile: undefined }));
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
          ) : !turnstileSiteKey ? (
            <p className="text-red-500 text-xs">Chưa cấu hình Cloudflare Turnstile site key</p>
          ) : <div aria-hidden="true" className="h-[65px]" />}
          {errors.turnstile && <p className="text-red-500 text-xs mt-1">⚠️ {errors.turnstile}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loginMutation.isPending || !turnstileSiteKey} className="w-full bg-gradient-to-r from-primary-100 to-primary-200 text-white font-semibold py-3 px-6 rounded-xl hover:from-primary-200 hover:to-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          <span className="flex items-center justify-center gap-2">
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            <span className="font-semibold">{loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
          </span>
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Hoặc đăng nhập với</span>
        <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600" />
      </div>

      {/* Google Sign In */}
      <div className="flex justify-center mb-6">
        <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={() => toast.error('Đăng nhập Google thất bại')} />
      </div>

      {/* Register link */}
      <div className="text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Chưa có tài khoản? <Link href="/auth/dang-ky" className="text-primary-100 hover:text-primary-200 font-semibold transition-colors duration-200">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
