import clsx from "clsx";

const palettes: Record<string, { from: string; to: string; ink: string; tag: string }> = {
  oxblood: { from: "#4f46e5", to: "#3730a3", ink: "#ffffff", tag: "#fbbf24" },
  fern:    { from: "#0ea5e9", to: "#0369a1", ink: "#ffffff", tag: "#fbbf24" },
  saffron: { from: "#a855f7", to: "#7e22ce", ink: "#ffffff", tag: "#fbbf24" },
  ink:     { from: "#1e293b", to: "#0f172a", ink: "#ffffff", tag: "#a855f7" },
};

type ColorKey = keyof typeof palettes;

function Decoration({ color }: { color: ColorKey }) {
  const stroke = "rgba(255,255,255,0.35)";
  const dot = "rgba(255,255,255,0.7)";
  const accent = color === "ink" ? "#a855f7" : "#fbbf24";

  if (color === "oxblood") {
    // Discrete structures, graph / tree nodes
    return (
      <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <g stroke={stroke} strokeWidth="1.5" fill="none">
          <line x1="80" y1="60" x2="160" y2="120" />
          <line x1="240" y1="60" x2="160" y2="120" />
          <line x1="160" y1="120" x2="120" y2="180" />
          <line x1="160" y1="120" x2="200" y2="180" />
          <line x1="240" y1="60" x2="320" y2="100" />
          <line x1="320" y1="100" x2="340" y2="170" />
        </g>
        <g>
          <circle cx="80" cy="60" r="6" fill={dot} />
          <circle cx="240" cy="60" r="6" fill={dot} />
          <circle cx="160" cy="120" r="7" fill={accent} />
          <circle cx="120" cy="180" r="6" fill={dot} />
          <circle cx="200" cy="180" r="6" fill={dot} />
          <circle cx="320" cy="100" r="6" fill={dot} />
          <circle cx="340" cy="170" r="6" fill={accent} />
        </g>
      </svg>
    );
  }

  if (color === "fern") {
    // Algorithms, sort / flow bars
    return (
      <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <g fill="rgba(255,255,255,0.25)">
          <rect x="40" y="160" width="22" height="30" />
          <rect x="70" y="120" width="22" height="70" />
          <rect x="100" y="80" width="22" height="110" />
          <rect x="130" y="100" width="22" height="90" />
          <rect x="160" y="40" width="22" height="150" />
          <rect x="190" y="70" width="22" height="120" />
        </g>
        <g stroke={stroke} strokeWidth="1.5" fill="none">
          <path d="M260 60 L290 60 L290 100 L320 100 L320 140 L350 140" />
          <path d="M260 180 L290 180 L290 140" />
        </g>
        <g>
          <circle cx="260" cy="60" r="5" fill={accent} />
          <circle cx="350" cy="140" r="5" fill={dot} />
          <circle cx="260" cy="180" r="5" fill={dot} />
        </g>
      </svg>
    );
  }

  if (color === "saffron") {
    // Linear Algebra, matrix grid + vector
    return (
      <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <g stroke={stroke} strokeWidth="1.5" fill="none">
          <rect x="40" y="50" width="120" height="120" />
          <line x1="40" y1="90" x2="160" y2="90" />
          <line x1="40" y1="130" x2="160" y2="130" />
          <line x1="80" y1="50" x2="80" y2="170" />
          <line x1="120" y1="50" x2="120" y2="170" />
        </g>
        <g fill={dot}>
          <circle cx="60" cy="70" r="3" />
          <circle cx="100" cy="70" r="3" />
          <circle cx="140" cy="70" r="3" />
          <circle cx="60" cy="110" r="3" />
          <circle cx="100" cy="110" r="3" />
          <circle cx="140" cy="110" r="3" />
          <circle cx="60" cy="150" r="3" />
          <circle cx="100" cy="150" r="3" />
          <circle cx="140" cy="150" r="3" />
        </g>
        {/* vector arrow */}
        <g stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="240" y1="180" x2="340" y2="80" />
          <polyline points="320,76 340,80 336,100" />
        </g>
      </svg>
    );
  }

  // ink, statistics, bell curve + bars
  return (
    <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g fill="rgba(255,255,255,0.25)">
        <rect x="40" y="170" width="20" height="20" />
        <rect x="65" y="150" width="20" height="40" />
        <rect x="90" y="120" width="20" height="70" />
        <rect x="115" y="90" width="20" height="100" />
        <rect x="140" y="120" width="20" height="70" />
        <rect x="165" y="150" width="20" height="40" />
        <rect x="190" y="170" width="20" height="20" />
      </g>
      <path
        d="M30 190 Q110 60 200 60 Q290 60 370 190"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
      />
      <g fill={dot}>
        <circle cx="200" cy="60" r="5" />
        <circle cx="120" cy="100" r="3" />
        <circle cx="280" cy="100" r="3" />
      </g>
    </svg>
  );
}

export function CourseThumb({
  code,
  title,
  color,
  className,
}: {
  code: string;
  title: string;
  color: ColorKey;
  className?: string;
}) {
  const p = palettes[color] ?? palettes.ink;
  return (
    <div
      className={clsx("relative w-full aspect-[16/10] overflow-hidden rounded-md", className)}
      style={{
        background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
        color: p.ink,
      }}
    >
      <Decoration color={color} />

      {/* code tag */}
      <div
        className="absolute top-3 left-3 px-2 py-1 rounded-sm text-[11px] font-semibold tracking-wide z-10"
        style={{ background: p.tag, color: color === "saffron" ? p.ink : "#1c1a17" }}
      >
        {code}
      </div>

      {/* title overlay with bottom gradient for legibility */}
      <div
        className="absolute inset-x-0 bottom-0 p-5 pt-12 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}
      >
        <div className="font-bold text-xl leading-tight" style={{ letterSpacing: "-0.01em" }}>
          {title}
        </div>
      </div>
    </div>
  );
}
