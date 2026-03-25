// components/ui/Input.tsx
"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";

type BaseProps = {
  label?: string;
  required?: boolean;
  error?: string;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
    rows?: number;
  };

type Props = InputProps | TextareaProps;

const Input = (props: Props) => {
  const { label, required, error, multiline, className: externalClassName, ...rest } = props;
  const [focused, setFocused] = useState(false);

  const baseStyle: React.CSSProperties = {
    borderColor: error ? "var(--error)" : focused ? "var(--primary)" : "var(--border)",
    color: "var(--text-primary)",
    backgroundColor: "var(--canvas)",
  };

  const baseClassName = `w-full px-4 py-2.5 text-sm border outline-none transition-colors bg-transparent ${externalClassName ?? ""}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="text-[11px] tracking-wider uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
          {required && (
            <span className="ml-1" style={{ color: "var(--error)" }}>
              *
            </span>
          )}
        </label>
      )}

      {multiline ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={`${baseClassName} resize-none`}
          style={baseStyle}
          onFocus={(e) => {
            setFocused(true);
            (rest as TextareaHTMLAttributes<HTMLTextAreaElement>).onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            (rest as TextareaHTMLAttributes<HTMLTextAreaElement>).onBlur?.(e);
          }}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={baseClassName}
          style={baseStyle}
          onFocus={(e) => {
            setFocused(true);
            (rest as InputHTMLAttributes<HTMLInputElement>).onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            (rest as InputHTMLAttributes<HTMLInputElement>).onBlur?.(e);
          }}
        />
      )}

      {error && (
        <span className="text-[11px]" style={{ color: "var(--error)" }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
