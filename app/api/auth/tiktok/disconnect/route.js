import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import dbConnect from "@/libs/mongo";
import User from "@/models/User";

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database and update user
    await dbConnect();
    
    // In a production app, you would also call TikTok's revoke token API
    // to properly revoke permissions on TikTok's side
    
    await User.findByIdAndUpdate(session.user.id, {
      $unset: {
        tiktokId: 1,
        tiktokToken: 1,
        "tiktokAuth.refreshToken": 1,
        "tiktokAuth.expiresAt": 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting TikTok account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect TikTok account" },
      { status: 500 }
    );
  }
}