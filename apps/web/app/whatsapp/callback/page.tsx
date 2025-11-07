"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function WhatsAppCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Processing authorization...");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      setStatus("error");
      setMessage(errorDescription || `Authorization failed: ${error}`);

      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "whatsapp_callback",
            error,
            errorDescription,
          },
          window.location.origin
        );

        // Close popup after delay
        setTimeout(() => window.close(), 3000);
      }
      return;
    }

    if (!code || !state) {
      setStatus("error");
      setMessage("Missing authorization code or state");

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "whatsapp_callback",
            error: "missing_params",
          },
          window.location.origin
        );

        setTimeout(() => window.close(), 3000);
      }
      return;
    }

    // Send success to parent window
    setStatus("success");
    setMessage("Authorization successful! Connecting your WhatsApp account...");

    if (window.opener) {
      window.opener.postMessage(
        {
          type: "whatsapp_callback",
          code,
          state,
        },
        window.location.origin
      );

      // Close popup after successful message
      setTimeout(() => window.close(), 2000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "processing" && (
            <>
              <Loader2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processing...
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Success!
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">
                This window will close automatically...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Error
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">
                This window will close automatically...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
