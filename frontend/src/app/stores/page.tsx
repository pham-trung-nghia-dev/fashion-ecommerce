'use client';

import React, { useState, useEffect } from 'react';
import { getStores } from '@/src/lib/api';
import type { ApiStore } from '@/src/lib/api';
import { Search, MapPin, Phone, Clock, Store, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoresPage() {
  const [stores, setStores] = useState<ApiStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    getStores()
      .then((data) => {
        setStores(data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter unique cities/provinces from address strings
  const getCityFromAddress = (address: string) => {
    if (address.includes('Hà Nội')) return 'Hà Nội';
    if (address.includes('Hồ Chí Minh') || address.includes('TP. HCM') || address.includes('Sài Gòn')) return 'TP. Hồ Chí Minh';
    if (address.includes('Đà Nẵng')) return 'Đà Nẵng';
    if (address.includes('Hải Phòng')) return 'Hải Phòng';
    return 'Tỉnh thành khác';
  };

  const cities = ['All', ...Array.from(new Set(stores.map((s) => getCityFromAddress(s.address))))];

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          store.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || getCityFromAddress(store.address) === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <main className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Hero Header */}
      <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10" />
        <div className="relative z-20 text-center max-w-2xl px-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Hệ Thống</span>
            <h1 className="text-4xl font-black uppercase tracking-wider text-zinc-50">Cửa Hàng FASHION</h1>
            <p className="text-zinc-300 text-xs md:text-sm font-light max-w-md mx-auto">
              Ghé thăm chúng tôi để trải nghiệm không gian mua sắm thời thượng, thử đồ trực tiếp và nhận tư vấn thời trang chuyên nghiệp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Listing Container */}
      <section className="container mx-auto px-4 md:px-14 -mt-10 relative z-30">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Tìm tên cửa hàng, đường..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
              <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">Khu vực:</span>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedCity === city
                      ? 'bg-zinc-950 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {city === 'All' ? 'Tất cả' : city}
                </button>
              ))}
            </div>
          </div>

          {/* Stores List */}
          {isLoading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="h-8 w-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 space-y-2">
              <Store className="h-10 w-10 mx-auto text-zinc-300" />
              <p className="text-sm">Không tìm thấy cửa hàng nào phù hợp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="border border-zinc-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all bg-white group space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-800 border border-zinc-100 flex-shrink-0">
                        <Store className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-base text-zinc-900 leading-snug">{store.name}</h3>
                    </div>

                    <div className="space-y-2.5 text-xs text-zinc-600">
                      <p className="flex items-start gap-2.5 leading-relaxed">
                        <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                        <span>{store.address}</span>
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                        <span className="font-semibold text-zinc-800">{store.hotline}</span>
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                        <span>Mở cửa: 09:00 - 22:00 (Hằng ngày)</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-end">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>Chỉ đường trên bản đồ</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
