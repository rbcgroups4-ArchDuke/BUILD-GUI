import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-blue-400/30 bg-blue-500/12 text-blue-200",
        success: "border-emerald-400/30 bg-emerald-500/12 text-emerald-200",
        warning: "border-amber-400/30 bg-amber-500/12 text-amber-200",
        danger: "border-red-400/30 bg-red-500/12 text-red-200",
        purple: "border-violet-400/30 bg-violet-500/12 text-violet-200",
        muted: "border-slate-400/20 bg-slate-500/10 text-slate-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
