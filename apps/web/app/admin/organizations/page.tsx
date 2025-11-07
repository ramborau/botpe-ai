"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Bot, MessageSquare } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
  _count: {
    users: number;
    bots: number;
    conversations: number;
    campaigns: number;
  };
}

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/organizations`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.data.organizations);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (orgId: string, plan: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/organizations/${orgId}/plan`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ plan }),
        }
      );

      if (response.ok) {
        fetchOrganizations();
        setSelectedOrg(null);
      }
    } catch (error) {
      console.error("Failed to update plan:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading organizations...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
        <p className="text-gray-600 mt-1">
          Manage all organizations on the platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {organizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {org.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{org.slug}</p>
                </div>
                <div>
                  <select
                    value={org.plan}
                    onChange={(e) => updatePlan(org.id, e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm font-medium"
                  >
                    <option value="FREE">FREE</option>
                    <option value="STARTER">STARTER</option>
                    <option value="PROFESSIONAL">PROFESSIONAL</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Users</p>
                    <p className="text-lg font-semibold">{org._count.users}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Bots</p>
                    <p className="text-lg font-semibold">{org._count.bots}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Conversations</p>
                    <p className="text-lg font-semibold">
                      {org._count.conversations}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {organizations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No organizations found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
