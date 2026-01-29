/**
 * Security utilities for API endpoints
 */

// Private IP ranges that should be blocked for SSRF protection
const PRIVATE_IP_RANGES = [
  // IPv4 private ranges
  /^127\./, // Loopback
  /^10\./, // Class A private
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private
  /^192\.168\./, // Class C private
  /^169\.254\./, // Link-local
  /^0\./, // Current network
  // IPv6 patterns
  /^::1$/, // Loopback
  /^fe80:/i, // Link-local
  /^fc00:/i, // Unique local
  /^fd[0-9a-f]{2}:/i, // Unique local
];

// Cloud metadata endpoints that should be blocked
const BLOCKED_HOSTS = [
  "169.254.169.254", // AWS/GCP/Azure metadata
  "metadata.google.internal", // GCP
  "metadata.goog", // GCP
  "100.100.100.200", // Alibaba Cloud
  "169.254.170.2", // AWS ECS task metadata
];

// Blocked protocols
const BLOCKED_PROTOCOLS = ["file:", "ftp:", "gopher:", "data:", "javascript:"];

/**
 * Validates a URL to prevent SSRF attacks
 * @param url - The URL to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validateUrlForSSRF(url: string): {
  isValid: boolean;
  error?: string;
} {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return { isValid: false, error: "Invalid URL format" };
  }

  // Check protocol
  if (BLOCKED_PROTOCOLS.includes(parsedUrl.protocol)) {
    return { isValid: false, error: "Protocol not allowed" };
  }

  // Only allow HTTP and HTTPS
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return { isValid: false, error: "Only HTTP and HTTPS protocols are allowed" };
  }

  // Check for blocked hosts
  const hostname = parsedUrl.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    return { isValid: false, error: "Access to this host is not allowed" };
  }

  // Check for private IP ranges
  for (const pattern of PRIVATE_IP_RANGES) {
    if (pattern.test(hostname)) {
      return { isValid: false, error: "Access to private IP ranges is not allowed" };
    }
  }

  // Check for localhost variants
  if (
    hostname === "localhost" ||
    hostname === "localhost.localdomain" ||
    hostname.endsWith(".localhost")
  ) {
    return { isValid: false, error: "Access to localhost is not allowed" };
  }

  // Check for IP address in decimal format (e.g., 2130706433 = 127.0.0.1)
  if (/^\d+$/.test(hostname)) {
    return { isValid: false, error: "Decimal IP addresses are not allowed" };
  }

  // Check for IPv6 addresses
  if (hostname.startsWith("[") && hostname.endsWith("]")) {
    const ipv6 = hostname.slice(1, -1);
    for (const pattern of PRIVATE_IP_RANGES) {
      if (pattern.test(ipv6)) {
        return { isValid: false, error: "Access to private IPv6 ranges is not allowed" };
      }
    }
  }

  return { isValid: true };
}

// Rate limiting storage (in-memory, per-instance)
// In production, use Redis or similar for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

/**
 * Simple in-memory rate limiter
 * @param key - Unique identifier (e.g., IP address or API key)
 * @param config - Rate limit configuration
 * @returns Object with allowed boolean and optional retryAfter in seconds
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!record || record.resetTime < now) {
    // Start new window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true };
  }

  if (record.count >= config.maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

// Default rate limit configurations
export const RATE_LIMITS = {
  // 10 requests per minute for preview endpoint
  preview: { windowMs: 60 * 1000, maxRequests: 10 },
  // 5 requests per minute for link creation
  create: { windowMs: 60 * 1000, maxRequests: 5 },
} as const;

/**
 * Sanitizes a string for safe use in YAML frontmatter
 * Escapes special characters that could break YAML parsing or inject content
 */
export function sanitizeForYaml(value: string): string {
  // Replace characters that could break YAML or inject content
  return value
    .replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/\n/g, "\\n") // Escape newlines
    .replace(/\r/g, "\\r") // Escape carriage returns
    .replace(/\t/g, "\\t") // Escape tabs
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f]/g, ""); // Remove other control characters
}

// Maximum allowed image size in bytes (5MB)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Request timeout in milliseconds (10 seconds)
export const REQUEST_TIMEOUT = 10 * 1000;

/**
 * Validates API key from either Authorization header or HTTP-only cookie
 * Supports both methods for backwards compatibility during transition
 */
export function isValidApiKeyFromRequest(request: {
  headers: { get: (name: string) => string | null };
  cookies: { get: (name: string) => { value: string } | undefined };
}): boolean {
  const apiKey = process.env.LINKS_API_KEY;
  if (!apiKey) return false;

  // Check Authorization header first (Bearer token)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7) === apiKey;
  }

  // Fall back to HTTP-only cookie
  const authCookie = request.cookies.get("links_auth");
  if (authCookie?.value) {
    return authCookie.value === apiKey;
  }

  return false;
}
