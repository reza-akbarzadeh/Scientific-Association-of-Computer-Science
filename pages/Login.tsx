import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store.tsx';
import { UI_STRINGS } from '../constants.ts';
import { UserRole, ApprovalStatus } from '../types.ts';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { setCurrentUser, users } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.studentId === id && u.nationalId === pass);
    if (user) {
      if (user.status !== ApprovalStatus.APPROVED) {
        setError('حساب کاربری شما هنوز توسط مدیر تایید نشده است.');
        return;
      }
      setCurrentUser(user);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return;
    }
    setError('نام کاربری یا رمز عبور اشتباه است.');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 md:p-10 animate-spring-in">
      <div className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Visual Branding (Persian Context) */}
        <div className="lg:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-center p-12 text-white text-right">
           <div className="absolute top-0 right-0 w-full h-full">
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[120px] animate-blob"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
           </div>
           
           <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-3xl font-black mb-4">
                 CS
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-5xl font-black leading-tight">
                    تلاقی <span className="text-primary-400">دانش</span> و <br/>
                    <span className="text-indigo-400">تکنولوژی</span> مدرن
                 </h2>
                 <p className="text-slate-400 text-lg leading-loose max-w-md font-medium">
                    به پلتفرم جامع انجمن علمی علوم کامپیوتر خوش آمدید. جایی که کدهای شما، آینده را می‌سازند.
                 </p>
              </div>
              
              <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
                       <span className="text-xs font-black text-primary-400 uppercase tracking-widest">توسعه مهارت</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">برگزاری دوره‌های تخصصی و کارگاه‌های عملی برای ورود به بازار کار.</p>
                 </div>
                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-xl group-hover:scale-110 transition-transform">🛰️</span>
                       <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">شبکه‌سازی</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">اتصال دانشجویان به جامعه نخبگان و متخصصین علوم کامپیوتر.</p>
                 </div>
              </div>
           </div>
           
           {/* Abstract Decorative SVG pattern */}
           <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                 <circle cx="400" cy="400" r="300" stroke="white" strokeWidth="2" strokeDasharray="10 10" />
                 <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="2" />
              </svg>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 p-8 md:p-20 flex flex-col justify-center bg-white dark:bg-slate-900">
           <div className="max-w-md mx-auto w-full space-y-10">
              <div className="space-y-2">
                 <h1 className="text-4xl font-black text-slate-900 dark:text-white">{UI_STRINGS.login}</h1>
                 <p className="text-slate-500 dark:text-slate-400 font-medium">اطلاعات کاربری خود را برای ورود به پنل وارد کنید.</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-5 rounded-2xl text-xs font-bold animate-shake flex items-center gap-3">
                  <span className="text-xl">🛑</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 pr-4 uppercase tracking-[0.2em]">{UI_STRINGS.studentId}</label>
                    <div className="relative group">
                       <input
                          type="text"
                          inputMode="numeric"
                          placeholder="مثال: ۴۰۲۱۱۱۱۹۰۰۴"
                          value={id}
                          onChange={(e) => setId(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:bg-white dark:focus:bg-slate-800 focus:border-primary-500 outline-none transition-all shadow-inner font-bold text-lg"
                          required
                       />
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                       </span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 pr-4 uppercase tracking-[0.2em]">{UI_STRINGS.nationalId}</label>
                    <div className="relative group">
                       <input
                          type={showPassword ? "text" : "password"}
                          placeholder="کد ملی شما"
                          value={pass}
                          onChange={(e) => setPass(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:bg-white dark:focus:bg-slate-800 focus:border-primary-500 outline-none transition-all shadow-inner font-bold text-lg"
                          required
                       />
                       <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary-600 transition-colors"
                       >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                       </button>
                    </div>
                 </div>

                 <button 
                  type="submit" 
                  className="w-full bg-slate-900 dark:bg-primary-600 text-white py-5 rounded-[1.8rem] font-black text-xl shadow-2xl hover:bg-slate-800 dark:hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    {UI_STRINGS.login}
                 </button>
              </form>

              <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <Link to="/register" className="text-primary-600 dark:text-primary-400 font-black text-sm hover:underline flex items-center gap-2">
                    ثبت‌نام در انجمن علمی ←
                 </Link>
                 <Link to="/" className="text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors">
                    بازگشت به صفحه اصلی
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;