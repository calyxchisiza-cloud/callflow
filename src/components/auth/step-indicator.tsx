import { Fragment } from "react";

type StepIndicatorProps = {
  active: 1 | 2 | 3;
};

const steps = ["Account", "Workspace", "Plan"];

export function StepIndicator({ active }: StepIndicatorProps) {
  return (
    <nav className="auth-steps" aria-label="Account setup progress">
      {steps.map((label, index) => {
        const number = index + 1;
        const state =
          number === active ? " is-active" : number < active ? " is-done" : "";
        return (
          <Fragment key={label}>
            {index > 0 && <span className="auth-step-line" aria-hidden="true" />}
            <span
              className={`auth-step${state}`}
              aria-current={number === active ? "step" : undefined}
            >
              <span className="auth-step-dot" aria-hidden="true">
                {number < active ? "✓" : number}
              </span>
              <span>{label}</span>
            </span>
          </Fragment>
        );
      })}
    </nav>
  );
}
