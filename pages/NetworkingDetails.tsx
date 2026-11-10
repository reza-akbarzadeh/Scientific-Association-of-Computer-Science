
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { toPersianDigits } from '../constants';

const NetworkingDetails: React.FC = () => {
  const { id } = useParams();
  const { networkingProfiles, currentUser, sendMessage, users, csFields } = useApp();
  const navigate = useNavigate();
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msg, setMsg] = useState('');

  const profile = networkingProfiles.find(p => p.id === id);
  const linkedUser = profile ? users.find(u => u.id === profile.userId) : null;

  if (!profile) {
    return (
      <div className="text-center py-20 space-y-6">
        <h2 className="text-2xl font-bold">پروفایل یافت نشد</h2>
        <Link to="/" className="text-primary-600 font-bold hover:underline">بازگشت به خانه</Link>
      </div>
    );
  }

  const handleSend = () => {
    if (!currentUser) {
      alert('لطفا برای ارسال پیام ابتدا وارد شوید.');
      navigate('/login');
      return;
    }
    if (!msg) return;
    
    sendMessage(currentUser.id, profile.userId, msg);
    setMsg('');
    setShowMsgModal(false);
    alert(`پیام شما برای ${profile.name} ارسال شد. می‌توانید پاسخ را در بخش پیام‌ها دنبال کنید.`);
    navigate('/messages');
  };

  const getFieldLabel = (fieldId: string) => {
    for (const group of csFields) {
      const sub = group.subfields?.find(s => s.id === fieldId);
      if (sub) return sub.label;
    }
    return fieldId;
  };

  return (
    <div className="max-w-4xl mx-auto animate-spring-in space-y-10">
      <Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors">← بازگشت به خانه</Link>
      
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-32 bg-primary-500/5"></div>
        
        <div className="relative group shrink-0 z-10 text-center flex flex-col items-center">
          <div className="absolute -inset-4 bg-primary-500/10 rounded-full blur-3xl rotate-12"></div>
          <img src={profile.profilePicture || "https://www.gravatar.com/avatar/?d=mp"} alt={profile.name} className="relative w-64 h-64 rounded-[2.5rem] object-cover border-8 border-white dark:border-slate-800 shadow-2xl mb-6 mx-auto" />
          
          <div className="relative z-10 bg-primary-50 dark:bg-primary-900/20 px-5 py-2.5 rounded-2xl border border-primary-100 dark:border-primary-800 shadow-sm">
            <p className="text-primary-600 font-black text-sm">
               رشته تحصیلی: {linkedUser?.fieldOfStudy || 'نامشخص'}، ترم: {profile.semester || (linkedUser?.semester ? toPersianDigits(linkedUser.semester) : 'نامشخص')}
            </p>
          </div>
        </div>
        
        <div className="space-y-6 text-right w-full z-10">
          <div>
            <h1 className="text-4xl font-black mb-2">{profile.name}</h1>
          </div>
          
          <div className="space-y-3">
             <h3 className="font-black text-sm text-slate-400 pr-2">حوزه‌های تخصص</h3>
             <div className="flex flex-wrap gap-2">
                {profile.fields.map(f => (
                  <span key={f} className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 px-3 py-1.5 rounded-xl text-[10px] font-black border border-primary-100 dark:border-primary-800">
                    {getFieldLabel(f)}
                  </span>
                ))}
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-lg border-r-4 border-primary-600 pr-3">درباره و مهارت‌ها</h3>
             <p className="text-slate-600 dark:text-slate-400 leading-loose text-justify italic">
               "{profile.description}"
             </p>
          </div>

          <div className="flex flex-wrap gap-3">
             {profile.github && (
               <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold text-center text-xs">GitHub</a>
             )}
             {profile.linkedin && (
               <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold text-center text-xs">LinkedIn</a>
             )}
          </div>

          <button 
            onClick={() => setShowMsgModal(true)}
            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
          >
            شروع گفتگو با {profile.name}
          </button>
        </div>
      </div>

      {showMsgModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[60] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-md p-10 rounded-[2.5rem] space-y-6 shadow-2xl animate-spring-in">
              <h3 className="text-xl font-bold">پیام به {profile.name}</h3>
              <textarea 
                value={msg}
                onChange={e => setMsg(e.target.value)}
                className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none border-none ring-primary-500 focus:ring-2 text-sm"
                placeholder="درخواست همکاری یا سوال خود را اینجا بنویسید..."
              />
              <div className="flex gap-2">
                <button onClick={handleSend} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-bold">ارسال پیام</button>
                <button onClick={() => setShowMsgModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-bold text-slate-500">انصراف</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NetworkingDetails;
