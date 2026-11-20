import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  // Get JWT token from Better Auth
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  // Prepare headers
  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Send API request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "API request failed"
    );
  }

  return result;
}