import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../store';

const ActivistDetails: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const { members, councilMembers, activeMembers, currentUser, sendMessage, users } = useApp();
  const navigate = useNavigate();
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msg, setMsg] = useState('');

  // Determine where the user came from
  const fromAbout = location.state?.from === 'about';
  const backLink = fromAbout ? '/about' : '/activists';
  const backLabel = fromAbout ? 'بازگشت به درباره ما' : 'بازگشت به فعالین';

  // Correctly look up members across all three categories
  const rawMember = [...members, ...councilMembers, ...activeMembers].find(m => m.id === id);

  if (!rawMember) {
    return (
      <div className="text-center py-20 space-y-6">
        <h2 className="text-2xl font-bold">عضو یافت نشد</h2>
        <Link to="/activists" className="text-primary-600 font-bold hover:underline">بازگشت به لیست فعالین</Link>
      </div>
    );
  }

  // Resolve unified data
  const linkedUser = rawMember.userId ? users.find(u => u.id === rawMember.userId) : null;
  const member = {
    ...rawMember,
    name: linkedUser ? linkedUser.name : rawMember.name,
    image: linkedUser && linkedUser.profilePicture ? linkedUser.profilePicture : rawMember.image
  };

  const handleSend = () => {
    if (!currentUser) {
      alert('لطفا برای ارسال پیام ابتدا وارد شوید.');
      navigate('/login');
      return;
    }
    if (!msg) return;
    
    // If member is linked to a user account, send direct message. Otherwise, send to admin.
    const recipientId = member.userId || 'admin-default-id';
    const messagePrefix = member.userId ? '' : `درخواست تماس با ${member.name}: `;
    
    sendMessage(currentUser.id, recipientId, `${messagePrefix}${msg}`);
    
    setMsg('');
    setShowMsgModal(false);
    
    if (member.userId) {
        alert(`پیام شما مستقیماً برای ${member.name} ارسال شد. می‌توانید پاسخ را در بخش پیام‌ها مشاهده کنید.`);
        navigate('/messages');
    } else {
        alert('پیام شما برای مدیریت ارسال شد تا به اطلاع این عضو برسد.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-spring-in space-y-10">
      <Link to={backLink} className="text-slate-500 hover:text-primary-600 transition-colors">← {backLabel}</Link>
      
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-12 items-center">
        <div className="relative group shrink-0">
          <div className="absolute -inset-4 bg-primary-500/20 rounded-full blur-3xl rotate-12"></div>
          <img src={member.image} alt={member.name} className="relative w-64 h-64 rounded-[2.5rem] object-cover border-8 border-white dark:border-slate-800 shadow-2xl" />
        </div>
        
        <div className="space-y-6 text-right w-full">
          <div>
            <h1 className="text-4xl font-black mb-2">{member.name}</h1>
            <p className="text-primary-600 font-bold tracking-widest">{member.role}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 block mb-1">دوره فعالیت</span>
              <span className="font-bold text-sm">{member.term}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 block mb-1">رشته / تخصص</span>
              <span className="font-bold text-sm">{member.field}</span>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-lg border-r-4 border-primary-600 pr-3">درباره و بیوگرافی</h3>
             <p className="text-slate-600 dark:text-slate-400 leading-loose text-justify">
               {member.description} {member.bio}
             </p>
          </div>

          <button 
            onClick={() => setShowMsgModal(true)}
            className="w-full bg-slate-900 text-white dark:bg-primary-600 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
          >
            {member.userId ? `گفتگوی مستقیم با ${member.name}` : `ارتباط با ${member.name}`}
          </button>
        </div>
      </div>

      {showMsgModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[60] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[2.5rem] space-y-6 shadow-2xl animate-spring-in">
              <h3 className="text-xl font-bold">پیام به {member.name}</h3>
              <textarea 
                value={msg}
                onChange={e => setMsg(e.target.value)}
                className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none border-none ring-primary-500 focus:ring-2"
                placeholder="متن خود را اینجا بنویسید..."
              />
              <div className="flex gap-2">
                <button onClick={handleSend} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-bold">ارسال پیام</button>
                <button onClick={() => setShowMsgModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-bold">انصراف</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ActivistDetails;