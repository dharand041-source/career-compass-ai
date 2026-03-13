import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { careers } from "@/data/careers";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";

const Careers = () => {
  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Career <span className="gradient-text">Skills Library</span>
          </h1>
          <p className="text-muted-foreground">Explore all career paths, required skills, and learning resources.</p>
        </motion.div>

        <div className="space-y-6">
          {careers.map((c, i) => (
            <GlassCard key={c.id} delay={i * 0.06} hover={false}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-5xl">{c.icon}</span>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {c.skills.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-accent font-semibold mt-3">💰 {c.avgSalary}</p>
                </div>
                <Link to={`/assessment/${c.id}`} className="shrink-0">
                  <GlowButton size="sm" className="flex items-center gap-1">
                    Start Path <ArrowRight className="h-4 w-4" />
                  </GlowButton>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;
