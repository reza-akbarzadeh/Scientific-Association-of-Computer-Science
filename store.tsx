import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Member, Professor, Course, LectureNote, EducationalVideo, AppEvent, UserRole, ApprovalStatus, UserMessage, MaterialType, EventCategory, DocumentArea, EventRegistration, NetworkingProfile, CSField } from './types';
import { MOCK_DATA, ADMIN_CREDENTIALS, getCurrentShamsiDate, toEnglishDigits, CS_FIELDS as INITIAL_FIELDS } from './constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  members: Member[];
  councilMembers: Member[];
  activeMembers: Member[];
  professors: Professor[];
  courses: Course[];
  notes: LectureNote[];
  videos: EducationalVideo[];
  events: AppEvent[];
  documents: DocumentArea[];
  registrations: EventRegistration[];
  networkingProfiles: NetworkingProfile[];
  csFields: CSField[];
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  registerStudent: (userData: Partial<User>) => string | null;
  manuallyAddUser: (userData: Partial<User>) => string | null;
  deleteUser: (userId: string) => void;
  approveUser: (userId: string) => void;
  sendMessage: (senderId: string, receiverId: string, text: string) => void;
  markMessagesAsRead: (userId: string, readerId: string) => void;
  
  addEvent: (event: AppEvent) => void;
  updateEvent: (event: AppEvent) => void;
  deleteEvent: (eventId: string) => void;
  
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  addNote: (note: LectureNote) => void;
  updateNote: (note: LectureNote) => void;
  deleteNote: (noteId: string) => void;
  approveNote: (noteId: string) => void;

  addVideo: (video: EducationalVideo) => void;
  updateVideo: (video: EducationalVideo) => void;
  deleteVideo: (videoId: string) => void;
  
  addMember: (member: Member, type: 'founding' | 'council' | 'active') => void;
  updateMember: (member: Member, type: 'founding' | 'council' | 'active') => void;
  deleteMember: (id: string, type: 'founding' | 'council' | 'active') => void;
  
  addProfessor: (prof: Professor) => void;
  updateProfessor: (prof: Professor) => void;
  deleteProfessor: (id: string) => void;

  addDocument: (doc: DocumentArea) => void;
  updateDocument: (doc: DocumentArea) => void;
  deleteDocument: (docId: string) => void;

  addRegistration: (reg: Omit<EventRegistration, 'id' | 'date'>) => void;
  deleteRegistration: (regId: string) => void;
  
  addNetworkingProfile: (profile: Omit<NetworkingProfile, 'id' | 'status' | 'date'>) => void;
  updateNetworkingProfile: (profile: NetworkingProfile) => void;
  deleteNetworkingProfile: (profileId: string) => void;
  approveNetworkingProfile: (profileId: string) => void;
  
  updateCsFields: (fields: CSField[]) => void;

  toggleTheme: () => void;
  isDarkMode: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_ID = 'admin-default-id';
const INITIAL_ADMIN: User = {
  id: ADMIN_ID,
  name: 'مدیر کل انجمن',
  studentId: ADMIN_CREDENTIALS.username,
  nationalId: ADMIN_CREDENTIALS.password,
  role: UserRole.ADMIN,
  email: 'admin@cs.scientific-assoc.ir',
  status: ApprovalStatus.APPROVED,
  profilePicture: 'https://picsum.photos/100/100?seed=admin',
  messages: []
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [INITIAL_ADMIN];
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('members');
    return saved ? JSON.parse(saved) : MOCK_DATA.foundingMembers;
  });

  const [councilMembers, setCouncilMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('councilMembers');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeMembers, setActiveMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('activeMembers');
    return saved ? JSON.parse(saved) : [];
  });

  const [professors, setProfessors] = useState<Professor[]>(() => {
    const saved = localStorage.getItem('professors');
    return saved ? JSON.parse(saved) : MOCK_DATA.professors;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : [
      { id: 'c1', title: 'ساختمان‌های گسسته', professorId: 'p1', description: 'مبانی منطق، مجموعه‌ها و گراف‌ها' }
    ];
  });

  const [notes, setNotes] = useState<LectureNote[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [videos, setVideos] = useState<EducationalVideo[]>(() => {
    const saved = localStorage.getItem('videos');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<AppEvent[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : MOCK_DATA.events;
  });

  const [documents, setDocuments] = useState<DocumentArea[]>(() => {
    const saved = localStorage.getItem('documents');
    return saved ? JSON.parse(saved) : [];
  });

  const [registrations, setRegistrations] = useState<EventRegistration[]>(() => {
    const saved = localStorage.getItem('registrations');
    return saved ? JSON.parse(saved) : [];
  });

  const [networkingProfiles, setNetworkingProfiles] = useState<NetworkingProfile[]>(() => {
    const saved = localStorage.getItem('networkingProfiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [csFields, setCsFields] = useState<CSField[]>(() => {
    const saved = localStorage.getItem('csFields');
    return saved ? JSON.parse(saved) : INITIAL_FIELDS;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const autoCategorizeEvents = useCallback((rawEvents: AppEvent[]) => {
    const todayStr = getCurrentShamsiDate();
    return rawEvents.map(ev => {
      const parts = toEnglishDigits(ev.date).replace(/-/g, '/').split('/');
      if (parts.length !== 3) return ev;
      const normalizedDate = `${parts[0]}/${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}`;
      let newCategory;
      if (normalizedDate === todayStr) {
        newCategory = EventCategory.ONGOING;
      } else if (normalizedDate > todayStr) {
        newCategory = EventCategory.UPCOMING;
      } else {
        newCategory = EventCategory.PAST;
      }
      return { ...ev, category: newCategory };
    });
  }, []);

  useEffect(() => {
    const updated = autoCategorizeEvents(events);
    if (JSON.stringify(updated) !== JSON.stringify(events)) {
      setEvents(updated);
    }
  }, [events, autoCategorizeEvents]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem('councilMembers', JSON.stringify(councilMembers));
    localStorage.setItem('activeMembers', JSON.stringify(activeMembers));
    localStorage.setItem('professors', JSON.stringify(professors));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('videos', JSON.stringify(videos));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('documents', JSON.stringify(documents));
    localStorage.setItem('registrations', JSON.stringify(registrations));
    localStorage.setItem('networkingProfiles', JSON.stringify(networkingProfiles));
    localStorage.setItem('csFields', JSON.stringify(csFields));
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentUser, users, members, councilMembers, activeMembers, professors, courses, notes, videos, events, documents, registrations, networkingProfiles, csFields, isDarkMode]);

  useEffect(() => {
    setUsers(prev => {
      if (!prev.some(u => u.id === ADMIN_ID)) {
        return [...prev, INITIAL_ADMIN];
      }
      return prev;
    });
  }, []);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

  const checkDuplicate = useCallback((studentId: string, nationalId: string, excludeId?: string) => {
    const duplicateStudentId = users.some(u => u.id !== excludeId && u.studentId === studentId);
    if (duplicateStudentId) return 'این شماره دانشجویی قبلاً ثبت شده است.';
    
    const duplicateNationalId = users.some(u => u.id !== excludeId && u.nationalId === nationalId);
    if (duplicateNationalId) return 'این کد ملی (رمز عبور) قبلاً برای کاربر دیگری ثبت شده است.';
    
    return null;
  }, [users]);

  const registerStudent = useCallback((userData: Partial<User>) => {
    const error = checkDuplicate(userData.studentId || '', userData.nationalId || '');
    if (error) return error;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: userData.studentId || '',
      nationalId: userData.nationalId || '',
      email: userData.email || '',
      phone: userData.phone || '',
      name: userData.name || '',
      role: UserRole.STUDENT,
      status: ApprovalStatus.PENDING,
      profilePicture: userData.profilePicture || `https://picsum.photos/100/100?u=${userData.studentId}`,
      messages: [],
      fieldOfStudy: userData.fieldOfStudy || '',
      semester: userData.semester || '',
      degreeLevel: userData.degreeLevel || ''
    };
    setUsers(prev => [...prev, newUser]);
    return null;
  }, [checkDuplicate]);

  const manuallyAddUser = useCallback((userData: Partial<User>) => {
    const error = checkDuplicate(userData.studentId || '', userData.nationalId || '');
    if (error) return error;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: userData.studentId || '',
      nationalId: userData.nationalId || '',
      email: userData.email || '',
      phone: userData.phone || '',
      name: userData.name || '',
      role: UserRole.STUDENT,
      status: ApprovalStatus.APPROVED,
      profilePicture: userData.profilePicture || `https://picsum.photos/100/100?u=${userData.studentId}`,
      messages: [],
      fieldOfStudy: userData.fieldOfStudy || '',
      semester: userData.semester || '',
      degreeLevel: userData.degreeLevel || ''
    };
    setUsers(prev => [...prev, newUser]);
    return null;
  }, [checkDuplicate]);

  const deleteUser = useCallback((userId: string) => {
    if (userId === ADMIN_ID) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const approveUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: ApprovalStatus.APPROVED } : u));
  }, []);

  const updateUserProfile = useCallback((userId: string, data: Partial<User>) => {
    if (data.studentId || data.nationalId) {
      const currentUserData = users.find(u => u.id === userId);
      const error = checkDuplicate(
        data.studentId || currentUserData?.studentId || '', 
        data.nationalId || currentUserData?.nationalId || '',
        userId
      );
      if (error) {
        alert(error);
        return;
      }
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    setCurrentUser(prev => prev?.id === userId ? { ...prev, ...data } : prev);
  }, [users, checkDuplicate]);

  const sendMessage = useCallback((senderId: string, receiverId: string, text: string) => {
    const newMessage: UserMessage = {
      id: Date.now().toString(),
      text,
      date: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('fa-IR'),
      senderId,
      senderName: '',
      receiverId,
      isRead: false
    };

    setUsers(prevUsers => {
      const sender = prevUsers.find(u => u.id === senderId);
      newMessage.senderName = sender?.name || 'ناشناس';
      return prevUsers.map(u => {
        if (u.id === receiverId || u.id === senderId) {
          return { ...u, messages: [...(u.messages || []), newMessage] };
        }
        return u;
      });
    });

    setCurrentUser(prev => {
        if (prev?.id === receiverId || prev?.id === senderId) {
            return { ...prev, messages: [...(prev.messages || []), newMessage] };
        }
        return prev;
    });
  }, []);

  const markMessagesAsRead = useCallback((userId: string, readerId: string) => {
    setUsers(prevUsers => {
      const targetUser = prevUsers.find(u => u.id === userId);
      if (!targetUser) return prevUsers;
      
      const hasUnread = (targetUser.messages || []).some(m => !m.isRead && m.receiverId === readerId);
      if (!hasUnread) return prevUsers;

      return prevUsers.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            messages: (u.messages || []).map(m => 
              m.receiverId === readerId ? { ...m, isRead: true } : m
            )
          };
        }
        return u;
      });
    });

    setCurrentUser(prev => {
        if (prev?.id === userId) {
            const hasUnread = (prev.messages || []).some(m => !m.isRead && m.receiverId === readerId);
            if (!hasUnread) return prev;
            return {
                ...prev,
                messages: (prev.messages || []).map(m => 
                  m.receiverId === readerId ? { ...m, isRead: true } : m
                )
            };
        }
        return prev;
    });
  }, []);

  const addEvent = useCallback((event: AppEvent) => {
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents(prev => autoCategorizeEvents([...prev, newEvent]));
  }, [autoCategorizeEvents]);

  const updateEvent = useCallback((event: AppEvent) => {
    setEvents(prev => autoCategorizeEvents(prev.map(e => e.id === event.id ? event : e)));
  }, [autoCategorizeEvents]);

  const deleteEvent = useCallback((eventId: string) => setEvents(prev => prev.filter(e => e.id !== eventId)), []);

  const addCourse = useCallback((course: Course) => setCourses(prev => [...prev, { ...course, id: Date.now().toString() }]), []);
  const deleteCourse = useCallback((courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setNotes(prev => prev.filter(n => n.courseId !== courseId));
    setVideos(prev => prev.filter(v => v.courseId !== courseId));
  }, []);

  const addNote = useCallback((note: LectureNote) => setNotes(prev => [...prev, { ...note, id: Date.now().toString() }]), []);
  const updateNote = useCallback((note: LectureNote) => setNotes(prev => prev.map(n => n.id === note.id ? note : n)), []);
  const deleteNote = useCallback((noteId: string) => setNotes(prev => prev.filter(n => n.id !== noteId)), []);
  const approveNote = useCallback((noteId: string) => setNotes(prev => prev.map(n => n.id === noteId ? { ...n, status: ApprovalStatus.APPROVED } : n)), []);

  const addVideo = useCallback((video: EducationalVideo) => setVideos(prev => [...prev, { ...video, id: Date.now().toString() }]), []);
  const updateVideo = useCallback((video: EducationalVideo) => setVideos(prev => prev.map(v => v.id === video.id ? video : v)), []);
  const deleteVideo = useCallback((videoId: string) => setVideos(prev => prev.filter(v => v.id !== videoId)), []);

  const addMember = useCallback((member: Member, type: 'founding' | 'council' | 'active') => {
    const newMember = { ...member, id: Date.now().toString() };
    if (type === 'founding') setMembers(prev => [...prev, newMember]);
    else if (type === 'council') setCouncilMembers(prev => [...prev, newMember]);
    else setActiveMembers(prev => [...prev, newMember]);
  }, []);

  const updateMember = useCallback((member: Member, type: 'founding' | 'council' | 'active') => {
    if (type === 'founding') setMembers(prev => prev.map(m => m.id === member.id ? member : m));
    else if (type === 'council') setCouncilMembers(prev => prev.map(m => m.id === member.id ? member : m));
    else setActiveMembers(prev => prev.map(m => m.id === member.id ? member : m));
  }, []);

  const deleteMember = useCallback((id: string, type: 'founding' | 'council' | 'active') => {
    if (type === 'founding') setMembers(prev => prev.filter(m => m.id !== id));
    else if (type === 'council') setCouncilMembers(prev => prev.filter(m => m.id !== id));
    else setActiveMembers(prev => prev.filter(m => m.id !== id));
  }, []);

  const addProfessor = useCallback((prof: Professor) => setProfessors(prev => [...prev, { ...prof, id: Date.now().toString() }]), []);
  const updateProfessor = useCallback((prof: Professor) => setProfessors(prev => prev.map(p => p.id === prof.id ? prof : p)), []);
  const deleteProfessor = useCallback((id: string) => {
    setProfessors(prev => prev.filter(p => p.id !== id));
    setCourses(prev => prev.filter(c => c.professorId !== id));
  }, []);

  const addDocument = useCallback((doc: DocumentArea) => setDocuments(prev => [...prev, { ...doc, id: Date.now().toString() }]), []);
  const updateDocument = useCallback((doc: DocumentArea) => setDocuments(prev => prev.map(d => d.id === doc.id ? doc : d)), []);
  const deleteDocument = useCallback((docId: string) => setDocuments(prev => prev.filter(d => d.id !== docId)), []);

  const addRegistration = useCallback((reg: Omit<EventRegistration, 'id' | 'date'>) => {
    const newReg: EventRegistration = {
      ...reg,
      id: Date.now().toString(),
      date: getCurrentShamsiDate() + ' ' + new Date().toLocaleTimeString('fa-IR')
    };
    setRegistrations(prev => [...prev, newReg]);
  }, []);

  const deleteRegistration = useCallback((regId: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== regId));
  }, []);

  const addNetworkingProfile = useCallback((profile: Omit<NetworkingProfile, 'id' | 'status' | 'date'>) => {
    const newProfile: NetworkingProfile = {
      ...profile,
      id: Date.now().toString(),
      status: ApprovalStatus.PENDING,
      date: getCurrentShamsiDate()
    };
    setNetworkingProfiles(prev => [...prev.filter(p => p.userId !== profile.userId), newProfile]);
  }, []);

  const updateNetworkingProfile = useCallback((profile: NetworkingProfile) => {
    setNetworkingProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
  }, []);

  const deleteNetworkingProfile = useCallback((profileId: string) => {
    setNetworkingProfiles(prev => prev.filter(p => p.id !== profileId));
  }, []);

  const approveNetworkingProfile = useCallback((profileId: string) => {
    setNetworkingProfiles(prev => prev.map(p => p.id === profileId ? { ...p, status: ApprovalStatus.APPROVED } : p));
  }, []);

  const updateCsFields = useCallback((fields: CSField[]) => {
    setCsFields(fields);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser, users, members, councilMembers, activeMembers, professors, courses, notes, videos, events, documents, registrations, networkingProfiles, csFields,
    setCurrentUser, updateUserProfile, registerStudent, manuallyAddUser, deleteUser, approveUser, sendMessage, markMessagesAsRead,
    addEvent, updateEvent, deleteEvent, addCourse, deleteCourse, addNote, updateNote, deleteNote, approveNote, 
    addVideo, updateVideo, deleteVideo,
    addMember, updateMember, deleteMember, addProfessor, updateProfessor, deleteProfessor,
    addDocument, updateDocument, deleteDocument,
    addRegistration, deleteRegistration,
    addNetworkingProfile, updateNetworkingProfile, deleteNetworkingProfile, approveNetworkingProfile,
    updateCsFields,
    toggleTheme, isDarkMode
  }), [currentUser, users, members, councilMembers, activeMembers, professors, courses, notes, videos, events, documents, registrations, networkingProfiles, csFields, isDarkMode, 
       setCurrentUser, updateUserProfile, registerStudent, manuallyAddUser, deleteUser, approveUser, sendMessage, markMessagesAsRead,
       addEvent, updateEvent, deleteEvent, addCourse, deleteCourse, addNote, updateNote, deleteNote, approveNote, 
       addVideo, updateVideo, deleteVideo,
       addMember, updateMember, deleteMember, addProfessor, updateProfessor, deleteProfessor,
       addDocument, updateDocument, deleteDocument,
       addRegistration, deleteRegistration,
       addNetworkingProfile, updateNetworkingProfile, deleteNetworkingProfile, approveNetworkingProfile,
       updateCsFields,
       toggleTheme]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};