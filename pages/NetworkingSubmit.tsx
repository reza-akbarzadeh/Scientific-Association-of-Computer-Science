import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { toPersianDigits } from '../constants';

const NetworkingSubmit: React.FC = () => {
  const { currentUser, networkingProfiles, addNetworkingProfile, csFields } = useApp();
  const navigate = useNavigate();
  
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const existingProfile = networkingProfiles.find(p => p.userId === currentUser?.id);

  if (existingProfile) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-spring-in">
        <div className="text-7xl">✨</div>
        <h2 className="text-3xl font-black">پروفایل شما قبلاً ثبت شده است</h2>
        <p className="text-slate-500 leading-loose">شما قبلاً اطلاعات خود را برای شبکه‌سازی ثبت کرده‌اید. در صورت نیاز به ویرایش، از طریق پنل کاربری اقدام کنید یا با مدیریت در تماس باشید.</p>
        <button onClick={() => navigate('/')} className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold active:scale-95 transition-all shadow-xl">بازگشت به خانه</button>
      </div>
    );
  }

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        return prev.filter(f => f !== fieldId);
      }
      if (prev.length >= 5) {
        alert('شما مجاز به انتخاب حداکثر ۵ مورد هستید.');
        return prev;
      }
      return [...prev, fieldId];
    });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryId(prev => prev === categoryId ? null : categoryId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (selectedFields.length < 1) {
      alert('لطفاً حداقل ۱ حوزه را انتخاب کنید تا ارتباطات بهتری شکل بگیرد.');
      return;
    }
    
    addNetworkingProfile({
      userId: currentUser.id,
      name: currentUser.name,
      profilePicture: currentUser.profilePicture || '',
      fields: selectedFields,
      description,
      email: currentUser.email,
      phone: currentUser.phone,
      semester: currentUser.semester
    });
    
    alert('اطلاعات با موفقیت ثبت شد. پروفایل شما پس از تایید مدیریت فعال می‌شود.');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12 animate-spring-in">
      <header className="text-center space-y-4">
         <h2 className="text-4xl font-black text-slate-900 dark:text-white">تکمیل پروفایل تخصصی</h2>
         <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg">
            با انتخاب تخصص‌های خود و نوشتن یک معرفی کوتاه، به شبکه علمی دانشکده بپیوندید. سایر اطلاعات شما مستقیماً از حساب کاربری شما خوانده می‌شود.
         </p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
         <aside className="w-full lg:w-80 bg-slate-50 dark:bg-slate-800/40 p-12 flex flex-col items-center text-center space-y-8 border-l border-slate-100 dark:border-slate-800">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"></div>
              <img src={currentUser?.profilePicture || "https://www.gravatar.com/avatar/?d=mp"} className="relative w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-700 shadow-xl" />
            </div>
            <div className="space-y-4 w-full">
               <div>
                  <h3 className="font-black text-xl">{currentUser?.name}</h3>
               </div>
               
               <div className="space-y-2 text-right bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex flex-col">
                     <span className="text-[9px] text-slate-400 font-black">رشته تحصیلی:</span>
                     <span className="text-xs font-bold">{currentUser?.fieldOfStudy || 'ثبت نشده'}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] text-slate-400 font-black">ترم:</span>
                     <span className="text-xs font-bold">{currentUser?.semester ? toPersianDigits(currentUser.semester) : 'ثبت نشده'}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] text-slate-400 font-black">ایمیل:</span>
                     <span className="text-[10px] font-bold truncate">{currentUser?.email || 'ثبت نشده'}</span>
                  </div>
               </div>

               <p className="text-[9px] text-slate-400 font-medium leading-loose px-2">
                  برای ویرایش اطلاعات بالا، به بخش تنظیمات پروفایل خود مراجعه کنید.
               </p>
            </div>
         </aside>

         <main className="flex-grow p-10 md:p-16">
            <form onSubmit={handleSubmit} className="space-y-12">
               <div className="space-y-8">
                  <div className="flex justify-between items-end border-r-4 border-primary-600 pr-4">
                    <h3 className="font-black text-xl">۱. حوزه‌های تخصص و علاقه</h3>
                    <span className="text-[10px] font-bold text-slate-400">انتخاب شده: {toPersianDigits(selectedFields.length)} از ۵</span>
                  </div>
                  
                  <div className="space-y-3">
                     {csFields.map(group => {
                       const isExpanded = expandedCategoryId === group.id;
                       const selectedCountInGroup = group.subfields?.filter(s => selectedFields.includes(s.id)).length || 0;

                       return (
                         <div key={group.id} className={`border rounded-3xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-primary-500 shadow-lg' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'}`}>
                            <button 
                              type="button"
                              onClick={() => toggleCategory(group.id)}
                              className="w-full p-5 flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
                            >
                               <div className="flex items-center gap-3">
                                  <span className={`w-2 h-2 rounded-full ${selectedCountInGroup > 0 ? 'bg-primary-600 animate-pulse' : 'bg-slate-300'}`}></span>
                                  <h4 className="text-sm font-black text-slate-700 dark:text-slate-200">{group.label}</h4>
                                  {selectedCountInGroup > 0 && (
                                    <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-600 text-[10px] px-2 py-0.5 rounded-full font-black">
                                      {toPersianDigits(selectedCountInGroup)} انتخاب
                                    </span>
                                  )}
                               </div>
                               <span className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {isExpanded && (
                              <div className="p-6 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-slate-900/40 animate-in slide-in-from-top-2 duration-300">
                                 {group.subfields?.map(sub => (
                                   <label key={sub.id} className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${selectedFields.includes(sub.id) ? 'bg-primary-50 border-primary-500 dark:bg-primary-900/20' : 'bg-slate-50 border-transparent dark:bg-slate-800 hover:bg-slate-100'}`}>
                                      <input type="checkbox" className="hidden" checked={selectedFields.includes(sub.id)} onChange={() => handleFieldToggle(sub.id)} />
                                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${selectedFields.includes(sub.id) ? 'bg-primary-600 border-primary-600 shadow-[0_0_10px_rgba(2,132,199,0.5)]' : 'border-slate-300'}`}>
                                         {selectedFields.includes(sub.id) && <span className="text-white text-xs">✓</span>}
                                      </div>
                                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{sub.label}</span>
                                    </label>
                                 ))}
                              </div>
                            )}
                         </div>
                       );
                     })}
                  </div>
               </div>

               <div className="space-y-8">
                  <h3 className="font-black text-xl border-r-4 border-primary-600 pr-4">۲. درباره شما</h3>
                  <div className="space-y-6">
                     <textarea 
                       value={description}
                       onChange={e => setDescription(e.target.value)}
                       placeholder="توضیحاتی درباره مهارت‌ها، تجربه‌ها و آنچه می‌توانید به دیگران بیاموزید بنویسید..."
                       className="w-full h-44 bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] outline-none focus:ring-2 ring-primary-500 text-sm leading-relaxed shadow-inner border border-slate-100 dark:border-slate-800"
                       required
                     />
                  </div>
               </div>

               <div className="pt-10 flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-primary-500/30 hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all">
                     تایید و انتشار پروفایل
                  </button>
                  <button type="button" onClick={() => navigate('/')} className="px-12 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-3xl font-black transition-colors hover:bg-slate-200">
                     انصراف
                  </button>
               </div>
            </form>
         </main>
      </div>
    </div>
  );
};

export default NetworkingSubmit;