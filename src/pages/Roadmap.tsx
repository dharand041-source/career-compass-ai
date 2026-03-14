import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Play, ArrowRight, Award, BookOpen, X, Check, Laptop, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { careers } from "@/data/careers";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import AnimatedProgress from "@/components/AnimatedProgress";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import YouTube, { YouTubeEvent } from "react-youtube";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Roadmap = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const location = useLocation();
  const career = careers.find((c) => c.id === careerId);
  const { score = 8, total = 15 } = (location.state as { score: number; total: number }) || {};

  const percentage = Math.round((score / total) * 100);
  const level = percentage >= 80 ? "Advanced" : percentage >= 50 ? "Intermediate" : "Beginner";

  const subjectName = career?.title.toLowerCase().replace(/\s+/g, '-') || 'unknown';
  const modules = career?.skills || [];

  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, "Not Started" | "In Progress" | "Completed">>({});
  const playerRef = useRef<any>(null);
  const [moshVideoId, setMoshVideoId] = useState<string>("W6NZfCO5SIk");
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const openSkillLesson = (skillName: string) => {
    setIsVideoLoading(true);
    
    // Step 1: Normalize skill name
    const normalizedKey = skillName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Step 2: Skill Mapping Object
    const skillVideos: Record<string, string> = {
      "javascript": "W6NZfCO5SIk",
      "react": "SqcY0GlETPk",
      "typescript": "d56mG7DezGs",
      "tailwindcss": "_9mTJ84uL1Q",
      "nodejs": "TlB_eWDSMt4",
      "git": "s14jwD-_Dds",
      "responsivedesign": "_9mTJ84uL1Q",
      "python": "kqtD5dpn9C8",
      "sql": "7S_tz1z_5bA",
      "machinelearning": "7eh4d6sabA0",
      "pandas": "vtgDGrUiUKk",
      "statistics": "7eh4d6sabA0",
      "tensorflow": "9NsfX9W80rw",
      "htmlcss": "_9mTJ84uL1Q",
      "colortheory": "2QTHs7QSR9o",
      "r": "_V8eKsto3Ug",
      "docker": "exmSJpJvIPs",
      "kubernetes": "X48VuDVv0do",
      "cicd": "qP8kir2GUgo",
      "awsgcp": "K3bclpu1kus",
      "terraform": "CsLIyHtwojM",
      "monitoring": "aljzrNEqNDw",
      "scripting": "6GQRb4fGvtk",
      "restapi": "PKU0QTGPvac",
      "figma": "jQ1sfKIl50E",
      "userresearch": "bAARmsv1tms",
      "wireframing": "qWIdforZ9x0",
      "prototyping": "8tHJgtbj6rs",
      "designsystems": "opTANvl9G1g",
      "typography": "9w-BwzcuxYM",
      "usabilitytesting": "nYCJTea1AUQ",
      "reactnative": "0-S5a0eXPoc",
      "flutter": "3kaGC_DrUnw",
      "swiftios": "-VC3hIEL7eQ",
      "swift": "-VC3hIEL7eQ",
      "kotlinandroid": "dzUc9vrsldM",
      "kotlin": "dzUc9vrsldM",
      "restapis": "7S_tz1z_5bA",
      "statemanagement": "SqcY0GlETPk?start=2683",
      "appdeployment": "BeGRq7BPsd8",
      "appstoredeployment": "BeGRq7BPsd8",
      "uidesign": "HoKD1qIcchQ",
      "deeplearning": "7eh4d6adAUt",
      "pytorch": "7eh4d6adAUt",
      "nlp": "DDoK3bvi7lw",
      "computervision": "DDoK3bvi7lw",
      "mlops": "DDoK3bvi7lw",
      "mathematics": "MFBsqQnq-Ec",
      "cloudplatforms": "gJrjgg1KVL4",
      "networksecurity": "gdiao7L9GjE",
      "linux": "1oTuMPIwHmk",
      "ethicalhacking": "gdiao7L9GjE",
      "siem": "gdiao7L9GjE",
      "firewalls": "gJrjgg1KVL4",
      "incidentresponse": "gdiao7L9GjE",
      "cryptography": "gdiao7L9GjE",
      "compliance": "f9SbaAnf1sY"
    };

    // Step 5: Error Handling / Fallback
    let videoId = skillVideos[normalizedKey];
    
    if (!videoId && careerId === "data-scientist") {
      videoId = "dcqPhpLi7kv";
    }

    if (!videoId) {
      console.warn(`Skill "${skillName}" (normalized: "${normalizedKey}") not found. Defaulting to channel trailer.`);
      videoId = "f9SbaAnf1sY"; // Programming with Mosh channel trailer
    }

    setMoshVideoId(videoId);
    
    const modId = skillName.toLowerCase().replace(/\s+/g, '-');
    setActiveModule(modId);
  };

  // Step 6: Clear iframe source on close
  const handleCloseModal = () => {
    setActiveModule(null);
    setActiveLesson(null);
    setMoshVideoId(""); 
  };

  // Initialize progress from localStorage
  useEffect(() => {
    if (!career) return;
    const loadedModules = new Set<string>();
    const loadedLessons: Record<string, "Not Started" | "In Progress" | "Completed"> = {};

    modules.forEach(mod => {
      const modId = mod.toLowerCase().replace(/\s+/g, '-');
      // Load module completion
      if (localStorage.getItem(`module_complete_${subjectName}_${modId}`) === 'true') {
        loadedModules.add(modId);
      }
      
      // Load lessons completion
      const lessons = getLessonsForModule(mod);
      lessons.forEach(lesson => {
        const status = localStorage.getItem(`lesson_status_${subjectName}_${modId}_${lesson.id}`);
        if (status === "Completed" || status === "In Progress") {
          loadedLessons[lesson.id] = status;
        } else {
          loadedLessons[lesson.id] = "Not Started";
        }
      });
    });
    
    setCompletedModules(loadedModules);
    setLessonProgress(loadedLessons);
  }, [career, subjectName, modules]);

  const getLessonsForModule = (modName: string) => {
    const lower = modName.toLowerCase();
    if (lower.includes('python')) {
      return [
        { id: `intro-python`, title: `Introduction to Python`, videoId: "kqtD5dpn9C8" },
        { id: `python-data-types`, title: `Python Data Types`, videoId: "bY6m6_IIN94" },
        { id: `python-functions`, title: `Python Functions`, videoId: "9Os0o3wzS_I" }
      ];
    } else if (lower.includes('java') && !lower.includes('javascript')) {
      return [
        { id: `intro-java`, title: `Introduction to Java`, videoId: "A74TOX803D0" },
        { id: `java-oop`, title: `Java OOP Concepts`, videoId: "UUOG80p6Y98" },
        { id: `java-collections`, title: `Java Collections`, videoId: "viZzFEzB5bA" }
      ];
    } else if (lower.includes('web') || lower.includes('html') || lower.includes('css')) {
      return [
        { id: `intro-web`, title: `Introduction to ${modName}`, videoId: "UB1O30fR-EE" },
        { id: `basics-web`, title: `${modName} Basics`, videoId: "ieTHC78giGQ" }
      ];
    } else if (lower.includes('data')) {
      return [
        { id: `intro-data`, title: `Introduction to Data Science`, videoId: "X3paOmcrTjQ" },
        { id: `data-analysis`, title: `Data Analysis Basics`, videoId: "r-uOLxNrNk8" },
        { id: `machine-learning`, title: `Machine Learning Intro`, videoId: "Gv9_4yMHFhI" }
      ];
    } else if (lower.includes('pytorch')) {
      return [
        { id: `pytorch-1`, title: `Lesson 1: PyTorch Basics & Tensors`, videoId: "V_xro1bcAuA" },
        { id: `pytorch-2`, title: `Lesson 2: Building a Neural Network`, videoId: "Z_ikDlimN6A" },
        { id: `pytorch-3`, title: `Lesson 3: Training the Model`, videoId: "v5cngxo4mIg" }
      ];
    } else if (lower.includes('deep learning')) {
      return [
        { id: `dl-1`, title: `Introduction to Deep Learning`, videoId: "gmjzdiAxc1c" },
        { id: `dl-2`, title: `Advanced Deep Learning Concepts`, videoId: "" },
        { id: `dl-3`, title: `Convolutional Neural Networks (CNNs)`, videoId: "HGwBXDKFk9I" }
      ];
    }
    
    return [
      { id: `intro-${modName.toLowerCase().replace(/\s+/g, '-')}`, title: `Introduction to ${modName}`, videoId: "" },
      { id: `advanced-${modName.toLowerCase().replace(/\s+/g, '-')}`, title: `Advanced ${modName} Concepts`, videoId: "" }
    ];
  };

  useEffect(() => {
    const checkProgress = () => {
      if (playerRef.current && activeModule && activeLesson) {
        if (typeof playerRef.current.getPlayerState === 'function' && playerRef.current.getPlayerState() === 1) { // 1 = playing
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0 && (currentTime / duration) >= 0.8) {
            setLessonProgress(prev => {
              if (prev[activeLesson] !== "Completed") {
                // Call update outside if possible, but safe here with functional update mechanism
                updateLessonStatus(activeModule, activeLesson, "Completed");
              }
              return prev;
            });
          }
        }
      }
    };
    const interval = setInterval(checkProgress, 2000);
    return () => clearInterval(interval);
  }, [activeModule, activeLesson]);

  const updateLessonStatus = (modId: string, lessonId: string, status: "In Progress" | "Completed") => {
    setLessonProgress(prev => {
      if (prev[lessonId] === status) return prev;
      
      const newProgress = { ...prev, [lessonId]: status };
      localStorage.setItem(`lesson_status_${subjectName}_${modId}_${lessonId}`, status);
      
      if (status === "Completed") {
        const lessons = getLessonsForModule(modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === modId) || "");
        const allCompleted = lessons.every(l => newProgress[l.id] === "Completed" || l.id === lessonId);
        
        const currentIdx = lessons.findIndex(l => l.id === lessonId);
        const nextLesson = lessons[currentIdx + 1];

        if (allCompleted) {
          toast.success("Great job! You completed this lesson.", { icon: "🤖" });
          markModuleComplete(modId);
        } else if (nextLesson) {
          toast.success(`Great job! You completed this lesson. Next lesson is ready. Continue learning this skill.`, { icon: "🤖", duration: 5000 });
        }
      }
      return newProgress;
    });
  };

  const markModuleComplete = (modId: string) => {
    setCompletedModules(prev => {
      if (prev.has(modId)) return prev;
      const next = new Set(prev);
      next.add(modId);
      localStorage.setItem(`module_complete_${subjectName}_${modId}`, 'true');
      
      toast.success("Module Completed! You're one step closer to your career goal.", { icon: "🤖", duration: 5000 });
      return next;
    });
  };

  const handleLessonOpen = (modId: string, lessonId: string) => {
    setActiveLesson(lessonId);
  };

  const handleVideoPlay = () => {
    if (activeModule && activeLesson && lessonProgress[activeLesson] !== "Completed") {
      updateLessonStatus(activeModule, activeLesson, "In Progress");
    }
  };

  const handleVideoEnd = () => {
    if (activeModule && activeLesson) {
      updateLessonStatus(activeModule, activeLesson, "Completed");
    }
  };

  if (!career) return null;

  const allModulesCompleted = completedModules.size === modules.length && modules.length > 0;

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        <BackButton />
        <GlassCard glow className="mb-8 text-center relative overflow-hidden">
          {allModulesCompleted && (
            <div className="absolute top-4 right-4 flex flex-col items-center animate-bounce-subtle">
              <Award className="h-12 w-12 text-yellow-500 fill-yellow-100" />
              <Badge className="mt-1 bg-yellow-500 hover:bg-yellow-600">Subject Master</Badge>
            </div>
          )}
          <span className="text-5xl mb-3 block">{career.icon}</span>
          <h1 className="font-display text-2xl font-bold mb-1">{career.title} {allModulesCompleted && <span className="text-green-500">✓ Completed</span>}</h1>
          <p className="text-muted-foreground text-sm mb-4">
            You scored <span className="text-accent font-bold">{score}/{total}</span> — Level: <span className="text-primary font-semibold">{level}</span>
          </p>
          <AnimatedProgress value={score} max={total} variant="accent" className="max-w-md mx-auto" />
        </GlassCard>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">
            Your Personalized <span className="gradient-text">Skill Roadmap</span>
          </h2>
          <Badge variant="outline" className="text-sm px-3 py-1">
            Completed Modules: {completedModules.size} of {modules.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {modules.map((skill, i) => {
            const modId = skill.toLowerCase().replace(/\s+/g, '-');
            const isCompleted = completedModules.has(modId);
            
            return (
              <motion.div
                key={modId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard hover className="flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-all border border-transparent hover:border-primary/20" onClick={() => openSkillLesson(skill)}>
                  <div className="shrink-0 flex items-center justify-center pt-1 sm:pt-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-7 w-7 text-green-500 drop-shadow-sm" />
                    ) : (
                      <Circle className="h-7 w-7 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-display font-semibold text-lg transition-colors ${isCompleted ? "text-green-600 line-through opacity-80" : ""}`}>
                      {skill}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs font-medium text-muted-foreground">Module {i + 1} of {modules.length}</p>
                      {isCompleted && <Badge variant="secondary" className="text-[10px] h-4 leading-none bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button variant={isCompleted ? "outline" : "default"} size="sm" onClick={(e) => { e.stopPropagation(); openSkillLesson(skill); }} className="w-full sm:w-auto">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Lessons
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-white/10">
          <Link to={`/interview/${careerId}`}>
            <GlowButton className="flex items-center gap-2 w-full sm:w-auto">
              Start Interview Prep <ArrowRight className="h-4 w-4" />
            </GlowButton>
          </Link>
          <Link to="/dashboard">
            <GlowButton variant="secondary" className="w-full sm:w-auto">Go to Dashboard</GlowButton>
          </Link>
        </div>

        {/* Module Lessons Modal */}
        <Dialog open={!!activeModule} onOpenChange={(open) => !open && handleCloseModal()}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Laptop className="h-6 w-6 text-primary" />
                {modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === activeModule)} Module
              </DialogTitle>
            </DialogHeader>
            
            {activeModule && !activeLesson && (
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground mb-6">Complete all lessons in this module to mark it as completed.</p>
                {getLessonsForModule(modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === activeModule) || "").map((lesson, idx, arr) => {
                  const status = lessonProgress[lesson.id] || "Not Started";
                  const isLocked = idx > 0 && lessonProgress[arr[idx - 1].id] !== "Completed";
                  
                  return (
                    <div 
                      key={lesson.id} 
                      className={`p-4 rounded-xl border transition-colors ${isLocked ? 'opacity-60 bg-muted cursor-not-allowed' : 'bg-card hover:bg-accent/5 cursor-pointer'}`} 
                      onClick={() => {
                        if (!isLocked) {
                          console.log('Clicked URL:', lesson.videoId || lesson.id);
                          handleLessonOpen(activeModule, lesson.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${status === 'Completed' ? 'bg-green-500 text-white' : isLocked ? 'bg-muted-foreground/20 text-muted-foreground' : status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-secondary text-secondary-foreground'}`}>
                            {status === 'Completed' ? <Check className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : idx + 1}
                          </div>
                          <div>
                            <h4 className={`font-semibold text-lg ${status === 'Completed' ? 'text-muted-foreground line-through' : ''}`}>{lesson.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {isLocked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : <Play className="h-3.5 w-3.5 text-primary" />}
                              <span className="text-xs text-muted-foreground">{isLocked ? 'Locked' : 'Video Lesson'}</span>
                              {!isLocked && (
                                <Badge variant={status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline'} className={status === 'Completed' ? 'bg-green-500' : ''}>
                                  {status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" disabled={isLocked}>
                          {isLocked ? <Lock className="h-5 w-5 opacity-50" /> : <ArrowRight className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeLesson && activeModule && (
              <div className="mt-2 flex flex-col items-center">
                <Button 
                  variant="ghost" 
                  className="self-start mb-4 text-slate-400 hover:text-white hover:bg-white/5" 
                  onClick={() => {
                    setActiveLesson(null);
                    setMoshVideoId(""); 
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lessons
                </Button>
                
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6 relative">
                  {getLessonsForModule(modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === activeModule) || "").find(l => l.id === activeLesson)?.videoId ? (
                    <YouTube 
                      videoId={getLessonsForModule(modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === activeModule) || "").find(l => l.id === activeLesson)?.videoId}
                      className="w-full h-full absolute inset-0 player"
                      opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }}
                      onEnd={handleVideoEnd}
                      onPlay={handleVideoPlay}
                      onReady={(e) => { playerRef.current = e.target; }}
                    />
                    ) : (
                      moshVideoId ? (
                        <div className="w-full h-full relative" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                          {isVideoLoading && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                              <p className="text-sm font-medium text-slate-300">Please Wait...</p>
                            </div>
                          )}
                          <iframe
                            className="w-full h-full absolute inset-0 player"
                            src={`https://www.youtube.com/embed/${moshVideoId}`}
                            title="Module Lesson"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            onLoad={() => setIsVideoLoading(false)}
                          ></iframe>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8 bg-slate-800/80 border border-slate-700">
                          <span className="text-xl md:text-2xl font-semibold text-slate-300 animate-pulse tracking-wide">
                            Video Content Coming Soon
                          </span>
                        </div>
                      )
                    )}
                </div>
                
                <div className="flex w-full justify-between items-center bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm font-medium">Watch the video completely to mark as done.</p>
                  <Button 
                    onClick={() => {
                      updateLessonStatus(activeModule, activeLesson, "Completed");
                      setActiveLesson(null);
                    }}
                    className={lessonProgress[activeLesson] === "Completed" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                  >
                    {lessonProgress[activeLesson] === "Completed" ? (
                      <><CheckCircle2 className="h-4 w-4 mr-2" /> Completed</>
                    ) : "Mark as Complete"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Roadmap;
