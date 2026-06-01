'use client';

import { useTheme } from "@/lib/hooks/use-theme";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  return (
    <div className="relative w-12 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700">
      <input
        aria-label="Toggle theme"
        id="theme-toggle"
        onChange={toggleTheme}
        type="checkbox"
        checked={isDark}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      <span className={`absolute top-1/2 left-1 w-5 h-5 bg-white rounded-full -translate-y-1/2 transition-transform duration-200 flex items-center justify-center ${isDark ? 'translate-x-5' : ''}`}>
        <svg className={`w-4 h-4 text-primary-100 ${isDark ? 'hidden' : 'block'}`} viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12.667A4.667 4.667 0 1 0 8 3.333a4.667 4.667 0 0 0 0 9.334z" />
          <path d="M8 15.307a.667.667 0 0 1-.667-.667v-.053a.667.667 0 1 1 1.334 0 .667.667 0 0 1-.667.72zm4.76-1.88a.667.667 0 0 1-.473-.194l-.087-.087a.667.667 0 1 1 .94-.94l.087.087a.667.667 0 0 1-.467 1.134zm-9.52 0a.667.667 0 0 1-.473-1.134l.087-.087a.667.667 0 1 1 .94.94l-.087.087a.667.667 0 0 1-.467.194zM14.667 8.667h-.054a.667.667 0 1 1 0-1.334.667.667 0 0 1 0 1.334zm-13.28 0h-.054a.667.667 0 1 1 0-1.334.667.667 0 0 1 0 1.334zm11.286-4.674a.667.667 0 0 1-.473-.193.667.667 0 0 1 0-.94l.087-.087a.667.667 0 1 1 .94.94l-.087.087a.667.667 0 0 1-.467.193zm-9.346 0a.667.667 0 0 1-.473-.193l-.087-.087a.667.667 0 1 1 .94-.94l.087.087a.667.667 0 0 1-.467 1.133zM8 2.027a.667.667 0 0 1-.667-.667V1.333a.667.667 0 1 1 1.334 0 .667.667 0 0 1-.667.694z" />
        </svg>
        <svg className={`w-4 h-4 text-primary-100 ${isDark ? 'block' : 'hidden'}`} viewBox="0 0 16 16" fill="currentColor">
          <path d="M14.353 10.62c-.107-.18-.407-.46-1.153-.327-.414.073-.834.107-1.254.087-1.553-.067-2.96-.78-3.94-1.88-.866-.967-1.4-2.227-1.406-3.587 0-.76.146-1.493.446-2.187.294-.673.087-1.027-.06-1.173-.153-.154-.513-.367-1.22-.067C3.04 2.627 1.353 5.36 1.553 8.287c.2 2.76 2.133 6.113 4.693 7 .614.213 1.26.34 1.927.367.067.006.174.013.28.013 2.234 0 4.327-1.053 5.647-2.847.447-.62.327-1.013.213-1.193z" />
        </svg>
      </span>
    </div>
  );
}
