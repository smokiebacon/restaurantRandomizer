"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AccountsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [connectedAccounts, setConnectedAccounts] = useState({
    youtube: false,
    facebook: false,
    instagram: false,
    tiktok: false,
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch connected accounts on initial load
  useEffect(() => {
    if (session?.user) {
      // fetchConnectedAccounts();
      console.log("I AM PAGE.JS at accounts page");
    }
  }, [session]);

  const fetchConnectedAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const userData = await res.json();
        setConnectedAccounts({
          youtube: !!userData.youtubeId,
          facebook: !!userData.facebookId,
          instagram: !!userData.instagramId,
          tiktok: !!userData.tiktokId,
        });
      }
    } catch (error) {
      console.error("Error fetching account connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for connection status in URL params
  useEffect(() => {
    const newConnections = { ...connectedAccounts };
    let updated = false;
    let message = null;

    // Check for successful connections
    ["youtube", "facebook", "instagram", "tiktok"].forEach((platform) => {
      if (searchParams.has(platform)) {
        newConnections[platform] = true;
        updated = true;
        message = `${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        } connected successfully!`;
      }
    });

    // Check if there's a TikTok code in the URL (redirect from TikTok OAuth)
    const code = searchParams.get("code");
    const scopes = searchParams.get("scopes");

    if (code && scopes && scopes.includes("user.info.basic")) {
      // This appears to be a TikTok OAuth redirect
      // Redirect to our callback endpoint to handle the token exchange
      const state = searchParams.get("state");
      window.location.href = `/api/auth/tiktok/callback?code=${encodeURIComponent(
        code
      )}&state=${encodeURIComponent(state)}`;
      return; // Stop further processing as we're redirecting
    }

    // Check for errors
    const error = searchParams.get("error");
    if (error) {
      const errorParts = error.split("_");
      const platform = errorParts[0];
      let errorMessage = `Failed to connect ${platform}. Please try again.`;

      // More specific error messages
      if (errorParts.includes("expired")) {
        errorMessage = `Your ${platform} authorization session expired. Please try again.`;
      } else if (errorParts.includes("invalid")) {
        errorMessage = `Invalid authorization request for ${platform}. Please try again.`;
      } else if (errorParts.includes("token")) {
        errorMessage = `Failed to obtain access token from ${platform}. Please try again.`;
      }

      message = errorMessage;
    }

    if (updated) {
      setConnectedAccounts(newConnections);
    }

    if (message) {
      setStatusMessage(message);

      // Clear message after 5 seconds
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, connectedAccounts]);

  const socialPlatforms = [
    {
      id: "youtube",
      name: "YouTube",
      icon: (
        <svg
          className="w-8 h-8 text-red-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
      description: "Connect to post videos to YouTube",
      connected: connectedAccounts.youtube,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.64c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.736-.9 10.125-5.864 10.125-11.854z" />
        </svg>
      ),
      description: "Connect to post images, videos, and text to Facebook",
      connected: connectedAccounts.facebook,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: (
        <svg
          className="w-8 h-8 text-pink-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      description: "Connect to post images and videos to Instagram",
      connected: connectedAccounts.instagram,
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
      description: "Connect to post videos to TikTok",
      connected: connectedAccounts.tiktok,
    },
  ];

  const handleConnect = (platform) => {
    // In a real implementation, this would redirect to the OAuth flow
    window.location.href = `/api/auth/${platform}`;
  };

  const handleDisconnect = async (platform) => {
    try {
      // In a real implementation, this would call an API to revoke access
      const response = await fetch(`/api/auth/${platform}/disconnect`, {
        method: "POST",
      });

      if (response.ok) {
        setConnectedAccounts((prev) => ({
          ...prev,
          [platform]: false,
        }));
      }
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Connected Accounts
        </h1>
        <p className="text-gray-600">Manage your social media connections</p>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-md ${
            statusMessage.includes("Failed")
              ? "bg-red-50 text-red-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {socialPlatforms.map((platform) => (
          <div
            key={platform.id}
            className="p-6 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {platform.icon}
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {platform.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {platform.description}
                  </p>
                </div>
              </div>

              {platform.connected ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-3 h-3 mr-1 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Connected
                  </span>
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="text-sm text-gray-600 hover:text-red-600"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-400 hover:bg-green-500"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Permissions</h2>
        <p className="text-gray-600 mb-6">
          When you connect a social media account, HashiPost requests these
          permissions:
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-medium text-gray-800">Post on your behalf</h3>
              <p className="text-gray-600 text-sm">
                We need this permission to publish content to your accounts
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-medium text-gray-800">
                Read profile information
              </h3>
              <p className="text-gray-600 text-sm">
                We need this to identify your account
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-500 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-medium text-gray-800">
                We never post without your permission
              </h3>
              <p className="text-gray-600 text-sm">
                HashiPost will only post content that you explicitly approve
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
