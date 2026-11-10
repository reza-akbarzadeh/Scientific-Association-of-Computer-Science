import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../store';
import { toPersianDigits } from '../constants';

const EventGallery: React.FC = () => {
  const { id } = useParams();
  const { events } = useApp();
  const [selectedImage, setSelectedImage] = useState<{ url: string; description: string } | null>(null);
  
  const event = events.find(e => e.id === id);

  if (!event) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-spring-in pb-20">
       <header className="space-y-4">
          <Link to="/events" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">← بازگشت به رویدادها</Link>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8 dark:border-slate-800">
             <div className="space-y-2">
                <h1 className="text-4xl font-black">پیوست‌های رویداد</h1>
                <p className="text-primary-600 font-bold text-xl">{event.title}</p>
                <div className="text-xs text-slate-400 font-medium">برگزار شده در تاریخ {toPersianDigits(event.date)}</div>
             </div>
             <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-2xl text-xs font-black">
                تعداد تصاویر: {toPersianDigits(event.gallery?.length || 0)}
             </div>
          </div>
       </header>

       <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {event.gallery && event.gallery.length > 0 ? (
            event.gallery.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage({ url: item.url, description: item.description })}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md hover:shadow-2xl transition-all flex flex-col group cursor-zoom-in"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-50 dark:bg-slate-950">
                   <img src={item.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                        🔍 مشاهده تصویر کامل
                      </span>
                   </div>
                </div>
                {item.description && (
                  <div className="p-6 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex-grow flex items-center justify-center text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center space-y-6">
               <div className="text-8xl grayscale opacity-10">🖼️</div>
               <h3 className="text-2xl font-black text-slate-400">تصویری برای این رویداد ثبت نشده است.</h3>
               <p className="text-sm text-slate-400">مدیریت هنوز پیوستی برای این گزارش تصویری آپلود نکرده است.</p>
            </div>
          )}
       </main>

       {/* Lightbox / Foreground View */}
       {selectedImage && (
         <div 
          className="fixed inset-3 md:inset-10 bg-slate-950/90 backdrop-blur-2xl z-[200] rounded-[2.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
         >
           <div className="absolute top-6 right-6 flex gap-4">
              <button 
                className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/20 text-2xl"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
           </div>
           
           <div className="max-w-5xl w-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
             <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
                <img 
                  src={selectedImage.url} 
                  className="max-h-[70vh] object-contain block animate-in zoom-in-95 duration-500" 
                />
             </div>
             {selectedImage.description && (
               <div className="bg-white/10 backdrop-blur-md px-10 py-5 rounded-[2rem] border border-white/10 text-center max-w-2xl">
                 <p className="text-white font-bold text-lg leading-relaxed">{selectedImage.description}</p>
               </div>
             )}
             <div className="text-white/40 text-[10px] font-bold">برای بازگشت کلیک کنید</div>
           </div>
         </div>
       )}
    </div>
  );
};

export default EventGallery;