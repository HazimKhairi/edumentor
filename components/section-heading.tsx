import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div className="max-w-2xl">
        {eyebrow ? (
          <div className="text-sm font-semibold text-oxblood mb-2">{eyebrow}</div>
        ) : null}
        <h2 className="display text-3xl md:text-4xl text-ink">{title}</h2>
        {description ? (
          <p className="text-ink-muted mt-2 leading-relaxed">{description}</p>
        ) : null}
      </div>
      {link ? (
        <Link
          href={link.href}
          className="text-sm font-semibold text-oxblood hover:text-oxblood-deep transition-colors flex items-center gap-1"
        >
          {link.label} <ArrowRight size={14} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
