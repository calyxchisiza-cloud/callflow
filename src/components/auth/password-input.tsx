"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-input-wrap">
      <Icon name="lock" size={17} className="auth-input-icon" />
      <input
        id={id}
        name={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        className="auth-reveal"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        <Icon name={visible ? "eyeOff" : "eye"} size={17} />
      </button>
    </div>
  );
}
