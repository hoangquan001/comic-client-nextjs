'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import Selection from '@/components/common/selection/selection';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  agreePrivacy: boolean;
}

const FAQS = [
  {
    question: 'Tôi quên mật khẩu tài khoản, làm sao để khôi phục?',
    answer: 'Bạn có thể sử dụng tính năng "Quên mật khẩu" tại trang đăng nhập. Chúng tôi sẽ gửi link khôi phục qua email đã đăng ký.',
  },
  {
    question: 'Làm sao để báo cáo nội dung không phù hợp?',
    answer: 'Bạn có thể sử dụng form liên hệ trên trang này, chọn chủ đề "Báo cáo nội dung" và cung cấp URL hoặc thông tin chi tiết về nội dung cần báo cáo.',
  },
  {
    question: 'Thời gian phản hồi trung bình là bao lâu?',
    answer: 'Chúng tôi cố gắng phản hồi trong vòng 24 giờ đối với các yêu cầu thông thường. Các vấn đề khẩn cấp sẽ được xử lý ưu tiên trong ngày.',
  },
  {
    question: 'Tôi muốn hợp tác với MeTruyenMoi, liên hệ qua đâu?',
    answer: 'Vui lòng gửi email về cskh.metruyenmoi@gmail.com với chủ đề "Hợp tác" hoặc điền form liên hệ chọn chủ đề "Hợp tác kinh doanh".',
  },
];

const SUBJECT_OPTIONS = [
  { value: '', label: 'Chọn chủ đề' },
  { value: 'technical', label: 'Hỗ trợ kỹ thuật' },
  { value: 'account', label: 'Vấn đề tài khoản' },
  { value: 'content', label: 'Báo cáo nội dung' },
  { value: 'copyright', label: 'Khiếu nại bản quyền' },
  { value: 'suggestion', label: 'Góp ý, đề xuất' },
  { value: 'partnership', label: 'Hợp tác kinh doanh' },
  { value: 'other', label: 'Khác' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    if (!data.agreePrivacy) return;
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    reset();
  };

  return (
    <div className="container mx-auto px-3 py-8 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/10 via-emerald-500/10 to-fuchsia-600/10 dark:from-blue-400/10 dark:via-emerald-400/10 dark:to-fuchsia-400/10 border border-zinc-200/60 dark:border-zinc-800 p-8 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Liên Hệ Với Chúng Tôi
        </h1>
        <p className="mt-3 opacity-80">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            Phản hồi trong 24 giờ
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
            Đang hoạt động
          </span>
        </div>
      </div>

      {/* Quick Contact Methods */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: '📧',
            title: 'Email',
            desc: 'cskh.metruyenmoi@gmail.com',
            action: 'Gửi Email',
            href: 'mailto:cskh.metruyenmoi@gmail.com',
          },
          {
            icon: '💬',
            title: 'Chat Trực Tuyến',
            desc: 'Hỗ trợ tức thì',
            action: 'Bắt Đầu Chat',
            href: '/tro-ly-ai',
          },
          {
            icon: '📱',
            title: 'Mạng Xã Hội',
            desc: 'Theo dõi chúng tôi',
            action: 'Kết Nối',
            href: '#',
          },
          {
            icon: '❓',
            title: 'FAQ',
            desc: 'Câu hỏi thường gặp',
            action: 'Xem FAQ',
            href: '/cau-hoi-thuong-gap',
          },
        ].map((method) => (
          <div key={method.title} className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-center">
            <div className="text-2xl mb-2">{method.icon}</div>
            <h3 className="font-semibold">{method.title}</h3>
            <p className="text-sm opacity-70 mt-1">{method.desc}</p>
            {method.href.startsWith('/') ? (
              <Link
                href={method.href}
                className="mt-3 inline-block px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                {method.action}
              </Link>
            ) : (
              <a
                href={method.href}
                className="mt-3 inline-block px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                {method.action}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6 mb-8">
        <h2 className="text-xl font-bold mb-2">Gửi Tin Nhắn</h2>
        <p className="text-sm opacity-80 mb-6">
          Điền thông tin bên dưới và chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Họ và tên *</label>
              <input
                id="name"
                {...register('name', { required: 'Vui lòng nhập họ và tên' })}
                className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 outline-none focus:ring focus:ring-blue-500/30"
                placeholder="Nhập họ và tên của bạn"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
                })}
                className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 outline-none focus:ring focus:ring-blue-500/30"
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 outline-none focus:ring focus:ring-blue-500/30"
                placeholder="0123 456 789"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Chủ đề *</label>
              <Controller
                name="subject"
                control={control}
                defaultValue=""
                rules={{ required: 'Vui lòng chọn chủ đề' }}
                render={({ field }) => (
                  <Selection
                    value={field.value}
                    onChange={(nextValue) => field.onChange(String(nextValue))}
                    options={SUBJECT_OPTIONS}
                    className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 outline-none focus:ring focus:ring-blue-500/30"
                  />
                )}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Tin nhắn *</label>
            <textarea
              id="message"
              rows={6}
              {...register('message', {
                required: 'Vui lòng nhập tin nhắn',
                minLength: { value: 10, message: 'Tối thiểu 10 ký tự' },
                maxLength: { value: 1000, message: 'Tối đa 1000 ký tự' },
              })}
              className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 outline-none focus:ring focus:ring-blue-500/30 resize-none"
              placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('agreePrivacy', { required: 'Vui lòng đồng ý với chính sách bảo mật' })}
                className="mt-1 rounded border-zinc-300 dark:border-zinc-600"
              />
              <span className="text-sm">
                Tôi đồng ý với{' '}
                <Link href="/chinh-sach-bao-mat" className="text-blue-600 hover:underline" target="_blank">
                  Chính sách bảo mật
                </Link>{' '}
                và cho phép xử lý thông tin cá nhân *
              </span>
            </label>
            {errors.agreePrivacy && <p className="text-red-500 text-xs mt-1">{errors.agreePrivacy.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Gửi Tin Nhắn
              </>
            )}
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: '🏢',
            title: 'Thông tin website',
            items: ['Tên: MeTruyenMoi', 'Địa chỉ: Việt Nam'],
          },
          {
            icon: '📧',
            title: 'Email hỗ trợ',
            items: ['Hỗ trợ chung: cskh.metruyenmoi@gmail.com', 'Bản quyền: cskh.metruyenmoi@gmail.com'],
          },
          {
            icon: '⏰',
            title: 'Thời gian hỗ trợ',
            items: ['Hỗ trợ kỹ thuật: 24-48 giờ', 'Báo cáo vi phạm: 1-3 ngày làm việc', 'Khiếu nại bản quyền: 24 giờ'],
          },
        ].map((info) => (
          <div key={info.title} className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            <div className="text-2xl mb-2">{info.icon}</div>
            <h3 className="font-semibold mb-2">{info.title}</h3>
            <div className="text-sm opacity-80 space-y-1">
              {info.items.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-bold mb-4">Câu Hỏi Thường Gặp</h2>
        <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800">
          {FAQS.map((faq, i) => (
            <div key={i} className="py-3">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between font-medium text-left"
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-4 h-4 shrink-0 ml-2 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm opacity-80">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSuccess(false)}>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 max-w-sm mx-4 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-bold mb-2">Gửi thành công!</h3>
            <p className="text-sm opacity-80 mb-4">Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
