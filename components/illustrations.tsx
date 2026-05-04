/**
 * Inline SVG illustrations themed for education + indigo brand.
 * No external dependencies. Colours via CSS vars.
 */

export function IllustrationLearning({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="il-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <pattern id="il-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#fff" opacity="0.15" />
        </pattern>
      </defs>

      <rect width="600" height="600" fill="url(#il-bg)" />
      <rect width="600" height="600" fill="url(#il-dots)" />

      {/* abstract grid */}
      <g opacity="0.15" stroke="#fff" strokeWidth="1.5" fill="none">
        <path d="M40 480 L120 380 L200 420 L280 320 L360 360 L440 260 L520 300" />
        <circle cx="40" cy="480" r="4" fill="#fbbf24" />
        <circle cx="120" cy="380" r="4" fill="#fff" />
        <circle cx="200" cy="420" r="4" fill="#fff" />
        <circle cx="280" cy="320" r="4" fill="#fff" />
        <circle cx="360" cy="360" r="4" fill="#fff" />
        <circle cx="440" cy="260" r="4" fill="#fff" />
        <circle cx="520" cy="300" r="4" fill="#fbbf24" />
      </g>

      {/* book stack centre */}
      <g transform="translate(300 300)">
        {/* desk shadow */}
        <ellipse cx="0" cy="180" rx="180" ry="14" fill="#000" opacity="0.18" />

        {/* open book */}
        <g transform="translate(-130 -20)">
          {/* left page */}
          <path d="M0 0 L120 -10 L120 110 L0 100 Z" fill="#fbf3e8" />
          <path d="M120 -10 L240 0 L240 100 L120 110 Z" fill="#fff" />
          {/* spine */}
          <path d="M120 -10 L120 110" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* page lines */}
          <g stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
            <line x1="14" y1="20" x2="100" y2="16" />
            <line x1="14" y1="36" x2="100" y2="32" />
            <line x1="14" y1="52" x2="80" y2="50" />
            <line x1="14" y1="68" x2="100" y2="66" />
            <line x1="14" y1="84" x2="60" y2="84" />

            <line x1="140" y1="14" x2="226" y2="20" />
            <line x1="140" y1="30" x2="226" y2="36" />
            <line x1="140" y1="46" x2="206" y2="52" />
            <line x1="140" y1="62" x2="226" y2="68" />
            <line x1="140" y1="78" x2="186" y2="84" />
          </g>
        </g>

        {/* graduation cap floating top right */}
        <g transform="translate(60 -120) rotate(-12)">
          <path d="M-50 0 L0 -25 L50 0 L0 25 Z" fill="#1c1a17" />
          <rect x="-30" y="0" width="60" height="20" rx="2" fill="#1c1a17" />
          <path d="M40 5 L60 30 L56 32 L36 7 Z" fill="#fbbf24" />
          <circle cx="60" cy="32" r="4" fill="#fbbf24" />
        </g>

        {/* pencil left */}
        <g transform="translate(-180 30) rotate(-30)">
          <rect x="0" y="0" width="80" height="10" fill="#fbbf24" />
          <path d="M80 0 L92 5 L80 10 Z" fill="#1c1a17" />
          <rect x="0" y="0" width="14" height="10" fill="#a855f7" />
        </g>
      </g>
    </svg>
  );
}

export function IllustrationMentor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="ml-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <pattern id="ml-dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#fff" opacity="0.12" />
        </pattern>
      </defs>

      <rect width="600" height="600" fill="url(#ml-bg)" />
      <rect width="600" height="600" fill="url(#ml-dots)" />

      {/* speech bubble top right */}
      <g transform="translate(380 90)">
        <rect x="0" y="0" width="160" height="80" rx="14" fill="#fbf3e8" />
        <path d="M30 78 L20 100 L50 80 Z" fill="#fbf3e8" />
        <g stroke="#94a3b8" strokeWidth="3" strokeLinecap="round">
          <line x1="20" y1="26" x2="120" y2="26" />
          <line x1="20" y1="42" x2="140" y2="42" />
          <line x1="20" y1="58" x2="100" y2="58" />
        </g>
      </g>

      {/* speech bubble bottom left */}
      <g transform="translate(60 380)">
        <rect x="0" y="0" width="140" height="70" rx="12" fill="#a855f7" />
        <path d="M100 68 L120 90 L90 70 Z" fill="#a855f7" />
        <g stroke="#fff" strokeWidth="3" strokeLinecap="round">
          <line x1="20" y1="22" x2="110" y2="22" />
          <line x1="20" y1="38" x2="120" y2="38" />
          <line x1="20" y1="54" x2="90" y2="54" />
        </g>
      </g>

      {/* mentor figure left */}
      <g transform="translate(180 280)">
        <circle cx="0" cy="-40" r="34" fill="#fbf3e8" />
        <path d="M-50 0 Q-50 -20 0 -20 Q50 -20 50 0 L50 100 L-50 100 Z" fill="#fbbf24" />
        <rect x="-30" y="40" width="60" height="6" rx="3" fill="#1c1a17" opacity="0.2" />
        {/* arm gesture */}
        <path d="M50 10 L100 -10 L106 -2 L56 18 Z" fill="#fbf3e8" />
      </g>

      {/* mentee figure right */}
      <g transform="translate(420 290)">
        <circle cx="0" cy="-30" r="28" fill="#fbf3e8" />
        <path d="M-40 0 Q-40 -16 0 -16 Q40 -16 40 0 L40 90 L-40 90 Z" fill="#a855f7" />
      </g>

      {/* desk line */}
      <line x1="60" y1="500" x2="540" y2="500" stroke="#fff" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

export function IllustrationCourse({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="co-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
      </defs>

      <rect width="600" height="400" fill="url(#co-bg)" />

      {/* abstract circuit / nodes */}
      <g opacity="0.4" stroke="#fff" strokeWidth="1.5" fill="none">
        <path d="M60 320 L150 240 L240 280 L320 200 L420 220 L500 160" />
        <path d="M100 100 L180 160 L260 120 L340 180 L420 140" />
      </g>
      <g fill="#fbbf24">
        <circle cx="60" cy="320" r="5" />
        <circle cx="240" cy="280" r="5" />
        <circle cx="420" cy="220" r="5" />
        <circle cx="500" cy="160" r="5" />
      </g>
      <g fill="#a855f7">
        <circle cx="150" cy="240" r="5" />
        <circle cx="320" cy="200" r="5" />
        <circle cx="180" cy="160" r="5" />
        <circle cx="340" cy="180" r="5" />
      </g>

      {/* floating book */}
      <g transform="translate(280 200) rotate(-6)">
        <rect x="-90" y="-60" width="180" height="120" rx="6" fill="#fbf3e8" />
        <line x1="0" y1="-60" x2="0" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
        <g stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <line x1="-72" y1="-36" x2="-12" y2="-36" />
          <line x1="-72" y1="-20" x2="-12" y2="-20" />
          <line x1="-72" y1="-4" x2="-32" y2="-4" />
          <line x1="12" y1="-36" x2="72" y2="-36" />
          <line x1="12" y1="-20" x2="72" y2="-20" />
          <line x1="12" y1="-4" x2="52" y2="-4" />
        </g>
      </g>
    </svg>
  );
}
