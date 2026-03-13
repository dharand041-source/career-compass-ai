import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipForward, SkipBack, Presentation, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";

interface PresentationStep {
  id: string;
  title: string;
  description: string;
  component: string;
  highlights: string[];
  duration: number; // in seconds
}

const presentationSteps: PresentationStep[] = [
  {
    id: "hero",
    title: "Welcome to Career Compass AI",
    description: "The ultimate AI-powered career development platform",
    component: "Landing",
    highlights: [
      "AI-driven career guidance",
      "Personalized learning paths",
      "Smart job matching",
      "Professional portfolio building"
    ],
    duration: 8
  },
  {
    id: "assessment",
    title: "AI Career Assessment",
    description: "Intelligent evaluation of your skills and interests",
    component: "Assessment",
    highlights: [
      "Adaptive questioning algorithm",
      "Real-time skill gap analysis",
      "Personalized career recommendations",
      "Progress tracking and insights"
    ],
    duration: 10
  },
  {
    id: "roadmap",
    title: "Personalized Learning Roadmap",
    description: "Custom learning paths tailored to your career goals",
    component: "Roadmap",
    highlights: [
      "Step-by-step skill development",
      "Curated video learning modules",
      "Interactive progress tracking",
      "Adaptive learning recommendations"
    ],
    duration: 10
  },
  {
    id: "dashboard",
    title: "Interactive Career Dashboard",
    description: "Comprehensive overview of your career development",
    component: "Dashboard",
    highlights: [
      "Gamification with points and badges",
      "Skill progress visualization",
      "Learning streaks and achievements",
      "Career growth insights"
    ],
    duration: 12
  },
  {
    id: "chatbot",
    title: "AI Career Mentor Chatbot",
    description: "24/7 intelligent career guidance and support",
    component: "Chatbot",
    highlights: [
      "Natural language conversations",
      "Career advice and skill recommendations",
      "Resume and interview preparation",
      "Platform navigation assistance"
    ],
    duration: 8
  },
  {
    id: "jobs",
    title: "Smart Job Matching",
    description: "AI-powered job recommendations based on your profile",
    component: "Jobs",
    highlights: [
      "Skill-based job matching",
      "Personalized opportunity filtering",
      "Application tracking",
      "Interview preparation tips"
    ],
    duration: 8
  },
  {
    id: "portfolio",
    title: "Project Portfolio Builder",
    description: "Showcase your projects and skills professionally",
    component: "Portfolio",
    highlights: [
      "Project showcase with live demos",
      "Technology skill highlighting",
      "GitHub integration",
      "Professional presentation"
    ],
    duration: 8
  },
  {
    id: "leaderboard",
    title: "Gamification & Community",
    description: "Compete, learn, and grow with fellow developers",
    component: "Leaderboard",
    highlights: [
      "Points and achievement system",
      "Learning streaks and badges",
      "Community competition",
      "Motivational progress tracking"
    ],
    duration: 8
  }
];

interface PresentationModeProps {
  isActive: boolean;
  onClose: () => void;
  currentPage?: string;
}

const PresentationMode = ({ isActive, onClose, currentPage = "Landing" }: PresentationModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(presentationSteps[0].duration);

  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next step
          setCurrentStep((current) => {
            const next = (current + 1) % presentationSteps.length;
            setTimeLeft(presentationSteps[next].duration);
            return next;
          });
          return presentationSteps[(currentStep + 1) % presentationSteps.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPlaying, currentStep]);

  const nextStep = () => {
    const next = (currentStep + 1) % presentationSteps.length;
    setCurrentStep(next);
    setTimeLeft(presentationSteps[next].duration);
  };

  const prevStep = () => {
    const prev = currentStep === 0 ? presentationSteps.length - 1 : currentStep - 1;
    setCurrentStep(prev);
    setTimeLeft(presentationSteps[prev].duration);
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
    setTimeLeft(presentationSteps[index].duration);
  };

  if (!isActive) return null;

  const step = presentationSteps[currentStep];
  const progress = ((presentationSteps.length - 1 - currentStep) / (presentationSteps.length - 1)) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Presentation className="h-5 w-5" />
                <span className="font-display font-semibold">Demo Mode</span>
              </div>
              <div className="text-white/70 text-sm">
                Step {currentStep + 1} of {presentationSteps.length}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
              initial={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center h-full px-6">
          <div className="max-w-4xl w-full">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Step Content */}
              <GlassCard className="p-8 mb-8" glow>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-primary">FEATURE SHOWCASE</span>
                  </div>

                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 gradient-text">
                    {step.title}
                  </h1>

                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {step.description}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {step.highlights.map((highlight, index) => (
                      <motion.div
                        key={highlight}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-sm">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Timer */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Next feature in:</span>
                    <span className="font-mono text-primary font-semibold">{timeLeft}s</span>
                  </div>
                </motion.div>
              </GlassCard>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <SkipBack className="h-4 w-4" />
                  Previous
                </Button>

                {/* Step Indicators */}
                <div className="flex gap-2">
                  {presentationSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-primary'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-center text-white/70 text-sm">
            Press ESC to exit demo mode • Use arrow keys to navigate
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PresentationMode;