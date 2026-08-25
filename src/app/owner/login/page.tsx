import Link from "next/link";
import OwnerLoginForm from "@/components/owner/LoginForm";

export const metadata = { title: "Owner sign in | Mahnopoly" };

export default function OwnerLoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Owner sign in</h1>
        <OwnerLoginForm />
        <p style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <Link href="/" style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
            &larr; Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
