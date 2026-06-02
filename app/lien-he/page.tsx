import LienHeContent from './lien-he-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateContactPageSchema } from '@/lib/seo/json-ld';

export default function LienHePage() {
  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: 'Liên hệ', url: '/lien-he' },
          ]),
          generateContactPageSchema(),
        ]}
      />
      <LienHeContent />
    </>
  );
}
