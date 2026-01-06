/**
 * API Error Response Type
 * Represents the structure of error responses from API endpoints
 */
export interface ApiErrorInfo {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

/**
 * Custom error class for fetch operations
 * Extends Error with HTTP status and additional info
 */
export class FetchError extends Error {
  status?: number;
  info?: ApiErrorInfo | null;

  constructor(message: string, status?: number, info?: ApiErrorInfo | null) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

/**
 * Type-safe fetch wrapper with error handling
 * Automatically adds JSON headers and parses responses
 */
export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const info = await res.json().catch(() => null);
    throw new FetchError(
      `API error: ${res.status} ${res.statusText}`,
      res.status,
      info
    );
  }

  return res.json();
}

/**
 * Query parameter value types
 */
type QueryParamValue = string | number | boolean | undefined | null;

/**
 * Builds a URL query string from an object of parameters
 * Filters out undefined and null values
 */
export function buildQueryString(
  params: Record<string, QueryParamValue>
): string {
  const filtered = Object.entries(params).filter(
    ([_key, value]: [string, QueryParamValue]) =>
      value !== undefined && value !== null
  );

  if (filtered.length === 0) return "";

  const queryParams = new URLSearchParams(
    filtered.map(([key, value]) => [key, String(value)])
  );

  return "?" + queryParams.toString();
}
