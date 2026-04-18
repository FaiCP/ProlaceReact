import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

async function fetchCsrfToken(): Promise<string> {
  const { data } = await api.get<{ csrfToken: string }>("/auth/csrf");
  csrfToken = data.csrfToken;
  return csrfToken;
}

// Attach CSRF token to all mutating requests
api.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();
  if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (!csrfToken) await fetchCsrfToken();
    config.headers["x-csrf-token"] = csrfToken!;
  }
  return config;
});

// If CSRF token expired or missing, refresh and retry once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const code = error.response?.data?.code;
    if ((code === "csrf_invalid" || code === "csrf_missing") && !error.config._csrfRetried) {
      error.config._csrfRetried = true;
      csrfToken = null;
      await fetchCsrfToken();
      error.config.headers["x-csrf-token"] = csrfToken!;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
