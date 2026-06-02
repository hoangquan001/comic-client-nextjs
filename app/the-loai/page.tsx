import TheLoaiContent from './the-loai-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema } from '@/lib/seo/json-ld';

export default function TheLoaiPage() {
  return (
    <>
      <JsonLdScript
        data={generateBreadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Thể loại', url: '/the-loai' },
        ])}
      />
      <TheLoaiContent />
    </>
  );
}
