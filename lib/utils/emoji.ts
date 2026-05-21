export function parseEmoji(value: string): string {
  if (!value) return value;
  return value.replace(/<e>(.*?)<\/e>/g, (_match, emoji: string) => {
    const formattedEmoji = emoji.replace('_', '/');
    return `<span class="w-[50px] h-[50px] inline-block align-middle mx-[5px] bg-contain bg-center bg-no-repeat" role="img" aria-label="${emoji}" style="background-image:url('/emoji/data/${formattedEmoji}.gif')"></span>`;
  });
}
