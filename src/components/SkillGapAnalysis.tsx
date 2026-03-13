import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, BookOpen, Award, AlertTriangle } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AnimatedProgress from "@/components/AnimatedProgress";
import GlowButton from "@/components/GlowButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  recommendedCourses: string[];
  estimatedTime: string;
}

interface SkillGapAnalysisProps {
  careerId: string;
  assessmentScore: number;
  totalQuestions: number;
  onComplete?: () => void;
}

const SkillGapAnalysis = ({ careerId, assessmentScore, totalQuestions, onComplete }: SkillGapAnalysisProps) => {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    // Simulate AI analysis of skill gaps based on assessment results
    const analyzeSkillGaps = () => {
      const percentage = (assessmentScore / totalQuestions) * 100;

      // Mock skill gap data based on career and performance
      const mockGaps: SkillGap[] = [];

      if (careerId === 'software-dev') {
        mockGaps.push(
          {
            skill: "Problem Solving",
            currentLevel: Math.min(85, percentage + Math.random() * 20),
            requiredLevel: 90,
            gap: Math.max(0, 90 - (percentage + Math.random() * 20)),
            priority: percentage < 70 ? 'high' : 'medium',
            recommendedCourses: ["Algorithm Design", "Data Structures", "System Design"],
            estimatedTime: "4-6 weeks"
          },
          {
            skill: "Programming Fundamentals",
            currentLevel: Math.min(80, percentage + Math.random() * 15),
            requiredLevel: 85,
            gap: Math.max(0, 85 - (percentage + Math.random() * 15)),
            priority: 'medium',
            recommendedCourses: ["Object-Oriented Programming", "Clean Code Principles"],
            estimatedTime: "2-3 weeks"
          },
          {
            skill: "Version Control",
            currentLevel: Math.min(75, percentage + Math.random() * 25),
            requiredLevel: 80,
            gap: Math.max(0, 80 - (percentage + Math.random() * 25)),
            priority: percentage < 60 ? 'high' : 'low',
            recommendedCourses: ["Git Fundamentals", "GitHub Workflow"],
            estimatedTime: "1 week"
          }
        );
      } else if (careerId === 'data-scientist') {
        mockGaps.push(
          {
            skill: "Statistics & Probability",
            currentLevel: Math.min(82, percentage + Math.random() * 18),
            requiredLevel: 88,
            gap: Math.max(0, 88 - (percentage + Math.random() * 18)),
            priority: percentage < 75 ? 'high' : 'medium',
            recommendedCourses: ["Statistical Inference", "Probability Theory", "Hypothesis Testing"],
            estimatedTime: "6-8 weeks"
          },
          {
            skill: "Machine Learning",
            currentLevel: Math.min(78, percentage + Math.random() * 22),
            requiredLevel: 85,
            gap: Math.max(0, 85 - (percentage + Math.random() * 22)),
            priority: 'high',
            recommendedCourses: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
            estimatedTime: "8-10 weeks"
          }
        );
      }

      setSkillGaps(mockGaps);
      setLoading(false);
    };

    // Simulate loading time for AI analysis
    setTimeout(analyzeSkillGaps, 2000);
  }, [careerId, assessmentScore, totalQuestions]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">AI analyzing your skill gaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-display font-bold mb-2">Skill Gap Analysis</h2>
        <p className="text-muted-foreground">
          AI-powered analysis of skills you need to develop for your career path
        </p>
      </motion.div>

      {/* Overall Assessment */}
      <GlassCard glow className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-display font-semibold">Assessment Score</h3>
            <p className="text-2xl font-bold text-primary">{assessmentScore}/{totalQuestions}</p>
          </div>
        </div>
        <AnimatedProgress
          value={assessmentScore}
          max={totalQuestions}
          variant="primary"
          className="max-w-md mx-auto"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {skillGaps.length} skill gaps identified • Focus on high-priority areas first
        </p>
      </GlassCard>

      {/* Skill Gaps */}
      <div className="grid gap-4">
        {skillGaps.map((gap, index) => (
          <motion.div
            key={gap.skill}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-semibold">{gap.skill}</h3>
                    <Badge className={getPriorityColor(gap.priority)}>
                      {getPriorityIcon(gap.priority)}
                      <span className="ml-1 capitalize">{gap.priority} Priority</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Estimated time to close gap: {gap.estimatedTime}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Current Level</span>
                  <span className="font-medium">{Math.round(gap.currentLevel)}%</span>
                </div>
                <Progress value={gap.currentLevel} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Required Level</span>
                  <span className="font-medium">{gap.requiredLevel}%</span>
                </div>
                <Progress value={gap.requiredLevel} className="h-2 opacity-60" />

                {gap.gap > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Gap to close: {Math.round(gap.gap)}%</span>
                  </div>
                )}
              </div>

              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-border/30"
                >
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Recommended Courses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gap.recommendedCourses.map((course) => (
                      <Badge key={course} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <GlowButton
          onClick={() => setShowRecommendations(!showRecommendations)}
          variant="secondary"
        >
          {showRecommendations ? 'Hide' : 'Show'} Course Recommendations
        </GlowButton>
        {onComplete && (
          <GlowButton onClick={onComplete}>
            Continue to Roadmap
          </GlowButton>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;