import clsx from "clsx";

export function Marquee({
  items,
  reverse = false,
  className,
  separator = "✦",
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  separator?: string;
}) {
  const list = [...items, ...items, ...items, ...items];
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <div
        className={clsx(
          "flex w-max items-center gap-12 whitespace-nowrap will-change-transform",
          reverse ? "marquee-track-rev" : "marquee-track"
        )}
        aria-hidden
      >
        {list.map((item, idx) => (
          <span key={idx} className="flex items-center gap-12">
            <span>{item}</span>
            <span className="text-oxblood">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
