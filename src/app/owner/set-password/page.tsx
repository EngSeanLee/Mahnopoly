import OwnerSetPasswordForm from "@/components/owner/SetPasswordForm";

export const metadata = { title: "Set your password | Mahnopoly" };

export default function OwnerSetPasswordPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Welcome — set your password</h1>
        <OwnerSetPasswordForm />
      </div>
    </div>
  );
}
