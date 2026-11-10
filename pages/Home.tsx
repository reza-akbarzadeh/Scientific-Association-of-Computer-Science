
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { toPersianDigits } from '../constants';
import { ApprovalStatus } from '../types';

const Home: React.FC = () => {
  const { currentUser, networkingProfiles, users, csFields } = useApp();
  const navigate = useNavigate();
  const [showNetworkList, setShowNetworkList] = useState(false);
  const [viewMode, setViewMode] = useState<'similar' | 'all'>('similar');

  const myProfile = networkingProfiles.find(p => p.userId === currentUser?.id);
  const isApproved = myProfile?.status === ApprovalStatus.APPROVED;

  const handleNetworkingClick = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      navigate('/networking-submit');
    }
  };

  const getFilteredProfiles = () => {
    if (!myProfile) return [];
    const base = networkingProfiles.filter(p => 
      p.status === ApprovalStatus.APPROVED && 
      p.userId !== currentUser?.id
    );
    
    if (viewMode === 'similar') {
      return base.filter(p => p.fields.some(f => myProfile.fields.includes(f)));
    }
    return base;
  };

  const getFieldLabel = (fieldId: string) => {
    for (const group of csFields) {
      const sub = group.subfields?.find(s => s.id === fieldId);
      if (sub) return sub.label;
    }
    return fieldId;
  };

  return (
    <div className="space-y-20 animate-spring-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 px-6 md:px-12 rounded-[3rem] bg-gradient-to-br from-primary-500/10 to-indigo-600/10 dark:from-primary-600/20 dark:to-indigo-800/20 border border-primary-200/50 dark:border-primary-800/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 flex justify-center order-1 md:order-1">
            <div className="relative floating-img">
              <div className="absolute -inset-4 bg-primary-500/20 blur-3xl rounded-full"></div>
              <img 
                src="https://img.freepik.com/free-vector/floating-robot-concept-illustration_114360-5522.jpg" 
                alt="CS Hero" 
                className="relative w-64 md:w-96 drop-shadow-2xl rounded-3xl"
              />
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl text-primary-600 font-black text-xl rotate-12">Σ</div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl text-indigo-600 font-black text-xl -rotate-12">λ</div>
            </div>
          </div>
          <div className="flex-1 text-right space-y-6 order-2 md:order-2">
            <div className="inline-block bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-xs font-bold mb-2">
              ✨ انجمن علمی علوم کامپیوتر
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight text-slate-900 dark:text-white">
              دریچه‌ای به دنیای <br/>
              <span className="text-primary-600">محاسبات و الگوریتم‌ها</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mr-0 ml-auto">
              محفلی برای یادگیری, نوآوری و همکاری میان دانشجویان مشتاق علوم کامپیوتر.
            </p>
            <div className="flex flex-wrap justify-end gap-4 pt-4">
              <Link to="/education" className="bg-primary-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 transition-all">
                مشاهده منابع آموزشی
              </Link>
              <Link to="/about" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                درباره ما
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: "🎓", title: "آموزش و یادگیری", desc: "دسترسی به بهترین جزوات, ویدیوها و منابع آموزشی برتر اساتید و دانشجویان.", link: "/education" },
          { icon: "🤝", title: "رویدادها و کارگاه‌ها", desc: "شرکت در سمینارهای تخصصی, وبینارها و مسابقات برنامه‌نویسی هیجان‌انگیز.", link: "/events" },
          { icon: "📄", title: "مستندات و نقشه‌راه", desc: "آشنایی با حوزه‌های مختلف علوم کامپیوتر به همراه نقشه مسیر یادگیری.", link: "/documents" },
          { icon: "✨", title: "فعالین و اعضا", desc: "آشنایی با تیم اجرایی, اساتید مشاور و هسته مرکزی انجمن علمی.", link: "/activists" },
        ].map((feat, idx) => (
          <Link 
            key={idx} 
            to={feat.link} 
            className="block bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-primary-500 hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 transition-all duration-500 ease-out"
          >
            <div className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 inline-block">{feat.icon}</div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">{feat.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-loose">{feat.desc}</p>
          </Link>
        ))}
      </section>

      {/* Specialized Networking Section */}
      <section className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden reveal-item">
         {!isApproved ? (
           <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-right">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center text-5xl shadow-inner">🌐</div>
              <div className="flex-grow space-y-6">
                 <h2 className="text-3xl font-black">شبکه‌سازی تخصصی دانشجویان</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-lg leading-loose max-w-3xl">
                    با ثبت تخصص‌ها و علایق علمی خود, به شبکه متخصصین دانشکده بپیوندید و با افرادی که در حوزه‌های مشترک فعالیت می‌کنند ارتباط برقرار کنید. این سیستم به شما کمک می‌کند تا هم‌تیمی‌های پروژه‌های خود را پیدا کنید.
                 </p>
                 <button 
                  onClick={handleNetworkingClick}
                  className="inline-block bg-primary-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                 >
                    {currentUser ? 'ساخت پروفایل و عضویت' : 'ورود و شروع شبکه‌سازی'}
                 </button>
                 {myProfile?.status === ApprovalStatus.PENDING && (
                   <p className="text-sm text-yellow-600 font-bold bg-yellow-50 dark:bg-yellow-900/20 py-3 px-6 rounded-2xl inline-block">
                     ⏳ پروفایل شما ثبت شده و در انتظار تایید مدیریت است.
                   </p>
                 )}
              </div>
           </div>
         ) : (
           <div className="space-y-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/50 dark:bg-slate-800/40 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-primary-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-xl text-white transform hover:rotate-6 transition-transform">🔍</div>
                    <div className="text-right">
                       <h2 className="text-3xl font-black">پیدا کردن افراد و شبکه‌سازی</h2>
                       <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">تخصص‌ها را جستجو کنید و هم‌تیمی‌های جدید بیابید.</p>
                    </div>
                 </div>
                 
                 <div className="flex flex-wrap justify-center gap-3">
                   <button 
                    onClick={() => { setShowNetworkList(true); setViewMode('similar'); }}
                    className={`px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${showNetworkList && viewMode === 'similar' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 shadow-sm border border-slate-200 dark:border-slate-600'}`}
                   >
                     <span>علایق مشابه</span>
                     <span className="text-lg">🎯</span>
                   </button>
                   <button 
                    onClick={() => { setShowNetworkList(true); setViewMode('all'); }}
                    className={`px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${showNetworkList && viewMode === 'all' ? 'bg-primary-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 shadow-sm border border-slate-200 dark:border-slate-600'}`}
                   >
                     <span>تمامی افراد</span>
                     <span className="text-lg">👥</span>
                   </button>
                   {showNetworkList && (
                     <button 
                       onClick={() => setShowNetworkList(false)}
                       className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                       title="بستن لیست"
                     >
                       ✕
                     </button>
                   )}
                 </div>
              </div>

              {showNetworkList ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-spring-in relative z-10">
                  {getFilteredProfiles().length > 0 ? (
                    getFilteredProfiles().map(profile => {
                      const linkedUser = users.find(u => u.id === profile.userId);
                      return (
                        <Link 
                          key={profile.id} 
                          to={`/networking/${profile.id}`}
                          className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                        >
                           <div className="relative overflow-hidden h-64">
                              <img src={profile.profilePicture || "https://www.gravatar.com/avatar/?d=mp"} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                                <span className="text-white text-xs font-black bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-[1.2rem] border border-white/30">
                                  مشاهده تخصص‌ها ←
                                </span>
                              </div>
                              <div className="absolute top-5 right-5 flex flex-col gap-2">
                                 <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 text-white bg-indigo-600/60 shadow-lg">
                                  {toPersianDigits(profile.fields.length)} تخصص علمی
                                 </span>
                              </div>
                           </div>
                           <div className="p-8 space-y-5 flex-grow flex flex-col">
                              <div>
                                 <h4 className="font-black text-2xl group-hover:text-primary-600 transition-colors">{profile.name}</h4>
                                 <p className="text-[11px] text-primary-600 font-black mt-2 uppercase tracking-wide">
                                    رشته تحصیلی: {linkedUser?.fieldOfStudy || 'نامشخص'}، ترم: {profile.semester || (linkedUser?.semester ? toPersianDigits(linkedUser.semester) : 'نامشخص')}
                                 </p>
                                 <div className="flex flex-wrap gap-1.5 mt-4">
                                    {profile.fields.slice(0, 3).map(f => (
                                      <span key={f} className={`text-[9px] px-3 py-1 rounded-lg font-bold ${myProfile.fields.includes(f) ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                        {getFieldLabel(f)}
                                      </span>
                                    ))}
                                    {profile.fields.length > 3 && <span className="text-[9px] bg-slate-50 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded-lg">+{toPersianDigits(profile.fields.length - 3)}</span>}
                                 </div>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-loose font-medium italic">
                                "{profile.description}"
                              </p>
                              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-slate-400">فعال در شبکه</span>
                                 </div>
                                 <div className="flex gap-2">
                                   <span className="text-xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all">💬</span>
                                   <span className="text-xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all">🤝</span>
                                 </div>
                              </div>
                           </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-24 text-center space-y-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                       <div className="text-7xl opacity-20 filter grayscale">🛰️</div>
                       <div className="space-y-2">
                          <h4 className="text-xl font-black text-slate-400">نتیجه‌ای یافت نشد</h4>
                          <p className="text-sm text-slate-400 font-medium">هنوز فردی با تخصص‌های کاملاً مشابه شما در شبکه تایید نشده است.</p>
                       </div>
                       <button 
                        onClick={() => setViewMode('all')}
                        className="text-primary-600 font-bold hover:underline text-sm"
                       >مشاهده تمامی اعضای شبکه ارتباطی</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <div className="p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3.5rem] space-y-8 transition-all group-hover:border-primary-500/30">
                      <div className="flex justify-center gap-4">
                         <div className="w-16 h-16 rounded-3xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-3xl animate-bounce" style={{animationDelay: '0s'}}>👨‍💻</div>
                         <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>👩‍🔬</div>
                         <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>👷‍♂️</div>
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">پنجره ارتباطات باز است!</h3>
                         <p className="text-slate-400 dark:text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                            پروفایل شما با موفقیت تایید شده است. اکنون می‌توانید با کلیک بر روی دکمه‌های بالا, همکاران و متخصصین دیگر را در شبکه علمی دانشکده پیدا کنید.
                         </p>
                      </div>
                      <div className="pt-4 flex justify-center gap-6">
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-black text-primary-600">{toPersianDigits(networkingProfiles.length)}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">پروفایل فعال</span>
                         </div>
                         <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 self-center"></div>
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-black text-indigo-600">{toPersianDigits(csFields.length)}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">حوزه تخصصی</span>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
         )}
      </section>

      {/* Professional Path & Vision Section */}
      <section className="relative overflow-hidden p-10 md:p-20 rounded-[4.5rem] bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl border border-slate-100 dark:border-transparent reveal-item">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 dark:opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-600 rounded-full blur-[150px] animate-blob"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-700 rounded-full blur-[130px] animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 math-bg opacity-10 dark:opacity-20"></div>
        </div>

        <div className="relative z-10 space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-slate-900 dark:text-white">
              مسیر حرفه‌ای و <span className="text-primary-600 underline underline-offset-8 decoration-indigo-500/50">ارزش‌های بنیادین</span> ما
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-3xl mx-auto text-lg font-medium leading-loose">
              ما در انجمن علمی علوم کامپیوتر، فراتر از یک تشکل دانشجویی، به دنبال ایجاد اکوسیستمی هستیم که هر دانشجو در آن بتواند نسخه بهتری از خود را بسازد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                emoji: "🚀", 
                title: "نوآوری مستمر", 
                desc: "ما همیشه در خط مقدم تکنولوژی حرکت می‌کنیم و دانشجویان را با ابزارهای نوین آشنا می‌سازیم.",
                color: "from-blue-500 to-cyan-400"
              },
              { 
                emoji: "🧠", 
                title: "تفکر الگوریتمی", 
                desc: "تمرکز ما بر پرورش ذهنی است که می‌تواند مسائل پیچیده را به راهکارهای ساده و بهینه تبدیل کند.",
                color: "from-indigo-500 to-purple-500"
              },
              { 
                emoji: "🤝", 
                title: "همکاری تیمی", 
                desc: "اعتقاد داریم بزرگترین پروژه‌ها از ترکیب تخصص‌های مختلف و کار تیمی منسجم متولد می‌شوند.",
                color: "from-emerald-500 to-teal-400"
              },
              { 
                emoji: "💎", 
                title: "تعالی علمی", 
                desc: "کیفیت محتوای آموزشی و مستندات ارائه شده، اولویت اصلی ما در تمامی فعالیت‌هاست.",
                color: "from-amber-500 to-orange-400"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="group p-8 rounded-[3rem] bg-white dark:bg-white/5 backdrop-blur-2xl border border-slate-100 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-500 hover:-translate-y-4 hover:shadow-xl dark:hover:shadow-2xl"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-8 shadow-lg group-hover:rotate-12 transition-transform`}>
                  {item.emoji}
                </div>
                <h4 className="text-xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-10">
             <div className="flex items-center gap-4 group cursor-default">
                <span className="text-5xl opacity-40 dark:opacity-50 group-hover:opacity-100 transition-opacity">🛡️</span>
                <div className="text-right">
                   <div className="font-black text-lg text-slate-800 dark:text-white">محیطی امن برای یادگیری</div>
                   <div className="text-xs text-slate-500">بدون ترس از اشتباه، تجربه کنید.</div>
                </div>
             </div>
             <div className="hidden md:block w-px h-12 bg-slate-200 dark:bg-white/10"></div>
             <div className="flex items-center gap-4 group cursor-default">
                <span className="text-5xl opacity-40 dark:opacity-50 group-hover:opacity-100 transition-opacity">🎯</span>
                <div className="text-right">
                   <div className="font-black text-lg text-slate-800 dark:text-white">هدف‌گذاری شغلی</div>
                   <div className="text-xs text-slate-500">ارتباط مستقیم با متخصصین صنعت.</div>
                </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
