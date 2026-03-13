import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play, ArrowRight } from "lucide-react";
import { useState } from "react";
import { careers } from "@/data/careers";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import AnimatedProgress from "@/components/AnimatedProgress";
import Navbar from "@/components/Navbar";

const Roadmap = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const location = useLocation();
  const career = careers.find((c) => c.id === careerId);
  const { score = 8, total = 15 } = (location.state as { score: number; total: number }) || {};
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const percentage = Math.round((score / total) * 100);
  const level = percentage >= 80 ? "Advanced" : percentage >= 50 ? "Intermediate" : "Beginner";

  const toggleComplete = (i: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  if (!career) return null;

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        {/* Score summary */}
        <GlassCard glow className="mb-8 text-center">
          <span className="text-5xl mb-3 block">{career.icon}</span>
          <h1 className="font-display text-2xl font-bold mb-1">{career.title} — Assessment Results</h1>
          <p className="text-muted-foreground text-sm mb-4">
            You scored <span className="text-accent font-bold">{score}/{total}</span> — Level: <span className="text-primary font-semibold">{level}</span>
          </p>
          <AnimatedProgress value={score} max={total} variant="accent" className="max-w-md mx-auto" />
        </GlassCard>

        {/* Roadmap */}
        <h2 className="font-display text-xl font-semibold mb-6">
          Your Personalized <span className="gradient-text">Skill Roadmap</span>
        </h2>

        <div className="space-y-4">
          {career.skills.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard hover={false} className="flex items-center gap-4">
                <button onClick={() => toggleComplete(i)} className="shrink-0">
                  {completed.has(i) ? (
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-display font-semibold ${completed.has(i) ? "text-accent line-through" : ""}`}>
                    {skill}
                  </h3>
                  <p className="text-xs text-muted-foreground">Module {i + 1} of {career.skills.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial for beginners")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Play className="h-3.5 w-3.5" /> Watch
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/interview">
            <GlowButton className="flex items-center gap-2">
              Start Interview Prep <ArrowRight className="h-4 w-4" />
            </GlowButton>
          </Link>
          <Link to="/dashboard">
            <GlowButton variant="secondary">Go to Dashboard</GlowButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
