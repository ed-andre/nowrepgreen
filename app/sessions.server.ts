import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

// Use environment variable for session secret or fallback to a dev-only secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && isProduction) {
  throw new Error(
    "SESSION_SECRET environment variable is required in production",
  );
}

// Get domain from environment variable if set
const domain = process.env.DOMAIN || undefined;

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [sessionSecret || "s3cr3t-dev-only"],
    // Set domain and secure only if in production
    ...(isProduction ? { domain, secure: true } : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
