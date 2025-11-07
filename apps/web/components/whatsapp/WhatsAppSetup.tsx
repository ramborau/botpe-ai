"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Check, AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface WhatsAppSetupProps {
  onSuccess?: () => void;
}

export default function WhatsAppSetup({ onSuccess }: WhatsAppSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();

  const handleEmbeddedSignup = () => {
    setIsLoading(true);
    setError(null);

    // Generate secure random state
    const state = crypto.randomUUID();
    sessionStorage.setItem("whatsapp_oauth_state", state);

    const config = {
      client_id: process.env.NEXT_PUBLIC_WHATSAPP_APP_ID!,
      config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID!,
      redirect_uri: `${window.location.origin}/whatsapp/callback`,
      state,
      response_type: "code",
    };

    // Build OAuth URL
    const params = new URLSearchParams(config);
    const url = `https://www.facebook.com/v18.0/dialog/oauth?${params}`;

    // Open popup window
    const popup = window.open(
      url,
      "WhatsApp Business Setup",
      "width=600,height=700,scrollbars=yes"
    );

    if (!popup) {
      setError("Popup blocked. Please allow popups for this site.");
      setIsLoading(false);
      return;
    }

    // Listen for messages from callback page
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "whatsapp_callback") {
        const { code, state: returnedState, error: oauthError } = event.data;

        // Verify state
        const savedState = sessionStorage.getItem("whatsapp_oauth_state");
        if (returnedState !== savedState) {
          setError("Invalid state parameter. Please try again.");
          setIsLoading(false);
          popup?.close();
          return;
        }

        if (oauthError) {
          setError(`Authorization failed: ${oauthError}`);
          setIsLoading(false);
          popup?.close();
          return;
        }

        try {
          // Exchange code for access token via backend
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/embedded-signup/callback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ code }),
            }
          );

          const data = await response.json();

          if (data.success) {
            setSuccess(true);
            setError(null);
            sessionStorage.removeItem("whatsapp_oauth_state");
            popup?.close();

            // Call success callback
            if (onSuccess) {
              setTimeout(() => onSuccess(), 1500);
            }
          } else {
            setError(data.error || "Failed to connect WhatsApp account");
          }
        } catch (err: any) {
          setError("Failed to connect WhatsApp account. Please try again.");
          console.error("WhatsApp setup error:", err);
        } finally {
          setIsLoading(false);
          popup?.close();
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up listener and handle popup close
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        if (isLoading) {
          setIsLoading(false);
          setError("Setup was cancelled");
        }
      }
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <CardTitle>Connect WhatsApp Business</CardTitle>
            <CardDescription>
              Connect your WhatsApp Business account to start sending messages
              and creating bots
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Setup Failed</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Successfully Connected!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Your WhatsApp Business account is now connected.
              </p>
            </div>
          </div>
        )}

        {!success && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">What you'll need:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>A Facebook Business Manager account</li>
                <li>A WhatsApp Business account</li>
                <li>A verified phone number</li>
              </ul>
            </div>

            <Button
              onClick={handleEmbeddedSignup}
              disabled={isLoading || !session}
              className="w-full bg-[#00c307] hover:bg-[#00a006] text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Connect with WhatsApp Business
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By connecting, you agree to WhatsApp's Business Terms of Service
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
