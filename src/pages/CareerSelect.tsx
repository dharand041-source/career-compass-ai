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
              className="cursor-pointer group flex flex-col h-full"
            >
              <div onClick={() => navigate(`/assessment/${c.id}`)} className="flex flex-col h-full">
                <span className="text-4xl mb-3 block drop-shadow-lg">{c.icon}</span>
                <h3 className="font-display font-bold text-xl mb-2 text-white group-hover:text-cyan-400 transition-colors drop-shadow-md">{c.title}</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed flex-grow">{c.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {c.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[rgba(0,0,0,0.5)] border border-cyan-500/30 text-cyan-400 font-medium">
                      {s}
                    </span>
                  ))}
                  {c.skills.length > 4 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] text-slate-300 font-medium">
                      +{c.skills.length - 4}
                    </span>
                  )}
                </div>
                <div className="pt-3 border-t border-[rgba(255,255,255,0.1)] mt-auto">
                  <p className="text-sm font-semibold text-cyan-200">💰 {c.avgSalary}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerSelect;
