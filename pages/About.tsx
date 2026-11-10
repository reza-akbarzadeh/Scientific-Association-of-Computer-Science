import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store.tsx';
import { UI_STRINGS } from '../constants.ts';

const About: React.FC = () => {
  const { councilMembers, users } = useApp();

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
    <div className="max-w-5xl mx-auto space-y-16 animate-spring-in">
      <section className="text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-black">{UI_STRINGS.about}</h2>
        <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-loose">
          انجمن علمی علوم کامپیوتر در سال ۱۳۹۵ با هدف ارتقای سطح علمی و مهارتی دانشجویان در حوزه‌های مرتبط با فناوری اطلاعات و علوم داده تاسیس شد. ما بر این باوریم که با ایجاد فضایی پویا، می‌توانیم مسیر موفقیت شغلی و تحصیلی دانشجویان را هموارتر کنیم.
        </p>
      </section>

      {/* Primary Team Section */}
      <section>
        <h3 className="text-2xl font-bold mb-8 border-r-4 border-primary-600 pr-4">شورای مرکزی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {councilMembers.map((m) => {
            const member = resolveMemberData(m);
            return (
              <Link 
                key={member.id} 
                to={`/activists/${member.id}`}
                state={{ from: 'about' }}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all block"
              >
                <div className="relative overflow-hidden h-48">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-[10px] font-bold">مشاهده پروفایل کامل ←</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary-600 transition-colors">{member.name}</h4>
                      <p className="text-xs text-primary-600 font-medium">{member.role}</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{member.term}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {member.description}
                  </p>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">تخصص: {member.field}</span>
                  </div>
                </div>
              </Link>
            );
          })}
          {councilMembers.length === 0 && <p className="col-span-full text-center text-slate-400 py-10">عضوی در شورای مرکزی ثبت نشده است.</p>}
        </div>
      </section>

      {/* Secretary Section */}
      <section className="bg-slate-100 dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-block bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            {UI_STRINGS.secretary}
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">پیام دبیر انجمن</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-loose text-justify italic">
            "دبیر انجمن علمی مسئولیت هماهنگی نهایی تمامی کارگروه‌ها، ارتباط با دانشکده و مدیریت بودجه انجمن را بر عهده دارد. در این دوره، تمرکز اصلی ما بر گسترش همکاری با شرکت‌های دانش‌بنیان و برگزاری کمپ‌های مهارت‌افزایی است."
          </p>
          <div className="pt-4">
             <div className="font-black text-lg">دکتر سهراب مهدوی</div>
             <div className="text-sm text-primary-600 font-bold">دبیر دوره فعلی</div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary-600/20 rounded-full blur-2xl group-hover:bg-primary-600/40 transition-all"></div>
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
            <img src="https://picsum.photos/400/400?random=10" alt="Secretary" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;