"use client";

import React from "react";

type TextInputProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export function TextInput({
  id,
  name,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  disabled,
  error,
  onChange,
  onBlur,
}: TextInputProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={[
          "w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none",
          "placeholder:text-slate-400",
          "focus:ring-2 focus:ring-slate-300",
          disabled ? "cursor-not-allowed opacity-60" : "",
          error ? "border-red-300 focus:ring-red-200" : "border-slate-300",
        ].join(" ")}
      />

      {error ? (
        <p id={describedBy} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
