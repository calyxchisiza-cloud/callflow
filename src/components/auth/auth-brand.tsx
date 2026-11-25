import Link from "next/link";

export function AuthBrand() {
  return (
    <Link className="auth-brand" href="/landing" aria-label="Callflow home">
      <img src="/callflow-mark.svg" alt="" width={25} height={25} />
      <span>callflow</span>
    </Link>
  );
}
