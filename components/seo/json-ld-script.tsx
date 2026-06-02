import type { JsonLdData } from '@/lib/seo/json-ld';

interface JsonLdScriptProps {
  data: JsonLdData;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
