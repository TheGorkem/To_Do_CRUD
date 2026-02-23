import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <label className="flex w-full flex-col gap-2 text-sm">
      {label ? <span className="text-slate-600 dark:text-slate-300">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2",
          "text-slate-900 placeholder:text-slate-400 focus:border-ember/60",
          "focus:outline-none focus:ring-2 focus:ring-ember/40",
          "dark:border-white/10 dark:bg-white/5 dark:text-white",
          error ? "border-rose-400/60" : "",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-400 dark:text-rose-300">{error}</span> : null}
    </label>
  )
);

Input.displayName = "Input";

export default Input;
