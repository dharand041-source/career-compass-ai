import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, FileText, Briefcase, Trophy, Target, TrendingUp, Award, Flame, Star, Calendar, Zap, Users } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AnimatedProgress from "@/components/AnimatedProgress";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DashboardState {
  interviewScore?: number;
  interviewTotal?: number;
}

const Dashboard = () => {
  const location = useLocation();
  const { interviewScore = 14, interviewTotal = 20 } = (location.state as DashboardState) || {};

  // Mock user data - in real app this would come from context/state
  const userStats = {
    level: 5,
    xp: 1250,
    xpToNext: 1500,
    currentStreak: 7,
    longestStreak: 12,
    totalPoints: 2450,
    badges: ['First Assessment', 'Week Warrior', 'Skill Builder', 'Interview Ready'],
    recentAchievements: [
      { title: 'Completed Python Basics', xp: 100, time: '2 hours ago' },
      { title: '7-Day Learning Streak', xp: 50, time: '1 day ago' },
      { title: 'Resume Score 80+', xp: 75, time: '3 days ago' }
    ]
  };

  const stats = [
    { icon: Target, label: "Career Path", value: "Software Dev", color: "text-primary" },
    { icon: BookOpen, label: "Skills Learned", value: "5 / 8", color: "text-accent" },
    { icon: TrendingUp, label: "Interview Score", value: `${interviewScore}/${interviewTotal}`, color: "text-primary" },
    { icon: Trophy, label: "Leaderboard Rank", value: "#10", color: "text-accent" },
    { icon: FileText, label: "Resume Score", value: "72 / 100", color: "text-primary" },
    { icon: Briefcase, label: "Job Matches", value: "8", color: "text-accent" },
  ];

  const skillProgress = [
    { name: 'Python', progress: 85, level: 'Advanced' },
    { name: 'JavaScript', progress: 70, level: 'Intermediate' },
    { name: 'React', progress: 60, level: 'Intermediate' },
    { name: 'Data Structures', progress: 45, level: 'Beginner' },
  ];

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
                Level {userStats.level}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {userStats.xp} XP
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground mb-8">Here's your career development overview.</p>
        </motion.div>

        {/* Level Progress */}
        <GlassCard glow className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Level {userStats.level} Progress</h3>
              <p className="text-sm text-muted-foreground">
                {userStats.xpToNext - userStats.xp} XP to next level
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{userStats.xp}/{userStats.xpToNext}</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
          </div>
          <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-3" />
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
                <Badge variant="secondary">{userStats.currentStreak} days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Longest Streak</span>
                <Badge variant="outline">{userStats.longestStreak} days</Badge>
              </div>
            </div>
          </GlassCard>

          {/* Badges */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-display font-semibold">Achievements</h3>
                <p className="text-sm text-muted-foreground">{userStats.badges.length} badges earned</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {userStats.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  🏆 {badge}
                </Badge>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-display font-semibold">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest achievements</p>
              </div>
            </div>
            <div className="space-y-2">
              {userStats.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate">{achievement.title}</span>
                  <Badge variant="outline" className="text-xs">+{achievement.xp} XP</Badge>
                </div>
              ))}
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
            {skillProgress.map((skill, index) => (
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
            <AnimatedProgress value={62} variant="primary" className="mb-4" />
            <p className="text-sm text-muted-foreground">5 of 8 skill modules completed</p>
            <div className="flex items-center gap-2 mt-4">
              <Link to="/roadmap/software-dev" className="flex-1">
                <GlowButton variant="secondary" size="sm" className="w-full">Continue Learning</GlowButton>
              </Link>
              <Link to="/video-learning">
                <GlowButton variant="outline" size="sm">Watch Videos</GlowButton>
              </Link>
            </div>
          </GlassCard>

          <GlassCard delay={0.3}>
            <h3 className="font-display font-semibold mb-4">Resume Score</h3>
            <AnimatedProgress value={72} variant="accent" className="mb-4" />
            <p className="text-sm text-muted-foreground">Add more project descriptions to improve your score.</p>
            <div className="flex items-center gap-2 mt-4">
              <Link to="/resume" className="flex-1">
                <GlowButton variant="secondary" size="sm" className="w-full">Improve Resume</GlowButton>
              </Link>
              <Link to="/resume-builder">
                <GlowButton variant="outline" size="sm">AI Builder</GlowButton>
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Link to="/interview">
            <GlassCard className="text-center cursor-pointer p-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-display font-semibold text-sm">Interview Prep</p>
              <p className="text-xs text-muted-foreground mt-1">Practice questions</p>
            </GlassCard>
          </Link>
          <Link to="/jobs">
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
