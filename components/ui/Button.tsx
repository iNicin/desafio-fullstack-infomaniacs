"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export function Button({ isLoading, disabled, children, ...props }: ButtonProps) {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
        "bg-slate-900 text-white shadow-sm",
        "hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300",
        isDisabled ? "cursor-not-allowed opacity-70" : "",
      ].join(" ")}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Entrando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
