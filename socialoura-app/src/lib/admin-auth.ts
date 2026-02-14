import { AdminToken } from "@/types/admin";

const TOKEN_KEY = "adminToken";

export function encodeToken(token: AdminToken): string {
  return btoa(JSON.stringify(token));
}

export function decodeToken(encodedToken: string): AdminToken | null {
  try {
    return JSON.parse(atob(encodedToken));
  } catch {
    return null;
  }
}

export function saveToken(token: AdminToken): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, encodeToken(token));
  }
}

export function getToken(): AdminToken | null {
  if (typeof window === "undefined") return null;
  const encoded = localStorage.getItem(TOKEN_KEY);
  if (!encoded) return null;
  return decodeToken(encoded);
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isTokenValid(token: AdminToken | null): boolean {
  if (!token) return false;
  if (token.role !== "admin") return false;
  if (Date.now() > token.exp) return false;
  return true;
}

export function createToken(username: string): AdminToken {
  return {
    username,
    role: "admin",
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
}

export function verifyAuthHeader(authHeader: string | null): AdminToken | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  const decoded = decodeToken(token);
  if (!isTokenValid(decoded)) {
    return null;
  }
  return decoded;
}
