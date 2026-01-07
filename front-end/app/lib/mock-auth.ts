export type MockRole = "resident" | "admin_driver";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: MockRole;
};

const KEY = "kachra_user";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function mockLogin(email: string, password: string): MockUser {
  if (!email) throw new Error("Email is required");
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const role: MockRole = email.toLowerCase().includes("admin")
    ? "admin_driver"
    : "resident";

  const user: MockUser = {
    id: uid(),
    name: role === "admin_driver" ? "Admin/Driver" : "Resident",
    email,
    role,
  };

  localStorage.setItem(KEY, JSON.stringify(user));
  try {
    window.localStorage.setItem("kachraalert_role", role === "admin_driver" ? "admin" : "resident");
  } catch {
    // ignore
  }
  return user;
}

export function mockRegister(payload: any): MockUser {
  const role: MockRole = (payload?.accountType as MockRole) ?? "resident";

  const user: MockUser = {
    id: uid(),
    name: payload?.name || (role === "admin_driver" ? "Admin/Driver" : "Resident"),
    email: payload?.email || "user@example.com",
    role,
  };

  localStorage.setItem(KEY, JSON.stringify(user));
  localStorage.setItem("kachra_profile", JSON.stringify(payload ?? {}));

  try {
    window.localStorage.setItem("kachraalert_role", role === "admin_driver" ? "admin" : "resident");
  } catch {
    // ignore
  }

  return user;
}

export function getMockUser(): MockUser | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

export function mockLogout() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return !!getMockUser();
}
