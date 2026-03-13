import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, Loader2, ArrowRight, Briefcase, 
  Target, GraduationCap, MapPin, Building, 
  ExternalLink, Sparkles, BookOpen, CheckCircle2,
  Trash2, Plus, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { careers } from "@/data/careers";
import { getUserProfile, Job, fetchJobsForUser } from "@/lib/jobService";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: "text" | "recommendation" | "input_request";
  recommendations?: Job[];
  suggestedCourses?: any[];
}

interface UserDetails {
  field: string;
  skills: string[];
  role: string;
  experience: string;
  location: string;
}

const JobsInternships = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Career Assistant. To help you find the best job matches, I'll need to know a bit about your career goals and skills. Shall we start?",
      isBot: true,
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    field: "",
    skills: [],
    role: "",
    experience: "",
    location: ""
  });
  const [matches, setMatches] = useState<Job[]>([]);
  const [suggestedRoadmap, setSuggestedRoadmap] = useState<any[]>([]);
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    addMessage({ text: userText, isBot: false });
    setInput("");
    setIsTyping(true);

    // AI Logic Flow
    setTimeout(async () => {
      let botResponse = "";
      let nextStep = step;

      if (step === 0) {
        botResponse = "Great! First, what is your primary career field? (e.g., Software Development, Data Science, UI/UX Design)";
        nextStep = 1;
      } else if (step === 1) {
        setUserDetails(prev => ({ ...prev, field: userText }));
        botResponse = `Excellent. For ${userText}, what technical skills do you currently have? (List them separated by commas, e.g., React, Python, SQL)`;
        nextStep = 2;
      } else if (step === 2) {
        const skills = userText.split(",").map(s => s.trim());
        setUserDetails(prev => ({ ...prev, skills }));
        botResponse = "What is your preferred job role? (e.g., Frontend Developer, Data Analyst, Product Manager)";
        nextStep = 3;
      } else if (step === 3) {
        setUserDetails(prev => ({ ...prev, role: userText }));
        botResponse = "What is your experience level? (Fresher, Student, or Experienced)";
        nextStep = 4;
      } else if (step === 4) {
        setUserDetails(prev => ({ ...prev, experience: userText }));
        botResponse = "And finally, what is your preferred job location? (e.g., Remote, San Francisco, Bangalore)";
        nextStep = 5;
      } else if (step === 5) {
        setUserDetails(prev => ({ ...prev, location: userText }));
        botResponse = "Analyzing your profile and matching with current market opportunities...";
        
        // Generate Matches
        const allJobs = await fetchJobsForUser();
        const userSkills = userDetails.skills;
        
        const scoredMatches = allJobs.map(job => {
          const matchedSkills = job.requirements.filter(req => 
            userSkills.some(s => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()))
          );
          const matchScore = Math.round((matchedSkills.length / Math.max(job.requirements.length, 1)) * 100);
          return { ...job, matchScore };
        }).sort((a, b) => b.matchScore - a.matchScore);

        setMatches(scoredMatches);
        
        // Find Skill Gaps
        const bestMatch = scoredMatches[0];
        const gaps = bestMatch.requirements.filter(req => 
          !userSkills.some(s => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()))
        );

        const careerData = careers.find(c => c.title.toLowerCase().includes(userDetails.field.toLowerCase()) || userDetails.field.toLowerCase().includes(c.title.toLowerCase()));
        
        addMessage({ 
          text: `I've found ${scoredMatches.length} job opportunities that match your profile! Here are the best ones for you.`, 
          isBot: true,
          type: "recommendation",
          recommendations: scoredMatches.slice(0, 3)
        });

        if (gaps.length > 0) {
          addMessage({
            text: `I noticed you're missing some skills for top-tier roles: ${gaps.join(", ")}. I recommend checking out these modules to boost your profile:`,
            isBot: true,
            type: "text"
          });
          
          if (careerData) {
            setSuggestedRoadmap(careerData.skills.filter(s => gaps.includes(s)).map(s => ({ name: s, careerId: careerData.id })));
          }
        }

        botResponse = "You can view all your matches in the 'Opportunities' tab. I'll continue to update these as you learn new skills!";
        nextStep = 6;
      } else {
        botResponse = "I'm here to help! Do you want to refine your search or ask about a specific role?";
      }

      setStep(nextStep);
      setIsTyping(false);
      if (botResponse) addMessage({ text: botResponse, isBot: true });
    }, 1500);
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto max-w-7xl px-6 pt-32 pb-12">
        <BackButton />
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-180px)]">
          {/* AI Assistant Chat Section */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            <Card className="flex-1 flex flex-col glass border-white/10 overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/5 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Bot className="h-5 w-5 text-cyan-400" />
                  </div>
                  AI Career Assistant
                </CardTitle>
                <CardDescription>Intelligent Job Matching & Guidance</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0 relative">
                <ScrollArea className="h-full p-4" ref={scrollRef}>
                  <div className="space-y-4 pb-4">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[85%] p-4 rounded-2xl ${
                          m.isBot 
                            ? "bg-slate-800/80 border border-white/5 text-slate-100 rounded-tl-none" 
                            : "bg-cyan-600 text-white rounded-tr-none"
                        }`}>
                          <p className="text-sm leading-relaxed">{m.text}</p>
                          
                          {m.recommendations && (
                            <div className="mt-4 space-y-3">
                              {m.recommendations.map((job, idx) => (
                                <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/5">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-xs">{job.title}</h4>
                                    <Badge className="text-[10px] h-4 bg-green-500/20 text-green-400 border-none">
                                      {job.matchScore}% Match
                                    </Badge>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mb-2">{job.company}</p>
                                  <Button size="sm" className="w-full h-7 text-[10px] bg-cyan-500 hover:bg-cyan-600">
                                    View Role
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <span className="text-[10px] opacity-40 mt-2 block">
                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-white/5">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex gap-2 w-full">
                  <Input 
                    placeholder="Type your response..." 
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isTyping}
                  />
                  <Button size="icon" className="bg-cyan-500 hover:bg-cyan-600 shrink-0" onClick={handleSend} disabled={isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Jobs & Roadmap Content Section */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            <Tabs defaultValue="matches" className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <TabsList className="bg-slate-800/50 border border-white/5">
                  <TabsTrigger value="matches" className="data-[state=active]:bg-cyan-600">
                    <Target className="h-4 w-4 mr-2" />
                    Top Matches ({matches.length})
                  </TabsTrigger>
                  <TabsTrigger value="roadmap" className="data-[state=active]:bg-purple-600">
                    <Brain className="h-4 w-4 mr-2" />
                    Skill Roadmap
                  </TabsTrigger>
                </TabsList>
                
                {userDetails.field && (
                  <div className="hidden md:flex items-center gap-2">
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                      {userDetails.field}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {userDetails.experience}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="matches" className="h-full m-0">
                  {matches.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center glass border-white/10 rounded-2xl p-12 text-center">
                      <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                        <Briefcase className="h-10 w-10 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">No active matches found</h3>
                      <p className="text-slate-400 max-w-sm">Complete the AI Assistant's assessment to see personalized job and internship opportunities.</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-full pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                        {matches.map((job) => (
                          <motion.div
                            key={job.id}
                            whileHover={{ y: -5 }}
                            className="group"
                          >
                            <Card className="glass border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Badge className="mb-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 border-none px-2 py-0 text-[10px]">
                                      {job.type}
                                    </Badge>
                                    <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                                      {job.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                      <Building className="h-3.5 w-3.5" />
                                      {job.company}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-green-400">{job.matchScore}%</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Match</div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-4 text-xs text-slate-300 mb-4 bg-white/5 p-2 rounded-lg">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                                    {job.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                                    {job.salary}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {job.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {job.requirements.slice(0, 3).map((req, i) => (
                                      <Badge key={i} variant="secondary" className="bg-slate-800 text-[10px] border-white/5">
                                        {req}
                                      </Badge>
                                    ))}
                                    {job.requirements.length > 3 && (
                                      <span className="text-[10px] text-slate-500">+{job.requirements.length - 3} more</span>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <Button className="w-full bg-slate-800 hover:bg-cyan-600 text-white border border-white/10 group-hover:border-cyan-500/50">
                                  Apply Now <ExternalLink className="h-3.5 w-3.5 ml-2" />
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="roadmap" className="h-full m-0">
                  <div className="h-full glass border-white/10 rounded-2xl p-8 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Personalized Upskilling</h3>
                        <p className="text-slate-400">Targeted modules to unlock your top matches</p>
                      </div>
                    </div>

                    {suggestedRoadmap.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 mx-auto">
                          <Brain className="h-8 w-8 text-slate-600" />
                        </div>
                        <p className="text-slate-400">Complete the assistant's flow to see your recommended learning path.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {suggestedRoadmap.map((skill, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                  <Badge className="bg-purple-500/20 text-purple-400 border-none">
                                    Required Skill
                                  </Badge>
                                  <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                      <div key={i} className="w-6 h-6 rounded-full border border-slate-900 bg-slate-700 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${skill.name}${i}`} alt="user" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{skill.name} Masterclass</h4>
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                                    12 Lessons
                                  </div>
                                  <div className="flex items-center gap-1 text-yellow-400">
                                    <Sparkles className="h-3.5 w-3.5 fill-current" />
                                    Premium Content
                                  </div>
                                </div>
                                <Link to={`/roadmap/${skill.careerId}`}>
                                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                    Start Learning <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                  </Button>
                                </Link>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 mt-8">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            <h4 className="font-bold text-white">AI Career Insight</h4>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            Completing these {suggestedRoadmap.length} modules will increase your match score for "{userDetails.role}" roles by an average of 18%, unlocking approximately 50+ new opportunities in your region.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsInternships;