export const AUTH_STORAGE_KEY = "hssabna-admin-auth";
export const AUTH_EXPIRED_EVENT = "hssabna-admin-auth-expired";

type PersistedAuthState = {
  state?: {
    token?: string | null;
  };
};

export function readPersistedAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawAuth) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawAuth) as PersistedAuthState;
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}

export function clearPersistedAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function notifyAuthExpired() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}
