import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, FileText, Briefcase, Trophy, Target, TrendingUp } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AnimatedProgress from "@/components/AnimatedProgress";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const location = useLocation();
  const { interviewScore = 14, interviewTotal = 20 } = (location.state as any) || {};

  const stats = [
    { icon: Target, label: "Career Path", value: "Software Dev", color: "text-primary" },
    { icon: BookOpen, label: "Skills Learned", value: "5 / 8", color: "text-accent" },
    { icon: TrendingUp, label: "Interview Score", value: `${interviewScore}/${interviewTotal}`, color: "text-primary" },
    { icon: Trophy, label: "Leaderboard Rank", value: "#10", color: "text-accent" },
    { icon: FileText, label: "Resume Score", value: "72 / 100", color: "text-primary" },
    { icon: Briefcase, label: "Job Matches", value: "8", color: "text-accent" },
  ];

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-1">Welcome back! 👋</h1>
          <p className="text-muted-foreground mb-8">Here's your career development overview.</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((s, i) => (
            <GlassCard key={s.label} delay={i * 0.05} className="text-center p-4">
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <p className="font-display text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Progress sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard delay={0.2}>
            <h3 className="font-display font-semibold mb-4">Learning Progress</h3>
            <AnimatedProgress value={62} variant="primary" className="mb-4" />
            <p className="text-sm text-muted-foreground">5 of 8 skill modules completed</p>
            <Link to="/roadmap/software-dev" className="inline-block mt-4">
              <GlowButton variant="secondary" size="sm">Continue Learning</GlowButton>
            </Link>
          </GlassCard>

          <GlassCard delay={0.3}>
            <h3 className="font-display font-semibold mb-4">Resume Score</h3>
            <AnimatedProgress value={72} variant="accent" className="mb-4" />
            <p className="text-sm text-muted-foreground">Add more project descriptions to improve your score.</p>
            <Link to="/resume" className="inline-block mt-4">
              <GlowButton variant="secondary" size="sm">Improve Resume</GlowButton>
            </Link>
          </GlassCard>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/interview">
            <GlassCard className="text-center cursor-pointer">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Interview Prep</p>
            </GlassCard>
          </Link>
          <Link to="/jobs">
            <GlassCard className="text-center cursor-pointer" delay={0.1}>
              <Briefcase className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Browse Jobs</p>
            </GlassCard>
          </Link>
          <Link to="/leaderboard">
            <GlassCard className="text-center cursor-pointer" delay={0.2}>
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Leaderboard</p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
