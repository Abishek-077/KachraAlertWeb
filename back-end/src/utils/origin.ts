import { env } from "../config/env.js";

const allowedOrigins = new Set(env.frontendUrls);
const vercelPreviewDomainPattern = /(?:^|\.)vercel\.app$/i;

export function isAllowedCorsOrigin(origin?: string) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = origin.trim().replace(/\/+$/, "");
  if (allowedOrigins.has(normalizedOrigin)) {
    return true;
  }

  if (!env.allowVercelPreviewOrigins) {
    return false;
  }

  try {
    const url = new URL(normalizedOrigin);
    if (url.protocol !== "https:") {
      return false;
    }
    return vercelPreviewDomainPattern.test(url.hostname);
  } catch {
    return false;
  }
}
