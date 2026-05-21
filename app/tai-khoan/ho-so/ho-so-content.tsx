'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { toast } from 'sonner';

export default function HoSoPage() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [maxim, setMaxim] = useState(user?.maxim || '');

  function handleSave() {
    setEditing(false);
    toast.success('Cập nhật thông tin thành công');
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-primary-100 to-primary-200">
        <div className="absolute -bottom-12 left-6">
          <Image src={user?.avatar || '/default_avatar.jpg'} alt="" className="w-24 h-24 rounded-2xl border-4 border-white dark:border-neutral-800 object-cover shadow-lg" width={96} height={96} />
        </div>
      </div>

      <div className="pt-16 px-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-light-text">{user?.firstName || user?.username || 'User'}</h2>
            <p className="text-sm text-neutral-500">@{user?.username || 'user'} &middot; {user?.levelInfo?.level || 'Newbie'}</p>
          </div>
          <button onClick={() => setEditing(!editing)} className="px-4 py-2 rounded-xl text-sm font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 border-none cursor-pointer">
            {editing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        {/* Level progress */}
        {user?.levelInfo && (
          <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-600 dark:text-neutral-300">{user.levelInfo.level}</span>
              <span className="text-neutral-500">{user.levelInfo.percent}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
              <div className="h-full bg-primary-100 rounded-full transition-all duration-500" style={{ width: `${user.levelInfo.percent}%` }} />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Tiếp theo: {user.levelInfo.nextLevel}</p>
          </div>
        )}

        {/* Info fields */}
        <div className="space-y-4">
          {editing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Họ</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-light-text focus:outline-none focus:ring-2 focus:ring-primary-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Tên</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-light-text focus:outline-none focus:ring-2 focus:ring-primary-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Châm ngôn</label>
                <input type="text" value={maxim} onChange={(e) => setMaxim(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-light-text focus:outline-none focus:ring-2 focus:ring-primary-100" />
              </div>
              <button onClick={handleSave} className="px-6 py-2.5 bg-primary-100 text-white font-medium rounded-xl hover:bg-primary-200 border-none cursor-pointer">Lưu thay đổi</button>
            </>
          ) : (
            <>
              <InfoRow label="Email" value={user?.email || '-'} />
              <InfoRow label="Giới tính" value={user?.gender === 1 ? 'Nam' : user?.gender === 2 ? 'Nữ' : 'Khác'} />
              <InfoRow label="Ngày sinh" value={user?.dob || 'Chưa cập nhật'} />
              <InfoRow label="Châm ngôn" value={user?.maxim || 'Chưa cập nhật'} />
              <InfoRow label="Ngày tham gia" value={user?.createAt ? new Date(user.createAt).toLocaleDateString('vi-VN') : '-'} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-medium text-neutral-900 dark:text-light-text">{value}</span>
    </div>
  );
}
