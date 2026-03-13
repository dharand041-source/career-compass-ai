import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:-translate-y-0.5 border border-cyan-400",
        destructive: "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] hover:-translate-y-0.5",
        outline: "border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] text-white backdrop-blur-[16px] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5",
        secondary: "bg-[rgba(255,255,255,0.1)] backdrop-blur text-white hover:bg-[rgba(255,255,255,0.15)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 border border-[rgba(255,255,255,0.1)]",
        ghost: "hover:bg-[rgba(255,255,255,0.1)] text-slate-300 hover:text-white",
        link: "text-cyan-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-8",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type ToggleVariants = VariantProps<typeof toggleVariants>;