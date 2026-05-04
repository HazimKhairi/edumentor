import clsx from "clsx";

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

  return (
    <span className={clsx("inline-flex items-center gap-1.5", sizeClass, className)}>
      <span className="font-semibold tabular text-ink">{value.toFixed(1)}</span>
      <span className="inline-flex text-saffron leading-none" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <span key={i}>★</span>;
          if (i === full && half) return <span key={i} className="relative">
            <span className="text-rule">★</span>
            <span className="absolute left-0 top-0 overflow-hidden w-1/2 text-saffron">★</span>
          </span>;
          return <span key={i} className="text-rule">★</span>;
        })}
      </span>
      {typeof count === "number" ? (
        <span className="text-ink-muted">({count.toLocaleString()})</span>
      ) : null}
    </span>
  );
}
