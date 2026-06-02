import type { Metadata } from 'next';
import { EmptyState, PageHeader } from '../_components/account-ui';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Thành tích', '/tai-khoan/thanh-tich');

export default function ThanhTichPage() {
  return (
    <div className="space-y-6">
      <PageHeader icon="trophy" title="Thành tích" description="Xem các huy hiệu và thành tựu đã đạt được" iconClassName="text-orange-500" />
      <EmptyState
        icon="trophy"
        title="Chưa có thành tích"
        description="Hãy đọc truyện và tham gia hoạt động để mở khóa các thành tích thú vị!"
      />
    </div>
  );
}
