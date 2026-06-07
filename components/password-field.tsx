"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { RequiredMark } from "@/components/required-mark";

type Props = {
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  hint?: string;
};

export function PasswordField({
  name = "password",
  label = "Password",
  placeholder = "Enter your password",
  required = true,
  autoComplete = "current-password",
  defaultValue = "",
  hint,
}: Props) {
  const [shown, setShown] = useState(false);
  const id = useId();
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required ? <RequiredMark /> : null}
        </label>
        {hint ? <span className="text-xs text-ink-muted">{hint}</span> : null}
      </div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={shown ? "text" : "password"}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="input pr-10"
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink rounded"
        >
          {shown ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
