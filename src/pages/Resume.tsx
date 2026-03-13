import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import AnimatedProgress from "@/components/AnimatedProgress";
import Navbar from "@/components/Navbar";

const Resume = () => {
  const [form, setForm] = useState({ name: "", email: "", education: "", skills: "", projects: "", experience: "" });
  const [score, setScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAnalyze = () => {
    let s = 0;
    if (form.name) s += 10;
    if (form.email) s += 10;
    if (form.education.length > 20) s += 15; else if (form.education) s += 8;
    if (form.skills.split(",").length >= 5) s += 20; else if (form.skills) s += 10;
    if (form.projects.length > 50) s += 25; else if (form.projects) s += 12;
    if (form.experience.length > 30) s += 20; else if (form.experience) s += 10;

    setScore(s);
    const sugs: string[] = [];
    if (!form.name) sugs.push("Add your full name");
    if (!form.email) sugs.push("Add contact email");
    if (form.skills.split(",").length < 5) sugs.push("Add at least 5 skills separated by commas");
    if (form.projects.length < 50) sugs.push("Describe 2-3 projects with details");
    if (!form.experience) sugs.push("Add work experience or internships");
    if (s < 60) sugs.push("Include keywords like 'React', 'Python', 'REST API' for ATS optimization");
    setSuggestions(sugs);
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            AI <span className="gradient-text">Resume Builder</span>
          </h1>
          <p className="text-muted-foreground">Build your resume and get an AI-powered score.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard hover={false}>
            <h3 className="font-display font-semibold mb-4">Your Details</h3>
            <div className="space-y-4">
              {(["name", "email", "education", "skills", "projects", "experience"] as const).map((field) => (
                <div key={field}>
                  <label className="text-sm text-muted-foreground capitalize mb-1 block">{field}</label>
                  {["projects", "experience", "education"].includes(field) ? (
                    <textarea
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      rows={3}
                      placeholder={field === "skills" ? "React, JavaScript, Python, SQL, Git" : `Enter your ${field}...`}
                      className="w-full p-3 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:outline-none text-foreground text-sm placeholder:text-muted-foreground resize-none"
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={field === "skills" ? "React, JavaScript, Python, SQL, Git" : `Enter your ${field}...`}
                      className="w-full p-3 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:outline-none text-foreground text-sm placeholder:text-muted-foreground"
                    />
                  )}
                </div>
              ))}
              <GlowButton onClick={handleAnalyze} className="w-full">Analyze Resume</GlowButton>
            </div>
          </GlassCard>

          <div className="space-y-6">
            {score !== null && (
              <GlassCard glow hover={false}>
                <h3 className="font-display font-semibold mb-4">Resume Score</h3>
                <div className="text-center mb-4">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`font-display text-6xl font-extrabold ${score >= 70 ? "text-accent" : score >= 40 ? "text-primary" : "text-destructive"}`}
                  >
                    {score}
                  </motion.span>
                  <span className="text-2xl text-muted-foreground"> / 100</span>
                </div>
                <AnimatedProgress value={score} variant={score >= 70 ? "accent" : "primary"} />
              </GlassCard>
            )}

            {suggestions.length > 0 && (
              <GlassCard hover={false}>
                <h3 className="font-display font-semibold mb-3">Improvement Suggestions</h3>
                <ul className="space-y-2">
                  {suggestions.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
