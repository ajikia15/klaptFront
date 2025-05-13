import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { setToken } from "../services/authService";
import { LoaderFnContext } from "@tanstack/react-router";

// TanStack loader-based Google OAuth handler
export async function googleAuthHandlerLoader(
  ctx: LoaderFnContext<any, any, any, any, any, any, any>
) {
  // ctx.location is a ParsedLocation
  const params = new URLSearchParams(ctx.location.search);
  let token = params.get("token");
  let userJson = params.get("user");

  // Debug what we're receiving
  console.log("Received token:", token);
  console.log("Received user (raw):", userJson);

  let user;

  if (!token) {
    // If not in query, try to fetch from backend (if backend just returns JSON)
    const res = await fetch(window.location.href, { credentials: "include" });
    const data = await res.json();
    token = data.token;
    user = data.user;
  } else {
    try {
      // Try parsing without decoding first
      user = userJson ? JSON.parse(userJson) : undefined;
      console.log("Parsed user:", user);
    } catch (e) {
      console.error("Error parsing user JSON:", e);

      try {
        // If that fails, try with decoding
        user = userJson ? JSON.parse(decodeURIComponent(userJson)) : undefined;
        console.log("Parsed user after decodeURIComponent:", user);
      } catch (e2) {
        console.error("Error parsing decoded user JSON:", e2);
        // Last resort - just use the raw string
        user = userJson;
      }
    }
  }

  if (token) {
    setToken(token);
    return { token, user };
  } else {
    throw new Error("No token returned from Google login");
  }
}

export default function GoogleAuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // After loader runs, redirect to home
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-900">
      <div className="text-2xl text-primary-400">
        Signing you in with Google...
      </div>
    </div>
  );
}
