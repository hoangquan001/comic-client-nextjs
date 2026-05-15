export function formatDateTo(date: Date): string {
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function dateAgo(
  date?: string | Date | number,
  ago = 'trước',
  offset = 0
): string {
  if (!date) return '';
  const dateTime = new Date(date);
  const now = new Date();
  const seconds = (now.getTime() - dateTime.getTime()) / 1000 - offset;
  const isOverMonth = seconds >= 3600 * 24 * 30;
  if (isOverMonth) {
    return formatDateTo(dateTime);
  }
  const days = Math.floor(seconds / 3600 / 24);
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  if (days > 0) return days + ' ngày ' + ago;
  if (hours > 0) return hours + ' giờ ' + ago;
  if (minutes > 0) return minutes + ' phút ' + ago;
  return 1 + ' phút ' + ago;
}
