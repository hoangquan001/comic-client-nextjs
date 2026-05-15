export function parseEmoji(value: string): string {
  if (!value) return value;
  return value.replace(/<e>(.*?)<\/e>/g, (_match, emoji: string) => {
    const formattedEmoji = emoji.replace('_', '/');
    return `<img class="w-[50px] h-[50px] inline-block align-middle mx-[5px]" src="/emoji/data/${formattedEmoji}.gif" alt="${emoji}">`;
  });
}
