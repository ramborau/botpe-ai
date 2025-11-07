"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcomeMessage: "Hello! How can I help you today?",
    fallbackMessage: "I didn't understand that. Can you please rephrase?",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bots`,
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
        const data = await response.json();
        router.push(`/dashboard/bots/${data.data.id}`);
      }
    } catch (error) {
      console.error("Failed to create bot:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Bot</h1>
        <p className="mt-2 text-gray-600">
          Set up your automated conversation bot
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Bot Details</CardTitle>
          <CardDescription>
            Provide basic information about your bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Customer Support Bot"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What does this bot do?"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Input
                id="welcomeMessage"
                placeholder="First message users see"
                value={formData.welcomeMessage}
                onChange={(e) =>
                  setFormData({ ...formData, welcomeMessage: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                This message is sent when a conversation starts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallbackMessage">Fallback Message</Label>
              <Input
                id="fallbackMessage"
                placeholder="Message when bot doesn't understand"
                value={formData.fallbackMessage}
                onChange={(e) =>
                  setFormData({ ...formData, fallbackMessage: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Shown when the bot doesn't understand user input
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Bot"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
