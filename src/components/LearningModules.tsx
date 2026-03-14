import React, { useState } from 'react';
import { BookOpen, Circle, CheckCircle, PlayCircle, AlertCircle, Check } from 'lucide-react';

interface SubLesson {
  id: number;
  title: string;
  videoUrl: string;
  isCompleted: boolean;
}

interface Module {
  id: number;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  videoUrl: string | null;
  subLessons?: SubLesson[];
}

const modules: Module[] = [
  { id: 1, title: 'Introduction to Python', subtitle: 'Module 1 of 5', isCompleted: true, videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8' },
  { id: 2, title: 'Deep Learning', subtitle: 'Module 2 of 5', isCompleted: false, videoUrl: null, subLessons: [
    { id: 21, title: 'Introduction to Deep Learning', videoUrl: 'https://www.youtube.com/embed/gmjzdiAxc1c', isCompleted: false },
    { id: 22, title: 'Advanced Deep Learning Concepts', videoUrl: '', isCompleted: false },
    { id: 23, title: 'Convolutional Neural Networks (CNNs)', videoUrl: 'https://www.youtube.com/embed/HGwBXDKFk9I', isCompleted: false }
  ] },
  { id: 3, title: 'PyTorch', subtitle: 'Module 3 of 5', isCompleted: false, videoUrl: null, subLessons: [
    { id: 31, title: 'Lesson 1: PyTorch Basics & Tensors', videoUrl: 'https://www.youtube.com/embed/V_xro1bcAuA', isCompleted: false },
    { id: 32, title: 'Lesson 2: Building a Neural Network', videoUrl: 'https://www.youtube.com/embed/Z_ikDlimN6A', isCompleted: false },
    { id: 33, title: 'Lesson 3: Training the Model', videoUrl: 'https://www.youtube.com/embed/v5cngxo4mIg', isCompleted: false }
  ] },
  { id: 4, title: 'NLP', subtitle: 'Module 4 of 5', isCompleted: false, videoUrl: 'https://www.youtube.com/embed/CMrHM8a3hqw' },
  { id: 5, title: 'Computer Vision', subtitle: 'Module 5 of 5', isCompleted: false, videoUrl: 'https://www.youtube.com/embed/2hYWDmA_P_k' },
];

export const LearningModules: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [moduleData, setModuleData] = useState<Module[]>(modules);
  const [activeSubVideo, setActiveSubVideo] = useState<{title: string, url: string} | null>(null);

  const markComplete = (moduleId: number) => {
    setModuleData(prev => prev.map(m => m.id === moduleId ? { ...m, isCompleted: true } : m));
  };

  const toggleModule = (moduleId: number) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
      setActiveSubVideo(null);
    } else {
      setExpandedModule(moduleId);
      setActiveSubVideo(null);
    }
  };

  const closeVideo = () => {
    setExpandedModule(null);
    setActiveSubVideo(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-slate-900 min-h-screen text-slate-100 font-sans shadow-2xl">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
          Learning Path
        </h2>
        <p className="text-slate-400 mt-2 text-sm md:text-base">Master the essential skills step-by-step.</p>
      </div>
      
      <div className="space-y-6">
        {moduleData.map((mod) => {
          const isExpanded = expandedModule === mod.id;
          const activeLesson = mod;

          return (
            <div 
              key={mod.id} 
              className={`bg-slate-800/60 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg
                ${isExpanded ? 'border-cyan-500/50 shadow-cyan-500/10' : 'border-slate-700/50 hover:border-cyan-500/30'}`}
            >
              {/* List Item Header (Clickable Container) */}
              <div 
                onClick={() => toggleModule(mod.id)}
                className="flex flex-col md:flex-row items-center justify-between p-6 md:px-8 gap-4 md:gap-0 cursor-pointer hover:bg-slate-800/40 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleModule(mod.id);
                  }
                }}
              >
                <div className="flex items-center gap-5 md:gap-6 w-full md:w-auto">
                  {/* Circular Progress/Selection Indicator */}
                  <div className="relative flex-shrink-0 flex items-center justify-center w-14 h-14">
                    {mod.isCompleted ? (
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300">
                        <Check className="w-6 h-6 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <>
                        <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-700/50"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-cyan-400 opacity-20"
                            strokeDasharray="30, 100"
                            strokeWidth="3"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Circle className="w-5 h-5 text-slate-400" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Module Title & Subtitle */}
                  <div className="flex-1">
                    <h3 className={`text-xl md:text-2xl font-semibold tracking-wide transition-colors duration-300 ${mod.isCompleted ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                      {mod.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                      <p className="text-sm md:text-base text-slate-400 font-medium">{mod.subtitle}</p>
                      <span className={`px-2 py-0.5 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider transition-colors duration-300 w-fit ${mod.isCompleted ? 'bg-green-500 text-green-950 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-slate-700 text-slate-300'}`}>
                        {mod.isCompleted ? 'Completed' : 'Not Started'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModule(mod.id);
                  }}
                  className={`flex-shrink-0 flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900
                    ${isExpanded 
                      ? 'bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600' 
                      : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:border-cyan-400 hover:bg-cyan-500/20 active:scale-95'}`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{isExpanded ? 'Close Lesson' : 'View Lesson'}</span>
                </button>
              </div>

              {/* Accordion Content Area */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="border-t border-slate-700/50 bg-slate-900/40 p-6 md:p-8">
                  {mod.subLessons && !activeSubVideo ? (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                      <h4 className="text-xl font-bold text-slate-100 mb-2">Lessons in this Module</h4>
                      {mod.subLessons.map(sub => (
                        <div 
                          key={sub.id} 
                          onClick={() => {
                            console.log('Video URL passed:', sub.videoUrl);
                            setActiveSubVideo({title: sub.title, url: sub.videoUrl});
                          }}
                          className="flex items-center justify-between p-5 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 shadow-md group"
                        >
                          <div className="flex items-center gap-4">
                            <PlayCircle className="w-8 h-8 text-cyan-500 group-hover:scale-110 transition-transform" />
                            <h5 className="font-semibold text-slate-200 text-lg">{sub.title}</h5>
                          </div>
                          <button className="px-5 py-2.5 bg-slate-900/80 border border-slate-600 rounded-lg text-sm text-cyan-400 font-bold group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50 transition-colors">
                            Watch Video
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="group flex flex-col gap-6 bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-300 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                      
                      {/* Back to Lessons Close Handler */}
                      <div className="flex justify-between items-center mb-1">
                        <button 
                          onClick={activeSubVideo ? () => setActiveSubVideo(null) : closeVideo}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 focus:outline-none transition-colors duration-200 text-sm font-bold tracking-wide"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{activeSubVideo ? 'Back to Lesson List' : 'Back to Lessons'}</span>
                        </button>
                      </div>

                      {/* Conditional Video or Fallback Container */}
                      <div className="w-full aspect-video flex-shrink-0 bg-black rounded-lg overflow-hidden relative shadow-lg mt-2">
                        {activeSubVideo?.url || activeLesson.videoUrl ? (
                          <iframe
                            className="w-full h-full absolute inset-0 player"
                            src={activeSubVideo ? activeSubVideo.url : (activeLesson.videoUrl as string)}
                            title={`${activeSubVideo ? activeSubVideo.title : mod.title} Course`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-8 bg-slate-800/80 border border-slate-700">
                            <span className="text-xl md:text-2xl font-semibold text-slate-300 animate-pulse tracking-wide">
                              Video Content Coming Soon
                            </span>
                          </div>
                        )}
                      </div>
                        
                      {/* Video Metadata */}
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-lg md:text-xl font-bold text-slate-100 mb-2 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
                          Complete {activeSubVideo ? activeSubVideo.title : mod.title} Masterclass
                        </h4>
                        <div className="mt-2 flex items-center gap-2 text-cyan-500 text-sm font-semibold tracking-wide uppercase">
                          <PlayCircle className="w-5 h-5 flex-shrink-0" />
                          <span>Interactive Video Lesson</span>
                          <span className={`ml-2 px-2 py-0.5 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider transition-colors duration-300 ${mod.isCompleted ? 'bg-green-500 text-green-950 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-slate-700 text-slate-300'}`}>
                            {mod.isCompleted ? 'Completed' : 'Not Started'}
                          </span>
                        </div>
                      </div>

                      {/* Hidden Toggle for Testing */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markComplete(mod.id);
                        }}
                        className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs font-mono transition-opacity z-10"
                        title="Secret toggle to test completion state"
                      >
                        [Test: Mark Complete]
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
