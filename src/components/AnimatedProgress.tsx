import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "primary" | "accent";
}

const AnimatedProgress = ({ value, max = 100, className, showLabel = true, variant = "primary" }: AnimatedProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-display font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            variant === "primary" ? "gradient-primary" : "bg-accent"
          )}
        />
      </div>
    </div>
  );
};

export default AnimatedProgress;
