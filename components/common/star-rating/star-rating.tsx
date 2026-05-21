'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useVoteComic } from '@/lib/hooks/use-account-queries';
import { toast } from 'sonner';

interface StarRatingProps {
  isVisible: boolean;
  onClose: () => void;
  comicId: number;
  initialRating: number;
}

function getRatingLabel(rating: number): string {
  const labels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];
  return labels[rating] || '';
}

function getRatingDescription(rating: number): string {
  const descriptions = [
    '',
    'Truyện này thực sự không phù hợp với bạn',
    'Truyện có nhiều điểm cần cải thiện',
    'Truyện ở mức độ chấp nhận được',
    'Truyện hay và đáng đọc',
    'Truyện tuyệt vời, rất đáng để theo dõi!',
  ];
  return descriptions[rating] || '';
}

export default function StarRating({ isVisible, onClose, comicId, initialRating }: StarRatingProps) {
  const [selectedStars, setSelectedStars] = useState(initialRating);
  const [tempRating, setTempRating] = useState(initialRating);
  const { isAuthenticated } = useAuthStore();
  const voteMutation = useVoteComic();

  if (!isVisible) return null;

  function handleRateStar(starIndex: number) {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập đánh giá truyện');
      return;
    }
    setTempRating(starIndex);
  }

  function handleConfirmVote() {
    voteMutation.mutate(
      { comicId, votePoint: tempRating },
      {
        onSuccess: (res: any) => {
          if (res?.data === 1) {
            setSelectedStars(tempRating);
            toast.success('Gửi đánh giá thành công');
          }
        },
      }
    );
    onClose();
  }

  function handleCancel() {
    setSelectedStars(initialRating);
    setTempRating(initialRating);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-neutral-100 dark:border-neutral-700 bg-primary-100 text-white">
          <h3 className="text-xl font-bold mb-2">Đánh giá truyện</h3>
          <p className="text-sm opacity-90">Bạn cảm thấy truyện này như thế nào?</p>
          <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center" onClick={handleCancel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`relative w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    star <= tempRating
                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                      : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                  onClick={() => handleRateStar(star)}
                  onMouseEnter={() => handleRateStar(star)}
                  aria-label={`Đánh giá ${star} sao`}
                >
                  <svg
                    className={`w-8 h-8 absolute inset-0 m-auto transition-all duration-300 ${
                      star <= tempRating ? 'text-yellow-500 scale-110' : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-bold text-neutral-900 dark:text-light-text">{tempRating}/5</span>
              <span className="block text-lg font-medium text-yellow-600 dark:text-yellow-400">{getRatingLabel(tempRating)}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{getRatingDescription(tempRating)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 bg-neutral-50 dark:bg-neutral-900/50">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-xl transition-all duration-200 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
            onClick={handleCancel}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Hủy bỏ
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-xl transition-all duration-200 bg-primary-100 text-white hover:bg-primary-200 transform hover:scale-105"
            onClick={handleConfirmVote}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
