import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { Member } from '../types';

interface MemberItemProps {
  member: Member;
  accentColor: string;
  categoryLabel?: string;
}

const MemberItem: React.FC<MemberItemProps> = ({ member, accentColor }) => {
  const accentText = `text-${accentColor}-600`;
  const accentBg = `bg-${accentColor}-50 dark:bg-${accentColor}-900/20`;
  const accentBorder = `border-${accentColor}-100 dark:border-${accentColor}-800`;

  return (
    <Link 
      to={`/activists/${member.id}`} 
      state={{ from: 'activists' }}
      className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 block"
    >
      <div className="relative overflow-hidden h-60">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
          <span className="text-white text-xs font-black bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
            مشاهده پروفایل کامل ←
          </span>
        </div>
        <div className="absolute top-4 right-4">
           <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20 text-white bg-black/30`}>
            {member.term}
           </span>
        </div>
      </div>
      
      <div className="p-7 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-black text-xl group-hover:text-primary-600 transition-colors">{member.name}</h4>
            <p className={`text-xs font-bold mt-1 ${accentText}`}>{member.role}</p>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-loose font-medium italic">
          "{member.description}"
        </p>
        
        <div className={`pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center`}>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${accentBg} border ${accentBorder}`}>
             <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
             <span className={`text-[10px] font-black ${accentText}`}>تخصص: {member.field}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Activists: React.FC = () => {
  const { members, councilMembers, activeMembers, users } = useApp();

  const resolveMemberData = (member: any) => {
    if (!member.userId) return member;
    const linkedUser = users.find(u => u.id === member.userId);
    if (!linkedUser) return member;
    return {
      ...member,
      name: linkedUser.name,
      image: linkedUser.profilePicture || member.image
    };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 animate-spring-in pb-20">
       <section className="text-center space-y-6 reveal-item">
        <div className="inline-block bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-5 py-2 rounded-2xl text-xs font-black tracking-widest">
           ✨ سرمایه‌های انسانی انجمن
        </div>
        <h2 className="text-4xl md:text-5xl font-black">فعالین و اعضای انجمن</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-loose text-lg">
          قلب تپنده انجمن، تیمی از دانشجویان مشتاق و باانگیزه که برای ارتقای سطح علمی دانشکده تلاش می‌کنند.
        </p>
      </section>

      {/* Central Council */}
      <section className="space-y-10 reveal-item">
        <div className="flex items-center gap-4">
           <h3 className="text-2xl font-black border-r-4 border-primary-600 pr-4">شورای مرکزی</h3>
           <div className="h-px flex-grow bg-gradient-to-l from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {councilMembers.map(m => (
            <MemberItem 
              key={m.id} 
              member={resolveMemberData(m)} 
              accentColor="primary" 
            />
          ))}
          {councilMembers.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">عضوی در شورای مرکزی ثبت نشده است.</div>}
        </div>
      </section>

      {/* Active Members */}
      <section className="space-y-10 reveal-item">
        <div className="flex items-center gap-4">
           <h3 className="text-2xl font-black border-r-4 border-emerald-600 pr-4 text-emerald-700 dark:text-emerald-400">اعضای فعال</h3>
           <div className="h-px flex-grow bg-gradient-to-l from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {activeMembers.map(m => (
            <MemberItem 
              key={m.id} 
              member={resolveMemberData(m)} 
              accentColor="emerald" 
            />
          ))}
          {activeMembers.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">عضو فعالی ثبت نشده است.</div>}
        </div>
      </section>

      {/* Site Founders */}
      <section className="space-y-10 reveal-item">
        <div className="flex items-center gap-4">
           <h3 className="text-2xl font-black border-r-4 border-indigo-600 pr-4 text-indigo-700 dark:text-indigo-400">موسسین سایت</h3>
           <div className="h-px flex-grow bg-gradient-to-l from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {members.map(m => (
            <MemberItem 
              key={m.id} 
              member={resolveMemberData(m)} 
              accentColor="indigo" 
            />
          ))}
        </div>
      </section>

      <div className="relative group overflow-hidden reveal-item">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm"></div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 dark:group-hover:bg-primary-600/20 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-600/20 transition-colors duration-700"></div>
        <div className="absolute inset-0 math-bg opacity-[0.05] pointer-events-none"></div>

        <div className="relative z-10 px-6 py-12 md:px-16 md:py-20 flex flex-col items-center text-center space-y-12">
           <div className="space-y-6 max-w-3xl">
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse"></div>
                <div className="relative w-16 h-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-3xl shadow-xl animate-float">
                  🚀
                </div>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                آیا می‌خواهید به <span className="text-primary-600 dark:text-primary-400">تیم ما</span> بپیوندید؟
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-loose text-base md:text-lg font-medium">
                ما همیشه به دنبال استعدادهای جدید در زمینه‌های برنامه‌نویسی، طراحی گرافیک و مدیریت هستیم. با پیوستن به ما، رزومه خود را تقویت کرده و در یک محیط علمی رشد کنید.
              </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-3">
                 <span className="text-3xl">💻</span>
                 <h4 className="font-bold text-sm">توسعه و فنی</h4>
                 <p className="text-[10px] text-slate-400">برنامه‌نویسی و نگهداری پلتفرم</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-3">
                 <span className="text-3xl">🎨</span>
                 <h4 className="font-bold text-sm">هنری و رسانه</h4>
                 <p className="text-[10px] text-slate-400">طراحی گرافیک و تولید محتوا</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-3">
                 <span className="text-3xl">📢</span>
                 <h4 className="font-bold text-sm">اجرایی و روابط</h4>
                 <p className="text-[10px] text-slate-400">برگزاری رویداد و شبکه‌سازی</p>
              </div>
           </div>

           <div className="pt-4">
             <Link 
                to="/register" 
                className="inline-flex items-center gap-4 bg-primary-600 text-white px-10 py-4.5 rounded-[2rem] font-black text-lg hover:bg-primary-500 hover:scale-105 hover:shadow-[0_20px_50px_-10px_rgba(2,132,199,0.4)] transition-all duration-300 shadow-xl shadow-primary-900/10 active:scale-95 group/btn"
             >
               ثبت‌نام و عضویت در انجمن
               <span className="text-xl group-hover:translate-x-[-6px] transition-transform duration-300">←</span>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Activists;
