import OwnerSetPasswordForm from "@/components/owner/SetPasswordForm";

export const metadata = { title: "Set Your Password | Mahnopoly" };

export default function OwnerSetPasswordPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Welcome — Set Your Password</h1>
        <OwnerSetPasswordForm />
      </div>
    </div>
  );
}
