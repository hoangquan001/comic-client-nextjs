'use client';

import { FormEvent, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { getLevelUser } from '@/lib/constants/levels';
import { useUpdateAvatar, useUpdateInfo, useUpdatePassword } from '@/lib/hooks/use-account-queries';
import { AccountIcon, GlassCard } from '../_components/account-ui';

const FALLBACK_AVATAR = 'https://static.vecteezy.com/system/resources/previews/002/002/257/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg';

function toDateInput(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = dayjs(value);
  if (!date.isValid()) return '';
  return date.format('DD/MM/YYYY');
}

export default function HoSoContent() {
  const { user } = useAuthStore();
  const updateInfo = useUpdateInfo();
  const updateAvatar = useUpdateAvatar();
  const updatePassword = useUpdatePassword();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [maxim, setMaxim] = useState(user?.maxim || '');
  const [infoForm, setInfoForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    dob: toDateInput(user?.dob),
  });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', rePassword: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const levelUser = useMemo(() => getLevelUser(user?.experience || 0, user?.typeLevel || 0), [user?.experience, user?.typeLevel]);
  const avatar = user?.avatar || FALLBACK_AVATAR;
  const isInfoDirty = infoForm.firstName !== (user?.firstName || '') || infoForm.lastName !== (user?.lastName || '') || infoForm.email !== (user?.email || '') || infoForm.dob !== toDateInput(user?.dob);
  const isInfoValid = !!infoForm.firstName && !!infoForm.lastName && !!infoForm.email && /^\S+@\S+\.\S+$/.test(infoForm.email);
  const isPasswordValid = !!passwordForm.oldPassword && !!passwordForm.newPassword && !!passwordForm.rePassword;

  function resetInfoForm() {
    setInfoForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      dob: toDateInput(user?.dob),
    });
    setTouched({});
  }

  function toggleEditProfile() {
    setIsEditingProfile((current) => {
      if (current) resetInfoForm();
      return !current;
    });
  }

  function toggleEditPassword() {
    setIsEditingPassword((current) => {
      if (current) setPasswordForm({ oldPassword: '', newPassword: '', rePassword: '' });
      return !current;
    });
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file, file.name);
    updateAvatar.mutate(formData, {
      onSuccess: (res) => toast.success(res.message || 'Cập nhật ảnh đại diện thành công'),
      onError: () => toast.error('Không thể cập nhật ảnh đại diện'),
    });
  }

  function updateTypeLevel(typeLevel: number) {
    updateInfo.mutate({ typeLevel }, {
      onSuccess: (res) => toast.success(res.message || 'Cập nhật loại cấp độ thành công'),
      onError: () => toast.error('Không thể cập nhật loại cấp độ'),
    });
  }

  function onUpdateMaxim() {
    if (maxim === (user?.maxim || '')) return;
    updateInfo.mutate({ maxim }, {
      onSuccess: (res) => toast.success(res?.message || 'Cập nhật châm ngôn thành công'),
      onError: () => toast.error('Không thể cập nhật châm ngôn'),
    });
  }

  function onUpdateInfo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isInfoValid || !isInfoDirty) return;
    updateInfo.mutate(
      { ...infoForm, dob: infoForm.dob ? new Date(infoForm.dob).toISOString() : undefined },
      {
        onSuccess: (res) => {
          setIsEditingProfile(false);
          toast.success(res.message || 'Cập nhật thông tin thành công');
        },
        onError: () => toast.error('Không thể cập nhật thông tin'),
      }
    );
  }

  function onUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPasswordValid) return;
    updatePassword.mutate(passwordForm, {
      onSuccess: () => {
        setPasswordForm({ oldPassword: '', newPassword: '', rePassword: '' });
        setIsEditingPassword(false);
        toast.success('Cập nhật mật khẩu thành công');
      },
      onError: () => toast.error('Không thể cập nhật mật khẩu'),
    });
  }

  function isInvalid(name: keyof typeof infoForm) {
    if (!touched[name]) return false;
    if (name === 'email') return !/^\S+@\S+\.\S+$/.test(infoForm.email);
    if (name === 'dob') return false;
    return !infoForm[name];
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center justify-between border-b border-neutral-200 p-6 dark:border-neutral-700">
          <h2 className="flex items-center gap-3 text-xl font-bold text-neutral-900 dark:text-light-text">
            <AccountIcon name="user" className="h-6 w-6 text-primary-100" />
            Thông tin cá nhân
          </h2>
        </div>
        <div className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <label htmlFor="avatar-upload" className="group relative block cursor-pointer">
                <Image unoptimized src={avatar} alt={fullName(user)} width={128} height={128} className="h-32 w-32 rounded-full border-4 border-neutral-200 object-cover transition-all duration-300 group-hover:brightness-75 dark:border-neutral-600" />
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100">
                  <AccountIcon name="camera" className="mb-1 h-8 w-8 text-white" />
                  <span className="text-sm font-medium text-white">Thay đổi</span>
                </div>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary-100/10 px-4 py-2 text-primary-100 dark:bg-primary-100/20">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a4.5 4.5 0 0 0 0 9a4.5 4.5 0 0 1 0 9" />
              </svg>
              <span className="font-bold">{levelUser.level}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            <StatItem label="Kinh nghiệm" value={`${user?.experience || 0} XP`} />
            <StatItem label="Tiến độ" value={`${levelUser.percent}%`} className="text-sky-600 dark:text-sky-400" />
            <StatItem label="Cấp độ tiếp theo" value={levelUser.nextLevel} />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Loại cấp độ</h4>
            <div className="flex flex-col gap-3 md:flex-row">
              <LevelOption title="Tu tiên" description="Hệ thống tu luyện" checked={(user?.typeLevel || 0) === 0} onChange={() => updateTypeLevel(0)} />
              <LevelOption title="Cấp độ" description="Hệ thống level" checked={user?.typeLevel === 1} onChange={() => updateTypeLevel(1)} />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Châm ngôn</h4>
            <div className="space-y-3">
              <textarea value={maxim} onChange={(event) => setMaxim(event.target.value)} placeholder="Nhập châm ngôn của bạn..." rows={3} className="w-full resize-none rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 transition-colors duration-200 placeholder:text-neutral-500 focus:border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text dark:placeholder:text-neutral-400" />
              <button type="button" onClick={onUpdateMaxim} disabled={maxim === (user?.maxim || '') || updateInfo.isPending} className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary-100 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-primary-200 disabled:cursor-not-allowed disabled:bg-neutral-400">
                <AccountIcon name="save" className="h-4 w-4" />
                Lưu
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <AccountIcon name="calendar" className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
              <div className="flex flex-col">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Ngày tham gia</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-light-text">{formatDate(user?.createAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between border-b border-neutral-200 p-6 dark:border-neutral-700">
          <h3 className="flex items-center gap-3 text-xl font-bold text-neutral-900 dark:text-light-text">
            <AccountIcon name="file" className="h-6 w-6 text-primary-100" />
            Thông tin chi tiết
          </h3>
          <button type="button" onClick={toggleEditProfile} className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100/50 ${isEditingProfile ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300' : 'text-neutral-600 hover:bg-primary-100/10 hover:text-primary-100 dark:text-neutral-400 dark:hover:bg-primary-100/20'}`}>
            <AccountIcon name="edit" className="h-4 w-4" />
            {isEditingProfile ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
        <div className="p-6">
          {isEditingProfile ? (
            <form onSubmit={onUpdateInfo}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput label="Tên" name="firstName" value={infoForm.firstName} error={isInvalid('firstName') ? 'Vui lòng nhập tên' : ''} onBlur={() => setTouched((current) => ({ ...current, firstName: true }))} onChange={(value) => setInfoForm((current) => ({ ...current, firstName: value }))} />
                <FormInput label="Họ" name="lastName" value={infoForm.lastName} error={isInvalid('lastName') ? 'Vui lòng nhập họ' : ''} onBlur={() => setTouched((current) => ({ ...current, lastName: true }))} onChange={(value) => setInfoForm((current) => ({ ...current, lastName: value }))} />
                <FormInput label="Email" name="email" type="email" value={infoForm.email} error={isInvalid('email') ? 'Email không hợp lệ' : ''} onBlur={() => setTouched((current) => ({ ...current, email: true }))} onChange={(value) => setInfoForm((current) => ({ ...current, email: value }))} />
                <FormInput label="Ngày sinh" name="dob" type="date" value={infoForm.dob} error={isInvalid('dob') ? 'Vui lòng chọn ngày sinh' : ''} onBlur={() => setTouched((current) => ({ ...current, dob: true }))} onChange={(value) => setInfoForm((current) => ({ ...current, dob: value }))} />
              </div>
              <div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:items-center">
                <button type="button" onClick={toggleEditProfile} className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-600 transition-colors duration-200 hover:border-neutral-400 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-200 md:w-auto">
                  Hủy
                </button>
                <button type="submit" disabled={!isInfoValid || !isInfoDirty || updateInfo.isPending} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-100 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-primary-200 disabled:cursor-not-allowed disabled:bg-neutral-400 md:w-auto">
                  <AccountIcon name="check" className="h-4 w-4" />
                  Lưu thay đổi
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <InfoItem label="Họ và tên" value={fullName(user)} />
              <InfoItem label="Email" value={user?.email || ''} />
              <InfoItem label="Ngày sinh" value={formatDate(user?.dob)} />
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between border-b border-neutral-200 p-6 dark:border-neutral-700">
          <h3 className="flex items-center gap-3 text-xl font-bold text-neutral-900 dark:text-light-text">
            <AccountIcon name="lock" className="h-6 w-6 text-primary-100" />
            Bảo mật
          </h3>
          <button type="button" onClick={toggleEditPassword} className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100/50 ${isEditingPassword ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300' : 'text-neutral-600 hover:bg-primary-100/10 hover:text-primary-100 dark:text-neutral-400 dark:hover:bg-primary-100/20'}`}>
            <AccountIcon name="edit" className="h-4 w-4" />
            {isEditingPassword ? 'Hủy' : 'Đổi mật khẩu'}
          </button>
        </div>
        <div className="p-6">
          {isEditingPassword ? (
            <form onSubmit={onUpdatePassword}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PasswordInput label="Mật khẩu hiện tại" value={passwordForm.oldPassword} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} onChange={(value) => setPasswordForm((current) => ({ ...current, oldPassword: value }))} />
                <PasswordInput label="Mật khẩu mới" value={passwordForm.newPassword} visible={showNewPassword} onToggle={() => setShowNewPassword((value) => !value)} onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))} />
                <PasswordInput label="Xác nhận mật khẩu" value={passwordForm.rePassword} visible={showRePassword} onToggle={() => setShowRePassword((value) => !value)} onChange={(value) => setPasswordForm((current) => ({ ...current, rePassword: value }))} />
              </div>
              <div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:items-center">
                <button type="button" onClick={toggleEditPassword} className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-600 transition-colors duration-200 hover:border-neutral-400 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-200">
                  Hủy
                </button>
                <button type="submit" disabled={!isPasswordValid || updatePassword.isPending} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-100 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-primary-200 disabled:cursor-not-allowed disabled:bg-neutral-400">
                  <AccountIcon name="check" className="h-4 w-4" />
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-lime-50 p-4 dark:bg-lime-900/20">
                <AccountIcon name="check" className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                <span className="text-sm font-medium text-lime-700 dark:text-lime-300">Mật khẩu được bảo vệ</span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">Mật khẩu của bạn được mã hóa và bảo mật. Nhấn &quot;Đổi mật khẩu&quot; để cập nhật.</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function fullName(user: ReturnType<typeof useAuthStore.getState>['user']) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'User';
}

function StatItem({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-700/50">
      <div className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className={`text-lg font-bold text-neutral-900 dark:text-light-text ${className}`}>{value}</div>
    </div>
  );
}

function LevelOption({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex-1 cursor-pointer">
      <input type="radio" name="levelType" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`flex flex-col items-center rounded-lg border-2 p-3 transition-all duration-200 hover:border-primary-100/50 ${checked ? 'border-primary-100 bg-primary-100/10 text-primary-100 dark:bg-primary-100/20' : 'border-neutral-200 dark:border-neutral-600'}`}>
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{description}</span>
      </div>
    </label>
  );
}

function FormInput({ label, name, type = 'text', value, error, onChange, onBlur }: { label: string; name: string; type?: string; value: string; error: string; onChange: (value: string) => void; onBlur: () => void }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      <input id={name} type={type} value={value} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-lg border bg-white px-3 py-2 text-neutral-900 transition-colors duration-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 dark:bg-neutral-700 dark:text-light-text dark:placeholder:text-neutral-400 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:border-primary-100 focus:ring-primary-100 dark:border-neutral-600'}`} />
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
    </div>
  );
}

function PasswordInput({ label, value, visible, onToggle, onChange }: { label: string; value: string; visible: boolean; onToggle: () => void; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      <div className="relative">
        <input type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder={label === 'Mật khẩu hiện tại' ? 'Nhập mật khẩu hiện tại' : label === 'Mật khẩu mới' ? 'Nhập mật khẩu mới' : 'Nhập lại mật khẩu mới'} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-10 text-neutral-900 transition-colors duration-200 placeholder:text-neutral-500 focus:border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text dark:placeholder:text-neutral-400" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500 dark:text-neutral-400" aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {visible ? (
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M1 1l22 22" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              </>
            ) : (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-3 last:border-b-0 dark:border-neutral-700">
      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="text-sm font-medium text-neutral-900 dark:text-light-text">{value || '-'}</span>
    </div>
  );
}
