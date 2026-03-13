import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Award, Target, BookOpen, Code, Users, Calendar, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLeaderboard, subscribeLeaderboard, LeaderboardUser } from "@/lib/supabaseLeaderboard";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500/20 text-yellow-400";
    case 2:
      return "bg-gray-400/20 text-gray-300";
    case 3:
      return "bg-orange-500/20 text-orange-400";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const initialsFromName = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Leaderboard = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const load = async () => {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
      unsubscribe = subscribeLeaderboard(setLeaderboard);
    };

    load();

    return () => {
      unsubscribe?.();
    };
  }, []);

  const currentUser = useMemo(
    () => leaderboard.find((entry) => entry.id === user?.id),
    [leaderboard, user]
  );

  const userStats = useMemo(() => {
    const stats = currentUser
      ? {
          totalPoints: currentUser.points,
          currentStreak: currentUser.streak,
          longestStreak: currentUser.longest_streak,
          assessmentsCompleted: currentUser.assessments_completed,
          videosWatched: currentUser.videos_watched,
          resumesCreated: currentUser.resumes_created,
          jobsApplied: currentUser.jobs_applied,
          level: Math.max(1, Math.floor(currentUser.points / 200)),
          xpToNextLevel: 200 - (currentUser.points % 200),
          totalXp: currentUser.points,
        }
      : {
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          assessmentsCompleted: 0,
          videosWatched: 0,
          resumesCreated: 0,
          jobsApplied: 0,
          level: 1,
          xpToNextLevel: 200,
          totalXp: 0,
        };

    return stats;
  }, [currentUser]);

  const achievements = useMemo(() => {
    return [
      {
        id: "first-assessment",
        title: "Assessment Beginner",
        description: "Complete your first career assessment",
        icon: <Target className="h-5 w-5" />,
        unlocked: userStats.assessmentsCompleted >= 1,
        progress: userStats.assessmentsCompleted,
        maxProgress: 1,
      },
      {
        id: "video-learner",
        title: "Video Learner",
        description: "Watch 10 learning videos",
        icon: <BookOpen className="h-5 w-5" />,
        unlocked: userStats.videosWatched >= 10,
        progress: userStats.videosWatched,
        maxProgress: 10,
      },
      {
        id: "resume-expert",
        title: "Resume Expert",
        description: "Create 5 professional resumes",
        icon: <Code className="h-5 w-5" />,
        unlocked: userStats.resumesCreated >= 5,
        progress: userStats.resumesCreated,
        maxProgress: 5,
      },
      {
        id: "job-seeker",
        title: "Job Seeker",
        description: "Apply to 20 jobs",
        icon: <Users className="h-5 w-5" />,
        unlocked: userStats.jobsApplied >= 20,
        progress: userStats.jobsApplied,
        maxProgress: 20,
      },
      {
        id: "streak-master",
        title: "Streak Master",
        description: "Maintain a 30-day learning streak",
        icon: <Flame className="h-5 w-5" />,
        unlocked: userStats.currentStreak >= 30,
        progress: userStats.currentStreak,
        maxProgress: 30,
      },
    ];
  }, [userStats]);

  const xpForNextLevel = userStats.level * 200;
  const currentLevelXp = userStats.totalXp % 200;
  const levelProgress = (currentLevelXp / 200) * 100;

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-display font-bold mb-2">
            Leaderboard & <span className="gradient-text">Gamification</span>
          </h1>
          <p className="text-muted-foreground">Earn points, track streaks, and compete with peers.</p>
        </motion.div>

        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{userStats.totalPoints.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500 mb-1">{userStats.currentStreak}</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">Level {userStats.level}</div>
              <p className="text-sm text-muted-foreground">Current Level</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{userStats.assessmentsCompleted}</div>
              <p className="text-sm text-muted-foreground">Assessments Done</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Level {userStats.level}</h3>
                <p className="text-sm text-muted-foreground">
                  {xpForNextLevel - currentLevelXp} XP to next level
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {currentLevelXp}/{200} XP
              </Badge>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="stats">My Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="mt-8">
            {loading || authLoading ? (
              <div className="text-center text-muted-foreground">Loading leaderboard...</div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, i) => {
                  const isCurrent = entry.id === user?.id;
                  const rank = i + 1;
                  return (
                    <GlassCard
                      key={entry.id}
                      delay={i * 0.04}
                      className={`flex items-center gap-4 ${rank <= 3 ? "border-primary/30 glow-primary" : ""} ${isCurrent ? "border-accent/40" : ""}`}
                      hover={false}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 ${getRankColor(rank)}`}>
                        {getRankIcon(rank)}
                      </div>
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                        {initialsFromName(entry.username)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-display font-semibold text-sm ${isCurrent ? "text-accent" : ""}`}>
                          {isCurrent ? "You" : entry.username}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-400" /> {entry.streak} day streak
                        </p>
                      </div>
                      <p className="font-display font-bold text-primary">{entry.points.toLocaleString()} pts</p>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`transition-all ${achievement.unlocked ? "border-green-200 bg-green-50/50" : "border-gray-200"}`}>
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          achievement.unlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <h3 className={`font-bold mb-2 ${achievement.unlocked ? "text-green-800" : "text-gray-700"}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="space-y-2">
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="mt-3 bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.videosWatched}</div>
                  <p className="text-xs text-muted-foreground">+12 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resumes Created</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.resumesCreated}</div>
                  <p className="text-xs text-muted-foreground">+1 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jobs Applied</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.jobsApplied}</div>
                  <p className="text-xs text-muted-foreground">+3 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.longestStreak}</div>
                  <p className="text-xs text-muted-foreground">days</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completed "React Hooks" video</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • +50 points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Finished career assessment</p>
                      <p className="text-xs text-muted-foreground">1 day ago • +100 points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Code className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created professional resume</p>
                      <p className="text-xs text-muted-foreground">3 days ago • +75 points</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
