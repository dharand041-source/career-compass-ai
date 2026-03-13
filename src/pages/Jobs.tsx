import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { jobListings } from "@/data/careers";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";

const Jobs = () => {
  const [filter, setFilter] = useState<"all" | "Full-time" | "Internship">("all");
  const filtered = filter === "all" ? jobListings : jobListings.filter((j) => j.type === filter);

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Jobs & <span className="gradient-text">Internships</span>
          </h1>
          <p className="text-muted-foreground">Opportunities matched to your skills.</p>
        </motion.div>

        <div className="flex gap-3 justify-center mb-8">
          {(["all", "Full-time", "Internship"] as const).map((f) => (
            <GlowButton
              key={f}
              variant={filter === f ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f}
            </GlowButton>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((job, i) => (
            <GlassCard key={job.id} delay={i * 0.05}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {job.skills.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-semibold text-accent text-sm">{job.salary}</p>
                  <GlowButton size="sm" variant="secondary" className="mt-2 flex items-center gap-1">
                    Apply <ExternalLink className="h-3 w-3" />
                  </GlowButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
