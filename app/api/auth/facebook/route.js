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
    // In a real implementation, we would redirect to Facebook OAuth
    // with appropriate scopes for posting to Facebook
    // The redirect URI would be something like /api/auth/facebook/callback
    
    /*
    const facebookOAuthURL = `https://www.facebook.com/v16.0/dialog/oauth?
      client_id=${process.env.FACEBOOK_APP_ID}
      &redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`)}
      &scope=public_profile,publish_to_groups,pages_manage_posts,pages_read_engagement
    `;

    return NextResponse.redirect(facebookOAuthURL);
    */

    // For demo purposes, we'll just redirect back to the accounts page
    // with a success parameter
    return NextResponse.redirect(
      new URL("/dashboard/accounts?facebook=connected", req.url)
    );
  } catch (error) {
    console.error("Error starting Facebook OAuth flow:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts?error=facebook_auth_failed", req.url)
    );
  }
}