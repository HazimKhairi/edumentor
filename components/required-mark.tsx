// Tiny visual mark for required fields. Tailwind picks up the oxblood-ish
// red, aria-hidden keeps screen readers from reading "asterisk" repeatedly,
// the visible "required" sr-only span is announced instead.
export function RequiredMark() {
  return (
    <>
      <span aria-hidden className="ml-0.5 text-oxblood font-semibold">*</span>
      <span className="sr-only"> (required)</span>
    </>
  );
}
