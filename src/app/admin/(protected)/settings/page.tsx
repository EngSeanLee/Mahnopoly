import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="add-property-panel open">
      <h3>Settings</h3>
      <SettingsForm settings={settings} />
    </div>
  );
}
