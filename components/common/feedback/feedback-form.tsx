'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useMutation } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client-fetch';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { toast } from 'sonner';

interface FeedbackFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function FeedbackForm({ isVisible, onClose }: FeedbackFormProps) {
  const [message, setMessage] = useState('');
  const { user } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => onClose());

  const mutation = useMutation({
    mutationFn: (data: { mail: string; content: string }) =>
      clientFetch('/report-error/feedback', { method: 'POST', data }),
  });


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    toast.info('Cảm ơn bạn đã góp ý, team sẽ xem xét và cải thiện nhé!');
    mutation.mutate(
      { mail: user?.email || 'anonymous@gmail.com', content: message },
      {
        onSuccess: () => { toast.success('Gửi thành công'); setMessage(''); onClose(); },
        onError: () => { toast.error('Gửi thất bại, đã có lỗi xảy ra'); onClose(); },
      }
    );
    onClose();
  }

  return (
    isVisible &&
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div ref={menuRef} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <div className="relative p-6 border-b border-neutral-200 dark:border-neutral-700 bg-primary-100 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Góp ý & Phản hồi</h3>
            <p className="text-sm opacity-90">Nêu góp ý để team cải thiện nhé!</p>
          </div>
          <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center border-none cursor-pointer" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <svg className="w-4 h-4 text-neutral-500 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>
                Nội dung góp ý
              </label>
              <textarea
                maxLength={1000}
                className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-light-text placeholder-neutral-400 resize-none hover:border-neutral-400 dark:hover:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent"
                placeholder="Chia sẻ ý kiến, đề xuất hoặc phản hồi của bạn về website..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <button type="submit" disabled={!message.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-xl bg-primary-100 text-white hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L11 13" /><polygon points="22,2 15,22 11,13 2,9" /></svg>
                Gửi góp ý
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600" onClick={onClose}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
