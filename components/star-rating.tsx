import clsx from "clsx";
import { Star } from "lucide-react";

export function StarRating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const sizeClass = size === "xs" ? "text-xs" : size === "md" ? "text-base" : "text-sm";
  const iconSize = size === "xs" ? 12 : size === "md" ? 18 : 14;

  return (
    <span className={clsx("inline-flex items-center gap-1.5", sizeClass, className)}>
      <span className="font-semibold tabular text-ink">{value.toFixed(1)}</span>
      <span className="inline-flex gap-px" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) {
            return <Star key={i} size={iconSize} className="text-amber-500" fill="currentColor" />;
          }
          if (i === full && half) {
            return (
              <span key={i} className="relative inline-flex">
                <Star size={iconSize} className="text-rule" fill="currentColor" />
                <span className="absolute left-0 top-0 overflow-hidden" style={{ width: "50%" }}>
                  <Star size={iconSize} className="text-amber-500" fill="currentColor" />
                </span>
              </span>
            );
          }
          return <Star key={i} size={iconSize} className="text-rule" fill="currentColor" />;
        })}
      </span>
      {typeof count === "number" ? (
        <span className="text-ink-muted">({count.toLocaleString()})</span>
      ) : null}
    </span>
  );
}
