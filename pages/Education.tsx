import React, { useState } from 'react';
import { useApp } from '../store.tsx';
import { UI_STRINGS } from '../constants.ts';
import { Professor, Course, LectureNote, MaterialType, EducationalVideo } from '../types.ts';

const Education: React.FC = () => {
  const { professors, courses, notes, videos } = useApp();
  const [selectedProfId, setSelectedProfId] = useState<string | null>(professors[0]?.id || null);
  const [activeMediaTab, setActiveMediaTab] = useState<'notes' | 'videos'>('notes');
  const [playingVideo, setPlayingVideo] = useState<EducationalVideo | null>(null);

  const selectedProf = professors.find(p => p.id === selectedProfId);
  const profCourses = courses.filter(c => c.professorId === selectedProfId);

  const getCourseNotes = (courseId: string) => notes.filter(n => n.courseId === courseId);
  const getCourseVideos = (courseId: string) => videos.filter(v => v.courseId === courseId);

  return (
    <div className="space-y-12 animate-spring-in">
      <section className="text-right space-y-4">
        <h2 className="text-4xl font-black">{UI_STRINGS.education}</h2>
        <p className="text-slate-500 max-w-2xl leading-relaxed">در این بخش می‌توانید به تفکیک اساتید، دروس ارائه شده و منابع آموزشی را مشاهده نمایید.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar: Professors List */}
        <aside className="lg:col-span-1 space-y-6">
          <h3 className="font-black text-xl mb-4 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
            اساتید همکار
          </h3>
          <div className="flex flex-col gap-3">
            {professors.map((prof) => (
              <button 
                key={prof.id} 
                onClick={() => { setSelectedProfId(prof.id); setPlayingVideo(null); }}
                className={`p-4 rounded-3xl text-right flex gap-4 items-center transition-all border ${
                  selectedProfId === prof.id 
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20 border-primary-600' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <img src={prof.image} alt={prof.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20" />
                <div className="min-w-0">
                  <h4 className="font-black text-sm truncate">{prof.name}</h4>
                  <p className={`text-[10px] ${selectedProfId === prof.id ? 'text-white/70' : 'text-slate-500'}`}>{prof.academicRank}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-10">
          {selectedProf ? (
            <div className="space-y-10">
              {/* Prof Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-10 items-center reveal-item">
                <img src={selectedProf.image} className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] object-cover shadow-2xl border-4 border-white dark:border-slate-800" />
                <div className="space-y-6 flex-grow text-center md:text-right">
                  <div>
                    <h2 className="text-3xl font-black mb-2">{selectedProf.name}</h2>
                    <p className="text-primary-600 font-bold uppercase tracking-widest">{selectedProf.academicRank} - {selectedProf.field}</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{selectedProf.bio}</p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-2xl text-xs font-bold">
                       <span className="text-primary-600 ml-1">{profCourses.length}</span> درس فعال
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Content Type */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl max-w-sm mx-auto md:mx-0">
                <button 
                  onClick={() => setActiveMediaTab('notes')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeMediaTab === 'notes' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}
                >
                  جزوات و منابع
                </button>
                <button 
                  onClick={() => setActiveMediaTab('videos')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeMediaTab === 'videos' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}
                >
                  ویدیوهای آموزشی
                </button>
              </div>

              {/* List Courses and their materials */}
              <div className="space-y-8">
                {profCourses.map(course => (
                  <div key={course.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden reveal-item">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/20 dark:bg-slate-800/20">
                      <div>
                        <h4 className="font-black text-xl">{course.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{course.description || 'توضیحات تکمیلی ثبت نشده است.'}</p>
                      </div>
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">📚</div>
                    </div>
                    <div className="p-8">
                      {activeMediaTab === 'notes' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getCourseNotes(course.id).map(note => (
                            <div key={note.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors group">
                               <div className="min-w-0">
                                  <div className="font-bold text-sm truncate">{note.title}</div>
                                  <div className="text-[10px] text-slate-400 mt-1 flex gap-2">
                                    <span>{note.date}</span>
                                    <span className="text-primary-600 font-black">{note.type === MaterialType.LINK ? '🔗 لینک' : '📄 فایل'}</span>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                 {note.type === MaterialType.FILE ? (
                                   <a href={note.fileUrl} download={`${note.title}`} className="bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm hover:scale-110 transition-transform">📥</a>
                                 ) : (
                                   <a href={note.fileUrl} target="_blank" rel="noreferrer" className="bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm hover:scale-110 transition-transform">🌐</a>
                                 )}
                               </div>
                            </div>
                          ))}
                          {getCourseNotes(course.id).length === 0 && <p className="col-span-2 text-center text-xs text-slate-400 italic py-4">جزوه ای موجود نیست.</p>}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getCourseVideos(course.id).map(video => (
                            <div key={video.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col gap-3 group">
                               <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden relative border border-slate-100 dark:border-slate-800">
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                                    <button 
                                      onClick={() => setPlayingVideo(video)}
                                      className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                                    >▶️</button>
                                  </div>
                               </div>
                               <div>
                                  <div className="font-bold text-sm truncate">{video.title}</div>
                                  <div className="text-[10px] text-slate-400 mt-1">{video.description}</div>
                               </div>
                            </div>
                          ))}
                          {getCourseVideos(course.id).length === 0 && <p className="col-span-2 text-center text-xs text-slate-400 italic py-4">ویدیو آموزشی موجود نیست.</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-40">
               <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-6xl mb-6">👨‍🏫</div>
               <h3 className="text-2xl font-black">یک استاد را انتخاب کنید</h3>
            </div>
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-3 md:inset-10 bg-slate-950/80 backdrop-blur-xl z-[100] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4">
          <div className="w-full max-w-5xl space-y-6">
            <div className="flex justify-between items-center text-white">
              <h3 className="text-2xl font-black">{playingVideo.title}</h3>
              <button onClick={() => setPlayingVideo(null)} className="text-4xl hover:rotate-90 transition-transform">✕</button>
            </div>
            <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
              {playingVideo.type === MaterialType.FILE ? (
                 <video src={playingVideo.videoUrl} controls className="w-full h-full" autoPlay></video>
              ) : (
                <iframe 
                  src={playingVideo.videoUrl.includes('youtube') ? playingVideo.videoUrl.replace('watch?v=', 'embed/') : playingVideo.videoUrl} 
                  className="w-full h-full" 
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <p className="text-slate-400 text-sm bg-white/5 p-6 rounded-2xl">{playingVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;