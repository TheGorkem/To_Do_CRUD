import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ember text-white hover:bg-ember/90 shadow-glow focus-visible:ring-ember",
  ghost:
    "bg-slate-900/5 text-slate-700 hover:bg-slate-900/10 focus-visible:ring-slate-500/40 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/30",
  danger:
    "bg-rose-500/15 text-rose-700 hover:bg-rose-500/20 focus-visible:ring-rose-400 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition focus-visible:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";

export default Button;
