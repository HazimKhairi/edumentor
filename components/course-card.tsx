import Link from "next/link";
import clsx from "clsx";
import { CourseThumb } from "./course-thumb";
import { StarRating } from "./star-rating";

type CourseColor = "oxblood" | "fern" | "saffron" | "ink";

export function CourseCard({
  id,
  code,
  title,
  mentor,
  cohort,
  pace,
  enrolled,
  capacity,
  sessions,
  color,
  rating,
  reviews,
  progress,
  href = "/courses",
  className,
  compact,
}: {
  id: string;
  code: string;
  title: string;
  mentor: string;
  cohort?: string;
  pace?: string;
  enrolled?: number;
  capacity?: number;
  sessions?: number;
  color: CourseColor;
  rating?: number;
  reviews?: number;
  progress?: number;
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "card card-hover group flex flex-col overflow-hidden",
        className
      )}
      data-course={id}
    >
      <CourseThumb code={code} title={title} color={color} />

      <div className={clsx("flex flex-col p-4 gap-2 flex-1", compact && "p-3 gap-1.5")}>
        <h3 className="font-semibold text-base leading-snug text-ink line-clamp-2 group-hover:text-oxblood transition-colors">
          {title}
        </h3>
        <p className="text-sm text-ink-muted">{mentor}</p>

        {typeof rating === "number" ? (
          <StarRating value={rating} count={reviews} size="xs" />
        ) : null}

        {!compact && (cohort || pace) ? (
          <p className="text-xs text-ink-muted mt-auto pt-1">
            {[cohort, pace].filter(Boolean).join(" , ")}
          </p>
        ) : null}

        {typeof progress === "number" ? (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-ink-muted">Progress</span>
              <span className="font-semibold text-ink tabular">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
              <div className="h-full bg-oxblood rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : typeof enrolled === "number" && typeof capacity === "number" && typeof sessions === "number" ? (
          <div className="flex items-center justify-between text-xs text-ink-muted mt-1 pt-2 border-t border-rule">
            <span>{sessions} sessions</span>
            <span>{enrolled}/{capacity} enrolled</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
