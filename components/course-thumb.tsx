import clsx from "clsx";

const palettes: Record<string, { from: string; to: string; ink: string; tag: string }> = {
  oxblood: { from: "#4f46e5", to: "#3730a3", ink: "#ffffff", tag: "#fbbf24" },
  fern:    { from: "#0ea5e9", to: "#0369a1", ink: "#ffffff", tag: "#fbbf24" },
  saffron: { from: "#a855f7", to: "#7e22ce", ink: "#ffffff", tag: "#fbbf24" },
  ink:     { from: "#1e293b", to: "#0f172a", ink: "#ffffff", tag: "#a855f7" },
};

export function CourseThumb({
  code,
  title,
  color,
  className,
}: {
  code: string;
  title: string;
  color: keyof typeof palettes;
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
      {/* dotted grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.18]" aria-hidden>
        <defs>
          <pattern id={`dots-${code}`} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={p.ink} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${code})`} />
      </svg>

      {/* corner code tag */}
      <div className="absolute top-3 left-3 px-2 py-1 rounded-sm text-[11px] font-semibold tracking-wide"
           style={{ background: p.tag, color: color === "saffron" ? p.ink : "#1c1a17" }}>
        {code}
      </div>

      {/* title */}
      <div className="absolute inset-0 flex items-end p-5">
        <div className="font-display italic text-2xl leading-tight" style={{ letterSpacing: "-0.02em" }}>
          {title}
        </div>
      </div>
    </div>
  );
}
