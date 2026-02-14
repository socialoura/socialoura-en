import { NextRequest, NextResponse } from "next/server";

// Unified response format
export interface UnifiedUser {
  username: string;
  full_name: string;
  avatar_url: string;
  is_verified: boolean;
}

// RapidAPI Configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const INSTAGRAM_HOST = "instagram-scraper-api2.p.rapidapi.com";
const TIKTOK_HOST = "tiktok-scraper7.p.rapidapi.com";

// Instagram API Response Types
interface InstagramUser {
  username?: string;
  full_name?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
}

// TikTok API Response Types
interface TikTokUser {
  username?: string;
  nickname?: string;
  avatar?: string;
  verified?: boolean;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("query") || searchParams.get("q");
  const platform = searchParams.get("platform") as "instagram" | "tiktok" | null;

  // Return empty array if query is too short
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ users: [] });
  }

  // Validate platform
  if (!platform || !["instagram", "tiktok"].includes(platform)) {
    return NextResponse.json({ users: [] });
  }

  // Check if API key is configured
  if (!RAPIDAPI_KEY) {
    console.error("RAPIDAPI_KEY is not configured in environment variables");
    return NextResponse.json({ users: [] });
  }

  try {
    let users: UnifiedUser[] = [];

    if (platform === "instagram") {
      // Instagram Search via RapidAPI
      const instagramUrl = `https://${INSTAGRAM_HOST}/v1.2/users/search?q=${encodeURIComponent(q)}`;
      
      const response = await fetch(instagramUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": INSTAGRAM_HOST,
        },
      });

      if (!response.ok) {
        console.error(`Instagram API error: ${response.status} ${response.statusText}`);
        return NextResponse.json({ users: [] });
      }

      const data = await response.json();
      
      // Transform Instagram response to unified format
      if (data && Array.isArray(data.users)) {
        users = data.users.map((user: InstagramUser) => ({
          username: user.username || "",
          full_name: user.full_name || user.username || "",
          avatar_url: user.profile_pic_url || "",
          is_verified: user.is_verified || false,
        }));
      } else if (data && Array.isArray(data)) {
        users = data.map((user: InstagramUser) => ({
          username: user.username || "",
          full_name: user.full_name || user.username || "",
          avatar_url: user.profile_pic_url || "",
          is_verified: user.is_verified || false,
        }));
      }
    } else if (platform === "tiktok") {
      // TikTok Search via RapidAPI
      const tiktokUrl = `https://${TIKTOK_HOST}/users/search?term=${encodeURIComponent(q)}`;
      
      const response = await fetch(tiktokUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": TIKTOK_HOST,
        },
      });

      if (!response.ok) {
        console.error(`TikTok API error: ${response.status} ${response.statusText}`);
        return NextResponse.json({ users: [] });
      }

      const data = await response.json();
      
      // Transform TikTok response to unified format
      if (data && Array.isArray(data.users)) {
        users = data.users.map((user: TikTokUser) => ({
          username: user.username || "",
          full_name: user.nickname || user.username || "",
          avatar_url: user.avatar || "",
          is_verified: user.verified || false,
        }));
      } else if (data && data.data && Array.isArray(data.data.user_list)) {
        users = data.data.user_list.map((user: TikTokUser) => ({
          username: user.username || "",
          full_name: user.nickname || user.username || "",
          avatar_url: user.avatar || "",
          is_verified: user.verified || false,
        }));
      }
    }

    return NextResponse.json({ users });
  } catch (error) {
    // Log error but don't crash - return empty array
    console.error("Error fetching user search results:", error);
    return NextResponse.json({ users: [] });
  }
}
