import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export const metadata = { title: "Set new password | Mahnopoly" };

export default function ResetPasswordPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Set a new password</h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
