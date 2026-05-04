import clsx from "clsx";

export function RuleLabel({
  numeral,
  label,
  caption,
  className,
}: {
  numeral?: string;
  label: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-baseline gap-4", className)}>
      {numeral ? (
        <span className="numeral shrink-0 text-ink">{numeral}</span>
      ) : null}
      <span className="label text-ink">{label}</span>
      <span className="rule flex-1 self-center" />
      {caption ? <span className="numeral shrink-0">{caption}</span> : null}
    </div>
  );
}
