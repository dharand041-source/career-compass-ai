import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { careers } from "@/data/careers";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";

const CareerSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Choose Your <span className="gradient-text">Career Path</span>
          </h1>
          <p className="text-muted-foreground">Select the role you want to pursue. We'll assess your skills and build a roadmap.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {careers.map((c, i) => (
            <GlassCard
              key={c.id}
              delay={i * 0.05}
              className="cursor-pointer group"
            >
              <div onClick={() => navigate(`/assessment/${c.id}`)}>
                <span className="text-4xl mb-3 block">{c.icon}</span>
                <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s}</span>
                  ))}
                  {c.skills.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">+{c.skills.length - 4}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3">💰 {c.avgSalary}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerSelect;
