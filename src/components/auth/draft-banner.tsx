import { accountServiceOnline } from "@/lib/onboarding";

export function DraftBanner() {
  if (accountServiceOnline) return null;
  return (
    <p className="auth-draft">
      <span>
        <strong>Draft mode.</strong> The account service isn&apos;t connected yet, so these
        details are kept only in this browser session — no account has been created.
      </span>
    </p>
  );
}
