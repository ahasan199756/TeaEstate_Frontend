// src/admin/settings/store.js
const CONFIG_KEY = "siteConfig_v1";
const USERS_KEY = "adminUsers_v1";

export const defaultConfig = {
  store: {
    storeName: "Tea Estate Premium",
    supportEmail: "hello@teaestate.com",
    phone: "+88 017 000 00 00",
    currency: "BDT",
  },
  shipping: {
    insideDhakaDays: 3,
    outsideDhakaMaxDays: 7,
    flatFee: 50,
    freeShippingOver: 2000,
  },
  payments: {
    cod: { enabled: true, note: "Pay on delivery available nationwide." },

    bkash: {
      enabled: true,
      merchantNumber: "01XXXXXXXXX",
      merchantType: "Personal",
      instructions: "Send money then add transaction ID at checkout.",
    },

    nagad: {
      enabled: false,
      merchantNumber: "01XXXXXXXXX",
      instructions: "Send money then add transaction ID at checkout.",
    },

    stripe: {
      enabled: false,
      publishableKey: "",
      webhookSecret: "",
      note: "Card payments via Stripe.",
    },
  },
  security: {
    requireStrongPassword: true,
    sessionTimeoutMins: 60,
    twoFactor: false,
  },
};

export const defaultUsers = [
  {
    id: "u1",
    name: "Estate Manager",
    email: "admin@teaestate.com",
    role: "admin", // admin | manager | staff | viewer
    status: "active", // active | disabled
  },
  {
    id: "u2",
    name: "Operations",
    email: "ops@teaestate.com",
    role: "manager",
    status: "active",
  },
];

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(next) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
  return next;
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return defaultUsers;
    return JSON.parse(raw);
  } catch {
    return defaultUsers;
  }
}

export function saveUsers(next) {
  localStorage.setItem(USERS_KEY, JSON.stringify(next));
  return next;
}

// simple role permissions
export const can = (role, action) => {
  const map = {
    admin: [
      "users:edit",
      "payments:edit",
      "shipping:edit",
      "security:edit",
      "profile:edit",
    ],
    manager: ["users:edit", "payments:edit", "shipping:edit", "profile:edit"],
    staff: ["profile:edit"],
    viewer: [],
  };
  return (map[role] || []).includes(action);
};
