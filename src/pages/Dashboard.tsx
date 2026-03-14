import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, FileText, Briefcase, Trophy, Target, TrendingUp, Award, Flame, Star, Calendar, Zap, Users, Sparkles } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AnimatedProgress from "@/components/AnimatedProgress";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { careers } from "@/data/careers";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";

interface DashboardState {
  interviewScore?: number;
  interviewTotal?: number;
}

const Dashboard = () => {
  const { user: supabaseUser, loading: supabaseLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check local backend token
      const localToken = localStorage.getItem("authToken");
      if (localToken) {
        setIsAuthenticated(true);
        setAuthLoading(false);
        return;
      }

      // 2. Fallback to Supabase
      if (!supabaseLoading) {
        if (supabaseUser) {
          setIsAuthenticated(true);
        } else {
          navigate("/auth");
        }
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [supabaseUser, supabaseLoading, navigate]);

  const [realStats, setRealStats] = useState({
    careerPath: "Not Started",
    skillsLearned: 0,
    totalSkills: 0,
    interviewScore: 0,
    interviewTotal: 0,
    resumeScore: 0,
    jobMatches: 0,
    level: 1,
    xp: 0,
    xpToNext: 1000,
    badges: [] as string[],
    recentActivity: [] as any[]
  });

  useEffect(() => {
    // 1. Get interview data
    const interviews = JSON.parse(localStorage.getItem("learn2hire_interviews") || "[]");
    const lastInterview = interviews[interviews.length - 1];
    const totalInterviewPoints = interviews.reduce((acc: number, curr: any) => acc + curr.earned_points, 0);
    const totalPossiblePoints = interviews.reduce((acc: number, curr: any) => acc + curr.total_questions, 0);
    
    // 2. Scan module progress
    let completedModules = 0;
    const moduleKeys = Object.keys(localStorage).filter(k => k.startsWith("module_complete_"));
    completedModules = moduleKeys.length;

    // 3. Determine Career Path (from last interview or just generic)
    const activeCareerId = lastInterview?.job_role || "software-dev";
    const career = careers.find(c => c.id === activeCareerId);
    const totalModules = career?.skills.length || 8;

    // 4. Calculate XP and Level
    // Base: 100 XP per interview, 50 XP per module
    const calculatedXp = (interviews.length * 100) + (completedModules * 50);
    const calculatedLevel = Math.floor(calculatedXp / 1000) + 1;
    const xpToNext = calculatedLevel * 1000;

    // 5. Dynamic Badges
    const badges = [];
    if (interviews.length > 0) badges.push("Interview Ready");
    if (completedModules > 0) badges.push("Skill Builder");
    if (calculatedLevel > 1) badges.push("Level Up");

    setRealStats({
      careerPath: career?.title || "Not Started",
      skillsLearned: completedModules,
      totalSkills: totalModules,
      interviewScore: totalInterviewPoints,
      interviewTotal: totalPossiblePoints,
      resumeScore: 65, // Static for now until resume parser is real
      jobMatches: 0, // Will be updated by real job logic
      level: calculatedLevel,
      xp: calculatedXp,
      xpToNext: xpToNext,
      badges: badges,
      recentActivity: interviews.slice(-3).map((inv: any) => ({
        title: `${inv.job_role} Interview`,
        xp: 100,
        time: new Date(inv.timestamp).toLocaleDateString()
      }))
    });
  }, []);

  const stats = [
    { icon: Target, label: "Career Path", value: realStats.careerPath, color: "text-primary" },
    { icon: BookOpen, label: "Skills Learned", value: `${realStats.skillsLearned} / ${realStats.totalSkills}`, color: "text-accent" },
    { icon: TrendingUp, label: "Interview Success", value: realStats.interviewTotal > 0 ? `${Math.round((realStats.interviewScore/realStats.interviewTotal)*100)}%` : "0%", color: "text-primary" },
    { icon: Trophy, label: "Points Earned", value: realStats.interviewScore.toString(), color: "text-accent" },
    { icon: FileText, label: "Resume Analysis", value: "N/A", color: "text-primary" },
    { icon: Briefcase, label: "Matches", value: realStats.jobMatches.toString(), color: "text-accent" },
  ];

  // Dynamic Skill Progress based on completed modules
  const skillProgress = Object.keys(localStorage)
    .filter(k => k.startsWith("module_complete_"))
    .map(key => {
      const parts = key.split("_");
      const name = parts[parts.length - 1].replace(/-/g, " ");
      return { name: name.charAt(0).toUpperCase() + name.slice(1), progress: 100, level: 'Completed' };
    }).slice(0, 4);

  const displaySkills = skillProgress.length > 0 ? skillProgress : [
    { name: 'Initial Assessment', progress: 100, level: 'Beginner' }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-display text-3xl font-bold">Welcome back! 👋</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Level {realStats.level}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {realStats.xp} XP
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground mb-8">Here's your career development overview.</p>
        </motion.div>

        {/* Level Progress */}
        <GlassCard glow className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Level {realStats.level} Progress</h3>
              <p className="text-sm text-muted-foreground">
                {realStats.xpToNext - realStats.xp} XP to next level
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{realStats.xp}/{realStats.xpToNext}</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
          </div>
          <Progress value={(realStats.xp / realStats.xpToNext) * 100} className="h-3" />
        </GlassCard>

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

        {/* Gamification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Streaks */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="font-display font-semibold">Learning Streaks</h3>
                <p className="text-sm text-muted-foreground">Keep the momentum going!</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Streak</span>
                <Badge variant="secondary">1 day</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Longest Streak</span>
                <Badge variant="outline">1 day</Badge>
              </div>
            </div>
          </GlassCard>

          {/* Badges */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-display font-semibold">Achievements</h3>
                <p className="text-sm text-muted-foreground">{realStats.badges.length} badges earned</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {realStats.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  🏆 {badge}
                </Badge>
              ))}
              {realStats.badges.length === 0 && <span className="text-xs text-slate-500 italic">No badges yet...</span>}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-display font-semibold">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest interview sessions</p>
              </div>
            </div>
            <div className="space-y-2">
              {realStats.recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate">{activity.title}</span>
                  <Badge variant="outline" className="text-xs">{activity.time}</Badge>
                </div>
              ))}
              {realStats.recentActivity.length === 0 && <span className="text-xs text-slate-500 italic">No activity recorded...</span>}
            </div>
          </GlassCard>
        </div>

        {/* Skill Progress */}
        <GlassCard className="mb-8">
          <h3 className="font-display font-semibold mb-6 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skill Development Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displaySkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant="secondary" className="text-xs">{skill.level}</Badge>
                </div>
                <Progress value={skill.progress} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">{skill.progress}% complete</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Progress sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard delay={0.2}>
            <h3 className="font-display font-semibold mb-4">Learning Progress</h3>
            <AnimatedProgress value={realStats.totalSkills > 0 ? (realStats.skillsLearned / realStats.totalSkills) * 100 : 0} variant="primary" className="mb-4" />
            <p className="text-sm text-muted-foreground">{realStats.skillsLearned} of {realStats.totalSkills} modules completed</p>
            <div className="flex items-center gap-2 mt-4">
              <Link to="/careers" className="flex-1">
                <GlowButton variant="secondary" size="sm" className="w-full">Explore Roadmap</GlowButton>
              </Link>
            </div>
          </GlassCard>

          <GlassCard delay={0.3}>
            <h3 className="font-display font-semibold mb-4">Interview Accuracy</h3>
            <AnimatedProgress 
              value={realStats.interviewTotal > 0 ? (realStats.interviewScore / realStats.interviewTotal) * 100 : 0} 
              variant="accent" 
              className="mb-4" 
            />
            <p className="text-sm text-muted-foreground">Current technical accuracy based on real evaluations.</p>
            <div className="flex items-center gap-2 mt-4">
              <Link to="/interview" className="flex-1">
                <GlowButton variant="secondary" size="sm" className="w-full">Practice More</GlowButton>
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <Link to="/interview">
            <GlassCard className="text-center cursor-pointer p-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Interview Prep</p>
              <p className="text-xs text-muted-foreground mt-1">Practice questions</p>
            </GlassCard>
          </Link>
          <Link to="/career-mentor">
            <GlassCard className="text-center cursor-pointer p-6" delay={0.05}>
              <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">AI Mentor</p>
              <p className="text-xs text-muted-foreground mt-1">Career guidance</p>
            </GlassCard>
          </Link>
          <Link to="/jobs-internships">
            <GlassCard className="text-center cursor-pointer p-6" delay={0.1}>
              <Briefcase className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Browse Jobs</p>
              <p className="text-xs text-muted-foreground mt-1">AI-matched opportunities</p>
            </GlassCard>
          </Link>
          <Link to="/leaderboard">
            <GlassCard className="text-center cursor-pointer p-6" delay={0.2}>
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Leaderboard</p>
              <p className="text-xs text-muted-foreground mt-1">Compete with peers</p>
            </GlassCard>
          </Link>
          <Link to="/portfolio">
            <GlassCard className="text-center cursor-pointer p-6" delay={0.25}>
              <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Portfolio</p>
              <p className="text-xs text-muted-foreground mt-1">Showcase work</p>
            </GlassCard>
          </Link>
          <Link to="/careers">
            <GlassCard className="text-center cursor-pointer p-6" delay={0.3}>
              <Users className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Explore Careers</p>
              <p className="text-xs text-muted-foreground mt-1">Find your path</p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
