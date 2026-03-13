import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05, x: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(-1)}
      className={cn(
        "group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg mb-6",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-semibold">Back</span>
    </motion.button>
  );
};

export default BackButton;
