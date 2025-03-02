import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import dbConnect from "@/libs/mongo";
import User from "@/models/User";
import config from "@/config";

export async function GET(req) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    console.log("HI I AM ROUTE IN CALLBACK");

    if (!code) {
      console.error("No code provided in callback");
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=tiktok_no_code", req.url)
      );
    }

    // Retrieve user and verify state for CSRF protection
    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user?.tiktokAuth?.csrfState || user.tiktokAuth.csrfState !== state) {
      console.error("CSRF state validation failed");
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=tiktok_invalid_state", req.url)
      );
    }

    // Check if the code verifier is still valid (within 10 minutes)
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    if (
      !user.tiktokAuth.timestamp ||
      user.tiktokAuth.timestamp < tenMinutesAgo
    ) {
      console.error("Code verifier expired");
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=tiktok_expired", req.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY,
          client_secret: process.env.TIKTOK_CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: config.social.tiktok.redirectUri,
          code_verifier: user.tiktokAuth.codeVerifier,
        }).toString(),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("TikTok token exchange failed:", errorData);
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=tiktok_token_exchange", req.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, open_id, refresh_token, expires_in } = tokenData;

    // Get user info to confirm identity
    const userInfoResponse = await fetch(
      "https://open.tiktokapis.com/v2/user/info/",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      console.error("Failed to fetch TikTok user info");
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=tiktok_user_info", req.url)
      );
    }

    const userInfo = await userInfoResponse.json();
    const tiktokUsername = userInfo.data.user.display_name;

    // Calculate token expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Update user in database
    await User.findByIdAndUpdate(session.user.id, {
      tiktokId: open_id,
      tiktokToken: access_token,
      "tiktokAuth.refreshToken": refresh_token,
      "tiktokAuth.expiresAt": expiresAt,
      // Clear temporary auth data
      "tiktokAuth.codeVerifier": "",
      "tiktokAuth.csrfState": "",
    });

    // Redirect back to accounts page with success
    return NextResponse.redirect(
      new URL("/dashboard/accounts?tiktok=true", req.url)
    );
  } catch (error) {
    console.error("Error in TikTok callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts?error=tiktok_unknown", req.url)
    );
  }
}
