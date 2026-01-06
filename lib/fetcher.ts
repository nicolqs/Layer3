export class FetchError extends Error {
  status?: number;
  info?: any;

  constructor(message: string, status?: number, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

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

export function buildQueryString(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(
    ([_, value]) => value !== undefined && value !== null
  );
  if (filtered.length === 0) return "";
  return "?" + new URLSearchParams(filtered as any).toString();
}
