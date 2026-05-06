"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import type { ClassFormat } from "@/lib/data";

const FORMATS: ClassFormat[] = ["In person", "Online", "Hybrid"];

export function ClassFormatPicker() {
  const [format, setFormat] = useState<ClassFormat>("In person");
  const showMeetingLink = format === "Online" || format === "Hybrid";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Format</label>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <label key={f} className="cursor-pointer">
              <input
                type="radio"
                name="format"
                value={f}
                checked={format === f}
                onChange={() => setFormat(f)}
                className="sr-only peer"
              />
              <span className="px-3 py-1.5 rounded-full text-sm border border-rule peer-checked:bg-ink peer-checked:text-bone peer-checked:border-ink">
                {f}
              </span>
            </label>
          ))}
        </div>
      </div>

      {showMeetingLink ? (
        <div>
          <label className="block text-sm font-medium mb-1.5">
            <span className="inline-flex items-center gap-1.5">
              <Video size={14} className="text-ink-muted" />
              Google Meet link
            </span>
          </label>
          <input
            type="url"
            name="meetingLink"
            placeholder="https://meet.google.com/abc-defg-hij"
            className="input"
            pattern="https?://.+"
          />
          <p className="text-xs text-ink-muted mt-1.5">
            Junior students will see a Join button on their dashboard when the
            session starts.
          </p>
        </div>
      ) : null}
    </div>
  );
}
