"use client";

import { useState, useEffect } from "react";
import WhatsAppSetup from "@/components/whatsapp/WhatsAppSetup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface WhatsAppAccount {
  id: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: string;
  status: string;
  createdAt: string;
}

export default function WhatsAppSettingsPage() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/accounts`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("Are you sure you want to disconnect this WhatsApp account?")) {
      return;
    }

    setDeleting(accountId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/accounts/${accountId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setAccounts(accounts.filter((acc) => acc.id !== accountId));
      } else {
        alert("Failed to disconnect WhatsApp account");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to disconnect WhatsApp account");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "SUSPENDED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getQualityColor = (rating: string) => {
    switch (rating.toUpperCase()) {
      case "GREEN":
        return "text-green-600 bg-green-100";
      case "YELLOW":
        return "text-yellow-600 bg-yellow-100";
      case "RED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading WhatsApp accounts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">WhatsApp Accounts</h1>
        <p className="mt-2 text-gray-600">
          Connect and manage your WhatsApp Business accounts
        </p>
      </div>

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Connected Accounts
          </h2>

          {accounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {account.verifiedName || "WhatsApp Business"}
                        </h3>
                        <p className="text-gray-600">
                          {account.displayPhoneNumber}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            account.status
                          )}`}
                        >
                          {account.status}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getQualityColor(
                            account.qualityRating
                          )}`}
                        >
                          Quality: {account.qualityRating}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        <div>WABA ID: {account.wabaId}</div>
                        <div>Phone Number ID: {account.phoneNumberId}</div>
                        <div>
                          Connected:{" "}
                          {new Date(account.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                    disabled={deleting === account.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleting === account.id ? (
                      "Disconnecting..."
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Setup New Account */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {accounts.length > 0
            ? "Connect Another Account"
            : "Get Started"}
        </h2>

        <WhatsAppSetup onSuccess={fetchAccounts} />

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Before you start:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Create a Facebook Business Manager account</li>
                <li>Create a WhatsApp Business Account (WABA)</li>
                <li>Have a phone number verified with WhatsApp</li>
                <li>Have admin access to your Facebook Business Manager</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Common Issues:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Make sure popups are enabled for this website</li>
                <li>Ensure you have admin permissions on the WABA</li>
                <li>Your WhatsApp number must be verified</li>
                <li>The number cannot be used with WhatsApp personal app</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <a
                href="https://developers.facebook.com/docs/whatsapp/embedded-signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View WhatsApp Embedded Signup Documentation →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
