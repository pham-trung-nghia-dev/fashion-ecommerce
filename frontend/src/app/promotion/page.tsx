'use client';

import React, { useState, useEffect } from 'react';
import { getPromotions } from '@/src/lib/api';
import type { ApiPromotion } from '@/src/lib/api';
import { Sparkles, Calendar, Gift, Tag, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PromotionPage() {
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    getPromotions()
      .then((data) => {
        setPromotions(data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã ${code}!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const vouchers = [
    { code: 'FASHIONNEW', discount: 'Giảm 10%', desc: 'Áp dụng cho đơn hàng đầu tiên của thành viên mới.', validUntil: '31/12/2026' },
    { code: 'SUMMERSALE', discount: 'Giảm 20%', desc: 'Áp dụng cho toàn bộ sưu tập Hè mới nhất.', validUntil: '31/08/2026' },
  ];

  return (
    <main className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10" />
        <div className="relative z-20 text-center max-w-2xl px-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Ưu Đãi Đặc Quyền</span>
            <h1 className="text-4xl font-black uppercase tracking-wider text-zinc-50">Khuyến Mãi & Vouchers</h1>
            <p className="text-zinc-300 text-xs md:text-sm font-light max-w-md mx-auto">
              Nhận ngay các ưu đãi giảm giá độc quyền và voucher mua sắm thời thượng tại FASHION.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Copyable Vouchers Grid */}
      <section className="container mx-auto px-4 md:px-14 -mt-10 relative z-30">
        <div className="text-center md:text-left mb-6">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center justify-center md:justify-start gap-2 bg-white rounded-t-3xl py-4 px-6 md:px-8 shadow-sm">
            <Gift className="h-5 w-5 text-amber-500" />
            <span>Mã ưu đãi độc quyền hôm nay</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-b-3xl rounded-tr-3xl p-6 md:p-8 shadow-sm">
          {vouchers.map((voucher) => (
            <div 
              key={voucher.code} 
              className="border-2 border-dashed border-zinc-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-zinc-400 transition-all bg-zinc-50/50 relative overflow-hidden"
            >
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold text-xs">
                  {voucher.discount}
                </span>
                <h3 className="font-bold text-base text-zinc-900 mt-2">{voucher.code}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-[280px]">
                  {voucher.desc}
                </p>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1 justify-center md:justify-start">
                  <Calendar className="h-3 w-3" />
                  HSD: {voucher.validUntil}
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(voucher.code)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  copiedCode === voucher.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {copiedCode === voucher.code ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Promotions List */}
      <section className="container mx-auto px-4 md:px-14 py-12 mt-6">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Sự Kiện Hot</span>
          <h2 className="text-2xl font-bold text-zinc-900">Chương Trình Khuyến Mãi Đang Diễn Ra</h2>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="h-8 w-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-zinc-400 space-y-2 shadow-sm">
            <Tag className="h-10 w-10 mx-auto text-zinc-300" />
            <p className="text-sm">Hiện tại chưa có chương trình khuyến mãi nào khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <motion.article
                key={promo.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100/50 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{promo.time}</span>
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 leading-snug">{promo.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed whitespace-pre-line">
                    {promo.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span>Trạng thái: Đang áp dụng</span>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
