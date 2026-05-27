import type { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Điều khoản sử dụng',
    'Điều khoản sử dụng MeTruyenMoi - Quy định và điều kiện sử dụng dịch vụ đọc truyện tranh trực tuyến.',
    'dieu-khoan'
  );
}

export default function TermsPage() {
  return (
    <div className="lg:container mx-auto w-full px-3 py-8 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/10 via-emerald-500/10 to-fuchsia-600/10 dark:from-blue-400/10 dark:via-emerald-400/10 dark:to-fuchsia-400/10 border border-zinc-200/60 dark:border-zinc-800 p-8 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Điều Khoản Sử Dụng
        </h1>
        <p className="mt-3 opacity-80">Quy định và điều kiện sử dụng dịch vụ đọc truyện tranh trực tuyến</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            Có hiệu lực từ: 15/05/2026
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
          <li><a href="#chap-nhan-dieu-khoan" className="text-blue-600 hover:underline">Chấp nhận điều khoản</a></li>
          <li><a href="#dich-vu" className="text-blue-600 hover:underline">Mô tả dịch vụ</a></li>
          <li><a href="#tai-khoan" className="text-blue-600 hover:underline">Tài khoản người dùng</a></li>
          <li><a href="#quyen-va-nghia-vu" className="text-blue-600 hover:underline">Quyền và nghĩa vụ</a></li>
          <li><a href="#noi-dung" className="text-blue-600 hover:underline">Nội dung và bản quyền</a></li>
          <li><a href="#hanh-vi-cam" className="text-blue-600 hover:underline">Hành vi bị cấm</a></li>
          <li><a href="#trach-nhiem" className="text-blue-600 hover:underline">Trách nhiệm và giới hạn</a></li>
          <li><a href="#thanh-toan" className="text-blue-600 hover:underline">Thanh toán và hoàn tiền</a></li>
          <li><a href="#bao-mat" className="text-blue-600 hover:underline">Bảo mật thông tin</a></li>
          <li><a href="#thay-doi" className="text-blue-600 hover:underline">Thay đổi điều khoản</a></li>
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
            Điều khoản sử dụng này quy định các quyền, nghĩa vụ và trách nhiệm của bạn khi sử dụng dịch vụ của chúng tôi. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
          </p>
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800 text-sm">
            <p className="font-semibold mb-1">Thông báo quan trọng</p>
            <p className="opacity-80">
              Bằng việc truy cập và sử dụng website, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="chap-nhan-dieu-khoan" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">2. Chấp nhận điều khoản</h2>
          <p className="opacity-80 mb-4 text-sm">
            Khi bạn truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào trên website, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ các điều khoản này.
          </p>

          <h3 className="font-semibold mb-2">Độ tuổi sử dụng</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
              <div className="font-semibold">Dưới 13 tuổi</div>
              <p className="text-xs opacity-70">Không được phép sử dụng dịch vụ</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
              <div className="font-semibold">13-16 tuổi</div>
              <p className="text-xs opacity-70">Cần sự đồng ý của phụ huynh/người giám hộ</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <div className="font-semibold">Trên 16 tuổi</div>
              <p className="text-xs opacity-70">Có thể sử dụng đầy đủ các tính năng</p>
            </div>
          </div>

          <p className="opacity-80 text-sm">
            Chúng tôi có quyền cập nhật điều khoản này bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn chấp nhận các điều khoản mới.
          </p>
        </section>

        {/* Section 3 */}
        <section id="dich-vu" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">3. Mô tả dịch vụ</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {[
              { icon: '📚', title: 'Đọc truyện tranh', desc: 'Truy cập thư viện truyện tranh đa dạng với chất lượng cao', items: ['Hàng nghìn đầu truyện', 'Cập nhật liên tục', 'Đọc miễn phí', 'Giao diện thân thiện'] },
              { icon: '👤', title: 'Quản lý tài khoản', desc: 'Tính năng cá nhân hóa trải nghiệm đọc truyện', items: ['Lưu lịch sử đọc', 'Danh sách yêu thích', 'Theo dõi truyện', 'Đánh giá và bình luận'] },
              { icon: '🔍', title: 'Tìm kiếm và khám phá', desc: 'Công cụ tìm kiếm và gợi ý thông minh', items: ['Tìm kiếm nâng cao', 'Lọc theo thể loại', 'Gợi ý cá nhân', 'Bảng xếp hạng'] },
              { icon: '💬', title: 'Cộng đồng', desc: 'Tương tác với cộng đồng yêu thích truyện tranh', items: ['Bình luận và thảo luận', 'Đánh giá truyện', 'Chia sẻ truyện yêu thích', 'Kết nối bạn bè'] },
            ].map((service) => (
              <div key={service.title} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-xl mb-1">{service.icon}</div>
                <h3 className="font-semibold text-sm">{service.title}</h3>
                <p className="text-xs opacity-70 mt-1">{service.desc}</p>
                <ul className="list-disc pl-5 text-xs opacity-80 mt-2 space-y-0.5">
                  {service.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="opacity-80 text-sm">
            Chúng tôi cố gắng duy trì dịch vụ hoạt động 24/7, tuy nhiên có thể có những lúc gián đoạn do bảo trì hệ thống, cập nhật tính năng mới, sự cố kỹ thuật không lường trước, hoặc yêu cầu từ cơ quan có thẩm quyền.
          </p>
        </section>

        {/* Section 4 */}
        <section id="tai-khoan" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">4. Tài khoản người dùng</h2>
          <p className="opacity-80 text-sm mb-4">Yêu cầu đăng ký: Cung cấp thông tin chính xác và đầy đủ, sử dụng địa chỉ email hợp lệ, tạo mật khẩu mạnh và bảo mật, đồng ý với điều khoản sử dụng.</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="font-semibold text-sm mb-2">🔐 Trách nhiệm của bạn</h3>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Giữ bí mật thông tin đăng nhập</li>
                <li>Không chia sẻ tài khoản với người khác</li>
                <li>Thông báo ngay khi phát hiện bất thường</li>
                <li>Cập nhật thông tin khi có thay đổi</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="font-semibold text-sm mb-2">🛡️ Trách nhiệm của chúng tôi</h3>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Bảo vệ thông tin cá nhân</li>
                <li>Mã hóa dữ liệu nhạy cảm</li>
                <li>Giám sát hoạt động bất thường</li>
                <li>Hỗ trợ khôi phục tài khoản</li>
              </ul>
            </div>
          </div>

          <p className="opacity-80 text-sm">
            Chúng tôi có quyền tạm khóa hoặc chấm dứt tài khoản của bạn nếu vi phạm điều khoản sử dụng, có hoạt động bất thường hoặc theo yêu cầu của cơ quan có thẩm quyền.
          </p>
        </section>

        {/* Section 5 */}
        <section id="quyen-va-nghia-vu" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">5. Quyền và nghĩa vụ</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <h3 className="font-semibold text-sm mb-2">✅ Quyền của người dùng</h3>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Truy cập và sử dụng dịch vụ miễn phí</li>
                <li>Tạo tài khoản và quản lý thông tin cá nhân</li>
                <li>Đánh giá, bình luận và chia sẻ</li>
                <li>Nhận hỗ trợ kỹ thuật khi cần thiết</li>
                <li>Yêu cầu xóa tài khoản và dữ liệu</li>
                <li>Khiếu nại về nội dung không phù hợp</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-semibold text-sm mb-2">📋 Nghĩa vụ của người dùng</h3>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Tuân thủ các điều khoản sử dụng</li>
                <li>Không vi phạm bản quyền của bên thứ ba</li>
                <li>Không đăng tải nội dung có hại</li>
                <li>Tôn trọng quyền riêng tư của người khác</li>
                <li>Sử dụng dịch vụ một cách hợp pháp</li>
                <li>Báo cáo các vi phạm khi phát hiện</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="noi-dung" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">6. Nội dung và bản quyền</h2>

          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800 mb-4">
            <p className="text-sm opacity-80">
              <strong>Thông báo về nội dung:</strong> Mọi thông tin và hình ảnh truyện tranh trên website đều được sưu tầm từ Internet. Chúng tôi không sở hữu hay chịu trách nhiệm về bản quyền của các nội dung này.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="font-semibold text-sm mb-1">🔍 Kiểm duyệt nội dung</h3>
              <p className="text-xs opacity-70">Chúng tôi thực hiện kiểm duyệt nội dung để đảm bảo phù hợp với quy định pháp luật và tiêu chuẩn cộng đồng.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="font-semibold text-sm mb-1">⚖️ Xử lý vi phạm bản quyền</h3>
              <p className="text-xs opacity-70">Khi nhận được khiếu nại về vi phạm bản quyền từ chủ sở hữu hợp pháp, chúng tôi sẽ xem xét và gỡ bỏ nội dung vi phạm trong thời gian sớm nhất.</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="font-semibold text-sm mb-1">📧 Báo cáo vi phạm</h3>
              <p className="text-xs opacity-70">Nếu bạn là chủ sở hữu bản quyền và phát hiện nội dung vi phạm, vui lòng liên hệ qua email: cskh.metruyenmoi@gmail.com</p>
            </div>
          </div>

          <p className="opacity-80 text-sm">
            Khi bạn đăng tải bình luận, đánh giá hoặc nội dung khác lên website, bạn cấp cho chúng tôi quyền sử dụng, hiển thị và phân phối nội dung đó trên nền tảng.
          </p>
        </section>

        {/* Section 7 */}
        <section id="hanh-vi-cam" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">7. Hành vi bị cấm</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { icon: '🚫', title: 'Hành vi kỹ thuật', items: ['Tấn công, hack hoặc phá hoại hệ thống', 'Sử dụng bot, script tự động', 'Tải xuống hàng loạt nội dung', 'Reverse engineering mã nguồn', 'Phát tán virus, malware'] },
              { icon: '💬', title: 'Hành vi nội dung', items: ['Đăng nội dung khiêu dâm, bạo lực', 'Spam, quảng cáo không mong muốn', 'Ngôn từ thù địch, phân biệt đối xử', 'Thông tin sai lệch, lừa đảo', 'Vi phạm quyền riêng tư của người khác'] },
              { icon: '⚖️', title: 'Hành vi pháp lý', items: ['Vi phạm bản quyền, sở hữu trí tuệ', 'Hoạt động bất hợp pháp', 'Mạo danh cá nhân, tổ chức', 'Thu thập thông tin cá nhân trái phép', 'Tạo nhiều tài khoản ảo'] },
            ].map((category) => (
              <div key={category.title} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-sm mb-2">{category.icon} {category.title}</h3>
                <ul className="list-disc pl-5 text-xs opacity-80 space-y-1">
                  {category.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
              <div className="font-semibold text-sm">Cảnh báo</div>
              <p className="text-xs opacity-70">Vi phạm lần đầu hoặc mức độ nhẹ</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-center">
              <div className="font-semibold text-sm">Tạm khóa</div>
              <p className="text-xs opacity-70">Vi phạm nghiêm trọng hoặc tái phạm</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
              <div className="font-semibold text-sm">Khóa vĩnh viễn</div>
              <p className="text-xs opacity-70">Vi phạm rất nghiêm trọng hoặc liên tục</p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="trach-nhiem" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">8. Trách nhiệm và giới hạn</h2>
          <p className="opacity-80 text-sm mb-4">
            Dịch vụ được cung cấp &quot;như hiện tại&quot; và &quot;như có sẵn&quot;. Chúng tôi không đảm bảo rằng dịch vụ sẽ hoạt động liên tục, không có lỗi hoặc hoàn toàn an toàn.
          </p>
          <ul className="list-disc pl-5 text-sm opacity-80 space-y-1 mb-4">
            <li>Không đảm bảo tính chính xác của nội dung</li>
            <li>Không chịu trách nhiệm về thiệt hại gián tiếp</li>
            <li>Không đảm bảo tính khả dụng 100% của dịch vụ</li>
            <li>Không chịu trách nhiệm về hành vi của người dùng khác</li>
          </ul>
          <p className="opacity-80 text-sm">
            Bạn đồng ý bồi thường và giữ cho chúng tôi không bị thiệt hại từ bất kỳ khiếu nại, tổn thất hoặc thiệt hại nào phát sinh từ việc bạn sử dụng dịch vụ hoặc vi phạm điều khoản này.
          </p>
        </section>

        {/* Section 9 */}
        <section id="thanh-toan" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">9. Thanh toán và hoàn tiền</h2>
          <div className="space-y-3 text-sm opacity-80">
            <p>
              <strong>Dịch vụ miễn phí:</strong> Hiện tại, tất cả các dịch vụ cơ bản trên website đều được cung cấp miễn phí. Bạn có thể đọc truyện, tạo tài khoản và sử dụng các tính năng mà không mất phí.
            </p>
            <p>
              <strong>Dịch vụ premium (tương lai):</strong> Chúng tôi có thể giới thiệu các dịch vụ premium trong tương lai với các tính năng nâng cao. Khi đó, chính sách thanh toán và hoàn tiền sẽ được cập nhật chi tiết.
            </p>
            <p>
              <strong>Quảng cáo:</strong> Website có thể hiển thị quảng cáo để duy trì hoạt động. Việc click vào quảng cáo sẽ chuyển hướng bạn đến website của bên thứ ba, nằm ngoài trách nhiệm của chúng tôi.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="bao-mat" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">10. Bảo mật thông tin</h2>
          <p className="opacity-80 text-sm mb-4">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo{' '}
            <Link href="/chinh-sach-bao-mat" className="font-medium text-blue-800 underline hover:text-blue-900 dark:text-blue-300">Chính sách bảo mật</Link> của chúng tôi.
          </p>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-3">
            <h3 className="font-semibold text-sm mb-2">Thu thập thông tin</h3>
            <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
              <li>Thông tin đăng ký tài khoản (email, tên người dùng)</li>
              <li>Lịch sử đọc truyện và sở thích</li>
              <li>Thông tin kỹ thuật (IP, trình duyệt, thiết bị)</li>
              <li>Cookies và dữ liệu phiên làm việc</li>
            </ul>
          </div>
          <p className="opacity-80 text-sm">
            Thông tin được sử dụng để cải thiện dịch vụ, cá nhân hóa trải nghiệm, và đảm bảo an toàn cho cộng đồng người dùng.
          </p>
        </section>

        {/* Section 11 */}
        <section id="thay-doi" className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-3">11. Thay đổi điều khoản</h2>
          <p className="opacity-80 text-sm mb-4">
            Chúng tôi có quyền thay đổi, cập nhật hoặc sửa đổi điều khoản này bất kỳ lúc nào mà không cần thông báo trước.
          </p>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-4">
            <h3 className="font-semibold text-sm mb-2">Quy trình thông báo thay đổi:</h3>
            <ol className="list-decimal pl-5 text-sm opacity-80 space-y-1">
              <li>Điều khoản mới được cập nhật trên website</li>
              <li>Gửi thông báo đến người dùng đã đăng ký (nếu có thay đổi quan trọng)</li>
              <li>Điều khoản mới có hiệu lực ngay sau khi đăng tải</li>
            </ol>
          </div>
          <p className="opacity-80 text-sm">
            Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn đồng ý với điều khoản mới. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
          </p>
        </section>
      </div>
    </div>
  );
}
