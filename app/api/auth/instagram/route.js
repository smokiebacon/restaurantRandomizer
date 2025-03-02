import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function GET(req) {
  // Check authentication - user needs to be logged in first
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  try {
    // In a real implementation, we would redirect to Instagram OAuth
    // Instagram is connected through Facebook's Graph API since
    // Instagram is owned by Meta/Facebook

    const instagramOAuthURL = `https://api.instagram.com/oauth/authorize?
      client_id=${process.env.INSTAGRAM_APP_ID}
      &redirect_uri=${encodeURIComponent(
        `${process.env.NEXTAUTH_URL}/api/auth/instagram/callback`
      )}
      &scope=user_profile,user_media
      &response_type=code
    `;

    return NextResponse.redirect(instagramOAuthURL);

    // For demo purposes, we'll just redirect back to the accounts page
    // with a success parameter
    return NextResponse.redirect(
      new URL("/dashboard/accounts?instagram=connected", req.url)
    );
  } catch (error) {
    console.error("Error starting Instagram OAuth flow:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts?error=instagram_auth_failed", req.url)
    );
  }
}
