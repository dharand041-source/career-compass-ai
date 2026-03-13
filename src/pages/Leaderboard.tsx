import { motion } from "framer-motion";
import { Trophy, Flame } from "lucide-react";
import { leaderboardData } from "@/data/careers";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";

const Leaderboard = () => {
  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-display font-bold mb-2">
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground">Top learners this month</p>
        </motion.div>

        <div className="space-y-3">
          {leaderboardData.map((user, i) => (
            <GlassCard
              key={user.rank}
              delay={i * 0.04}
              className={`flex items-center gap-4 ${user.rank <= 3 ? "border-primary/30 glow-primary" : ""} ${user.name === "You" ? "border-accent/40" : ""}`}
              hover={false}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 ${
                user.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                user.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                user.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                "bg-secondary text-muted-foreground"
              }`}>
                {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : `#${user.rank}`}
              </div>
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-display font-semibold text-sm ${user.name === "You" ? "text-accent" : ""}`}>{user.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-400" /> {user.streak} day streak
                </p>
              </div>
              <p className="font-display font-bold text-primary">{user.points.toLocaleString()} pts</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
