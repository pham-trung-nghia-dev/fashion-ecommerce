'use client';

import React, { useState, useEffect } from 'react';
import { getJobs } from '@/src/lib/api';
import type { ApiJob } from '@/src/lib/api';
import { Briefcase, MapPin, Search, ChevronDown, ChevronUp, FileText, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CareersPage() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyingJobTitle, setApplyingJobTitle] = useState('');

  // Form states for application
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [cvFile, setCvFile] = useState<string>('');

  useEffect(() => {
    getJobs()
      .then((data) => {
        setJobs(data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const locations = ['All', ...Array.from(new Set(jobs.map((j) => j.location)))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const handleApplyClick = (jobTitle: string) => {
    setApplyingJobTitle(jobTitle);
    setIsApplyModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) {
      toast.error('Vui lòng nhập đầy đủ thông tin liên hệ.');
      return;
    }
    toast.success(`Hồ sơ ứng tuyển vị trí ${applyingJobTitle} của bạn đã được gửi đi thành công!`);
    setIsApplyModalOpen(false);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setCvFile('');
  };

  return (
    <main className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10" />
        <div className="relative z-20 text-center max-w-2xl px-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Gia Nhập Đội Ngũ</span>
            <h1 className="text-4xl font-black uppercase tracking-wider text-zinc-50">Cơ Hội Nghề Nghiệp</h1>
            <p className="text-zinc-300 text-xs md:text-sm font-light max-w-md mx-auto">
              Đồng hành cùng FASHION kiến tạo những giải pháp thời trang hiện đại, phóng khoáng và mang lại giá trị thiết thực.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Jobs Listing Container */}
      <section className="container mx-auto px-4 md:px-14 -mt-10 relative z-30">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Tìm kiếm vị trí tuyển dụng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
              <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">Khu vực:</span>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedLocation === loc
                      ? 'bg-zinc-950 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {loc === 'All' ? 'Tất cả' : loc}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          {isLoading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="h-8 w-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 space-y-2">
              <Briefcase className="h-10 w-10 mx-auto text-zinc-300" />
              <p className="text-sm">Hiện chưa có tin tuyển dụng phù hợp với tìm kiếm của bạn.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="border border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-300 transition-all bg-white"
                  >
                    {/* Collapsed Header */}
                    <div
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/30 transition-colors"
                    >
                      <div className="space-y-2">
                        <h3 className="font-bold text-base md:text-lg text-zinc-950">{job.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                            {job.location}
                          </span>
                          <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider">
                            Full-time
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-zinc-100 rounded-full transition-all text-zinc-400 hover:text-zinc-900">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-zinc-50 bg-zinc-50/30 px-6 py-6 space-y-4"
                        >
                          <div className="space-y-2 text-xs md:text-sm text-zinc-600 leading-relaxed">
                            <h4 className="font-bold text-zinc-900">Mô tả công việc:</h4>
                            <p className="whitespace-pre-line">{job.description}</p>
                          </div>
                          
                          <div className="pt-4 flex justify-end">
                            <button
                              onClick={() => handleApplyClick(job.title)}
                              className="px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-zinc-900/10"
                            >
                              <FileText className="h-4 w-4" />
                              Ứng tuyển ngay
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsApplyModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative z-10 space-y-6 border border-zinc-100"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Ứng tuyển vị trí</span>
                <h3 className="text-xl font-bold text-zinc-900">{applyingJobTitle}</h3>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs md:text-sm">
                <div className="space-y-1">
                  <label className="text-zinc-500 font-semibold block">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 bg-zinc-50/30 text-zinc-900 text-xs"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-semibold block">Email *</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 bg-zinc-50/30 text-zinc-900 text-xs"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-semibold block">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 bg-zinc-50/30 text-zinc-900 text-xs"
                      placeholder="0973xxxxxx"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500 font-semibold block">Link CV của bạn (Google Drive/Dropbox) *</label>
                  <input
                    type="url"
                    required
                    value={cvFile}
                    onChange={(e) => setCvFile(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 bg-zinc-50/30 text-zinc-900 text-xs"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2.5 border border-zinc-200 text-zinc-700 font-semibold uppercase tracking-wider rounded-xl hover:bg-zinc-50 transition-all text-[10px]"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-zinc-900 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2 text-[10px]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Nộp đơn ứng tuyển
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
