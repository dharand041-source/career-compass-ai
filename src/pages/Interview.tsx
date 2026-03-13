import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { interviewQuestions } from "@/data/careers";
import GlowButton from "@/components/GlowButton";
import AnimatedProgress from "@/components/AnimatedProgress";
import Navbar from "@/components/Navbar";

const Interview = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(interviewQuestions.length).fill(""));
  const [selected, setSelected] = useState<string>("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [started, submitted]);

  const q = interviewQuestions[current];

  const handleNext = () => {
    const answer = q.type === "mcq" ? selected : fillAnswer;
    if (!answer) return;
    const newAnswers = [...answers];
    newAnswers[current] = answer;
    setAnswers(newAnswers);
    setSelected("");
    setFillAnswer("");

    if (current + 1 >= interviewQuestions.length) {
      setSubmitted(true);
      const score = newAnswers.reduce((acc, a, i) => {
        const correct = interviewQuestions[i].correctAnswer.toLowerCase().trim();
        return acc + (a.toLowerCase().trim() === correct ? 1 : 0);
      }, 0);
      navigate("/dashboard", { state: { interviewScore: score, interviewTotal: interviewQuestions.length } });
    } else {
      setCurrent(current + 1);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 pb-16 max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-10">
            <h1 className="font-display text-3xl font-bold mb-4">Interview Practice</h1>
            <p className="text-muted-foreground mb-3">20 questions: 15 MCQs + 5 fill-in-the-blank</p>
            <p className="text-sm text-destructive mb-6">⚠️ Once started, you cannot leave until you submit.</p>
            <GlowButton size="lg" onClick={() => setStarted(true)}>Begin Interview</GlowButton>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-2xl">
        <AnimatedProgress value={current + 1} max={interviewQuestions.length} className="mb-8" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass p-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${q.type === "mcq" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                {q.type === "mcq" ? "Multiple Choice" : "Fill in the Blank"}
              </span>
              <span className="text-xs text-muted-foreground">Question {current + 1}/{interviewQuestions.length}</span>
            </div>
            <h2 className="font-display text-xl font-semibold mb-6">{q.question}</h2>

            {q.type === "mcq" && q.options ? (
              <div className="space-y-3">
                {q.options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selected === opt ? "border-primary bg-primary/10 glow-primary" : "border-border bg-secondary/30 hover:border-primary/30"
                    }`}
                  >
                    <span className="text-sm">{opt}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-4 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
            )}

            <div className="mt-8 flex justify-end">
              <GlowButton
                onClick={handleNext}
                disabled={q.type === "mcq" ? !selected : !fillAnswer}
              >
                {current + 1 >= interviewQuestions.length ? "Submit Test" : "Next"}
              </GlowButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Interview;
