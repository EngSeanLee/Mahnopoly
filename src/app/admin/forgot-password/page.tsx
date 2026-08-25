import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata = { title: "Reset Password | Mahnopoly" };

export default function ForgotPasswordPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Reset Your Password</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
