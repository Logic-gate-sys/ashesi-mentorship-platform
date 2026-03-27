import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_2px_8px_rgba(255,107,43,0.32)] hover:bg-brand-hover active:scale-[0.98]",
  ghost:
    "bg-surface text-text-sub border border-border hover:bg-page active:scale-[0.98]",
  dark: "bg-white/8 text-white border border-white/16 hover:bg-white/14 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-[36px] px-4 text-[14px]",
  md: "h-[44px] px-5 text-[15px]",
  lg: "h-[52px] px-8 text-[16px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      full = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 font-body font-semibold rounded-btn transition-all duration-150
          disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none ${variants[variant]} ${sizes[size]}
          ${full ? "w-full" : ""} ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button ;
