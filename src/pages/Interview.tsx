import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { careers, getVoiceQuestions, VoiceInterviewQuestion } from "@/data/careers";
import GlowButton from "@/components/GlowButton";
import AnimatedProgress from "@/components/AnimatedProgress";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Mic, MicOff, Volume2, Play, CheckCircle, RefreshCcw, ArrowRight, Briefcase, Star, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Enhanced Storage Helper
const LocalDB = {
  saveInterview: (record: any) => {
    const existing = JSON.parse(localStorage.getItem("learn2hire_interviews") || "[]");
    localStorage.setItem("learn2hire_interviews", JSON.stringify([...existing, record]));
  },
  getInterviews: () => JSON.parse(localStorage.getItem("learn2hire_interviews") || "[]"),
  saveModuleProgress: (careerId: string, modId: string) => {
    const key = `module_complete_${careerId}_${modId}`;
    localStorage.setItem(key, "true");
  }
};

interface EvaluationResult {
  score: number;
  status: "Correct" | "Partially Correct" | "Needs Improvement";
  semanticScore: number;
}

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Interview = () => {
  const navigate = useNavigate();
  const { careerId } = useParams();
  
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState<VoiceInterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<{ 
    question: string; 
    answer: string; 
    score: number; 
    status: string;
    expected: string;
  }[]>([]);
  
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  // Load role-specific questions
  useEffect(() => {
    if (careerId) {
      const roleQuestions = getVoiceQuestions(careerId);
      setQuestions(roleQuestions);
    }
  }, [careerId]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        if (event.error === "not-allowed") {
          setError("Microphone access denied. Please enable it in your settings.");
        }
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    } else {
      setError("Speech Recognition is not supported in this browser. Please use Chrome.");
    }
  }, []);

  const evaluateAnswer = (userText: string, question: VoiceInterviewQuestion): EvaluationResult => {
    const normalizedUser = userText.toLowerCase();
    const keywords = question.keywords.map(k => k.toLowerCase());
    
    let matchedCount = 0;
    keywords.forEach(keyword => {
      if (normalizedUser.includes(keyword)) matchedCount++;
    });

    const keywordScore = matchedCount / keywords.length;
    
    // Semantic similarity threshold: 60%
    if (keywordScore >= 0.8) {
      return { score: 1, status: "Correct", semanticScore: Math.round(keywordScore * 100) };
    } else if (keywordScore >= 0.4) {
      return { score: 0.5, status: "Partially Correct", semanticScore: Math.round(keywordScore * 100) };
    } else {
      return { score: 0, status: "Needs Improvement", semanticScore: Math.round(keywordScore * 100) };
    }
  };

  const speakQuestion = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      startListening();
    };
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript("");
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleStart = () => {
    if (questions.length === 0) return;
    setStarted(true);
    setTimeout(() => speakQuestion(questions[0].question), 500);
  };

  const handleEvaluate = () => {
    stopListening();
    const evaluation = evaluateAnswer(transcript, questions[current]);
    setCurrentEvaluation(evaluation);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!currentEvaluation) return;

    const newAnswers = [...answers, { 
      question: questions[current].question, 
      answer: transcript || "No verbal response.",
      score: currentEvaluation.score,
      status: currentEvaluation.status,
      expected: questions[current].referenceAnswer
    }];
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTranscript("");
      setShowFeedback(false);
      setCurrentEvaluation(null);
      setTimeout(() => speakQuestion(questions[current + 1].question), 500);
    } else {
      // Finalize and save to "DB"
      const totalScore = newAnswers.reduce((acc, curr) => acc + curr.score, 0);
      const record = {
        user_id: "current_user",
        job_role: careerId,
        total_questions: questions.length,
        earned_points: totalScore,
        details: newAnswers,
        timestamp: new Date().toISOString()
      };
      LocalDB.saveInterview(record);
      setCompleted(true);
      toast.success("Interview completed and saved to your history!");
    }
  };

  const resetInterview = () => {
    setCurrent(0);
    setAnswers([]);
    setTranscript("");
    setStarted(false);
    setCompleted(false);
    setShowFeedback(false);
    setCurrentEvaluation(null);
  };

  const currentRole = careers.find(c => c.id === careerId);

  // Selection Screen
  if (!careerId) {
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl font-bold mb-4 text-center">Select Your Career Stream</h1>
            <p className="text-slate-400 text-center mb-12">Choose a stream to start your specialized AI Voice Interview Evaluation</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {careers.map((career) => (
                <motion.div
                  key={career.id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/interview/${career.id}`)}
                  className="glass-strong p-6 cursor-pointer border-white/5 hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">{career.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{career.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{career.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Arrival/Landing Screen
  if (!started) {
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16 max-w-2xl text-center">
          <BackButton className="mb-6" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong p-10 border-white/10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
                <Volume2 className="h-10 w-10 text-primary" />
                <div className="absolute -bottom-1 -right-1 bg-accent text-[10px] font-bold px-2 py-1 rounded-md text-white">
                  REAL-TIME EVAL
                </div>
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {currentRole?.title} Trainer
            </h1>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Answer out loud. Our AI will analyze your content relevance, check key concepts, and provide immediate scoring for each answer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-lg bg-green-500/20"><Star className="h-5 w-5 text-green-400" /></div>
                <div>
                  <p className="text-sm font-semibold text-white">Score Accuracy</p>
                  <p className="text-xs text-slate-400">Keyword-based evaluation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-lg bg-purple-500/20"><Play className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-sm font-semibold text-white">Instant Feedback</p>
                  <p className="text-xs text-slate-400">See results immediately</p>
                </div>
              </div>
            </div>
            <GlowButton size="lg" onClick={handleStart} className="w-full">
              Begin Evaluation Session
            </GlowButton>
          </motion.div>
        </div>
      </div>
    );
  }

  // Summary Screen
  if (completed) {
    const totalPoints = answers.reduce((acc, curr) => acc + curr.score, 0);
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-8">
            <div className="flex items-start justify-between mb-12">
              <div>
                <h1 className="font-display text-4xl font-bold mb-2">Final Performance</h1>
                <p className="text-slate-400">Detailed breakdown of your {currentRole?.title} interview</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-primary">{totalPoints} <span className="text-2xl text-slate-600">/ {questions.length}</span></div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-2">Overall Score</p>
              </div>
            </div>

            <div className="space-y-8">
              {answers.map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-bold text-xl ${
                      item.status === 'Correct' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      item.status === 'Partially Correct' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="w-full space-y-6">
                      <div>
                        <p className="text-xl font-semibold text-white mb-2">{item.question}</p>
                        <div className="flex gap-4">
                           <Badge variant="outline" className="bg-white/5">{item.score} Point</Badge>
                           <Badge variant="secondary" className={
                             item.status === 'Correct' ? 'bg-green-500/20 text-green-400' :
                             item.status === 'Partially Correct' ? 'bg-yellow-500/20 text-yellow-400' :
                             'bg-red-500/20 text-red-400'
                           }>{item.status}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Answer</p>
                          <p className="text-slate-200 leading-relaxed italic">"{item.answer}"</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-primary uppercase tracking-widest">Expected Concepts</p>
                          <p className="text-slate-400 text-sm leading-relaxed">{item.expected}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-6">
              <GlowButton onClick={() => navigate("/dashboard")} variant="secondary">Dashboard</GlowButton>
              <GlowButton onClick={resetInterview}>Try Another Stream</GlowButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active Questions and Immediate Feedback
  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-16 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-widest mb-1">{currentRole?.title} AI Evaluation</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">Question {current + 1}</span>
              <span className="text-sm text-slate-600">of {questions.length}</span>
            </div>
          </div>
          <AnimatedProgress value={current + 1} max={questions.length} className="w-32" />
        </div>

        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong p-10 relative overflow-hidden"
            >
              {isListening && (
                 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 overflow-hidden">
                    <motion.div 
                      className="w-full h-full bg-primary"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                 </div>
              )}

              <div className="mb-10 text-center">
                <div className={`w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-all duration-500 ${isSpeaking ? "bg-primary/20 scale-110 glow-primary" : "bg-white/5"}`}>
                  <Volume2 className={`h-8 w-8 ${isSpeaking ? "text-primary" : "text-slate-400"}`} />
                </div>
                <h2 className="text-3xl font-display font-bold leading-tight">
                  {questions[current]?.question}
                </h2>
              </div>

              <div className="relative mb-10">
                <div className={`min-h-[140px] p-6 rounded-2xl bg-white/5 border transition-all duration-300 ${isListening ? "border-primary/50 bg-primary/5" : "border-white/10"}`}>
                   <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-slate-600"}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {isListening ? "Capturing Voice..." : "Ready for Answer"}
                      </span>
                   </div>
                   <p className={`text-xl font-medium leading-relaxed ${!transcript ? "text-slate-600 italic" : "text-white"}`}>
                    {transcript || "The AI is listening to your answer..."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <GlowButton 
                  onClick={handleEvaluate}
                  className="flex-1 py-4 text-lg"
                  disabled={isSpeaking || !transcript}
                >
                  Evaluate Answer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GlowButton>
                {!isListening && !isSpeaking && (
                   <button onClick={startListening} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <RefreshCcw className="h-6 w-6 text-primary" />
                   </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong p-10 border-primary/20 shadow-2xl relative"
            >
              <div className={`absolute top-0 right-10 -translate-y-1/2 px-6 py-2 rounded-full font-bold text-white shadow-xl ${
                 currentEvaluation?.status === 'Correct' ? 'bg-green-500' :
                 currentEvaluation?.status === 'Partially Correct' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {currentEvaluation?.status}
              </div>

              <div className="flex items-center gap-4 mb-8">
                 {currentEvaluation?.status === 'Correct' ? <CheckCircle2 className="h-8 w-8 text-green-400" /> :
                  currentEvaluation?.status === 'Partially Correct' ? <AlertCircle className="h-8 w-8 text-yellow-400" /> :
                  <XCircle className="h-8 w-8 text-red-400" /> }
                 <div>
                    <h3 className="text-2xl font-bold">Answer Evaluation</h3>
                    <p className="text-slate-400">Similarity Match: {currentEvaluation?.semanticScore}%</p>
                 </div>
              </div>

              <div className="space-y-6 mb-10">
                 <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Technical Content Accuracy</p>
                    <div className="flex items-center gap-4">
                       <span className="text-4xl font-bold text-primary">+{currentEvaluation?.score}</span>
                       <p className="text-sm text-slate-400">point awarded for this question based on technical relevance.</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Expected Key Concepts</p>
                       <p className="text-slate-300 leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10">
                          {questions[current].referenceAnswer}
                       </p>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Captured Response</p>
                       <p className="text-slate-400 italic">"{transcript}"</p>
                    </div>
                 </div>
              </div>

              <GlowButton onClick={handleNext} className="w-full py-4">
                {current + 1 >= questions.length ? "View Final Summary" : "Next Question"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </GlowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Interview;
