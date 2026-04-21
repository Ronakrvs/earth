"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings, Globe, Share2, Shield, 
  Save, Landmark, BellRing, Mail, Loader2,
  Megaphone, Zap, Gift, Users, CreditCard, LayoutGrid
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState<any>({
    storeName: "SHIGRUVEDAS",
    supportEmail: "hello@shigruvedas.com",
    storeDescription: "Premium organic moringa products directly from our farm in India.",
    metaTitle: "Shigruvedas - Organic Moringa Farm",
    metaKeywords: "organic, moringa, health, ayurveda",
    instagram: "",
    facebook: "",
    twitter: "",
    whatsapp: "",
    emailNotifications: true,
    orderAlerts: true,
    stockAlerts: true,
    twoFactorAuth: false
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        if (data.config) {
          setSettings(data.config)
        } else if (Object.keys(data).length > 0) {
          // Fallback if data is already flattened or using different structure
          setSettings(data)
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      // For now, we save everything as one block or by section
      // The API supports key-value upsert, let's treat 'general' as a key
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "config", value: settings })
      })

      if (!response.ok) throw new Error("Failed to save")
      
      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Error saving settings")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Configure your store preferences and integrations.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Navigation Tabs - simulated for now */}
        <div className="space-y-2">
           {[
             { id: "general", label: "General Store", icon: Landmark },
             { id: "seo", label: "SEO & Meta", icon: Globe },
             { id: "business", label: "Business Tools", icon: Settings },
             { id: "social", label: "Social", icon: Share2 },
             { id: "notifications", label: "Notifications", icon: BellRing },
             { id: "security", label: "Security & Access", icon: Shield },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                 activeTab === tab.id
                   ? "bg-white text-green-700 shadow-sm border border-slate-100" 
                   : "text-slate-500 hover:bg-white hover:text-slate-900"
               }`}
             >
               <tab.icon className="h-5 w-5 opacity-70" />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="xl:col-span-2 space-y-6">
           {activeTab === "general" && (
             <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                   <CardTitle className="text-xl font-black text-slate-900">General Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label htmlFor="store-name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Store Name</Label>
                         <Input 
                          id="store-name" 
                          value={settings.storeName} 
                          onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="store-email" className="text-xs font-bold uppercase tracking-widest text-slate-400">Support Email</Label>
                         <Input 
                          id="store-email" 
                          type="email" 
                          value={settings.supportEmail}
                          onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <Label htmlFor="store-desc" className="text-xs font-bold uppercase tracking-widest text-slate-400">Store Description</Label>
                      <Textarea 
                        id="store-desc" 
                        value={settings.storeDescription}
                        onChange={(e) => setSettings({...settings, storeDescription: e.target.value})}
                        className="rounded-xl border-slate-100 min-h-[120px] font-medium leading-relaxed" 
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                         <Label htmlFor="currency" className="text-xs font-bold uppercase tracking-widest text-slate-400">Currency</Label>
                         <Input id="currency" defaultValue="INR (₹)" disabled className="rounded-xl border-slate-100 bg-slate-50 h-12 font-medium" />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="timezone" className="text-xs font-bold uppercase tracking-widest text-slate-400">Timezone</Label>
                         <Input id="timezone" defaultValue="GMT+5:30 (IST)" disabled className="rounded-xl border-slate-100 bg-slate-50 h-12 font-medium" />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="lang" className="text-xs font-bold uppercase tracking-widest text-slate-400">Language</Label>
                         <Input id="lang" defaultValue="English (IN)" className="rounded-xl border-slate-100 h-12 font-medium" />
                      </div>
                   </div>
                </CardContent>
             </Card>
           )}

           {activeTab === "seo" && (
             <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                   <CardTitle className="text-xl font-black text-slate-900">SEO Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="space-y-2">
                      <Label htmlFor="meta-title" className="text-xs font-bold uppercase tracking-widest text-slate-400">Default Meta Title</Label>
                      <Input 
                        id="meta-title" 
                        value={settings.metaTitle}
                        onChange={(e) => setSettings({...settings, metaTitle: e.target.value})}
                        className="rounded-xl border-slate-100 h-12 font-medium" 
                      />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="meta-keywords" className="text-xs font-bold uppercase tracking-widest text-slate-400">Meta Keywords</Label>
                      <Input 
                        id="meta-keywords" 
                        value={settings.metaKeywords}
                        onChange={(e) => setSettings({...settings, metaKeywords: e.target.value})}
                        className="rounded-xl border-slate-100 h-12 font-medium" 
                      />
                   </div>
                </CardContent>
             </Card>
           )}

            {activeTab === "business" && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                   <CardHeader className="p-8 pb-0">
                      <div className="flex items-center gap-3">
                        <Megaphone className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-black text-slate-900">Announcement Bar</CardTitle>
                      </div>
                   </CardHeader>
                   <CardContent className="p-8 space-y-6">
                      <div className="space-y-2">
                         <Label htmlFor="ann-text" className="text-xs font-bold uppercase tracking-widest text-slate-400">Announcement Text</Label>
                         <Input 
                          id="ann-text" 
                          value={settings.announcement_text || ""} 
                          onChange={(e) => setSettings({...settings, announcement_text: e.target.value})}
                          placeholder="e.g. Free shipping on orders above ₹499"
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="ann-link" className="text-xs font-bold uppercase tracking-widest text-slate-400">Announcement Link</Label>
                         <Input 
                          id="ann-link" 
                          value={settings.announcement_link || ""} 
                          onChange={(e) => setSettings({...settings, announcement_link: e.target.value})}
                          placeholder="/shop"
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                   </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                   <CardHeader className="p-8 pb-0">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-black text-slate-900">Feature Toggles</CardTitle>
                      </div>
                   </CardHeader>
                   <CardContent className="p-8 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-slate-400" />
                            <div>
                               <div className="font-bold text-slate-900">Subscription System</div>
                               <div className="text-xs text-slate-400 font-medium">Enable recurring delivery options</div>
                            </div>
                         </div>
                         <Switch 
                          checked={settings.subscription_enabled} 
                          onCheckedChange={(checked) => setSettings({...settings, subscription_enabled: checked})}
                         />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-slate-400" />
                            <div>
                               <div className="font-bold text-slate-900">Referral Program</div>
                               <div className="text-xs text-slate-400 font-medium">Allow customers to refer friends for rewards</div>
                            </div>
                         </div>
                         <Switch 
                          checked={settings.referral_enabled} 
                          onCheckedChange={(checked) => setSettings({...settings, referral_enabled: checked})}
                         />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <Gift className="h-5 w-5 text-slate-400" />
                            <div>
                               <div className="font-bold text-slate-900">Loyalty Points</div>
                               <div className="text-xs text-slate-400 font-medium">Enable earning and redeeming points</div>
                            </div>
                         </div>
                         <Switch 
                          checked={settings.loyalty_enabled} 
                          onCheckedChange={(checked) => setSettings({...settings, loyalty_enabled: checked})}
                         />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-slate-400" />
                            <div>
                               <div className="font-bold text-slate-900">Coupon System</div>
                               <div className="text-xs text-slate-400 font-medium">Enable discount codes at checkout</div>
                            </div>
                         </div>
                         <Switch 
                          checked={settings.coupon_enabled} 
                          onCheckedChange={(checked) => setSettings({...settings, coupon_enabled: checked})}
                         />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <LayoutGrid className="h-5 w-5 text-slate-400" />
                            <div>
                               <div className="font-bold text-slate-900">Product Bundles</div>
                               <div className="text-xs text-slate-400 font-medium">Enable curated bundles across the site</div>
                            </div>
                         </div>
                         <Switch 
                          checked={settings.bundles_enabled} 
                          onCheckedChange={(checked) => setSettings({...settings, bundles_enabled: checked})}
                         />
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}

           {activeTab === "social" && (
             <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                   <CardTitle className="text-xl font-black text-slate-900">Social Presence</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label htmlFor="instagram" className="text-xs font-bold uppercase tracking-widest text-slate-400">Instagram</Label>
                         <Input 
                          id="instagram" 
                          value={settings.instagram} 
                          onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                          placeholder="https://instagram.com/..." 
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="facebook" className="text-xs font-bold uppercase tracking-widest text-slate-400">Facebook</Label>
                         <Input 
                          id="facebook" 
                          value={settings.facebook} 
                          onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                          placeholder="https://facebook.com/..." 
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label htmlFor="twitter" className="text-xs font-bold uppercase tracking-widest text-slate-400">Twitter (X)</Label>
                         <Input 
                          id="twitter" 
                          value={settings.twitter} 
                          onChange={(e) => setSettings({...settings, twitter: e.target.value})}
                          placeholder="https://twitter.com/..." 
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-widest text-slate-400">WhatsApp Number</Label>
                         <Input 
                          id="whatsapp" 
                          value={settings.whatsapp} 
                          onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                          placeholder="+91..." 
                          className="rounded-xl border-slate-100 h-12 font-medium" 
                         />
                      </div>
                   </div>
                </CardContent>
             </Card>
           )}

           {activeTab === "notifications" && (
             <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                   <CardTitle className="text-xl font-black text-slate-900">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div>
                            <div className="font-bold text-slate-900">Email Notifications</div>
                            <div className="text-xs text-slate-400 font-medium">Receive all system alerts via email</div>
                         </div>
                         <Input 
                          type="checkbox" 
                          checked={settings.emailNotifications} 
                          onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                          className="w-5 h-5 accent-green-600 cursor-pointer" 
                         />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div>
                            <div className="font-bold text-slate-900">New Order Alerts</div>
                            <div className="text-xs text-slate-400 font-medium">Get notified when a customer places an order</div>
                         </div>
                         <Input 
                          type="checkbox" 
                          checked={settings.orderAlerts} 
                          onChange={(e) => setSettings({...settings, orderAlerts: e.target.checked})}
                          className="w-5 h-5 accent-green-600 cursor-pointer" 
                         />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div>
                            <div className="font-bold text-slate-900">Low Stock Alerts</div>
                            <div className="text-xs text-slate-400 font-medium">Alert when product variants go below threshold</div>
                         </div>
                         <Input 
                          type="checkbox" 
                          checked={settings.stockAlerts} 
                          onChange={(e) => setSettings({...settings, stockAlerts: e.target.checked})}
                          className="w-5 h-5 accent-green-600 cursor-pointer" 
                         />
                      </div>
                   </div>
                </CardContent>
             </Card>
           )}

           {activeTab === "security" && (
             <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                   <CardTitle className="text-xl font-black text-slate-900">Security & Access</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="p-6 border border-amber-100 bg-amber-50/50 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-amber-800">
                         <Shield className="h-5 w-5" />
                         <span className="font-bold text-sm uppercase tracking-tight">Admin Safeguards</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <div className="text-sm font-bold text-slate-900">Require Two-Factor (Mock)</div>
                            <div className="text-xs text-slate-500">Enable additional security for admin logins</div>
                         </div>
                         <Input 
                          type="checkbox" 
                          checked={settings.twoFactorAuth} 
                          onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                          className="w-5 h-5 accent-orange-500 cursor-pointer" 
                         />
                      </div>
                   </div>
                   <div className="space-y-4 pt-4">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Audit Logs</Label>
                      <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
                         Audit logs feature coming soon to provide full transparency of admin actions.
                      </div>
                   </div>
                </CardContent>
             </Card>
           )}

           <div className="flex items-center justify-end gap-4 pt-4">
              <Button variant="ghost" className="rounded-xl font-bold px-8 h-12" onClick={fetchSettings}>Reset</Button>
              <Button 
                onClick={() => handleSave("config")} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-black px-10 h-12 shadow-lg shadow-green-200 transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
              </Button>
           </div>
        </div>
      </div>
    </div>
  )
}
