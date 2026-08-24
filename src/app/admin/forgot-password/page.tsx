import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata = { title: "Reset password | Mahnopoly" };

export default function ForgotPasswordPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Reset your password</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
