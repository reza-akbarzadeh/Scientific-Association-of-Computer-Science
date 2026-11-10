import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store.tsx';
import { UI_STRINGS } from './constants.ts';
import { UserRole } from './types.ts';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Activists from './pages/Activists.tsx';
import ActivistDetails from './pages/ActivistDetails.tsx';
import Education from './pages/Education.tsx';
import Events from './pages/Events.tsx';
import EventDetails from './pages/EventDetails.tsx';
import EventGallery from './pages/EventGallery.tsx';
import Documents from './pages/Documents.tsx';
import DocumentDetails from './pages/DocumentDetails.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Profile from './pages/Profile.tsx';
import ChatCenter from './pages/ChatCenter.tsx';
import NetworkingSubmit from './pages/NetworkingSubmit.tsx';
import NetworkingDetails from './pages/NetworkingDetails.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser, toggleTheme, isDarkMode, users } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: UI_STRINGS.home, path: '/' },
    { name: UI_STRINGS.about, path: '/about' },
    { name: UI_STRINGS.activists, path: '/activists' },
    { name: UI_STRINGS.education, path: '/education' },
    { name: UI_STRINGS.events, path: '/events' },
    { name: UI_STRINGS.documents, path: '/documents' },
  ];

  const freshUser = users.find(u => u.id === currentUser?.id);
  const unreadCount = freshUser?.messages?.filter(m => !m.isRead && m.receiverId === currentUser?.id).length || 0;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform">
                CS
              </div>
              <span className="font-bold text-xl hidden md:block text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                {UI_STRINGS.appName}
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 group transition-all"
                >
                  {link.name}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center shadow-[0_0_8px_rgba(2,132,199,0.5)]"></span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="group p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all shadow-none hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
              title="تغییر حالت تم"
            >
              <div className="transition-transform duration-500 group-hover:rotate-[30deg] group-active:scale-90 text-xl">
                {isDarkMode ? '🌞' : '🌙'}
              </div>
            </button>
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-3">
                  {currentUser?.role === UserRole.ADMIN && (
                    <Link
                      to="/admin"
                      className="relative px-4 py-2 text-sm font-bold text-primary-600 hover:text-primary-700 group transition-all"
                    >
                      🛠️ {UI_STRINGS.adminPanel}
                      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center shadow-[0_0_8px_rgba(2,132,199,0.5)]"></span>
                    </Link>
                  )}
                  <Link to="/messages" className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:shadow-sm group/msg" title="پیام‌ها">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover/msg:scale-110 group-hover/msg:rotate-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-black border-2 border-white dark:border-slate-900 animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 hover:scale-105 transition-all group">
                     <img src={currentUser.profilePicture || "https://www.gravatar.com/avatar/?d=mp"} alt="Profile" className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 object-cover group-hover:border-primary-500 transition-colors shadow-sm" />
                     <span className="text-sm font-medium hidden xl:block text-slate-700 dark:text-slate-200 group-hover:text-primary-600">{currentUser.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 hover:shadow-md active:scale-95 transition-all"
                  >
                    {UI_STRINGS.logout}
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login" className="relative text-sm font-bold text-slate-600 dark:text-slate-300 px-4 py-2 hover:text-primary-600 group transition-all">
                  {UI_STRINGS.login}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></span>
                </Link>
                <Link to="/register" className="bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                  {UI_STRINGS.register}
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-slate-700 dark:text-slate-200 transition-colors hover:text-primary-600"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1.5 p-1 w-8">
                <span className={`block h-0.5 w-full bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-screen w-full bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="font-black text-primary-600 text-lg">منوی انجمن</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-red-500 text-2xl">✕</button>
            </div>
            
            <div className="flex flex-col gap-1 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3"
                >
                  <span className="text-primary-600">•</span>
                  {link.name}
                </Link>
              ))}

              {currentUser && (
                <>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 transition-all flex items-center gap-3"
                  >
                    <span>👤</span>
                    <span>مشاهده پروفایل من</span>
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>پیام‌ها</span>
                    </div>
                    {unreadCount > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px]">{unreadCount} جدید</span>}
                  </Link>
                  {currentUser?.role === UserRole.ADMIN && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-bold text-primary-600 bg-primary-50 dark:bg-slate-800 mt-2"
                    >
                      🛠️ {UI_STRINGS.adminPanel}
                    </Link>
                  )}
                </>
              )}
            </div>

            {!currentUser ? (
              <div className="flex flex-col gap-2 mt-auto">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="w-full text-center py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  ورود
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="w-full text-center py-3.5 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary-700 transition-all"
                >
                  ثبت‌نام
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleLogout} 
                className="w-full py-3.5 bg-red-50 text-red-600 dark:bg-red-950/20 rounded-xl font-bold text-sm mt-auto hover:bg-red-100 transition-all"
              >
                خروج از حساب
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 py-16 mt-20 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-20"></div>
    <div className="max-w-7xl mx-auto px-4 relative z-10 text-right">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-6 group reveal-item">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl group-hover:rotate-[10deg] transition-transform duration-300">✨</div>
             <h3 className="font-black text-xl text-slate-900 dark:text-white">درباره انجمن</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-loose">
            انجمن علمی علوم کامپیوتر پلی است میان تئوری و عمل برای دانشجویان علاقه‌مند به تکنولوژی و نوآوری. ما در تلاشیم تا بستری برای شکوفایی استعدادهای شما فراهم کنیم.
          </p>
        </div>

        <div className="space-y-6 group reveal-item">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-xl group-hover:rotate-[10deg] transition-transform duration-300">🔗</div>
             <h3 className="font-black text-xl text-slate-900 dark:text-white">دسترسی سریع</h3>
          </div>
          <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-3">
            <li><Link to="/education" className="hover:text-primary-600 transition-colors flex items-center gap-2 group/link">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full scale-0 group-hover/link:scale-100 transition-transform"></span>
              جزوات درسی و منابع
            </Link></li>
            <li><Link to="/events" className="hover:text-primary-600 transition-colors flex items-center gap-2 group/link">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full scale-0 group-hover/link:scale-100 transition-transform"></span>
              ثبت‌نام در رویدادها
            </Link></li>
            <li><Link to="/activists" className="hover:text-primary-600 transition-colors flex items-center gap-2 group/link">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full scale-0 group-hover/link:scale-100 transition-transform"></span>
              تیم اجرایی و فعالین
            </Link></li>
          </ul>
        </div>

        <div className="space-y-6 group reveal-item">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-xl group-hover:rotate-[10deg] transition-transform duration-300">📍</div>
             <h3 className="font-black text-xl text-slate-900 dark:text-white">تماس با ما</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              دانشگاه لرستان - دانشکده فنی مهندسی - دفتر انجمن‌های علمی
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="https://t.me/csmlu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-3 px-6 rounded-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:border-[#229ED9] hover:shadow-[0_10px_30px_rgba(34,158,217,0.2)] hover:scale-105 group/tg"
              >
                <div className="w-10 h-10 bg-[#229ED9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#229ED9]/20 group-hover/tg:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.75-1.42 5.96-2.07 8.26-.1.36-.36.47-.66.47-.65 0-1.63-.65-2.51-1.33-.5-.39-.17-.61.1-.9.43-.47 4.08-3.79 4.15-4.14.01-.05.01-.12-.04-.16-.05-.04-.12-.02-.17-.01-.07.01-1.15.73-3.2 2.12-.32.22-.62.33-.88.33-.29 0-.84-.16-1.25-.3-.51-.17-.91-.26-.88-.55.02-.15.21-.31.58-.47 2.25-.98 3.75-1.63 4.51-1.94 2.16-.91 2.61-1.07 2.9-1.07.07 0 .22.02.33.11.09.08.12.19.13.27.01.08.03.26.01.4z"/>
                  </svg>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black block text-slate-600 dark:text-slate-300 group-hover/tg:text-[#229ED9] transition-colors">انجمن علمی علوم کامپیوتر (تلگرام)</span>
                </div>
              </a>
              <a 
                href="http://instagram.com/csmlu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-3 px-6 rounded-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:border-[#E4405F] hover:shadow-[0_10px_30px_rgba(228,64,95,0.2)] hover:scale-105 group/ig"
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#dc2743]/20 group-hover/ig:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259 0.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black block text-slate-600 dark:text-slate-300 group-hover/ig:text-[#E4405F] transition-colors">انجمن علمی علوم کامپیوتر (اینستاگرام)</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-slate-500 font-medium">© ۱۴۰۳ تمامی حقوق برای انجمن علمی علوم کامپیوتر محفوظ است.</p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col math-bg transition-colors duration-500">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/activists" element={<Activists />} />
              <Route path="/activists/:id" element={<ActivistDetails />} />
              <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/events/:id/gallery" element={<EventGallery />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:id" element={<DocumentDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><ChatCenter /></ProtectedRoute>} />
              <Route path="/networking-submit" element={<ProtectedRoute><NetworkingSubmit /></ProtectedRoute>} />
              <Route path="/networking/:id" element={<ProtectedRoute><NetworkingDetails /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
