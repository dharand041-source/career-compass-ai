import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, Sparkles, GraduationCap, 
  Lightbulb, Target, BookOpen, Brain,
  ChevronRight, ArrowRight, CheckCircle2,
  Trophy, Star, Laptop, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import { careers } from "@/data/careers";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { getAiCoaching } from "@/lib/aiCoachService";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: "text" | "guidance" | "roadmap" | "coaching";
  suggestedRoadmap?: any;
  coachingData?: any;
}

const CareerMentor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Career Mentor. 👋 I'm here to help you discover the perfect career path and guide you on your journey to professional success. Shall we start by exploring your goals?",
      isBot: true,
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    interest: "",
    skills: "",
    level: "",
    jobType: "",
    techStack: ""
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (msg: Omit<Message, "id" | "timestamp">) => {
    const newMsg = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    addMessage({ text: userText, isBot: false });
    setInput("");
    setIsTyping(true);

    // AI Mentor logic flow
    setTimeout(() => {
      let botResponse = "";
      let nextStep = step;

      if (step === 0) {
        botResponse = "I'm excited to help! To get started, what career path are you currently most interested in? (e.g., Software Developer, Data Scientist, Web Developer, AI Engineer)";
        nextStep = 1;
      } else if (step === 1) {
        setUserData(prev => ({ ...prev, interest: userText }));
        botResponse = `Excellent choice! ${userText} is a high-growth field. What programming languages or technical skills do you already have some experience with?`;
        nextStep = 2;
      } else if (step === 2) {
        setUserData(prev => ({ ...prev, skills: userText }));
        botResponse = "Got it. Are you currently a student, a fresher, or an experienced professional looking for a transition?";
        nextStep = 3;
      } else if (step === 3) {
        setUserData(prev => ({ ...prev, level: userText }));
        botResponse = "That helps me tailor my advice. What type of role are you specifically looking for? (e.g., Internship, Remote Full-time, Entry-level job)";
        nextStep = 4;
      } else if (step === 4) {
        setUserData(prev => ({ ...prev, jobType: userText }));
        botResponse = "Final question: What specific technologies or industries excite you the most? (e.g., Web3, Cloud Computing, Healthcare Tech, FinTech)";
        nextStep = 5;
      } else if (step === 5) {
        setUserData(prev => ({ ...prev, techStack: userText }));
        
        // Analyze and provide guidance
        setIsTyping(false);
        generateGuidance(userText);
        return;
      } else {
        botResponse = "I'm always here to help! Do you have specific questions about the roadmap I provided, or would you like to explore another career path?";
      }

      setStep(nextStep);
      setIsTyping(false);
      if (botResponse) addMessage({ text: botResponse, isBot: true });
    }, 1500);
  };

  const generateGuidance = async (finalInput: string) => {
    // Simulate complex analysis
    setTimeout(async () => {
      const careerData = careers.find(c => 
        c.title.toLowerCase().includes(userData.interest.toLowerCase()) || 
        userData.interest.toLowerCase().includes(c.title.toLowerCase())
      ) || careers[0];

      const coaching = await getAiCoaching(userData.skills.split(",").map(s => s.trim()), { projects: userData.techStack });

      addMessage({
        text: `Based on your interest in ${userData.interest} and your background as a ${userData.level}, here is my personalized career analysis:`,
        isBot: true,
        type: "guidance"
      });

      addMessage({
        text: coaching.explanation,
        isBot: true,
        type: "coaching",
        coachingData: coaching
      });

      addMessage({
        text: "Here is your step-by-step success roadmap:",
        isBot: true,
        type: "roadmap",
        suggestedRoadmap: {
          career: careerData.title,
          steps: [
            ...coaching.actionPlan.map(a => `Master ${a}`),
            "Build 3 high-impact projects using " + userData.techStack,
            "Complete our specialized " + careerData.title + " learning path",
            "Prepare for interviews with our AI Mock Interview tool"
          ],
          careerId: careerData.id
        }
      });

      setStep(6);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-6 pt-32 pb-12">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)]">
          
          {/* Left Sidebar - Career Insights */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
            <Card className="glass border-white/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-white/5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  Mentor Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Lightbulb className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Daily Tip</h4>
                      <p className="text-xs text-slate-400 mt-1">Consistency is more important than intensity. Aim for 30 mins of coding every day.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Trophy className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Market Demand</h4>
                      <p className="text-xs text-slate-400 mt-1">Full-stack skills are up 25% in demand this quarter. React and Node.js remain top picks.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h4 className="font-bold text-sm text-white mb-4">Your Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400">Profile Completion</span>
                        <span className="text-cyan-400">{Math.min(step * 20, 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-cyan-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(step * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
              <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                Pro Mentor Advice
              </h4>
              <p className="text-xs text-slate-300 italic">
                "Technical skills get you the interview, but soft skills get you the job. Don't forget to practice your 'Tell me about yourself' story."
              </p>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <Card className="flex-1 flex flex-col glass border-white/10 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 active-gradient-animate" />
              
              <CardHeader className="border-b border-white/5 bg-slate-900/40 py-4 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center p-0.5">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                          <Bot className="h-6 w-6 text-cyan-400" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-display font-bold text-white tracking-tight">AI Career Mentor</CardTitle>
                      <CardDescription className="text-cyan-400/80 font-medium flex items-center gap-1.5 text-xs">
                        <Sparkles className="h-3 w-3" />
                        Online | Personalized Career Coach
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-slate-800/50 border-white/5 text-slate-400">
                    v2.4 AI Model
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0 relative bg-slate-950/20">
                <ScrollArea className="h-full p-6" ref={scrollRef}>
                  <div className="space-y-6 pb-4">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[85%] relative ${m.isBot ? "mr-auto" : "ml-auto"}`}>
                          <div className={`p-4 rounded-2xl ${
                            m.isBot 
                              ? "bg-slate-800/90 border border-white/10 text-slate-100 rounded-tl-none shadow-lg" 
                              : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-tr-none shadow-cyan-500/20 shadow-xl"
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{m.text}</p>
                            
                            {m.type === "roadmap" && m.suggestedRoadmap && (
                              <div className="mt-6 space-y-4">
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-purple-400" />
                                    {m.suggestedRoadmap.career} Success Plan
                                  </h4>
                                  <div className="space-y-3">
                                    {m.suggestedRoadmap.steps.map((step: string, idx: number) => (
                                      <div key={idx} className="flex gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                          {idx + 1}
                                        </div>
                                        <p className="text-xs text-slate-300">{step}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Link to={`/roadmap/${m.suggestedRoadmap.careerId}`}>
                                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold group shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]">
                                    Start This Path <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                  </Button>
                                </Link>
                              </div>
                            )}

                            {m.type === "coaching" && m.coachingData && (
                              <div className="mt-4 space-y-4 pt-4 border-t border-white/10">
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase text-cyan-400 mb-2">Expert Analysis</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {m.coachingData.actionPlan.map((item: string, i: number) => (
                                      <Badge key={i} className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[9px]">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                {m.coachingData.adjacentRoles && (
                                  <div>
                                    <h4 className="text-[10px] font-bold uppercase text-slate-500 mb-1">Adjacent Career Paths</h4>
                                    <p className="text-[10px] text-slate-400">{m.coachingData.adjacentRoles.join(", ")}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-2 block px-1">
                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-lg">
                          <div className="flex gap-1.5">
                            <motion.span 
                              animate={{ y: [0, -5, 0] }} 
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-cyan-400 rounded-full" 
                            />
                            <motion.span 
                              animate={{ y: [0, -5, 0] }} 
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-cyan-400 rounded-full" 
                            />
                            <motion.span 
                              animate={{ y: [0, -5, 0] }} 
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-cyan-400 rounded-full" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-6 border-t border-white/5 bg-slate-900/60 backdrop-blur-md">
                <div className="flex gap-3 w-full relative">
                  <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2 pointer-events-none opacity-50">
                    <Badge className="bg-slate-800 border-white/5 text-[10px]">Friendly advice</Badge>
                    <Badge className="bg-slate-800 border-white/5 text-[10px]">Skill gap analysis</Badge>
                    <Badge className="bg-slate-800 border-white/5 text-[10px]">Project ideas</Badge>
                  </div>
                  <Input 
                    placeholder="Ask about your career, skills, or projects..." 
                    className="flex-1 bg-slate-900/80 border-white/10 text-white h-12 px-5 rounded-xl focus-visible:ring-cyan-500 shadow-inner"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isTyping}
                  />
                  <Button 
                    className="h-12 w-12 rounded-xl bg-cyan-500 hover:bg-cyan-600 shrink-0 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all" 
                    onClick={handleSend} 
                    disabled={isTyping}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerMentor;
