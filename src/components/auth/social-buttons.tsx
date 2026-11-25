"use client";

type SocialButtonsProps = {
  onSelect: (provider: string) => void;
};

export function SocialButtons({ onSelect }: SocialButtonsProps) {
  return (
    <div className="auth-social" aria-label="Alternative sign-in options">
      <button type="button" onClick={() => onSelect("Google")} aria-label="Continue with Google">
        <b className="auth-google">G</b>
      </button>
      <button type="button" onClick={() => onSelect("Microsoft")} aria-label="Continue with Microsoft">
        <svg className="auth-ms" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#f35325" d="M1 1h7.2v7.2H1z" />
          <path fill="#81bc06" d="M9.1 1h7.2v7.2H9.1z" />
          <path fill="#05a6f0" d="M1 9.1h7.2v7.2H1z" />
          <path fill="#ffba08" d="M9.1 9.1h7.2v7.2H9.1z" />
        </svg>
      </button>
      <button type="button" onClick={() => onSelect("GitHub")} aria-label="Continue with GitHub">
        <svg className="auth-github" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.2.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 2.3 4.6 1.6.1-.8.4-1.3.7-1.6-2.5-.3-5.1-1.3-5.1-5.5 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 2.9 0 4.2-2.6 5.2-5.1 5.5.4.3.8 1 .8 2.1v3.1c0 .4.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
        </svg>
      </button>
    </div>
  );
}
