import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { toPersianDigits } from '../constants';
import { UserMessage, UserRole } from '../types';

const MessageIcon = () => (
  <div className="bg-primary-600 p-3 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  </div>
);

const ChatCenter: React.FC = () => {
  const { currentUser, users, sendMessage, markMessagesAsRead } = useApp();
  const [selectedChatPartner, setSelectedChatPartner] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const freshUser = users.find(u => u.id === currentUser?.id);

  // Group messages by partner
  const conversations = React.useMemo(() => {
    if (!freshUser?.messages) return {};
    const groups: Record<string, UserMessage[]> = {};
    
    freshUser.messages.forEach(msg => {
      const partnerId = msg.senderId === freshUser.id ? msg.receiverId : msg.senderId;
      if (!groups[partnerId]) groups[partnerId] = [];
      groups[partnerId].push(msg);
    });
    
    return groups;
  }, [freshUser?.messages, freshUser?.id]);

  // Unique partner IDs sorted by latest message, ensuring Admin is always visible for students
  const sortedPartnerIds = React.useMemo(() => {
    if (!freshUser) return [];
    let ids = Object.keys(conversations);
    
    // Admin ID as defined in store.tsx
    const ADMIN_ID = 'admin-default-id';
    
    if (freshUser.role === UserRole.STUDENT && !ids.includes(ADMIN_ID)) {
        ids.push(ADMIN_ID);
    }
    
    return ids.sort((a, b) => {
      const msgsA = conversations[a];
      const msgsB = conversations[b];
      if (!msgsA) return 1;
      if (!msgsB) return -1;
      const latestA = msgsA[msgsA.length - 1];
      const latestB = msgsB[msgsB.length - 1];
      return new Date(latestB.date).getTime() - new Date(latestA.date).getTime();
    });
  }, [conversations, freshUser]);

  // Get current conversation message count for selective scrolling
  const currentMsgCount = selectedChatPartner ? conversations[selectedChatPartner]?.length : 0;

  useEffect(() => {
    if (selectedChatPartner) {
      chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [selectedChatPartner, currentMsgCount]);

  useEffect(() => {
    if (selectedChatPartner && freshUser?.id) {
      markMessagesAsRead(freshUser.id, freshUser.id);
    }
  }, [selectedChatPartner, freshUser?.id, markMessagesAsRead]);

  if (!freshUser) return null;

  const handleSend = () => {
    if (!msgInput.trim() || !selectedChatPartner) return;
    sendMessage(freshUser.id, selectedChatPartner, msgInput);
    setMsgInput('');
  };

  const getPartnerName = (partnerId: string) => {
    const partner = users.find(u => u.id === partnerId);
    return partner ? partner.name : 'کاربر ناشناس';
  };

  const getPartnerAvatar = (partnerId: string) => {
    const partner = users.find(u => u.id === partnerId);
    return partner?.profilePicture || "https://www.gravatar.com/avatar/?d=mp";
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-spring-in h-[calc(100vh-160px)] flex flex-col group">
      <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
        <MessageIcon />
        مرکز پیام‌های انجمن
      </h2>

      <div className="flex-grow bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex overflow-hidden min-h-0">
        {/* Sidebar: Recent Chats */}
        <aside className="w-full md:w-80 border-l dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-800/20">
          <div className="p-6 border-b dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-400">گفتگوهای اخیر</h3>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {sortedPartnerIds.length > 0 ? (
              sortedPartnerIds.map(partnerId => {
                const partnerMsgs = conversations[partnerId];
                const latestMsg = partnerMsgs ? partnerMsgs[partnerMsgs.length - 1] : null;
                const unreadCount = partnerMsgs ? partnerMsgs.filter(m => !m.isRead && m.receiverId === freshUser.id).length : 0;
                
                return (
                  <button 
                    key={partnerId}
                    type="button"
                    onClick={() => setSelectedChatPartner(partnerId)}
                    className={`w-full p-6 text-right flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 transition-all ${selectedChatPartner === partnerId ? 'bg-white dark:bg-slate-800 shadow-inner' : 'hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                  >
                    <div className="relative">
                      <img src={getPartnerAvatar(partnerId)} className="w-12 h-12 rounded-2xl object-cover" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white">{unreadCount}</span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                       <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-sm truncate">{getPartnerName(partnerId)}</span>
                          <span className="text-[8px] text-slate-400">{latestMsg ? toPersianDigits(latestMsg.date.split(' ')[0]) : ''}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 truncate">{latestMsg ? latestMsg.text : 'شروع گفتگو با این کاربر...'}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-10 text-center text-slate-400 text-xs italic">هنوز پیامی ندارید.</div>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-grow flex flex-col bg-white dark:bg-slate-950 min-h-0">
          {selectedChatPartner ? (
            <>
              <div className="p-6 border-b dark:border-slate-800 bg-slate-50/30 backdrop-blur-md flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <img src={getPartnerAvatar(selectedChatPartner)} className="w-10 h-10 rounded-xl object-cover shadow-md" />
                    <div>
                       <h4 className="font-black text-sm">{getPartnerName(selectedChatPartner)}</h4>
                    </div>
                 </div>
                 <button type="button" onClick={() => setSelectedChatPartner(null)} className="md:hidden text-slate-400">✕</button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-math-bg custom-scrollbar relative">
                {(conversations[selectedChatPartner] || []).map(msg => {
                  const isMine = msg.senderId === freshUser.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                       <div className={`p-4 rounded-3xl text-sm shadow-md max-w-[80%] leading-relaxed ${isMine ? 'bg-primary-600 text-white rounded-tl-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tr-none border border-slate-100 dark:border-slate-800'}`}>
                          <p>{msg.text}</p>
                          <div className={`text-[9px] mt-2 flex justify-between items-center gap-4 opacity-60`}>
                             <span>{toPersianDigits(msg.date)}</span>
                             {isMine && <span>{msg.isRead ? '👁️' : '✔️'}</span>}
                          </div>
                       </div>
                    </div>
                  );
                })}
                {(!conversations[selectedChatPartner] || conversations[selectedChatPartner].length === 0) && (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                      <div className="text-4xl">🤝</div>
                      <p className="text-xs font-bold italic">گفتگو را آغاز کنید.</p>
                   </div>
                )}
                <div ref={chatEndRef} className="h-2" />
              </div>

              <div className="p-6 border-t dark:border-slate-800 flex gap-4">
                 <input 
                  type="text" 
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="پیام خود را بنویسید..." 
                  className="flex-grow bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 ring-primary-500 outline-none transition-all shadow-inner"
                 />
                 <button type="button" onClick={handleSend} className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all">ارسال</button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-8 p-20 text-center">
               <span className="text-9xl grayscale opacity-10">💬</span>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-400">یک گفتگو را انتخاب کنید</h3>
                 <p className="text-sm font-medium">پیام‌های دریافتی از اعضا و مدیریت در اینجا نمایش داده می‌شود.</p>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatCenter;