import { InputType, SettingCategory } from '@/types';
import type { EnhancedSettingOption } from '@/types';

export const GRID_SETTING: EnhancedSettingOption = {
  id: 'gridType',
  inputType: InputType.Selection,
  name: '',
  description: 'Chọn thẻ truyện',
  value: '0',
  defaultValue: '0',
  category: SettingCategory.APPEARANCE,
  order: 10,
  icon: '',
  options: [
    { label: 'Đơn giản', value: '0' },
    { label: 'Chi tiết', value: '1' },
  ],
  preview: true,
};

export const THEME_SETTING: EnhancedSettingOption = {
  id: 'theme',
  inputType: InputType.Selection,
  name: 'Chủ đề',
  description: 'Chọn giao diện sáng hoặc tối cho website',
  value: 'light',
  defaultValue: 'light',
  category: SettingCategory.APPEARANCE,
  order: 1,
  icon: 'theme',
  options: [
    { label: 'Sáng', value: 'light' },
    { label: 'Tối', value: 'dark' },
    { label: 'Tự động', value: 'auto' },
  ],
  preview: true,
};

export const PRIMARY_COLOR_SETTING: EnhancedSettingOption = {
  id: 'primaryColor',
  inputType: InputType.Color,
  name: 'Màu chủ đạo',
  description: 'Màu chính của giao diện website',
  value: '#E83A3A',
  defaultValue: '#E83A3A',
  category: SettingCategory.APPEARANCE,
  order: 2,
  icon: 'palette',
  options: [
    { label: 'Đỏ truyền thống', value: '#E83A3A' },
    { label: 'Xanh dương', value: '#3B82F6' },
    { label: 'Xanh lá', value: '#10B981' },
    { label: 'Tím', value: '#8B5CF6' },
    { label: 'Cam', value: '#F59E0B' },
  ],
  preview: true,
};

export const CARD_COMIC_SIZE_SETTING: EnhancedSettingOption = {
  id: 'cardComicSize',
  inputType: InputType.Selection,
  name: 'Kích thước thẻ truyện',
  description: 'Chọn kích thước của thẻ truyện',
  value: 'medium',
  defaultValue: 'medium',
  category: SettingCategory.APPEARANCE,
  order: 4,
  options: [
    { label: 'Nhỏ', value: 'small' },
    { label: 'Vừa', value: 'medium' },
  ],
  preview: true,
};

export const CARD_CHAPTER_SIZE_SETTING: EnhancedSettingOption = {
  id: 'cardChapterSize',
  inputType: InputType.Selection,
  name: 'Số lượng thẻ chương',
  description: 'Chọn kích thước thẻ chương',
  value: 'nhieu',
  defaultValue: 'nhieu',
  category: SettingCategory.APPEARANCE,
  order: 5,
  options: [
    { label: 'Nhiều', value: 'nhieu' },
    { label: 'Ít', value: 'it' },
  ],
  preview: true,
};

export const FONT_FAMILY_SETTING: EnhancedSettingOption = {
  id: 'fontFamily',
  inputType: InputType.Selection,
  name: 'Font chữ',
  description: 'Lựa chọn font chữ hiển thị',
  value: "'Be Vietnam Pro', sans-serif",
  defaultValue: "'Be Vietnam Pro', sans-serif",
  category: SettingCategory.APPEARANCE,
  order: 4,
  icon: 'font',
  options: [
    { label: 'Be Vietnam Pro', value: "'Be Vietnam Pro', sans-serif" },
    { label: 'Arial', value: "'Arial', sans-serif" },
    { label: 'Times New Roman', value: "'Times New Roman', serif" },
    { label: 'Roboto', value: "'Roboto', sans-serif" },
    { label: 'Inter', value: "'Inter', sans-serif" },
  ],
  preview: true,
};

export const LANGUAGE_SETTING: EnhancedSettingOption = {
  id: 'language',
  inputType: InputType.Selection,
  name: 'Ngôn ngữ',
  description: 'Ngôn ngữ hiển thị cho website',
  value: 'vi-VN',
  defaultValue: 'vi-VN',
  category: SettingCategory.APPEARANCE,
  order: 7,
  icon: 'language',
  options: [{ label: 'Tiếng Việt', value: 'vi-VN' }],
};

export const READING_MODE_SETTING: EnhancedSettingOption = {
  id: 'readingMode',
  inputType: InputType.Selection,
  name: 'Chế độ đọc',
  value: 'single',
  defaultValue: 'single',
  category: SettingCategory.READING,
  order: 1,
  icon: 'book-open',
  options: [
    { label: 'Từng trang', value: 'single' },
    { label: 'Cuộn dọc', value: 'vertical' },
    { label: 'Hai trang', value: 'double' },
    { label: 'Webtoon', value: 'webtoon' },
  ],
};

export const SCROLL_SPEED_SETTING: EnhancedSettingOption = {
  id: 'scrollSpeed',
  inputType: InputType.Range,
  name: 'Tốc độ cuộn',
  description: 'Tùy chỉnh tốc độ cuộn khi đọc truyện',
  value: 3,
  defaultValue: 3,
  category: SettingCategory.READING,
  order: 2,
  icon: 'scroll',
  min: 1,
  max: 10,
  step: 1,
  unit: 'x',
};

export const ZOOM_SETTING: EnhancedSettingOption = {
  id: 'zoom-reading',
  inputType: InputType.Range,
  name: 'Tỷ lệ ảnh',
  description: 'Tùy chỉnh kích thước ảnh khi đọc truyện',
  value: 100,
  defaultValue: 100,
  category: SettingCategory.READING,
  order: 2,
  icon: 'scroll',
  min: 50,
  max: 150,
  step: 10,
  unit: '%',
};

export const NIGHT_MODE_SETTING: EnhancedSettingOption = {
  id: 'nightMode',
  inputType: InputType.Toggle,
  name: 'Chế độ ban đêm',
  value: false,
  defaultValue: false,
  category: SettingCategory.READING,
  order: 3,
};

export const AUTO_NEXT_CHAPTER_SETTING: EnhancedSettingOption = {
  id: 'autoNextChapter',
  inputType: InputType.Toggle,
  name: 'Tự động chuyển chương',
  description: 'Tự động chuyển chương khi ở cuối trang',
  value: false,
  defaultValue: false,
  category: SettingCategory.READING,
  order: 4,
  icon: 'auto-next',
};

export const PRELOAD_PAGES_SETTING: EnhancedSettingOption = {
  id: 'preloadPages',
  inputType: InputType.Range,
  name: 'Tải trước trang',
  description: 'Số trang được tải trước để đọc mượt mà hơn',
  value: 3,
  defaultValue: 3,
  category: SettingCategory.READING,
  order: 6,
  icon: 'preload',
  min: 1,
  max: 10,
  step: 1,
  unit: ' trang',
};

export const FIXED_TOOLBAR_SETTING: EnhancedSettingOption = {
  id: 'fixedToolbar',
  inputType: InputType.Toggle,
  name: 'Giữ thanh điều khiển cố định',
  value: false,
  defaultValue: false,
  category: SettingCategory.READING,
  order: 7,
  icon: 'toolbar',
};

export const STYLE_TOOLBAR_SETTING: EnhancedSettingOption = {
  id: 'styleToolbar',
  inputType: InputType.Selection,
  name: 'Kiểu thanh điều khiển',
  value: 'classic',
  defaultValue: 'classic',
  order: 7,
  category: SettingCategory.READING,
  options: [
    { label: 'Cổ điển', value: 'classic' },
    { label: 'Hiện đại', value: 'modern' },
  ],
};

export const DOUBLE_CLICK_TO_FULLSCREEN_SETTING: EnhancedSettingOption = {
  id: 'DoubleClick',
  inputType: InputType.Toggle,
  name: 'Nhấp 2 lần để toàn màn hình',
  description: 'Nhấp 2 lần để toàn màn hình khi đọc truyện',
  value: false,
  defaultValue: false,
  category: SettingCategory.BEHAVIOR,
  order: 3,
  icon: 'double-click',
};

export const ENHANCED_SETTINGS: EnhancedSettingOption[] = [
  GRID_SETTING,
  THEME_SETTING,
  LANGUAGE_SETTING,
  CARD_COMIC_SIZE_SETTING,
  READING_MODE_SETTING,
  NIGHT_MODE_SETTING,
  AUTO_NEXT_CHAPTER_SETTING,
  PRELOAD_PAGES_SETTING,
  STYLE_TOOLBAR_SETTING,
  FIXED_TOOLBAR_SETTING,
  ZOOM_SETTING,
  DOUBLE_CLICK_TO_FULLSCREEN_SETTING,
];
