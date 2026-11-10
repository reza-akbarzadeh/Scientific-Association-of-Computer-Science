import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { UI_STRINGS } from '../constants';

const Documents: React.FC = () => {
  const { documents } = useApp();

  return (
    <div className="space-y-12 animate-spring-in">
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-black">{UI_STRINGS.documents}</h2>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          در این بخش می‌توانید با شاخه‌های مختلف علوم کامپیوتر آشنا شده، نقشه راه یادگیری هر یک را مشاهده کرده و با خبرگان هر حوزه آشنا شوید.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents.length > 0 ? (
          documents.map(doc => (
            <Link 
              key={doc.id} 
              to={`/documents/${doc.id}`}
              className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all block"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">
                {doc.icon || '📄'}
              </div>
              <h3 className="text-xl font-black mb-3">{doc.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-loose line-clamp-3 mb-6">
                {doc.description}
              </p>
              <div className="flex justify-between items-center text-xs font-bold text-primary-600">
                <span>علوم کامپیوتر</span>
                <span>مشاهده نقشه راه ←</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="text-6xl grayscale opacity-10">📂</div>
            <h3 className="text-xl font-bold text-slate-400">هنوز مستندی ثبت نشده است.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;