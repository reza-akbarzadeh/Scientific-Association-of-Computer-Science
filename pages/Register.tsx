import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store';
import { UI_STRINGS, toPersianDigits } from '../constants';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    nationalId: '',
    email: '',
    phone: '',
    fieldOfStudy: '',
    semester: '',
    degreeLevel: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { registerStudent } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const registerError = registerStudent(formData);
    if (registerError) {
      setError(registerError);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[4rem] text-center space-y-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] animate-celebrate border border-green-100 dark:border-green-900/20">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-ping"></div>
             <div className="relative w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-3xl flex items-center justify-center text-5xl shadow-inner border-2 border-white dark:border-slate-800">
               ✨
             </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-green-700 dark:text-green-400">درخواست شما ثبت شد!</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-loose font-medium">
              اطلاعات شما با موفقیت دریافت گردید. حساب کاربری شما پس از تایید نهایی توسط مدیریت فعال خواهد شد.
            </p>
          </div>
          <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-3 w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-green-500/30 hover:bg-green-700 transition-all"
          >
            مشاهده صفحه ورود
            <span className="text-2xl">←</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 md:p-10 animate-spring-in">
      <div className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col lg:flex-row-reverse border border-slate-100 dark:border-slate-800">
        
        <div className="lg:w-1/3 bg-indigo-900 relative overflow-hidden flex flex-col justify-center p-12 text-white text-right">
           <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-[-20%] left-[-20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-blob"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
           </div>
           
           <div className="relative z-10 space-y-8">
              <div className="w-16 h-2 bg-primary-400 rounded-full"></div>
              <h2 className="text-4xl font-black leading-tight">
                 گام اول <br/>
                 <span className="text-primary-400">عضویت هوشمند</span>
              </h2>
              <p className="text-indigo-200 text-base leading-loose font-medium">
                 با عضویت در انجمن علمی، به شبکه بزرگی از متخصصین، پروژه‌های عملی و منابع آموزشی دست اول متصل می‌شوید.
              </p>
              
              <ul className="space-y-4 pt-4">
                 {[
                   "دسترسی به جزوات اساتید",
                   "شرکت در مسابقات تخصصی",
                   "ارتباط با متخصصین حوزه",
                   "رزومه سازی آکادمیک"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">✔</span>
                      {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Form Side */}
        <div className="lg:w-2/3 p-8 md:p-16 bg-white dark:bg-slate-900">
           <div className="max-w-2xl mx-auto w-full space-y-12">
              <div className="flex justify-between items-end border-b-2 border-slate-50 dark:border-slate-800 pb-8">
                 <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">{UI_STRINGS.register}</h1>
                    <p className="text-slate-400 font-bold text-sm">فرم عضویت دانشجویان علوم کامپیوتر</p>
                 </div>
                 <Link to="/login" className="text-primary-600 font-black text-xs hover:underline">قبلاً ثبت‌نام کرده‌اید؟ وارد شوید</Link>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-6 rounded-3xl text-sm font-bold animate-shake flex items-center gap-4">
                  <span className="text-2xl">🛑</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">{UI_STRINGS.name}</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="نام و نام خانوادگی"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-bold"
                        required
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">{UI_STRINGS.studentId}</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value.replace(/\D/g, '') })}
                        placeholder="مثال: ۴۰۲۱۱۱۱۹۰۰۴"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-black text-center"
                        required
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">{UI_STRINGS.nationalId} (رمز عبور)</label>
                    <div className="relative">
                      <input
                          type={showPassword ? "text" : "password"}
                          value={formData.nationalId}
                          onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                          placeholder="کد ۱۰ رقمی ملی"
                          className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-bold text-center"
                          required
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary-600 transition-colors"
                       >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">رشته تحصیلی (اختیاری)</label>
                    <input
                        type="text"
                        value={formData.fieldOfStudy}
                        onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                        placeholder="مثال: علوم کامپیوتر"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-bold"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">مقطع تحصیلی (اختیاری)</label>
                    <select
                        value={formData.degreeLevel}
                        onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4.5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-bold appearance-none"
                    >
                        <option value="">انتخاب مقطع</option>
                        <option value="کارشناسی">کارشناسی</option>
                        <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                        <option value="دکتری">دکتری</option>
                        <option value="فارغ‌التحصیل">فارغ‌التحصیل</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">ترم فعلی (اختیاری)</label>
                    <select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4.5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-bold text-center appearance-none"
                    >
                        <option value="">انتخاب ترم</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <option key={n} value={n.toString()}>{toPersianDigits(n)}</option>
                        ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">شماره تماس (اختیاری)</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-black text-center"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">ایمیل (اختیاری)</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@mail.com"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner font-bold text-center"
                    />
                 </div>

                 <div className="md:col-span-2 pt-6">
                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all duration-300"
                    >
                        تکمیل عضویت در انجمن علمی
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
