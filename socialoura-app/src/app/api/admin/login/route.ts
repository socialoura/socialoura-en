import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/admin-storage";
import { createToken, encodeToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const isValid = adminStorage.validateCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = createToken(username);
    const encodedToken = encodeToken(token);

    return NextResponse.json({
      success: true,
      token: encodedToken,
      username: token.username,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
