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
        "glass p-6",
        hover && "transition-all duration-300 hover:border-primary/30",
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
