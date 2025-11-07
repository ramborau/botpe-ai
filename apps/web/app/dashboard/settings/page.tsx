"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Phone, CheckCircle, XCircle } from "lucide-react";

export default function SettingsPage() {
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    displayName: "",
    accessToken: "",
    businessAccountId: "",
    phoneNumberId: "",
  });

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp-accounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setShowConnectForm(false);
        setFormData({
          phoneNumber: "",
          displayName: "",
          accessToken: "",
          businessAccountId: "",
          phoneNumberId: "",
        });
        // TODO: Refresh accounts list
      }
    } catch (error) {
      console.error("Failed to connect WhatsApp account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your WhatsApp accounts and organization settings
        </p>
      </div>

      {/* WhatsApp Accounts */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>WhatsApp Accounts</CardTitle>
              <CardDescription>
                Connect and manage your WhatsApp Business accounts
              </CardDescription>
            </div>
            {!showConnectForm && (
              <Button onClick={() => setShowConnectForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Connect Account
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showConnectForm ? (
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="My Business"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAccountId">Business Account ID</Label>
                  <Input
                    id="businessAccountId"
                    placeholder="123456789"
                    value={formData.businessAccountId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessAccountId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                  <Input
                    id="phoneNumberId"
                    placeholder="987654321"
                    value={formData.phoneNumberId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneNumberId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Your WhatsApp Business API token"
                  value={formData.accessToken}
                  onChange={(e) =>
                    setFormData({ ...formData, accessToken: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Get your access token from the Meta Business Manager
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Connecting..." : "Connect Account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConnectForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Phone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No WhatsApp accounts connected yet</p>
              <p className="text-sm mt-2">
                Click "Connect Account" to add your first WhatsApp Business
                account
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Manage your organization details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Your Organization"
                disabled
              />
            </div>
            <Button disabled>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
