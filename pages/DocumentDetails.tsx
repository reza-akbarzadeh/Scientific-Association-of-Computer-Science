import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { toPersianDigits } from '../constants';

const DocumentDetails: React.FC = () => {
  const { id } = useParams();
  const { documents, currentUser, sendMessage, users } = useApp();
  const navigate = useNavigate();
  const [showMsgModal, setShowMsgModal] = useState<{name: string, userId?: string} | null>(null);
  const [msg, setMsg] = useState('');

  const doc = documents.find(d => d.id === id);

  if (!doc) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">مستند یافت نشد</h2>
        <button onClick={() => navigate('/documents')} className="mt-4 text-primary-600 font-bold hover:underline">بازگشت به لیست مستندات</button>
      </div>
    );
  }

  const resolveExpertData = (expert: any) => {
    if (!expert.userId) return expert;
    const linkedUser = users.find(u => u.id === expert.userId);
    if (!linkedUser) return expert;
    return {
      ...expert,
      name: linkedUser.name,
      image: linkedUser.profilePicture || expert.image
    };
  };

  const handleSend = () => {
    if (!currentUser) {
      alert('لطفا برای ارسال پیام ابتدا وارد شوید.');
      navigate('/login');
      return;
    }
    if (!msg || !showMsgModal) return;
    
    const recipientId = showMsgModal.userId || 'admin-default-id';
    const messagePrefix = showMsgModal.userId ? '' : `درخواست تماس با متخصص ${showMsgModal.name} در حوزه ${doc.title}: `;
    
    sendMessage(currentUser.id, recipientId, `${messagePrefix}${msg}`);
    
    setMsg('');
    setShowMsgModal(null);
    
    if (showMsgModal.userId) {
        alert(`پیام شما مستقیماً برای ${showMsgModal.name} ارسال شد.`);
        navigate('/messages');
    } else {
        alert('پیام شما برای مدیریت ارسال شد تا به اطلاع این متخصص برسد.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-spring-in pb-20">
      <Link to="/documents" className="text-sm text-slate-500 hover:text-primary-600 transition-colors inline-block mb-4">← بازگشت به مستندات</Link>
      
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-[1.5rem] flex items-center justify-center text-4xl">
            {doc.icon || '📄'}
          </div>
          <div>
            <h1 className="text-3xl font-black">{doc.title}</h1>
            <p className="text-primary-600 font-bold text-sm mt-1">علوم کامپیوتر</p>
          </div>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-loose text-justify">
          {doc.description}
        </p>
      </div>

      <section className="space-y-8">
        <h2 className="text-2xl font-black border-r-4 border-primary-600 pr-4">نقشه راه (Roadmap)</h2>
        <div className="space-y-6">
          {doc.roadmap.map((step, idx) => (
            <div key={idx} className="relative flex gap-8 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black z-10 shrink-0">
                  {toPersianDigits(idx + 1)}
                </div>
                {idx !== doc.roadmap.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 absolute top-10"></div>
                )}
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex-grow shadow-sm group-hover:shadow-md transition-shadow">
                <h3 className="font-black text-lg mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
          {doc.roadmap.length === 0 && <p className="text-center text-slate-400 italic">هنوز پله‌های نقشه راه تعریف نشده است.</p>}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-black border-r-4 border-indigo-600 pr-4">خبرگان و فعالین این حوزه</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {doc.experts.map((exp) => {
            const expert = resolveExpertData(exp);
            return (
              <div key={expert.id} className="group bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center hover:shadow-2xl hover:-translate-y-2 transition-all block relative">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full rotate-6 scale-105 group-hover:rotate-12 transition-transform"></div>
                  <img src={expert.image || "https://www.gravatar.com/avatar/?d=mp"} alt={expert.name} className="relative w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl" />
                </div>
                <h3 className="font-bold text-lg mb-1">{expert.name}</h3>
                <p className="text-indigo-600 text-xs font-bold mb-3 uppercase tracking-tighter">{expert.role}</p>
                <p className="text-xs text-slate-400 mb-4">{expert.field}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 px-4">
                  {expert.description}
                </p>
                <button 
                  onClick={() => setShowMsgModal({ name: expert.name, userId: expert.userId })}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-primary-600 py-3 rounded-2xl text-xs font-black hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                >
                  💬 ارسال پیام و ارتباط
                </button>
              </div>
            );
          })}
          {doc.experts.length === 0 && <p className="col-span-full text-center text-slate-400 italic py-10">هنوز خبرگانی برای این بخش ثبت نشده است.</p>}
        </div>
      </section>

      {showMsgModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[200] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[3.5rem] space-y-6 animate-spring-in shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">ارسال پیام به {showMsgModal.name}</h3>
                <button onClick={() => setShowMsgModal(null)} className="text-slate-400 hover:rotate-90 transition-all">✕</button>
              </div>
              <textarea 
                value={msg}
                onChange={e => setMsg(e.target.value)}
                className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none border-none ring-primary-500 focus:ring-2 text-sm leading-relaxed"
                placeholder="متن پیام خود را بنویسید..."
              />
              <div className="flex gap-3">
                <button onClick={handleSend} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all">ارسال پیام</button>
                <button onClick={() => setShowMsgModal(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-600 transition-colors">انصراف</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetails;
