import type { ReactNode } from "react";
import { AuthScene } from "./auth-scene";
import { AuthTransition } from "./auth-transition";

type AuthFrameProps = {
  children: ReactNode;
  wide?: boolean;
  tall?: boolean;
};

export function AuthFrame({ children, wide = false, tall = false }: AuthFrameProps) {
  return (
    <>
      <AuthTransition />
      <main className="auth-stage">
        <section
          className={`auth-frame${wide ? " is-wide" : ""}`}
          aria-label="Callflow account"
        >
          <AuthScene />
          <section className={`auth-panel${tall ? " is-tall" : ""}`}>{children}</section>
        </section>
      </main>
    </>
  );
}
