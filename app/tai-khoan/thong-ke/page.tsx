import type { Metadata } from 'next';
import { EmptyState, PageHeader } from '../_components/account-ui';

export const metadata: Metadata = {
  title: 'Thống kê - MeTruyenMoi',
  description: 'Xem thống kê hoạt động đọc truyện của bạn',
};

export default function ThongKePage() {
  return (
    <div className="space-y-6">
      <PageHeader icon="chart" title="Thống kê" description="Xem thống kê hoạt động đọc truyện của bạn" iconClassName="text-lime-500" />
      <EmptyState
        icon="chart"
        title="Đang phát triển"
        description="Tính năng thống kê đang được phát triển. Sẽ sớm có biểu đồ và số liệu chi tiết!"
      />
    </div>
  );
}
