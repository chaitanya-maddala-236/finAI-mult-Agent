import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    success: "badge-green",
    warning: "badge-yellow",
    danger: "badge-red",
    info: "badge-blue",
    outline: "border border-border text-foreground bg-transparent",
  };

  return (
    <span className={cn("badge", variants[variant], className)}>
      {children}
    </span>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  iconBg?: string;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  iconBg = "bg-primary/10",
  subtitle,
}: StatCardProps) {
  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground truncate">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight truncate">
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
          {change && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-2.5 shrink-0 ml-3", iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <svg
      className={cn("animate-spin text-primary", sizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
