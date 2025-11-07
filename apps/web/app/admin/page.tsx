"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Bot, MessageSquare, Send } from "lucide-react";

interface PlatformStats {
  totalOrganizations: number;
  totalUsers: number;
  totalBots: number;
  totalConversations: number;
  totalCampaigns: number;
  organizationsByPlan: {
    FREE: number;
    STARTER: number;
    PROFESSIONAL: number;
    ENTERPRISE: number;
  };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-red-600">Failed to load statistics</div>;
  }

  const overviewCards = [
    {
      title: "Total Organizations",
      value: stats.totalOrganizations,
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Total Bots",
      value: stats.totalBots,
      icon: Bot,
      color: "bg-purple-500",
    },
    {
      title: "Total Conversations",
      value: stats.totalConversations,
      icon: MessageSquare,
      color: "bg-orange-500",
    },
    {
      title: "Total Campaigns",
      value: stats.totalCampaigns,
      icon: Send,
      color: "bg-pink-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-1">
          Monitor your platform's performance and growth
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {overviewCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plans Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Organizations by Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats.organizationsByPlan).map(([plan, count]) => (
              <div key={plan} className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-600">{plan}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(
                    ((count || 0) / stats.totalOrganizations) * 100
                  )}
                  % of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
