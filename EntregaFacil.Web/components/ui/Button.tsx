import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: ReactNode;
};

const variants = {
  primary: "bg-red-800 text-white hover:bg-red-900 border-red-800 shadow-sm shadow-red-950/10",
  secondary: "bg-white text-red-900 hover:bg-red-50 border-red-200",
  danger: "bg-rose-700 text-white hover:bg-rose-800 border-rose-700",
  ghost: "bg-transparent text-slate-700 hover:bg-red-50 hover:text-red-900 border-transparent",
};

export function Button({
  children,
  className = "",
  icon,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
