import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, Loader2, Play, AlertCircle, Send, User, Bot, StopCircle, CheckCircle2 } from 'lucide-react';

// For browser compatibility with Web Speech API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const VoiceInterviewTrainer: React.FC = () => {
  // State variables for managing the interview flow
  const [aiQuestion, setAiQuestion] = useState<string>("Welcome to your AI mock interview. I will be your interviewer today. Are you ready to begin?");
  const [candidateAnswer, setCandidateAnswer] = useState<string>("");
  
  // Status flags
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const answerRef = useRef<string>("");

  // Keep ref in sync with state for accurate submission inside callbacks
  useEffect(() => {
    answerRef.current = candidateAnswer;
  }, [candidateAnswer]);

  // Handle voices changing (some browsers load voices asynchronously)
  useEffect(() => {
    const handleVoicesChanged = () => {
       window.speechSynthesis.getVoices();
    };
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }
    return () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = null;
        }
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let fullText = Array.from(event.results)
             .map((result: any) => result[0].transcript)
             .join('');
        setCandidateAnswer(fullText);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech') {
            setError(`Microphone error: ${event.error}. Please ensure microphone permissions are granted.`);
            setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Only set to false if we didn't intentionally stop it
        // and we aren't starting it again
        if (isListening) {
           // In some browsers, continuous speech might stop automatically after a pause
           // We keep the state synced manually in our toggle function to handle submission
        }
      };

      recognitionRef.current = recognition;
    } else {
      setError("Your browser does not support Speech Recognition. Please try a modern browser like Google Chrome or Edge.");
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      setError("Your browser does not support Text-to-Speech playback.");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      // Try to select a professional sounding voice
      const preferredVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'))) 
                           || voices.find(v => v.lang.startsWith('en'));
      
      if (preferredVoice) {
          utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
        setError("Failed to play audio. The browser might have blocked auto-playback.");
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
        setIsSpeaking(false);
        setError(`Audio playback error: ${err.message}`);
    }
  }, []);

  // Automatically start speaking when the interview question changes
  useEffect(() => {
    if (interviewStarted && aiQuestion) {
      speakText(aiQuestion);
    }
  }, [aiQuestion, interviewStarted, speakText]);

  const startInterview = () => {
    setInterviewStarted(true);
    setError(null);
    // Note: useEffect will trigger speakText since interviewStarted changes
  };

  const submitAnswer = async (finalText: string) => {
    if (!finalText.trim()) {
        setError("Please provide an answer before stopping the recording.");
        return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // MOCK BACKEND API EVALUATION
      // In a real application, replace this with a fetch request to your Python backend:
      /*
      const response = await fetch('/api/interview/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer: finalText })
      });
      if (!response.ok) throw new Error("Failed to evaluate answer");
      const data = await response.json();
      const nextQuestion = data.nextQuestion;
      */

      // Simulating a network request delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Select a random mock next question
      const mockResponses = [
          "That's a very clear answer. Can you expand on the technical challenges you faced during that process?",
          "Interesting approach. How would you handle a situation where your team strongly disagreed with this method?",
          "I understand. Let's pivot slightly. Describe a time when you had to learn a completely new framework under a tight deadline.",
          "Great example. What metrics did you use to measure the success of that project?",
          "Thank you for sharing that context. Moving on, how do you prioritize tasks when you have multiple urgent deadlines?"
      ];
      const nextQuestion = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      setCandidateAnswer("");
      setAiQuestion(nextQuestion);
      // Removed manual speakText call because useEffect will handle it automatically
      
    } catch (err: any) {
      setError(`Failed to process answer with AI: ${err.message || "Unknown API error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      // STOP recording and AUTO-SUBMIT the text
      setIsListening(false);
      if (recognitionRef.current) {
         try { recognitionRef.current.stop(); } catch(e) {}
      }
      
      // Pass the current value of the answer using the ref
      const currentAnswerText = answerRef.current;
      if (currentAnswerText.trim() === "") {
         setError("No speech was detected. Please try recording again.");
      } else {
         submitAnswer(currentAnswerText);
      }
    } else {
      // START recording
      setError(null);
      
      // Prevent listening if AI is speaking or processing
      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }
      
      if (recognitionRef.current) {
        try {
            setCandidateAnswer("");
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e: any) {
            setError(`Failed to access microphone: ${e.message}`);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col font-sans text-slate-100">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500 tracking-tight pb-2">
          AI Voice Interview Trainer
        </h2>
        <p className="text-slate-400 mt-2 text-base max-w-2xl mx-auto">
          Experience a realistic, turn-based technical interview. the AI will speak the questions, and you will reply using your microphone.
        </p>
      </div>

      {/* Global Error Display */}
      {error && (
        <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.05)]">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Main Two-Panel Layout Container */}
      <div className="flex flex-col gap-6 lg:gap-8 flex-1">
        
        {/* TOP BOX: AI Question Box */}
        <div className={`relative flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden shadow-xl min-h-[160px] md:min-h-[220px]
          ${isSpeaking ? 'bg-indigo-900/20 border-indigo-500/50 shadow-indigo-500/20' : 'bg-slate-900/60 border-slate-700/50 backdrop-blur-md'}`}
        >
          {/* Box Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-300
            ${isSpeaking ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl flex items-center justify-center transition-colors duration-300
                ${isSpeaking ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-700/60 text-slate-300'}`}>
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold tracking-wide">AI Question Box</h3>
            </div>
            
            {/* AI Status Indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-semibold tracking-wide uppercase">Speaking</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-semibold tracking-wide uppercase">Evaluating...</span>
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-6 md:p-8 flex-1 flex items-center justify-center relative">
            {!interviewStarted ? (
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 mb-6 text-lg">Click start to initialize the AI Mock Interview system.</p>
                <button
                  onClick={startInterview}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Interview</span>
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[100px]">
                 <p className={`text-xl md:text-3xl font-medium leading-relaxed transition-all duration-300 transform 
                   ${isProcessing ? 'text-slate-500 scale-95 blur-[2px]' : 'text-slate-100 scale-100 blur-0'}
                   ${isSpeaking ? 'text-indigo-100' : ''}`}
                 >
                   {isProcessing ? "Analyzing your answer and generating feedback..." : aiQuestion}
                 </p>
              </div>
            )}
          </div>
          
          {/* Speaking Audio Visualizer effect on bottom border */}
          {isSpeaking && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse shadow-[0_-5px_20px_rgba(99,102,241,0.5)]" />
          )}
        </div>

        {/* BOTTOM BOX: Candidate Answer Box */}
        <div className={`relative flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden shadow-xl min-h-[200px] md:min-h-[260px]
          ${isListening ? 'bg-cyan-900/10 border-cyan-500/50 shadow-cyan-500/10' : 'bg-slate-900/60 border-slate-700/50 backdrop-blur-md'}
          ${!interviewStarted || isProcessing ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}
        >
          {/* Box Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-300
            ${isListening ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl flex items-center justify-center transition-colors duration-300
                ${isListening ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-700/60 text-slate-300'}`}>
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold tracking-wide">Candidate Answer Box</h3>
            </div>
            
            {/* Recording Indicator */}
            {isListening ? (
              <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20 animate-pulse">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
                <span className="text-sm font-semibold tracking-wide uppercase">Recording Live...</span>
              </div>
            ) : (
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide px-3 py-1.5">
                  Mic Standby
                </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-6 md:p-8 flex-1 flex flex-col relative">
            <div className="flex-1 w-full relative min-h-[120px]">
              {candidateAnswer ? (
                <p className="text-lg md:text-2xl text-cyan-100 font-medium leading-relaxed w-full whitespace-pre-wrap">
                  {candidateAnswer}
                </p>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-lg md:text-xl font-medium px-4 text-center">
                  {isSpeaking ? "Listen to the interviewer..." : isListening ? "Speak clearly into your microphone..." : "Waiting for your response. Click the microphone to begin."}
                </div>
              )}
            </div>

            {/* Action Bar */}
            {interviewStarted && (
              <div className="mt-8 flex flex-col items-center justify-center pt-6 border-t border-slate-700/50">
                
                {/* Prominent Microphone Button with Pulsing Effect */}
                <div className="relative mb-4">
                  {isListening && (
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-20 transform scale-[2.5]" />
                  )}
                  {isListening && (
                    <div className="absolute inset-0 bg-cyan-500 rounded-full animate-pulse opacity-40 transform scale-[1.5]" />
                  )}
                  <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`relative z-10 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-slate-900 
                      ${isListening 
                        ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110' 
                        : 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 focus:ring-cyan-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)]'}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isListening ? "Stop listening and submit" : "Start speaking"}
                  >
                    {isListening ? (
                      <StopCircle className="w-10 h-10 md:w-12 md:h-12" />
                    ) : (
                      <Mic className="w-10 h-10 md:w-12 md:h-12" />
                    )}
                  </button>
                </div>

                <div className="text-center">
                    {isListening ? (
                        <span className="text-red-400 font-bold uppercase tracking-widest text-sm animate-pulse">
                            Tap Mic to Stop & Submit
                        </span>
                    ) : (
                        <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                            Tap Mic to Answer
                        </span>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
