'use client';

interface ConfirmPopupProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmPopup({
  isVisible,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg w-full max-w-md relative mx-5 lg:mx-0">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-light-text flex items-center justify-between gap-1">
          <span className="flex items-center gap-1">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {title}
          </span>
          <button className="text-neutral-600 dark:text-light-text hover:text-neutral-800 dark:hover:text-neutral-300 absolute right-3 top-3" onClick={onCancel}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 dark:text-neutral-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </h2>
        <p className="mt-4 text-neutral-600 dark:text-light-text text-base" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 dark:text-light-text dark:bg-neutral-600 rounded-md" onClick={onCancel}>
            {cancelButtonText}
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold" onClick={onConfirm}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
