"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Plus, Play, Pause, Copy, Trash2 } from "lucide-react";

interface BotType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  whatsappAccount: {
    phoneNumber: string;
    displayName: string;
  } | null;
  _count: {
    nodes: number;
    conversations: number;
  };
}

export default function BotsPage() {
  const [bots, setBots] = useState<BotType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bots`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBots(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch bots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (botId: string, isActive: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bots/${botId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isActive: !isActive }),
        }
      );

      if (response.ok) {
        fetchBots();
      }
    } catch (error) {
      console.error("Failed to toggle bot:", error);
    }
  };

  const handleClone = async (botId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bots/${botId}/clone`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchBots();
      }
    } catch (error) {
      console.error("Failed to clone bot:", error);
    }
  };

  const handleDelete = async (botId: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bots/${botId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchBots();
      }
    } catch (error) {
      console.error("Failed to delete bot:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading bots...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bots</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your automated conversation bots
          </p>
        </div>
        <Link href="/dashboard/bots/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Bot
          </Button>
        </Link>
      </div>

      {bots.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bots yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first bot to start automating conversations
            </p>
            <Link href="/dashboard/bots/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Bot
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {bot.name}
                      {bot.isActive && (
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          Active
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {bot.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bot.whatsappAccount && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">WhatsApp:</span>{" "}
                      {bot.whatsappAccount.displayName}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">{bot._count.nodes}</span>{" "}
                      nodes
                    </div>
                    <div>
                      <span className="font-medium">
                        {bot._count.conversations}
                      </span>{" "}
                      conversations
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/dashboard/bots/${bot.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(bot.id, bot.isActive)}
                    >
                      {bot.isActive ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClone(bot.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(bot.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
