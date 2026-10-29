
const API_URL = "https://college-help-desk-backend-xkk2.onrender.com/api/auth";

async function authRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Authentication request failed.");
  }

  return data;
}

export const authApi = {
  register: (body) =>
    authRequest("/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    authRequest("/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => authRequest("/me"),

  logout: () =>
    authRequest("/logout", {
      method: "POST",
    }),
};
