import Header from '../components/layout/Header';
import { Card, CardHeader } from '../components/common/Card';
import { LuBell, LuMail, LuPalette, LuShield } from 'react-icons/lu';

function Settings() {
  return (
    <div className="min-h-screen">
      <Header title="Settings" subtitle="Configure system preferences" />

      <div className="p-6">
        <div className="max-w-3xl space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader
              title="Email Notifications"
              subtitle="Configure patient notification settings"
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <LuMail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Approval Notifications</p>
                    <p className="text-sm text-muted-foreground">Send email when symptom is approved</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <LuBell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">WhatsApp Integration</p>
                    <p className="text-sm text-muted-foreground">Send WhatsApp notifications (mock)</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader
              title="Security"
              subtitle="Manage access and authentication"
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <LuShield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin login</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader
              title="Appearance"
              subtitle="Customize the interface"
            />
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <LuPalette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Light mode optimized for healthcare</p>
                </div>
              </div>
              <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground">
                Light
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Settings