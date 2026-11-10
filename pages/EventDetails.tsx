import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { EventCategory } from '../types';
import { toPersianDigits } from '../constants';

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const { events, addRegistration } = useApp();
  const navigate = useNavigate();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    studentId: '',
    phone: '',
    email: '',
    socialHandles: ''
  });
  const [regSuccess, setRegSuccess] = useState(false);

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">رویداد یافت نشد</h2>
        <button onClick={() => navigate('/events')} className="mt-4 text-primary-600 font-bold hover:underline">بازگشت به لیست رویدادها</button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('لینک صفحه رویداد در حافظه کپی شد.');
    });
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRegistration({
      ...regForm,
      eventId: event.id,
      eventName: event.title
    });
    setRegSuccess(true);
    setTimeout(() => {
      setShowRegModal(false);
      setRegSuccess(false);
      setRegForm({ name: '', studentId: '', phone: '', email: '', socialHandles: '' });
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <Link to="/events" className="text-sm text-slate-500 hover:text-primary-600 transition-colors inline-block mb-4">← بازگشت به رویدادها</Link>
      
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-4 md:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="relative group cursor-zoom-in">
          <div 
            onClick={() => setIsLightboxOpen(true)}
            className="relative rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-950 flex justify-center items-center border border-slate-100 dark:border-slate-800 shadow-inner min-h-[300px] md:min-h-[500px]"
          >
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-contain block transition-transform duration-500 group-hover:scale-[1.01]" 
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl text-xs font-black shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                🔍 مشاهده سایز اصلی پوستر
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${event.category === EventCategory.ONGOING ? 'bg-red-500' : event.category === EventCategory.PAST ? 'bg-slate-500' : 'bg-primary-600'}`}>
                       {event.category === EventCategory.ONGOING ? 'در حال برگزاری' : event.category === EventCategory.PAST ? 'برگزار شده' : 'رویداد پیش‌رو'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-xs font-bold text-slate-400">تاریخ: {toPersianDigits(event.date)}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                    {event.title}
                  </h1>
               </div>
            </div>
            
            <div className="w-20 h-2 bg-primary-600 rounded-full"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.time && (
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">ساعت برگزاری</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{toPersianDigits(event.time)}</span>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">محل برگزاری</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{event.location}</span>
                  </div>
                </div>
              )}
              {event.externalLink && (
                <a 
                  href={event.externalLink.startsWith('http') ? event.externalLink : `https://${event.externalLink}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:bg-primary-50 transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🔗</span>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">لینک اختصاصی</span>
                    <span className="font-bold text-primary-600 truncate block">مشاهده لینک</span>
                  </div>
                </a>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <span className="text-primary-600">✦</span>
                جزئیات و توضیحات رویداد
              </h2>
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-loose text-justify whitespace-pre-line font-medium">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-5">
            {event.category === EventCategory.UPCOMING && event.requiresRegistration && (
              <button 
                onClick={() => setShowRegModal(true)}
                className="bg-primary-600 text-white px-10 py-4.5 rounded-[1.8rem] font-black shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-all flex-grow md:flex-grow-0"
              >
                ثبت‌نام در رویداد
              </button>
            )}
            
            {event.category === EventCategory.PAST && (
               <Link to={`/events/${event.id}/gallery`} className="bg-indigo-600 text-white px-10 py-4.5 rounded-[1.8rem] font-black shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex-grow md:flex-grow-0 text-center">
                 پیوست‌ها (گزارش تصویری)
               </Link>
            )}

            <button 
              onClick={handleShare}
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-10 py-4.5 rounded-[1.8rem] font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex-grow md:flex-grow-0"
            >
              اشتراک‌گذاری
            </button>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div 
          className="fixed inset-3 md:inset-10 bg-slate-950/90 backdrop-blur-2xl z-[200] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="absolute top-6 right-6 flex gap-4">
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = event.image;
                  link.download = `poster-${event.title}.png`;
                  link.click();
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all border border-white/20"
             >
                ذخیره تصویر
             </button>
             <button 
                className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/20 text-2xl"
                onClick={() => setIsLightboxOpen(false)}
             >
                ✕
             </button>
          </div>
          
          <div className="max-w-[95vw] max-h-full relative flex items-center justify-center">
            <img 
              src={event.image} 
              alt={event.title} 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-bold">
            کلیک برای بستن
          </div>
        </div>
      )}

      {showRegModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[200] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3.5rem] shadow-2xl flex flex-col max-h-[85vh] animate-spring-in">
             {regSuccess ? (
               <div className="text-center py-20 p-10 space-y-6">
                 <div className="text-6xl animate-bounce">✅</div>
                 <h3 className="text-2xl font-black">ثبت‌نام با موفقیت انجام شد!</h3>
                 <p className="text-slate-500 font-medium">اطلاعات شما برای تیم انجمن علمی ارسال گردید.</p>
               </div>
             ) : (
               <>
                 <div className="p-10 pb-6 flex justify-between items-center border-b dark:border-slate-800">
                    <h3 className="text-2xl font-black">ثبت‌نام در: {event.title}</h3>
                    <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:rotate-90 transition-all text-xl">✕</button>
                 </div>
                 <div className="flex-grow overflow-y-auto p-10 pt-6 custom-scrollbar">
                   <form onSubmit={handleRegSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 pr-2 uppercase tracking-widest">نام و نام خانوادگی</label>
                        <input 
                          value={regForm.name} 
                          onChange={e => setRegForm({...regForm, name: e.target.value})} 
                          className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" 
                          placeholder="مثال: علی محمدی"
                          required 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 pr-2 uppercase tracking-widest">شماره دانشجویی</label>
                        <input 
                          value={regForm.studentId} 
                          onChange={e => setRegForm({...regForm, studentId: e.target.value})} 
                          className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner" 
                          placeholder="مثال: 40211119004"
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 pr-2 uppercase tracking-widest">شماره تماس</label>
                          <input 
                            value={regForm.phone} 
                            onChange={e => setRegForm({...regForm, phone: e.target.value})} 
                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner text-center" 
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            required 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 pr-2 uppercase tracking-widest">ایمیل (Gmail)</label>
                          <input 
                            type="email"
                            value={regForm.email} 
                            onChange={e => setRegForm({...regForm, email: e.target.value})} 
                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner text-center" 
                            placeholder="example@gmail.com"
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 pr-2 uppercase tracking-widest">توضیحات / آیدی شبکه‌های اجتماعی (اختیاری)</label>
                        <textarea 
                          value={regForm.socialHandles} 
                          onChange={e => setRegForm({...regForm, socialHandles: e.target.value})} 
                          className="w-full h-24 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 text-sm shadow-inner" 
                          placeholder="مثال: تلگرام: @user - ایتا: @user"
                        />
                      </div>
                      <div className="pt-4 flex gap-4 pb-4">
                         <button type="submit" className="flex-1 bg-primary-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">تکمیل ثبت‌نام</button>
                         <button type="button" onClick={() => setShowRegModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-5 rounded-3xl font-black text-slate-600 transition-colors">لغو</button>
                      </div>
                   </form>
                 </div>
               </>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;