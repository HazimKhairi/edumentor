// ----------------------------------------------------------------------------
// Performance scoring (monitoring module)
//
// Marks are stored numerically (AssignmentSubmission.mark, 0..100) because a
// percentage cannot be derived from a free-text letter. `grade` stays as the
// human-facing label and is kept in sync with the mark.
// ----------------------------------------------------------------------------

// UiTM-style bands. Midpoint of each band is used when converting a legacy
// letter grade back to a number, so a backfilled "B+" lands mid-band, not at
// an edge.
const BANDS: { letter: string; min: number; backfill: number }[] = [
  { letter: "A+", min: 90, backfill: 95 },
  { letter: "A", min: 80, backfill: 85 },
  { letter: "A-", min: 75, backfill: 77 },
  { letter: "B+", min: 70, backfill: 72 },
  { letter: "B", min: 65, backfill: 67 },
  { letter: "B-", min: 60, backfill: 62 },
  { letter: "C+", min: 55, backfill: 57 },
  { letter: "C", min: 50, backfill: 52 },
  { letter: "C-", min: 47, backfill: 48 },
  { letter: "D+", min: 44, backfill: 45 },
  { letter: "D", min: 40, backfill: 42 },
  { letter: "E", min: 30, backfill: 35 },
  { letter: "F", min: 0, backfill: 20 },
];

export function letterFromMark(mark: number): string {
  const m = clampMark(mark);
  for (const b of BANDS) if (m >= b.min) return b.letter;
  return "F";
}

export function clampMark(mark: number): number {
  if (!Number.isFinite(mark)) return 0;
  return Math.max(0, Math.min(100, Math.round(mark)));
}

// Best-effort read of a legacy free-text grade. Handles the three shapes the
// old text field allowed: a letter ("A-"), a percentage ("85%", "85"), and a
// fraction ("18/20"). Returns null when nothing sensible can be read.
export function markFromGradeText(text: string | null | undefined): number | null {
  if (!text) return null;
  const s = text.trim();
  if (!s) return null;

  const fraction = s.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (fraction) {
    const num = Number(fraction[1]);
    const den = Number(fraction[2]);
    if (den > 0) return clampMark((num / den) * 100);
  }

  const percent = s.match(/^(\d+(?:\.\d+)?)\s*%?$/);
  if (percent) return clampMark(Number(percent[1]));

  const letter = s.toUpperCase().replace(/\s+/g, "");
  const band = BANDS.find((b) => b.letter === letter);
  if (band) return band.backfill;

  return null;
}

// ----------------------------------------------------------------------------
// Weighted performance
// ----------------------------------------------------------------------------

export type MarkedItem = {
  /** Assignment weight as configured by the mentor. */
  weight: number;
  /** Numeric mark 0..100, or null when the work is not graded yet. */
  mark: number | null;
};

export type Performance = {
  /** Weighted average across graded work only, 0..100. Null when nothing graded. */
  percentage: number | null;
  /** How many of the issued assignments carry a mark. */
  gradedCount: number;
  /** Total assignments issued to this student. */
  issuedCount: number;
  /** gradedCount / issuedCount as a percentage, 0..100. */
  completionPct: number;
};

// Weighted average, ignoring ungraded work. Ungraded items would otherwise
// read as a zero and unfairly sink the figure, so they are reported through
// completionPct instead.
export function computePerformance(items: MarkedItem[]): Performance {
  const issuedCount = items.length;
  const graded = items.filter((i) => i.mark !== null);
  const totalWeight = graded.reduce((s, i) => s + Math.max(0, i.weight), 0);

  let percentage: number | null = null;
  if (graded.length > 0) {
    percentage =
      totalWeight > 0
        ? graded.reduce((s, i) => s + (i.mark as number) * Math.max(0, i.weight), 0) /
          totalWeight
        : graded.reduce((s, i) => s + (i.mark as number), 0) / graded.length;
    percentage = Math.round(percentage * 10) / 10;
  }

  return {
    percentage,
    gradedCount: graded.length,
    issuedCount,
    completionPct: issuedCount ? Math.round((graded.length / issuedCount) * 100) : 0,
  };
}

// Shared banding for the monitoring tables so admin and mentor views agree.
export type PerformanceBand = "Strong" | "On track" | "At risk" | "Critical" | "No data";

export function bandFor(percentage: number | null): PerformanceBand {
  if (percentage === null) return "No data";
  if (percentage >= 80) return "Strong";
  if (percentage >= 65) return "On track";
  if (percentage >= 50) return "At risk";
  return "Critical";
}

export const BAND_BADGE: Record<PerformanceBand, string> = {
  Strong: "badge badge-fern",
  "On track": "badge badge-muted",
  "At risk": "badge badge-saffron",
  Critical: "badge badge-oxblood",
  "No data": "badge badge-muted",
};
