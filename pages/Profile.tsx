import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { UI_STRINGS, toPersianDigits } from '../constants';
import { UserRole } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { currentUser, users, updateUserProfile } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', profilePicture: '', nationalId: '', studentId: '', phone: '', fieldOfStudy: '', semester: '', degreeLevel: '' });
  const navigate = useNavigate();
  
  const freshUser = users.find(u => u.id === currentUser?.id) || currentUser;

  useEffect(() => {
    if (freshUser) {
      setEditData({
        name: freshUser.name,
        email: freshUser.email,
        profilePicture: freshUser.profilePicture || '',
        nationalId: freshUser.nationalId,
        studentId: freshUser.studentId,
        phone: freshUser.phone || '',
        fieldOfStudy: freshUser.fieldOfStudy || '',
        semester: freshUser.semester || '',
        degreeLevel: freshUser.degreeLevel || ''
      });
    }
  }, [freshUser]);

  if (!freshUser) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(freshUser.id, editData);
    setShowEditModal(false);
    alert('اطلاوات شما با موفقیت بروزرسانی شد.');
  };

  const startChatWithAdmin = () => {
    navigate('/messages');
  };

  const unreadCount = (freshUser.messages || []).filter(m => !m.isRead && m.receiverId === freshUser.id).length;
  
  // Get unique conversations for preview
  const recentMessages = (freshUser.messages || [])
    .slice(-3)
    .reverse();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 animate-spring-in">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-24 bg-primary-600/10"></div>
        <button 
          onClick={() => setShowEditModal(true)}
          className="absolute top-6 left-6 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg hover:rotate-12 hover:scale-110 transition-all z-20"
          title="ویرایش پروفایل"
        >
          ✏️
        </button>
        <div className="relative z-10">
          <div className="relative inline-block">
            <img src={freshUser.profilePicture || "https://www.gravatar.com/avatar/?d=mp"} alt="Profile" className="w-32 h-32 rounded-[2.5rem] mx-auto border-4 border-white dark:border-slate-800 shadow-xl mb-4 object-cover bg-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md animate-bounce border-2 border-white">
                {unreadCount} پیام تازه
              </span>
            )}
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{freshUser.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{freshUser.role === UserRole.ADMIN ? 'مدیر ارشد سیستم' : 'دانشجوی عضو انجمن'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* User Info Column */}
        <div className="flex flex-col h-full">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm flex-grow">
             <h3 className="font-bold flex items-center gap-2 text-lg">
               <span className="w-2 h-6 bg-primary-600 rounded-full"></span>
               اطلاعات حساب
             </h3>
             <div className="space-y-5 text-sm">
                <div className="flex flex-col border-b border-slate-50 dark:border-slate-800 pb-3">
                  <span className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-black">{UI_STRINGS.studentId}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{toPersianDigits(freshUser.studentId)}</span>
                </div>
                <div className="flex flex-col border-b border-slate-50 dark:border-slate-800 pb-3">
                  <span className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-black">{UI_STRINGS.nationalId} (رمز عبور)</span>
                  <span className="font-mono font-bold text-primary-600">{toPersianDigits(freshUser.nationalId)}</span>
                </div>
                <div className="flex flex-col border-b border-slate-50 dark:border-slate-800 pb-3">
                  <span className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-black">رشته تحصیلی</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{freshUser.fieldOfStudy || 'ثبت نشده'}</span>
                </div>
                <div className="flex flex-col border-b border-slate-50 dark:border-slate-800 pb-3">
                  <span className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-black">مقطع تحصیلی</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{freshUser.degreeLevel || 'ثبت نشده'}</span>
                </div>
                <div className="flex flex-col border-b border-slate-50 dark:border-slate-800 pb-3">
                  <span className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-black">ترم تحصیلی</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{freshUser.semester ? toPersianDigits(freshUser.semester) : 'ثبت نشده'}</span>
                </div>
                <div className="flex flex-col border-b border-slate-50 dark:border-slate-800 pb-3">
                  <span className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-black">شماره تماس</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{freshUser.phone ? toPersianDigits(freshUser.phone) : 'ثبت نشده'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest font-black">{UI_STRINGS.email}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{freshUser.email || 'ثبت نشده'}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Messaging Quick Link */}
        <div className="flex flex-col h-full">
          <div className="bg-primary-600 text-white rounded-[2rem] p-8 shadow-xl shadow-primary-500/20 flex flex-col h-full space-y-6 group relative overflow-hidden">
             {/* Decorative Background Icon */}
             <div className="absolute -bottom-10 -left-10 text-[12rem] opacity-5 pointer-events-none rotate-12 transition-transform group-hover:rotate-6 duration-700">💬</div>
             
             <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
               <div className="p-5 bg-white/10 rounded-[2.5rem] backdrop-blur-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                 </svg>
               </div>
               <div>
                  <h3 className="text-xl font-black">مرکز پیام‌های شما</h3>
                  <p className="text-xs text-primary-100 leading-loose mt-2">
                    تمامی گفتگوهای شما با مدیریت و سایر اعضای انجمن در این بخش سازماندهی شده است.
                  </p>
               </div>
             </div>

             {/* Recent Activity Section to fill space */}
             <div className="flex-grow flex flex-col justify-center space-y-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-200 mb-3">پیام‌های اخیر</h4>
                   {recentMessages.length > 0 ? (
                     <div className="space-y-3">
                        {recentMessages.map(msg => (
                          <div key={msg.id} className="text-[11px] border-b border-white/5 pb-2 last:border-0 last:pb-0">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white/90">{msg.senderName}</span>
                                <span className="text-[8px] text-white/50">{toPersianDigits(msg.date.split(' ')[0])}</span>
                             </div>
                             <p className="text-white/70 truncate">{msg.text}</p>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="py-4 text-center text-[10px] text-white/40 italic">تاریخچه پیامی موجود نیست.</div>
                   )}
                </div>
             </div>

             <Link 
              to="/messages"
              className="w-full bg-white text-primary-600 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all text-sm shadow-xl relative z-10 text-center"
             >
               مشاهده صندوق پیام‌ها
             </Link>
          </div>
        </div>
      </div>

      {/* Admin Contact Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 reveal-item">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-3xl">👨‍💻</div>
          <div className="text-right">
            <h3 className="font-black text-xl">ارتباط مستقیم با مدیریت</h3>
            <p className="text-sm text-slate-500 mt-1">هرگونه سوال، پیشنهاد یا مشکلی دارید مستقیماً با مدیریت در میان بگذارید.</p>
          </div>
        </div>
        <button 
          onClick={startChatWithAdmin}
          className="bg-slate-900 text-white dark:bg-primary-600 px-10 py-4.5 rounded-[1.8rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
        >
          شروع گفتگو با مدیر انجمن
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[70] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-md p-10 rounded-[3rem] shadow-2xl space-y-8 animate-spring-in">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">ویرایش کامل اطلاعات</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col items-center gap-4 mb-4">
                 <div className="relative group">
                   <img src={editData.profilePicture || "https://www.gravatar.com/avatar/?d=mp"} className="w-28 h-28 rounded-[2.5rem] object-cover border-4 border-primary-500 shadow-2xl bg-white" />
                   <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2.5rem] cursor-pointer transition-opacity text-white text-[10px] font-bold text-center p-2">
                      تغییر عکس پروفایل
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                   </label>
                 </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">نام و نام خانوادگی</label>
                <input 
                  value={editData.name} 
                  onChange={e => setEditData({...editData, name: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">رشته تحصیلی (اختیاری)</label>
                <input 
                  value={editData.fieldOfStudy} 
                  onChange={e => setEditData({...editData, fieldOfStudy: e.target.value})} 
                  placeholder="مثال: علوم کامپیوتر"
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 shadow-inner" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">مقطع (اختیاری)</label>
                  <select 
                    value={editData.degreeLevel} 
                    onChange={e => setEditData({...editData, degreeLevel: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 shadow-inner" 
                  >
                    <option value="">انتخاب مقطع</option>
                    <option value="کارشناسی">کارشناسی</option>
                    <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                    <option value="دکتری">دکتری</option>
                    <option value="فارغ‌التحصیل">فارغ‌التحصیل</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">ترم (اختیاری)</label>
                  <select 
                    value={editData.semester} 
                    onChange={e => setEditData({...editData, semester: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 shadow-inner" 
                  >
                    <option value="">انتخاب ترم</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n.toString()}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">آدرس پست الکترونیک (اختیاری)</label>
                <input 
                  type="email"
                  value={editData.email} 
                  onChange={e => setEditData({...editData, email: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 shadow-inner" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">شماره تماس (اختیاری)</label>
                <input 
                  type="text"
                  value={editData.phone} 
                  onChange={e => setEditData({...editData, phone: e.target.value})} 
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 shadow-inner" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">شماره دانشجویی</label>
                  <input 
                    value={toPersianDigits(editData.studentId)} 
                    readOnly
                    className="w-full bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border-none outline-none cursor-not-allowed font-mono text-center shadow-inner opacity-60" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">کد ملی (رمز عبور)</label>
                  <input 
                    value={editData.nationalId} 
                    onChange={e => setEditData({...editData, nationalId: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-primary-500 font-mono text-center shadow-inner" 
                    required 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">ذخیره نهایی تغییرات</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;