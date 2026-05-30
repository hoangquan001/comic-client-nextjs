'use client';

import { useState, useEffect, useCallback } from 'react';
import { SettingCategory } from '@/types';
import dynamic from 'next/dynamic';
import {
  openFeedback,
  openReportError,
  openSettings,
  openUserInfo,
} from '@/lib/utils/event.define';
const FeedbackForm = dynamic(() => import('@/components/common/feedback/feedback-form'), {
  ssr: false,
  loading: () => null,
});
const AppSetting = dynamic(() => import('@/components/common/app-setting/app-setting'), {
  ssr: false,
  loading: () => null,
})

const UserInfoPopup = dynamic(() => import('@/components/common/user-info-popup/user-info-popup'), {
  ssr: false,
  loading: () => null,
})
const ReportErrorForm = dynamic(() => import('@/components/common/report-error/report-error-form'), {
  ssr: false,
  loading: () => null,
})

export function PopupManager() {
  const [settings, setSettings] = useState({ visible: false, category: SettingCategory.APPEARANCE });
  const [feedback, setFeedback] = useState(false);
  const [userInfo, setUserInfo] = useState<{ visible: boolean; userId: number | null }>({ visible: false, userId: null });
  const [reportError, setReportError] = useState<{ visible: boolean; chapterID: number }>({ visible: false, chapterID: 0 });

  const handleOpenSettings = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    setSettings({ visible: true, category: detail?.category ?? SettingCategory.APPEARANCE });
  }, []);

  const handleOpenFeedback = useCallback(() => {
    setFeedback(true);
  }, []);

  const handleOpenUserInfo = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    console.log(detail);
    if (typeof detail?.userId === 'number') {
      setUserInfo({ visible: true, userId: detail.userId });
    }
  }, []);

  const handleOpenReportError = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    setReportError({ visible: true, chapterID: detail?.chapterID ?? 0 });
  }, []);

  useEffect(() => {
    window.addEventListener(openSettings, handleOpenSettings);
    window.addEventListener(openFeedback, handleOpenFeedback);
    window.addEventListener(openUserInfo, handleOpenUserInfo);
    window.addEventListener(openReportError, handleOpenReportError);

    return () => {
      window.removeEventListener(openSettings, handleOpenSettings);
      window.removeEventListener(openFeedback, handleOpenFeedback);
      window.removeEventListener(openUserInfo, handleOpenUserInfo);
      window.removeEventListener(openReportError, handleOpenReportError);
    };
  }, [handleOpenSettings, handleOpenFeedback, handleOpenUserInfo, handleOpenReportError]);

  return (
    <>
      {settings.visible && <AppSetting
        isVisible={settings.visible}
        onClose={() => setSettings((s) => ({ ...s, visible: false }))}
        defaultCategory={settings.category}
      />}
      {feedback && <FeedbackForm
        isVisible={feedback}
        onClose={() => setFeedback(false)}
      />}
      {userInfo.visible && <UserInfoPopup
        userId={userInfo.userId}
        visible={userInfo.visible}
        onClose={() => setUserInfo({ visible: false, userId: null })}
      />}
      {reportError.visible && <ReportErrorForm
        isVisible={reportError.visible}
        chapterID={reportError.chapterID}
        onClose={() => setReportError({ visible: false, chapterID: 0 })}
      />}
    </>
  );
}
