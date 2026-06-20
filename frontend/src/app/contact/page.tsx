'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/authContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto fill user details if logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !subject || !message) {
      toast.error('Vui lòng điền đầy đủ các trường thông tin.');
      return;
    }

    setIsSubmitting(true);
    // Mock submit process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Gửi tin nhắn liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất qua email.');
    setIsSubmitting(false);
    
    // Clear form except user details
    setSubject('');
    setMessage('');
    setPhone('');
  };

  const contactInfo = [
    {
      title: 'Hotline Hỗ Trợ',
      value: '1900 886 803',
      subtitle: '9:00 - 22:00 (Thứ 2 - Chủ Nhật)',
      icon: Phone,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Email CSKH',
      value: 'support@fashion.vn',
      subtitle: 'Phản hồi trong vòng 24 giờ làm việc',
      icon: Mail,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Văn Phòng Chính',
      value: '123 Nguyễn Huệ, Quận 1, TP. HCM',
      subtitle: 'Ghé thăm để hợp tác truyền thông/thương hiệu',
      icon: MapPin,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <main className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Hero Header Section */}
      <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10" />
        <div className="relative z-20 text-center max-w-2xl px-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Liên Hệ</span>
            <h1 className="text-4xl font-black uppercase tracking-wider text-zinc-50">Kết Nối Với Chúng Tôi</h1>
            <p className="text-zinc-300 text-xs md:text-sm font-light max-w-md mx-auto">
              Bạn có bất kỳ câu hỏi nào về đơn hàng, kích cỡ, hay góp ý phát triển dịch vụ? Đừng ngần ngại gửi tin nhắn cho chúng tôi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <section className="container mx-auto px-4 md:px-14 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-zinc-100 pb-4">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-zinc-700" />
                <span>Gửi lời nhắn</span>
              </h2>
              <p className="text-xs text-zinc-500">Chúng tôi sẽ tiếp nhận và phản hồi nhanh chóng nhất.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Họ và tên *</label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="rounded-xl border border-zinc-200 focus:ring-zinc-900 py-3 px-4 bg-zinc-50/30 text-zinc-900 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Địa chỉ Email *</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="rounded-xl border border-zinc-200 focus:ring-zinc-900 py-3 px-4 bg-zinc-50/30 text-zinc-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Số điện thoại *</label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0973xxxxxx"
                    className="rounded-xl border border-zinc-200 focus:ring-zinc-900 py-3 px-4 bg-zinc-50/30 text-zinc-900 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Chủ đề liên hệ *</label>
                  <Input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Tư vấn kích cỡ / Đổi hàng / Hợp tác..."
                    className="rounded-xl border border-zinc-200 focus:ring-zinc-900 py-3 px-4 bg-zinc-50/30 text-zinc-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">Nội dung chi tiết *</label>
                <Textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập nội dung bạn muốn gửi..."
                  className="rounded-xl border border-zinc-200 focus:ring-zinc-900 py-3 px-4 bg-zinc-50/30 text-zinc-900 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-zinc-950 text-white rounded-xl py-6 px-8 font-bold uppercase tracking-wider text-xs hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-zinc-900/10"
                >
                  {isSubmitting ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Gửi liên hệ ngay</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Cards Info */}
          <div className="lg:col-span-4 space-y-6">
            {contactInfo.map((info, idx) => {
              const IconComp = info.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100/50 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${info.color}`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">{info.title}</h3>
                    <p className="font-bold text-zinc-900 text-sm">{info.value}</p>
                    <p className="text-[10px] text-zinc-400">{info.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </main>
  );
}
