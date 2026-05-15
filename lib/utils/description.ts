export function fillDescription(
  value: string | null | undefined,
  comic: { url: string; id?: number; title: string },
  link = true
): string {
  if (!value) return '';
  if (!link) return value;

  return value.replace(
    /\[([^\]]+)\]/g,
    (match, inner: string) => {
      const href = comic.id
        ? `/truyen-tranh/${comic.url}-${comic.id}`
        : `/truyen-tranh/${comic.url}`;
      return `<a href="${href}" class="text-primary-100 hover:underline">${inner}</a>`;
    }
  );
}

export function clampText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getFirstSentence(text: string | null | undefined): string {
  if (!text) return '';
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0] : text.slice(0, 100);
}
