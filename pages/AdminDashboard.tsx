import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store.tsx';
import { UI_STRINGS, toEnglishDigits, toPersianDigits, getCurrentShamsiDate } from '../constants.ts';
import { UserRole, ApprovalStatus, EventCategory, Member, Professor, AppEvent, User, Course, LectureNote, MaterialType, EducationalVideo, DocumentArea, EventRegistration, NetworkingProfile, CSField } from '../types.ts';

const AdminDashboard: React.FC = () => {
  const { 
    currentUser, users, approveUser, sendMessage, markMessagesAsRead, updateUserProfile, manuallyAddUser, deleteUser,
    events, addEvent, updateEvent, deleteEvent,
    members, councilMembers, activeMembers, professors,
    addMember, updateMember, deleteMember,
    addProfessor, updateProfessor, deleteProfessor,
    courses, addCourse, deleteCourse,
    notes, addNote, updateNote, deleteNote,
    videos, addVideo, updateVideo, deleteVideo,
    documents, addDocument, updateDocument, deleteDocument,
    registrations, deleteRegistration,
    networkingProfiles, approveNetworkingProfile, deleteNetworkingProfile, updateNetworkingProfile,
    csFields, updateCsFields
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('users');
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // New state for user search
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [editingUserData, setEditingUserData] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', studentId: '', nationalId: '', email: '', profilePicture: '', phone: '', fieldOfStudy: '', semester: '', degreeLevel: '' });
  const [addUserError, setAddUserError] = useState('');

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventGallery, setEventGallery] = useState<{ url: string; description: string }[]>([]);
  const [eventDateParts, setEventDateParts] = useState({ y: '1404', m: '01', d: '01' });
  const [regRequired, setRegRequired] = useState(false);

  const [showMemberForm, setShowMemberForm] = useState<{type: 'founding'|'council'|'active', show: boolean}>({type: 'council', show: false});
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [showProfForm, setShowProfForm] = useState(false);
  const [editingProf, setEditingProf] = useState<Professor | null>(null);

  const [selectedProfForCourses, setSelectedProfForCourses] = useState<string | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourseForm, setNewCourseForm] = useState({ title: '', description: '' });

  const [selectedCourseForMedia, setSelectedCourseForMedia] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<LectureNote | null>(null);
  const [noteUploadType, setNoteUploadType] = useState<MaterialType>(MaterialType.LINK);
  const [newNoteForm, setNewNoteForm] = useState({ title: '', fileUrl: '' });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<EducationalVideo | null>(null);
  const [videoUploadType, setVideoUploadType] = useState<MaterialType>(MaterialType.LINK);
  const [newVideoForm, setNewVideoForm] = useState({ title: '', description: '', videoUrl: '' });

  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentArea | null>(null);
  const [newDocForm, setNewDocForm] = useState<DocumentArea>({
    id: '', title: '', category: 'CS', description: '', icon: '', roadmap: [], experts: []
  });

  const [regFilterEventId, setRegFilterEventId] = useState('all');

  const [editingNetworkProfile, setEditingNetworkProfile] = useState<NetworkingProfile | null>(null);

  // Field Management state
  const [isFieldManagerOpen, setIsFieldManagerOpen] = useState(false);

  useEffect(() => {
    const totalMessages = users.reduce((acc, user) => acc + (user.messages?.length || 0), 0);
    if (lastMessageCount > 0 && totalMessages > lastMessageCount) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
    setLastMessageCount(totalMessages);
  }, [users]);

  useEffect(() => {
    if (editingEvent) {
      const parts = toEnglishDigits(editingEvent.date).split('/');
      if (parts.length === 3) {
        setEventDateParts({ y: parts[0], m: parts[1], d: parts[2] });
      }
      setEventImageUrl(editingEvent.image);
      setEventGallery(editingEvent.gallery || []);
      setRegRequired(editingEvent.requiresRegistration || false);
    } else {
      setEventDateParts({ y: '1404', m: '01', d: '01' });
      setEventImageUrl('');
      setEventGallery([]);
      setRegRequired(false);
    }
  }, [editingEvent, showEventForm]);

  useEffect(() => {
    if (selectedChatUser && activeTab === 'users' && currentUser) {
      const chatUser = users.find(u => u.id === selectedChatUser);
      const hasUnread = chatUser?.messages?.some(m => !m.isRead && m.receiverId === currentUser.id);
      if (hasUnread) {
        markMessagesAsRead(selectedChatUser, currentUser.id);
      }
    }
  }, [selectedChatUser, activeTab, currentUser, users, markMessagesAsRead]);

  useEffect(() => {
    if (selectedChatUser) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatUser, users]);

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return <div className="text-center py-20 bg-red-50 text-red-600 rounded-3xl font-black">دسترسی غیرمجاز</div>;
  }

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

  const getComputedCategory = () => {
    const todayStr = getCurrentShamsiDate();
    const normalizedDate = `${eventDateParts.y}/${eventDateParts.m.padStart(2, '0')}/${eventDateParts.d.padStart(2, '0')}`;
    if (normalizedDate === todayStr) return EventCategory.ONGOING;
    if (normalizedDate > todayStr) return EventCategory.UPCOMING;
    return EventCategory.PAST;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: string, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'member') setEditingMember(prev => prev ? { ...prev, image: result } : ({ id: '', name: '', role: '', description: '', field: '', term: '', image: result } as Member));
        if (target === 'prof') setEditingProf(prev => ({ ...(prev || { id: '', name: '', academicRank: '', field: '', bio: '', image: '' }), image: result }));
        if (target === 'user') setNewUserForm(prev => ({ ...prev, profilePicture: result }));
        if (target === 'event') setEventImageUrl(result);
        if (target === 'gallery') setEventGallery(prev => [...prev, { url: result, description: '' }]);
        if (target === 'editUser') setEditingUserData(prev => prev ? { ...prev, profilePicture: result } : null);
        if (target === 'note') setNewNoteForm(prev => ({ ...prev, fileUrl: result }));
        if (target === 'video') setNewVideoForm(prev => ({ ...prev, videoUrl: result }));
        if (target === 'expertImg' && index !== undefined) {
           const newExperts = [...newDocForm.experts];
           newExperts[index].image = result;
           setNewDocForm({ ...newDocForm, experts: newExperts });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = getComputedCategory();
    const target = e.currentTarget as any;
    const data = {
      title: target.title_field.value,
      description: target.desc_field.value,
      date: `${eventDateParts.y}/${eventDateParts.m}/${eventDateParts.d}`,
      time: target.time_field.value,
      location: target.loc_field.value,
      externalLink: target.link_field.value,
      image: eventImageUrl || target.img_field.value,
      category: category,
      requiresRegistration: regRequired,
      gallery: category === EventCategory.PAST ? eventGallery : []
    };
    if (editingEvent) updateEvent({ ...editingEvent, ...data });
    else addEvent(data as any);
    setShowEventForm(false);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError('');
    const registerError = manuallyAddUser(newUserForm);
    if (registerError) {
      setAddUserError(registerError);
      return;
    }
    setShowAddUserModal(false);
    setNewUserForm({ name: '', studentId: '', nationalId: '', email: '', profilePicture: '', phone: '', fieldOfStudy: '', semester: '', degreeLevel: '' });
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('آیا از حذف دائمی این کاربر اطمینان دارید؟')) {
      deleteUser(userId);
      if (selectedChatUser === userId) {
        setSelectedChatUser(null);
      }
    }
  };

  const getFieldLabel = (fieldId: string) => {
    for (const group of csFields) {
      const sub = group.subfields?.find(s => s.id === fieldId);
      if (sub) return sub.label;
    }
    return fieldId;
  };

  const currentCategory = getComputedCategory();

  const filteredRegistrations = regFilterEventId === 'all' 
    ? registrations 
    : registrations.filter(r => r.eventId === regFilterEventId);

  const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const tabs = [
    { id: 'users', label: 'کاربران و پیام‌ها', icon: '👥' },
    { id: 'networking', label: 'مدیریت ارتباطات', icon: '🌐' },
    { id: 'registrations', label: 'ثبت‌نام‌های رویداد', icon: '📝' },
    { id: 'events', label: 'رویدادها', icon: '📅' },
    { id: 'team', label: 'تیم و آموزش', icon: '📁' },
    { id: 'documents', label: 'مستندات', icon: '📄' }
  ];

  const filteredUsers = users.filter(u => {
    if (u.role === UserRole.ADMIN) return false;
    const search = userSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(search) || u.studentId.includes(search);
  });

  // Field Management Logic
  const handleAddGroup = () => {
    const label = prompt('نام دسته‌بندی جدید را وارد کنید:');
    if (label) {
      const newGroup: CSField = { id: `group-${Date.now()}`, label, subfields: [] };
      updateCsFields([...csFields, newGroup]);
    }
  };

  const handleEditGroup = (groupId: string) => {
    const group = csFields.find(f => f.id === groupId);
    const newLabel = prompt('نام جدید دسته‌بندی:', group?.label);
    if (newLabel) {
      updateCsFields(csFields.map(f => f.id === groupId ? { ...f, label: newLabel } : f));
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('آیا از حذف این دسته‌بندی و تمام زیرمجموعه‌های آن اطمینان دارید؟')) {
      updateCsFields(csFields.filter(f => f.id !== groupId));
    }
  };

  const handleAddSubfield = (groupId: string) => {
    const label = prompt('نام زیرمجموعه جدید:');
    if (label) {
      updateCsFields(csFields.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            subfields: [...(group.subfields || []), { id: `sub-${Date.now()}`, label }]
          };
        }
        return group;
      }));
    }
  };

  const handleEditSubfield = (groupId: string, subId: string) => {
    const group = csFields.find(f => f.id === groupId);
    const sub = group?.subfields?.find(s => s.id === subId);
    const newLabel = prompt('نام جدید زیرمجموعه:', sub?.label);
    if (newLabel) {
      updateCsFields(csFields.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            subfields: g.subfields?.map(s => s.id === subId ? { ...s, label: newLabel } : s)
          };
        }
        return g;
      }));
    }
  };

  const handleDeleteSubfield = (groupId: string, subId: string) => {
    if (confirm('حذف این زیرمجموعه؟')) {
      updateCsFields(csFields.map(g => {
        if (g.id === groupId) {
          return { ...g, subfields: g.subfields?.filter(s => s.id !== subId) };
        }
        return g;
      }));
    }
  };

  return (
    <div className="space-y-8 animate-spring-in pb-20 relative">
      {showNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce flex items-center gap-3 border-2 border-white">
          <span className="text-xl">📩</span>
          <span className="font-black text-sm">پیام جدید دریافت شد!</span>
        </div>
      )}

      <header className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div className="text-center xl:text-right shrink-0">
           <h2 className="text-3xl font-black">{UI_STRINGS.adminPanel}</h2>
           <p className="text-slate-500 text-sm mt-1 font-medium">مدیریت متمرکز انجمن علمی</p>
        </div>
        
        <div className="w-full xl:w-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-3xl xl:rounded-[2.5rem] shadow-inner border border-slate-200 dark:border-slate-700 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 xl:px-8 py-3 rounded-2xl xl:rounded-3xl text-[10px] xl:text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden h-[800px] flex flex-col lg:flex-row">
        
        {activeTab === 'users' && (
          <>
            <div className="w-full lg:w-[450px] border-l border-slate-50 dark:border-slate-800 flex flex-col bg-slate-50/40 dark:bg-slate-900/40">
               <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 bg-white dark:bg-slate-900">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-lg">لیست اعضا</h3>
                    <button onClick={() => { setAddUserError(''); setShowAddUserModal(true); }} className="bg-primary-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg hover:scale-105 active:scale-95 transition-all">+ افزودن دستی</button>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="جستجو بر اساس نام یا شماره دانشجویی..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 p-3 pr-10 rounded-xl text-xs outline-none focus:ring-2 ring-primary-500 transition-all shadow-inner border-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 grayscale opacity-40 text-sm">🔍</span>
                  </div>
               </div>
               <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 custom-scrollbar">
                  {filteredUsers.map(u => (
                    <div 
                      key={u.id} 
                      className={`p-6 flex flex-col gap-4 transition-all ${selectedChatUser === u.id ? 'bg-white dark:bg-slate-800 shadow-inner' : 'hover:bg-white/40 dark:hover:bg-slate-800/50'}`}
                    >
                       <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={u.profilePicture || 'https://www.gravatar.com/avatar/?d=mp'} className="w-14 h-14 rounded-2xl object-cover shadow-md border border-white dark:border-slate-700" />
                            {(u.messages || []).some(m => !m.isRead && m.receiverId === currentUser.id) && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-md">!</span>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                             <div className="flex justify-between items-start">
                                <span className="font-black text-sm truncate">{u.name}</span>
                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${u.status === ApprovalStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                   {u.status === ApprovalStatus.APPROVED ? 'تایید شده' : 'در انتظار'}
                                </span>
                             </div>
                             <div className="space-y-1 mt-1">
                               <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                                 <span>شماره دانشجویی:</span>
                                 <span className="font-bold text-slate-600 dark:text-slate-300">{toPersianDigits(u.studentId)}</span>
                               </div>
                               <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                                 <span>رمز عبور (کد ملی):</span>
                                 <span className="font-bold text-primary-600">{toPersianDigits(u.nationalId)}</span>
                               </div>
                               <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                                 <span>رشته:</span>
                                 <span className="font-bold text-slate-600 dark:text-slate-300 truncate max-w-[100px] text-left">{u.fieldOfStudy || '—'}</span>
                               </div>
                               <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                                 <span>مقطع:</span>
                                 <span className="font-bold text-slate-600 dark:text-slate-300">{u.degreeLevel || '—'}</span>
                               </div>
                               <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                                 <span>ترم:</span>
                                 <span className="font-bold text-slate-600 dark:text-slate-300">{u.semester ? toPersianDigits(u.semester) : '—'}</span>
                               </div>
                               <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                                 <span>شماره تماس:</span>
                                 <span className="font-bold text-slate-600 dark:text-slate-300">{u.phone ? toPersianDigits(u.phone) : 'ثبت نشده'}</span>
                               </div>
                               <div className="text-[10px] text-slate-400 font-mono truncate">
                                 <span>ایمیل: </span>
                                 <span className="font-medium">{u.email || 'ثبت نشده'}</span>
                               </div>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedChatUser(u.id)} 
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${selectedChatUser === u.id ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-200/50 dark:bg-slate-700 text-slate-600'}`}
                          >💬 گفتگو</button>
                          <button onClick={() => setEditingUserData(u)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs hover:bg-slate-200" title="ویرایش">✏️</button>
                          {u.status === ApprovalStatus.PENDING && (
                             <button 
                              onClick={() => approveUser(u.id)} 
                              className="bg-emerald-500 text-white px-3 py-2 rounded-xl text-[10px] font-black hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                              title="تایید حساب"
                            >
                              <span className="text-sm">✓</span>
                              تایید هویت
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteUser(u.id)} 
                            className="bg-red-50 dark:bg-red-950/30 p-2.5 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
                            title="حذف کاربر"
                          >
                            <DeleteIcon />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex-grow flex-col bg-white dark:bg-slate-950 flex">
               {selectedChatUser ? (
                 <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/20 backdrop-blur-sm">
                       <div className="flex items-center gap-4">
                          <img src={users.find(u => u.id === selectedChatUser)?.profilePicture || 'https://www.gravatar.com/avatar/?d=mp'} className="w-11 h-11 rounded-xl object-cover" />
                          <h4 className="font-black text-sm">{users.find(u => u.id === selectedChatUser)?.name}</h4>
                       </div>
                       <button onClick={() => setSelectedChatUser(null)} className="text-slate-400 p-2.5 hover:bg-slate-100 rounded-lg">✕</button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-10 space-y-6 bg-math-bg custom-scrollbar relative">
                       {(users.find(u => u.id === selectedChatUser)?.messages || []).map(msg => (
                          <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                             <div className={`p-5 rounded-[1.8rem] text-xs shadow-md max-w-[80%] ${msg.senderId === currentUser.id ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 rounded-tl-none'}`}>
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className="text-[9px] mt-3 block opacity-60 text-left" dir="ltr">{toPersianDigits(msg.date)}</span>
                             </div>
                          </div>
                       ))}
                       <div ref={chatEndRef} />
                    </div>
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                       <input 
                         value={adminReply} 
                         onChange={e => setAdminReply(e.target.value)} 
                         onKeyPress={e => e.key === 'Enter' && adminReply.trim() && (sendMessage(currentUser.id, selectedChatUser, adminReply), setAdminReply(''))}
                         placeholder="پاسخ مدیریت را بنویسید..." 
                         className="flex-grow bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl text-sm outline-none border-none focus:ring-2 ring-primary-500 transition-all shadow-inner" 
                       />
                       <button 
                         onClick={() => { if(adminReply.trim()) { sendMessage(currentUser.id, selectedChatUser, adminReply); setAdminReply(''); } }} 
                         className="bg-primary-600 text-white px-10 py-4.5 rounded-2xl font-black shadow-xl hover:bg-primary-700 transition-all"
                       >ارسال</button>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-8 p-20 text-center">
                    <span className="text-9xl grayscale opacity-10">📫</span>
                    <div className="space-y-3">
                       <h3 className="text-3xl font-black text-slate-400">مرکز پیام‌های انجمن</h3>
                       <p className="text-sm font-medium text-slate-400">یک کاربر را برای شروع گفتگو انتخاب کنید.</p>
                    </div>
                 </div>
               )}
            </div>
          </>
        )}

        {activeTab === 'networking' && (
           <div className="p-12 w-full space-y-12 h-full overflow-y-auto bg-slate-50/10 custom-scrollbar">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b pb-10 dark:border-slate-800">
                 <div>
                    <h3 className="text-3xl font-black">مدیریت ارتباطات (Networking)</h3>
                    <p className="text-sm text-slate-400 mt-1 font-medium">تایید و ویرایش پروفایل‌های شبکه‌سازی تخصصی</p>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setIsFieldManagerOpen(!isFieldManagerOpen)} 
                      className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${isFieldManagerOpen ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                    >
                      {isFieldManagerOpen ? 'بستن مدیریت حوزه‌ها' : '⚙️ مدیریت حوزه‌های تخصصی'}
                    </button>
                 </div>
              </div>

              {isFieldManagerOpen ? (
                <div className="space-y-10 animate-spring-in">
                   <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black border-r-4 border-indigo-600 pr-4">لیست حوزه‌های تخصصی و علایق</h4>
                      <button onClick={handleAddGroup} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[11px] font-black shadow-lg hover:scale-105 transition-all">+ افزودن دسته‌بندی جدید</button>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      {csFields.map(group => (
                        <div key={group.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                           <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between border-b dark:border-slate-800">
                              <div className="flex items-center gap-4">
                                 <span className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-lg">📁</span>
                                 <span className="font-black text-sm">{group.label}</span>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => handleAddSubfield(group.id)} className="bg-white dark:bg-slate-700 px-4 py-2 rounded-xl text-[10px] font-bold shadow-sm hover:bg-indigo-50 border border-slate-100">+ افزودن زیرمجموعه</button>
                                 <button onClick={() => handleEditGroup(group.id)} className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-[10px] shadow-sm border border-slate-100">✏️</button>
                                 <button onClick={() => handleDeleteGroup(group.id)} className="p-2.5 rounded-xl bg-red-50 text-red-500 text-[10px] shadow-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><DeleteIcon /></button>
                              </div>
                           </div>
                           <div className="p-6">
                              <div className="flex flex-wrap gap-2">
                                 {group.subfields?.map(sub => (
                                   <div key={sub.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 pl-2 pr-4 py-2 rounded-2xl shadow-sm group/sub transition-all hover:border-indigo-200">
                                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{sub.label}</span>
                                      <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                         <button onClick={() => handleEditSubfield(group.id, sub.id)} className="p-1.5 text-[8px] bg-slate-50 rounded-lg hover:text-indigo-600">✏️</button>
                                         <button onClick={() => handleDeleteSubfield(group.id, sub.id)} className="p-1.5 text-[8px] bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white">✕</button>
                                      </div>
                                   </div>
                                 ))}
                                 {(!group.subfields || group.subfields.length === 0) && (
                                   <span className="text-[10px] text-slate-400 italic py-2">هنوز زیرمجموعه‌ای تعریف نشده است.</span>
                                 )}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {networkingProfiles.map(profile => {
                    const linkedUser = users.find(u => u.id === profile.userId);
                    return (
                      <div key={profile.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col shadow-sm group">
                          <div className="flex items-center gap-4 mb-6">
                            <img src={profile.profilePicture || "https://www.gravatar.com/avatar/?d=mp"} className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700" />
                            <div className="flex-grow min-w-0">
                                <h4 className="font-black text-lg">{profile.name}</h4>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${profile.status === ApprovalStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {profile.status === ApprovalStatus.APPROVED ? 'تایید شده' : 'در انتظار تایید'}
                                </span>
                            </div>
                          </div>
                          
                          <div className="flex-grow space-y-4">
                            <div className="flex flex-wrap gap-1.5">
                                {profile.fields.map(f => (
                                  <span key={f} className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-bold">{getFieldLabel(f)}</span>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed font-medium italic">"{profile.description}"</p>
                            <div className="space-y-1 pt-4 border-t dark:border-slate-800">
                                <div className="text-[10px] text-slate-400">شماره دانشجویی: <span className="font-bold text-slate-700 dark:text-slate-300">{toPersianDigits(linkedUser?.studentId || '—')}</span></div>
                                <div className="text-[10px] text-slate-400">کد ملی: <span className="font-bold text-slate-700 dark:text-slate-300">{toPersianDigits(linkedUser?.nationalId || '—')}</span></div>
                                <div className="text-[10px] text-slate-400">رشته: <span className="font-bold text-slate-700 dark:text-slate-300">{linkedUser?.fieldOfStudy || '—'}</span></div>
                                <div className="text-[10px] text-slate-400">ترم: <span className="font-bold text-slate-700 dark:text-slate-300">{profile.semester || (linkedUser?.semester ? toPersianDigits(linkedUser.semester) : '—')}</span></div>
                            </div>
                          </div>

                          <div className="mt-8 flex gap-2">
                            <button 
                              onClick={() => { setSelectedChatUser(profile.userId); setActiveTab('users'); }}
                              className="p-2.5 rounded-xl bg-primary-50 text-primary-600 text-[10px] hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                              title="ارسال پیام"
                            >💬</button>
                            {profile.status === ApprovalStatus.PENDING && (
                              <button onClick={() => approveNetworkingProfile(profile.id)} className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-all">تایید انتشار</button>
                            )}
                            <button onClick={() => setEditingNetworkProfile(profile)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] hover:bg-slate-200">ویرایش</button>
                            <button onClick={() => { if(confirm('حذف این پروفایل؟')) deleteNetworkingProfile(profile.id); }} className="p-2.5 rounded-xl bg-red-50 text-red-500 text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><DeleteIcon /></button>
                          </div>
                      </div>
                    );
                  })}
                  {networkingProfiles.length === 0 && <div className="col-span-full py-40 text-center text-slate-400 italic">هنوز پروفایلی برای شبکه‌سازی ثبت نشده است.</div>}
                </div>
              )}
           </div>
        )}

        {activeTab === 'registrations' && (
           <div className="p-12 w-full space-y-12 h-full overflow-y-auto bg-slate-50/10 custom-scrollbar">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b pb-10 dark:border-slate-800">
                 <div>
                    <h3 className="text-3xl font-black">ثبت‌نام‌های رویدادها</h3>
                    <p className="text-sm text-slate-400 mt-1 font-medium">لیست شرکت‌کنندگان و اطلاعات تماس آن‌ها</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">فیلتر رویداد:</span>
                    <select 
                      value={regFilterEventId} 
                      onChange={e => setRegFilterEventId(e.target.value)}
                      className="bg-white dark:bg-slate-800 p-3 rounded-2xl text-[11px] font-black border-none focus:ring-2 ring-primary-500 outline-none shadow-sm"
                    >
                       <option value="all">همه رویدادها</option>
                       {events.filter(e => e.requiresRegistration).map(e => (
                         <option key={e.id} value={e.id}>{e.title}</option>
                       ))}
                    </select>
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                 <table className="w-full text-right border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                       <tr>
                          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">نام شرکت‌کننده</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">رویداد</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">شماره دانشجویی</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">تماس و ایمیل</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">تاریخ ثبت</th>
                          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">عملیات</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {filteredRegistrations.map(reg => (
                         <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="p-5">
                               <div className="font-black text-sm">{reg.name}</div>
                            </td>
                            <td className="p-5">
                               <div className="text-[10px] font-bold text-primary-600">{reg.eventName}</div>
                            </td>
                            <td className="p-5">
                               <div className="text-[11px] font-mono font-bold text-slate-500">{toPersianDigits(reg.studentId)}</div>
                            </td>
                            <td className="p-5">
                               <div className="space-y-1">
                                  <div className="text-[10px] font-bold">{toPersianDigits(reg.phone)}</div>
                                  <div className="text-[9px] text-slate-400 font-mono">{reg.email}</div>
                               </div>
                            </td>
                            <td className="p-5">
                               <div className="text-[9px] font-bold text-slate-400">{toPersianDigits(reg.date)}</div>
                            </td>
                            <td className="p-5">
                               <button onClick={() => { if(confirm('حذف این ثبت‌نام؟')) deleteRegistration(reg.id); }} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center"><DeleteIcon /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'events' && (
           <div className="p-12 w-full space-y-12 h-full overflow-y-auto bg-slate-50/10 custom-scrollbar">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b pb-10 dark:border-slate-800">
                 <div>
                    <h3 className="text-3xl font-black">مدیریت رویدادها</h3>
                    <p className="text-sm text-slate-400 mt-1 font-medium">برنامه‌ریزی و تقویم اجرایی انجمن</p>
                 </div>
                 <button onClick={() => { setEditingEvent(null); setShowEventForm(true); }} className="bg-primary-600 text-white px-10 py-4.5 rounded-[1.8rem] font-black shadow-xl hover:scale-105 transition-all w-full sm:w-auto">+ رویداد جدید</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {events.map(ev => (
                   <div key={ev.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-2xl transition-all group">
                      <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6">
                        <img src={ev.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-xl text-[10px] font-black text-primary-600 shadow-xl">{toPersianDigits(ev.date)}</div>
                        {ev.requiresRegistration && (
                          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[8px] font-black shadow-xl">📝 ثبت‌نام لازم</div>
                        )}
                      </div>
                      <div className="flex-grow space-y-2 px-2">
                         <h4 className="font-black text-xl group-hover:text-primary-600 transition-colors">{ev.title}</h4>
                         <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">{ev.description}</p>
                      </div>
                      <div className="flex gap-2.5 pt-8 mt-8 border-t dark:border-slate-800">
                        <button onClick={() => {setEditingEvent(ev); setShowEventForm(true);}} className="flex-1 bg-slate-50 dark:bg-slate-800 py-3.5 rounded-2xl text-[11px] font-black hover:bg-primary-50 transition-colors">ویرایش محتوا</button>
                        <button onClick={() => { if(confirm('حذف شود؟')) deleteEvent(ev.id); }} className="bg-red-50 dark:bg-red-950/30 p-3.5 rounded-2xl text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"><DeleteIcon /></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'team' && (
           <div className="p-12 w-full space-y-16 h-full overflow-y-auto bg-slate-50/5 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 shrink-0">
                 <button 
                  onClick={() => { setEditingMember(null); setShowMemberForm({type: 'council', show: true}); }}
                  className="p-8 border-2 border-dashed border-primary-500/50 rounded-[2.5rem] bg-primary-50/30 dark:bg-primary-950/10 flex flex-col items-center justify-center gap-4 hover:bg-primary-500 hover:text-white transition-all group"
                 >
                    <span className="text-3xl group-hover:scale-125 transition-transform">🏛️</span>
                    <span className="font-black text-sm">شورای مرکزی</span>
                 </button>
                 <button 
                  onClick={() => { setEditingMember(null); setShowMemberForm({type: 'active', show: true}); }}
                  className="p-8 border-2 border-dashed border-emerald-500/50 rounded-[2.5rem] bg-emerald-50/30 dark:bg-emerald-950/10 flex flex-col items-center justify-center gap-4 hover:bg-emerald-500 hover:text-white transition-all group"
                 >
                    <span className="text-3xl group-hover:scale-125 transition-transform">👥</span>
                    <span className="font-black text-sm">اعضای فعال</span>
                 </button>
                 <button 
                  onClick={() => { setEditingMember(null); setShowMemberForm({type: 'founding', show: true}); }}
                  className="p-8 border-2 border-dashed border-slate-400/50 rounded-[2.5rem] bg-slate-50/30 dark:bg-slate-900/10 flex flex-col items-center justify-center gap-4 hover:bg-slate-400 hover:text-white transition-all group"
                 >
                    <span className="text-3xl group-hover:scale-125 transition-transform">✨</span>
                    <span className="font-black text-sm">موسسین سایت</span>
                 </button>
                 <button 
                  onClick={() => { setEditingProf({ id: '', name: '', academicRank: '', field: '', bio: '', image: '' }); setShowProfForm(true); }}
                  className="p-8 border-2 border-dashed border-indigo-500/50 rounded-[2.5rem] bg-indigo-50/30 dark:bg-indigo-950/10 flex flex-col items-center justify-center gap-4 hover:bg-indigo-500 hover:text-white transition-all group"
                 >
                    <span className="text-3xl group-hover:scale-125 transition-transform">👨‍🏫</span>
                    <span className="font-black text-sm">افزودن اساتید</span>
                 </button>
              </div>

              {/* Central Council Category */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 border-r-4 border-primary-600 pr-4">
                    <h3 className="text-2xl font-black">شورای مرکزی</h3>
                    <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-600 px-3 py-1 rounded-full text-[10px] font-black">{toPersianDigits(councilMembers.length)} نفر</span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {councilMembers.map(m => {
                      const member = resolveMemberData(m);
                      return (
                        <div key={member.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-primary-100 dark:border-primary-900 shadow-sm relative group">
                           <img src={member.image} className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary-50 dark:border-primary-800 shadow-md mb-4" />
                           <h4 className="font-black text-sm text-center">{member.name}</h4>
                           <p className="text-[10px] text-primary-600 font-bold mt-1 text-center">{member.role}</p>
                           <div className="flex gap-2 mt-6 justify-center">
                              <button onClick={() => {setEditingMember(m); setShowMemberForm({type: 'council', show: true});}} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] hover:bg-slate-200" title="ویرایش">✏️</button>
                              <button onClick={() => deleteMember(member.id, 'council')} className="p-2.5 rounded-xl bg-red-50 text-red-500 text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" title="حذف از لیست"><DeleteIcon /></button>
                           </div>
                        </div>
                      );
                    })}
                    {councilMembers.length === 0 && <div className="col-span-full py-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-3xl">عضوی در این بخش ثبت نشده است.</div>}
                 </div>
              </div>

              {/* Active Members Category */}
              <div className="space-y-6 pt-10 border-t dark:border-slate-800">
                 <div className="flex items-center gap-3 border-r-4 border-emerald-600 pr-4">
                    <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">اعضای فعال</h3>
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">{toPersianDigits(activeMembers.length)} نفر</span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activeMembers.map(m => {
                      const member = resolveMemberData(m);
                      return (
                        <div key={member.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-emerald-100 dark:border-emerald-900 shadow-sm">
                           <img src={member.image} className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-50 dark:border-emerald-800 shadow-md mb-4" />
                           <h4 className="font-black text-sm text-center">{member.name}</h4>
                           <p className="text-[10px] text-emerald-600 font-bold mt-1 text-center">{member.role}</p>
                           <div className="flex gap-2 mt-6 justify-center">
                              <button onClick={() => {setEditingMember(m); setShowMemberForm({type: 'active', show: true});}} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] hover:bg-slate-200">✏️</button>
                              <button onClick={() => deleteMember(member.id, 'active')} className="p-2.5 rounded-xl bg-red-50 text-red-500 text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><DeleteIcon /></button>
                           </div>
                        </div>
                      );
                    })}
                    {activeMembers.length === 0 && <div className="col-span-full py-8 text-center text-slate-400 text-xs italic border border-dashed rounded-3xl">عضوی در این بخش ثبت نشده است.</div>}
                 </div>
              </div>

              {/* Site Founders Category */}
              <div className="space-y-6 pt-10 border-t dark:border-slate-800">
                 <div className="flex items-center gap-3 border-r-4 border-slate-400 pr-4">
                    <h3 className="text-2xl font-black text-slate-700 dark:text-slate-300">موسسین سایت</h3>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black">{toPersianDigits(members.length)} نفر</span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {members.map(m => {
                      const member = resolveMemberData(m);
                      return (
                        <div key={member.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-sm opacity-60">
                           <img src={member.image} className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md mb-4" />
                           <h4 className="font-black text-xs text-center">{member.name}</h4>
                           <p className="text-[9px] text-slate-500 font-bold mt-1 text-center">{member.role}</p>
                           <div className="flex gap-2 mt-6 justify-center">
                              <button onClick={() => {setEditingMember(m); setShowMemberForm({type: 'founding', show: true});}} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[9px] hover:bg-slate-200">✏️</button>
                              <button onClick={() => deleteMember(member.id, 'founding')} className="p-2 rounded-xl bg-red-50 text-red-500 text-[9px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><DeleteIcon /></button>
                           </div>
                        </div>
                      );
                    })}
                    {members.length === 0 && <div className="col-span-full py-8 text-center text-slate-400 text-xs italic border border-dashed rounded-3xl">عضوی در این بخش ثبت نشده است.</div>}
                 </div>
              </div>

              <div className="space-y-10 pt-16 border-t-2 dark:border-slate-800">
                 <div className="flex justify-between items-end border-b pb-6 dark:border-slate-800">
                    <h3 className="text-2xl font-black">اساتید و منابع آموزشی</h3>
                 </div>
                 <div className="space-y-8">
                    {professors.map(prof => (
                       <div key={prof.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md">
                          <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-6">
                             <div className="flex items-center gap-6">
                                <img src={prof.image} className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-xl" />
                                <div>
                                   <h4 className="font-black text-xl">{prof.name}</h4>
                                   <p className="text-xs text-slate-500 font-bold mt-1">{prof.academicRank} - {prof.field}</p>
                                </div>
                             </div>
                             <div className="flex gap-3">
                                <button onClick={() => { setSelectedProfForCourses(prof.id); setShowCourseModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black shadow-lg hover:scale-105 active:scale-95 transition-all">+ درس جدید</button>
                                <button onClick={() => { setEditingProf(prof); setShowProfForm(true); }} className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">✏️</button>
                                <button onClick={() => { if(confirm('حذف استاد؟')) deleteProfessor(prof.id); }} className="p-3 rounded-2xl bg-red-50 text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><DeleteIcon /></button>
                             </div>
                          </div>
                          
                          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                             {courses.filter(c => c.professorId === prof.id).map(course => (
                                <div key={course.id} className="p-8 border border-slate-100 dark:border-slate-800 rounded-[2rem] bg-slate-50/20 shadow-inner">
                                   <div className="flex justify-between items-start mb-6">
                                      <div>
                                         <h5 className="font-black text-lg text-primary-600">{course.title}</h5>
                                         <p className="text-[10px] text-slate-400 mt-1">{course.description || 'بدون توضیحات اضافی'}</p>
                                      </div>
                                      <button onClick={() => deleteCourse(course.id)} className="text-red-400 text-[10px] font-black border border-red-100 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all">حذف درس</button>
                                   </div>
                                   
                                   <div className="grid grid-cols-2 gap-3 mb-6">
                                      <button onClick={() => { setEditingNote(null); setSelectedProfForCourses(prof.id); setSelectedCourseForMedia(course.id); setShowNoteModal(true); setNewNoteForm({title: '', fileUrl: ''}); }} className="p-3 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-[10px] font-black border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm">+ افزودد جزوه</button>
                                      <button onClick={() => { setEditingVideo(null); setSelectedProfForCourses(prof.id); setSelectedCourseForMedia(course.id); setShowVideoModal(true); setNewVideoForm({title:'', description:'', videoUrl:''}); }} className="p-3 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-[10px] font-black border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm">+ افزودن ویدیو</button>
                                   </div>

                                   <div className="space-y-3">
                                      {notes.filter(n => n.courseId === course.id).map(n => (
                                         <div key={n.id} className="flex justify-between items-center text-[11px] p-3 bg-white dark:bg-slate-800 dark:text-white rounded-xl border border-slate-50 dark:border-slate-700 shadow-sm">
                                            <span className="truncate max-w-[200px] font-medium">📄 {n.title}</span>
                                            <div className="flex gap-1">
                                              <button onClick={() => { setEditingNote(n); setSelectedProfForCourses(prof.id); setSelectedCourseForMedia(course.id); setNoteUploadType(n.type); setNewNoteForm({title: n.title, fileUrl: n.fileUrl}); setShowNoteModal(true); }} className="text-primary-500 p-2 hover:bg-primary-50 rounded-lg" title="ویرایش">✏️</button>
                                              <button onClick={() => deleteNote(n.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg">✕</button>
                                            </div>
                                         </div>
                                      ))}
                                      {videos.filter(v => v.courseId === course.id).map(v => (
                                         <div key={v.id} className="flex justify-between items-center text-[11px] p-3 bg-white dark:bg-slate-800 dark:text-white rounded-xl border border-slate-50 dark:border-slate-700 shadow-sm">
                                            <span className="truncate max-w-[150px] font-medium">🎬 {v.title}</span>
                                            <div className="flex gap-1">
                                              <button onClick={() => { setEditingVideo(v); setSelectedProfForCourses(prof.id); setSelectedCourseForMedia(course.id); setVideoUploadType(v.type); setNewVideoForm({title: v.title, description: v.description, videoUrl: v.videoUrl}); setShowVideoModal(true); }} className="text-primary-500 p-2 hover:bg-primary-50 rounded-lg" title="ویرایش">✏️</button>
                                              <button onClick={() => deleteVideo(v.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg">✕</button>
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'documents' && (
           <div className="p-12 w-full space-y-12 h-full overflow-y-auto bg-slate-50/10 custom-scrollbar">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b pb-10 dark:border-slate-800">
                 <div>
                    <h3 className="text-3xl font-black">مدیریت مستندات حوزه‌های تحصیلی</h3>
                    <p className="text-sm text-slate-400 mt-1 font-medium">معرفی شاخه‌ها، نقشه‌راه و متخصصین</p>
                 </div>
                 <button onClick={() => { 
                   setEditingDoc(null); 
                   setNewDocForm({ id: '', title: '', category: 'CS', description: '', icon: '', roadmap: [], experts: [] });
                   setShowDocModal(true); 
                 }} className="bg-primary-600 text-white px-10 py-4.5 rounded-[1.8rem] font-black shadow-xl hover:scale-105 transition-all w-full sm:w-auto">+ حوزه جدید</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {documents.map(doc => (
                   <div key={doc.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-2xl transition-all group">
                      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">
                        {doc.icon || '📄'}
                      </div>
                      <h4 className="font-black text-xl mb-3">{doc.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6">{doc.description}</p>
                      <div className="mt-auto pt-6 border-t dark:border-slate-800 flex gap-2">
                        <button onClick={() => { setEditingDoc(doc); setNewDocForm(doc); setShowDocModal(true); }} className="flex-1 bg-slate-50 dark:bg-slate-800 py-3.5 rounded-2xl text-[11px] font-black">ویرایش</button>
                        <button onClick={() => { if(confirm('حذف شود؟')) deleteDocument(doc.id); }} className="bg-red-50 dark:bg-red-950/30 p-3.5 rounded-2xl text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"><DeleteIcon /></button>
                      </div>
                   </div>
                 ))}
                 {documents.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 italic">هنوز حوزه‌ای ثبت نشده است.</div>}
              </div>
           </div>
        )}
      </div>

      {editingNetworkProfile && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[160] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-lg p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-spring-in overflow-y-auto max-h-[90vh] custom-scrollbar">
              <h3 className="text-2xl font-black">ویرایش پروفایل ارتباطات</h3>
              <form onSubmit={(e) => {
                 e.preventDefault();
                 updateNetworkingProfile(editingNetworkProfile);
                 setEditingNetworkProfile(null);
              }} className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 pr-2">توضیحات معرفی</label>
                    <textarea value={editingNetworkProfile.description} onChange={e => setEditingNetworkProfile({...editingNetworkProfile, description: e.target.value})} className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input value={editingNetworkProfile.phone || ''} onChange={e => setEditingNetworkProfile({...editingNetworkProfile, phone: e.target.value})} placeholder="تلفن" className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm" />
                    <input value={editingNetworkProfile.email || ''} onChange={e => setEditingNetworkProfile({...editingNetworkProfile, email: e.target.value})} placeholder="ایمیل" className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 pr-2">حوزه‌های انتخابی</label>
                    <div className="grid grid-cols-2 gap-2">
                       {csFields.flatMap(g => g.subfields || []).map(sub => (
                         <label key={sub.id} className="flex items-center gap-2 text-[10px] font-bold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <input type="checkbox" checked={editingNetworkProfile.fields.includes(sub.id)} onChange={e => {
                               const newF = e.target.checked ? [...editingNetworkProfile.fields, sub.id] : editingNetworkProfile.fields.filter(f => f !== sub.id);
                               setEditingNetworkProfile({...editingNetworkProfile, fields: newF});
                            }} />
                            {sub.label}
                         </label>
                       ))}
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black">ذخیره تغییرات</button>
                    <button type="button" onClick={() => setEditingNetworkProfile(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black">لغو</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[150] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-md p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-spring-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">افزودن عضو جدید</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:rotate-90 transition-all text-xl">✕</button>
            </div>

            {addUserError && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">
                {addUserError}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">نام و نام خانوادگی</label>
                <input value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} placeholder="مثال: علی محمدی" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">رشته تحصیلی (اختیاری)</label>
                <input value={newUserForm.fieldOfStudy} onChange={e => setNewUserForm({...newUserForm, fieldOfStudy: e.target.value})} placeholder="مثال: علوم کامپیوتر" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 pr-2">مقطع (اختیاری)</label>
                  <select value={newUserForm.degreeLevel} onChange={e => setNewUserForm({...newUserForm, degreeLevel: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner">
                    <option value="">انتخاب مقطع</option>
                    <option value="کارشناسی">کارشناسی</option>
                    <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                    <option value="دکتری">دکتری</option>
                    <option value="فارغ‌التحصیل">فارغ‌التحصیل</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 pr-2">ترم (اختیاری)</label>
                  <select value={newUserForm.semester} onChange={e => setNewUserForm({...newUserForm, semester: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner">
                    <option value="">انتخاب ترم</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n.toString()}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">شماره دانشجویی</label>
                <input value={newUserForm.studentId} onChange={e => setNewUserForm({...newUserForm, studentId: e.target.value})} placeholder="مثال: 40211119004" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">کد ملی (رمز عبور)</label>
                <input value={newUserForm.nationalId} onChange={e => setNewUserForm({...newUserForm, nationalId: e.target.value})} placeholder="کد ۱۰ رقمی بدون خط تیره" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">شماره تماس (اختیاری)</label>
                <input value={newUserForm.phone} onChange={e => setNewUserForm({...newUserForm, phone: e.target.value})} placeholder="۰۹۱۲۳۴۵۶۷۸۹" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">آدرس ایمیل (اختیاری)</label>
                <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} placeholder="example@mail.com" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">ایجاد حساب</button>
                <button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-600 dark:text-slate-400">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing User Modal */}
      {editingUserData && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[150] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-md p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-spring-in">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">ویرایش کاربر</h3>
            <form onSubmit={(e) => { e.preventDefault(); updateUserProfile(editingUserData.id, editingUserData); setEditingUserData(null); }} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">نام و نام خانوادگی</label>
                <input value={editingUserData.name} onChange={e => setEditingUserData({...editingUserData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">رشته تحصیلی (اختیاری)</label>
                <input value={editingUserData.fieldOfStudy || ''} onChange={e => setEditingUserData({...editingUserData, fieldOfStudy: e.target.value})} placeholder="مثال: علوم کامپیوتر" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 pr-2">مقطع (اختیاری)</label>
                  <select value={editingUserData.degreeLevel || ''} onChange={e => setEditingUserData({...editingUserData, degreeLevel: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner">
                    <option value="">انتخاب مقطع</option>
                    <option value="کارشناسی">کارشناسی</option>
                    <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                    <option value="دکتری">دکتری</option>
                    <option value="فارغ‌التحصیل">فارغ‌التحصیل</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 pr-2">ترم (اختیاری)</label>
                  <select value={editingUserData.semester || ''} onChange={e => setEditingUserData({...editingUserData, semester: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner">
                    <option value="">انتخاب ترم</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n.toString()}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">شماره دانشجویی</label>
                <input value={editingUserData.studentId} onChange={e => setEditingUserData({...editingUserData, studentId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">کد ملی</label>
                <input value={editingUserData.nationalId} onChange={e => setEditingUserData({...editingUserData, nationalId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">شماره تماس (اختیاری)</label>
                <input value={editingUserData.phone || ''} onChange={e => setEditingUserData({...editingUserData, phone: e.target.value})} placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-mono shadow-inner" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-2">ایمیل</label>
                <input type="email" value={editingUserData.email || ''} onChange={e => setEditingUserData({...editingUserData, email: e.target.value})} placeholder="example@mail.com" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl">بروزرسانی</button>
                <button type="button" onClick={() => setEditingUserData(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black">لغو</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventForm && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[150] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-xl overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col max-h-[85vh] animate-spring-in">
            <div className="p-10 pb-6 flex justify-between items-center border-b dark:border-slate-800">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{editingEvent ? 'ویرایش رویداد' : 'ایجاد رویداد جدید'}</h3>
              <button onClick={() => setShowEventForm(false)} className="text-slate-400 hover:rotate-90 transition-all text-xl">✕</button>
            </div>
            <div className="flex-grow overflow-y-auto p-10 pt-6 custom-scrollbar">
              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">عنوان کامل رویداد</label>
                  <input name="title_field" defaultValue={editingEvent?.title} placeholder="مثال: کارگاه مهندسی داده" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl border-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">ساعت برگزاری</label>
                    <input name="time_field" defaultValue={editingEvent?.time} placeholder="مثال: ۱۶:۰۰ الی ۱۸:۰۰" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl border-none focus:ring-2 ring-primary-500 font-bold shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">محل برگزاری</label>
                    <input name="loc_field" defaultValue={editingEvent?.location} placeholder="مثال: سالن آمفی‌تئاتر" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl border-none focus:ring-2 ring-primary-500 font-bold shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">لینک اختصاصی رویداد (سایت خارجی/گوگل مپ)</label>
                  <input name="link_field" defaultValue={editingEvent?.externalLink} placeholder="https://example.com/event" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl border-none focus:ring-2 ring-primary-500 font-bold shadow-inner" />
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                   <input 
                    type="checkbox" 
                    id="reg_req" 
                    checked={regRequired} 
                    onChange={e => setRegRequired(e.target.checked)} 
                    className="w-5 h-5 rounded accent-primary-600 cursor-pointer" 
                   />
                   <label htmlFor="reg_req" className="text-xs font-black cursor-pointer">نیاز به ثبت‌نام دارد (فقط برای رویدادهای پیش‌رو)</label>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase pr-2 tracking-widest">انتخاب تاریخ (شمسی)</label>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                    {['d', 'm', 'y'].map((key) => (
                      <div key={key} className="space-y-1 text-center">
                        <span className="text-[9px] text-slate-400 font-bold">{key === 'd' ? 'روز' : key === 'm' ? 'ماه' : 'سال'}</span>
                        <input type="number" value={eventDateParts[key as keyof typeof eventDateParts]} onChange={e => setEventDateParts({...eventDateParts, [key]: e.target.value})} className="w-full bg-white dark:bg-slate-700 dark:text-white p-3 rounded-xl text-center font-mono font-bold" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase pr-2 tracking-widest">تصویر پوستر (لینک یا فایل)</label>
                  <div className="flex gap-4 items-center">
                    <input name="img_field" value={eventImageUrl} onChange={e => setEventImageUrl(e.target.value)} placeholder="لینک تصویر پوستر" className="flex-grow bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl border-none focus:ring-2 ring-primary-500 text-xs shadow-inner" />
                    <label className="bg-primary-600 text-white px-6 py-4 rounded-2xl cursor-pointer font-black text-xs hover:bg-primary-700 shrink-0">آپلود فایل
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'event')} />
                    </label>
                  </div>
                  {eventImageUrl && (
                    <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img src={eventImageUrl} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setEventImageUrl('')} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  )}
                </div>

                {currentCategory === EventCategory.PAST ? (
                  <div className="space-y-4 pt-4 border-t dark:border-slate-800 animate-spring-in">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">پیوست‌های تصویری (فقط برای رویدادهای گذشته)</label>
                      <label className="bg-indigo-600 text-white px-6 py-2 rounded-xl cursor-pointer font-black text-[10px] hover:bg-indigo-700 shadow-md">افزودن عکس
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'gallery')} />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl min-h-[100px]">
                      {eventGallery.map((item, idx) => (
                          <div key={idx} className="relative rounded-xl overflow-hidden group shadow-md border border-white/10 bg-white dark:bg-slate-700 p-2 space-y-2">
                            <img src={item.url} className="w-full aspect-square object-cover rounded-lg" />
                            <input 
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const newGallery = [...eventGallery];
                                newGallery[idx].description = e.target.value;
                                setEventGallery(newGallery);
                              }}
                              placeholder="توضیحات عکس..."
                              className="w-full text-[10px] p-1.5 bg-slate-50 dark:bg-slate-800 rounded border-none outline-none focus:ring-1 ring-primary-500"
                            />
                            <button type="button" onClick={() => setEventGallery(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-[8px]">✕</button>
                          </div>
                      ))}
                      {eventGallery.length === 0 && <div className="col-span-4 flex items-center justify-center text-[10px] text-slate-400 italic py-8">هنوز پیوستی آپلود نشده است.</div>}
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t dark:border-slate-800 text-center">
                    <p className="text-[10px] font-bold text-slate-400 italic">⚠️ پیوست‌های تصویری (گالری) فقط پس از اتمام رویداد و قرار گرفتن در دسته «گذشته» قابل افزودن هستند.</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase pr-2 tracking-widest">توضیحات و جزئیات کامل</label>
                  <textarea name="desc_field" placeholder="برنامه، نحوه برگزاری و جزئیات دیگر..." defaultValue={editingEvent?.description} className="w-full h-40 bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl border-none focus:ring-2 ring-primary-500 leading-relaxed text-sm shadow-inner" required />
                </div>
                <div className="flex gap-4 pt-4 pb-4">
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-5 rounded-3xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">انتشار نهایی</button>
                  <button type="button" onClick={() => setShowEventForm(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-5 rounded-3xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">لغو</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCourseModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[160] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[3rem] shadow-2xl space-y-8 animate-spring-in">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">تعریف درس جدید</h3>
              <div className="space-y-5">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">عنوان درس</label>
                    <input value={newCourseForm.title} onChange={e => setNewCourseForm({...newCourseForm, title: e.target.value})} placeholder="مثال: ساختمان داده" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold" required />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">توضیحات مختصر</label>
                    <textarea value={newCourseForm.description} onChange={e => setNewCourseForm({...newCourseForm, description: e.target.value})} placeholder="دبره سرفصل‌های درس..." className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none h-24 focus:ring-2 ring-primary-500" />
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => { addCourse({ ...newCourseForm, professorId: selectedProfForCourses! } as any); setShowCourseModal(false); setNewCourseForm({title:'', description:''}); }}
                      className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg"
                    >افزودن درس</button>
                    <button onClick={() => setShowCourseModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">لغو</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showMemberForm.show && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[160] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-lg p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-spring-in overflow-y-auto max-h-[90vh] custom-scrollbar">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{editingMember ? 'ویرایش عضو' : 'افزودن عضو جدید'} ({showMemberForm.type === 'founding' ? 'موسس' : showMemberForm.type === 'council' ? 'شورای مرکزی' : 'عضو فعال'})</h3>
              <form 
                key={editingMember?.id || 'new-member-form'} 
                onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as any);
                const data = {
                  name: fd.get('m_name') as string,
                  role: fd.get('m_role') as string,
                  field: fd.get('m_field') as string,
                  term: fd.get('m_term') as string,
                  description: fd.get('m_desc') as string,
                  bio: fd.get('m_bio') as string, 
                  userId: fd.get('m_userId') as string, 
                  image: editingMember?.image || 'https://picsum.photos/200/200'
                };
                if (editingMember) updateMember({ ...editingMember, ...data } as any, showMemberForm.type);
                else addMember(data as any, showMemberForm.type);
                setShowMemberForm({ ...showMemberForm, show: false });
                setEditingMember(null);
              }} className="space-y-6">
                 
                 {/* Member Photo Upload */}
                 <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="relative group shrink-0">
                       <img src={editingMember?.image || "https://www.gravatar.com/avatar/?d=mp"} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl bg-white" />
                       <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2.5rem] cursor-pointer transition-opacity text-white text-[10px] font-bold text-center p-2">
                          <span>📸</span>
                          <span>آپلود تصویر</span>
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'member')} />
                       </label>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 pr-2">اتصال به حساب کاربری (اختیاری)</label>
                      <select name="m_userId" defaultValue={editingMember?.userId} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner">
                        <option value="">بدون اتصال</option>
                        {users.filter(u => u.role === UserRole.STUDENT).map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({toPersianDigits(u.studentId)})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 pr-2">نام و نام خانوادگی</label>
                      <input name="m_name" defaultValue={editingMember?.name} placeholder="نام و نام خانوادگی" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 pr-2">سمت (مثال: دبیر انجمن)</label>
                      <input name="m_role" defaultValue={editingMember?.role} placeholder="سمت" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 pr-2">رشته تحصیلی</label>
                      <input name="m_field" defaultValue={editingMember?.field} placeholder="رشته" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 pr-2">دوره فعالیت (مثال: ۱۴۰۲-۱۴۰۳)</label>
                      <input name="m_term" defaultValue={editingMember?.term} placeholder="دوره" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">توضیحات کوتاه (نمایش در کارت)</label>
                    <textarea name="m_desc" defaultValue={editingMember?.description} placeholder="توضیحات کوتاه..." className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl h-20 outline-none focus:ring-2 ring-primary-500 shadow-inner" />
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">بیوگرافی کامل (نمایش در پروفایل)</label>
                    <textarea name="m_bio" defaultValue={editingMember?.bio} placeholder="بیوگرافی کامل و سوابق..." className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl h-32 outline-none focus:ring-2 ring-primary-500 shadow-inner" />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all">ذخیره اطلاعات عضو</button>
                    <button type="button" onClick={() => { setShowMemberForm({ ...showMemberForm, show: false }); setEditingMember(null); }} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">انصراف</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {showProfForm && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[160] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-lg p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-spring-in overflow-y-auto max-h-[90vh] custom-scrollbar">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{editingProf?.id ? 'ویرایش پروفایل استاد' : 'افزودن استاد جدید'}</h3>
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                const data = {
                  name: (e.currentTarget as any).prof_name.value,
                  academicRank: (e.currentTarget as any).prof_rank.value,
                  field: (e.currentTarget as any).prof_field.value,
                  bio: (e.currentTarget as any).prof_bio.value,
                  image: editingProf?.image || 'https://picsum.photos/200/200'
                };
                if (editingProf?.id) updateProfessor({ ...editingProf, ...data });
                else addProfessor(data as any);
                setShowProfForm(false);
              }} className="space-y-6">
                 {/* Professor Profile Picture Section */}
                 <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="relative group shrink-0">
                       <img src={editingProf?.image || "https://www.gravatar.com/avatar/?d=mp"} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl bg-white" />
                       <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2.5rem] cursor-pointer transition-opacity text-white text-[10px] font-bold text-center p-2">
                          <span>📸</span>
                          <span>آپلود تصویر پروفایل</span>
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'prof')} />
                       </label>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 pr-2">نام و نام خانوادگی استاد</label>
                      <input name="prof_name" defaultValue={editingProf?.name} placeholder="نام استاد" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 pr-2">مرتبه علمی (مثال: دانشیار)</label>
                      <input name="prof_rank" defaultValue={editingProf?.academicRank} placeholder="مرتبه علمی" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">حوزه تخصصی و پژوهشی</label>
                    <input name="prof_field" defaultValue={editingProf?.field} placeholder="حوزه تخصصی" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">بیوگرافی و سوابق تحصیلی</label>
                    <textarea name="prof_bio" defaultValue={editingProf?.bio} placeholder="بیوگرافی کامل..." className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none h-32 focus:ring-2 ring-primary-500 shadow-inner" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">ثبت نهایی اطلاعات استاد</button>
                    <button type="button" onClick={() => setShowProfForm(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">لغو</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[170] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-spring-in">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{editingNote ? 'ویرایش جزوه' : 'افزودن جزوه جدید'}</h3>
              <div className="space-y-5">
                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                    <button onClick={() => setNoteUploadType(MaterialType.LINK)} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${noteUploadType === MaterialType.LINK ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}>🔗 لینک</button>
                    <button onClick={() => setNoteUploadType(MaterialType.FILE)} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${noteUploadType === MaterialType.FILE ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}>📄 فایل</button>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">عنوان جزوه</label>
                    <input value={newNoteForm.title} onChange={e => setNewNoteForm({...newNoteForm, title: e.target.value})} placeholder="ساختمان داده - فصل اول" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 pr-2">{noteUploadType === MaterialType.LINK ? 'لینک مستقیم' : 'انتخاب فایل'}</label>
                    {noteUploadType === MaterialType.LINK ? (
                      <input value={newNoteForm.fileUrl} onChange={e => setNewNoteForm({...newNoteForm, fileUrl: e.target.value})} placeholder="https://drive.google.com/..." className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner" />
                    ) : (
                      <div className="space-y-2">
                        {editingNote && editingNote.type === MaterialType.FILE && (
                           <div className="text-[9px] text-slate-400 px-2 italic">فایل فعلی موجود است. برای تغییر فایل جدید انتخاب کنید.</div>
                        )}
                        <input type="file" onChange={e => handleImageUpload(e, 'note')} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs" />
                      </div>
                    )}
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => {
                        if (!newNoteForm.title || !newNoteForm.fileUrl) { alert('لطفا همه فیلدها را پر کنید'); return; }
                        const noteData = {
                          id: editingNote?.id || Date.now().toString(),
                          title: newNoteForm.title,
                          fileUrl: newNoteForm.fileUrl,
                          type: noteUploadType,
                          professorId: selectedProfForCourses!,
                          courseId: selectedCourseForMedia!,
                          uploaderId: editingNote?.uploaderId || currentUser.id,
                          status: editingNote?.status || ApprovalStatus.APPROVED,
                          date: editingNote?.date || getCurrentShamsiDate()
                        };
                        if (editingNote) updateNote(noteData as any);
                        else addNote(noteData as any);
                        setShowNoteModal(false);
                        setNewNoteForm({title: '', fileUrl: ''});
                        setEditingNote(null);
                      }}
                      className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg"
                    >{editingNote ? 'بروزرسانی' : 'ثبت نهایی'}</button>
                    <button onClick={() => { setShowNoteModal(false); setEditingNote(null); }} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black">لغو</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[170] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-md p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-spring-in">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{editingVideo ? 'ویرایش ویدیو' : 'افزودن ویدیو جدید'}</h3>
              <div className="space-y-4">
                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                    <button onClick={() => setVideoUploadType(MaterialType.LINK)} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${videoUploadType === MaterialType.LINK ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}>🔗 لینک</button>
                    <button onClick={() => setVideoUploadType(MaterialType.FILE)} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${videoUploadType === MaterialType.FILE ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}>🎥 فایل</button>
                 </div>
                 <input value={newVideoForm.title} onChange={e => setNewVideoForm({...newVideoForm, title: e.target.value})} placeholder="عنوان ویدیو" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                 <textarea value={newVideoForm.description} onChange={e => setNewVideoForm({...newVideoForm, description: e.target.value})} placeholder="توضیحات کوتاه..." className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none h-20 focus:ring-2 ring-primary-500 shadow-inner" />
                 
                 {videoUploadType === MaterialType.LINK ? (
                   <input value={newVideoForm.videoUrl} onChange={e => setNewVideoForm({...newVideoForm, videoUrl: e.target.value})} placeholder="لینک ویدیو (YouTube, آپارات و ...)" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 shadow-inner" />
                 ) : (
                   <div className="space-y-2">
                     {editingVideo && editingVideo.type === MaterialType.FILE && (
                        <div className="text-[9px] text-slate-400 px-2 italic">ویدیو فعلی موجود است. برای تغییر فایل جدید انتخاب کنید.</div>
                     )}
                     <input type="file" onChange={e => handleImageUpload(e, 'video')} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs" accept="video/*" />
                   </div>
                 )}

                 <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => {
                        if (!newVideoForm.title || !newVideoForm.videoUrl) { alert('لطفا همه فیلدها را پر کنید'); return; }
                        const videoData = {
                          id: editingVideo?.id || Date.now().toString(),
                          title: newVideoForm.title,
                          description: newVideoForm.description,
                          videoUrl: newVideoForm.videoUrl,
                          type: videoUploadType,
                          professorId: selectedProfForCourses!,
                          courseId: selectedCourseForMedia!,
                          uploaderId: editingVideo?.uploaderId || currentUser.id,
                          status: editingVideo?.status || ApprovalStatus.APPROVED,
                          date: editingVideo?.date || getCurrentShamsiDate()
                        };
                        if (editingVideo) updateVideo(videoData as any);
                        else addVideo(videoData as any);
                        setShowVideoModal(false);
                        setNewVideoForm({title:'', description:'', videoUrl:''});
                        setEditingVideo(null);
                      }}
                      className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg"
                    >{editingVideo ? 'بروزرسانی' : 'ثبت نهایی'}</button>
                    <button onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black">لغو</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showDocModal && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/40 backdrop-blur-xl z-[160] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-spring-in border border-white/10">
             <div className="px-10 py-8 flex justify-between items-center border-b dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-2xl">
                    {newDocForm.icon || '📄'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{editingDoc ? 'ویرایش حوزه تحصیلی' : 'ایجاد حوزه جدید'}</h3>
                    <p className="text-[10px] font-black text-primary-600 tracking-widest">مستندات و نقشه‌راه یادگیری</p>
                  </div>
                </div>
                <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:rotate-90 transition-all text-xl p-2 bg-slate-50 dark:bg-slate-800 rounded-full">✕</button>
             </div>
             
             <div className="flex-grow overflow-y-auto custom-scrollbar p-10">
               <form id="doc-form" onSubmit={(e) => {
                 e.preventDefault();
                 if (editingDoc) updateDocument(newDocForm);
                 else addDocument(newDocForm);
                 setShowDocModal(false);
               }} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">عنوان کامل حوزه</label>
                      <input value={newDocForm.title} onChange={e => setNewDocForm({...newDocForm, title: e.target.value})} placeholder="مثال: مهندسی نرم‌افزار" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">دسته‌بندی کلی</label>
                      <select value={newDocForm.category} onChange={e => setNewDocForm({...newDocForm, category: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl outline-none focus:ring-2 ring-primary-500 font-bold shadow-inner">
                         <option value="CS">علوم کامپیوتر</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">آیکون شاخص (ایموجی)</label>
                    <input value={newDocForm.icon} onChange={e => setNewDocForm({...newDocForm, icon: e.target.value})} placeholder="مثال: 🤖" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl outline-none focus:ring-2 ring-primary-500 text-center text-2xl shadow-inner" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">توضیحات و معرفی حوزه</label>
                    <textarea value={newDocForm.description} onChange={e => setNewDocForm({...newDocForm, description: e.target.value})} placeholder="توضیح دهید که این حوزه شامل چه مباحثی است..." className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-5 rounded-2xl outline-none h-40 focus:ring-2 ring-primary-500 leading-relaxed text-sm shadow-inner" required />
                  </div>

                  <div className="space-y-6 pt-8 border-t dark:border-slate-800">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <h4 className="font-black text-sm flex items-center gap-2">
                        <span className="text-primary-600">📍</span>
                        مراحل نقشه راه (Roadmap)
                      </h4>
                      <button type="button" onClick={() => setNewDocForm({...newDocForm, roadmap: [...newDocForm.roadmap, {title: '', description: ''}]})} className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-lg hover:scale-105 transition-all">+ مرحله جدید</button>
                    </div>
                    <div className="space-y-6">
                      {newDocForm.roadmap.map((step, idx) => (
                        <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] space-y-4 relative border border-slate-100 dark:border-slate-700 group hover:border-primary-500/30 transition-all shadow-sm">
                           <button type="button" onClick={() => {
                             const newR = [...newDocForm.roadmap];
                             newR.splice(idx, 1);
                             setNewDocForm({...newDocForm, roadmap: newR});
                           }} className="absolute top-6 left-6 text-red-500 bg-red-50 dark:bg-red-950/30 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">حذف</button>
                           
                           <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-black text-xs">{toPersianDigits(idx + 1)}</span>
                              <input value={step.title} onChange={e => {
                                const newR = [...newDocForm.roadmap];
                                newR[idx].title = e.target.value;
                                setNewDocForm({...newDocForm, roadmap: newR});
                              }} placeholder="عنوان مرحله یادگیری" className="flex-grow bg-white dark:bg-slate-700 p-4 rounded-xl outline-none text-xs font-bold border-none shadow-sm focus:ring-1 ring-primary-500" />
                           </div>
                           <textarea value={step.description} onChange={e => {
                             const newR = [...newDocForm.roadmap];
                             newR[idx].description = e.target.value;
                             setNewDocForm({...newDocForm, roadmap: newR});
                           }} placeholder="توضیحات و منابع پیشنهادی این مرحله..." className="w-full bg-white dark:bg-slate-700 p-4 rounded-xl outline-none h-24 text-xs leading-relaxed border-none shadow-sm focus:ring-1 ring-primary-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-8 border-t dark:border-slate-800">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <h4 className="font-black text-sm flex items-center gap-2">
                        <span className="text-indigo-600">✨</span>
                        خبرگان و فعالین این حوزه
                      </h4>
                      <button type="button" onClick={() => setNewDocForm({...newDocForm, experts: [...newDocForm.experts, {id: Math.random().toString(36).substr(2, 9), name: '', role: '', image: '', description: '', field: '', userId: ''}]})} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-lg hover:scale-105 transition-all">+ متخصص جدید</button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {newDocForm.experts.map((expert, idx) => (
                        <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] space-y-6 relative border border-slate-100 dark:border-slate-700 group hover:border-indigo-500/30 transition-all shadow-sm">
                           <button type="button" onClick={() => {
                             const newE = [...newDocForm.experts];
                             newE.splice(idx, 1);
                             setNewDocForm({...newDocForm, experts: newE});
                           }} className="absolute top-6 left-6 text-red-500 bg-red-50 dark:bg-red-950/30 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">حذف</button>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="flex items-center gap-6">
                                <div className="relative group/img shrink-0">
                                  <img src={expert.image || "https://www.gravatar.com/avatar/?d=mp"} className="w-20 h-20 rounded-[1.5rem] object-cover border-2 border-white dark:border-slate-600 shadow-md" />
                                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-[8px] text-white opacity-0 group-hover/img:opacity-100 cursor-pointer rounded-[1.5rem] transition-all">
                                    <span>📸</span>
                                    <span>تغییر عکس</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'expertImg', idx)} />
                                  </label>
                                </div>
                                <div className="flex-grow space-y-3">
                                   <input value={expert.name} onChange={e => {
                                     const newE = [...newDocForm.experts];
                                     newE[idx].name = e.target.value;
                                     setNewDocForm({...newDocForm, experts: newE});
                                   }} placeholder="نام و نام خانوادگی متخصص" className="w-full bg-white dark:bg-slate-700 p-3 rounded-xl outline-none text-xs font-bold shadow-sm" />
                                   <input value={expert.role} onChange={e => {
                                     const newE = [...newDocForm.experts];
                                     newE[idx].role = e.target.value;
                                     setNewDocForm({...newDocForm, experts: newE});
                                   }} placeholder="سمت یا تخصص (مثال: محقق ارشد)" className="w-full bg-white dark:bg-slate-700 p-3 rounded-xl outline-none text-xs shadow-sm" />
                                </div>
                              </div>
                              <div className="space-y-3">
                                 <input value={expert.field} onChange={e => {
                                   const newE = [...newDocForm.experts];
                                   newE[idx].field = e.target.value;
                                   setNewDocForm({...newDocForm, experts: newE});
                                 }} placeholder="رشته یا گرایش تحصیلی" className="w-full bg-white dark:bg-slate-700 p-3 rounded-xl outline-none text-xs shadow-sm" />
                                 <select value={expert.userId} onChange={e => {
                                   const newE = [...newDocForm.experts];
                                   newE[idx].userId = e.target.value;
                                   setNewDocForm({...newDocForm, experts: newE});
                                 }} className="w-full bg-white dark:bg-slate-700 p-3 rounded-xl outline-none text-xs font-bold shadow-sm">
                                   <option value="">اتصال به حساب کاربری دانشجویی (اختیاری)</option>
                                   {users.filter(u => u.role === UserRole.STUDENT).map(u => (
                                     <option key={u.id} value={u.id}>{u.name} ({toPersianDigits(u.studentId)})</option>
                                   ))}
                                 </select>
                              </div>
                           </div>
                           <textarea value={expert.description} onChange={e => {
                             const newE = [...newDocForm.experts];
                             newE[idx].description = e.target.value;
                             setNewDocForm({...newDocForm, experts: newE});
                           }} placeholder="بیوگرافی کوتاه و نحوه کمک به دیگران در این حوزه..." className="w-full bg-white dark:bg-slate-700 p-4 rounded-xl outline-none h-24 text-xs leading-relaxed shadow-sm" />
                        </div>
                      ))}
                    </div>
                  </div>
               </form>
             </div>

             <div className="p-10 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md flex gap-4 shrink-0">
                <button type="submit" form="doc-form" className="flex-1 bg-primary-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">ذخیره و انتشار نهایی</button>
                <button type="button" onClick={() => setShowDocModal(false)} className="flex-1 bg-slate-200 dark:bg-slate-800 py-5 rounded-3xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-300 transition-colors">انصراف و بستن</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;