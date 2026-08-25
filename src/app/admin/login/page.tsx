import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Staff Sign In | Mahnopoly" };

export default function AdminLoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Staff Sign In</h1>
        <LoginForm />
        <p style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <Link href="/" style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
            &larr; Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
