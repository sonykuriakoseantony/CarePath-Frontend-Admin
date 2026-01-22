import { cn } from "../../lib/utils";

export function Card({
  children,
  className,
  hover = false,
  style,
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-card",
        hover && "transition-shadow hover:shadow-card-hover",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <p className="font-display text-lg font-bold text-foreground">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  className,
}) {
  return (
    <Card className={cn("animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {value}
          </p>

          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.isPositive
                  ? "text-emerald-600"
                  : "text-red-600"
              )}
            >
              {trend.isPositive ? "↑" : "↓"}{" "}
              {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}
