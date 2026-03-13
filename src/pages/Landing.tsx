import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, FileText, Briefcase, Trophy, BookOpen, Sparkles, Zap, Users, Presentation, Star } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Brain, title: "AI Career Assessment", desc: "Smart questions that evaluate your skills and find knowledge gaps.", route: "/career-assessment", color: "text-blue-500" },
  { icon: Target, title: "Personalized Roadmap", desc: "Get a custom learning path with the exact skills you need.", route: "/personalized-roadmap", color: "text-green-500" },
  { icon: BookOpen, title: "Video Learning Modules", desc: "Curated YouTube tutorials organized into structured courses.", route: "/video-learning", color: "text-purple-500" },
  { icon: FileText, title: "AI Resume Builder", desc: "Create and analyze resumes with AI-powered scoring.", route: "/resume-builder", color: "text-orange-500" },
  { icon: Briefcase, title: "Smart Job Matching", desc: "AI-matched opportunities based on your skills and career path.", route: "/jobs-internships", color: "text-red-500" },
  { icon: Trophy, title: "Gamification & Leaderboard", desc: "Earn points, track streaks, and compete with peers.", route: "/leaderboard", color: "text-yellow-500" },
  { icon: Users, title: "Project Portfolio", desc: "Showcase your projects and skills professionally.", route: "/portfolio", color: "text-indigo-500" },
  { icon: Sparkles, title: "AI Career Mentor", desc: "24/7 intelligent chatbot for career guidance.", route: "#", color: "text-pink-500" },
];

const Landing = () => {
  return (
    <div className="min-h-screen animated-gradient-bg relative overflow-hidden">
      {/* Enhanced Ambient Effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-glow-blue/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-[150px] animate-pulse" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block glass px-6 py-2 text-sm text-primary font-medium mb-6 relative"
            >
              <Sparkles className="inline h-4 w-4 mr-2" />
              🚀 AI-Powered Career Development
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-lg"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold leading-tight mb-6"
            >
              Your Path from{" "}
              <motion.span
                className="gradient-text relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Beginner
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </motion.span>
              <br />to{" "}
              <motion.span
                className="gradient-text relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Professional
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            >
              Don't know which skills to learn or where to start?{" "}
              <span className="text-primary font-semibold">Learn2Hire</span> uses AI to assess your knowledge,
              build a personalized roadmap, and connect you with real opportunities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Link to="/career-select">
                <GlowButton size="lg" className="flex items-center gap-2 group">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Start Your Journey
                  </motion.span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </GlowButton>
              </Link>
              <Link to="/careers">
                <GlowButton variant="secondary" size="lg" className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Explore Careers
                </GlowButton>
              </Link>
            </motion.div>

            {/* Demo Mode Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <button
                onClick={() => {
                  // Trigger presentation mode with Shift+F5
                  const event = new KeyboardEvent('keydown', { key: 'F5', shiftKey: true });
                  window.dispatchEvent(event);
                }}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Presentation className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Press Shift+F5 for Demo Mode
                <Zap className="h-3 w-3" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block glass px-4 py-2 text-sm text-primary font-medium mb-4"
            >
              ✨ Platform Features
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text relative">
                Launch Your Career
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From skill assessment to job placement — one platform, zero confusion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={f.route} className="block h-full">
                  <GlassCard className="h-full p-6 hover:shadow-2xl transition-all duration-300 group-hover:border-primary/50">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/50 mb-4 ${f.color} group-hover:bg-primary/10 transition-colors`}
                    >
                      <f.icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                    <motion.div
                      className="mt-4 flex items-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      Learn more <ArrowRight className="h-3 w-3 ml-1" />
                    </motion.div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "10K+", label: "Students Guided", icon: Users },
              { number: "500+", label: "Career Paths", icon: Target },
              { number: "95%", label: "Success Rate", icon: Star },
              { number: "24/7", label: "AI Support", icon: Sparkles }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold font-display">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <GlassCard glow className="text-center py-12 px-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>

              <h2 className="text-3xl font-display font-bold mb-4">
                Ready to Discover Your <span className="gradient-text">Career Path?</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of students accelerating their careers with AI-powered guidance and personalized learning.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/career-select">
                  <GlowButton size="lg" className="flex items-center gap-2 group">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      Get Started Free
                    </motion.span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </GlowButton>
                </Link>
                <Link to="/dashboard">
                  <GlowButton variant="secondary" size="lg" className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    View Demo Dashboard
                  </GlowButton>
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-sm text-muted-foreground"
              >
                ✨ No credit card required • 14-day free trial • Cancel anytime
              </motion.div>
            </motion.div>
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
