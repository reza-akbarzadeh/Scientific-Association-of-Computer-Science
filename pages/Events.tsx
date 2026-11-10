
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { UI_STRINGS, getShamsiEventTimestamp, toPersianDigits } from '../constants';
import { EventCategory, AppEvent } from '../types';

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const targetTimestamp = getShamsiEventTimestamp(targetDate);
    if (!targetTimestamp) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const labels = { d: 'روز', h: 'ساعت', m: 'دقیقه', s: 'ثانیه' };

  return (
    <div className="flex gap-1.5 sm:gap-2 justify-center items-center select-none" dir="ltr">
      {(['d', 'h', 'm', 's'] as const).map((key) => (
        <div key={key} className="flex flex-col items-center">
          <div className="bg-indigo-600/90 dark:bg-indigo-500/90 backdrop-blur-md w-9 h-11 sm:w-11 sm:h-13 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-sm sm:text-lg font-black text-white">
              {toPersianDigits(timeLeft[key].toString().padStart(2, '0'))}
            </span>
          </div>
          <span className="text-[6px] sm:text-[8px] font-black text-white/80 mt-1 drop-shadow-sm" dir="rtl">{labels[key]}</span>
        </div>
      ))}
    </div>
  );
};

const Events: React.FC = () => {
  const { events } = useApp();
  const [activeTab, setActiveTab] = useState<EventCategory>(EventCategory.UPCOMING);

  const filteredEvents = events.filter(e => e.category === activeTab);

  const tabs = [
    { id: EventCategory.UPCOMING, label: UI_STRINGS.upcomingEvents },
    { id: EventCategory.ONGOING, label: UI_STRINGS.ongoingEvents },
    { id: EventCategory.PAST, label: UI_STRINGS.pastEvents },
  ];

  return (
    <div className="space-y-16 animate-spring-in">
      <header className="text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">{UI_STRINGS.events}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-medium">
            همراه ما باشید در رویدادها، مسابقات و کارگاه‌های تخصصی علوم کامپیوتر
          </p>
        </div>
        
        <div className="flex justify-center gap-1.5 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] max-w-lg mx-auto shadow-inner border border-slate-200 dark:border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 sm:py-4 rounded-3xl text-xs sm:text-sm font-black transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-700 shadow-md text-primary-600 dark:text-primary-400' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className="group bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col border border-slate-100 dark:border-slate-800 hover:-translate-y-2">
              {/* Image Section */}
              <div className="relative block overflow-hidden aspect-[16/11] bg-slate-50 dark:bg-slate-950">
                <Link to={`/events/${event.id}`} className="block w-full h-full">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                </Link>
                
                {/* Date Badge */}
                <div className="absolute top-5 right-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[10px] font-black text-primary-600 shadow-lg border border-white/20">
                  {toPersianDigits(event.date)}
                </div>

                {/* Status Indicator */}
                {event.category === EventCategory.ONGOING && (
                  <div className="absolute top-5 left-5 bg-rose-500 text-white px-3.5 py-1.5 rounded-xl text-[9px] font-black animate-pulse shadow-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    در حال برگزاری
                  </div>
                )}

                {/* Countdown Overlay for Upcoming Events */}
                {event.category === EventCategory.UPCOMING && (
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-auto pointer-events-none">
                    <div className="bg-black/20 backdrop-blur-sm p-3 rounded-[1.8rem] border border-white/10 shadow-2xl">
                      <Countdown targetDate={event.date} />
                    </div>
                  </div>
                )}
                
                {/* View Link Overlay (Hidden on touch devices, shown on hover) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                   <span className="text-white font-black text-[10px] bg-primary-600/90 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-2xl border border-white/20">
                    مشاهده جزئیات رویداد
                   </span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-8 sm:p-10 flex flex-col flex-grow space-y-6">
                <div className="space-y-3">
                  <Link to={`/events/${event.id}`} className="block">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                      {event.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-loose line-clamp-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 mt-auto">
                   <Link 
                    to={`/events/${event.id}`} 
                    className={`w-full inline-flex items-center justify-center gap-2 text-center py-3.5 sm:py-4 rounded-2xl text-sm font-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg group/btn
                      ${event.category === EventCategory.PAST 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-slate-200/50 dark:shadow-none' 
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/25'}`}
                   >
                     <span>
                        {event.category === EventCategory.UPCOMING ? 'مشاهده و ثبت‌نام' : event.category === EventCategory.ONGOING ? 'همین حالا شرکت کنید' : 'گزارش رویداد'}
                     </span>
                     <span className="text-lg group-hover/btn:translate-x-[-4px] transition-transform duration-300">←</span>
                   </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 text-center space-y-8 animate-spring-in">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-primary-500/10 blur-[100px] rounded-full"></div>
               <span className="text-9xl relative block grayscale opacity-10">🗓️</span>
            </div>
            <div className="space-y-2">
               <h4 className="text-2xl font-black text-slate-300 dark:text-slate-600">هنوز رویدادی ثبت نشده است</h4>
               <p className="text-slate-400 dark:text-slate-500 font-medium">به زودی برنامه‌های جدید را در اینجا اطلاع‌رسانی خواهیم کرد.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
