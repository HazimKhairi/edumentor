"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const COPY = ["", "Poor", "Below average", "OK", "Good", "Excellent"] as const;

export function StarPicker({
  name = "score",
  defaultValue = 0,
  size = 28,
  showLabel = true,
}: {
  name?: string;
  defaultValue?: number;
  size?: number;
  showLabel?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div className="flex items-center gap-1.5">
      <input type="hidden" name={name} value={value} />
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} stars`}
          onClick={() => setValue(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          className="text-amber-500 transition-transform hover:scale-110"
        >
          <Star
            size={size}
            fill={n <= shown ? "currentColor" : "none"}
            className={n <= shown ? "" : "text-rule"}
          />
        </button>
      ))}
      {showLabel ? (
        <span className="ml-2 text-xs text-ink-muted">
          {shown > 0 ? `${shown} ${COPY[shown]}` : "Pick a rating"}
        </span>
      ) : null}
    </div>
  );
}
