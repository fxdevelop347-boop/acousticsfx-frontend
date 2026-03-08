/**
 * API client configuration
 * This is a base setup for API calls using fetch
 * You can extend this with React Query hooks in the api folder
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.themoonlit.in";

export interface ApiError {
  message: string;
  status?: number;
}

export class ApiClientError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, use status text
      errorData = { message: response.statusText || 'Request failed' };
    }
    throw new ApiClientError(
      errorData.message || errorData.error || response.statusText || 'Request failed',
      response.status
    );
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch (error) {
    // If JSON parsing fails, return empty object
    console.warn('Failed to parse JSON response:', error);
    return {} as T;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error) {
    // If it's already an ApiClientError, re-throw it
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Handle network errors (fetch failures)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      // This usually means CORS, network issue, or server not reachable
      throw new ApiClientError(
        `Network error: Unable to reach the server. Please check your connection or try again later.`,
        0 // Status 0 indicates network error
      );
    }
    
    // Handle other errors
    throw new ApiClientError(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
