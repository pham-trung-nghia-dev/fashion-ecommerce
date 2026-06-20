'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Heart, Users, Sparkles, ShoppingBag, Store } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Cửa hàng toàn quốc', value: '50+', icon: Store },
    { label: 'Khách hàng tin dùng', value: '1M+', icon: Users },
    { label: 'Thiết kế độc quyền', value: '1000+', icon: Sparkles },
    { label: 'Năm hoạt động', value: '5+', icon: Award },
  ];

  const values = [
    {
      title: 'Chất lượng hàng đầu',
      desc: 'Mỗi sản phẩm đều được chăm chút từ sợi vải, đường chỉ khâu đến khâu hoàn thiện đóng gói, cam kết mang đến trải nghiệm bền đẹp nhất.',
      icon: Award,
    },
    {
      title: 'Tự do định hình phong cách',
      desc: 'Chúng tôi mang lại các thiết kế bắt kịp xu hướng toàn cầu nhưng vẫn giữ tính ứng dụng cao, giúp bạn tự tin thể hiện cá tính riêng.',
      icon: Compass,
    },
    {
      title: 'Tận tâm vì khách hàng',
      desc: 'Khách hàng luôn là trọng tâm trong mọi hoạt động. Dịch vụ hậu mãi hỗ trợ đổi trả linh hoạt cùng đội ngũ hỗ trợ 24/7 nhiệt tình.',
      icon: Heart,
    },
  ];

  return (
    <main className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Visual Hero Header Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10" />
        <div className="relative z-20 text-center max-w-2xl px-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Về Chúng Tôi</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">
              Hành Trình Kiến Tạo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                Phong Cách
              </span>
            </h1>
            <p className="text-zinc-300 text-sm md:text-base font-light max-w-lg mx-auto">
              Đồng hành cùng hàng triệu khách hàng trong hành trình định hình và tôn vinh phong cách thời trang năng động hằng ngày.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Story and stats */}
      <section className="container mx-auto px-4 md:px-14 -mt-16 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Story Text */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">Câu chuyện thương hiệu</span>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
                Thời trang không chỉ là trang phục, <br />đó là cách bạn nói với thế giới bạn là ai.
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Bắt đầu từ một cửa hàng nhỏ chuyên thiết kế đồ mặc thường nhật, chúng tôi luôn khát khao mang đến làn gió mới cho thời trang đường phố Việt Nam. Chúng tôi tin rằng trang phục đẹp phải đi đôi với sự thoải mái tối đa trong mọi cử động hằng ngày.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Sau hơn 5 năm phát triển bền bỉ, thương hiệu đã mở rộng mạng lưới với 50+ cửa hàng trên khắp cả nước, tự hào đồng hành cùng các bạn trẻ trên mọi nẻo đường đi học, đi làm, và dạo phố năng động.
              </p>
            </div>
            
            <div className="pt-6 border-t border-zinc-100 flex items-center gap-4">
              <Link 
                href="/products"
                className="inline-flex py-3 px-6 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-md shadow-zinc-900/10"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          </div>

          {/* Stats Box */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-zinc-100/50">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-900 mb-6">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-zinc-950 tracking-tight">{stat.value}</h3>
                    <p className="text-zinc-500 text-xs font-medium mt-1">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container mx-auto px-4 md:px-14 py-16 mt-6">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Giá Trị</span>
          <h2 className="text-3xl font-bold text-zinc-900">Triết Lý Cốt Lõi Của Chúng Tôi</h2>
          <p className="text-zinc-500 text-sm">
            Chúng tôi định hướng hoạt động dựa trên các tiêu chí nghiêm ngặt để luôn mang lại lợi ích tốt nhất cho quý khách hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => {
            const IconVal = val.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-zinc-100/50 space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <IconVal className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{val.title}</h3>
                <p className="text-zinc-600 text-xs leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
