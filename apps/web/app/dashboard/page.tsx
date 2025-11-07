"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Send, Users } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      name: "Total Bots",
      value: "0",
      icon: Bot,
      change: "+0%",
      changeType: "neutral",
    },
    {
      name: "Conversations",
      value: "0",
      icon: MessageSquare,
      change: "+0%",
      changeType: "neutral",
    },
    {
      name: "Campaigns",
      value: "0",
      icon: Send,
      change: "+0%",
      changeType: "neutral",
    },
    {
      name: "Contacts",
      value: "0",
      icon: Users,
      change: "+0%",
      changeType: "neutral",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to BotPe AI - Your WhatsApp Automation Platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/dashboard/settings"
              className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Connect WhatsApp
              </h3>
              <p className="text-sm text-gray-600">
                Link your WhatsApp Business account to get started
              </p>
            </a>
            <a
              href="/dashboard/bots"
              className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Create Your First Bot
              </h3>
              <p className="text-sm text-gray-600">
                Build an automated conversation flow with our visual builder
              </p>
            </a>
            <a
              href="/dashboard/templates"
              className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Create Templates
              </h3>
              <p className="text-sm text-gray-600">
                Design message templates for your campaigns
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
