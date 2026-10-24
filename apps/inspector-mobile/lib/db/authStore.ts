const CURRENT_USER_KEY = "oniongrade_current_user";

export function loginUser(username: string): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(
    CURRENT_USER_KEY,
    username.trim()
  );
}

export function getCurrentUser(): string | null {
  try {
    if (typeof localStorage === "undefined") {
      return null;
    }

    return localStorage.getItem(CURRENT_USER_KEY);
  } catch (error) {
    console.log("Could not get current user:", error);
    return null;
  }
}

export function logoutUser(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.log("Could not logout:", error);
  }
}

export function getUserStorageKey(): string {
  const user = getCurrentUser();

  if (!user) {
    return "oniongrade_inspections_guest";
  }

  return `oniongrade_inspections_${user}`;
}