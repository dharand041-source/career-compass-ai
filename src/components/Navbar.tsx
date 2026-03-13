import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import GlowButton from "./GlowButton";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Career Library", href: "/careers" },
  { label: "Leaderboard", href: "/leaderboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold gradient-text">Learn2Hire</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLanding ? (
            <>
              <Link to="/dashboard">
                <GlowButton variant="secondary" size="sm">Log in</GlowButton>
              </Link>
              <Link to="/career-select">
                <GlowButton size="sm">Get Started</GlowButton>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <GlowButton size="sm">Dashboard</GlowButton>
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden glass-strong border-t border-border/50 px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-foreground py-2">
              {l.label}
            </Link>
          ))}
          <Link to="/career-select" onClick={() => setOpen(false)}>
            <GlowButton size="sm" className="w-full mt-2">Get Started</GlowButton>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
