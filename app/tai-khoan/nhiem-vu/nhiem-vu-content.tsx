'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDailyQuests, useWeeklyQuests, useClaimQuestReward } from '@/lib/hooks/use-account-queries';
import { LoadingState, PageHeader } from '../_components/account-ui';

type QuestStatus = 'active' | 'completed' | 'expired' | 'claimed';
type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
type RewardType = 'coins' | 'experience' | 'badge' | 'avatar_frame' | 'title' | 'premium_days';

interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: { type: RewardType; description: string };
  status: QuestStatus;
  icon: string;
  difficulty: QuestDifficulty;
  expiresAt: string;
}

export default function NhiemVuContent() {
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly'>('daily');
  const { data: dailyQuests = [], isLoading: loadingDaily, refetch: refetchDaily } = useDailyQuests();
  const { data: weeklyQuests = [], isLoading: loadingWeekly, refetch: refetchWeekly } = useWeeklyQuests();
  const claimMutation = useClaimQuestReward();

  const isLoading = loadingDaily || loadingWeekly;
  const quests: Quest[] = selectedTab === 'daily' ? dailyQuests : weeklyQuests;

  function refreshQuests() {
    refetchDaily();
    refetchWeekly();
  }

  function claimReward(quest: Quest) {
    if (quest.status !== 'completed') return;
    claimMutation.mutate(quest.id, {
      onSuccess: (res) => {
        if (res.status === 200 || res.status === 1) {
          toast.success(res.message || 'Nhận thưởng thành công!');
        } else {
          toast.error(res.message || 'Không thể nhận thưởng');
        }
      },
      onError: () => toast.error('Có lỗi xảy ra khi nhận thưởng'),
    });
  }

  return (
    <>
      <PageHeader icon="target" title="Nhiệm vụ hàng ngày" iconClassName="text-red-500" />
      <div className="min-h-screen bg-white p-6 dark:bg-neutral-900">
        <div className="mb-6 flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          <button type="button" onClick={() => setSelectedTab('daily')} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-neutral-600 transition-all duration-200 hover:bg-white dark:text-neutral-400 dark:hover:bg-neutral-700 md:flex-row ${selectedTab === 'daily' ? 'bg-white text-primary-100 dark:bg-neutral-700' : ''}`}>
            <span className="text-lg">📅</span>
            <span className="font-medium max-md:text-xs">Nhiệm vụ hằng ngày</span>
            <span className={`rounded-full bg-neutral-200 px-2 py-1 text-xs dark:bg-neutral-600 ${selectedTab === 'daily' ? 'bg-primary-100 text-white' : ''}`}>{dailyQuests.length}</span>
          </button>
          <button type="button" onClick={() => setSelectedTab('weekly')} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-neutral-600 transition-all duration-200 hover:bg-white dark:text-neutral-400 dark:hover:bg-neutral-700 max-md:flex-col max-md:gap-1 max-md:py-2 md:flex-row ${selectedTab === 'weekly' ? 'bg-white text-primary-100 dark:bg-neutral-700' : ''}`}>
            <span className="text-lg">📊</span>
            <span className="font-medium max-md:text-xs">Nhiệm vụ tuần</span>
            <span className={`rounded-full bg-neutral-200 px-2 py-1 text-xs dark:bg-neutral-600 ${selectedTab === 'weekly' ? 'bg-primary-100 text-white' : ''}`}>{weeklyQuests.length}</span>
          </button>
          <button type="button" onClick={refreshQuests} disabled={isLoading} title="Làm mới nhiệm vụ" className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-lime-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:hover:text-lime-400">
            <span className={`text-lg transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
          </button>
        </div>

        {isLoading && <LoadingState text="Đang tải nhiệm vụ..." />}

        {!isLoading && (
          <div className="space-y-4">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} isClaiming={claimMutation.isPending} onClaim={claimReward} />
            ))}
          </div>
        )}

        {!isLoading && quests.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">📋</div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-light-text">Không có nhiệm vụ nào</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{selectedTab === 'daily' ? 'Hôm nay bạn Hoàn thành tất cả nhiệm vụ!' : 'Tuần này bạn Hoàn thành tất cả nhiệm vụ!'}</p>
          </div>
        )}
      </div>
    </>
  );
}

function QuestCard({ quest, isClaiming, onClaim }: { quest: Quest; isClaiming: boolean; onClaim: (quest: Quest) => void }) {
  const percentage = Math.min((quest.current / quest.target) * 100, 100);
  const completed = quest.status === 'completed';
  const expired = quest.status === 'expired';

  return (
    <div className={`flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-md dark:hover:border-neutral-600 md:p-6 ${completed ? 'border-lime-200 bg-lime-50 dark:border-lime-800 dark:bg-lime-900/20' : expired ? 'border-neutral-300 bg-neutral-50 opacity-60 dark:border-neutral-600 dark:bg-neutral-900/50' : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'} max-md:flex-col`}>
      <div className="shrink-0 text-3xl">{getQuestIcon(quest.icon)}</div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-start justify-between gap-3 max-md:flex-col">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-light-text">{quest.title}</h3>
          <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${getDifficultyBadgeColor(quest.difficulty)}`}>{quest.difficulty}</span>
        </div>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{quest.description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-900 dark:text-light-text">{quest.current}/{quest.target}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{getTimeRemaining(quest.expiresAt)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div className="h-full rounded-full bg-primary-100 transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-3 max-md:w-full max-md:flex-row max-md:items-center max-md:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">{getRewardIcon(quest.reward.type)}</span>
          <span className="font-medium text-neutral-900 dark:text-light-text">{quest.reward.description}</span>
        </div>
        <button type="button" disabled={(quest.status !== 'completed' && quest.status !== 'claimed') || isClaiming} onClick={() => onClaim(quest)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${completed ? 'bg-primary-100 text-white hover:bg-primary-200' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600'}`}>
          {isClaiming ? '⏳' : quest.status === 'completed' ? 'Nhận thưởng' : quest.status === 'active' ? 'Chưa hoàn thành' : quest.status === 'expired' ? 'Đã hết hạn' : 'Đã nhận'}
        </button>
      </div>
    </div>
  );
}

function getDifficultyBadgeColor(difficulty: QuestDifficulty) {
  switch (difficulty) {
    case 'easy': return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'legendary': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  }
}

function getRewardIcon(rewardType: RewardType) {
  switch (rewardType) {
    case 'coins': return '🪙';
    case 'experience': return '⭐';
    case 'badge': return '🏆';
    case 'avatar_frame': return '🖼️';
    case 'title': return '👑';
    case 'premium_days': return '💎';
  }
}

function getQuestIcon(iconName: string) {
  const iconMap: Record<string, string> = {
    'book-open': '📖',
    'message-circle': '💬',
    heart: '❤️',
    star: '⭐',
    compass: '🧭',
    trophy: '🏆',
    award: '🥇',
  };
  return iconMap[iconName] || '📋';
}

function getTimeRemaining(expiresAt: string) {
  if (!expiresAt) return '';
  const expires = new Date(expiresAt);
  if (Number.isNaN(expires.getTime())) return '';
  const timeLeft = expires.getTime() - Date.now();
  if (timeLeft <= 0) return 'Đã hết hạn';
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) return `${Math.floor(hours / 24)} ngày`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
