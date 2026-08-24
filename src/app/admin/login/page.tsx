import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Staff sign in | Mahnopoly" };

export default function AdminLoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Staff sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
