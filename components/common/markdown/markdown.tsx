'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div
      className="markdown-body leading-relaxed wrap-break-word [&_h1]:text-[1.8em] [&_h1]:font-semibold [&_h1]:my-2 [&_h1]:mb-1 [&_h2]:text-[1.5em] [&_h2]:font-semibold [&_h2]:my-2 [&_h2]:mb-1 [&_h3]:text-[1.3em] [&_h3]:font-semibold [&_h3]:my-2 [&_h3]:mb-1 [&_h4]:font-semibold [&_h4]:my-2 [&_h4]:mb-1 [&_h5]:font-semibold [&_h5]:my-2 [&_h5]:mb-1 [&_h6]:font-semibold [&_h6]:my-2 [&_h6]:mb-1 [&_p]:my-1.5 [&_strong]:font-bold [&_em]:italic [&_del]:line-through [&_a]:text-blue-500 [&_a]:underline [&_code]:bg-neutral-300/15 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0 [&_code]:font-mono [&_code]:text-[0.9em] [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:my-1.5 [&_blockquote]:py-0.5 [&_blockquote]:pl-2 [&_blockquote]:text-gray-500 [&_ul]:pl-6 [&_ul]:my-1 [&_ul]:list-disc [&_ol]:pl-6 [&_ol]:my-1 [&_ol]:list-disc [&_hr]:border-none [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-4 [&_img]:max-w-full [&_img]:rounded"
    >
      {parseWithImages(content ?? '')}
    </div>
  );
}

function parseWithImages(md: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = imageRegex.exec(md)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <div
          className="contents"
          key={`text-${lastIndex}`}
          dangerouslySetInnerHTML={{ __html: parse(md.slice(lastIndex, match.index)) }}
        />
      );
    }

    nodes.push(
      <Image
        key={`image-${match.index}`}
        src={match[2]}
        alt={match[1]}
        className="max-w-full rounded h-auto"
        width={640}
        height={360}
        unoptimized
      />
    );

    lastIndex = imageRegex.lastIndex;
  }

  if (lastIndex < md.length) {
    nodes.push(
      <div
        className="contents"
        key={`text-${lastIndex}`}
        dangerouslySetInnerHTML={{ __html: parse(md.slice(lastIndex)) }}
      />
    );
  }

  return nodes;
}

function parse(md: string): string {
  return md
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" style="color: #F86E4C; text-decoration: underline;">$1</a>'
    )
    .replace(/^---$/gm, '<hr />')
    .replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>')
    .replace(/^\s*\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)(\n(?!<li>)|$)/g, (m) => `<ul>${m}</ul>`)
    .replace(/^(?!<[a-z]).+$/gm, (line) => (line.trim() ? `<p>${line}</p>` : ''))
    .replace(/\n{2,}/g, '')
    .trim();
}
