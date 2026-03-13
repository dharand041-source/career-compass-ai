import { useParams, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Play, ArrowRight, Award, BookOpen, X, Check, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
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

  const getLessonsForModule = (modName: string) => [
    { id: `intro-${modName.toLowerCase().replace(/\s+/g, '-')}`, title: `Introduction to ${modName}`, videoId: "PkZNo7MFNFg" },
    { id: `advanced-${modName.toLowerCase().replace(/\s+/g, '-')}`, title: `Advanced ${modName} Concepts`, videoId: "bJzb-RuUcMU" }
  ];

  const updateLessonStatus = (modId: string, lessonId: string, status: "In Progress" | "Completed") => {
    setLessonProgress(prev => {
      const newProgress = { ...prev, [lessonId]: status };
      localStorage.setItem(`lesson_status_${subjectName}_${modId}_${lessonId}`, status);
      
      // Check if module is now complete
      if (status === "Completed") {
        toast.success("Great job! You've completed this lesson.", { icon: "🤖" });
        
        const lessons = getLessonsForModule(modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === modId) || "");
        const allCompleted = lessons.every(l => newProgress[l.id] === "Completed" || l.id === lessonId);
        
        if (allCompleted) {
          markModuleComplete(modId);
        } else {
          toast.info("Nice progress! Keep going to finish the module.", { icon: "🤖", duration: 4000 });
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
    if (lessonProgress[lessonId] !== "Completed") {
      updateLessonStatus(modId, lessonId, "In Progress");
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
                <GlassCard hover className="flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-all border border-transparent hover:border-primary/20" onClick={() => setActiveModule(modId)}>
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
                    <Button variant={isCompleted ? "outline" : "default"} size="sm" onClick={(e) => { e.stopPropagation(); setActiveModule(modId); }} className="w-full sm:w-auto">
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
          <Link to="/interview">
            <GlowButton className="flex items-center gap-2 w-full sm:w-auto">
              Start Interview Prep <ArrowRight className="h-4 w-4" />
            </GlowButton>
          </Link>
          <Link to="/dashboard">
            <GlowButton variant="secondary" className="w-full sm:w-auto">Go to Dashboard</GlowButton>
          </Link>
        </div>

        {/* Module Lessons Modal */}
        <Dialog open={!!activeModule} onOpenChange={(open) => !open && setActiveModule(null)}>
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
                {getLessonsForModule(modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === activeModule) || "").map((lesson, idx) => {
                  const status = lessonProgress[lesson.id] || "Not Started";
                  return (
                    <div key={lesson.id} className="p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => handleLessonOpen(activeModule, lesson.id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${status === 'Completed' ? 'bg-green-500 text-white' : status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-secondary text-secondary-foreground'}`}>
                            {status === 'Completed' ? <Check className="h-5 w-5" /> : idx + 1}
                          </div>
                          <div>
                            <h4 className={`font-semibold text-lg ${status === 'Completed' ? 'text-muted-foreground line-through' : ''}`}>{lesson.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Play className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs text-muted-foreground">Video Lesson</span>
                              <Badge variant={status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline'} className={status === 'Completed' ? 'bg-green-500' : ''}>
                                {status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeLesson && activeModule && (
              <div className="mt-2 flex flex-col items-center">
                <Button variant="ghost" className="self-start mb-4" onClick={() => setActiveLesson(null)}>
                  ← Back to Lessons
                </Button>
                
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6 relative">
                  <YouTube 
                    videoId={getLessonsForModule(modules.find(m => m.toLowerCase().replace(/\s+/g, '-') === activeModule) || "").find(l => l.id === activeLesson)?.videoId}
                    className="w-full h-full absolute inset-0"
                    opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }}
                    onEnd={handleVideoEnd}
                  />
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
