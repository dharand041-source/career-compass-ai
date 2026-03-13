import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Career Library", href: "/careers" },
  { label: "Leaderboard", href: "/leaderboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useSupabaseAuth();
  const isLanding = location.pathname === "/";

  // Secondary Button Style (Glass)
  const secondaryBtnStyle = "px-6 py-2.5 text-sm rounded-full bg-[rgba(255,255,255,0.08)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.2)] text-white font-bold transition-all duration-300 hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]";
  
  // Primary Button Style (Neon)
  const primaryBtnStyle = "px-6 py-2.5 text-sm rounded-full bg-cyan-500 text-white font-bold transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] border border-cyan-400";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[rgba(15,23,42,0.3)] backdrop-blur-[16px] border-b border-[rgba(255,255,255,0.1)]"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center">
          <img src="/learn2hire.png" alt="Learn2Hire" className="h-8 md:h-10 brightness-0 invert" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm text-slate-300 hover:text-white font-semibold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-300">Hi, {user.email?.split("@")[0]}</span>
              <Link to="/dashboard">
                <button className={secondaryBtnStyle}>Dashboard</button>
              </Link>
              <button className={secondaryBtnStyle} onClick={() => signOut()}>
                Sign out
              </button>
            </>
          ) : isLanding ? (
            <>
              <Link to="/auth">
                <button className={secondaryBtnStyle}>
                  Log in
                </button>
              </Link>
              <Link to="/auth">
                <button className={primaryBtnStyle}>Get Started</button>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <button className={primaryBtnStyle}>Log in</button>
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white hover:text-cyan-400 transition-colors">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden bg-[rgba(15,23,42,0.95)] backdrop-blur-2xl border-t border-[rgba(255,255,255,0.1)] px-6 py-4 space-y-3 shadow-xl">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white py-2 font-semibold">
              {l.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <button className={`${secondaryBtnStyle} w-full`}>
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className={`${secondaryBtnStyle} w-full`}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <button className={`${secondaryBtnStyle} w-full`}>Log in</button>
                </Link>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <button className={`${primaryBtnStyle} w-full`}>
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
