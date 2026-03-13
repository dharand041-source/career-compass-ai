import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
  onClick?: () => void;
}

const GlassCard = ({ children, className, hover = true, glow = false, delay = 0, onClick }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "glass p-6 transition-all duration-300",
        hover && "hover:-translate-y-[5px] hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        glow && "glow-primary",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
