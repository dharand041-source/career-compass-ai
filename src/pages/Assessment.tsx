import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { generateQuestions, careers } from "@/data/careers";
import GlowButton from "@/components/GlowButton";
import AnimatedProgress from "@/components/AnimatedProgress";
import Navbar from "@/components/Navbar";
import SkillGapAnalysis from "@/components/SkillGapAnalysis";
import { updateUserProgress } from "@/lib/jobService";

const Assessment = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const navigate = useNavigate();
  const questions = generateQuestions(careerId || "software-dev");
  const career = careers.find((c) => c.id === careerId);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showSkillGap, setShowSkillGap] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (current + 1 >= questions.length) {
      const score = newAnswers.reduce((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0);
      setAssessmentScore(score);
      setShowSkillGap(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const handleSkillGapComplete = () => {
    navigate(`/roadmap/${careerId}`, { state: { score: assessmentScore, total: questions.length } });
  };

  if (showSkillGap) {
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
          <SkillGapAnalysis
            careerId={careerId || "software-dev"}
            assessmentScore={assessmentScore}
            totalQuestions={questions.length}
            onComplete={handleSkillGapComplete}
          />
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-2xl">
        <AnimatedProgress value={current + 1} max={questions.length} className="mb-8" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-2">
          <span className="text-sm text-primary font-medium">{career?.icon} {career?.title} Assessment</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass p-8"
          >
            <p className="text-xs text-muted-foreground mb-2">Question {current + 1} of {questions.length}</p>
            <h2 className="font-display text-xl font-semibold mb-6">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selected === i
                      ? "border-primary bg-primary/10 glow-primary"
                      : "border-border bg-secondary/30 hover:border-primary/30"
                  }`}
                >
                  <span className="text-sm">{opt}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <GlowButton onClick={handleNext} disabled={selected === null}>
                {current + 1 >= questions.length ? "Submit Assessment" : "Next Question"}
              </GlowButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;
