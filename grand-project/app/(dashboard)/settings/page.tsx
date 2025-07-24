import { Metadata } from "next"
import { SettingsForm } from "@/components/settings/SettingsForm"
import { ProfileSettings } from "@/components/settings/ProfileSettings"
import { NotificationSettings } from "@/components/settings/NotificationSettings"
import { PrivacySettings } from "@/components/settings/PrivacySettings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Settings | Resume Tailor AI",
  description: "Manage your account settings and preferences.",
}

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <PrivacySettings />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <SettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}