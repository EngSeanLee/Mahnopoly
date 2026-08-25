import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export const metadata = { title: "Set New Password | Mahnopoly" };

export default function ResetPasswordPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Set a New Password</h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
