import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, FileText, Briefcase, Trophy, BookOpen, Sparkles, Zap, Users, Presentation, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Brain, title: "AI Career Assessment", desc: "Smart questions that evaluate your skills and find knowledge gaps.", route: "/career-assessment", color: "text-cyan-400" },
  { icon: Target, title: "Personalized Roadmap", desc: "Get a custom learning path with the exact skills you need.", route: "/personalized-roadmap", color: "text-green-400" },
  { icon: BookOpen, title: "Video Learning Modules", desc: "Curated YouTube tutorials organized into structured courses.", route: "/video-learning", color: "text-purple-400" },
  { icon: FileText, title: "AI Resume Builder", desc: "Create and analyze resumes with AI-powered scoring.", route: "/resume-builder", color: "text-orange-400" },
  { icon: Briefcase, title: "Smart Job Matching", desc: "AI-matched opportunities based on your skills and career path.", route: "/jobs-internships", color: "text-red-400" },
  { icon: Trophy, title: "Gamification & Leaderboard", desc: "Earn points, track streaks, and compete with peers.", route: "/leaderboard", color: "text-yellow-400" },
  { icon: Users, title: "Project Portfolio", desc: "Showcase your projects and skills professionally.", route: "/portfolio", color: "text-indigo-400" },
  { icon: Sparkles, title: "AI Career Mentor", desc: "24/7 intelligent chatbot for career guidance.", route: "/career-mentor", color: "text-pink-400" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Enhanced Ambient Effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              className="inline-flex items-center px-5 py-2 rounded-full bg-[rgba(255,255,255,0.08)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.2)] text-sm text-cyan-300 font-semibold mb-6 flex-wrap shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-white/10 mr-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              AI-Powered Career Development
              <motion.div
                className="absolute inset-0 bg-cyan-500/10 rounded-full"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold leading-tight mb-6 text-white"
            >
              Your Path from{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Beginner
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </motion.span>
              <br />to{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200 relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Professional
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full"
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
              className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-medium"
            >
              Don't know which skills to learn or where to start?{" "}
              <span className="text-cyan-400 font-bold">Learn2Hire</span> uses AI to assess your knowledge,
              build a personalized roadmap, and connect you with real opportunities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8"
            >
              <Link to="/career-select">
                <button className="flex items-center gap-2 group px-8 py-3.5 rounded-full bg-cyan-500 text-white font-bold transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] border border-cyan-400">
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </Link>
              <Link to="/careers">
                <button className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[rgba(255,255,255,0.08)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.2)] text-white font-bold transition-all duration-300 hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.15)] hover:-translate-y-0.5">
                  <Target className="h-5 w-5" />
                  Explore Careers
                </button>
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
                  const event = new KeyboardEvent('keydown', { key: 'F5', shiftKey: true });
                  window.dispatchEvent(event);
                }}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors group"
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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
              className="inline-block px-4 py-1.5 rounded-full text-sm text-cyan-300 font-medium mb-4 bg-cyan-500/10 border border-cyan-500/20"
            >
              ✨ Platform Features
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 relative inline-block">
                Launch Your Career
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto">
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
                  <div className="h-full p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] transition-all duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 mb-4 ${f.color} group-hover:bg-slate-700 transition-colors shadow-inner`}
                    >
                      <f.icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors text-white">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      {f.desc}
                    </p>
                    <motion.div
                      className="mt-4 flex items-center text-xs text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      Learn more <ArrowRight className="h-3 w-3 ml-1" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 relative z-10">
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
                className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-6 rounded-2xl hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold font-display text-white">{stat.number}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[2rem] text-center py-16 px-8 relative overflow-hidden">
            {/* Animated background focus */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full"></div>

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
                <Sparkles className="h-10 w-10 text-cyan-400" />
              </motion.div>

              <h2 className="text-3xl font-display font-bold mb-4 text-white">
                Ready to Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">Career Path?</span>
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto font-medium">
                Join thousands of students accelerating their careers with AI-powered guidance and personalized learning.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to="/career-select">
                  <button className="flex items-center gap-2 group px-8 py-3.5 rounded-full bg-cyan-500 text-white font-bold transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] border border-cyan-400">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[rgba(255,255,255,0.08)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.2)] text-white font-bold transition-all duration-300 hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.15)] hover:-translate-y-0.5">
                    <Trophy className="h-5 w-5" />
                    View Demo Dashboard
                  </button>
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-sm text-slate-400 font-medium"
              >
                ✨ No credit card required • 14-day free trial • Cancel anytime
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.05)] py-8 px-6 relative z-10 bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white opacity-90">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-white tracking-tight">
              Learn<span className="text-slate-400">2</span>Hire
            </span>
          </div>
          <span>© 2026 Learn2Hire. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
