import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, FileText, Briefcase, Trophy, BookOpen } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Brain, title: "AI Career Assessment", desc: "Smart questions that evaluate your skills and find knowledge gaps.", route: "/career-assessment" },
  { icon: Target, title: "Personalized Roadmap", desc: "Get a custom learning path with the exact skills you need.", route: "/personalized-roadmap" },
  { icon: BookOpen, title: "Video Learning Modules", desc: "Curated YouTube tutorials organized into structured courses.", route: "/video-learning" },
  { icon: FileText, title: "AI Resume Builder", desc: "Create and analyze resumes with AI-powered scoring.", route: "/resume-builder" },
  { icon: Briefcase, title: "Jobs & Internships", desc: "Matched opportunities based on your skills and career path.", route: "/jobs-internships" },
  { icon: Trophy, title: "Leaderboard & Gamification", desc: "Earn points, track streaks, and compete with peers.", route: "/leaderboard" },
];

const Landing = () => {
  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-glow-blue/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block glass px-4 py-1.5 text-sm text-primary font-medium mb-6">
              🚀 AI-Powered Career Development
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold leading-tight mb-6">
              Your Path from{" "}
              <span className="gradient-text">Beginner</span>
              <br />to <span className="gradient-text">Professional</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Don't know which skills to learn or where to start? Learn2Hire uses AI to assess your knowledge, build a personalized roadmap, and connect you with real opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/career-select">
                <GlowButton size="lg" className="flex items-center gap-2">
                  Start Your Journey <ArrowRight className="h-5 w-5" />
                </GlowButton>
              </Link>
              <Link to="/careers">
                <GlowButton variant="secondary" size="lg">Explore Careers</GlowButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="gradient-text">Launch Your Career</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From skill assessment to job placement — one platform, zero confusion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={f.title} to={f.route} className="block">
                <GlassCard delay={i * 0.1}>
                  <f.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <GlassCard glow className="text-center py-12 px-8">
            <h2 className="text-3xl font-display font-bold mb-4">Ready to Discover Your Career Path?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of students accelerating their careers with AI.</p>
            <Link to="/career-select">
              <GlowButton size="lg" className="flex items-center gap-2 mx-auto">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </GlowButton>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <span className="font-display font-semibold gradient-text">Learn2Hire</span>
          <span>© 2026 Learn2Hire. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
