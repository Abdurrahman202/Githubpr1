export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("taskflow_token");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem("taskflow_user") || "null"); }
  catch { return null; }
}

export function storeSession({ token, user }) {
  localStorage.setItem("taskflow_token", token);
  localStorage.setItem("taskflow_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("taskflow_token");
  localStorage.removeItem("taskflow_user");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}
