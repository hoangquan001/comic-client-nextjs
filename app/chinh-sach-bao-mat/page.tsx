import type { Metadata } from 'next';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Chính sách bảo mật',
    'Chính sách bảo mật của MeTruyenMoi - Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng.',
    'chinh-sach-bao-mat'
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="lg:container mx-auto px-3 py-8 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/10 via-emerald-500/10 to-fuchsia-600/10 dark:from-blue-400/10 dark:via-emerald-400/10 dark:to-fuchsia-400/10 border border-zinc-200/60 dark:border-zinc-800 p-8 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
          Chính Sách Bảo Mật
        </h1>
        <p className="mt-3 opacity-80">Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            Cập nhật lần cuối: 15/05/2026
          </span>
          <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            Phiên bản 2.0
          </span>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6 mb-8">
        <h2 className="font-semibold mb-3">Mục lục</h2>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li><a href="#gioi-thieu" className="text-blue-600 hover:underline">Giới thiệu</a></li>
          <li><a href="#thong-tin-thu-thap" className="text-blue-600 hover:underline">Thông tin chúng tôi thu thập</a></li>
          <li><a href="#muc-dich-su-dung" className="text-blue-600 hover:underline">Mục đích sử dụng thông tin</a></li>
          <li><a href="#cookies-tracking" className="text-blue-600 hover:underline">Cookies và theo dõi</a></li>
          <li><a href="#chia-se-thong-tin" className="text-blue-600 hover:underline">Chia sẻ thông tin</a></li>
          <li><a href="#bao-mat-du-lieu" className="text-blue-600 hover:underline">Bảo mật dữ liệu</a></li>
          <li><a href="#luu-tru-du-lieu" className="text-blue-600 hover:underline">Lưu trữ dữ liệu</a></li>
          <li><a href="#quyen-nguoi-dung" className="text-blue-600 hover:underline">Quyền của người dùng</a></li>
          <li><a href="#dich-vu-ben-thu-ba" className="text-blue-600 hover:underline">Dịch vụ bên thứ ba</a></li>
          <li><a href="#thay-doi-chinh-sach" className="text-blue-600 hover:underline">Thay đổi chính sách</a></li>
        </ol>
      </nav>

      {/* Content */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section id="gioi-thieu" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">1. Giới thiệu</h2>
          <p className="opacity-80 mb-3">
            Chào mừng bạn đến với <strong>MeTruyenMoi</strong> (metruyenmoi.org), nền tảng đọc truyện tranh trực tuyến hàng đầu Việt Nam.
          </p>
          <p className="opacity-80 mb-4">
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
          </p>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800 text-sm">
            <h3 className="font-semibold mb-2">Cam kết của chúng tôi:</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-90">
              <li>Minh bạch trong việc thu thập và sử dụng dữ liệu</li>
              <li>Bảo mật thông tin cá nhân với các biện pháp kỹ thuật tiên tiến</li>
              <li>Tôn trọng quyền kiểm soát dữ liệu của người dùng</li>
              <li>Tuân thủ các quy định pháp luật về bảo vệ dữ liệu cá nhân</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section id="thong-tin-thu-thap" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">2. Thông tin chúng tôi thu thập</h2>

          <h3 className="font-semibold mb-2">2.1. Thông tin bạn cung cấp trực tiếp</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h4 className="font-medium mb-2">Thông tin tài khoản</h4>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Tên người dùng</li>
                <li>Địa chỉ email</li>
                <li>Mật khẩu (được mã hóa)</li>
                <li>Ảnh đại diện (tùy chọn)</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h4 className="font-medium mb-2">Thông tin tương tác</h4>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Bình luận và đánh giá</li>
                <li>Danh sách yêu thích</li>
                <li>Lịch sử đọc truyện</li>
                <li>Đánh dấu trang</li>
              </ul>
            </div>
          </div>

          <h3 className="font-semibold mb-2">2.2. Thông tin thu thập tự động</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h4 className="font-medium mb-2">Thông tin kỹ thuật</h4>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Địa chỉ IP</li>
                <li>Loại trình duyệt và phiên bản</li>
                <li>Hệ điều hành</li>
                <li>Độ phân giải màn hình</li>
                <li>Múi giờ</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h4 className="font-medium mb-2">Thông tin sử dụng</h4>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Trang web được truy cập</li>
                <li>Thời gian truy cập</li>
                <li>Tần suất sử dụng</li>
                <li>Hành vi đọc truyện</li>
                <li>Tương tác với quảng cáo</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="muc-dich-su-dung" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">3. Mục đích sử dụng thông tin</h2>
          <p className="opacity-80 mb-4">Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '📚', title: 'Cung cấp dịch vụ', items: ['Hiển thị nội dung truyện tranh', 'Quản lý tài khoản người dùng', 'Lưu trữ lịch sử đọc và sở thích', 'Cung cấp tính năng tương tác'] },
              { icon: '🔧', title: 'Cải thiện dịch vụ', items: ['Phân tích hành vi người dùng', 'Tối ưu hóa hiệu suất website', 'Phát triển tính năng mới', 'Khắc phục lỗi và sự cố'] },
              { icon: '🛡️', title: 'Bảo mật và an toàn', items: ['Phát hiện và ngăn chặn spam', 'Bảo vệ khỏi các cuộc tấn công', 'Xác thực danh tính người dùng', 'Tuân thủ quy định pháp luật'] },
              { icon: '📢', title: 'Truyền thông', items: ['Gửi thông báo quan trọng', 'Cập nhật chính sách dịch vụ', 'Thông tin truyện mới (nếu đồng ý)', 'Hỗ trợ khách hàng'] },
            ].map((purpose) => (
              <div key={purpose.title} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-xl mb-1">{purpose.icon}</div>
                <h3 className="font-semibold mb-2">{purpose.title}</h3>
                <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                  {purpose.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section id="cookies-tracking" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">4. Cookies và theo dõi</h2>

          <h3 className="font-semibold mb-2">4.1. Cookies là gì?</h3>
          <p className="opacity-80 mb-4 text-sm">
            Cookies là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi truy cập website. Chúng giúp chúng tôi nhận diện bạn và cải thiện trải nghiệm sử dụng.
          </p>

          <h3 className="font-semibold mb-2">4.2. Các loại cookies chúng tôi sử dụng</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {[
              { title: '🔧 Cookies cần thiết', desc: 'Không thể tắt. Cần thiết cho hoạt động cơ bản của website.', items: ['Xác thực đăng nhập', 'Bảo mật phiên làm việc', 'Lưu cài đặt ngôn ngữ'], color: 'blue' },
              { title: '⚙️ Cookies chức năng', desc: 'Cải thiện trải nghiệm sử dụng và lưu trữ tùy chọn của bạn.', items: ['Lịch sử đọc truyện', 'Danh sách yêu thích', 'Cài đặt giao diện'], color: 'emerald' },
              { title: '📊 Cookies phân tích', desc: 'Giúp chúng tôi hiểu cách bạn sử dụng website để cải thiện dịch vụ.', items: ['Google Analytics', 'Thống kê lượt truy cập', 'Phân tích hành vi người dùng'], color: 'amber' },
              { title: '📢 Cookies quảng cáo', desc: 'Hiển thị quảng cáo phù hợp với sở thích của bạn.', items: ['Google AdSense', 'Quảng cáo được cá nhân hóa', 'Theo dõi hiệu quả quảng cáo'], color: 'fuchsia' },
            ].map((cookie) => (
              <div key={cookie.title} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <h4 className="font-semibold mb-1 text-sm">{cookie.title}</h4>
                <p className="text-xs opacity-70 mb-2">{cookie.desc}</p>
                <ul className="list-disc pl-5 text-xs opacity-80 space-y-0.5">
                  {cookie.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mb-2">4.3. Quản lý cookies</h3>
          <p className="opacity-80 text-sm mb-2">Bạn có thể kiểm soát cookies thông qua:</p>
          <ul className="list-disc pl-5 text-sm opacity-80 space-y-1 mb-3">
            <li><strong>Cài đặt trình duyệt:</strong> Chặn hoặc xóa cookies</li>
            <li><strong>Công cụ quản lý cookies:</strong> Sử dụng banner đồng ý cookies trên website</li>
            <li><strong>Trang cài đặt tài khoản:</strong> Điều chỉnh tùy chọn theo dõi</li>
          </ul>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800 text-sm">
            <strong>Lưu ý:</strong> Việc tắt cookies có thể ảnh hưởng đến một số tính năng của website.
          </div>
        </section>

        {/* Section 5 */}
        <section id="chia-se-thong-tin" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">5. Chia sẻ thông tin</h2>
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800 mb-4">
            <p className="text-sm font-medium">
              <strong>Chúng tôi KHÔNG bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba</strong> vì mục đích thương mại, trừ các trường hợp được nêu rõ dưới đây.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🔧', title: 'Nhà cung cấp dịch vụ', desc: 'Chia sẻ với các đối tác kỹ thuật để vận hành website.', items: ['Dịch vụ hosting và CDN', 'Dịch vụ phân tích (Google Analytics)', 'Dịch vụ email marketing', 'Dịch vụ bảo mật'] },
              { icon: '⚖️', title: 'Yêu cầu pháp lý', desc: 'Khi được yêu cầu bởi cơ quan có thẩm quyền.', items: ['Lệnh của tòa án', 'Yêu cầu từ cơ quan thực thi pháp luật', 'Tuân thủ quy định pháp luật', 'Bảo vệ quyền lợi hợp pháp'] },
              { icon: '🛡️', title: 'Bảo vệ an toàn', desc: 'Để bảo vệ website và người dùng.', items: ['Ngăn chặn gian lận', 'Phát hiện hoạt động bất thường', 'Bảo vệ quyền sở hữu trí tuệ', 'Đảm bảo an toàn cộng đồng'] },
            ].map((sharing) => (
              <div key={sharing.title} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-xl mb-1">{sharing.icon}</div>
                <h3 className="font-semibold mb-1 text-sm">{sharing.title}</h3>
                <p className="text-xs opacity-70 mb-2">{sharing.desc}</p>
                <ul className="list-disc pl-5 text-xs opacity-80 space-y-0.5">
                  {sharing.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section id="bao-mat-du-lieu" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">6. Bảo mật dữ liệu</h2>
          <p className="opacity-80 mb-4 text-sm">Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="font-semibold mb-2">🔐 Bảo mật kỹ thuật</h3>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li><strong>Mã hóa SSL/TLS:</strong> Tất cả dữ liệu được mã hóa khi truyền tải</li>
                <li><strong>Mã hóa mật khẩu:</strong> Sử dụng thuật toán hash an toàn</li>
                <li><strong>Tường lửa:</strong> Bảo vệ máy chủ khỏi các cuộc tấn công</li>
                <li><strong>Giám sát 24/7:</strong> Theo dõi liên tục các hoạt động bất thường</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="font-semibold mb-2">👥 Bảo mật quản lý</h3>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li><strong>Kiểm soát truy cập:</strong> Chỉ nhân viên được ủy quyền mới có thể truy cập</li>
                <li><strong>Đào tạo bảo mật:</strong> Nhân viên được đào tạo về bảo mật thông tin</li>
                <li><strong>Kiểm tra định kỳ:</strong> Đánh giá và cập nhật biện pháp bảo mật</li>
                <li><strong>Sao lưu dữ liệu:</strong> Sao lưu thường xuyên để phòng chống mất mát</li>
              </ul>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800 text-sm">
            <h3 className="font-semibold mb-2">⚠️ Lưu ý quan trọng</h3>
            <p className="opacity-80 mb-2">Mặc dù chúng tôi áp dụng các biện pháp bảo mật tốt nhất, không có hệ thống nào là hoàn toàn an toàn 100%. Chúng tôi khuyến khích bạn:</p>
            <ul className="list-disc pl-5 opacity-80 space-y-1">
              <li>Sử dụng mật khẩu mạnh và duy nhất</li>
              <li>Không chia sẻ thông tin đăng nhập</li>
              <li>Đăng xuất sau khi sử dụng trên thiết bị chung</li>
              <li>Báo cáo ngay nếu phát hiện hoạt động bất thường</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section id="luu-tru-du-lieu" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">7. Lưu trữ dữ liệu</h2>

          <h3 className="font-semibold mb-2">7.1. Thời gian lưu trữ</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-2 pr-4">Loại dữ liệu</th>
                  <th className="text-left py-2 pr-4">Thời gian</th>
                  <th className="text-left py-2">Mục đích</th>
                </tr>
              </thead>
              <tbody className="opacity-80">
                {[
                  ['Thông tin tài khoản', 'Cho đến khi bạn xóa tài khoản', 'Cung cấp dịch vụ liên tục'],
                  ['Lịch sử đọc truyện', '2 năm kể từ lần truy cập cuối', 'Cải thiện đề xuất nội dung'],
                  ['Bình luận và đánh giá', 'Vô thời hạn (trừ khi bị xóa)', 'Duy trì tính toàn vẹn nội dung'],
                  ['Dữ liệu phân tích', '26 tháng', 'Phân tích xu hướng dài hạn'],
                  ['Logs hệ thống', '6 tháng', 'Bảo mật và khắc phục sự cố'],
                ].map(([type, period, reason]) => (
                  <tr key={type} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-2 pr-4">{type}</td>
                    <td className="py-2 pr-4">{period}</td>
                    <td className="py-2">{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold mb-2">7.2. Xóa dữ liệu tự động</h3>
          <p className="opacity-80 text-sm mb-2">Chúng tôi tự động xóa dữ liệu trong các trường hợp sau:</p>
          <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
            <li>Tài khoản không hoạt động trong 3 năm</li>
            <li>Dữ liệu tạm thời sau 30 ngày</li>
            <li>Logs lỗi sau 90 ngày</li>
            <li>Dữ liệu phiên làm việc sau 24 giờ</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section id="quyen-nguoi-dung" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">8. Quyền của người dùng</h2>
          <p className="opacity-80 mb-4 text-sm">Bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {[
              { icon: '👁️', title: 'Quyền truy cập', desc: 'Xem thông tin cá nhân mà chúng tôi lưu trữ về bạn' },
              { icon: '✏️', title: 'Quyền chỉnh sửa', desc: 'Cập nhật hoặc sửa đổi thông tin cá nhân không chính xác' },
              { icon: '🗑️', title: 'Quyền xóa', desc: 'Yêu cầu xóa thông tin cá nhân (trong một số trường hợp)' },
              { icon: '📤', title: 'Quyền xuất dữ liệu', desc: 'Tải xuống bản sao dữ liệu cá nhân của bạn' },
              { icon: '🚫', title: 'Quyền phản đối', desc: 'Từ chối việc xử lý dữ liệu cho mục đích marketing' },
              { icon: '⏸️', title: 'Quyền hạn chế', desc: 'Yêu cầu hạn chế việc xử lý dữ liệu trong một số trường hợp' },
            ].map((right) => (
              <div key={right.title} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-lg mb-1">{right.icon}</div>
                <h3 className="font-semibold text-sm">{right.title}</h3>
                <p className="text-xs opacity-70 mt-1">{right.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800 text-sm">
            <h3 className="font-semibold mb-2">Cách thực hiện quyền của bạn</h3>
            <p className="opacity-80 mb-2">Để thực hiện các quyền trên, bạn có thể:</p>
            <ol className="list-decimal pl-5 opacity-80 space-y-1">
              <li>Đăng nhập tài khoản và truy cập trang quản lý</li>
              <li>Chọn quyền muốn thực hiện</li>
              <li>Xác nhận danh tính nếu cần thiết</li>
              <li>Chúng tôi sẽ xử lý trong vòng 30 ngày</li>
            </ol>
          </div>
        </section>

        {/* Section 9 */}
        <section id="dich-vu-ben-thu-ba" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">9. Dịch vụ bên thứ ba</h2>
          <p className="opacity-80 mb-4 text-sm">Website của chúng tôi sử dụng các dịch vụ bên thứ ba để cải thiện trải nghiệm người dùng:</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {[
              { title: '🔍 Google Analytics', purpose: 'Phân tích lưu lượng truy cập và hành vi người dùng', data: 'Thông tin truy cập, thiết bị, vị trí địa lý' },
              { title: '📢 Google AdSense', purpose: 'Hiển thị quảng cáo có liên quan', data: 'Sở thích, hành vi duyệt web' },
              { title: '☁️ Cloudflare', purpose: 'CDN và bảo mật website', data: 'Địa chỉ IP, logs truy cập' },
              { title: '💬 Disqus Comments', purpose: 'Hệ thống bình luận', data: 'Thông tin tài khoản, nội dung bình luận' },
            ].map((service) => (
              <div key={service.title} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                <p className="text-xs opacity-80"><strong>Mục đích:</strong> {service.purpose}</p>
                <p className="text-xs opacity-80"><strong>Dữ liệu:</strong> {service.data}</p>
              </div>
            ))}
          </div>
          <p className="text-sm opacity-80">
            Các bài viết trên website có thể bao gồm nội dung được nhúng từ các trang web khác. Các website này có thể thu thập dữ liệu về bạn, sử dụng cookies và giám sát tương tác của bạn với nội dung được nhúng.
          </p>
        </section>

        {/* Section 10 */}
        <section id="thay-doi-chinh-sach" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">10. Thay đổi chính sách</h2>
          <p className="opacity-80 mb-4 text-sm">
            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh các thay đổi trong dịch vụ hoặc yêu cầu pháp lý.
          </p>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-4">
            <h3 className="font-semibold text-sm mb-2">Quy trình thông báo thay đổi:</h3>
            <ol className="list-decimal pl-5 text-sm opacity-80 space-y-1">
              <li>Thông báo ít nhất 30 ngày trước khi có thay đổi quan trọng</li>
              <li>Cập nhật chính sách mới trên website với ngày hiệu lực</li>
              <li>Gửi email thông báo đến người dùng đã đăng ký</li>
              <li>Yêu cầu xác nhận đồng ý cho các thay đổi quan trọng</li>
            </ol>
          </div>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <h3 className="font-semibold text-sm mb-2">Lịch sử phiên bản:</h3>
            <div className="text-sm opacity-80 space-y-2">
              <div className="flex gap-3"><span className="w-24 shrink-0">15/05/2026</span><span className="w-10 shrink-0">v2.0</span><span>Cập nhật toàn diện, bổ sung quyền người dùng</span></div>
              <div className="flex gap-3"><span className="w-24 shrink-0">01/01/2024</span><span className="w-10 shrink-0">v1.5</span><span>Bổ sung chính sách cookies chi tiết</span></div>
              <div className="flex gap-3"><span className="w-24 shrink-0">01/07/2023</span><span className="w-10 shrink-0">v1.0</span><span>Phiên bản đầu tiên</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
